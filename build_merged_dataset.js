const fs = require('fs');

const customRaw = [
  { id: 1, title: "Valid Palindrome", pattern: "Two Pointers", difficulty: "Easy" },
  { id: 2, title: "Remove Element", pattern: "Two Pointers", difficulty: "Easy" },
  { id: 3, title: "Remove Duplicates from Sorted Array", pattern: "Two Pointers", difficulty: "Easy" },
  { id: 4, title: "Move Zeroes", pattern: "Two Pointers", difficulty: "Easy" },
  { id: 5, title: "Two Sum II", pattern: "Two Pointers", difficulty: "Medium" },
  { id: 6, title: "Squares of a Sorted Array", pattern: "Two Pointers", difficulty: "Easy" },
  { id: 7, title: "Sort Colors", pattern: "Two Pointers", difficulty: "Medium" },
  { id: 8, title: "Container With Most Water", pattern: "Two Pointers", difficulty: "Medium" },
  { id: 9, title: "3Sum", pattern: "Two Pointers", difficulty: "Medium" },
  { id: 10, title: "Trapping Rain Water", pattern: "Two Pointers", difficulty: "Hard" },

  { id: 11, title: "Maximum Sum Subarray of Size K", pattern: "Sliding Window", difficulty: "Easy" },
  { id: 12, title: "Maximum Average Subarray I", pattern: "Sliding Window", difficulty: "Easy" },
  { id: 13, title: "Minimum Size Subarray Sum", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 14, title: "Max Consecutive Ones III", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 15, title: "Longest Substring Without Repeating Characters", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 16, title: "Longest Subarray With At Most K Distinct Elements", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 17, title: "Longest Repeating Character Replacement", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 18, title: "Permutation in String", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 19, title: "Find All Anagrams in a String", pattern: "Sliding Window", difficulty: "Medium" },
  { id: 20, title: "Minimum Window Substring", pattern: "Sliding Window", difficulty: "Hard" },

  { id: 21, title: "Running Sum of 1D Array", pattern: "Prefix Sum", difficulty: "Easy" },
  { id: 22, title: "Find Pivot Index", pattern: "Prefix Sum", difficulty: "Easy" },
  { id: 23, title: "Find the Highest Altitude", pattern: "Prefix Sum", difficulty: "Easy" },
  { id: 24, title: "Range Sum Query", pattern: "Prefix Sum", difficulty: "Easy" },
  { id: 25, title: "Maximum Size Subarray Sum Equals K", pattern: "Prefix Sum", difficulty: "Medium" },
  { id: 26, title: "Subarray Sum Equals K", pattern: "Prefix Sum", difficulty: "Medium" },
  { id: 27, title: "Continuous Subarray Sum", pattern: "Prefix Sum", difficulty: "Medium" },
  { id: 28, title: "Contiguous Array", pattern: "Prefix Sum", difficulty: "Medium" },
  { id: 29, title: "Subarray Sums Divisible by K", pattern: "Prefix Sum", difficulty: "Medium" },
  { id: 30, title: "Product of Array Except Self", pattern: "Prefix Sum", difficulty: "Medium" },

  { id: 31, title: "Contains Duplicate", pattern: "Hashing", difficulty: "Easy" },
  { id: 32, title: "Two Sum", pattern: "Hashing", difficulty: "Easy" },
  { id: 33, title: "Valid Anagram", pattern: "Hashing", difficulty: "Easy" },
  { id: 34, title: "Intersection of Two Arrays", pattern: "Hashing", difficulty: "Easy" },
  { id: 35, title: "Intersection of Two Arrays II", pattern: "Hashing", difficulty: "Easy" },
  { id: 36, title: "Majority Element", pattern: "Hashing", difficulty: "Easy" },
  { id: 37, title: "Group Anagrams", pattern: "Hashing", difficulty: "Medium" },
  { id: 38, title: "Top K Frequent Elements", pattern: "Hashing", difficulty: "Medium" },
  { id: 39, title: "Longest Consecutive Sequence", pattern: "Hashing", difficulty: "Medium" },
  { id: 40, title: "First Unique Character in a String", pattern: "Hashing", difficulty: "Easy" },

  { id: 41, title: "Binary Search", pattern: "Binary Search", difficulty: "Easy" },
  { id: 42, title: "Search Insert Position", pattern: "Binary Search", difficulty: "Easy" },
  { id: 43, title: "Search a 2D Matrix", pattern: "Binary Search", difficulty: "Medium" },
  { id: 44, title: "Koko Eating Bananas", pattern: "Binary Search", difficulty: "Medium" },
  { id: 45, title: "Find Minimum in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium" },
  { id: 46, title: "Search in Rotated Sorted Array", pattern: "Binary Search", difficulty: "Medium" },
  { id: 47, title: "Time Based Key-Value Store", pattern: "Binary Search", difficulty: "Medium" },
  { id: 48, title: "Median of Two Sorted Arrays", pattern: "Binary Search", difficulty: "Hard" },

  { id: 49, title: "Valid Parentheses", pattern: "Stack", difficulty: "Easy" },
  { id: 50, title: "Min Stack", pattern: "Stack", difficulty: "Medium" },
  { id: 51, title: "Evaluate Reverse Polish Notation", pattern: "Stack", difficulty: "Medium" },
  { id: 52, title: "Generate Parentheses", pattern: "Stack", difficulty: "Medium" },
  { id: 53, title: "Daily Temperatures", pattern: "Stack", difficulty: "Medium" },
  { id: 54, title: "Car Fleet", pattern: "Stack", difficulty: "Medium" },
  { id: 55, title: "Largest Rectangle in Histogram", pattern: "Stack", difficulty: "Hard" },

  { id: 56, title: "Reverse Linked List", pattern: "Linked List", difficulty: "Easy" },
  { id: 57, title: "Merge Two Sorted Lists", pattern: "Linked List", difficulty: "Easy" },
  { id: 58, title: "Linked List Cycle", pattern: "Linked List", difficulty: "Easy" },
  { id: 59, title: "Reorder List", pattern: "Linked List", difficulty: "Medium" },
  { id: 60, title: "Remove Nth Node From End of List", pattern: "Linked List", difficulty: "Medium" },
  { id: 61, title: "Copy List With Random Pointer", pattern: "Linked List", difficulty: "Medium" },
  { id: 62, title: "Add Two Numbers", pattern: "Linked List", difficulty: "Medium" },
  { id: 63, title: "Find the Duplicate Number", pattern: "Linked List", difficulty: "Medium" },
  { id: 64, title: "LRU Cache", pattern: "Linked List", difficulty: "Medium" },
  { id: 65, title: "Merge K Sorted Lists", pattern: "Linked List", difficulty: "Hard" },

  { id: 66, title: "Maximum Depth of Binary Tree", pattern: "Trees", difficulty: "Easy" },
  { id: 67, title: "Same Tree", pattern: "Trees", difficulty: "Easy" },
  { id: 68, title: "Invert Binary Tree", pattern: "Trees", difficulty: "Easy" },
  { id: 69, title: "Binary Tree Level Order Traversal", pattern: "Trees", difficulty: "Medium" },
  { id: 70, title: "Diameter of Binary Tree", pattern: "Trees", difficulty: "Easy" },
  { id: 71, title: "Balanced Binary Tree", pattern: "Trees", difficulty: "Easy" },
  { id: 72, title: "Lowest Common Ancestor", pattern: "Trees", difficulty: "Medium" },
  { id: 73, title: "Binary Tree Right Side View", pattern: "Trees", difficulty: "Medium" },
  { id: 74, title: "Validate Binary Search Tree", pattern: "Trees", difficulty: "Medium" },
  { id: 75, title: "Kth Smallest Element in a BST", pattern: "Trees", difficulty: "Medium" },
  { id: 76, title: "Construct Binary Tree From Preorder and Inorder", pattern: "Trees", difficulty: "Medium" },

  { id: 77, title: "Kth Largest Element in an Array", pattern: "Heap", difficulty: "Medium" },
  { id: 78, title: "Last Stone Weight", pattern: "Heap", difficulty: "Easy" },
  { id: 79, title: "K Closest Points to Origin", pattern: "Heap", difficulty: "Medium" },
  { id: 80, title: "Kth Smallest Element in a Sorted Matrix", pattern: "Heap", difficulty: "Medium" },
  { id: 81, title: "Task Scheduler", pattern: "Heap", difficulty: "Medium" },
  { id: 82, title: "Find Median From Data Stream", pattern: "Heap", difficulty: "Hard" },

  { id: 83, title: "Maximum Subarray", pattern: "Greedy", difficulty: "Medium" },
  { id: 84, title: "Jump Game", pattern: "Greedy", difficulty: "Medium" },
  { id: 85, title: "Jump Game II", pattern: "Greedy", difficulty: "Medium" },
  { id: 86, title: "Gas Station", pattern: "Greedy", difficulty: "Medium" },
  { id: 87, title: "Best Time to Buy and Sell Stock", pattern: "Greedy", difficulty: "Easy" },
  { id: 88, title: "Hand of Straights", pattern: "Greedy", difficulty: "Medium" },
  { id: 89, title: "Partition Labels", pattern: "Greedy", difficulty: "Medium" },
  { id: 90, title: "Merge Triplets to Form Target Triplet", pattern: "Greedy", difficulty: "Medium" },
  { id: 91, title: "Non-overlapping Intervals", pattern: "Greedy", difficulty: "Medium" },
  { id: 92, title: "Minimum Number of Arrows to Burst Balloons", pattern: "Greedy", difficulty: "Medium" },

  { id: 93, title: "Subsets", pattern: "Backtracking", difficulty: "Medium" },
  { id: 94, title: "Combination Sum", pattern: "Backtracking", difficulty: "Medium" },
  { id: 95, title: "Permutations", pattern: "Backtracking", difficulty: "Medium" },
  { id: 96, title: "Subsets II", pattern: "Backtracking", difficulty: "Medium" },
  { id: 97, title: "Combination Sum II", pattern: "Backtracking", difficulty: "Medium" },
  { id: 98, title: "Word Search", pattern: "Backtracking", difficulty: "Medium" },
  { id: 99, title: "Palindrome Partitioning", pattern: "Backtracking", difficulty: "Medium" },
  { id: 100, title: "Letter Combinations of a Phone Number", pattern: "Backtracking", difficulty: "Medium" },
  { id: 101, title: "N-Queens", pattern: "Backtracking", difficulty: "Hard" },

  { id: 102, title: "Number of Islands", pattern: "Graphs", difficulty: "Medium" },
  { id: 103, title: "Clone Graph", pattern: "Graphs", difficulty: "Medium" },
  { id: 104, title: "Max Area of Island", pattern: "Graphs", difficulty: "Medium" },
  { id: 105, title: "Pacific Atlantic Water Flow", pattern: "Graphs", difficulty: "Medium" },
  { id: 106, title: "Surrounded Regions", pattern: "Graphs", difficulty: "Medium" },
  { id: 107, title: "Rotting Oranges", pattern: "Graphs", difficulty: "Medium" },
  { id: 108, title: "Course Schedule", pattern: "Graphs", difficulty: "Medium" },
  { id: 109, title: "Course Schedule II", pattern: "Graphs", difficulty: "Medium" },
  { id: 110, title: "Graph Valid Tree", pattern: "Graphs", difficulty: "Medium" },
  { id: 111, title: "Number of Connected Components", pattern: "Graphs", difficulty: "Medium" },

  { id: 112, title: "Climbing Stairs", pattern: "Dynamic Programming", difficulty: "Easy" },
  { id: 113, title: "Min Cost Climbing Stairs", pattern: "Dynamic Programming", difficulty: "Easy" },
  { id: 114, title: "House Robber", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 115, title: "House Robber II", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 116, title: "Longest Palindromic Substring", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 117, title: "Palindromic Substrings", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 118, title: "Decode Ways", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 119, title: "Coin Change", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 120, title: "Maximum Product Subarray", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 121, title: "Word Break", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 122, title: "Longest Increasing Subsequence", pattern: "Dynamic Programming", difficulty: "Medium" },
  { id: 123, title: "Partition Equal Subset Sum", pattern: "Dynamic Programming", difficulty: "Medium" },

  { id: 124, title: "Merge Intervals", pattern: "Intervals", difficulty: "Medium" },
  { id: 125, title: "Insert Interval", pattern: "Intervals", difficulty: "Medium" },
  { id: 126, title: "Non-overlapping Intervals", pattern: "Intervals", difficulty: "Medium" },
  { id: 127, title: "Meeting Rooms", pattern: "Intervals", difficulty: "Easy" },
  { id: 128, title: "Meeting Rooms II", pattern: "Intervals", difficulty: "Medium" },
  { id: 129, title: "Minimum Number of Arrows to Burst Balloons", pattern: "Intervals", difficulty: "Medium" },

  { id: 130, title: "Single Number", pattern: "Bit Manipulation", difficulty: "Easy" },
  { id: 131, title: "Number of 1 Bits", pattern: "Bit Manipulation", difficulty: "Easy" },
  { id: 132, title: "Counting Bits", pattern: "Bit Manipulation", difficulty: "Easy" },
  { id: 133, title: "Reverse Bits", pattern: "Bit Manipulation", difficulty: "Easy" },
  { id: 134, title: "Missing Number", pattern: "Bit Manipulation", difficulty: "Easy" },
  { id: 135, title: "Sum of Two Integers", pattern: "Bit Manipulation", difficulty: "Medium" },
  { id: 136, title: "Reverse Integer", pattern: "Bit Manipulation", difficulty: "Medium" },

  { id: 137, title: "Palindrome Number", pattern: "Math", difficulty: "Easy" },
  { id: 138, title: "Plus One", pattern: "Math", difficulty: "Easy" },
  { id: 139, title: "Happy Number", pattern: "Math", difficulty: "Easy" },
  { id: 140, title: "Pow(x, n)", pattern: "Math", difficulty: "Medium" },
  { id: 141, title: "4Sum", pattern: "Two Pointers", difficulty: "Medium" } // Added for completeness based on solved list
];

