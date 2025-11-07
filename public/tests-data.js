const testsData = {
  tests: [
    {
      id: "qa-test-1",
      name: "Quantitative Aptitude - Test 1",
      subject: "Quantitative Aptitude",
      duration: 30,
      questions: [
        {
          id: 1,
          instructions: "Study the Series Pattern\n\nThe questions below are based on the given Series-I. The series-I satisfy a certain pattern, follow the same pattern in Series-II and answer the questions given below.\n\nश्रृंखला पैटर्न का अध्ययन करें\n\नीचे दिए गए प्रश्न दिए गए श्रृंखला-I पर आधारित हैं।",
          questionEn: "I: 15, 31, 64, 131, 266, 537 II: 0.5 ...... 73 If 73 is the nth term, find the value of n.",
          questionHi: "I: 15, 31, 64, 131, 266, 537 II: 0.5 ...... 73 यदि 73 nवीं पद है, तो n का मान ज्ञात कीजिए।",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1,
          solution: "Pattern is 2^n, so next is 2^5 = 32. In Series II, follow the same pattern starting from 0.5.",
          solutionImage: "https://via.placeholder.com/400x200/0891b2/ffffff?text=Series+Pattern+Solution"
        },
        {
          id: 2,
          instructions: "Data Interpretation\n\nThe following table shows the number of students enrolled in different courses at a university over 5 years.\n\nडेटा व्याख्या\n\ननिम्न तालिका 5 वर्षों में विश्वविद्यालय के विभिन्न पाठ्यक्रमों में नामांकित छात्रों की संख्या दर्शाती है।",
          questionEn: "What is the total number of students enrolled in Engineering in 2020 and 2021?",
          questionHi: "2020 और 2021 में इंजीनियरिंग में नामांकित छात्रों की कुल संख्या कितनी है?",
          options: ["1100", "1150", "1200", "1250"],
          correctAnswer: 1,
          solution: "Add the enrollment numbers for Engineering from 2020 (550) and 2021 (600) = 1150 students.",
          solutionImage: ""
        },
        {
          id: 3,
          instructions: "Simple Interest Problem\n\nRead the following information carefully and answer the questions.\n\nसाधारण ब्याज की समस्या",
          questionEn: "Calculate the simple interest on Rs. 10,000 at 5% per annum for 3 years.",
          questionHi: "5% प्रति वर्ष की दर से 3 वर्षों के लिए 10,000 रुपये पर साधारण ब्याज की गणना करें।",
          options: ["Rs. 1,500", "Rs. 1,800", "Rs. 2,000", "Rs. 2,500"],
          correctAnswer: 0,
          solution: "SI = (P × R × T) / 100 = (10000 × 5 × 3) / 100 = Rs. 1,500",
          solutionImage: "https://via.placeholder.com/400x150/16a34a/ffffff?text=SI+Formula+Explanation"
        },
        {
          id: 4,
          instructions: "Percentage Problem\n\nSolve the following percentage-based question.\n\nप्रतिशत समस्या",
          questionEn: "If 60% of 500 students are boys, how many girls are there?",
          questionHi: "यदि 500 छात्रों में से 60% लड़के हैं, तो लड़कियां कितनी हैं?",
          options: ["150", "200", "250", "300"],
          correctAnswer: 1
        },
        {
          id: 5,
          instructions: "Ratio and Proportion\n\nStudy the ratio problem below.\n\nअनुपात और समानुपात",
          questionEn: "Find the smaller of the two numbers.",
          questionHi: "दोनों संख्याओं में से छोटी संख्या ज्ञात कीजिए।",
          options: ["30", "36", "42", "48"],
          correctAnswer: 1
        },
        {
          id: 6,
          instructions: "Time and Work\n\nA can complete a work in 12 days. B can complete the same work in 15 days.\n\nसमय और कार्य",
          questionEn: "If A and B work together, in how many days will they complete the work?",
          questionHi: "यदि A और B एक साथ काम करते हैं, तो वे कितने दिनों में काम पूरा करेंगे?",
          options: ["6 days", "6.67 days", "7 days", "8 days"],
          correctAnswer: 1
        },
        {
          id: 7,
          instructions: "Speed, Distance and Time\n\nA train travels at 60 km/h.\n\nगति, दूरी और समय",
          questionEn: "How much distance will it cover in 3 hours?",
          questionHi: "यह 3 घंटे में कितनी दूरी तय करेगी?",
          options: ["150 km", "160 km", "170 km", "180 km"],
          correctAnswer: 3
        },
        {
          id: 8,
          instructions: "Profit and Loss\n\nCost Price = Rs. 500, Selling Price = Rs. 600\n\nलाभ और हानि",
          questionEn: "What is the profit percentage?",
          questionHi: "लाभ प्रतिशत क्या है?",
          options: ["15%", "20%", "25%", "30%"],
          correctAnswer: 1
        },
        {
          id: 9,
          instructions: "Average Problem\n\nNumbers: 10, 20, 30, 40, 50\n\nऔसत की समस्या",
          questionEn: "Find the average of these 5 numbers.",
          questionHi: "इन 5 संख्याओं का औसत ज्ञात कीजिए।",
          options: ["25", "30", "35", "40"],
          correctAnswer: 1
        },
        {
          id: 10,
          instructions: "Compound Interest\n\nPrincipal = Rs. 5,000, Rate = 10% per annum, Time = 2 years\n\nचक्रवृद्धि ब्याज",
          questionEn: "Calculate the compound interest.",
          questionHi: "चक्रवृद्धि ब्याज की गणना करें।",
          options: ["Rs. 1,000", "Rs. 1,050", "Rs. 1,100", "Rs. 1,150"],
          correctAnswer: 1
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
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "Find the missing term in the series: A, B, D, G, K, ?",
          questionHi: "श्रृंखला में लुप्त पद ज्ञात करें: A, B, D, G, K, ?",
          options: ["L", "M", "N", "O"],
          correctAnswer: 2
        },
        {
          id: 2,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "If all the vowels are removed from the word 'COMPUTER', how many letters are left?",
          questionHi: "यदि 'COMPUTER' शब्द में से सभी स्वरों को हटा दिया जाए, तो कितने अक्षर बचेंगे?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1
        },
        {
          id: 3,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "Select the odd one out: 2, 4, 8, 16, 20",
          questionHi: "विषम संख्या चुनें: 2, 4, 8, 16, 20",
          options: ["2", "8", "16", "20"],
          correctAnswer: 3
        },
        {
          id: 4,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "In a certain code, 'CAT' is written as 'DBU'. How is 'DOG' written in that code?",
          questionHi: "एक निश्चित कोड में, 'CAT' को 'DBU' लिखा जाता है। उसी कोड में 'DOG' कैसे लिखा जाएगा?",
          options: ["EPI", "EPH", "FPI", "FPH"],
          correctAnswer: 0
        },
        {
          id: 5,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "If SOUTH is coded as 12345 and NORTH as 67845, what is the code for THRONE?",
          questionHi: "यदि SOUTH को 12345 और NORTH को 67845 के रूप में कोडित किया जाता है, तो THRONE का कोड क्या होगा?",
          options: ["854768", "845678", "845687", "845768"],
          correctAnswer: 3
        },
        {
          id: 6,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "Find the next term in the series: 31, 29, 24, 22, 17, ?",
          questionHi: "श्रृंखला में अगला पद ज्ञात करें: 31, 29, 24, 22, 17, ?",
          options: ["15", "14", "13", "12"],
          correctAnswer: 1
        },
        {
          id: 7,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "Choose the word which is different from the rest: Apple, Banana, Carrot, Mango",
          questionHi: "शेष से भिन्न शब्द चुनें: Apple, Banana, Carrot, Mango",
          options: ["Apple", "Banana", "Carrot", "Mango"],
          correctAnswer: 2
        },
        {
          id: 8,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "If in a certain language, FLOWER is coded as EKNVDQ, how is GARDEN coded?",
          questionHi: "यदि किसी भाषा में, FLOWER को EKNVDQ के रूप में कोडित किया जाता है, तो GARDEN को कैसे कोडित किया जाएगा?",
          options: ["FZQCDM", "FZQCEM", "FZPCEM", "FZQCEN"],
          correctAnswer: 0
        },
        {
          id: 9,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
          questionHi: "एक तस्वीर की ओर इशारा करते हुए, एक व्यक्ति ने कहा, 'मेरा कोई भाई या बहन नहीं है लेकिन उस आदमी का पिता मेरे पिता का बेटा है।' यह किसकी तस्वीर थी?",
          options: ["His son", "His father", "His cousin", "He himself"],
          correctAnswer: 0
        },
        {
          id: 10,
          instructions: "Reasoning Instructions\n\nसामान्य निर्देश",
          questionEn: "If the day before yesterday was Monday, what day will it be three days after tomorrow?",
          questionHi: "यदि परसों से पहले वाला दिन सोमवार था, तो कल के बाद तीसरे दिन कौन-सा दिन होगा?",
          options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
          correctAnswer: 2
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
          questionEn: "Select the synonym of 'ABRIDGE'.",
          questionHi: "'ABRIDGE' का पर्यायवाची चुनें।",
          options: ["Expand", "Shorten", "Praise", "Destroy"],
          correctAnswer: 1
        },
        {
          id: 2,
          instructions: "Direction: Choose the correct antonym for the given word.",
          questionEn: "Select the antonym of 'BENIGN'.",
          questionHi: "'BENIGN' का विलोम चुनें।",
          options: ["Kind", "Gentle", "Harsh", "Soft"],
          correctAnswer: 2
        },
        {
          id: 3,
          instructions: "Fill in the blanks.",
          questionEn: "He _______ to Delhi last week.",
          questionHi: "वह पिछले सप्ताह दिल्ली _______।",
          options: ["go", "gone", "went", "going"],
          correctAnswer: 2
        },
        {
          id: 4,
          instructions: "Identify the part of speech.",
          questionEn: "In the sentence 'She sings beautifully', the word 'beautifully' is an:",
          questionHi: "वाक्य 'She sings beautifully' में 'beautifully' शब्द क्या है?",
          options: ["Adjective", "Noun", "Adverb", "Verb"],
          correctAnswer: 2
        },
        {
          id: 5,
          instructions: "Spot the error.",
          questionEn: "Each of the boys have done their homework.",
          questionHi: "Each of the boys have done their homework.",
          options: ["Each", "of the boys", "have done", "their homework"],
          correctAnswer: 2
        },
        {
          id: 6,
          instructions: "Choose the correct option.",
          questionEn: "The synonym of 'OBSTINATE' is:",
          questionHi: "'OBSTINATE' का पर्यायवाची है:",
          options: ["Flexible", "Stubborn", "Gentle", "Calm"],
          correctAnswer: 1
        },
        {
          id: 7,
          instructions: "Choose the correct spelling.",
          questionEn: "Select the correctly spelt word:",
          questionHi: "सही वर्तनी वाला शब्द चुनें:",
          options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
          correctAnswer: 2
        },
        {
          id: 8,
          instructions: "Reading comprehension.",
          questionEn: "What is the main idea of the passage? (Assume a short passage was provided)",
          questionHi: "लेख का मुख्य विचार क्या है? (मान लीजिए एक संक्षिप्त लेख दिया गया था)",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0
        },
        {
          id: 9,
          instructions: "Choose the correct tense form.",
          questionEn: "By next year, she _______ her degree.",
          questionHi: "अगले वर्ष तक, वह अपनी डिग्री _______।",
          options: ["will complete", "will have completed", "completed", "has completed"],
          correctAnswer: 1
        },
        {
          id: 10,
          instructions: "Idioms and phrases.",
          questionEn: "Meaning of the idiom 'Break the ice' is:",
          questionHi: "'Break the ice' मुहावरे का अर्थ है:",
          options: ["To shatter something", "To start a conversation", "To cancel a plan", "To make someone angry"],
          correctAnswer: 1
        }
      ]
    }
  ]
};

window.testData = testData;