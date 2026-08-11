const fs = require('fs');

const html = fs.readFileSync('page.html', 'utf8');

// Find all JSON strings or script contents
const scripts = html.match(/<script[\s\S]*?<\/script>/g) || [];
console.log('Total scripts found:', scripts.length);

scripts.forEach((s, idx) => {
  if (s.includes('topic') || s.includes('problem') || s.includes('LeetCode') || s.includes('Array')) {
    console.log(`Script ${idx} has keywords! Length: ${s.length}`);
    fs.writeFileSync(`script_${idx}.txt`, s);
  }
});

// Search for any JSON objects containing problem titles or URLs
const chunks = html.split('self.__next_f.push(');
console.log('Next f chunks:', chunks.length);

chunks.forEach((chunk, i) => {
  if (chunk.includes('Two-Pointer') || chunk.includes('Binary Search') || chunk.includes('LeetCode') || chunk.includes('leetcode')) {
    console.log(`Chunk ${i} mentions keywords. Length: ${chunk.length}`);
    fs.writeFileSync(`chunk_${i}.txt`, chunk);
  }
});