// Presolved titles as per prompt:
const preSolvedTitles = new Set([
  "Two Sum",
  "Container With Most Water",
  "Remove Duplicates from Sorted Array",
  "Remove Element",
  "Valid Palindrome",
  "Sort Colors",
  "Move Zeroes",
  "Jump Game",
  "Jump Game II",
  "Gas Station",
  "Product of Array Except Self",
  "Longest Consecutive Sequence",
  "Continuous Subarray Sum",
  "Subarray Sum Equals K",
  "Maximum Product Subarray",
  "Maximum Subarray",
  "3Sum",
  "4Sum"
]);

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/^[0-9]+[\.\-\s]+/, '') // strip leading numbers like 1. 
    .replace(/[^a-z0-9]/g, '');
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractLcSlug(url) {
  if (!url) return null;
  const match = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

// Load RisingBrain raw data
const rbTopics = JSON.parse(fs.readFileSync('data/risingbrain_raw.json', 'utf8'));

// Store canonical problems map key -> problem
const canonicalMap = new Map();

// Helper to register or merge problem
function addOrMergeProblem({ title, difficulty, leetcodeUrl, source, category, sub_pattern, primary_pattern, companies, youtubeUrl, practiceUrl }) {
  const normalized = normalizeTitle(title);
  const lcSlug = extractLcSlug(leetcodeUrl) || slugify(title);
  const key = lcSlug || normalized;

  if (canonicalMap.has(key)) {
    const existing = canonicalMap.get(key);
    if (!existing.sources.includes(source)) {
      existing.sources.push(source);
    }
    if (primary_pattern && !existing.secondary_patterns.includes(primary_pattern) && existing.primary_pattern !== primary_pattern) {
      existing.secondary_patterns.push(primary_pattern);
    }
    if (sub_pattern && existing.sub_pattern !== sub_pattern && !existing.secondary_patterns.includes(sub_pattern)) {
      existing.secondary_patterns.push(sub_pattern);
    }
    if (!existing.leetcode_url && leetcodeUrl) {
      existing.leetcode_url = leetcodeUrl;
      existing.url = leetcodeUrl;
    }
    if (difficulty && existing.difficulty === 'Unknown') {
      existing.difficulty = difficulty;
    }
    if (category && !existing.category) {
      existing.category = category;
    }
  } else {
    const lcMatchNum = title.match(/^[0-9]+/);
    const lcNum = lcMatchNum ? parseInt(lcMatchNum[0]) : null;
    const isSolved = preSolvedTitles.has(title) || preSolvedTitles.has(normalized);

    canonicalMap.set(key, {
      id: key,
      title: title,
      slug: lcSlug,
      leetcode_number: lcNum,
      url: leetcodeUrl || `https://leetcode.com/problems/${lcSlug}/`,
      leetcode_url: leetcodeUrl || `https://leetcode.com/problems/${lcSlug}/`,
      difficulty: difficulty || 'Medium',
      primary_pattern: primary_pattern || category || 'General',
      secondary_patterns: sub_pattern ? [sub_pattern] : [],
      category: category || primary_pattern || 'General',
      sub_pattern: sub_pattern || null,
      source: source,
      sources: [source],
      youtube_url: youtubeUrl || null,
      practice_url: practiceUrl || null,
      companies: companies || [],
      description: `Problem covering ${primary_pattern || category} - ${sub_pattern || 'general pattern'}`,
      tags: [primary_pattern, sub_pattern, category].filter(Boolean),
      is_solved: isSolved,
      status: isSolved ? 'Previously Solved' : 'Not Started',
      solved_date: isSolved ? new Date().toISOString() : null,
      attempts: isSolved ? 1 : 0,
      time_taken: isSolved ? 15 : 0,
      confidence: isSolved ? 4 : 0,
      needs_revision: false,
      notes: isSolved ? 'Solved previously.' : '',
      solution_notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
}

// 1. Ingest Custom 140 problems
customRaw.forEach(item => {
  addOrMergeProblem({
    title: item.title,
    difficulty: item.difficulty,
    source: 'custom',
    primary_pattern: item.pattern
  });
});

// 2. Ingest RisingBrain problems
rbTopics.forEach(topic => {
  topic.subtopics.forEach(sub => {
    sub.problems.forEach(p => {
      addOrMergeProblem({
        title: p.title,
        difficulty: p.difficulty,
        leetcodeUrl: p.leetcodeUrl,
        source: 'risingbrain',
        category: topic.title,
        sub_pattern: sub.title,
        primary_pattern: topic.title,
        companies: p.companies,
        youtubeUrl: p.youtubeUrl,
        practiceUrl: p.practiceUrl
      });
    });
  });
});

const mergedProblems = Array.from(canonicalMap.values());
console.log('Total merged canonical problems:', mergedProblems.length);

const customCount = mergedProblems.filter(p => p.sources.includes('custom')).length;
const rbCount = mergedProblems.filter(p => p.sources.includes('risingbrain')).length;
const bothCount = mergedProblems.filter(p => p.sources.includes('custom') && p.sources.includes('risingbrain')).length;
const solvedCount = mergedProblems.filter(p => p.is_solved).length;

console.log(`Custom 140 in DB: ${customCount}`);
console.log(`RisingBrain in DB: ${rbCount}`);
console.log(`Both sources: ${bothCount}`);
console.log(`Pre-marked solved: ${solvedCount}`);

fs.writeFileSync('data/custom-140.json', JSON.stringify(customRaw, null, 2));
fs.writeFileSync('data/merged_problems.json', JSON.stringify(mergedProblems, null, 2));
console.log('Saved data/custom-140.json & data/merged_problems.json');
