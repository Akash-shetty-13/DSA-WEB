const fs = require('fs');

const chunk = fs.readFileSync('chunk_5.txt', 'utf8');

// Unescape Next.js payload string
let text = chunk;
try {
  // It's usually self.__next_f.push([1,"..."])
  const arrayStr = chunk.slice(0, chunk.lastIndexOf(')')).trim();
  text = JSON.parse(arrayStr)[1];
} catch (e) {
  console.log('JSON parse array failed, using raw string searching:', e.message);
}

fs.writeFileSync('chunk_5_clean.txt', text);

// Search for patterns, subtopics, problems, titles, links, difficulties
// Let's write a parser to extract all JSON or structural elements
console.log('Clean text length:', text.length);

// Let's look for LeetCode links or problem names
const lcMatches = text.match(/https:\/\/(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+\/?/g);
console.log('Found LeetCode URLs:', lcMatches ? lcMatches.length : 0);
if (lcMatches) {
  console.log('Sample LeetCode URLs:', [...new Set(lcMatches)].slice(0, 10));
}

// Let's search for JSON-like properties: title, difficulty, subtopic, topic, problemId, etc.
const titles = text.match(/"title":"([^"]+)"/g);
console.log('Total title matches:', titles ? titles.length : 0);

// Let's print out distinct titles or data structures found
const matches = [];
const regex = /{"id":"[^"]+","title":"([^"]+)"[^\}]*}/g;
let m;
while ((m = regex.exec(text)) !== null) {
  matches.push(m[0]);
}
console.log('Found problem JSON blocks:', matches.length);
if (matches.length > 0) {
  console.log('Sample match:', matches[0]);
}
