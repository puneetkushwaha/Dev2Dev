export const fullStackExamQuestions = [
    // --- HTML (1-10) ---
    { id: 1, type: "mcq", q: "Q1. What is the full form of HTML?", options: ["Hyper Trainer Marking Language", "Hyper Text Marketing Language", "Hyper Text Markup Language", "Hyper Tool Mark Language"], ans: 2 },
    { id: 2, type: "mcq", q: "Q2. What is the <a> tag used for?", options: ["To add an image", "To create a link", "To create a table", "To submit a form"], ans: 1 },
    { id: 3, type: "mcq", q: "Q3. Which of the following is an example of a semantic tag?", options: ["<div>", "<span>", "<section>", "<b>"], ans: 2 },
    { id: 4, type: "mcq", q: "Q4. In which attribute is the image path specified?", options: ["href", "src", "link", "path"], ans: 1 },
    { id: 5, type: "mcq", q: "Q5. What is used to send form data to the server?", options: ["action", "method", "Both", "submit"], ans: 2 },
    { id: 6, type: "mcq", q: "Q6. Which tag is used for an ordered list?", options: ["<ul>", "<ol>", "<li>", "<dl>"], ans: 1 },
    { id: 7, type: "mcq", q: "Q7. Which tag is used to define a table row?", options: ["<td>", "<th>", "<tr>", "<table>"], ans: 2 },
    { id: 8, type: "mcq", q: "Q8. What is the correct syntax for an HTML comment?", options: ["// comment", "<!-- comment -->", "/* comment */", "** comment **"], ans: 1 },
    { id: 9, type: "mcq", q: "Q9. What is the correct syntax for a password input field?", options: ["<input type=\"text\">", "<input type=\"password\">", "<password>", "<input hidden>"], ans: 1 },
    { id: 10, type: "mcq", q: "Q10. Which tag is used to add a favicon?", options: ["<icon>", "<link rel=\"icon\">", "<fav>", "<meta icon>"], ans: 1 },

    // --- CSS (11-20) ---
    { id: 11, type: "mcq", q: "Q11. What is the full form of CSS?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Syntax", "Computer Style Sheets"], ans: 1 },
    { id: 12, type: "mcq", q: "Q12. How many ways are there to apply CSS?", options: ["1", "2", "3", "4"], ans: 2 },
    { id: 13, type: "mcq", q: "Q13. Which type of CSS has the highest priority?", options: ["External", "Internal", "Inline", "Browser default"], ans: 2 },
    { id: 14, type: "mcq", q: "Q14. Which property is used to enable Flexbox?", options: ["display: block", "display: flex", "flex: 1", "position: flex"], ans: 1 },
    { id: 15, type: "mcq", q: "Q15. How do you center-align flex items?", options: ["align-items: center", "text-align: center", "justify-text", "align-center"], ans: 0 },
    { id: 16, type: "mcq", q: "Q16. Which property is used to start a CSS Grid layout?", options: ["display: flex", "display: grid", "grid-start", "layout: grid"], ans: 1 },
    { id: 17, type: "mcq", q: "Q17. What does position: absolute depend on?", options: ["Body", "Parent with position: relative", "Screen", "Margin"], ans: 1 },
    { id: 18, type: "mcq", q: "Q18. What is the use of z-index?", options: ["Color change", "Layer order control", "Size change", "Opacity"], ans: 1 },
    { id: 19, type: "mcq", q: "Q19. What is a media query used for?", options: ["Animation", "Responsive design", "Grid", "Font"], ans: 1 },
    { id: 20, type: "mcq", q: "Q20. What does box-sizing: border-box do?", options: ["Removes border", "Includes padding in the width", "Doubles the height", "Adds margin"], ans: 1 },

    // --- JavaScript (21-35) ---
    { id: 21, type: "mcq", q: "Q21. How do you declare a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], ans: 3 },
    { id: 22, type: "mcq", q: "Q22. Which is the strict equality operator?", options: ["==", "===", "!=", "="], ans: 1 },
    { id: 23, type: "mcq", q: "Q23. What is the syntax for an arrow function?", options: ["function(){}", "()=>{}", "func=>{}", "arrow(){}"], ans: 1 },
    { id: 24, type: "mcq", q: "Q24. Which of the following is NOT a Promise state?", options: ["Pending", "Resolved", "Rejected", "Finished"], ans: 3 },
    { id: 25, type: "mcq", q: "Q25. What is Async/Await based on?", options: ["Callback", "Promise", "Loop", "Event"], ans: 1 },
    { id: 26, type: "mcq", q: "Q26. What is a Closure?", options: ["Function + lexical scope", "Loop", "Object", "Array"], ans: 0 },
    { id: 27, type: "mcq", q: "Q27. Hoisting applies to:", options: ["Variables", "Functions", "Both", "None"], ans: 2 },
    { id: 28, type: "mcq", q: "Q28. What is the type of NaN?", options: ["Number", "String", "Boolean", "Undefined"], ans: 0 },
    { id: 29, type: "mcq", q: "Q29. What is setTimeout?", options: ["A synchronous function", "An asynchronous function", "A loop", "An API"], ans: 1 },
    { id: 30, type: "mcq", q: "Q30. What is event bubbling?", options: ["Parent → Child", "Child → Parent", "Parallel", "None"], ans: 1 },
    { id: 31, type: "mcq", q: "Q31. Which of the following is a way to select DOM elements?", options: ["getElementById", "querySelector", "Both", "None"], ans: 2 },
    { id: 32, type: "mcq", q: "Q32. Which method is used to save data in localStorage?", options: ["setItem", "saveItem", "add", "push"], ans: 0 },
    { id: 33, type: "mcq", q: "Q33. Which function is used to add an event listener?", options: ["on()", "addEventListener()", "listen()", "bind()"], ans: 1 },
    { id: 34, type: "mcq", q: "Q34. What is preventDefault() used for?", options: ["To prevent the default action", "To delete an event", "To stop a function", "To clear the DOM"], ans: 0 },
    { id: 35, type: "mcq", q: "Q35. What is event delegation?", options: ["Attaching an event listener to a parent element", "Attaching multiple listeners to child elements", "Stopping event bubbles", "None"], ans: 0 },

    // --- React (36-45) ---
    { id: 36, type: "mcq", q: "Q36. What is React?", options: ["Framework", "Library", "Language", "Database"], ans: 1 },
    { id: 37, type: "mcq", q: "Q37. What is the benefit of the Virtual DOM?", options: ["Fast rendering", "Slow memory", "Security", "None"], ans: 0 },
    { id: 38, type: "mcq", q: "Q38. What is useState used for?", options: ["Routing", "State management", "API calls", "Styling"], ans: 1 },
    { id: 39, type: "mcq", q: "Q39. When does useEffect run?", options: ["After render", "Before render", "Never", "Only once"], ans: 0 },
    { id: 40, type: "mcq", q: "Q40. Are props immutable?", options: ["Yes", "No", "Sometimes", "Only in class components"], ans: 0 },
    { id: 41, type: "mcq", q: "Q41. What is a controlled component?", options: ["React controls the state", "DOM controls the state", "Redux controls it", "None"], ans: 0 },
    { id: 42, type: "mcq", q: "Q42. What is React Router used for?", options: ["Client-side routing", "Server routing", "API calls", "State management"], ans: 0 },
    { id: 43, type: "mcq", q: "Q43. What is the purpose of Redux?", options: ["Component state", "Global state management", "Routing", "Styling"], ans: 1 },
    { id: 44, type: "mcq", q: "Q44. Why is the key prop used?", options: ["For identification by React", "For styling lists", "For data fetching", "None"], ans: 0 },
    { id: 45, type: "mcq", q: "Q45. What is the syntax for a Fragment?", options: ["<></>", "<frag></frag>", "<div/>", "<React/>"], ans: 0 },

    // --- Backend / Node (46-50) ---
    { id: 46, type: "mcq", q: "Q46. Which engine does Node.js run on?", options: ["V8", "SpiderMonkey", "Chakra", "WebKit"], ans: 0 },
    { id: 47, type: "mcq", q: "Q47. What is Express?", options: ["A language", "A Node.js framework", "A database", "A browser"], ans: 1 },
    { id: 48, type: "mcq", q: "Q48. What does middleware do?", options: ["Modifies the request/response cycle", "Connects to the database", "Handles styling", "Handles routing"], ans: 0 },
    { id: 49, type: "mcq", q: "Q49. What is a REST API?", options: ["An architectural style", "A database", "A library", "A language"], ans: 0 },
    { id: 50, type: "mcq", q: "Q50. What is JWT used for?", options: ["Authentication", "Styling", "Routing", "Database indexing"], ans: 0 },

    // --- Database + DevOps (51-60) ---
    { id: 51, type: "mcq", q: "Q51. What is the main difference between SQL and NoSQL?", options: ["Relational vs Non-relational", "Fast vs Slow", "Paid vs Free", "None"], ans: 0 },
    { id: 52, type: "mcq", q: "Q52. What type of database is MongoDB?", options: ["Document store", "Key-value", "Graph", "Columnar"], ans: 0 },
    { id: 53, type: "mcq", q: "Q53. What is the purpose of a primary key?", options: ["Unique identification", "Foreign mapping", "Styling", "None"], ans: 0 },
    { id: 54, type: "mcq", q: "Q54. What is indexing used for?", options: ["Fast search", "Saving disk space", "Styling tables", "Data deletion"], ans: 0 },
    { id: 55, type: "mcq", q: "Q55. What is aggregation used for?", options: ["Data grouping & processing", "Data deletion", "Indexing", "None"], ans: 0 },
    { id: 56, type: "mcq", q: "Q56. Why is normalization done?", options: ["To reduce redundancy", "To increase redundancy", "To make the database slow", "None"], ans: 0 },
    { id: 57, type: "mcq", q: "Q57. What is Git?", options: ["A version control system", "A database", "A cloud provider", "A language"], ans: 0 },
    { id: 58, type: "mcq", q: "Q58. What is the full form of CI/CD?", options: ["Continuous Integration / Continuous Deployment", "Code Integration / Code Deployment", "Cloud Integration / Cloud Dev", "None"], ans: 0 },
    { id: 59, type: "mcq", q: "Q59. What does Docker do?", options: ["Containerization", "Styling", "Database management", "Routing"], ans: 0 },
    { id: 60, type: "mcq", q: "Q60. Which of the following is a cloud service provider?", options: ["AWS", "MySQL", "React", "Node"], ans: 0 },

    // --- Easy Coding (61-75) ---
    { id: 61, type: "coding", q: "Q61. Reverse a string in JavaScript.\nWrite a function `reverseString(str)` that returns the reversed string." },
    { id: 62, type: "coding", q: "Q62. Check if a string is a palindrome.\nWrite a function `isPalindrome(str)` returning true or false." },
    { id: 63, type: "coding", q: "Q63. Find the largest number in an array.\nWrite a function `findLargest(arr)`." },
    { id: 64, type: "coding", q: "Q64. Count the vowels in a string.\nWrite a function `countVowels(str)`." },
    { id: 65, type: "coding", q: "Q65. Remove duplicates from an array.\nWrite a function `removeDuplicates(arr)`." },
    { id: 66, type: "coding", q: "Q66. Sort an array in ascending order.\nWrite a function `sortArray(arr)`." },
    { id: 67, type: "coding", q: "Q67. Find the sum of all array elements.\nWrite a function `sumArray(arr)`." },
    { id: 68, type: "coding", q: "Q68. Capitalize the first letter of each word.\nWrite a function `capitalizeWords(str)`." },
    { id: 69, type: "coding", q: "Q69. Convert Celsius to Fahrenheit.\nWrite a function `celsiusToFahrenheit(c)`." },
    { id: 70, type: "coding", q: "Q70. Generate a random number between 1 and 100.\nWrite a function `generateRandom()`." },
    { id: 71, type: "coding", q: "Q71. Calculate factorial using a loop.\nWrite a function `factorial(n)`." },
    { id: 72, type: "coding", q: "Q72. Check if a number is even or odd.\nWrite a function `isEven(n)`." },
    { id: 73, type: "coding", q: "Q73. Merge two arrays.\nWrite a function `mergeArrays(arr1, arr2)`." },
    { id: 74, type: "coding", q: "Q74. Flatten a nested array.\nWrite a function `flattenArray(arr)`." },
    { id: 75, type: "coding", q: "Q75. Find the second largest number in an array.\nWrite a function `secondLargest(arr)`." },

    // --- DOM Coding (76-80) ---
    { id: 76, type: "coding", q: "Q76. Change text on button click.\nWrite HTML and JS to change a `<p>` text on button click." },
    { id: 77, type: "coding", q: "Q77. Form validation for empty fields.\nWrite code to prevent form submission if fields are empty." },
    { id: 78, type: "coding", q: "Q78. Create a dark mode toggle.\nWrite code to toggle a 'dark-mode' class on the body." },
    { id: 79, type: "coding", q: "Q79. Textarea character counter.\nWrite code to show remaining characters out of 100 for a textarea." },
    { id: 80, type: "coding", q: "Q80. Create an image slider.\nWrite code for a basic next/prev image slider." },

    // --- React Coding (81-88) ---
    { id: 81, type: "coding", q: "Q81. Counter app using useState.\nWrite a React component with +, -, and Reset buttons." },
    { id: 82, type: "coding", q: "Q82. Todo list with add/delete.\nWrite a React component to add and remove items from a list." },
    { id: 83, type: "coding", q: "Q83. Fetch API data and display it.\nWrite a React component that fetches data using useEffect and displays it." },
    { id: 84, type: "coding", q: "Q84. Search filter list.\nWrite a React component with an input field that filters a list of names." },
    { id: 85, type: "coding", q: "Q85. Controlled form component.\nWrite a React form component with controlled inputs and submission." },
    { id: 86, type: "coding", q: "Q86. React Router with 3 pages.\nWrite the app setup with react-router-dom for Home, About, and Contact." },
    { id: 87, type: "coding", q: "Q87. Context API for global state.\nWrite a simple Context provider and consumer for theme (light/dark)." },
    { id: 88, type: "coding", q: "Q88. Debounce search input.\nWrite a custom hook or effect to debounce a search input by 500ms." },

    // --- Backend Coding (89-94) ---
    { id: 89, type: "coding", q: "Q89. Express server setup.\nWrite code to initialize a basic Express server listening on port 3000." },
    { id: 90, type: "coding", q: "Q90. Create a GET API.\nWrite an Express route to return a JSON array of users on GET /users." },
    { id: 91, type: "coding", q: "Q91. POST API with JSON body.\nWrite an Express route that receives JSON data and returns it back." },
    { id: 92, type: "coding", q: "Q92. Implement JWT authentication.\nWrite code to generate and verify a JWT token in Node.js." },
    { id: 93, type: "coding", q: "Q93. File upload using Multer.\nWrite the Express setup using Multer to accept single file uploads." },
    { id: 94, type: "coding", q: "Q94. MongoDB CRUD APIs.\nWrite basic Mongoose schema and Express routes for Create and Read operations." },

    // --- Full Stack + Advanced (95-100) ---
    { id: 95, type: "coding", q: "Q95. React to Node API integration.\nWrite the frontend `fetch` call and the corresponding Express backend route to handle user registration." },
    { id: 96, type: "coding", q: "Q96. Login system with JWT + MongoDB.\nWrite the backend logic to find a user, compare password hash, and return a JWT." },
    { id: 97, type: "coding", q: "Q97. Implement protected routes.\nWrite an Express middleware to verify JWT before allowing access to a route." },
    { id: 98, type: "coding", q: "Q98. Role-based authentication.\nWrite logic to check if req.user.role === 'admin' before proceeding." },
    { id: 99, type: "coding", q: "Q99. URL Shortener design + code.\nWrite the basic Node.js logic to take a long URL, generate a short hash, save it, and redirect when visited." },
    { id: 100, type: "coding", q: "Q100. Real-time Chat App using Socket.io.\nWrite the Node.js Socket.io setup to emit and broadcast incoming messages." }
];
