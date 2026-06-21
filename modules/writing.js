window.dailyPrompts = [
  "Describe a significant challenge you faced during a team project and how you resolved it.",
  "Where do you see yourself in five years, and how does this placement align with your career goals?",
  "What is your greatest technical strength, and how have you applied it to solve a real-world problem?",
  "Explain a time when you had to learn a completely new technology quickly. What was your process?",
  "Discuss the importance of ethical decision-making in the tech industry.",
  "Describe a time when you received constructive feedback. How did you react and what changes did you make?",
  "Why is effective communication just as important as coding skills for a software engineer?",
  "What does teamwork mean to you, and how do you handle disagreements within a group?",
  "Write about a technology trend (like AI, Cloud Computing, or Blockchain) that excites you the most and why.",
  "Describe a personal hobby or interest outside of coding, and explain what skills it has taught you.",
  "What is your understanding of the Software Development Life Cycle (SDLC), and why is each stage critical?",
  "How do you prioritize tasks when working under tight deadlines with multiple deliverables?",
  "Describe a situation where you had to explain a complex technical concept to a non-technical person.",
  "Why is writing clean, readable, and well-documented code crucial for software maintenance?",
  "Discuss the role of cloud computing in modern system architecture and scalability.",
  "Describe a project you built outside of your academics. What motivated you and what did you learn?",
  "How do you stay updated with the latest trends and advancements in computer science?",
  "What is the difference between working hard and working smart in the context of software engineering?",
  "Explain the value of unit testing and code reviews in software development.",
  "Describe a failure you experienced. What did you learn from it and how did you bounce back?",
  "Discuss how artificial intelligence and machine learning are impacting software development roles.",
  "What are your strategies for debugging a complex logic error in a codebase you didn't write?",
  "How do you handle stress or burnout during intensive coding sessions or academic exams?",
  "Explain the significance of open-source software contributions for a student's learning journey.",
  "Why is user experience (UX) design critical, and how should a backend developer consider it?",
  "Describe your ideal work culture. What environments help you perform at your best?",
  "Discuss the trade-offs between SQL (Relational) and NoSQL (Non-Relational) databases.",
  "What is agile development, and how does it improve software delivery speeds?",
  "Describe a time when you had to take the lead on a project or initiative. What was the outcome?",
  "How does data security and privacy impact software design in modern web applications?",
  "What are the benefits and drawbacks of microservices architecture compared to a monolithic codebase?",
  "Why is Git version control an essential tool for SDE teams, and how does it prevent code conflicts?",
  "How do you approach designing a scalable web application from scratch?",
  "Describe a time you had to adapt to a sudden change in project requirements. How did you handle it?",
  "What is the importance of diversity and inclusion in building a successful engineering team?",
  "Explain how serverless computing is changing the way companies deploy applications.",
  "Why is continuous integration and continuous deployment (CI/CD) vital for modern Devops?",
  "Describe a time you resolved a conflict with a colleague or classmate. What did you learn?",
  "What is the role of caching in web application performance, and where should it be implemented?",
  "Explain the concept of tech debt. How should developers balance fast delivery and code quality?",
  "Discuss the impact of open-source LLMs on software engineering productivity.",
  "Why is accessibility (a11y) in web development important, and how do you implement it?",
  "Describe a technical problem you solved using data structures like trees or graphs.",
  "How do you approach learning a new programming language or framework for a job task?",
  "Why is systems design an important round in SDE interviews, and what does it test?",
  "Discuss the security risks associated with SQL Injection and how to prevent them.",
  "What is your perspective on remote work vs. in-office collaboration for software developers?",
  "Explain the difference between authentication and authorization in application security.",
  "Describe a time you had to work with a difficult team member. How did you maintain productivity?",
  "What is the significance of the CAP theorem in distributed systems database design?"
];

/**
 * Calculates statistics for a given block of text.
 * @param {string} text - Input writing paragraph
 * @returns {{words: number, characters: number, readingTime: number}}
 */
window.analyzeParagraph = function(text) {
  if (!text) {
    return { words: 0, characters: 0, readingTime: 0 };
  }

  // Trim and split by whitespace to count words
  const trimmed = text.trim();
  const wordsArray = trimmed === "" ? [] : trimmed.split(/\s+/);
  const words = wordsArray.length;
  const characters = text.length;

  // Average reading speed is ~200 words per minute.
  // Reading time in seconds = (words / 200) * 60 seconds
  const readingTime = Math.ceil((words / 200) * 60);

  return {
    words,
    characters,
    readingTime
  };
}

/**
 * Checks the text for spacing, capitalization, common spelling, and contraction errors,
 * returning a list of mistakes and the suggested corrected text.
 * @param {string} text
 * @returns {{mistakes: Array<{type: string, desc: string, fix: string}>, correctedText: string}}
 */
