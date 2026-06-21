// Structured LeetCode DSA Database by Daily Rotation Days (Concept Progression)
// Each question features detailed Brute Force, Optimal Complexities, and Dry Run Traces

window.dsaDatabase = {
  0: { // Day 1: Arrays
    topic: "Arrays",
    questions: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum/",
        slug: "two-sum",
        companies: ["Google", "Amazon", "Microsoft", "TCS"],
        bruteForce: {
          desc: "Use nested loops to check every possible pair of numbers in the array. If their sum equals the target, return their indices.",
          time: "O(N^2) where N is the array length.",
          space: "O(1) auxiliary space."
        },
        optimal: {
          desc: "Use a Hash Map. Traverse the array once. For each element, check if its complement (target - current_element) exists in the map. If it does, return the complement index and current index. Otherwise, store the current element and its index in the map.",
          time: "O(N) since map lookups take O(1) time.",
          space: "O(N) to store elements in the hash map."
        },
        tracer: {
          input: "nums = [2, 7, 11, 15], target = 9",
          steps: [
            "1. Element = 2. Complement = 9 - 2 = 7. Map is empty. Save {2: 0} in Map.",
            "2. Element = 7. Complement = 9 - 7 = 2. 2 exists in Map! Return indices [0, 1]."
          ]
        }
      },
      {
        id: 2,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        slug: "best-time-to-buy-and-sell-stock/",
        companies: ["Amazon", "Microsoft", "Goldman Sachs", "Infosys"],
        bruteForce: {
          desc: "Compare every buying day with every selling day that comes after it to find the maximum possible difference.",
          time: "O(N^2) where N is the number of stock days.",
          space: "O(1) space."
        },
        optimal: {
          desc: "Keep track of the minimum price seen so far. At each step, calculate the potential profit if we sold stock today (current price - min price). Update the maximum profit if this potential profit is larger than our current maximum.",
          time: "O(N) linear scan.",
          space: "O(1) constant space."
        },
        tracer: {
          input: "prices = [7, 1, 5, 3, 6, 4]",
          steps: [
            "1. Day 1: Price = 7. minPrice = 7, maxProfit = 0.",
            "2. Day 2: Price = 1. Price < minPrice. minPrice = 1, maxProfit = 0.",
            "3. Day 3: Price = 5. profit = 5 - 1 = 4. maxProfit = 4.",
            "4. Day 4: Price = 3. profit = 3 - 1 = 2. maxProfit = 4.",
            "5. Day 5: Price = 6. profit = 6 - 1 = 5. Price > minPrice. maxProfit = 5.",
            "6. Day 6: Price = 4. profit = 4 - 1 = 3. maxProfit = 5. Final profit: 5."
          ]
        }
      },
      {
        id: 3,
        title: "Container With Most Water",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/container-with-most-water/",
        slug: "container-with-most-water",
        companies: ["Google", "Adobe", "Meta", "Wipro"],
        bruteForce: {
          desc: "Evaluate all pairs of boundary lines, calculate the volume of water they can contain, and keep the maximum value.",
          time: "O(N^2) double loop.",
          space: "O(1) space."
        },
        optimal: {
          desc: "Use a two-pointer approach (left at 0, right at length-1). Calculate area = min(height[left], height[right]) * width. Update max area. Move the pointer pointing to the shorter line inward (since keeping the shorter line cannot yield a larger area).",
          time: "O(N) single pass.",
          space: "O(1) space."
        },
        tracer: {
          input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
          steps: [
            "1. left = 0 (h=1), right = 8 (h=7). width = 8. Area = min(1, 7)*8 = 8. Move left index inward (left=1).",
            "2. left = 1 (h=8), right = 8 (h=7). width = 7. Area = min(8, 7)*7 = 49. Move right index inward (right=7).",
            "3. left = 1 (h=8), right = 7 (h=3). width = 6. Area = min(8, 3)*6 = 18. Move right index inward (right=6).",
            "4. left = 1 (h=8), right = 6 (h=8). width = 5. Area = min(8, 8)*5 = 40. Move left index (left=2).",
            "... Continue tracing until left and right meet. Max Area is 49."
          ]
        }
      }
    ]
  },
  1: { // Day 2: Strings
    topic: "Strings",
    questions: [
      {
        id: 1,
        title: "Valid Anagram",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-anagram/",
        slug: "valid-anagram",
        companies: ["Amazon", "Goldman Sachs", "TCS"],
        bruteForce: {
          desc: "Sort both strings alphabetically and compare if they are identical.",
          time: "O(N log N) due to sorting, where N is string length.",
          space: "O(N) or O(1) depending on sorting implementation."
        },
        optimal: {
          desc: "Use a single frequency array of size 26 (for English letters). Increment counts for letters in string S, and decrement counts for letters in string T. If the frequency array ends up with all zeros, they are anagrams.",
          time: "O(N) linear time.",
          space: "O(1) space since alphabet size is fixed (26)."
        },
        tracer: {
          input: "s = 'rat', t = 'car'",
          steps: [
            "1. Init counts: array of 26 zeros.",
            "2. Parse 'rat': counts['r']++, counts['a']++, counts['t']++.",
            "3. Parse 'car': counts['c']--, counts['a']--, counts['r']--.",
            "4. Check counts: counts['t'] is 1, counts['c'] is -1. Not all zero. Return false."
          ]
        }
      },
      {
        id: 2,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        slug: "longest-substring-without-repeating-characters",
        companies: ["Google", "Amazon", "Microsoft", "Cognizant"],
        bruteForce: {
          desc: "Generate all possible substrings and verify each for duplicate characters using a Set.",
          time: "O(N^3) nested loops + search check.",
          space: "O(min(N, M)) where M is size of alphabet."
        },
        optimal: {
          desc: "Use a sliding window approach with two pointers (left, right) and a Hash Set. Advance right pointer and add elements to set. If a duplicate is encountered, shrink the window from left by deleting elements from set until duplicate is removed. Track max window length.",
          time: "O(N) since each character is visited at most twice.",
          space: "O(min(N, M)) for character set store."
        },
        tracer: {
          input: "s = 'abcabcbb'",
          steps: [
            "1. left = 0, right = 0. s[0]='a'. Set={'a'}, maxLen = 1.",
            "2. left = 0, right = 1. s[1]='b'. Set={'a', 'b'}, maxLen = 2.",
            "3. left = 0, right = 2. s[2]='c'. Set={'a', 'b', 'c'}, maxLen = 3.",
            "4. left = 0, right = 3. s[3]='a'. Duplicate found! Delete s[0] ('a') from Set. left becomes 1. Set={'b', 'c', 'a'}, maxLen = 3.",
            "5. Continue sliding window. Max length remains 3."
          ]
        }
      },
      {
        id: 3,
        title: "Group Anagrams",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/group-anagrams/",
        slug: "group-anagrams",
        companies: ["Meta", "Amazon", "Bloomberg"],
        bruteForce: {
          desc: "Compare every string with every other string to check if they are anagrams, grouping them accordingly.",
          time: "O(N^2 * L log L) where N is number of strings, L is max string length.",
          space: "O(N * L) to store groupings."
        },
        optimal: {
          desc: "Create a Hash Map. For each string, sort its letters to form a key (e.g. 'eat' -> 'aet'). Use this sorted string as the map key, and append the original string to the list associated with that key. Return map values.",
          time: "O(N * L log L) to sort each string and map it.",
          space: "O(N * L) to store the grouped strings."
        },
        tracer: {
          input: "strs = ['eat', 'tea', 'tan']",
          steps: [
            "1. str = 'eat'. Sorted = 'aet'. Map = {'aet': ['eat']}.",
            "2. str = 'tea'. Sorted = 'aet'. Map = {'aet': ['eat', 'tea']}.",
            "3. str = 'tan'. Sorted = 'ant'. Map = {'aet': ['eat', 'tea'], 'ant': ['tan']}.",
            "4. Return map values: [['eat', 'tea'], ['tan']]."
          ]
        }
      }
    ]
  },
  2: { // Day 3: Linked Lists
    topic: "Linked Lists",
    questions: [
      {
        id: 1,
        title: "Reverse Linked List",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        slug: "reverse-linked-list",
        companies: ["Amazon", "Adobe", "Microsoft", "Accenture"],
        bruteForce: {
          desc: "Store node values in an array/stack, reverse the array, and rebuild a new linked list.",
          time: "O(N) time.",
          space: "O(N) to store node values."
        },
        optimal: {
          desc: "Iterative in-place reversal. Maintain three pointers: prev (null), curr (head), and nextNode. Traverse the list, re-linking curr.next to prev, then advance prev and curr forward.",
          time: "O(N) traversal.",
          space: "O(1) space."
        },
        tracer: {
          input: "head = 1 -> 2 -> 3 -> Null",
          steps: [
            "1. prev = null, curr = 1. nextNode = 2. Re-link 1 -> null. prev = 1, curr = 2.",
            "2. prev = 1, curr = 2. nextNode = 3. Re-link 2 -> 1. prev = 2, curr = 3.",
            "3. prev = 2, curr = 3. nextNode = null. Re-link 3 -> 2. prev = 3, curr = null.",
            "4. curr is null. Return prev (3 -> 2 -> 1 -> Null)."
          ]
        }
      },
      {
        id: 2,
        title: "Linked List Cycle",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/linked-list-cycle/",
        slug: "linked-list-cycle",
        companies: ["Microsoft", "Goldman Sachs", "Capgemini"],
        bruteForce: {
          desc: "Traverse the list and store node addresses in a Set. If a node is visited that already exists in the set, a cycle exists.",
          time: "O(N) lookups.",
          space: "O(N) to store node references in Set."
        },
        optimal: {
          desc: "Floyd's Cycle-Finding Algorithm (Two Pointers). Maintain a slow pointer (moves 1 step) and a fast pointer (moves 2 steps). If they ever meet, a cycle exists. If fast reaches Null, no cycle exists.",
          time: "O(N) traversal time.",
          space: "O(1) constant auxiliary space."
        },
        tracer: {
          input: "1 -> 2 -> 3 -> 4 -> (loops back to 2)",
          steps: [
            "1. slow = 1, fast = 1. (Start)",
            "2. slow = 2, fast = 3. (Step 1)",
            "3. slow = 3, fast = 2 (since 3->4->2). (Step 2)",
            "4. slow = 4, fast = 4 (since slow 3->4, fast 2->4). They meet at 4! Return true."
          ]
        }
      },
      {
        id: 3,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/merge-two-sorted-lists/",
        slug: "merge-two-sorted-lists",
        companies: ["Amazon", "Apple", "TCS", "Infosys"],
        bruteForce: {
          desc: "Extract all elements of both lists, sort them, and create a brand new sorted list.",
          time: "O((N+M) log(N+M)) sorting.",
          space: "O(N+M) storage."
        },
        optimal: {
          desc: "Use a dummy node and a tail pointer. Compare the heads of both lists. Link tail.next to the smaller head, advance that head pointer, and move the tail pointer. At the end, attach any remaining elements of the non-empty list.",
          time: "O(N + M) linear scan.",
          space: "O(1) in-place pointers."
        },
        tracer: {
          input: "l1 = 1->3, l2 = 2->4",
          steps: [
            "1. dummy = 0, tail = 0. Compare l1(1) and l2(2). 1 < 2. tail.next = 1. l1 becomes 3, tail becomes 1.",
            "2. Compare l1(3) and l2(2). 2 < 3. tail.next = 2. l2 becomes 4, tail becomes 2.",
            "3. Compare l1(3) and l2(4). 3 < 4. tail.next = 3. l1 becomes null, tail becomes 3.",
            "4. l1 is empty. Link tail.next to l2 (4). Result: 1 -> 2 -> 3 -> 4."
          ]
        }
      }
    ]
  },
  3: { // Day 4: Stacks & Queues
    topic: "Stacks & Queues",
    questions: [
      {
        id: 1,
        title: "Valid Parentheses",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-parentheses/",
        slug: "valid-parentheses",
        companies: ["Meta", "Amazon", "Google", "Wipro"],
        bruteForce: {
          desc: "Repeatedly find and replace matching adjacent pairs of brackets (e.g. '()', '[]', '{}') with empty strings until no matches remain.",
          time: "O(N^2) due to repeated string operations.",
          space: "O(1) or O(N) depending on string manipulation."
        },
        optimal: {
          desc: "Use a Stack. Iterate through the string. Push opening brackets onto the stack. For closing brackets, pop the top of the stack and check if it matches the current closing bracket. If stack is empty or mismatch occurs, return false. Return true if stack is empty at the end.",
          time: "O(N) single scan.",
          space: "O(N) stack size."
        },
        tracer: {
          input: "s = '()[]'",
          steps: [
            "1. Char = '('. Open bracket. Stack = ['('].",
            "2. Char = ')'. Close bracket. Pop '(' matches ')'. Stack = [].",
            "3. Char = '['. Open bracket. Stack = ['['].",
            "4. Char = ']'. Close bracket. Pop '[' matches ']'. Stack = [].",
            "5. End. Stack is empty. Return true."
          ]
        }
      },
      {
        id: 2,
        title: "Min Stack",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/min-stack/",
        slug: "min-stack",
        companies: ["Microsoft", "Bloomberg", "Goldman Sachs"],
        bruteForce: {
          desc: "Maintain a standard stack. To get the minimum, traverse the entire stack to find the smallest value.",
          time: "Push/Pop: O(1). getMin: O(N) traversal.",
          space: "O(N) stack."
        },
        optimal: {
          desc: "Use an auxiliary stack or pair values. For each item pushed, store a pair: (current value, minimum value seen so far). When calling getMin(), simply return the minimum value associated with the top element.",
          time: "Push/Pop/getMin: All O(1) constant time.",
          space: "O(N) to store duplicate min states."
        },
        tracer: {
          input: "Push 5, Push 3, getMin(), Pop(), getMin()",
          steps: [
            "1. Push 5: Stack stores {val: 5, min: 5}.",
            "2. Push 3: Stack stores {val: 3, min: min(3, 5)=3}.",
            "3. getMin(): Returns top element's min value (3).",
            "4. Pop(): Removes top element (3).",
            "5. getMin(): Returns new top element's min value (5)."
          ]
        }
      },
      {
        id: 3,
        title: "Implement Queue using Stacks",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/implement-queue-using-stacks/",
        slug: "implement-queue-using-stacks",
        companies: ["Microsoft", "Oracle", "Cognizant"],
        bruteForce: {
          desc: "Use a single stack. On every push operation, move all elements to a temporary array, add the new element, and push them all back to reverse order.",
          time: "Push: O(N), Pop: O(1).",
          space: "O(N) temporary array."
        },
        optimal: {
          desc: "Maintain two stacks: instack (for pushing) and outstack (for popping). When popping, if outstack is empty, pop all elements from instack and push them to outstack (reversing their order). Pop from outstack.",
          time: "Push: O(1). Pop: Amortized O(1) time.",
          space: "O(N) stack storage."
        },
        tracer: {
          input: "Push 1, Push 2, Pop()",
          steps: [
            "1. Push 1: instack = [1], outstack = [].",
            "2. Push 2: instack = [1, 2], outstack = [].",
            "3. Pop(): outstack is empty. Move instack elements. outstack = [2, 1], instack = []. Pop top of outstack (1). Result: 1."
          ]
        }
      }
    ]
  },
  4: { // Day 5: Trees
    topic: "Trees",
    questions: [
      {
        id: 1,
        title: "Invert Binary Tree",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/invert-binary-tree/",
        slug: "invert-binary-tree",
        companies: ["Google", "Amazon", "TCS"],
        bruteForce: {
          desc: "Perform a level-order traversal, store nodes in an array, swap children manually at each level, and reconstruct tree.",
          time: "O(N) traversal.",
          space: "O(N) queue space."
        },
        optimal: {
          desc: "Use recursion. For any node, swap its left and right child pointers. Recursively call invertTree on the left child and right child. Return the node itself.",
          time: "O(N) since we visit every node once.",
          space: "O(H) recursion stack space, where H is the height of tree (worst case O(N))."
        },
        tracer: {
          input: "root = [4, 2, 7]",
          steps: [
            "1. invert(4): Swap left(2) and right(7) child pointers. Root is now [4, 7, 2].",
            "2. Call invert(7): leaf node, returns 7.",
            "3. Call invert(2): leaf node, returns 2. Result: [4, 7, 2]."
          ]
        }
      },
      {
        id: 2,
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        slug: "maximum-depth-of-binary-tree",
        companies: ["LinkedIn", "Microsoft", "Amazon"],
        bruteForce: {
          desc: "Find all root-to-leaf paths using depth-first search, store their path lengths in an array, and find the maximum.",
          time: "O(N) traversal.",
          space: "O(N) storage for paths."
        },
        optimal: {
          desc: "Use recursion (DFS). If root is null, depth is 0. Otherwise, maximum depth is 1 + max(depth(left_child), depth(right_child)).",
          time: "O(N) since we visit all nodes.",
          space: "O(H) recursion stack (average O(log N))."
        },
        tracer: {
          input: "root = [3, 9, 20, null, null, 15, 7]",
          steps: [
            "1. depth(3) = 1 + max(depth(9), depth(20)).",
            "2. depth(9) = 1 + max(0, 0) = 1.",
            "3. depth(20) = 1 + max(depth(15), depth(7)) = 1 + max(1, 1) = 2.",
            "4. depth(3) = 1 + max(1, 2) = 3."
          ]
        }
      },
      {
        id: 3,
        title: "Validate Binary Search Tree",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/validate-binary-search-tree/",
        slug: "validate-binary-search-tree",
        companies: ["Amazon", "Bloomberg", "Google", "Infosys"],
        bruteForce: {
          desc: "For each node, verify that all elements in its left subtree are smaller than the node's value, and all elements in its right subtree are larger.",
          time: "O(N^2) since subtree checks are repeated for every node.",
          space: "O(H) stack."
        },
        optimal: {
          desc: "Use recursion with boundaries. Pass a valid range (min, max) down the tree. For the root, range is (-inf, +inf). For left child, range becomes (min, root.val). For right child, range is (root.val, max). Verify each node's value lies strictly inside its range.",
          time: "O(N) single traversal.",
          space: "O(H) recursion stack."
        },
        tracer: {
          input: "root = [2, 1, 3]",
          steps: [
            "1. validate(2, range=[-inf, +inf]): 2 is within range. Valid.",
            "2. validate(1, range=[-inf, 2]): 1 is within range. Valid.",
            "3. validate(3, range=[2, +inf]): 3 is within range. Valid. Return true."
          ]
        }
      }
    ]
  },
  5: { // Day 6: Graphs
    topic: "Graphs",
    questions: [
      {
        id: 1,
        title: "Number of Islands",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/number-of-islands/",
        slug: "number-of-islands",
        companies: ["Amazon", "Google", "Meta", "Microsoft"],
        bruteForce: {
          desc: "For each coordinate, run BFS to identify connecting lands, keeping track of visited coordinates in a duplicate matrix.",
          time: "O(R * C) where R is rows and C is columns.",
          space: "O(R * C) duplicate matrix."
        },
        optimal: {
          desc: "Use Depth-First Search (DFS) in-place. Loop through the grid. When a '1' (land) is found, increment the island count and run DFS from that coordinate to flip all adjacent '1's to '0's (sinking the island in-place to avoid duplicate tracking).",
          time: "O(R * C) cells visited.",
          space: "O(R * C) recursive call stack space."
        },
        tracer: {
          input: "grid = [['1','1','0'], ['1','1','0'], ['0','0','1']]",
          steps: [
            "1. Cell (0,0) is '1'. island_count = 1. Run DFS to flip adjacent lands (0,1), (1,0), (1,1) to '0'.",
            "2. Grid becomes [['0','0','0'], ['0','0','0'], ['0','0','1']]",
            "3. Loop continues. Next land is (2,2) = '1'. island_count = 2. Run DFS to sink (2,2).",
            "4. End of loops. Total islands = 2."
          ]
        }
      },
      {
        id: 2,
        title: "Clone Graph",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/clone-graph/",
        slug: "clone-graph",
        companies: ["Meta", "Google", "Uber"],
        bruteForce: {
          desc: "Traverse the graph, save node data in an adjacency map, and then build a new graph from scratch using the map.",
          time: "O(V + E) where V is vertices, E is edges.",
          space: "O(V + E) for map."
        },
        optimal: {
          desc: "Use DFS/BFS with a Hash Map. The map stores mappings from the original node to its cloned copy: `{original_node: cloned_node}`. Traverse the graph. If a neighbor is not cloned, clone it recursively and map it. Add the cloned neighbor to the cloned node's list.",
          time: "O(V + E) single traversal.",
          space: "O(V) to store cloning mappings in Hash Map."
        },
        tracer: {
          input: "Adjacency List = [[2,4],[1,3],[2,4],[1,3]] (Undirected cycle)",
          steps: [
            "1. Start DFS(node 1). Clone node 1 -> 1'. Map = {1: 1'}.",
            "2. Neighbor 2: Not in Map. Clone node 2 -> 2'. Map = {1: 1', 2: 2'}. DFS(node 2)...",
            "3. DFS(node 2): Neighbors are 1 and 3. Node 1 is already in Map. Link 2'.neighbors.push(1'). Neighbor 3: clone 3'...",
            "4. Complete DFS mapping: Return 1'."
          ]
        }
      },
      {
        id: 3,
        title: "Course Schedule",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/course-schedule/",
        slug: "course-schedule",
        companies: ["Google", "Amazon", "Twitter"],
        bruteForce: {
          desc: "Represent courses as a graph. Generate all possible linear path permutations and check if any path contains cycles.",
          time: "O(V!) factorial complexity.",
          space: "O(V + E) graph."
        },
        optimal: {
          desc: "Detect cycle in Directed Graph using DFS (Topological Sort / Kahn's Algorithm). Maintain a visited state array: 0 (unvisited), 1 (visiting), 2 (visited). If we encounter a node with state 1 (visiting) during traversal, a back-edge (cycle) exists. Return false.",
          time: "O(V + E) node and edge checks.",
          space: "O(V + E) for recursion stack and adjacency list."
        },
        tracer: {
          input: "numCourses = 2, prerequisites = [[1,0], [0,1]] (Cycle)",
          steps: [
            "1. Build graph: 0 -> 1 and 1 -> 0. Visited state = [0, 0].",
            "2. DFS(node 0): Set state[0] = 1 (visiting). Visit neighbor 1.",
            "3. DFS(node 1): Set state[1] = 1 (visiting). Visit neighbor 0.",
            "4. Neighbor 0 has state[0] = 1! Cycle detected! Return false."
          ]
        }
      }
    ]
  },
  6: { // Day 7: Dynamic Programming
    topic: "Dynamic Programming",
    questions: [
      {
        id: 1,
        title: "Climbing Stairs",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/climbing-stairs/",
        slug: "climbing-stairs",
        companies: ["Goldman Sachs", "Adobe", "Apple", "Accenture"],
        bruteForce: {
          desc: "Use recursion. To reach step n, we can take 1 step from (n-1) or 2 steps from (n-2). Formula: climb(n) = climb(n-1) + climb(n-2).",
          time: "O(2^N) exponential time.",
          space: "O(N) recursion stack."
        },
        optimal: {
          desc: "This is a Fibonacci sequence. Maintain two variables represent options for previous step (oneStepAgo) and two steps ago (twoStepsAgo). Loop from 3 to n, update next step = oneStepAgo + twoStepsAgo, and slide pointers.",
          time: "O(N) linear time.",
          space: "O(1) constant auxiliary space."
        },
        tracer: {
          input: "n = 4",
          steps: [
            "1. Base cases: climb(1)=1, climb(2)=2.",
            "2. Step 3: ways = climb(2) + climb(1) = 2 + 1 = 3.",
            "3. Step 4: ways = climb(3) + climb(2) = 3 + 2 = 5. Result: 5."
          ]
        }
      },
      {
        id: 2,
        title: "Coin Change",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/coin-change/",
        slug: "coin-change",
        companies: ["Amazon", "Microsoft", "Google", "Capgemini"],
        bruteForce: {
          desc: "Try every possible combination of coins that sum to the amount using recursion, returning the minimum count.",
          time: "O(C^A) where C is coins count, A is amount.",
          space: "O(A) stack."
        },
        optimal: {
          desc: "Bottom-Up Dynamic Programming. Create a DP array of size (amount + 1) filled with a large value (amount + 1). dp[0] = 0. For each value i from 1 to amount, iterate through all coins. If coin <= i, dp[i] = min(dp[i], dp[i - coin] + 1). Return dp[amount].",
          time: "O(amount * coins_count) time.",
          space: "O(amount) space for DP array."
        },
        tracer: {
          input: "coins = [1, 2, 5], amount = 11",
          steps: [
            "1. dp = [0, inf, inf, ...].",
            "2. dp[1] = min(inf, dp[0]+1) = 1.",
            "3. dp[2] = min(inf, dp[1]+1, dp[0]+1) = 1.",
            "4. dp[3] = min(inf, dp[2]+1, dp[1]+1) = 2.",
            "... dp[11] will calculate min(dp[10]+1, dp[9]+1, dp[6]+1) = 3 (coins 5 + 5 + 1). Result: 3."
          ]
        }
      },
      {
        id: 3,
        title: "Longest Common Subsequence",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-common-subsequence/",
        slug: "longest-common-subsequence",
        companies: ["Amazon", "Google", "Microsoft", "Infosys"],
        bruteForce: {
          desc: "Generate all subsequences of both strings and find the longest matching substring.",
          time: "O(2^(N+M)) time.",
          space: "O(N+M) stack."
        },
        optimal: {
          desc: "Use a 2D DP table. If text1[i] == text2[j], then dp[i][j] = 1 + dp[i-1][j-1]. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
          time: "O(N * M) where N, M are string lengths.",
          space: "O(N * M) DP table."
        },
        tracer: {
          input: "text1 = 'abc', text2 = 'ace'",
          steps: [
            "1. Init 2D DP grid text1 vs text2.",
            "2. Compare 'a' and 'a': Match! dp[1][1] = 1 + dp[0][0] = 1.",
            "3. Compare 'b' and 'c': Mismatch. dp[2][2] = max(dp[1][2], dp[2][1]) = 1.",
            "4. Final LCS cell: Value is 2 ('a' and 'c'). Result: 2."
          ]
        }
      }
    ]
  },
  7: { // Day 8: Heaps & Priority Queues
    topic: "Heaps & Priority Queues",
    questions: [
      {
        id: 1,
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        slug: "kth-largest-element-in-an-array",
        companies: ["Google", "Amazon", "Microsoft"],
        bruteForce: {
          desc: "Sort the array in descending order and return the element at index k-1.",
          time: "O(N log N) where N is array length.",
          space: "O(1) if sorting in place."
        },
        optimal: {
          desc: "Use a Min-Heap of size k. Iterate through the array. Add each element to the heap. If heap size exceeds k, pop the smallest element. At the end, the root of the heap is the Kth largest element.",
          time: "O(N log K) since heap operations take log K time.",
          space: "O(K) to store k elements in heap."
        },
        tracer: {
          input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
          steps: [
            "1. Element = 3. Add to heap. Heap = [3].",
            "2. Element = 2. Add to heap. Heap = [2, 3].",
            "3. Element = 1. Add to heap. Heap = [1, 3, 2] (size > 2). Pop min (1). Heap = [2, 3].",
            "4. Element = 5. Add to heap. Heap = [2, 3, 5] (size > 2). Pop min (2). Heap = [3, 5].",
            "5. Element = 6. Add to heap. Heap = [3, 5, 6] (size > 2). Pop min (3). Heap = [5, 6].",
            "6. Element = 4. Add to heap. Heap = [4, 6, 5] (size > 2). Pop min (4). Heap = [5, 6].",
            "7. End. Heap root is 5. Return 5."
          ]
        }
      },
      {
        id: 2,
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/top-k-frequent-elements/",
        slug: "top-k-frequent-elements",
        companies: ["Amazon", "Google", "Oracle"],
        bruteForce: {
          desc: "Count frequency of each element using a map, sort the map entries by frequency in descending order, and return the top k keys.",
          time: "O(N log N) sorting frequencies.",
          space: "O(N) for map and list storage."
        },
        optimal: {
          desc: "Count frequencies with a map. Use Bucket Sort: create an array of lists where index represents frequency. Put elements in their respective frequency bucket. Traverse the buckets from right to left to collect top k elements.",
          time: "O(N) linear time.",
          space: "O(N) auxiliary space."
        },
        tracer: {
          input: "nums = [1,1,1,2,2,3], k = 2",
          steps: [
            "1. Map frequencies: {1: 3, 2: 2, 3: 1}.",
            "2. Create buckets of size N+1: buckets = [[], [], [], [], [], [], []].",
            "3. Fill buckets: buckets[1] = [3], buckets[2] = [2], buckets[3] = [1].",
            "4. Traverse from index 6 down to 0: buckets[3] yields 1, buckets[2] yields 2. We collected k=2 elements: [1, 2]. Return [1, 2]."
          ]
        }
      },
      {
        id: 3,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/merge-k-sorted-lists/",
        slug: "merge-k-sorted-lists",
        companies: ["Google", "Amazon", "Microsoft"],
        bruteForce: {
          desc: "Extract all node values from all lists, sort them, and construct a new sorted linked list.",
          time: "O(N log N) where N is total nodes.",
          space: "O(N) space."
        },
        optimal: {
          desc: "Use a Min-Heap. Put the head node of each of the k lists into the heap. Pop the smallest node, append it to the merged list, and push its next node into the heap. Repeat until heap is empty.",
          time: "O(N log K) where N is total nodes, K is number of lists.",
          space: "O(K) heap space."
        },
        tracer: {
          input: "lists = [[1->4], [1->3], [2->6]]",
          steps: [
            "1. Insert heads into Min-Heap: Heap = [1(L1), 1(L2), 2(L3)].",
            "2. Pop 1(L1). Next node is 4. Add 4 to heap. Heap = [1(L2), 2(L3), 4(L1)]. Merged = 1.",
            "3. Pop 1(L2). Next node is 3. Add 3 to heap. Heap = [2(L3), 3(L2), 4(L1)]. Merged = 1 -> 1.",
            "4. Pop 2(L3). Next node is 6. Add 6 to heap. Heap = [3(L2), 4(L1), 6(L3)]. Merged = 1 -> 1 -> 2.",
            "5. Continue until heap is empty. Final list: 1 -> 1 -> 2 -> 3 -> 4 -> 6."
          ]
        }
      }
    ]
  },
  8: { // Day 9: Binary Search
    topic: "Binary Search",
    questions: [
      {
        id: 1,
        title: "Binary Search",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-search/",
        slug: "binary-search",
        companies: ["Google", "Amazon", "TCS", "Infosys"],
        bruteForce: {
          desc: "Perform a linear search from left to right, comparing each element with the target.",
          time: "O(N) time.",
          space: "O(1) space."
        },
        optimal: {
          desc: "Use two pointers, low = 0 and high = len-1. Calculate mid = low + (high - low)/2. If target == nums[mid], return mid. If target > nums[mid], search right half (low = mid+1). Otherwise, search left half (high = mid-1).",
          time: "O(log N) logarithmic search.",
          space: "O(1) constant space."
        },
        tracer: {
          input: "nums = [-1,0,3,5,9,12], target = 9",
          steps: [
            "1. low = 0, high = 5. mid = 2 (val = 3). 9 > 3. low = mid+1 = 3.",
            "2. low = 3, high = 5. mid = 4 (val = 9). 9 == 9. Return index 4."
          ]
        }
      },
      {
        id: 2,
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        slug: "search-in-rotated-sorted-array",
        companies: ["Microsoft", "LinkedIn", "Bloomberg"],
        bruteForce: {
          desc: "Perform a linear search from index 0 to N-1 to find the target element.",
          time: "O(N) time.",
          space: "O(1) space."
        },
        optimal: {
          desc: "Modified binary search. Identify which half of the array is sorted at the mid index. If the left half is sorted, check if target lies within left half; if so, search left, else search right. If the right half is sorted, do the corresponding check for the right half.",
          time: "O(log N) time.",
          space: "O(1) space."
        },
        tracer: {
          input: "nums = [4,5,6,7,0,1,2], target = 0",
          steps: [
            "1. low = 0, high = 6. mid = 3 (val = 7). Left half [4,5,6,7] is sorted. target (0) is not in [4..7]. low = mid+1 = 4.",
            "2. low = 4, high = 6. mid = 5 (val = 1). Right half [1,2] is sorted. target (0) not in [1..2]. high = mid-1 = 4.",
            "3. low = 4, high = 4. mid = 4 (val = 0). target == nums[mid]. Return index 4."
          ]
        }
      },
      {
        id: 3,
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        slug: "find-minimum-in-rotated-sorted-array",
        companies: ["Amazon", "Google", "Facebook"],
        bruteForce: {
          desc: "Scan the entire array linearly to find the smallest element.",
          time: "O(N) time.",
          space: "O(1) space."
        },
        optimal: {
          desc: "Use binary search. If nums[low] <= nums[high], array is not rotated; return nums[low]. Find mid. If nums[mid] >= nums[low], left side is sorted and minimum is on right, search right (low = mid + 1). Else search left (high = mid).",
          time: "O(log N) time.",
          space: "O(1) space."
        },
        tracer: {
          input: "nums = [3,4,5,1,2]",
          steps: [
            "1. low = 0 (val 3), high = 4 (val 2). 3 > 2 (rotated). mid = 2 (val 5). nums[mid] (5) >= nums[low] (3). Search right: low = mid+1 = 3.",
            "2. low = 3 (val 1), high = 4 (val 2). nums[low] (1) <= nums[high] (2). Sorted! Return nums[low] (1)."
          ]
        }
      }
    ]
  },
  9: { // Day 10: Backtracking
    topic: "Backtracking",
    questions: [
      {
        id: 1,
        title: "Subsets",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subsets/",
        slug: "subsets",
        companies: ["Google", "Meta", "Amazon"],
        bruteForce: {
          desc: "Use binary bit manipulation to generate all 2^N states, checking bits from 0 to 2^N-1.",
          time: "O(N * 2^N) time.",
          space: "O(N * 2^N) to store result."
        },
        optimal: {
          desc: "Backtracking recursion. At each step, we decide whether to include the current element in the subset or not. Recurse down, then backtrack by removing the last element.",
          time: "O(N * 2^N) to generate all subsets.",
          space: "O(N) recursion stack space."
        },
        tracer: {
          input: "nums = [1, 2]",
          steps: [
            "1. Start backtrack(index 0, path=[]). Add path [] to subset.",
            "2. Choose 1: path = [1]. backtrack(1, [1]). Add [1] to subset.",
            "3. Choose 2: path = [1, 2]. backtrack(2, [1, 2]). Add [1, 2] to subset. Index 2 >= len, return.",
            "4. Backtrack (remove 2): path = [1]. Index 1 done, return.",
            "5. Backtrack (remove 1): path = []. Choose 2: path = [2]. backtrack(2, [2]). Add [2] to subset.",
            "6. Complete. Subsets: [[], [1], [1,2], [2]]."
          ]
        }
      },
      {
        id: 2,
        title: "Permutations",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/permutations/",
        slug: "permutations",
        companies: ["Google", "Microsoft", "Adobe"],
        bruteForce: {
          desc: "Generate all possible arrangements of elements using recursion, checking for duplicates.",
          time: "O(N * N!) permutations check.",
          space: "O(N * N!) recursive store."
        },
        optimal: {
          desc: "Use backtracking recursion. Swap the current element with all elements from the current index to the end, recurse, and then swap back to restore state.",
          time: "O(N * N!) time.",
          space: "O(N) recursion stack."
        },
        tracer: {
          input: "nums = [1, 2, 3]",
          steps: [
            "1. start permute(0). Swap index 0 with: 0(1), 1(2), 2(3).",
            "2. Swap 0 with 0: [1,2,3]. permute(1). Swap index 1 with 1(2), 2(3).",
            "3. Swap 1 with 1: [1,2,3]. permute(2). Base case (index 2 == N-1). Add [1,2,3].",
            "4. Swap 1 with 2: [1,3,2]. permute(2). Add [1,3,2]. Swap back -> [1,2,3].",
            "5. Swap 0 with 1: [2,1,3]... Recurse -> [2,1,3], [2,3,1]... Swap back -> [1,2,3].",
            "6. Generate all 6 permutations."
          ]
        }
      },
      {
        id: 3,
        title: "Combination Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/combination-sum/",
        slug: "combination-sum",
        companies: ["Amazon", "Google", "Uber"],
        bruteForce: {
          desc: "Generate all combinations of numbers up to the target length and check which ones sum to target.",
          time: "O(N^T) where T is target value.",
          space: "O(T) stack."
        },
        optimal: {
          desc: "Backtracking recursion. For each element, we have two choices: pick the element (subtract value from target, keep index the same to allow reuse), or skip the element (move index forward). If target == 0, save combination.",
          time: "O(2^T) where T is target / min_candidate.",
          space: "O(T) recursion depth."
        },
        tracer: {
          input: "candidates = [2, 3], target = 5",
          steps: [
            "1. start(index 0, target 5, path=[]).",
            "2. Pick 2: start(0, target 3, path=[2]).",
            "3. Pick 2: start(0, target 1, path=[2,2]).",
            "4. Pick 2: target -1 < 0. Backtrack. Skip 2: start(1, target 1, path=[2,2]).",
            "5. Pick 3: target -2 < 0. Backtrack. Skip 3: index out of bounds, return.",
            "6. Backtrack from path=[2,2] -> path=[2]. Skip 2: start(1, target 3, path=[2]).",
            "7. Pick 3: target becomes 0. Add [2,3] to result! Return.",
            "8. Backtrack, continue search. Result combinations: [[2, 3]]."
          ]
        }
      }
    ]
  }
};

