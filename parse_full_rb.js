const fs = require('fs');

const raw = fs.readFileSync('chunk_5_clean.txt', 'utf8');

// Find topics array or parse JSON payload structure
// In chunk_5_clean.txt, topics structure starts with topic_0001
// Let's locate the full topics array or object structure.

// We can find where the topics structure starts.
const startIndex = raw.indexOf('[{"id":"topic_0001"');
console.log('Start index of topic_0001:', startIndex);

if (startIndex !== -1) {
  // Let's extract valid JSON by balancing brackets
  let bracketCount = 0;
  let endIndex = -1;
  for (let i = startIndex; i < raw.length; i++) {
    if (raw[i] === '[') bracketCount++;
    else if (raw[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  console.log('End index of topics array:', endIndex);
  if (endIndex !== -1) {
    const jsonStr = raw.substring(startIndex, endIndex);
    try {
      const topicsData = JSON.parse(jsonStr);
      console.log('Successfully parsed topics array! Count:', topicsData.length);
      
      let totalProblemsCount = 0;
      const parsedTopics = [];

      topicsData.forEach(topic => {
        let topicProblemsCount = 0;
        const subtopics = (topic.subtopics || []).map(sub => {
          const problems = (sub.problems || []).map(p => {
            topicProblemsCount++;
            totalProblemsCount++;
            return {
              id: p.id,
              title: p.title,
              difficulty: p.difficulty || 'Medium',
              leetcodeUrl: p.leetcodeUrl || null,
              youtubeUrl: p.youtubeUrl || null,
              practiceUrl: p.practiceUrl || null,
              companies: p.companies || []
            };
          });
          return {
            id: sub.id,
            title: sub.title,
            description: sub.description,
            problemCount: problems.length,
            problems: problems
          };
        });

        parsedTopics.push({
          id: topic.id,
          title: topic.title,
          description: topic.description,
          subtopicCount: subtopics.length,
          subtopics: subtopics
        });
      });

      console.log(`Extracted total ${totalProblemsCount} problem slots across ${parsedTopics.length} topics.`);

      if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
      }

      fs.writeFileSync('data/risingbrain_raw.json', JSON.stringify(parsedTopics, null, 2));
      console.log('Saved to data/risingbrain_raw.json');
    } catch (err) {
      console.error('Failed to parse json substring:', err.message);
    }
  }
} else {
  console.error('Could not find topic_0001 start index!');
}
