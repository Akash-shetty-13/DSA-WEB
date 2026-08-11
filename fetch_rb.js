const fs = require('fs');

async function fetchRisingBrain() {
  try {
    const res = await fetch('https://www.risingbrain.org/sheet');
    const html = await res.text();
    console.log('Fetched HTML, length:', html.length);
    fs.writeFileSync('page.html', html);

    // Look for next data or RSC (React Server Component) payloads
    const selfNextF = [];
    const regex = /self\.__next_f\.push\(([\s\S]*?)\)<\/script>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      selfNextF.push(match[1]);
    }
    console.log('Found self.__next_f pushes:', selfNextF.length);
    fs.writeFileSync('next_f.txt', selfNextF.join('\n---\n'));

    // Search for problem objects in html
    const problemRegex = /"title":"([^"]+)".*?"leetcodeUrl":"([^"]+)"/g;
    let pMatch;
    const found = [];
    while ((pMatch = problemRegex.exec(html)) !== null) {
      found.push({ title: pMatch[1], url: pMatch[2] });
    }
    console.log('Direct problem regex matches:', found.length);
  } catch (err) {
    console.error('Error fetching:', err);
  }
}

fetchRisingBrain();