window.checkGrammarAndCorrect = function(text) {
  if (!text) return { mistakes: [], correctedText: "" };

  let corrected = text;
  const mistakes = [];

  // 1. Double Spaces Check
  if (/\s{2,}/.test(corrected)) {
    mistakes.push({
      type: "Spacing",
      desc: "Multiple consecutive spaces found.",
      fix: "Replace multiple spaces with a single space."
    });
    corrected = corrected.replace(/\s{2,}/g, " ");
  }

  // 2. Space before punctuation (e.g. "hello , world" -> "hello, world")
  if (/\s+([.,!?;:])/.test(corrected)) {
    mistakes.push({
      type: "Punctuation Spacing",
      desc: "Space detected before punctuation mark (comma, period, etc.).",
      fix: "Remove space before punctuation."
    });
    corrected = corrected.replace(/\s+([.,!?;:])/g, "$1");
  }

  // 3. Missing space after punctuation (e.g. "hello,world" -> "hello, world")
  if (/([.,!?;:])([a-zA-Z])/g.test(corrected)) {
    mistakes.push({
      type: "Punctuation Spacing",
      desc: "Missing space after punctuation mark.",
      fix: "Add a space after punctuation."
    });
    corrected = corrected.replace(/([.,!?;:])([a-zA-Z])/g, "$1 $2");
  }

  // 4. Lowercase "i" pronoun
  if (/\bi\b/g.test(corrected)) {
    mistakes.push({
      type: "Capitalization",
      desc: "Pronoun 'i' should always be capitalized.",
      fix: "Capitalize 'i' to 'I'."
    });
    corrected = corrected.replace(/\bi\b/g, "I");
  }
  if (/\bi'm\b/gi.test(corrected)) {
    mistakes.push({
      type: "Capitalization",
      desc: "Contraction 'i'm' should be capitalized.",
      fix: "Change 'i'm' to 'I'm'."
    });
    corrected = corrected.replace(/\bi'm\b/gi, "I'm");
  }

  // 5. Common Contraction typos
  const contractions = [
    { regex: /\bdont\b/gi, correct: "don't", word: "dont" },
    { regex: /\bcant\b/gi, correct: "can't", word: "cant" },
    { regex: /\bwont\b/gi, correct: "won't", word: "wont" },
    { regex: /\bshouldnt\b/gi, correct: "shouldn't", word: "shouldnt" },
    { regex: /\bcouldnt\b/gi, correct: "couldn't", word: "couldnt" },
    { regex: /\bhavent\b/gi, correct: "haven't", word: "havent" },
    { regex: /\bhasnt\b/gi, correct: "hasn't", word: "hasnt" }
  ];
  contractions.forEach(item => {
    if (item.regex.test(corrected)) {
      mistakes.push({
        type: "Grammar / Spelling",
        desc: `Missing apostrophe in contraction '${item.word}'.`,
        fix: `Replace '${item.word}' with '${item.correct}'.`
      });
      corrected = corrected.replace(item.regex, item.correct);
    }
  });

  // 6. Common Spelling Typos
  const typos = [
    { regex: /\brecieve\b/gi, correct: "receive", word: "recieve" },
    { regex: /\bseperate\b/gi, correct: "separate", word: "seperate" },
    { regex: /\balot\b/gi, correct: "a lot", word: "alot" },
    { regex: /\bteh\b/gi, correct: "the", word: "teh" },
    { regex: /\bdefinately\b/gi, correct: "definitely", word: "definately" },
    { regex: /\barguement\b/gi, correct: "argument", word: "arguement" }
  ];
  typos.forEach(item => {
    if (item.regex.test(corrected)) {
      mistakes.push({
        type: "Spelling",
        desc: `Spelling typo '${item.word}' detected.`,
        fix: `Replace '${item.word}' with '${item.correct}'.`
      });
      corrected = corrected.replace(item.regex, item.correct);
    }
  });

  // 7. Technical term capitalization
  const techTerms = [
    { regex: /\bjavascript\b/gi, correct: "JavaScript", word: "javascript" },
    { regex: /\bhtml\b/gi, correct: "HTML", word: "html" },
    { regex: /\bcss\b/gi, correct: "CSS", word: "css" },
    { regex: /\bsql\b/gi, correct: "SQL", word: "sql" },
    { regex: /\bgit\b/gi, correct: "Git", word: "git" },
    { regex: /\bapi\b/gi, correct: "API", word: "api" },
    { regex: /\bapis\b/gi, correct: "APIs", word: "apis" }
  ];
  techTerms.forEach(item => {
    if (item.regex.test(corrected)) {
      const matches = corrected.match(item.regex);
      const incorrectMatch = matches.some(m => m !== item.correct);
      if (incorrectMatch) {
        mistakes.push({
          type: "Capitalization",
          desc: `Technical term '${item.word}' should be properly capitalized as '${item.correct}'.`,
          fix: `Capitalize to '${item.correct}'.`
        });
        corrected = corrected.replace(item.regex, item.correct);
      }
    }
  });

  // 8. Capitalize first letter of each sentence
  let sentenceRegex = /(^\s*|[.!?]\s+)([a-z])/g;
  if (sentenceRegex.test(corrected)) {
    mistakes.push({
      type: "Capitalization",
      desc: "Sentences must begin with a capital letter.",
      fix: "Capitalize the first letter of each sentence."
    });
    corrected = corrected.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => {
      return prefix + char.toUpperCase();
    });
  }

  return {
    mistakes,
    correctedText: corrected
  };
};
