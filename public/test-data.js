// ✅ Fixed test-data.js - Removed export default, using global window object

window.default = {
  tests: [
    {
      id: "qa-test-1",
      name: "Quantitative Aptitude - Test 1",
      subject: "Quantitative Aptitude",
      duration: 30,
      questions: [
        {
          id: 1,
          instructions: "Study the Series Pattern.",
          questionEn: "Series-I: 15, 31, 64, 131, 266, 537\nSeries-II: 0.5, ?, ?, ?, ?, 73\n\nIf 73 is the nth term, find the value of n.",
          questionHi: "श्रृंखला-I: 15, 31, 64, 131, 266, 537\nश्रृंखला-II: 0.5, ?, ?, ?, ?, 73\n\nयदि 73 n वाँ पद है, तो n का मान ज्ञात करें।",
          options: ["4", "5", "6", "7", "8"],
          correctAnswer: 1,
          solution: "Pattern is 2n-1. In Series II, follow the same pattern starting from 0.5. The answer is 5."
        },
        {
          id: 2,
          instructions: "Data Interpretation",
          questionEn: "What is the total number of students enrolled in Engineering in 2020 and 2021?",
          questionHi: "2020 और 2021 में इंजीनियरिंग में नामांकित छात्रों की कुल संख्या क्या है?",
          options: ["1100", "1150", "1200", "1250", "1300"],
          correctAnswer: 1,
          solution: "Engineering 2020: 550, Engineering 2021: 600. Total = 1150 students."
        },
        {
          id: 3,
          instructions: "Simple Interest",
          questionEn: "Calculate the simple interest on Rs. 10,000 at 5% per annum for 3 years.",
          questionHi: "रु. 10,000 पर 5% प्रति वर्ष की दर से 3 वर्ष के लिए साधारण ब्याज की गणना करें।",
          options: ["Rs. 1,500", "Rs. 1,800", "Rs. 2,000", "Rs. 2,500", "Rs. 3,000"],
          correctAnswer: 0,
          solution: "SI = (P × R × T) / 100 = (10000 × 5 × 3) / 100 = Rs. 1,500"
        },
        {
          id: 4,
          instructions: "Percentage",
          questionEn: "If 60% of 500 students are boys, how many girls are there?",
          questionHi: "यदि 500 छात्रों में 60% लड़के हैं, तो कितनी लड़कियाँ हैं?",
          options: ["150", "200", "250", "300", "350"],
          correctAnswer: 1,
          solution: "Boys = 60% of 500 = 300. Girls = 500 - 300 = 200."
        },
        {
          id: 5,
          instructions: "Ratio",
          questionEn: "If the ratio of two numbers is 5:6 and their sum is 66, find the smaller number.",
          questionHi: "यदि दो संख्याओं का अनुपात 5:6 है और उनका योग 66 है, तो छोटी संख्या ज्ञात करें।",
          options: ["30", "36", "42", "48", "54"],
          correctAnswer: 0,
          solution: "5x + 6x = 66, 11x = 66, x = 6. Smaller = 30."
        },
        {
          id: 6,
          instructions: "Time and Work",
          questionEn: "A in 12 days, B in 15 days. Together?",
          questionHi: "A 12 दिन में, B 15 दिन में। एक साथ?",
          options: ["6 days", "6.67 days", "7 days", "8 days", "9 days"],
          correctAnswer: 1,
          solution: "1/12 + 1/15 = 9/60 = 3/20. Time = 6.67 days."
        },
        {
          id: 7,
          instructions: "Speed & Distance",
          questionEn: "Train at 60 km/h. Distance in 3 hours?",
          questionHi: "60 किमी/घंटा। 3 घंटे में?",
          options: ["150 km", "160 km", "170 km", "180 km", "190 km"],
          correctAnswer: 3,
          solution: "60 × 3 = 180 km"
        },
        {
          id: 8,
          instructions: "Profit Loss",
          questionEn: "CP 500, SP 600. Profit %?",
          questionHi: "CP 500, SP 600. लाभ %?",
          options: ["15%", "20%", "25%", "30%", "35%"],
          correctAnswer: 1,
          solution: "(100/500) × 100 = 20%"
        },
        {
          id: 9,
          instructions: "Average",
          questionEn: "Average of 10, 20, 30, 40, 50?",
          questionHi: "10, 20, 30, 40, 50 का औसत?",
          options: ["25", "30", "35", "40", "45"],
          correctAnswer: 1,
          solution: "150/5 = 30"
        },
        {
          id: 10,
          instructions: "Compound Interest",
          questionEn: "P=5000, R=10%, T=2 years. CI?",
          questionHi: "P=5000, R=10%, T=2. CI?",
          options: ["Rs. 1,000", "Rs. 1,050", "Rs. 1,100", "Rs. 1,150", "Rs. 1,200"],
          correctAnswer: 1,
          solution: "5000 × 1.21 - 5000 = 1050"
        }
      ]
    },
    {
      id: "reasoning-test-1",
      name: "Reasoning Ability - Test 1",
      subject: "Reasoning Ability",
      duration: 45,
      questions: [
        { id: 1, instructions: "Series", questionEn: "A, B, D, G, K, ?", questionHi: "A, B, D, G, K, ?", options: ["L", "M", "N", "O", "P"], correctAnswer: 2, solution: "+1, +2, +3... N" },
        { id: 2, instructions: "Vowels", questionEn: "Remove vowels from COMPUTER", questionHi: "COMPUTER से स्वर निकालें", options: ["4", "5", "6", "7", "8"], correctAnswer: 1, solution: "5 letters" },
        { id: 3, instructions: "Odd", questionEn: "2, 4, 8, 16, 20 - odd?", questionHi: "2, 4, 8, 16, 20 - विषम?", options: ["2", "8", "16", "20", "32"], correctAnswer: 3, solution: "20" },
        { id: 4, instructions: "Code", questionEn: "CAT→DBU, DOG→?", questionHi: "CAT→DBU, DOG→?", options: ["EPI", "EPH", "FPI", "FPH", "EPJ"], correctAnswer: 0, solution: "EPI" },
        { id: 5, instructions: "Code", questionEn: "SOUTH=12345, NORTH=67845, THRONE=?", questionHi: "SOUTH=12345, NORTH=67845, THRONE=?", options: ["854768", "845678", "845687", "845768", "854678"], correctAnswer: 3, solution: "845768" },
        { id: 6, instructions: "Series", questionEn: "31, 29, 24, 22, 17, ?", questionHi: "31, 29, 24, 22, 17, ?", options: ["15", "14", "13", "12", "11"], correctAnswer: 1, solution: "14" },
        { id: 7, instructions: "Different", questionEn: "Apple, Banana, Carrot, Mango", questionHi: "Apple, Banana, Carrot, Mango", options: ["Apple", "Banana", "Carrot", "Mango", "Orange"], correctAnswer: 2, solution: "Carrot (vegetable)" },
        { id: 8, instructions: "Code", questionEn: "FLOWER=EKNVDQ, GARDEN=?", questionHi: "FLOWER=EKNVDQ, GARDEN=?", options: ["FZQCDM", "FZQCEM", "FZPCEM", "FZQCEN", "FZQCFM"], correctAnswer: 0, solution: "FZQCDM" },
        { id: 9, instructions: "Relation", questionEn: "Photo - whose? Father is my father's son", questionHi: "फोटो किसकी? पिता मेरे पिता का बेटा", options: ["His son", "His father", "Cousin", "He himself", "His brother"], correctAnswer: 0, solution: "His son" },
        { id: 10, instructions: "Days", questionEn: "Day before yesterday = Monday, 3 days after tomorrow?", questionHi: "कल से 2 दिन पहले = सोमवार, कल के 3 दिन बाद?", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], correctAnswer: 2, solution: "Wednesday" }
      ]
    },
    {
      id: "english-test-1",
      name: "English Language - Test 1",
      subject: "English Language",
      duration: 20,
      questions: [
        { id: 1, instructions: "Synonym", questionEn: "ABRIDGE = ?", questionHi: "ABRIDGE = ?", options: ["Expand", "Shorten", "Praise", "Destroy", "Lengthen"], correctAnswer: 1, solution: "Shorten" },
        { id: 2, instructions: "Antonym", questionEn: "BENIGN = ?", questionHi: "BENIGN = ?", options: ["Kind", "Gentle", "Harsh", "Soft", "Mild"], correctAnswer: 2, solution: "Harsh" },
        { id: 3, instructions: "Tense", questionEn: "He _____ Delhi last week", questionHi: "वह _____ दिल्ली गया", options: ["go", "gone", "went", "going", "goes"], correctAnswer: 2, solution: "went" },
        { id: 4, instructions: "Part of Speech", questionEn: "She sings beautifully - beautifully?", questionHi: "beautifully है?", options: ["Adjective", "Noun", "Adverb", "Verb", "Pronoun"], correctAnswer: 2, solution: "Adverb" },
        { id: 5, instructions: "Error", questionEn: "Each of boys have done homework", questionHi: "गलती?", options: ["Each", "of boys", "have done", "homework", "No error"], correctAnswer: 2, solution: "have → has" },
        { id: 6, instructions: "Synonym", questionEn: "OBSTINATE = ?", questionHi: "OBSTINATE = ?", options: ["Flexible", "Stubborn", "Gentle", "Calm", "Yielding"], correctAnswer: 1, solution: "Stubborn" },
        { id: 7, instructions: "Spelling", questionEn: "Correct spelling?", questionHi: "सही स्पेलिंग?", options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate", "Acommmodate"], correctAnswer: 2, solution: "Accommodate" },
        { id: 8, instructions: "Comprehension", questionEn: "Main idea of passage?", questionHi: "अनुच्छेद का मुख्य विचार?", options: ["Option A", "Option B", "Option C", "Option D", "Option E"], correctAnswer: 0, solution: "Context dependent" },
        { id: 9, instructions: "Tense", questionEn: "By next year, she _____ degree", questionHi: "अगले साल तक, वह _____ डिग्री", options: ["will complete", "will have completed", "completed", "has completed", "completes"], correctAnswer: 1, solution: "will have completed" },
        { id: 10, instructions: "Idiom", questionEn: "'Break the ice' means?", questionHi: "'Break the ice' मतलब?", options: ["Shatter", "Start conversation", "Cancel", "Angry", "Promise"], correctAnswer: 1, solution: "Start conversation" }
      ]
    }
  ]
};

console.log('✅ Test data loaded - window.default available');
