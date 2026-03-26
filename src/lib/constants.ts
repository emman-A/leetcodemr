export const DIFFICULTY_LEVELS = ['All', 'Easy', 'Medium', 'Hard'] as const

export const QUESTION_SOURCES = [
  { label: 'All',        value: 'All' },
  { label: 'Grind 169',  value: 'Grind 169' },
  { label: 'Denny Zhang', value: 'Denny Zhang' },
  { label: 'Premium 98', value: 'Premium 98' },
  { label: 'CodeSignal',  value: 'CodeSignal' },
] as const

export const QUICK_PATTERNS = [
  { name: 'Arrays & Hashing',     tags: ['Array', 'Hash Table'] },
  { name: 'String',               tags: ['String'] },
  { name: 'Two Pointers',         tags: ['Two Pointers'] },
  { name: 'Sliding Window',       tags: ['Sliding Window'] },
  { name: 'Binary Search',        tags: ['Binary Search'] },
  { name: 'Stack',                tags: ['Stack', 'Monotonic Stack'] },
  { name: 'Linked List',          tags: ['Linked List'] },
  { name: 'Trees & BST',          tags: ['Tree', 'Binary Tree', 'Binary Search Tree', 'BST'] },
  { name: 'Trie',                 tags: ['Trie'] },
  { name: 'Heap',                 tags: ['Heap', 'Heap (Priority Queue)'] },
  { name: 'Matrix',               tags: ['Matrix'] },
  { name: 'Dynamic Programming',  tags: ['Dynamic Programming', 'Memoization'] },
  { name: 'Greedy',               tags: ['Greedy'] },
  { name: 'Graphs',               tags: ['Graph', 'Union Find', 'Topological Sort'] },
  { name: 'Backtracking',         tags: ['Backtracking'] },
  { name: 'BFS',                  tags: ['BFS', 'Breadth-First Search'] },
  { name: 'DFS',                  tags: ['DFS', 'Depth-First Search'] },
  { name: 'Sorting',              tags: ['Sorting', 'Divide and Conquer'] },
  { name: 'Math',                 tags: ['Math'] },
  { name: 'Bit Manipulation',     tags: ['Bit Manipulation'] },
] as const
