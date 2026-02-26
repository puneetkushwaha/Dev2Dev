export const verbalAbilityData = [
    {
        id: 'spotting-errors',
        title: 'Spotting Errors',
        icon: 'Target',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Rules</h4>
                <ul>
                    <li><b>Subject-Verb Agreement:</b> The verb must agree with its subject in number and person. Singular subjects take singular verbs, plural subjects take plural verbs.</li>
                    <li><b>Article Rules:</b> 'A' and 'an' are indefinite articles. 'The' is the definite article. Use 'an' before vowel sounds.</li>
                    <li><b>Preposition Usage:</b> Prepositions indicate place, time, direction, etc. (e.g., in, on, at, by, for, from, of).</li>
                    <li><b>Tense Consistency:</b> Maintain a consistent tense throughout a sentence unless a shift in time is indicated.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Find the part of the sentence that has an error: (A) The number of students / (B) present in the class / (C) are fifty. / (D) No error",
                options: ["(A)", "(B)", "(C)", "(D)"],
                ans: 2,
                answer: "<p>The error is in part (C). The subject 'The number of' is considered singular and takes a singular verb. It should be 'is fifty'.</p>"
            },
            {
                question: "Choose the correct sentence:",
                options: [
                    "He is one of the best student in the class.",
                    "He is one of the best students in the class.",
                    "He is one of best student in the class.",
                    "He is one of the bests students in the class."
                ],
                ans: 1,
                answer: "<p>The phrase 'one of the...' is always followed by a plural noun (students). So 'He is one of the best students' is correct.</p>"
            },
            {
                question: "Find the error: (A) I have been / (B) working on this project / (C) since three years. / (D) No error",
                options: ["(A)", "(B)", "(C)", "(D)"],
                ans: 2,
                answer: "<p>The error is in part (C). 'Since' is used for a point of time, whereas 'for' is used for a period of time. It should be 'for three years'.</p>"
            }
        ]
    },
    {
        id: 'synonyms',
        title: 'Synonyms',
        icon: 'BookOpen',
        theory: `
            <div class="theory-block">
                <h4>Core Vocabulary Strategy</h4>
                <ul>
                    <li><b>Topic Info:</b> Synonyms are words with similar meanings (e.g., Happy -> Joyful).</li>
                    <li><b>Context Clues:</b> Reading the word in a sentence often hints at its meaning.</li>
                    <li><b>Process of Elimination:</b> Discard options that are clearly antonyms or unrelated.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Choose the synonym for the word: OBSCURE",
                options: ["Clear", "Hidden", "Famous", "Exposed"],
                ans: 1,
                answer: "<p>Obscure means not discovered or known about; uncertain or hidden.</p>"
            },
            {
                question: "Choose the synonym for the word: ABANDON",
                options: ["Keep", "Cherish", "Leave", "Support"],
                ans: 2,
                answer: "<p>To abandon means to cease to support or look after someone; to forsake or leave.</p>"
            },
            {
                question: "Choose the synonym for the word: DILIGENT",
                options: ["Lazy", "Careless", "Hardworking", "Tired"],
                ans: 2,
                answer: "<p>Diligent means having or showing care and conscientiousness in one's work or duties (hardworking).</p>"
            }
        ]
    },
    {
        id: 'antonyms',
        title: 'Antonyms',
        icon: 'Scale',
        theory: `
            <div class="theory-block">
                <h4>Core Vocabulary Strategy</h4>
                <ul>
                    <li><b>Topic Info:</b> Antonyms are words with opposite meanings (e.g., Happy -> Sad).</li>
                    <li><b>Word Roots:</b> Recognizing prefixes like 'un-', 'dis-', or 'in-' which often denote opposites.</li>
                    <li><b>Double Checks:</b> Be careful not to accidentally select a synonym!</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Choose the antonym for the word: MITIGATE",
                options: ["Alleviate", "Aggravate", "Appease", "Soothe"],
                ans: 1,
                answer: "<p>Mitigate means to make less severe or painful. Its opposite is Aggravate, which means to make worse.</p>"
            },
            {
                question: "Choose the antonym for the word: TRANSPARENT",
                options: ["Clear", "Opaque", "Lucid", "Visible"],
                ans: 1,
                answer: "<p>Transparent means allowing light to pass through so that objects behind can be distinctly seen. The opposite is Opaque.</p>"
            },
            {
                question: "Choose the antonym for the word: BRAVE",
                options: ["Courageous", "Fearless", "Cowardly", "Bold"],
                ans: 2,
                answer: "<p>Brave means ready to face and endure danger or pain. The opposite is Cowardly.</p>"
            }
        ]
    },
    {
        id: 'selecting-words',
        title: 'Selecting Words',
        icon: 'Code2',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts</h4>
                <ul>
                    <li><b>Appropriate Choice:</b> Choose the word that best fits the blank without altering the meaning or grammar of the sentence.</li>
                    <li><b>Collocations:</b> Pay attention to words that naturally go together (e.g., 'make a decision', not 'do a decision').</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "He is _____ to his boss for the opportunities he was given.",
                options: ["thankful", "grateful", "appreciative", "obliged"],
                ans: 1,
                answer: "<p>'Grateful' is the most appropriate word to express deep appreciation towards a person (like a boss).</p>"
            },
            {
                question: "The government has decided to _____ a new policy on taxation.",
                options: ["introduce", "begin", "start", "create"],
                ans: 0,
                answer: "<p>Governments usually 'introduce' new policies. It's a formal and appropriate collocation.</p>"
            }
        ]
    },
    {
        id: 'spellings',
        title: 'Spellings',
        icon: 'Activity',
        theory: `
            <div class="theory-block">
                <h4>Spelling Rules</h4>
                <ul>
                    <li><b>I before E except after C:</b> (e.g., Receive, Believe).</li>
                    <li><b>Double Consonants:</b> Pay attention to words with double letters (e.g., Accommodation, Occurrence).</li>
                    <li><b>Prefixes and Suffixes:</b> Knowing how to attach them correctly without dropping necessary letters.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Find the correctly spelt word:",
                options: ["Accomodation", "Acommodation", "Accommodation", "Acomodation"],
                ans: 2,
                answer: "<p>The correct spelling has double 'c' and double 'm': Accommodation.</p>"
            },
            {
                question: "Find the correctly spelt word:",
                options: ["Occasion", "Ocasion", "Occassion", "Ocassion"],
                ans: 0,
                answer: "<p>The correct spelling has double 'c' and single 's': Occasion.</p>"
            },
            {
                question: "Find the correctly spelt word:",
                options: ["Supersede", "Supercede", "Suppercede", "Superside"],
                ans: 0,
                answer: "<p>The correct spelling is Supersede.</p>"
            }
        ]
    },
    {
        id: 'sentence-formation',
        title: 'Sentence Formation',
        icon: 'Hash',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts</h4>
                <ul>
                    <li><b>Structure:</b> Subject + Verb + Object (SVO) is the standard English sentence structure.</li>
                    <li><b>Logic:</b> The sentence must convey a logical and clear meaning.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Arrange the parts to form a meaningful sentence: P: the puzzle / Q: carefully / R: solved / S: he",
                options: ["S R P Q", "P R S Q", "S P R Q", "R S P Q"],
                ans: 0,
                answer: "<p>The correct order is Subject (He) + Verb (solved) + Object (the puzzle) + Adverb (carefully): He solved the puzzle carefully (S R P Q).</p>"
            },
            {
                question: "Arrange to form a sentence: P: to the market / Q: went / R: she / S: to buy vegetables",
                options: ["R Q P S", "P Q R S", "R S Q P", "S R Q P"],
                ans: 0,
                answer: "<p>The correct order is Subject + Verb + Destination + Purpose: She (R) went (Q) to the market (P) to buy vegetables (S).</p>"
            }
        ]
    },
    {
        id: 'ordering-of-words',
        title: 'Ordering of Words',
        icon: 'Hash',
        theory: `
            <div class="theory-block">
                <h4>Core Strategy</h4>
                <ul>
                    <li><b>Grammatical Links:</b> Look for pronouns, conjunctions, and articles that link words or clauses together.</li>
                    <li><b>Chronology:</b> Ensure the events follow a logical sequence.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "In the following question, arrange the given words in a meaningful sequence.\n1. Police 2. Punishment 3. Crime 4. Judge 5. Judgement",
                options: ["3, 1, 2, 4, 5", "1, 2, 4, 3, 5", "5, 4, 3, 2, 1", "3, 1, 4, 5, 2"],
                ans: 3,
                answer: "<p>The logical sequence is: First a Crime (3) is committed. Then Police (1) arrest the criminal. The criminal is presented before a Judge (4), who gives a Judgement (5), leading to Punishment (2).</p>"
            },
            {
                question: "Arrange the words in a logical order:\n1. Key 2. Door 3. Lock 4. Room 5. Switch on",
                options: ["5, 1, 2, 4, 3", "4, 2, 1, 5, 3", "1, 3, 2, 4, 5", "1, 2, 3, 5, 4"],
                ans: 2,
                answer: "<p>First take the Key(1), open the Lock(3) of the Door(2), enter the Room(4) and Switch on(5) the light.</p>"
            }
        ]
    },
    {
        id: 'sentence-correction',
        title: 'Sentence Correction',
        icon: 'Target',
        theory: `
            <div class="theory-block">
                <h4>Common Pitfalls</h4>
                <ul>
                    <li><b>Redundancy:</b> Avoid using words that repeat the same meaning (e.g., 'return back' -> 'return').</li>
                    <li><b>Modifiers:</b> Ensure adjectives and adverbs are placed near the words they modify.</li>
                    <li><b>Parallelism:</b> Items in a list should follow the same grammatical form (e.g., I like running, swimming, and hiking).</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Which of the following sentences is grammatically correct?",
                options: [
                    "I prefer tea than coffee.",
                    "I prefer tea to coffee.",
                    "I prefer tea from coffee.",
                    "I prefer tea over coffee."
                ],
                ans: 1,
                answer: "<p>'Prefer' is always followed by the preposition 'to'. So, 'I prefer tea to coffee' is correct.</p>"
            },
            {
                question: "Which sentence is correct?",
                options: [
                    "She is more smarter than her sister.",
                    "She is smarter than her sister.",
                    "She is smartest than her sister.",
                    "She is more smart than her sister."
                ],
                ans: 1,
                answer: "<p>Do not use double comparatives ('more smarter'). The comparative form of smart is 'smarter'.</p>"
            }
        ]
    },
    {
        id: 'sentence-improvement',
        title: 'Sentence Improvement',
        icon: 'Activity',
        theory: `
            <div class="theory-block">
                <h4>Strategy</h4>
                <ul>
                    <li><b>Identify the Issue:</b> Read the sentence and find the grammatical, idiomatic, or structural flaw in the underlined part.</li>
                    <li><b>Check Alternatives:</b> Substitute the given options into the sentence to see which one provides a better, correct meaning without changing the original intent.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Improve the bracketed part: The criminal was (hung) to death.",
                options: ["hanged", "hang", "hanging", "No improvement needed"],
                ans: 0,
                answer: "<p>When referring to the execution of a person, the past tense of hang is 'hanged'. 'Hung' is used for objects (like a picture hung on the wall).</p>"
            },
            {
                question: "Improve the bracketed part: If I (was) a king, I would help the poor.",
                options: ["am", "were", "have been", "No improvement needed"],
                ans: 1,
                answer: "<p>For hypothetical or imaginary situations (subjunctive mood), 'were' is used with all subjects. So, 'If I were a king' is correct.</p>"
            }
        ]
    },
    {
        id: 'completing-statements',
        title: 'Completing Statements',
        icon: 'Code2',
        theory: `
            <div class="theory-block">
                <h4>Core Concepts & Strategy</h4>
                <ul>
                    <li><b>Tone and Context:</b> Determine if the sentence requires a positive or negative word based on the overall tone.</li>
                    <li><b>Connector Words:</b> Look for words like 'although', 'because', 'however', which indicate the relationship between clauses.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "The jury _____ divided in their opinions.",
                options: ["was", "were", "is", "has been"],
                ans: 1,
                answer: "<p>When a collective noun indicates that members are acting individually or divided, it takes a plural verb. 'were' is correct.</p>"
            },
            {
                question: "Although he is wealthy, he is very _____.",
                options: ["generous", "miserly", "rich", "handsome"],
                ans: 1,
                answer: "<p>'Although' sets up a contrast. Since wealthy is a positive state, the blank should contrast with being open to spending, making 'miserly' (stingy) the best fit.</p>"
            }
        ]
    },
    {
        id: 'paragraph-formation',
        title: 'Paragraph Formation (Para Jumbles)',
        icon: 'BookOpen',
        theory: `
            <div class="theory-block">
                <h4>Tips for Para Jumbles</h4>
                <ul>
                    <li><b>Find the Opening Sentence:</b> Look for an independent sentence that introduces a topic or character. It usually acts as the topic sentence.</li>
                    <li><b>Look for Connecting Words:</b> Words like <i>However, Therefore, Thus, Finally, Moreover</i> usually cannot start a paragraph.</li>
                    <li><b>Pronoun Reference:</b> A pronoun (he/she/it/they) usually refers back to a noun in English. The sentence with the noun must come before the sentence with the pronoun.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Rearrange the sentences into a logical paragraph:\nP. He realized he had left his wallet at home.\nQ. John went to the supermarket to buy some groceries.\nR. He packed all the items in his cart and reached the billing counter.\nS. He had to leave the groceries and go back home.",
                options: ["Q D P S", "Q R P S", "P Q R S", "R P Q S"],
                ans: 1,
                answer: "<p>The logical flow is: John went to the supermarket (Q), added items to his cart (R), realized he had no wallet (P), and had to go back (S). So, QRPS is correct.</p>"
            },
            {
                question: "Rearrange the sentences:\nA. As a result, the flights were delayed.\nB. The weather was extremely foggy in the morning.\nC. Passengers were stranded at the airport for hours.\nD. They were eventually given accommodations in nearby hotels.",
                options: ["B A C D", "A B C D", "C D B A", "B C A D"],
                ans: 0,
                answer: "<p>B introduces the cause (fog). A gives the direct result (delayed flights). C explains the effect on people (stranded). D explains the final resolution (accommodations). BACD.</p>"
            }
        ]
    },
    {
        id: 'comprehension',
        title: 'Comprehension',
        icon: 'BookOpen',
        theory: `
            <div class="theory-block">
                <h4>Reading Strategies</h4>
                <ul>
                    <li><b>Skimming:</b> Quickly read the passage to get the main idea or gist.</li>
                    <li><b>Scanning:</b> Look for specific keywords, dates, names, or numbers mentioned in the questions.</li>
                    <li><b>Inference:</b> Sometimes answers are not directly stated. You have to infer the meaning based on the author's tone and context.</li>
                    <li><b>Avoid External Knowledge:</b> Answer strictly based on the information provided in the passage, not your prior knowledge.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Read the passage carefully: 'The rapid advancement of AI has brought enormous benefits to various industries, particularly in healthcare and finance. However, it also raises significant ethical concerns about data privacy and the displacement of human workers. Policymakers are struggling to keep up with the pace of innovation.'\n\nQuestion: According to the passage, what is a negative consequence of AI advancement?",
                options: ["Benefits to healthcare", "Pace of innovation", "Displacement of human workers", "Advancement in finance"],
                ans: 2,
                answer: "<p>The passage explicitly states that a significant ethical concern (negative consequence) is 'the displacement of human workers'.</p>"
            },
            {
                question: "Based on the same passage, which statement describes the situation of policymakers?",
                options: ["They are leading the innovation.", "They are finding it difficult to match the speed of AI growth.", "They are banning AI in healthcare.", "They are unconcerned about data privacy."],
                ans: 1,
                answer: "<p>The passage states 'Policymakers are struggling to keep up with the pace of innovation', which matches option 2.</p>"
            }
        ]
    },
    {
        id: 'idioms-and-phrases',
        title: 'Idioms and Phrases',
        icon: 'User',
        theory: `
            <div class="theory-block">
                <h4>Understanding Idioms</h4>
                <ul>
                    <li><b>Figurative Meaning:</b> Idioms do not mean what they literally say. For example, 'spill the beans' means to reveal a secret, not to drop actual beans.</li>
                    <li><b>Context is Key:</b> If you don't know the idiom, try to guess the meaning from how it is used in the sentence.</li>
                    <li><b>Common Themes:</b> Many idioms are related to body parts (keep an eye on), animals (let the cat out of the bag), or nature (under the weather).</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "What is the meaning of the idiom: 'Bite the bullet'?",
                options: ["To eat something hard", "To face a difficult situation courageously", "To avoid a problem", "To talk aggressively"],
                ans: 1,
                answer: "<p>'Bite the bullet' means to endure a painful or otherwise unpleasant situation that is seen as unavoidable.</p>"
            },
            {
                question: "What is the meaning of the idiom: 'Under the weather'?",
                options: ["Standing in the rain", "Feeling slightly unwell", "Being very angry", "Experiencing extreme cold"],
                ans: 1,
                answer: "<p>Feeling 'under the weather' means feeling slightly ill or not in good health.</p>"
            },
            {
                question: "What is the meaning of the idiom: 'To beat around the bush'?",
                options: ["To wander in a forest", "To search thoroughly", "To avoid coming to the point", "To hit someone secretly"],
                ans: 2,
                answer: "<p>'To beat around the bush' means to avoid talking about what is important; delaying or avoiding the main topic.</p>"
            }
        ]
    },
    {
        id: 'change-of-voice',
        title: 'Change of Voice (Active/Passive)',
        icon: 'Scale',
        theory: `
            <div class="theory-block">
                <h4>Rules of Conversion</h4>
                <ul>
                    <li><b>Subject-Object Swap:</b> The object of the active sentence becomes the subject of the passive sentence, and vice versa.</li>
                    <li><b>Verb Form:</b> Always use the third form of the verb (past participle) in passive voice, preceded by the appropriate form of 'be' (is, am, are, was, were, be, being, been).</li>
                    <li><b>Preposition 'by':</b> Add 'by' before the new object in the passive voice, though it is sometimes omitted if the subject is obvious.</li>
                    <li><b>Tense remains same:</b> Do not change the tense. (e.g., Simple Present stays Simple Present).</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Change to Passive Voice: 'The cat killed the mouse.'",
                options: [
                    "The mouse is killed by the cat.",
                    "The mouse was killed by the cat.",
                    "The mouse has been killed by the cat.",
                    "The mouse had been killed by the cat."
                ],
                ans: 1,
                answer: "<p>Active sentence is in Simple Past tense. Passive form: Object + was/were + V3 + by + Subject. -> 'The mouse was killed by the cat.'</p>"
            },
            {
                question: "Change to Active Voice: 'A song is being sung by her.'",
                options: [
                    "She is singing a song.",
                    "She sings a song.",
                    "She was singing a song.",
                    "She has sung a song."
                ],
                ans: 0,
                answer: "<p>Passive sentence is in Present Continuous tense ('is being sung'). Active form: Subject + is/am/are + V1-ing + Object. -> 'She is singing a song.'</p>"
            }
        ]
    },
    {
        id: 'change-of-speech',
        title: 'Change of Speech (Direct/Indirect)',
        icon: 'Activity',
        theory: `
            <div class="theory-block">
                <h4>Rules of Conversion</h4>
                <ul>
                    <li><b>Tense Change:</b> If the reporting verb is in the past tense (e.g., said), the tense of the reported speech changes to the corresponding past tense (Present -> Past, Past -> Past Perfect).</li>
                    <li><b>Pronoun Change:</b> First-person pronouns change according to the subject, second-person according to the object, and third-person doesn't change (SON rule: Subject-Object-No change).</li>
                    <li><b>Time & Place Words:</b> 'Now' changes to 'then', 'here' to 'there', 'today' to 'that day', 'tomorrow' to 'the following day', etc.</li>
                    <li><b>Conjunction:</b> Usually, 'that' connects the reporting verb and reported speech for declarative sentences.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Change into Indirect Speech: He said, 'I am working hard.'",
                options: [
                    "He said that he is working hard.",
                    "He said that he was working hard.",
                    "He said that I was working hard.",
                    "He says that he was working hard."
                ],
                ans: 1,
                answer: "<p>Reporting verb 'said' is past. 'I' changes to 'he' (matching subject). Present continuous 'am working' changes to past continuous 'was working'. -> 'He said that he was working hard.'</p>"
            },
            {
                question: "Change into Indirect Speech: She said to me, 'Are you going to the party?'",
                options: [
                    "She asked me if I am going to the party.",
                    "She told me that I was going to the party.",
                    "She asked me if I was going to the party.",
                    "She asked me whether she was going to the party."
                ],
                ans: 2,
                answer: "<p>For interrogative YES/NO questions, use 'if' or 'whether'. 'Said to' becomes 'asked'. 'Are you going' (Present Cont.) becomes 'was I going' -> statement form 'I was going'. -> 'She asked me if I was going to the party.'</p>"
            }
        ]
    },
    {
        id: 'verbal-analogies',
        title: 'Verbal Analogies',
        icon: 'Hash',
        theory: `
            <div class="theory-block">
                <h4>Identifying Relationships</h4>
                <ul>
                    <li><b>Create a Bridge Sentence:</b> Form a sentence that defines the relationship between the first pair of words, and apply it to the options.</li>
                    <li><b>Common Relationships:</b> Synonyms (Happy:Joy), Antonyms (Hot:Cold), Part to Whole (Wheel:Car), Tool to Worker (Saw:Carpenter), Cause to Effect (Fire:Ashes).</li>
                    <li><b>Precision Matters:</b> Ensure the relationship is exact and in the same order.</li>
                </ul>
            </div>
        `,
        questions: [
            {
                question: "Select the related word pair: DOCTOR : HOSPITAL :: ?",
                options: [
                    "Teacher : School",
                    "Farmer : Village",
                    "Plumber : Wrench",
                    "Chef : Food"
                ],
                ans: 0,
                answer: "<p>The relationship is 'Worker : Workplace'. A Doctor works in a Hospital just as a Teacher works in a School.</p>"
            },
            {
                question: "Select the related word pair: PEN : WRITE :: ?",
                options: [
                    "Book : Read",
                    "Knife : Cut",
                    "Chair : Sit",
                    "Car : Drive"
                ],
                ans: 1,
                answer: "<p>The relationship is 'Tool : Function'. A Pen is an instrument specifically used to Write, just as a Knife is an instrument specifically used to Cut. (A book is not a tool used TO read, it IS read. A car is a vehicle, not a basic hand tool).</p>"
            }
        ]
    }
];
