export const mockQuestions = {
    1: [
        {
            id: 'q1',
            title: '1-bit and 2-bit Characters',
            description: `We have two special characters:

- The first character can be represented by one bit \`0\`.
- The second character can be represented by two bits (\`10\` or \`11\`).

Given a binary array \`bits\` that ends with \`0\`, return \`true\` if the last character must be a one-bit character.

### Example 1:
**Input:** \`bits = [1,0,0]\`
**Output:** \`true\`
**Explanation:** The only way to decode it is two-bit character and one-bit character. So the last character is one-bit character.

### Example 2:
**Input:** \`bits = [1,1,1,0]\`
**Output:** \`false\`
**Explanation:** The only way to decode it is two-bit character and two-bit character. So the last character is not one-bit character.

### Constraints:
- \`1 <= bits.length <= 1000\`
- \`bits[i]\` is either \`0\` or \`1\`.`,
            starterCode: `/**
 * @param {number[]} bits
 * @return {boolean}
 */
var isOneBitCharacter = function(bits) {
    
};`
        },
        {
            id: 'q2',
            title: 'Kth Largest Element in a Stream',
            description: `You are part of a university admissions office and need to keep track of the kth highest test score from applicants in real-time. This helps to determine cut-off marks for interviews and admissions dynamically as new applicants submit their scores.

You are tasked to implement a class which, for a given integer \`k\`, maintains a stream of test scores and continuously returns the \`k\`th highest test score after a new score has been submitted. More specifically, we are looking for the \`k\`th highest score in the sorted list of all scores.

Implement the \`KthLargest\` class:
- \`KthLargest(int k, int[] nums)\`: Initializes the object with the integer \`k\` and the stream of test scores \`nums\`.
- \`int add(int val)\`: Adds a new test score \`val\` to the stream and returns the element representing the \`k\`th largest element in the pool of test scores so far.

### Example 1:
**Input:**
\`["KthLargest", "add", "add", "add", "add", "add"]\`
\`[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]\`

**Output:** \`[null, 4, 5, 5, 8, 8]\`

### Constraints:
- \`0 <= nums.length <= 10^4\`
- \`1 <= k <= nums.length + 1\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`-10^4 <= val <= 10^4\`
- At most \`10^4\` calls will be made to \`add\`.`,
            starterCode: `/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function(k, nums) {
    
};

/** 
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function(val) {
    
};`
        }
    ],
    2: [
        {
            id: 'q3',
            title: 'Maximum Units on a Truck',
            description: `You are assigned to put some amount of boxes onto one truck. You are given a 2D array \`boxTypes\`, where \`boxTypes[i] = [numberOfBoxesi, numberOfUnitsPerBoxi]\`:

- \`numberOfBoxesi\` is the number of boxes of type \`i\`.
- \`numberOfUnitsPerBoxi\` is the number of units in each box of the type \`i\`.

You are also given an integer \`truckSize\`, which is the maximum number of boxes that can be put on the truck. You can choose any boxes to put on the truck as long as the number of boxes does not exceed \`truckSize\`.

Return the maximum total number of units that can be put on the truck.

### Example 1:
**Input:** \`boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4\`
**Output:** \`8\`
**Explanation:** You can take all the boxes of the first and second types, and one box of the third type. Total: \`(1 * 3) + (2 * 2) + (1 * 1) = 8\`.

### Example 2:
**Input:** \`boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10\`
**Output:** \`91\`

### Constraints:
- \`1 <= boxTypes.length <= 1000\`
- \`1 <= numberOfBoxesi, numberOfUnitsPerBoxi <= 1000\`
- \`1 <= truckSize <= 10^6\``,
            starterCode: `/**
 * @param {number[][]} boxTypes
 * @param {number} truckSize
 * @return {number}
 */
var maximumUnits = function(boxTypes, truckSize) {
    
};`
        },
        {
            id: 'q4',
            title: 'Swapping Nodes in a Linked List',
            description: `You are given the \`head\` of a linked list, and an integer \`k\`.

Return the head of the linked list after swapping the values of the \`k\`th node from the beginning and the \`k\`th node from the end (the list is 1-indexed).

### Example 1:
**Input:** \`head = [1,2,3,4,5], k = 2\`
**Output:** \`[1,4,3,2,5]\`

### Example 2:
**Input:** \`head = [7,9,6,6,7,8,3,0,9,5], k = 5\`
**Output:** \`[7,9,6,6,8,7,3,0,9,5]\`

### Constraints:
- The number of nodes in the list is \`n\`.
- \`1 <= k <= n <= 10^5\`
- \`0 <= Node.val <= 100\``,
            starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var swapNodes = function(head, k) {
    
};`
        }
    ],
    3: [
        {
            id: 'q5',
            title: 'Robot Return to Origin',
            description: `There is a robot starting at the position \`(0, 0)\`, the origin, on a 2D plane. Given a sequence of its moves, judge if this robot ends up at \`(0, 0)\` after it completes its moves.

You are given a string \`moves\` that represents the move sequence of the robot where \`moves[i]\` represents its \`i\`th move. Valid moves are \`'R'\` (right), \`'L'\` (left), \`'U'\` (up), and \`'D'\` (down).

Return \`true\` if the robot returns to the origin after it finishes all of its moves, or \`false\` otherwise.

### Example 1:
**Input:** \`moves = "UD"\`
**Output:** \`true\`
**Explanation:** The robot moves up once, and then down once. Therefore, we return true.

### Example 2:
**Input:** \`moves = "LL"\`
**Output:** \`false\`
**Explanation:** The robot moves left twice. It ends up two "moves" to the left of the origin.

### Constraints:
- \`1 <= moves.length <= 2 * 10^4\`
- \`moves\` only contains the characters \`'U'\`, \`'D'\`, \`'L'\` and \`'R'\`.`,
            starterCode: `/**
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
    
};`
        },
        {
            id: 'q6',
            title: 'Expressive Words',
            description: `Sometimes people repeat letters to represent extra feeling. For example: \`"hello" -> "heeellooo"\`, \`"hi" -> "hiiii"\`.

In these strings, we have groups of adjacent letters that are all the same.

You are given a string \`s\` and an array of query strings \`words\`. A query word is stretchy if it can be made to be equal to \`s\` by any number of applications of the following extension operation: choose a group consisting of characters \`c\`, and add some number of characters \`c\` to the group so that the size of the group is three or more.

Return the number of query strings that are stretchy.

### Example 1:
**Input:** \`s = "heeellooo", words = ["hello", "hi", "helo"]\`
**Output:** \`1\`
**Explanation:** We can extend \`"e"\` and \`"o"\` in the word \`"hello"\` to get \`"heeellooo"\`. We can't extend \`"helo"\` to get \`"heeellooo"\` because the group \`"ll"\` is not size 3 or more.

### Example 2:
**Input:** \`s = "zzzzzyyyyy", words = ["zzyy","zy","zyy"]\`
**Output:** \`3\`

### Constraints:
- \`1 <= s.length, words.length <= 100\`
- \`1 <= words[i].length <= 100\`
- \`s\` and \`words[i]\` consist of lowercase letters.`,
            starterCode: `/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var expressiveWords = function(s, words) {
    
};`
        }
    ]
};
