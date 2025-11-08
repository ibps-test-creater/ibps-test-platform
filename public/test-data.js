// ✅ Complete Test Data Structure
// This file exports default object with all tests
// Includes 3 sample tests: QA, Reasoning, English

export default {
  tests: [
    {
      id: "qa-test-1",
      name: "Quantitative Aptitude - Test 1",
      subject: "Quantitative Aptitude",
      duration: 30,
      questions: [
        {
          id: 1,
          instructions: "Study the Series Pattern. Questions below are based on the given Series-I. The series-I satisfy a certain pattern, follow the same pattern in Series-II and answer the questions given below.",
          questionEn: "Series-I: 15, 31, 64, 131, 266, 537\nSeries-II: 0.5, ?, ?, ?, ?, 73\n\nIf 73 is the nth term, find the value of n.",
          questionHi: "श्रृंखला-I: 15, 31, 64, 131, 266, 537\nश्रृंखला-II: 0.5, ?, ?, ?, ?, 73\n\nयदि 73 n वाँ पद है, तो n का मान ज्ञात करें।",
          options: ["4", "5", "6", "7", "8"],
          correctAnswer: 1,
          solution: "Pattern is 2n-1. In Series II, follow the same pattern starting from 0.5. The answer is 5."
        },
        {
          id: 2,
          instructions: "Data Interpretation. Following table shows the number of students enrolled in different courses at a university over 5 years.",
          questionEn: "What is the total number of students enrolled in Engineering in 2020 and 2021?",
          questionHi: "2020 और 2021 में इंजीनियरिंग में नामांकित छात्रों की कुल संख्या क्या है?",
          options: ["1100", "1150", "1200", "1250", "1300"],
          correctAnswer: 1,
          solution: "Engineering 2020: 550, Engineering 2021: 600. Total = 1150 students."
        },
        {
          id: 3,
          instructions: "Simple Interest Problem. Read the following information carefully and answer the questions.",
          questionEn: "Calculate the simple interest on Rs. 10,000 at 5% per annum for 3 years.",
          questionHi: "रु. 10,000 पर 5% प्रति वर्ष की दर से 3 वर्ष के लिए साधारण ब्याज की गणना करें।",
          options: ["Rs. 1,500", "Rs. 1,800", "Rs. 2,000", "Rs. 2,500", "Rs. 3,000"],
          correctAnswer: 0,
          solution: "SI = (P × R × T) / 100 = (10000 × 5 × 3) / 100 = Rs. 1,500"
        },
        {
          id: 4,
          instructions: "Percentage Problem. Study the following percentage-based question.",
          questionEn: "If 60% of 500 students are boys, how many girls are there?",
          questionHi: "यदि 500 छात्रों में 60% लड़के हैं, तो कितनी लड़कियाँ हैं?",
          options: ["150", "200", "250", "300", "350"],
          correctAnswer: 1,
          solution: "Boys = 60% of 500 = 300. Girls = 500 - 300 = 200."
        },
        {
          id: 5,
          instructions: "Ratio and Proportion. Study the ratio problem below.",
          questionEn: "If the ratio of two numbers is 5:6 and their sum is 66, find the smaller number.",
          questionHi: "यदि दो संख्याओं का अनुपात 5:6 है और उनका योग 66 है, तो छोटी संख्या ज्ञात करें।",
          options: ["30", "36", "42", "48", "54"],
          correctAnswer: 0,
          solution: "Let numbers be 5x and 6x. Then 5x + 6x = 66, so 11x = 66, x = 6. Smaller number = 5 × 6 = 30."
        },
        {
          id: 6,
          instructions: "Time and Work. A can complete a work in 12 days. B can complete the same work in 15 days.",
          questionEn: "If A and B work together, in how many days will they complete the work?",
          questionHi: "यदि A और B एक साथ काम करें, तो वे काम को कितने दिनों में पूरा करेंगे?",
          options: ["6 days", "6.67 days", "7 days", "8 days", "9 days"],
          correctAnswer: 1,
          solution: "A's work = 1/12, B's work = 1/15. Combined = 1/12 + 1/15 = 9/60 = 3/20. Time = 20/3 = 6.67 days."
        },
        {
          id: 7,
          instructions: "Speed, Distance and Time. A train travels at 60 km/h.",
          questionEn: "How much distance will it cover in 3 hours?",
          questionHi: "यह 3 घंटे में कितनी दूरी तय करेगी?",
          options: ["150 km", "160 km", "170 km", "180 km", "190 km"],
          correctAnswer: 3,
          solution: "Distance = Speed × Time = 60 × 3 = 180 km."
        },
        {
          id: 8,
          instructions: "Profit and Loss. Cost Price Rs. 500, Selling Price Rs. 600",
          questionEn: "What is the profit percentage?",
          questionHi: "लाभ प्रतिशत क्या है?",
          options: ["15%", "20%", "25%", "30%", "35%"],
          correctAnswer: 1,
          solution: "Profit = 600 - 500 = 100. Profit % = (100/500) × 100 = 20%."
        },
        {
          id: 9,
          instructions: "Average Problem. Find the average of these numbers: 10, 20, 30, 40, 50",
          questionEn: "Find the average of these 5 numbers.",
          questionHi: "इन 5 संख्याओं का औसत ज्ञात करें।",
          options: ["25", "30", "35", "40", "45"],
          correctAnswer: 1,
          solution: "Average = (10 + 20 + 30 + 40 + 50) / 5 = 150 / 5 = 30."
        },
        {
          id: 10,
          instructions: "Compound Interest. Principal Rs. 5,000, Rate 10% per annum, Time 2 years",
          questionEn: "Calculate the compound interest.",
          questionHi: "चक्रवृद्धि ब्याज की गणना करें।",
          options: ["Rs. 1,000", "Rs. 1,050", "Rs. 1,100", "Rs. 1,150", "Rs. 1,200"],
          correctAnswer: 1,
          solution: "A = P(1 + R/100)^T = 5000(1 + 10/100)^2 = 5000 × 1.21 = 6050. CI = 6050 - 5000 = Rs. 1,050."
        }
      ]
    },
    {
      id: "reasoning-test-1",
      name: "Reasoning Ability - Test 1",
      subject: "Reasoning Ability",
      duration: 45,
      questions: [
        {
          id: 1,
          instructions: "Reasoning Instructions",
          questionEn: "Find the missing term in the series: A, B, D, G, K, ?",
          questionHi: "श्रृंखला में लुप्त पद खोजें: A, B, D, G, K, ?",
          options: ["L", "M", "N", "O", "P"],
          correctAnswer: 2,
          solution: "The pattern increases by 1, 2, 3, 4, 5... so missing letter is N (K + 3 positions)."
        },
        {
          id: 2,
          instructions: "Reasoning Instructions",
          questionEn: "If all the vowels are removed from the word 'COMPUTER', how many letters are left?",
          questionHi: "'COMPUTER' शब्द से सभी स्वर निकालने पर कितने अक्षर बचते हैं?",
          options: ["4", "5", "6", "7", "8"],
          correctAnswer: 1,
          solution: "COMPUTER: Remove O, U, E. Remaining: C, M, P, T, R = 5 letters."
        },
        {
          id: 3,
          instructions: "Reasoning Instructions",
          questionEn: "Select the odd one out: 2, 4, 8, 16, 20",
          questionHi: "विषम को चुनें: 2, 4, 8, 16, 20",
          options: ["2", "8", "16", "20", "32"],
          correctAnswer: 3,
          solution: "All are powers of 2 except 20. 2=2^1, 4=2^2, 8=2^3, 16=2^4, but 20 is not."
        },
        {
          id: 4,
          instructions: "Reasoning Instructions",
          questionEn: "In a certain code, CAT is written as DBU. How is DOG written in that code?",
          questionHi: "एक निश्चित कोड में, CAT को DBU लिखा जाता है। DOG को उस कोड में कैसे लिखा जाता है?",
          options: ["EPI", "EPH", "FPI", "FPH", "EPJ"],
          correctAnswer: 0,
          solution: "Each letter is shifted by 1 position. D→E, O→P, G→I. So DOG = EPI."
        },
        {
          id: 5,
          instructions: "Reasoning Instructions",
          questionEn: "If SOUTH is coded as 12345 and NORTH as 67845, what is the code for THRONE?",
          questionHi: "यदि SOUTH को 12345 के रूप में कोडित किया गया है और NORTH को 67845, तो THRONE का कोड क्या है?",
          options: ["854768", "845678", "845687", "845768", "854678"],
          correctAnswer: 3,
          solution: "S=1, O=2, U=3, T=4, H=5, N=6, R=7. THRONE = 845768."
        },
        {
          id: 6,
          instructions: "Reasoning Instructions",
          questionEn: "Find the next term in the series: 31, 29, 24, 22, 17, ?",
          questionHi: "श्रृंखला में अगला पद खोजें: 31, 29, 24, 22, 17, ?",
          options: ["15", "14", "13", "12", "11"],
          correctAnswer: 1,
          solution: "Pattern: -2, -5, -2, -5... So 17 - 3 = 14."
        },
        {
          id: 7,
          instructions: "Reasoning Instructions",
          questionEn: "Choose the word which is different from the rest: Apple, Banana, Carrot, Mango",
          questionHi: "वह शब्द चुनें जो बाकी से अलग है: Apple, Banana, Carrot, Mango",
          options: ["Apple", "Banana", "Carrot", "Mango", "Orange"],
          correctAnswer: 2,
          solution: "Carrot is a vegetable, others are fruits."
        },
        {
          id: 8,
          instructions: "Reasoning Instructions",
          questionEn: "If in a certain language, FLOWER is coded as EKNVDQ, how is GARDEN coded?",
          questionHi: "यदि एक भाषा में, FLOWER को EKNVDQ के रूप में कोडित किया गया है, तो GARDEN को कैसे कोडित किया जाता है?",
          options: ["FZQCDM", "FZQCEM", "FZPCEM", "FZQCEN", "FZQCFM"],
          correctAnswer: 0,
          solution: "Each letter is shifted backward. F→E, L→K, O→N, W→V, E→D, R→Q. GARDEN = FZQCDM."
        },
        {
          id: 9,
          instructions: "Reasoning Instructions",
          questionEn: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
          questionHi: "एक फोटोग्राफ की ओर इशारा करते हुए, एक आदमी ने कहा, 'मेरा कोई भाई या बहन नहीं है लेकिन उस आदमी का पिता मेरे पिता का बेटा है।' यह किसकी फोटोग्राफ थी?",
          options: ["His son", "His father", "His cousin", "He himself", "His brother"],
          correctAnswer: 0,
          solution: "The speaker has no brother, so 'my father's son' is the speaker himself. So the man in photo is the speaker's son."
        },
        {
          id: 10,
          instructions: "Reasoning Instructions",
          questionEn: "If the day before yesterday was Monday, what day will it be three days after tomorrow?",
          questionHi: "यदि कल से दो दिन पहले सोमवार था, तो कल के तीन दिन बाद कौन सा दिन होगा?",
          options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          correctAnswer: 2,
          solution: "Day before yesterday = Monday, Yesterday = Tuesday, Today = Wednesday, Tomorrow = Thursday. Three days after tomorrow = Wednesday."
        }
      ]
    },
    {
      id: "english-test-1",
      name: "English Language - Test 1",
      subject: "English Language",
      duration: 20,
      questions: [
        {
          id: 1,
          instructions: "Direction: Choose the correct synonym for the given word.",
          questionEn: "Select the synonym of ABRIDGE.",
          questionHi: "ABRIDGE का पर्यायवाची चुनें।",
          options: ["Expand", "Shorten", "Praise", "Destroy", "Lengthen"],
          correctAnswer: 1,
          solution: "ABRIDGE means to shorten or reduce. Shorten is the correct synonym."
        },
        {
          id: 2,
          instructions: "Direction: Choose the correct antonym for the given word.",
          questionEn: "Select the antonym of BENIGN.",
          questionHi: "BENIGN का विलोम चुनें।",
          options: ["Kind", "Gentle", "Harsh", "Soft", "Mild"],
          correctAnswer: 2,
          solution: "BENIGN means kind or gentle. HARSH is the opposite."
        },
        {
          id: 3,
          instructions: "Direction: Fill in the blanks.",
          questionEn: "He ________ to Delhi last week.",
          questionHi: "वह पिछले हफ्ते दिल्ली ________ गया।",
          options: ["go", "gone", "went", "going", "goes"],
          correctAnswer: 2,
          solution: "Past tense is needed. 'went' is the correct past tense of 'go'."
        },
        {
          id: 4,
          instructions: "Direction: Identify the part of speech.",
          questionEn: "In the sentence 'She sings beautifully,' the word 'beautifully' is an?",
          questionHi: "'She sings beautifully' वाक्य में 'beautifully' शब्द है?",
          options: ["Adjective", "Noun", "Adverb", "Verb", "Pronoun"],
          correctAnswer: 2,
          solution: "BEAUTIFULLY modifies the verb 'sings' and ends in -ly, making it an adverb."
        },
        {
          id: 5,
          instructions: "Direction: Spot the error.",
          questionEn: "Each of the boys have done their homework.",
          questionHi: "प्रत्येक लड़के ने अपना होमवर्क किया है।",
          options: ["Each", "of the boys", "have done", "their homework", "No error"],
          correctAnswer: 2,
          solution: "The subject 'Each' is singular, so 'has' should be used instead of 'have'."
        },
        {
          id: 6,
          instructions: "Direction: Choose the correct option.",
          questionEn: "The synonym of OBSTINATE is?",
          questionHi: "OBSTINATE का पर्यायवाची है?",
          options: ["Flexible", "Stubborn", "Gentle", "Calm", "Yielding"],
          correctAnswer: 1,
          solution: "OBSTINATE means stubborn or inflexible. STUBBORN is the correct synonym."
        },
        {
          id: 7,
          instructions: "Direction: Choose the correct spelling.",
          questionEn: "Select the correctly spelt word.",
          questionHi: "सही तरीके से लिखा गया शब्द चुनें।",
          options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate", "Acommmodate"],
          correctAnswer: 2,
          solution: "The correct spelling is ACCOMMODATE with double C and double M."
        },
        {
          id: 8,
          instructions: "Direction: Reading comprehension.",
          questionEn: "What is the main idea of the passage? (Sample question)",
          questionHi: "अनुच्छेद का मुख्य विचार क्या है?",
          options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
          correctAnswer: 0,
          solution: "This depends on the actual passage provided."
        },
        {
          id: 9,
          instructions: "Direction: Choose the correct tense form.",
          questionEn: "By next year, she ________ her degree.",
          questionHi: "अगले साल तक, वह अपनी डिग्री ________ होगी।",
          options: ["will complete", "will have completed", "completed", "has completed", "completes"],
          correctAnswer: 1,
          solution: "Future Perfect tense is needed: 'will have completed'."
        },
        {
          id: 10,
          instructions: "Direction: Idioms and phrases.",
          questionEn: "Meaning of the idiom 'Break the ice' is?",
          questionHi: "मुहावरे 'Break the ice' का अर्थ है?",
          options: ["To shatter something", "To start a conversation", "To cancel a plan", "To make someone angry", "To break a promise"],
          correctAnswer: 1,
          solution: "'Break the ice' means to start or begin a conversation, especially after an awkward silence."
        }
      ]
    }
  ]
};
