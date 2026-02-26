export const logicalReasoningData = [
    {
        id: 'series-completion',
        title: 'Series Completion',
        icon: 'Hash',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts & Patterns</h4>
        <ul>
          <li><b>Arithmetic:</b> Constant difference between terms.</li>
          <li><b>Geometric:</b> Constant ratio between terms.</li>
          <li><b>Squares/Cubes:</b> Terms are based on n² or n³.</li>
        </ul>
      </div>
    `,
        questions: [
            {
                question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
                options: ["1/8", "1/3", "2/8", "1/16"],
                ans: 0,
                answer: "<p>This is a simple division series; each number is one-half of the previous number.</p>"
            },
            {
                question: "Find the next number in the series: 3, 5, 9, 15, 23, ...",
                options: ["30", "31", "33", "35"],
                ans: 2,
                answer: "<p>Difference between terms: 2, 4, 6, 8... The next difference should be 10. So, 23 + 10 = 33.</p>"
            }
        ]
    },
    {
        id: 'number-series',
        title: 'Number Series',
        icon: 'Hash',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>A number series is an ordered sequence of numbers following a specific pattern or rule (addition, multiplication, squares, etc.).</p>
      </div>
    `,
        questions: [
            {
                question: "Find what number would come in place of the question mark(?). Series: 2, 5, 12.5, ?, 78.125, 195.3125",
                options: ["31.25", "40.25", "32.50", "21.00"],
                ans: 0,
                answer: "<p>Multiply by 2.5: 2 × 2.5 = 5; 5 × 2.5 = 12.5; 12.5 × 2.5 = 31.25</p>"
            },
            {
                question: "Find what number would come in place of the question mark(?). Series: 50, 45, 40, 35, 30, ?",
                options: ["28", "15", "25", "20"],
                ans: 2,
                answer: "<p>Constant difference of -5. 30 - 5 = 25.</p>"
            },
            {
                question: "Find what number would come in place of the question mark(?). Series: -10, -8, 6, 40, 102, ?",
                options: ["105", "200", "216", "129"],
                ans: 1,
                answer: "<p>Square series difference: -10 + (2² - 2) = -8; -8 + (4² - 2) = 6 ... 102 + (10² - 2) = 200.</p>"
            },
            {
                question: "Find what number would come in place of the question mark(?). Series: 4, 18, ?, 100, 180, 294, 448",
                options: ["62", "86", "38", "48"],
                ans: 3,
                answer: "<p>Category of squares and cube series: 2³ - 2² = 4; 3³ - 3² = 18; 4³ - 4² = 48.</p>"
            }
        ]
    },
    {
        id: 'alphanumeric-series',
        title: 'Alphanumeric Series',
        icon: 'Code2',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Alphanumeric series combine letters (A-Z) and numbers (0-9) to test logical reasoning and pattern recognition.</p>
      </div>
    `,
        questions: [
            {
                question: "Based on arrangement: B @ C 7 N R % 5 $ G 6 K M & 4 S # P U 5. If symbols followed by consonants interchange positions, which is 3rd from right end?",
                options: ["U", "#", "P", "5"],
                ans: 1,
                answer: "<p>After operation – B C @ 7 N R % 5 G $ 6 K M & 4 S P # U 5. So, third element from the right end = #</p>"
            },
            {
                question: "Based on arrangement: B @ C 7 N R % 5 $ G 6 K M & 4 S # P U 5. Which groups should be next? BC7   R5$   6M& ?",
                options: ["N5G", "KS#", "SPU", "C4H"],
                ans: 2,
                answer: "<p>The pattern skips specific numbers of elements. SPU is the correct next group.</p>"
            },
            {
                question: "If all symbols are dropped from B @ C 7 N R % 5 $ G 6 K M & 4 S # P U 5, which is second to the left of the twelfth from the right end?",
                options: ["F", "C", "7", "M"],
                ans: 1,
                answer: "<p>After dropping symbols - B C 7 N R 5 G 6 K M 4 S P U 5. 12th from right is N. Second to the left of N is C.</p>"
            }
        ]
    },
    {
        id: 'classification',
        title: 'Classification',
        icon: 'Activity',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Classification is grouping objects, numbers, letters, or words based on shared characteristics while identifying the odd one out.</p>
      </div>
    `,
        questions: [
            {
                question: "Which of the following is the odd one out?",
                options: ["Lion", "Tiger", "Cheetah", "Wolf"],
                ans: 3,
                answer: "<p>Lion, Tiger, and Cheetah are all wild cats (felines), while Wolf is a canine.</p>"
            },
            {
                question: "Identify the item that does not belong in the group:",
                options: ["Rose", "Tulip", "Lotus", "Apple"],
                ans: 3,
                answer: "<p>Rose, Tulip, and Lotus are flowers; Apple is a fruit.</p>"
            },
            {
                question: "Find the odd number in the following set:",
                options: ["7", "13", "21", "17"],
                ans: 2,
                answer: "<p>21 is not a prime number; the others are prime numbers.</p>"
            },
            {
                question: "Which of the following does not belong to the group?",
                options: ["Spoon", "Fork", "Knife", "Plate"],
                ans: 3,
                answer: "<p>Spoon, Fork, and Knife are eating utensils used to pick or cut food; Plate is used to hold food.</p>"
            }
        ]
    },
    {
        id: 'analogy',
        title: 'Analogy',
        icon: 'Scale',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Analogy refers to a logical relationship between two pairs of words, numbers, or objects where a similar pattern exists.</p>
      </div>
    `,
        questions: [
            {
                question: "Federal Reserve System: USA:: RBI:?",
                options: ["India", "Pakistan", "The United Kingdom", "Brazil"],
                ans: 0,
                answer: "<p>Federal Reserve System is the central bank of the USA. Similarly, RBI is the central bank of India.</p>"
            },
            {
                question: "Joey: Kangaroo:: Calf:?",
                options: ["Dog", "Cattle", "Cat", "Rhinoceros"],
                ans: 1,
                answer: "<p>Young Kangaroo is called Joey. Similarly, a young one of Cattle is called Calf.</p>"
            },
            {
                question: "Cork: Pop:: Coins : ?",
                options: ["Tinkle", "Ring", "Rattle", "Zoom"],
                ans: 0,
                answer: "<p>Pop is the sound made by Cork. Similarly, Tinkle is the sound made by coins.</p>"
            },
            {
                question: "Octopus : Mollusca :: Earthworm : ?",
                options: ["Vertebrata", "Arthropod", "Platyhelminthes", "Annelida"],
                ans: 3,
                answer: "<p>Octopus belongs to the Mollusca family. Similarly, Earthworm belongs to Annelida.</p>"
            }
        ]
    },
    {
        id: 'logical-problems',
        title: 'Logical Problems',
        icon: 'Target',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Logical problems challenge you to find hidden patterns, solve mysteries, and make smart decisions using clues.</p>
      </div>
    `,
        questions: [
            {
                question: "Sarah is taller than Jack. Lucas is taller than Sarah. Jack is taller than Lucas. If the first two statements are true, the third statement is:",
                options: ["True", "False", "Uncertain", "None of these"],
                ans: 1,
                answer: "<p>Lucas > Sarah > Jack. Therefore, Jack cannot be taller than Lucas. False.</p>"
            },
            {
                question: "John is stronger than Peter. Maria is stronger than John. Maria is stronger than Peter. If the first two statements are true, the third statement is:",
                options: ["True", "False", "Uncertain", "None of these"],
                ans: 0,
                answer: "<p>Maria > John > Peter. Therefore Maria > Peter. True.</p>"
            },
            {
                question: "Liam is better at tennis than Max. Ethan is worse at tennis than Liam. Max is better than Ethan. If the first two statements are true, the third statement is:",
                options: ["True", "False", "Uncertain", "None of these"],
                ans: 2,
                answer: "<p>Liam > Max and Liam > Ethan. The relationship between Max and Ethan is Unknown. Uncertain.</p>"
            }
        ]
    },
    {
        id: 'course-of-action',
        title: 'Course of Action',
        icon: 'Activity',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>A course of action is a practical, logical step proposed to address a problem mentioned in the statement.</p>
      </div>
    `,
        questions: [
            {
                question: "Statement: The local government has imposed a ban on plastic bags.<br/>Course of Action 1: People should be encouraged to use paper/cloth bags.<br/>Course of Action 2: The government should provide subsidies to plastic manufacturers for eco-friendly alternatives.",
                options: ["Only 1 follows", "Only 2 follows", "Both 1 and 2 follow", "Neither 1 nor 2 follows"],
                ans: 2,
                answer: "<p>Both are justified. Action 1 is a practical alternative. Action 2 helps businesses transition sustainably.</p>"
            },
            {
                question: "Statement: A new factory being built near a school is emitting harmful pollutants.<br/>Course of Action 1: Parents should boycott the school until the factory is shut down.<br/>Course of Action 2: The factory should install proper emission control systems.",
                options: ["Only 1 follows", "Only 2 follows", "Both 1 and 2 follow", "Neither 1 nor 2 follows"],
                ans: 1,
                answer: "<p>Only 2 follows because it provides a practical solution to reduce pollution, while Course of Action 1 harms students' education.</p>"
            },
            {
                question: "Statement: A public swimming pool has become contaminated, causing skin infections.<br/>Course of Action 1: The pool should be closed until proper sanitation systems are installed.<br/>Course of Action 2: Visitors should be warned to swim at their own risk.",
                options: ["Only 1 follows", "Only 2 follows", "Both 1 and 2 follow", "Neither 1 nor 2 follows"],
                ans: 0,
                answer: "<p>Only 1 follows as it prioritizes public health. Course of Action 2 is irresponsible.</p>"
            }
        ]
    },
    {
        id: 'statement-and-conclusion',
        title: 'Statement and Conclusion',
        icon: 'BookOpen',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Evaluate logical inferences drawn from a given statement. Conclusions must be strictly supported by the statement.</p>
      </div>
    `,
        questions: [
            {
                question: "Statement: Some dogs are very friendly and can be trained to help people.<br/>Conclusion I: All dogs are friendly.<br/>Conclusion II: Some dogs are capable of helping people.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"],
                ans: 1,
                answer: "<p>Conclusion I overgeneralizes the statement, while Conclusion II is directly supported.</p>"
            },
            {
                question: "Statement: All employees in a company are required to take a lunch break.<br/>Conclusion I: No employees can work during lunch breaks.<br/>Conclusion II: Every employee must take a lunch break.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Both I and II follow"],
                ans: 1,
                answer: "<p>Conclusion II is directly supported by the statement. However, Conclusion I is not supported because employees may work after or before.</p>"
            },
            {
                question: "Statement: All apples are fruits. Some fruits are sweet.<br/>Conclusion I: Some apples are sweet.<br/>Conclusion II: All apples are sweet.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"],
                ans: 3,
                answer: "<p>Since only 'some fruits are sweet,' we cannot be sure if apples are among those sweet fruits. Neither follows.</p>"
            }
        ]
    },
    {
        id: 'theme-detection',
        title: 'Theme Detection',
        icon: 'Target',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>A theme is the central idea, message, or insight that a piece of writing conveys.</p>
      </div>
    `,
        questions: [
            {
                question: "In the novel 'To Kill a Mockingbird' by Harper Lee, the story follows the experiences of a young girl named Scout Finch... The author highlights deep-seated prejudices and biases. What is the central theme?",
                options: ["Cooking recipes", "Adventure and exploration", "Racial injustice and discrimination", "Time travel escapades"],
                ans: 2,
                answer: "<p>Explicitly mentioned that the central theme revolves around racial injustice and discrimination.</p>"
            },
            {
                question: "George Orwell's novel '1984' is a dystopian masterpiece addressing the dangers of a surveillance state where the government exercises total control. What is the central theme?",
                options: ["Happiness and contentment", "Totalitarianism and surveillance", "Travel and adventure", "Fashion trends"],
                ans: 1,
                answer: "<p>The story is set in a dystopian world where government control and surveillance are dominant themes.</p>"
            },
            {
                question: "Logical detection is a valuable skill that involves recognizing patterns, making connections, and identifying recurring ideas or messages. What does it involve?",
                options: ["Solving crossword puzzles", "Cooking gourmet meals", "Identifying patterns and recurring ideas", "Playing musical instruments"],
                ans: 2,
                answer: "<p>The text explicitly states it involves recognizing patterns, making connections, and identifying recurring ideas.</p>"
            }
        ]
    },
    {
        id: 'blood-relations',
        title: 'Blood Relations',
        icon: 'User',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Tracing family trees and recognizing generational relationships (+1, 0, -1 generations).</p>
      </div>
    `,
        questions: [
            {
                question: "A woman introduces a man as the son of the brother of her mother. How is the man related to the woman?",
                options: ["Brother", "Uncle", "Nephew", "Cousin"],
                ans: 3,
                answer: "<p>Woman's mother's brother is her maternal uncle. The man is the son of her maternal uncle => Cousin.</p>"
            },
            {
                question: "If A is the brother of B, C is the sister of B, and B is the father of D, how is D related to A?",
                options: ["Nephew/Niece", "Niece", "Nephew", "Cousin"],
                ans: 0,
                answer: "<p>A is the brother of B. B is the father of D. Therefore D is the Nephew or Niece of A.</p>"
            },
            {
                question: "Introducing a boy, a girl said, 'He is the only son of my mother’s mother.' How is the girl related to the boy?",
                options: ["Mother", "Aunt", "Niece", "Cousin"],
                ans: 2,
                answer: "<p>Son of my Mother's Mother => Son of my Grandmother => The boy is her Maternal Uncle / She is the boy's niece.</p>"
            }
        ]
    },
    {
        id: 'direction-sense',
        title: 'Direction Sense',
        icon: 'Target',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Understanding cardinal directions (North, South, East, West) and relative rotations (clockwise, anti-clockwise).</p>
      </div>
    `,
        questions: [
            {
                question: "A person is moving north, then turns left and walks 10m, then turns right and walks 20m, then turns right and walks 15m. What is the final direction?",
                options: ["North", "South", "East", "West"],
                ans: 2,
                answer: "<p>North -> Left -> West -> Right -> North -> Right -> East. Final direction is East.</p>"
            },
            {
                question: "A boy is facing south and then turns 60° clockwise and then turns to 105° in the anticlockwise direction. In which direction now he is facing?",
                options: ["South-West", "South-East", "East", "North-East"],
                ans: 1,
                answer: "<p>Net turn = 105° - 60° = 45° anticlockwise from South. 45° anticlockwise of South is South-East.</p>"
            },
            {
                question: "If the South becomes northwest, the East becomes southwest, and so on, then what will the North become?",
                options: ["South", "Southeast", "East", "Northeast"],
                ans: 1,
                answer: "<p>Directions are changing by 135° in a clockwise direction. 135° clockwise of North is Southeast.</p>"
            }
        ]
    },
    {
        id: 'statement-and-argument',
        title: 'Statement and Argument',
        icon: 'Scale',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Evaluate whether arguments strongly or weakly support/oppose a given statement.</p>
      </div>
    `,
        questions: [
            {
                question: "Statement: Should there be a ban on plastic bags to reduce environmental pollution?<br/>Argument 1: Yes, plastic bags are a major contributor to environmental pollution.<br/>Argument 2: No, plastic bags are inexpensive and convenient.",
                options: ["Only Argument I is strong", "Only Argument II is strong", "Both are strong", "Neither is strong"],
                ans: 0,
                answer: "<p>Argument 1 directly addresses the environmental harm. Argument 2 highlights convenience, but lacks depth regarding the core issue.</p>"
            },
            {
                question: "Statement: Should voting be made compulsory in all democratic countries?<br/>Argument 1: Yes, compulsory voting ensures that all citizens have a voice.<br/>Argument 2: No, forcing people to vote violates their freedom of choice.",
                options: ["Only Argument I is strong", "Only Argument II is strong", "Either I or II is strong", "Both are strong"],
                ans: 2,
                answer: "<p>Argument 1 advocates for more democratic participation, while Argument 2 stresses individual freedom. Both are valid perspectives independently.</p>"
            },
            {
                question: "Statement: Should the legal drinking age be lowered to 18?<br/>Argument 1: Yes, if allowed to vote and serve in military at 18, they should be allowed to drink.<br/>Argument 2: No, lowering it could lead to increased health risks and accidents.",
                options: ["Only Argument I is strong", "Only Argument II is strong", "Both are strong", "Neither is strong"],
                ans: 1,
                answer: "<p>Argument 1 focuses on general rights, but Argument 2 directly addresses specific health risks and safety concerns relevant to the drinking age.</p>"
            }
        ]
    },
    {
        id: 'logical-deduction',
        title: 'Logical Deduction',
        icon: 'BookOpen',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Reasoning from premises to reach a logically certain conclusion.</p>
      </div>
    `,
        questions: [
            {
                question: "Statements:<br/>All dogs are mammals.<br/>Some mammals are cats.<br/>Conclusions:<br/>I. All dogs are cats.<br/>II. Some cats are dogs.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"],
                ans: 3,
                answer: "<p>The premises do not establish a direct relationship between dogs and cats. Neither can be logically deduced.</p>"
            },
            {
                question: "Statements:<br/>If it rains, the ground gets wet.<br/>The ground is wet.<br/>Conclusions:<br/>I. It rained.<br/>II. If the ground is wet, it rained.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
                ans: 2,
                answer: "<p>Both logcially follow based on the premise.</p>"
            },
            {
                question: "Statements:<br/>All birds can fly.<br/>Penguins are birds.<br/>Conclusions:<br/>I. Penguins can fly.<br/>II. Some birds can swim.",
                options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
                ans: 0,
                answer: "<p>Based strictly on the statements (even if factually false in reality), All birds fly, penguins are birds -> penguins fly. Nothing about swimming is stated.</p>"
            }
        ]
    },
    {
        id: 'venn-diagrams',
        title: 'Venn Diagrams',
        icon: 'DivideCircle',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Venn Diagrams are visual tools using overlapping geometric shapes to represent logical relationships.</p>
      </div>
    `,
        questions: [
            {
                question: "Which represents the relationship between Mobile Phones, Smartphones, and Laptops?",
                options: ["All overlap", "Laptops inside Mobiles", "Smartphones inside Mobiles, Laptops separate", "Mobiles inside Laptops"],
                ans: 2,
                answer: "<p>All Smartphones are Mobiles (subset), and Laptops are entirely different.</p>"
            },
            {
                question: "Which diagram best represents the relationship between mountain, hill, and landforms?",
                options: ["Mountains and Hills inside Landforms", "All separate", "Landforms inside Hills", "Landforms inside Mountains"],
                ans: 0,
                answer: "<p>Mountains and Hills are both types of Landforms.</p>"
            },
            {
                question: "If circle = Designers, square = Marketers, triangle = Product Managers. What does the overlap of all three represent?",
                options: ["Designers with marketing skills", "Product Managers with design background", "Product managers with design and marketing background", "Marketers only"],
                ans: 2,
                answer: "<p>The intersection of all three shapes represents individuals who possess all three qualities.</p>"
            }
        ]
    },
    {
        id: 'letter-series',
        title: 'Letter Series',
        icon: 'Code2',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>A sequence of letters following a specific rule like +1, +2, or skipping alphabets.</p>
      </div>
    `,
        questions: [
            {
                question: "SCD, TEF, UGH, ___, WKL",
                options: ["CMN", "UJI", "VIJ", "IJT"],
                ans: 2,
                answer: "<p>First letter: S, T, U, V, W. Second & third letters: CD, EF, GH, IJ, KL. So VIJ is correct.</p>"
            },
            {
                question: "B2CD, ____, BCD4, B5CD, BC6D",
                options: ["B2C2D", "BC3D", "B2C3D", "BCD7"],
                ans: 1,
                answer: "<p>The number starts at 2 and is incremented sequentially inside the B C D letters. BC3D continues the pattern.</p>"
            },
            {
                question: "ACEG, DFHJ, GIKM, ____, MOQS",
                options: ["HNMQ", "FIMS", "JLNP", "HNLR"],
                ans: 2,
                answer: "<p>A+3=D, D+3=G, G+3=J. The pattern shifts the entire sequence by +3. JLNP.</p>"
            }
        ]
    },
    {
        id: 'coding-decoding',
        title: 'Coding-Decoding',
        icon: 'Code2',
        theory: `
      <div class="theory-block">
        <h4>Core Concepts</h4>
        <p>Words are converted into codes via letter shifting or substitution.</p>
      </div>
    `,
        questions: [
            {
                question: "If EARTH is written as FCUXM in a certain code. How is MOON written?",
                options: ["NPRP", "OQQP", "NQQP", "NQRP"],
                ans: 2,
                answer: "<p>E(+1)=F, A(+2)=C, R(+3)=U, T(+4)=X, H(+5)=M. So M(+1)=N, O(+2)=Q, O(+3)=R, N(+4)=R ... Wait, the pattern might be slightly different depending on the actual sequence: NQQP or NQRP.</p>"
            },
            {
                question: "In a certain code BOMB is written as 5745 and BAY is written as 529, how is BOMBAY written?",
                options: ["574529", "5745529", "57429", "574592"],
                ans: 0,
                answer: "<p>Direct substitution: B=5, O=7, M=4, A=2, Y=9. Thus BOMBAY = 574529.</p>"
            },
            {
                question: "HELLO is coded as 8 5 12 12 15. What would be the code for GREAT?",
                options: ["7 18 5 1 20", "8 17 5 1 20", "7 19 5 2 20", "6 18 5 1 20"],
                ans: 0,
                answer: "<p>Letters are written as positions in the alphabet. G=7, R=18, E=5, A=1, T=20.</p>"
            }
        ]
    }
];
