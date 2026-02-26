export const aptitudeData = [
    {
        id: 'numbers',
        title: 'Numbers',
        icon: 'Hash',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Dividend</b> = (Divisor × Quotient) + Remainder</li>
                    <li><b>Unit Digit Rules:</b> The unit digit of a number raised to a power depends on the cycle of the base's unit digit.
                        <ul>
                            <li>0, 1, 5, 6 always end in themselves.</li>
                            <li>4, 9 repeat in cycles of 2.</li>
                            <li>2, 3, 7, 8 repeat in cycles of 4.</li>
                        </ul>
                    </li>
                    <li><b>Number of Prime Factors:</b> If a number N = a^p × b^q × c^r (where a,b,c are prime), then total prime factors = p + q + r.</li>
                    <li><b>Divisibility Rules:</b>
                        <ul>
                            <li><b>By 3:</b> Sum of digits is divisible by 3.</li>
                            <li><b>By 4:</b> Last two digits divisible by 4.</li>
                            <li><b>By 8:</b> Last three digits divisible by 8.</li>
                            <li><b>By 11:</b> Difference between sum of odd and even placed digits is 0 or divisible by 11.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "When a number is divided by 35, 45, and 55, it leaves remainders 18, 28, and 38, respectively. Find the smallest such number?",
                options: ["3448", "3482", "3465", "3431"],
                ans: 0,
                answer: "<p>Take the LCM of the divisors 35, 45, and 55. We get 3465.<br>Now find the difference between each divisor and its corresponding remainder.<br>35 − 18 = 17<br>45 − 28 = 17<br>55 − 38 = 17<br>Since the difference is the same in each case, the required number is 17 less than the LCM.<br>Therefore, 3465 − 17 = 3448.</p>"
            },
            {
                question: "How many four-digit numbers are divisible by 7?",
                options: ["1280", "1286", "1300", "1284"],
                ans: 1,
                answer: "<p>Smallest four-digit number = 1000.<br>Divide: 1000 ÷ 7 ≈ 142.857<br>Next integer = 143, so first multiple = 143 × 7 = 1001<br>Largest four-digit number = 9999.<br>Divide: 9999 ÷ 7 ≈ 1428.428<br>Integer part = 1428, so last multiple = 1428 × 7 = 9996<br>So the sequence is: 1001, 1008, 1015, …, 9996<br>an = a1 + (n − 1)d => 9996 = 1001 + (n − 1)⋅7 => n = 1286.</p>"
            },
            {
                question: "Find the unit's digit in the product (17)^153 x (31)^62.",
                options: ["1", "3", "7", "9"],
                ans: 2,
                answer: "<p>The unit's digit would be the same as the unit's digit of 7^153 x 1^62. <br>Pattern in powers of 7: 7^1=7, 7^2=9, 7^3=3, 7^4=1. It repeats every 4 powers. <br>153 = 4 x 38 + 1, so 7^153 has the same unit digit as 7^1, which is 7. <br>31^62 ends in 1. <br>Therefore, 7 x 1 = 7.</p>"
            },
            {
                question: "Find the total number of prime factors in the expression (14)^11 x (7)^2 x (11)^3.",
                options: ["16", "27", "24", "18"],
                ans: 1,
                answer: "<p>(14)^11 x (7)^2 x (11)^3 = (2 x 7)^11 x (7)^2 x (11)^3 = (2)^11 x (7)^11 x (7)^2 x (11)^3 = (2)^11 x (7)^13 x (11)^3<br>Total number of prime factors = 11 + 13 + 3 = 27</p>"
            }
        ]
    },
    {
        id: 'work-wages',
        title: 'Work and Wages',
        icon: 'Clock',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li>If A can do a piece of work in <b>n</b> days, work done by A in 1 day = <b>1/n</b>.</li>
                    <li>If A's 1-day work is <b>1/n</b>, A can finish the whole work in <b>n</b> days.</li>
                    <li><b>Efficiency Ratio:</b> If A is twice as good a workman as B, then:<br>
                        Ratio of work done by A and B = 2:1.<br>
                        Ratio of times taken by A and B to finish a work = 1:2.
                    </li>
                    <li><b>Wages:</b> Wages are always distributed in proportion to the <b>amount of work done</b>, i.e., in the ratio of their efficiencies if they work for the same time.</li>
                    <li><b>Chain Rule Formula:</b> <code>(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2</code><br>
                    Where M = Men, D = Days, H = Hours, W = Work done.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "To complete the work, Person A takes 10 days and Person B takes 15 days. If they work together, how much time will they take to complete the work?",
                options: ["4 days", "5 days", "6 days", "8 days"],
                ans: 2,
                answer: "<p>Let the total work be LCM (10, 15) = 30 units<br>A's efficiency = 3 units / day<br>B's efficiency = 2 units / day<br>Combined efficiency = 5 units / day<br>Time taken = 30 / 5 = 6 days</p>"
            },
            {
                question: "Two friends A and B working together can complete an assignment in 4 days. If A can do the assignment alone in 12 days, in how many days can B alone do it?",
                options: ["6 days", "8 days", "10 days", "12 days"],
                ans: 0,
                answer: "<p>Total work = 12<br>A's efficiency = 1 unit / day<br>Combined efficiency = 3 units / day<br>B's efficiency = 2 units / day<br>Time taken by B = 12/2 = 6 days</p>"
            },
            {
                question: "45 men can dig a canal in 16 days. Six days after they started working, 30 more men joined them. In how many more days will the remaining work be completed?",
                options: ["4 days", "6 days", "8 days", "9 days"],
                ans: 1,
                answer: "<p>Total work = 45 x 16 = 720 units.<br>Work done in 6 days by 45 men = 270 units. Remaining = 450 units.<br>New workforce = 75 men.<br>More days required = 450 / 75 = 6 days.</p>"
            }
        ]
    },
    {
        id: 'pipes-cistern',
        title: 'Pipes and Cisterns',
        icon: 'FlaskConical',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Inlet:</b> A pipe connected with a tank or cistern that fills it.</li>
                    <li><b>Outlet:</b> A pipe connected with a tank or cistern that empties it.</li>
                    <li>If an inlet pipe fills a tank in <b>x</b> hours, part filled in 1 hour = <b>1/x</b>.</li>
                    <li>If an outlet pipe empties a full tank in <b>y</b> hours, part emptied in 1 hour = <b>1/y</b>.</li>
                    <li>If both inlet and outlet pipes are open simultaneously (and x < y), net part filled in 1 hour = <b>(1/x - 1/y)</b>.</li>
                    <li>If both are open (and y < x), net part emptied in 1 hour = <b>(1/y - 1/x)</b>.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Two pipes, A and B, can fill a tank separately in 12 and 16 hours, respectively. If both of them are opened together when the tank is empty, how much time will it take?",
                options: ["6.85 hours", "7.5 hours", "8 hours", "9.2 hours"],
                ans: 0,
                answer: "<p>Capacity = 48 units.<br>A's efficiency = 4 units/hr. B's efficiency = 3 units/hr.<br>Combined efficiency = 7 units/hr.<br>Time taken = 48 / 7 hours ≈ 6.85 hours.</p>"
            },
            {
                question: "A leak can empty a completely filled tank in 10 hours. If a tap is opened in a filled tank which admits 4 liters of water per minute, the leak takes 15 hours to empty the tank. How many litres does the tank hold?",
                options: ["6000 liters", "6800 liters", "7200 liters", "8400 liters"],
                ans: 2,
                answer: "<p>Leak A efficiency = -3 units/hour.<br>Combine efficiency = -2 units/hour.<br>Filling pipe B efficiency = 1 unit/hour.<br>B fills tank in 30 hours. Filling rate = 240L/hour.<br>Total capacity = 7200 liters.</p>"
            }
        ]
    },
    {
        id: 'speed-distance',
        title: 'Speed, Time & Distance',
        icon: 'Activity',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Speed</b> = Distance / Time</li>
                    <li><b>Time</b> = Distance / Speed</li>
                    <li><b>Distance</b> = Speed × Time</li>
                    <li><b>km/hr to m/s conversion:</b> x km/hr = (x × 5 / 18) m/s</li>
                    <li><b>m/s to km/hr conversion:</b> x m/s = (x × 18 / 5) km/hr</li>
                    <li><b>Average Speed:</b> If an object covers equal distances at speeds x and y, average speed = <b>(2xy) / (x + y)</b>.</li>
                    <li><b>Relative Speed:</b> 
                        <ul>
                            <li>Moving in the <b>same</b> direction: Speed = (Speed A - Speed B)</li>
                            <li>Moving in <b>opposite</b> directions: Speed = (Speed A + Speed B)</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Walking at the speed of 5 km/hr from his home, a geek misses his train by 7 minutes. Had he walked 1 km/hr faster, he would have reached the station 5 minutes before departure. Find the distance.",
                options: ["4 km", "5 km", "6 km", "7 km"],
                ans: 2,
                answer: "<p>Difference in time = 12 mins = 0.2 hours.<br>(d/5) - (d/6) = 0.2<br>d/30 = 0.2 => d = 6 km.</p>"
            },
            {
                question: "A policeman sighted a robber from a distance of 300 m. The robber ran at 8 km/hr and the policeman chased at 10 km/hr. Find the distance the robber would run before being caught.",
                options: ["1.0 km", "1.2 km", "1.5 km", "2.0 km"],
                ans: 1,
                answer: "<p>Relative speed = 2 km/hr.<br>Time taken to cover 300m (0.3 km) separation = 0.15 hours.<br>Distance run by robber = 8 * 0.15 = 1.2 km.</p>"
            }
        ]
    },
    {
        id: 'boats-streams',
        title: 'Boats and Streams',
        icon: 'Target',
        theory: `
             <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Upstream:</b> Boat moving against the flow of the stream.</li>
                    <li><b>Downstream:</b> Boat moving with the flow of the stream.</li>
                    <li>Let Speed of boat in still water = <b>u</b> km/hr and speed of stream = <b>v</b> km/hr.</li>
                    <li>Speed Downstream (D) = <b>(u + v)</b> km/hr</li>
                    <li>Speed Upstream (U) = <b>(u - v)</b> km/hr</li>
                    <li>Speed of boat in still water = <b>1/2(D + U)</b> km/hr</li>
                    <li>Speed of stream = <b>1/2(D - U)</b> km/hr</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "A boatman can row a boat at the speed of 5 km/hr upstream and 15 km/hr downstream. Find the speed of the boat in still water.",
                options: ["5 km/hr", "8 km/hr", "10 km/hr", "15 km/hr"],
                ans: 2,
                answer: "<p>B - S = 5<br>B + S = 15<br>B = 10 km/hr (still water speed).</p>"
            }
        ]
    },
    {
        id: 'hcf-lcm',
        title: 'HCF and LCM',
        icon: 'DivideCircle',
        theory: `
             <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>HCF (Highest Common Factor):</b> The largest number that divides two or more numbers without leaving a remainder.</li>
                    <li><b>LCM (Lowest Common Multiple):</b> The smallest number that is a multiple of two or more numbers.</li>
                    <li><b>Product Formula:</b> Product of two numbers = Product of their HCF and LCM. <code>a × b = HCF(a,b) × LCM(a,b)</code></li>
                    <li><b>Fractions:</b>
                        <ul>
                            <li>LCM of fractions = LCM of Numerators / HCF of Denominators</li>
                            <li>HCF of fractions = HCF of Numerators / LCM of Denominators</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "If the HCF of two numbers is 12 and their LCM is 360, find the numbers given one is 120.",
                options: ["24", "36", "48", "60"],
                ans: 1,
                answer: "<p>HCF x LCM = a x b<br>12 x 360 = 120 x b<br>b = 36.</p>"
            }
        ]
    },
    {
        id: 'percentages',
        title: 'Percentages',
        icon: 'Percent',
        theory: `
             <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Percentage:</b> Meaning "per hundred". x% = x/100.</li>
                    <li><b>Percentage Change:</b> <code>(Final - Initial) / Initial × 100</code></li>
                    <li>If the price of a commodity increases by R%, the reduction in consumption so as not to increase expenditure is: <code>(R / (100 + R)) × 100%</code></li>
                    <li>If the price of a commodity decreases by R%, the increase in consumption so as not to decrease expenditure is: <code>(R / (100 - R)) × 100%</code></li>
                    <li><b>Successive Percentage Change:</b> If a number is increased/decreased by A% and then by B%, net change = <code>A + B + (AB/100)%</code>. Use negative signs for decreases.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "A seller marked up the price of an article by 20 % and then gave a discount of 20 %. Find what percent did he lose in the transaction.",
                options: ["No loss", "2% loss", "4% loss", "8% loss"],
                ans: 2,
                answer: "<p>An increase by R% followed by decrease by R% results in a net loss of (R/10)^2 %.<br>Net loss = 4%.</p>"
            },
            {
                question: "In an examination, 80% of the students passed in English, 85% in Mathematics, and 75% in both subjects. If 40 students failed in both, find the total number of students.",
                options: ["300", "400", "500", "600"],
                ans: 1,
                answer: "<p>Passed in at least one = 80 + 85 - 75 = 90%.<br>Failed in both = 10%.<br>10% of total = 40 => Total = 400 students.</p>"
            }
        ]
    },
    {
        id: 'profit-loss',
        title: 'Profit & Loss',
        icon: 'CircleDollarSign',
        theory: `
             <div class="theory-block">
                <h4>Core Concepts & Formulas</h4>
                <ul>
                    <li><b>Cost Price (CP):</b> The price at which an article is purchased.</li>
                    <li><b>Selling Price (SP):</b> The price at which an article is sold.</li>
                    <li><b>Profit:</b> SP > CP. Profit = SP - CP</li>
                    <li><b>Loss:</b> CP > SP. Loss = CP - SP</li>
                    <li><b>Profit Percentage:</b> <code>(Profit / CP) × 100</code></li>
                    <li><b>Loss Percentage:</b> <code>(Loss / CP) × 100</code></li>
                    <li><b>Discount Percentage:</b> Calculated on Marked Price (MP). <code>(Discount / MP) × 100</code></li>
                    <li>If an article is sold at a profit of P%, then SP = <code>((100+P)/100) × CP</code></li>
                    <li>If an article is sold at a loss of L%, then SP = <code>((100-L)/100) × CP</code></li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "A person buys a pen from a wholesaler at Rs. 10 for 20 pens. He sells those pens at Rs. 10 for 15 pens. Find his profit percent.",
                options: ["20%", "25%", "33.33%", "50%"],
                ans: 2,
                answer: "<p>CP = 10 / 20 = 0.5. SP = 10 / 15 = 0.66.<br>Profit % = (0.166 / 0.5) x 100 = 33.33%.</p>"
            },
            {
                question: "If the cost price of an article is 67 % of the selling price, what is the profit percent?",
                options: ["33%", "45.75%", "49.25%", "67%"],
                ans: 2,
                answer: "<p>Profit = SP - 0.67 SP = 0.33 SP.<br>Profit % = 0.33 / 0.67 x 100 = 49.25%.</p>"
            }
        ]
    }
];
