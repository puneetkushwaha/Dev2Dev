export const fullStackExamQuestions = [
    // --- HTML (1-10) ---
    { id: 1, type: "mcq", q: "Q1. HTML ka full form kya hai?", options: ["Hyper Trainer Marking Language", "Hyper Text Marketing Language", "Hyper Text Markup Language", "Hyper Tool Mark Language"], ans: 2 },
    { id: 2, type: "mcq", q: "Q2. <a> tag ka use kis liye hota hai?", options: ["Image add karne ke liye", "Link create karne ke liye", "Table banane ke liye", "Form submit karne ke liye"], ans: 1 },
    { id: 3, type: "mcq", q: "Q3. Semantic tag ka example kaunsa hai?", options: ["<div>", "<span>", "<section>", "<b>"], ans: 2 },
    { id: 4, type: "mcq", q: "Q4. Image path kis attribute me dete hain?", options: ["href", "src", "link", "path"], ans: 1 },
    { id: 5, type: "mcq", q: "Q5. Form data server ko bhejne ke liye kya use hota hai?", options: ["action", "method", "Dono", "submit"], ans: 2 },
    { id: 6, type: "mcq", q: "Q6. Ordered list tag kaunsa hai?", options: ["<ul>", "<ol>", "<li>", "<dl>"], ans: 1 },
    { id: 7, type: "mcq", q: "Q7. Table row define karne ka tag?", options: ["<td>", "<th>", "<tr>", "<table>"], ans: 2 },
    { id: 8, type: "mcq", q: "Q8. HTML comment syntax kya hai?", options: ["// comment", "<!-- comment -->", "/* comment */", "** comment **"], ans: 1 },
    { id: 9, type: "mcq", q: "Q9. Password input field ka syntax?", options: ["<input type=\"text\">", "<input type=\"password\">", "<password>", "<input hidden>"], ans: 1 },
    { id: 10, type: "mcq", q: "Q10. Favicon add karne ka tag?", options: ["<icon>", "<link rel=\"icon\">", "<fav>", "<meta icon>"], ans: 1 },

    // --- CSS (11-20) ---
    { id: 11, type: "mcq", q: "Q11. CSS full form kya hai?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Syntax", "Computer Style Sheets"], ans: 1 },
    { id: 12, type: "mcq", q: "Q12. CSS apply karne ke kitne tarike hote hain?", options: ["1", "2", "3", "4"], ans: 2 },
    { id: 13, type: "mcq", q: "Q13. Highest priority CSS ki hoti hai:", options: ["External", "Internal", "Inline", "Browser default"], ans: 2 },
    { id: 14, type: "mcq", q: "Q14. Flexbox enable karne ka property?", options: ["display: block", "display: flex", "flex: 1", "position: flex"], ans: 1 },
    { id: 15, type: "mcq", q: "Q15. Flex items center align kaise karte hain?", options: ["align-items: center", "text-align: center", "justify-text", "align-center"], ans: 0 },
    { id: 16, type: "mcq", q: "Q16. Grid start karne ka property?", options: ["display: flex", "display: grid", "grid-start", "layout: grid"], ans: 1 },
    { id: 17, type: "mcq", q: "Q17. position absolute kis par depend karta hai?", options: ["Body", "Parent relative", "Screen", "Margin"], ans: 1 },
    { id: 18, type: "mcq", q: "Q18. z-index ka use?", options: ["Color change", "Layer order control", "Size change", "Opacity"], ans: 1 },
    { id: 19, type: "mcq", q: "Q19. Media query ka use?", options: ["Animation", "Responsive design", "Grid", "Font"], ans: 1 },
    { id: 20, type: "mcq", q: "Q20. box-sizing: border-box kya karta hai?", options: ["Border remove", "Width me padding include karta hai", "Height double karta hai", "Margin add karta hai"], ans: 1 },

    // --- JavaScript (21-35) ---
    { id: 21, type: "mcq", q: "Q21. JS me variable declare kaise karte hain?", options: ["var", "let", "const", "All"], ans: 3 },
    { id: 22, type: "mcq", q: "Q22. Strict equality operator?", options: ["==", "===", "!=", "="], ans: 1 },
    { id: 23, type: "mcq", q: "Q23. Arrow function syntax?", options: ["function(){}", "()=>{}", "func=>{}", "arrow(){}"], ans: 1 },
    { id: 24, type: "mcq", q: "Q24. Promise ka state nahi hota:", options: ["Pending", "Resolved", "Rejected", "Finished"], ans: 3 },
    { id: 25, type: "mcq", q: "Q25. Async/Await kis par based hai?", options: ["Callback", "Promise", "Loop", "Event"], ans: 1 },
    { id: 26, type: "mcq", q: "Q26. Closure kya hai?", options: ["Function + lexical scope", "Loop", "Object", "Array"], ans: 0 },
    { id: 27, type: "mcq", q: "Q27. Hoisting apply hoti hai:", options: ["Variables par", "Functions par", "Dono", "None"], ans: 2 },
    { id: 28, type: "mcq", q: "Q28. NaN ka type kya hai?", options: ["Number", "String", "Boolean", "Undefined"], ans: 0 },
    { id: 29, type: "mcq", q: "Q29. setTimeout kya hai?", options: ["Sync function", "Async function", "Loop", "API"], ans: 1 },
    { id: 30, type: "mcq", q: "Q30. Event bubbling kya hai?", options: ["Parent → Child", "Child → Parent", "Parallel", "None"], ans: 1 },
    { id: 31, type: "mcq", q: "Q31. DOM selection ka tarika kaunsa hai?", options: ["getElementById", "querySelector", "Dono", "None"], ans: 2 },
    { id: 32, type: "mcq", q: "Q32. localStorage me data save karne ka method?", options: ["setItem", "saveItem", "add", "push"], ans: 0 },
    { id: 33, type: "mcq", q: "Q33. Event listener add karne ka function?", options: ["on()", "addEventListener()", "listen()", "bind()"], ans: 1 },
    { id: 34, type: "mcq", q: "Q34. preventDefault() ka use kisliye hota hai?", options: ["Default action rokne ke liye", "Event delete karne ke liye", "Function stop karne ke liye", "DOM clear karne ke liye"], ans: 0 },
    { id: 35, type: "mcq", q: "Q35. Event delegation kya hai?", options: ["Parent element pe event listener lagana", "Child element pe multiple listener lagana", "Event bubbles ko rokna", "None"], ans: 0 },

    // --- React (36-45) ---
    { id: 36, type: "mcq", q: "Q36. React kya hai?", options: ["Framework", "Library", "Language", "DB"], ans: 1 },
    { id: 37, type: "mcq", q: "Q37. Virtual DOM ka benefit?", options: ["Fast rendering", "Slow memory", "Secure", "None"], ans: 0 },
    { id: 38, type: "mcq", q: "Q38. useState ka use?", options: ["Routing", "State management", "API calls", "Styling"], ans: 1 },
    { id: 39, type: "mcq", q: "Q39. useEffect kab run hota hai?", options: ["After render", "Before render", "Never", "Only once"], ans: 0 },
    { id: 40, type: "mcq", q: "Q40. Props immutable hote hain?", options: ["Yes", "No", "Sometimes", "Only in class components"], ans: 0 },
    { id: 41, type: "mcq", q: "Q41. Controlled component kya hai?", options: ["React controls state", "DOM controls state", "Redux controls", "None"], ans: 0 },
    { id: 42, type: "mcq", q: "Q42. React Router ka use?", options: ["Client-side routing", "Server routing", "API calls", "State mgmt"], ans: 0 },
    { id: 43, type: "mcq", q: "Q43. Redux ka purpose?", options: ["Component state", "Global state management", "Routing", "Styling"], ans: 1 },
    { id: 44, type: "mcq", q: "Q44. Key prop kyu use hota hai?", options: ["Identification for React", "Styling lists", "Data fetching", "None"], ans: 0 },
    { id: 45, type: "mcq", q: "Q45. Fragment ka syntax?", options: ["<></>", "<frag></frag>", "<div/>", "<React/>"], ans: 0 },

    // --- Backend / Node (46-50) ---
    { id: 46, type: "mcq", q: "Q46. Node.js kis engine par run hota hai?", options: ["V8", "SpiderMonkey", "Chakra", "WebKit"], ans: 0 },
    { id: 47, type: "mcq", q: "Q47. Express kya hai?", options: ["Language", "Node.js framework", "Database", "Browser"], ans: 1 },
    { id: 48, type: "mcq", q: "Q48. Middleware kya karta hai?", options: ["Req/Res cycle modify karta hai", "DB connect karta hai", "Styling karta hai", "Routing karta hai"], ans: 0 },
    { id: 49, type: "mcq", q: "Q49. REST API kya hai?", options: ["Architecture style", "Database", "Library", "Language"], ans: 0 },
    { id: 50, type: "mcq", q: "Q50. JWT ka use?", options: ["Authentication", "Styling", "Routing", "Database indexing"], ans: 0 },

    // --- Database + DevOps (51-60) ---
    { id: 51, type: "mcq", q: "Q51. SQL vs NoSQL ka main difference?", options: ["Relational vs Non-relational", "Fast vs Slow", "Paid vs Free", "None"], ans: 0 },
    { id: 52, type: "mcq", q: "Q52. MongoDB kaisa database hai?", options: ["Document store", "Key-value", "Graph", "Columnar"], ans: 0 },
    { id: 53, type: "mcq", q: "Q53. Primary key ka purpose?", options: ["Unique identification", "Foreign mapping", "Styling", "None"], ans: 0 },
    { id: 54, type: "mcq", q: "Q54. Indexing ka use?", options: ["Fast search", "Save disk space", "Styling tables", "Data deletion"], ans: 0 },
    { id: 55, type: "mcq", q: "Q55. Aggregation ka use?", options: ["Data grouping & processing", "Data deletion", "Indexing", "None"], ans: 0 },
    { id: 56, type: "mcq", q: "Q56. Normalization kyu karte hain?", options: ["Reduce redundancy", "Increase redundancy", "Make DB slow", "None"], ans: 0 },
    { id: 57, type: "mcq", q: "Q57. Git kya hai?", options: ["Version control system", "Database", "Cloud provider", "Language"], ans: 0 },
    { id: 58, type: "mcq", q: "Q58. CI/CD ka full form?", options: ["Continuous Integration / Continuous Deployment", "Code Integration / Code Deployment", "Cloud Integration / Cloud Dev", "None"], ans: 0 },
    { id: 59, type: "mcq", q: "Q59. Docker kya karta hai?", options: ["Containerization", "Styling", "Database management", "Routing"], ans: 0 },
    { id: 60, type: "mcq", q: "Q60. Cloud service provider ka example?", options: ["AWS", "MySQL", "React", "Node"], ans: 0 },

    // --- Easy Coding (61-75) ---
    { id: 61, type: "coding", q: "Q61. Reverse a string in JavaScript.\nWrite a function `reverseString(str)` that returns the reversed string." },
    { id: 62, type: "coding", q: "Q62. Check palindrome string.\nWrite a function `isPalindrome(str)` returning true or false." },
    { id: 63, type: "coding", q: "Q63. Largest number in array find karo.\nWrite a function `findLargest(arr)`." },
    { id: 64, type: "coding", q: "Q64. Count vowels in string.\nWrite a function `countVowels(str)`." },
    { id: 65, type: "coding", q: "Q65. Remove duplicates from array.\nWrite a function `removeDuplicates(arr)`." },
    { id: 66, type: "coding", q: "Q66. Array sort ascending.\nWrite a function `sortArray(arr)`." },
    { id: 67, type: "coding", q: "Q67. Sum of array elements.\nWrite a function `sumArray(arr)`." },
    { id: 68, type: "coding", q: "Q68. Capitalize first letter of each word.\nWrite a function `capitalizeWords(str)`." },
    { id: 69, type: "coding", q: "Q69. Celsius → Fahrenheit convert function likho.\nWrite a function `celsiusToFahrenheit(c)`." },
    { id: 70, type: "coding", q: "Q70. Random number generator 1–100.\nWrite a function `generateRandom()`." },
    { id: 71, type: "coding", q: "Q71. Factorial using loop.\nWrite a function `factorial(n)`." },
    { id: 72, type: "coding", q: "Q72. Even/odd checker function.\nWrite a function `isEven(n)`." },
    { id: 73, type: "coding", q: "Q73. Merge two arrays.\nWrite a function `mergeArrays(arr1, arr2)`." },
    { id: 74, type: "coding", q: "Q74. Flatten nested array.\nWrite a function `flattenArray(arr)`." },
    { id: 75, type: "coding", q: "Q75. Second largest number find karo.\nWrite a function `secondLargest(arr)`." },

    // --- DOM Coding (76-80) ---
    { id: 76, type: "coding", q: "Q76. Button click par text change karo.\nWrite HTML and JS to change a `<p>` text on button click." },
    { id: 77, type: "coding", q: "Q77. Form validation (empty fields).\nWrite code to prevent form submission if fields are empty." },
    { id: 78, type: "coding", q: "Q78. Dark mode toggle banao.\nWrite code to toggle a 'dark-mode' class on the body." },
    { id: 79, type: "coding", q: "Q79. Textarea character counter.\nWrite code to show remaining characters out of 100 for a textarea." },
    { id: 80, type: "coding", q: "Q80. Image slider create karo.\nWrite code for a basic next/prev image slider." },

    // --- React Coding (81-88) ---
    { id: 81, type: "coding", q: "Q81. Counter app using useState.\nWrite a React component with +, -, and Reset buttons." },
    { id: 82, type: "coding", q: "Q82. Todo list add/delete.\nWrite a React component to add and remove items from a list." },
    { id: 83, type: "coding", q: "Q83. API fetch karke data display.\nWrite a React component that fetches data using useEffect and displays it." },
    { id: 84, type: "coding", q: "Q84. Search filter list.\nWrite a React component with an input field that filters a list of names." },
    { id: 85, type: "coding", q: "Q85. Controlled form component.\nWrite a React form component with controlled inputs and submission." },
    { id: 86, type: "coding", q: "Q86. React Router 3 pages setup.\nWrite the app setup with react-router-dom for Home, About, and Contact." },
    { id: 87, type: "coding", q: "Q87. Context API global state.\nWrite a simple Context provider and consumer for theme (light/dark)." },
    { id: 88, type: "coding", q: "Q88. Debounce search input.\nWrite a custom hook or effect to debounce a search input by 500ms." },

    // --- Backend Coding (89-94) ---
    { id: 89, type: "coding", q: "Q89. Express server setup.\nWrite code to initialize a basic Express server listening on port 3000." },
    { id: 90, type: "coding", q: "Q90. GET API create karo.\nWrite an Express route to return a JSON array of users on GET /users." },
    { id: 91, type: "coding", q: "Q91. POST API JSON body.\nWrite an Express route that receives JSON data and returns it back." },
    { id: 92, type: "coding", q: "Q92. JWT authentication implement.\nWrite code to generate and verify a JWT token in Node.js." },
    { id: 93, type: "coding", q: "Q93. File upload using Multer.\nWrite the Express setup using Multer to accept single file uploads." },
    { id: 94, type: "coding", q: "Q94. MongoDB CRUD APIs.\nWrite basic Mongoose schema and Express routes for Create and Read operations." },

    // --- Full Stack + Advanced (95-100) ---
    { id: 95, type: "coding", q: "Q95. React → Node API integration.\nWrite the frontend `fetch` call and the corresponding Express backend route to handle user registration." },
    { id: 96, type: "coding", q: "Q96. Login system JWT + MongoDB.\nWrite the backend logic to find a user, compare password hash, and return a JWT." },
    { id: 97, type: "coding", q: "Q97. Protected routes implement.\nWrite an Express middleware to verify JWT before allowing access to a route." },
    { id: 98, type: "coding", q: "Q98. Role-based authentication.\nWrite logic to check if req.user.role === 'admin' before proceeding." },
    { id: 99, type: "coding", q: "Q99. URL Shortener design + code.\nWrite the basic Node.js logic to take a long URL, generate a short hash, save it, and redirect when visited." },
    { id: 100, type: "coding", q: "Q100. Real-time Chat App using Socket.io.\nWrite the Node.js Socket.io setup to emit and broadcast incoming messages." }
];
