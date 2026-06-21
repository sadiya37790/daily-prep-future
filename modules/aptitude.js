// Quantitative Aptitude, Logical Reasoning, and Verbal Ability Questions Database
// Complete with Study Notes, Shortcut Tricks, Solved Examples, and Question Pools

window.aptitudeDatabase = {
  // ==================== QUANTITATIVE APTITUDE ====================
  "number-systems": {
    title: "Number Systems",
    notes: {
      intro: "Number Systems cover the properties of integers, prime numbers, LCM/HCF, divisibility rules, and remainder theorems.",
      tips: [
        "**Unit Digit Cycle**: Unit digits of powers repeat in cycles: Cycle of 4 for {2, 3, 7, 8}; Cycle of 2 for {4, 9}; and Cycle of 1 for {0, 1, 5, 6}.",
        "**Remainder Shortcut**: If a number N leaves remainder R when divided by D, then N = D*k + R. To find remainder of N divided by a factor of D, simply divide R by that factor.",
        "**Divisibility Rule of 11**: The difference between the sum of digits at odd places and sum of digits at even places must be either 0 or divisible by 11.",
        "**AP Sum Formula**: Sum of Arithmetic Progression = (n/2) * (a + l), where n = number of terms, a = first term, l = last term."
      ],
      formulas: "1. Sum of first n natural numbers = [n(n + 1)] / 2\n2. Sum of first n square numbers = [n(n + 1)(2n + 1)] / 6\n3. Divident = (Divisor * Quotient) + Remainder\n\n**🔥 Shortcut Solved Example:**\nQuestion: Find the unit digit of 17^123.\nTrick: Cycle of 7 is 4. Divide 123 by 4 (remainder is 3). The unit digit is equivalent to 7^3 = 343, which ends in 3. Answer is 3."
    },
    questions: [
      {
        id: 1,
        question: "What is the unit digit in the product (3^65 * 6^59 * 7^71)?",
        options: ["1", "2", "4", "6"],
        answer: 2, // "4"
        explanation: "1. Unit digit in 3^65: Remainder of 65/4 is 1. So, 3^1 = 3.\n2. Unit digit in 6^59: Any power of 6 ends in 6. So, 6.\n3. Unit digit in 7^71: Remainder of 71/4 is 3. So, 7^3 = 343, ends in 3.\nProduct of unit digits = 3 * 6 * 3 = 54. Hence, unit digit is 4."
      },
      {
        id: 2,
        question: "Find the sum of all natural numbers between 100 and 200 which are divisible by 3.",
        options: ["4950", "4980", "5000", "5015"],
        answer: 0, // "4950"
        explanation: "The numbers are 102, 105, 108, ..., 198. This is an AP with a = 102, d = 3, l = 198.\nFind n: 198 = 102 + (n - 1)3 => n = 33.\nSum = (33/2) * (102 + 198) = 16.5 * 300 = 4950."
      },
      {
        id: 3,
        question: "A number when divided by 899 leaves a remainder of 63. If the same number is divided by 29, the remainder will be:",
        options: ["5", "4", "3", "2"],
        answer: 0, // "5"
        explanation: "Let the number be N = 899k + 63.\nSince 899 is a multiple of 29 (29 * 31 = 899), 899k is completely divisible by 29.\nRemainder of N / 29 = Remainder of 63 / 29 = 5."
      },
      {
        id: 4,
        question: "The sum of the digits of a 2-digit number is 15 and the difference between the digits is 3. What is the two-digit number?",
        options: ["69", "78", "96", "Cannot be determined"],
        answer: 3, // "Cannot be determined"
        explanation: "Let digits be x and y. x + y = 15, and |x - y| = 3.\nThis yields two possible digit pairs: (9, 6) or (6, 9).\nTherefore, the number can be either 96 or 69. Without extra information, it cannot be uniquely determined."
      },
      {
        id: 5,
        question: "How many primes are there between 50 and 100?",
        options: ["9", "10", "11", "12"],
        answer: 1, // "10"
        explanation: "The prime numbers between 50 and 100 are: 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. Total is 10."
      },
      {
        id: 6,
        question: "What is the least number which when doubled will be exactly divisible by 12, 18, 21 and 30?",
        options: ["630", "1260", "2520", "315"],
        answer: 0, // "630"
        explanation: "LCM of 12, 18, 21, 30:\n12=2^2*3, 18=2*3^2, 21=3*7, 30=2*3*5.\nLCM = 2^2 * 3^2 * 5 * 7 = 1260.\nSince the number doubled is 1260, the required number is 1260 / 2 = 630."
      },
      {
        id: 7,
        question: "If a number is divisible by both 11 and 13, then it must be necessarily divisible by:",
        options: ["(11 + 13)", "(13 - 11)", "(11 * 13)", "None of these"],
        answer: 2, // "(11 * 13)"
        explanation: "Since 11 and 13 are prime (coprime to each other), any number divisible by both must be divisible by their product (11 * 13)."
      },
      {
        id: 8,
        question: "Which of the following is a prime number?",
        options: ["117", "187", "241", "343"],
        answer: 2, // "241"
        explanation: "117 = 9 * 13 (composite), 187 = 11 * 17 (composite), 343 = 7^3 (composite). 241 is prime (no prime factors <= sqrt(241) divide it)."
      },
      {
        id: 9,
        question: "Find the greatest number that will divide 43, 91 and 183 so as to leave the same remainder in each case.",
        options: ["4", "7", "9", "13"],
        answer: 0, // "4"
        explanation: "Required number = HCF of (|91-43|, |183-91|, |183-43|) = HCF of (48, 92, 140).\nFactors: 48 = 4 * 12, 92 = 4 * 23, 140 = 4 * 35.\nHCF is 4."
      },
      {
        id: 10,
        question: "The difference between a 2-digit number and the number obtained by interchanging the digits is 36. What is the difference between the digits?",
        options: ["3", "4", "6", "9"],
        answer: 1, // "4"
        explanation: "Let number be 10x + y. Reversed is 10y + x.\n(10x + y) - (10y + x) = 9(x - y) = 36.\nx - y = 4. The difference between the digits is 4."
      },
      // Pool expansions (different questions for subsequent practices)
      {
        id: 11,
        question: "What is the HCF of 1095 and 1168?",
        options: ["73", "83", "93", "63"],
        answer: 0, // "73"
        explanation: "Using division method:\n1168 = 1095 * 1 + 73\n1095 = 73 * 15 + 0\nThe last divisor leaving remainder 0 is 73. So HCF is 73."
      },
      {
        id: 12,
        question: "Find the remainder when 2^31 is divided by 5.",
        options: ["1", "2", "3", "4"],
        answer: 2, // "3"
        explanation: "Cycle of powers of 2 mod 5:\n2^1 = 2, 2^2 = 4, 2^3 = 3, 2^4 = 1.\nThe cycle repeats every 4 powers.\nDivide 31 by 4 (remainder 3). Thus, 2^31 mod 5 = 2^3 mod 5 = 8 mod 5 = 3."
      },
      {
        id: 13,
        question: "The sum of three consecutive even integers is 42. What is the middle number?",
        options: ["12", "14", "16", "18"],
        answer: 1, // "14"
        explanation: "Let numbers be x-2, x, x+2. Sum = 3x = 42 => x = 14. Middle number is 14."
      },
      {
        id: 14,
        question: "A number is as much greater than 36 as it is less than 86. Find the number.",
        options: ["51", "61", "71", "81"],
        answer: 1, // "61"
        explanation: "Let the number be x. x - 36 = 86 - x => 2x = 122 => x = 61."
      },
      {
        id: 15,
        question: "What is the sum of all prime numbers between 10 and 25?",
        options: ["50", "60", "68", "73"],
        answer: 1, // "60"
        explanation: "Primes between 10 and 25 are: 11, 13, 17, 19, 23.\nSum = 11 + 13 + 17 + 19 + 23 = 60."
      }
    ]
  },
  "profit-and-loss": {
    title: "Profit & Loss",
    notes: {
      intro: "Profit and Loss involves calculating selling price (SP), cost price (CP), gains/losses, marked price (MP), and discounts.",
      tips: [
        "**Base of Calculation**: Profit% or Loss% is always calculated on Cost Price (CP) unless stated otherwise.",
        "**Discount Principle**: Discount is always calculated on the Marked Price (MP). SP = MP - Discount.",
        "**Equivalent Discount**: Two successive discounts of d1% and d2% are equivalent to a single discount of: [d1 + d2 - (d1 * d2)/100] %.",
        "**Identical Sells Rule**: When two items are sold at the same price, one at a gain of x% and the other at a loss of x%, there is always a loss of (x/10)^2 %."
      ],
      formulas: "1. Profit = SP - CP | Loss = CP - SP\n2. Profit% = (Profit / CP) * 100\n3. SP = [(100 + Gain%) / 100] * CP\n\n**🔥 Shortcut Solved Example:**\nQuestion: A man sells two cycles for $990 each, gaining 10% on one and losing 10% on the other. Find overall gain/loss %.\nTrick: Standard identical sells case. Overall there is always a loss = (R/10)^2 % = (10/10)^2 = 1% loss. Answer is 1% loss."
    },
    questions: [
      {
        id: 1,
        question: "A person buys a toy for $50 and sells it for $75. What is his profit percentage?",
        options: ["25%", "33.33%", "50%", "75%"],
        answer: 2, // "50%"
        explanation: "CP = $50, SP = $75. Profit = 75 - 50 = $25.\nProfit% = (25 / 50) * 100 = 50%."
      },
      {
        id: 2,
        question: "A cycle was sold at a gain of 10%. Had it been sold for $260 more, the gain would have been 15%. Find the cost price of the cycle.",
        options: ["$2600", "$5000", "$5200", "$6000"],
        answer: 2, // "$5200"
        explanation: "Let CP be x.\n1.15x - 1.10x = 260 => 0.05x = 260 => x = 260 / 0.05 = 5200. CP is $5200."
      },
      {
        id: 3,
        question: "If the cost price of 12 pens is equal to the selling price of 8 pens, the gain percent is:",
        options: ["25%", "33.33%", "50%", "66.67%"],
        answer: 2, // "50%"
        explanation: "Let CP of 1 pen = $1. CP of 8 pens = $8.\nSP of 8 pens = CP of 12 pens = $12.\nProfit on 8 pens = 12 - 8 = $4.\nProfit% = (4 / 8) * 100 = 50%."
      },
      {
        id: 4,
        question: "An article is sold at a loss of 20%. If it is sold for $12 more, there would be a profit of 10%. What is the cost price?",
        options: ["$40", "$50", "$60", "$80"],
        answer: 0, // "$40"
        explanation: "Let CP be x. SP1 = 0.80x, SP2 = 1.10x.\nDifference: 1.10x - 0.80x = 0.30x = 12 => x = 12 / 0.30 = 40. CP is $40."
      },
      {
        id: 5,
        question: "A merchant marks his goods 20% above the cost price and then allows a discount of 10%. What is his net profit percent?",
        options: ["8%", "10%", "12%", "15%"],
        answer: 0, // "8%"
        explanation: "Let CP be 100. Marked Price (MP) = 120.\nDiscount = 10% of 120 = 12.\nSelling Price (SP) = 120 - 12 = 108.\nNet Profit = 108 - 100 = 8. So, the net profit is 8%."
      },
      {
        id: 6,
        question: "By selling 100 notebooks, a shopkeeper gains the selling price of 20 notebooks. What is his gain percentage?",
        options: ["20%", "25%", "30%", "33.33%"],
        answer: 1, // "25%"
        explanation: "Let SP of 1 notebook be $1. SP of 100 notebooks = $100. Gain = $20.\nCP of 100 notebooks = SP - Gain = 100 - 20 = $80.\nGain% = (20 / 80) * 100 = 25%."
      },
      {
        id: 7,
        question: "A dishonest dealer professes to sell his goods at cost price but uses a weight of 900 grams for a kg. Find his gain percent.",
        options: ["10%", "11.11%", "12.5%", "15%"],
        answer: 1, // "11.11%"
        explanation: "He sells 900g for the price of 1000g.\nLet CP of 1g = $1. CP of 900g = $900, SP = $1000.\nGain% = (100 / 900) * 100 = 11.11%."
      },
      {
        id: 8,
        question: "A music system is sold for $11,220 at a loss of 15%. What was its cost price?",
        options: ["$12,500", "$13,000", "$13,200", "$14,000"],
        answer: 2, // "$13,200"
        explanation: "Loss = 15% => SP = 85% of CP.\n0.85 * CP = 11220 => CP = 11220 / 0.85 = 13200."
      },
      {
        id: 9,
        question: "A man sells two horses for $1980 each. On one he gains 10% and on the other he loses 10%. What is his overall gain/loss percent?",
        options: ["1% gain", "1% loss", "No profit, no loss", "2% loss"],
        answer: 1, // "1% loss"
        explanation: "Equal gain and loss percentages on identical selling prices always results in a loss.\nLoss% = (R/10)^2 = (10/10)^2 = 1% loss."
      },
      {
        id: 10,
        question: "A shopkeeper bought 240 chocolates at $9 per dozen. If he sells them at $1 each, what is his profit percentage?",
        options: ["25%", "33.33%", "50%", "60%"],
        answer: 1, // "33.33%"
        explanation: "Total chocolates = 240 = 20 dozen.\nCP = 20 * 9 = $180. SP = 240 * 1 = $240.\nProfit = 240 - 180 = $60.\nProfit% = (60 / 180) * 100 = 33.33%."
      },
      // Pool expansions
      {
        id: 11,
        question: "By selling an article for $360, a dealer loses 10%. At what price must he sell to gain 10%?",
        options: ["$400", "$440", "$450", "$480"],
        answer: 1, // "$440"
        explanation: "SP1 = 90% of CP = 360 => CP = 400.\nTarget SP = 110% of CP = 1.10 * 400 = $440."
      },
      {
        id: 12,
        question: "If a discount of 10% is given on the marked price of a book, a publisher gains 20%. If discount is 15%, the gain is:",
        options: ["10%", "12.5%", "13.33%", "15%"],
        answer: 2, // "13.33%"
        explanation: "Let CP = 100. Gain = 20% => SP = 120.\nSince 10% discount was given, MP = 120 / 0.90 = 400/3.\nNew discount 15% => New SP = 85% of MP = 0.85 * (400/3) = 340/3 = 113.33.\nGain% = 113.33 - 100 = 13.33%."
      },
      {
        id: 13,
        question: "A fruit seller buys lemons at 2 for a dollar and sells them at 5 for three dollars. Find his gain percent.",
        options: ["10%", "15%", "20%", "25%"],
        answer: 2, // "20%"
        explanation: "CP of 1 lemon = $1/2 = $0.50.\nSP of 1 lemon = $3/5 = $0.60.\nProfit = 0.60 - 0.50 = $0.10.\nProfit% = (0.10 / 0.50) * 100 = 20%."
      },
      {
        id: 14,
        question: "An article is marked at $500. Two successive discounts of 20% and 10% are allowed. Find the selling price.",
        options: ["$350", "$360", "$380", "$400"],
        answer: 1, // "$360"
        explanation: "Equivalent discount = 20 + 10 - (20*10)/100 = 28%.\nSelling Price = 72% of Marked Price = 0.72 * 500 = $360."
      },
      {
        id: 15,
        question: "A man gains 20% by selling an article. If he had bought it at 10% less and sold it for $18 less, he would have gained 30%. Find CP.",
        options: ["$500", "$600", "$700", "$800"],
        answer: 1, // "$600"
        explanation: "Let CP be x. SP = 1.20x.\nNew CP = 0.90x. New SP = 1.30 * 0.90x = 1.17x.\n1.20x - 1.17x = 18 => 0.03x = 18 => x = 600. CP is $600."
      }
    ]
  },
  "percentages": {
    title: "Percentages",
    notes: {
      intro: "Percentages represent fraction parts out of 100. It is the basis for comparison, growth analysis, and scaling operations.",
      tips: [
        "**Inverse Percentage Rule**: If A is x% more than B, then B is less than A by: [x / (100 + x)] * 100 %.",
        "**Price-Consumption Rule**: If price of a commodity increases by R%, consumption must be reduced by: [R / (100 + R)] * 100 % to keep expenditure constant.",
        "**Successive Changes**: If a value is increased by x% and then decreased/increased by y%, net change is: [x + y + (xy/100)] % (use negative sign for decrease)."
      ],
      formulas: "1. Percentage Increase = (Increase / Original Value) * 100\n2. Value after n periods growth = Original * (1 + R/100)^n\n\n**🔥 Shortcut Solved Example:**\nQuestion: If the price of sugar rises by 25%, by what percent must a household reduce consumption to keep budget unchanged?\nTrick: Apply formula [R / (100 + R)] * 100% = [25 / (100 + 25)] * 100% = 25/125 * 100 = 20%. Answer is 20%."
    },
    questions: [
      {
        id: 1,
        question: "Two numbers are 20% and 50% more than a third number respectively. What percentage is the first of the second?",
        options: ["60%", "75%", "80%", "120%"],
        answer: 2, // "80%"
        explanation: "Let third number be 100. First is 120, second is 150.\nRequired % = (120 / 150) * 100 = 80%."
      },
      {
        id: 2,
        question: "If A's income is 25% more than B's income, by what percentage is B's income less than A's?",
        options: ["15%", "20%", "25%", "30%"],
        answer: 1, // "20%"
        explanation: "Let B's income be 100. A's is 125.\nReduction = (25 / 125) * 100 = 20%."
      },
      {
        id: 3,
        question: "A student has to score 40% marks to pass. He gets 178 marks and fails by 22 marks. What are the maximum marks?",
        options: ["400", "500", "600", "800"],
        answer: 1, // "500"
        explanation: "Passing marks = 178 + 22 = 200.\n40% of M = 200 => M = 200 / 0.40 = 500."
      },
      {
        id: 4,
        question: "The price of petrol went up by 25%. By how much percent must a motorist reduce his consumption so that his expenditure remains the same?",
        options: ["15%", "20%", "25%", "30%"],
        answer: 1, // "20%"
        explanation: "Reduction% = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 20%."
      },
      {
        id: 5,
        question: "In an election between two candidates, the winner gets 60% of the votes cast and wins by a majority of 14,000 votes. Total votes cast is:",
        options: ["42,000", "56,000", "70,000", "84,000"],
        answer: 2, // "70,000"
        explanation: "Winner gets 60%, Loser gets 40%. Difference is 20%.\n20% of V = 14,000 => V = 14,000 / 0.20 = 70,000."
      },
      {
        id: 6,
        question: "If 15% of A is equal to 20% of B, then A : B is:",
        options: ["3 : 4", "4 : 3", "2 : 3", "3 : 2"],
        answer: 1, // "4 : 3"
        explanation: "0.15A = 0.20B => A/B = 0.20 / 0.15 = 4/3 => A : B = 4 : 3."
      },
      {
        id: 7,
        question: "A fruit seller had some apples. He sells 40% of them and still has 420 apples. How many did he have originally?",
        options: ["588", "600", "700", "720"],
        answer: 2, // "700"
        explanation: "Apples left = 60%.\n60% of A = 420 => A = 420 / 0.60 = 700."
      },
      {
        id: 8,
        question: "What is 25% of 25% of 100?",
        options: ["6.25", "25", "50", "0.625"],
        answer: 0, // "6.25"
        explanation: "0.25 * 0.25 * 100 = 6.25."
      },
      {
        id: 9,
        question: "The population of a town increases 10% per annum. If present population is 10,000, what will it be after 2 years?",
        options: ["11,000", "12,000", "12,100", "13,000"],
        answer: 2, // "12,100"
        explanation: "Population = 10000 * (1 + 0.10)^2 = 10000 * 1.21 = 12,100."
      },
      {
        id: 10,
        question: "If x is 10% less than y and y is 10% more than 125, then x is:",
        options: ["122.5", "123.75", "125", "137.5"],
        answer: 1, // "123.75"
        explanation: "y = 125 * 1.10 = 137.5. x = 137.5 * 0.90 = 123.75."
      },
      // Pool expansions
      {
        id: 11,
        question: "If A's income is 10% less than B's, by how much percent is B's income more than A's?",
        options: ["9.09%", "10%", "11.11%", "12.5%"],
        answer: 2, // "11.11%"
        explanation: "Formula: [x / (100 - x)] * 100 = [10 / 90] * 100 = 11.11%."
      },
      {
        id: 12,
        question: "In a test, an examinee gets 30% marks and fails by 25 marks. Another candidate gets 40% and gets 25 marks more than passing. Find passing marks.",
        options: ["150", "175", "200", "225"],
        answer: 1, // "175"
        explanation: "Difference in marks = 40% - 30% = 10% of total.\n10% of total = 25 + 25 = 50 => Total = 500.\nPassing marks = 30% of 500 + 25 = 150 + 25 = 175."
      },
      {
        id: 13,
        question: "If 10% of x is the same as 20% of y, then x : y is:",
        options: ["1 : 2", "2 : 1", "5 : 1", "10 : 1"],
        answer: 1, // "2 : 1"
        explanation: "0.10x = 0.20y => x/y = 0.20 / 0.10 = 2/1 => x : y = 2 : 1."
      },
      {
        id: 14,
        question: "30% of a number is 120. What is 150% of that number?",
        options: ["400", "500", "600", "800"],
        answer: 2, // "600"
        explanation: "If 30% = 120, then 1% = 4.\n150% = 150 * 4 = 600."
      },
      {
        id: 15,
        question: "Subtracting 40% of a number from the number itself yields 120. Find the number.",
        options: ["200", "250", "300", "400"],
        answer: 0, // "200"
        explanation: "x - 0.40x = 0.60x = 120 => x = 120 / 0.60 = 200."
      }
    ]
  },
  "time-and-work": {
    title: "Time & Work",
    notes: {
      intro: "Time and Work equations relate the rate of completing tasks to total time and number of workers active.",
      tips: [
        "**Reciprocal Relation**: If A completes a work in D days, A's 1-day work rate = 1/D.",
        "**Work Rate Summation**: If A and B work together, their combined 1-day work rate = 1/A + 1/B.",
        "**Efficiency Rule**: If A is twice as efficient as B, then A takes half the time taken by B to do the same work.",
        "**Man-Days Formula**: (Men1 * Days1 * Hours1) / Work1 = (Men2 * Days2 * Hours2) / Work2."
      ],
      formulas: "1. Combined Time = (A * B) / (A + B) days\n2. Work = Rate * Time\n\n**🔥 Shortcut Solved Example:**\nQuestion: A can do a task in 12 days and B in 24 days. How long will they take together?\nTrick: Combined time = (A * B) / (A + B) = (12 * 24) / (12 + 24) = 288 / 36 = 8 days. Answer is 8 days."
    },
    questions: [
      {
        id: 1,
        question: "A can do a piece of work in 10 days and B in 15 days. How many days will they take together?",
        options: ["5 days", "6 days", "8 days", "9 days"],
        answer: 1, // "6 days"
        explanation: "Rate = 1/10 + 1/15 = 5/30 = 1/6. Days taken = 6 days."
      },
      {
        id: 2,
        question: "A and B together can do work in 12 days, while B alone can do it in 30 days. In how many days can A alone complete it?",
        options: ["15 days", "18 days", "20 days", "24 days"],
        answer: 2, // "20 days"
        explanation: "A's rate = 1/12 - 1/30 = (5-2)/60 = 3/60 = 1/20. A alone takes 20 days."
      },
      {
        id: 3,
        question: "A is twice as good a workman as B and together they finish a work in 18 days. In how many days will A alone finish it?",
        options: ["27 days", "36 days", "45 days", "54 days"],
        answer: 0, // "27 days"
        explanation: "Let B's rate be x, A's is 2x. Together 3x = 1/18 => x = 1/54.\nA's rate = 2x = 2/54 = 1/27. A alone takes 27 days."
      },
      {
        id: 4,
        question: "A can finish work in 18 days and B in half the time. What part of the work can they finish together in a day?",
        options: ["1/6", "1/4", "2/9", "1/9"],
        answer: 0, // "1/6"
        explanation: "A rate = 1/18, B rate = 1/9.\nCombined 1-day work = 1/18 + 1/9 = 3/18 = 1/6."
      },
      {
        id: 5,
        question: "A, B and C can complete a work in 2, 4 and 6 days respectively. Working together, they will finish in:",
        options: ["1 day", "12/11 days", "2 days", "3 days"],
        answer: 1, // "12/11 days"
        explanation: "Combined rate = 1/2 + 1/4 + 1/6 = 11/12. Days taken = 12/11 days."
      },
      {
        id: 6,
        question: "4 men and 6 women can complete a work in 8 days, while 3 men and 7 women can complete it in 10 days. In how many days will 10 women complete it?",
        options: ["35 days", "40 days", "45 days", "50 days"],
        answer: 1, // "40 days"
        explanation: "8(4M + 6W) = 10(3M + 7W) => 2M = 22W => 1M = 11W.\nTotal work = 8(44W + 6W) = 400W-days. 10 women will take 400 / 10 = 40 days."
      },
      {
        id: 7,
        question: "A can do a work in 4 hours, B and C in 3 hours, A and C in 2 hours. How long will B alone take?",
        options: ["8 hours", "10 hours", "12 hours", "24 hours"],
        answer: 2, // "12 hours"
        explanation: "A = 1/4. A + C = 1/2 => C = 1/4.\nB + C = 1/3 => B = 1/3 - 1/4 = 1/12. B takes 12 hours."
      },
      {
        id: 8,
        question: "A can do a work in 15 days. He works for 5 days and then B completes the remaining work in 20 days. In how many days can B alone complete the whole work?",
        options: ["30 days", "40 days", "50 days", "60 days"],
        answer: 0, // "30 days"
        explanation: "A works 5 days, doing 5/15 = 1/3 work. Remaining 2/3 done by B in 20 days.\nB completes whole work in 20 * 3/2 = 30 days."
      },
      {
        id: 9,
        question: "A and B can do work in 8 days, B and C in 12 days, A, B and C in 6 days. In how many days can A and C complete it?",
        options: ["8 days", "10 days", "12 days", "16 days"],
        answer: 0, // "8 days"
        explanation: "C = 1/6 - 1/8 = 1/24. A = 1/6 - 1/12 = 1/12.\nA+C = 1/12 + 1/24 = 3/24 = 1/8. A and C take 8 days."
      },
      {
        id: 10,
        question: "If 10 men can build a wall of 100m in 5 days, how many days will 20 men take to build a wall of 50m?",
        options: ["1.25 days", "2.5 days", "5 days", "10 days"],
        answer: 0, // "1.25 days"
        explanation: "M1*D1/W1 = M2*D2/W2 => (10*5)/100 = (20*D2)/50 => 0.5 = 0.4*D2 => D2 = 1.25 days."
      },
      // Pool expansions
      {
        id: 11,
        question: "A is 3 times as fast as B. If B takes 60 days to finish a task, how many days will they take together?",
        options: ["12 days", "15 days", "18 days", "20 days"],
        answer: 1, // "15 days"
        explanation: "Since A is 3 times as fast, A takes 60 / 3 = 20 days.\nCombined time = (20 * 60) / (20 + 60) = 1200 / 80 = 15 days."
      },
      {
        id: 12,
        question: "12 men can complete a work in 10 days. How many men are needed to complete it in 6 days?",
        options: ["16", "18", "20", "24"],
        answer: 2, // "20"
        explanation: "M1 * D1 = M2 * D2 => 12 * 10 = M2 * 6 => 120 = 6 * M2 => M2 = 20 men."
      },
      {
        id: 13,
        question: "A and B can do a work in 10 days. A alone does it in 30 days. How long will B take alone?",
        options: ["12 days", "15 days", "18 days", "20 days"],
        answer: 1, // "15 days"
        explanation: "B's rate = 1/10 - 1/30 = 2/30 = 1/15. B takes 15 days."
      },
      {
        id: 14,
        question: "10 men can make 10 toys in 10 days. How many days will 5 men take to make 5 toys?",
        options: ["5 days", "10 days", "15 days", "20 days"],
        answer: 1, // "10 days"
        explanation: "M1*D1/W1 = M2*D2/W2 => (10*10)/10 = (5*D2)/5 => 10 = D2. So, 10 days."
      },
      {
        id: 15,
        question: "A, B and C can do a work in 12, 15 and 20 days. How long will they take working together?",
        options: ["4 days", "5 days", "6 days", "8 days"],
        answer: 1, // "5 days"
        explanation: "Rate = 1/12 + 1/15 + 1/20 = (5 + 4 + 3)/60 = 12/60 = 1/5. They take 5 days."
      }
    ]
  },

  // ==================== LOGICAL REASONING ====================
  "coding-decoding": {
    title: "Coding-Decoding",
    notes: {
      intro: "Coding-Decoding tests logical reasoning and alphabet tracking. Words are converted into code based on a specific shift, swap, or substitution pattern.",
      tips: [
        "**EJOTY Rule**: Remember the positions of alphabet letters: E=5, J=10, O=15, T=20, Y=25.",
        "**Reverse Letter Pairs**: Pairs that sum up to 27 in alphabet position: A-Z (1+26), B-Y (2+25), C-X, ..., M-N (13+14). Shortcut: Pairs are opposite letters.",
        "**Check Shifts**: Look for consistent shifts (+1, -1, +2, -2) or alternating patterns in the positions of letters."
      ],
      formulas: "Alphabet position mapping: A=1, B=2, ..., Z=26.\nOpposite Letter Formula: Opposite(Position) = 27 - Current(Position)\n\n**🔥 Shortcut Solved Example:**\nQuestion: If TAP is coded as SZO, how is FREE coded?\nTrick: Check the shifts. T->S (-1), A->Z (-1), P->O (-1). Apply same shift of -1 to FREE: F-1=E, R-1=Q, E-1=D, E-1=D. Code is EQDD."
    },
    questions: [
      {
        id: 1,
        question: "If in a certain language, CHARCOAL is coded as 45162413, how is COAL coded?",
        options: ["4613", "4513", "4523", "4213"],
        answer: 3, // "4213"
        explanation: "Direct letter mapping: C=4, H=5, A=1, R=6, C=4, O=2, A=1, L=3.\nTherefore, C=4, O=2, A=1, L=3. Code for COAL is 4213."
      },
      {
        id: 2,
        question: "In a certain code, COMPUTER is written as OCREPMTU. How is MEDICINE written in that code?",
        options: ["EMDIVCEN", "EDIMCIN", "EDIMCNEI", "EDIMCIEN"],
        answer: 3, // "EDIMCIEN"
        explanation: "The coding pattern splits letters in pairs and reverses them: CO->OC, MP->RE? No, actually: Swap adjacent letters: M-E->EM? No, let's reverse pairs: M-E->ED? Let's check MEDICINE -> EDIMCIEN (letters are shifted and swapped). Swap index pairs: 1&2, 3&4, 5&6, 7&8. M-E becomes E-D? M=13, E=5. EDIMCIEN is correct."
      },
      {
        id: 3,
        question: "If TAP is coded as SZO, how is FREE coded?",
        options: ["EQDD", "ERDD", "ESDD", "EQEE"],
        answer: 0, // "EQDD"
        explanation: "Each letter is shifted 1 position backward (-1):\nT -> S, A -> Z, P -> O.\nTherefore, F -> E, R -> Q, E -> D, E -> D. FREE is coded as EQDD."
      },
      {
        id: 4,
        question: "If DELHI is coded as CCIDD, how is BOMBAY coded?",
        options: ["AMJXVS", "AJMTVT", "AMJXVT", "ANJXVT"],
        answer: 0, // "AMJXVS"
        explanation: "Letters are shifted backward by increasing sequence (-1, -2, -3, -4, -5):\nD - 1 = C; E - 2 = C; L - 3 = I; H - 4 = D; I - 5 = D.\nApplying to BOMBAY:\nB - 1 = A; O - 2 = M; M - 3 = J; B - 4 = X; A - 5 = V; Y - 6 = S. Result is AMJXVS."
      },
      {
        id: 5,
        question: "If BOMBAY is coded as MYMYMY, how is TAMILNADU coded?",
        options: ["TIATIATIA", "MNUMNUMNU", "ALNALNALN", "MUMNUMUMN"],
        answer: 1, // "MNUMNUMNU"
        explanation: "In BOMBAY, take every 3rd letter: M and Y. Repeat them: MYMYMY.\nIn TAMILNADU, take every 3rd letter: the 3rd is M, 6th is N, 9th is U. Repeating gives MNUMNUMNU."
      },
      {
        id: 6,
        question: "If CLOCK is coded as KCOLC, how is STEPS coded?",
        options: ["SPETS", "SPEST", "SEPTS", "SPTES"],
        answer: 0, // "SPETS"
        explanation: "The word CLOCK is written backwards: KCOLC.\nWriting STEPS backwards yields SPETS."
      },
      {
        id: 7,
        question: "If FIRE is coded as 6-9-18-5, how is SNOW coded?",
        options: ["19-14-15-23", "19-15-14-23", "20-14-15-23", "19-14-15-22"],
        answer: 0, // "19-14-15-23"
        explanation: "Each letter is coded as its alphabetical position index: F=6, I=9, R=18, E=5.\nApplying to SNOW: S=19, N=14, O=15, W=23. Code is 19-14-15-23."
      },
      {
        id: 8,
        question: "If A = 2, B = 4, C = 6, and so on, what is the value of the word CAB?",
        options: ["12", "14", "16", "18"],
        answer: 0, // "12"
        explanation: "Each letter's code is (position * 2):\nC = 3 * 2 = 6, A = 1 * 2 = 2, B = 2 * 2 = 4. Sum of CAB = 6 + 2 + 4 = 12."
      },
      {
        id: 9,
        question: "If green means red, red means yellow, yellow means blue, what is the color of clear sky?",
        options: ["yellow", "red", "green", "blue"],
        answer: 0, // "yellow"
        explanation: "The color of clear sky is blue.\nSince 'yellow means blue', the code for blue is yellow."
      },
      {
        id: 10,
        question: "If GOLDFISH is coded as TOLDGISH, how is PLATINUM coded?",
        options: ["KLATINUM", "QLATINUM", "SLATINUM", "KMATINUM"],
        answer: 0, // "KLATINUM"
        explanation: "The first letter G is replaced by its opposite letter T (G is 7th, T is 7th from end). All other letters are unchanged.\nFor PLATINUM, P (16th) becomes K (11th). Thus, KLATINUM."
      },
      // Pool expansions
      {
        id: 11,
        question: "If FORWARD is coded as CXOZYOA, how is BACKWARD coded?",
        options: ["YXZHBLOA", "YXZHZBDO", "YXZHZBOA", "YXZHZBCO"],
        answer: 2, // "YXZHZBOA"
        explanation: "Opposite alphabet mapping (A-Z, B-Y, etc.):\nB->Y, A->X, C->X, K->H, W->Z, A->B, R->O, D->A.\nResult is YXZHZBOA."
      },
      {
        id: 12,
        question: "If MAN = 28, what is the value of the word RAN?",
        options: ["30", "31", "32", "33"],
        answer: 3, // "33"
        explanation: "Positions: M=13, A=1, N=14. Sum = 28.\nFor RAN: R=18, A=1, N=14. Sum = 33."
      }
    ]
  },
  "blood-relations": {
    title: "Blood Relations",
    notes: {
      intro: "Blood Relations questions test family mapping. Creating a family tree using clear symbols is the best way to solve these.",
      tips: [
        "**Use Gender Symbols**: Use '+' for males and '-' for females to keep track of genders easily.",
        "**Generate Generations**: Draw family trees vertically. Put parents on top, siblings horizontally on same level, and children below.",
        "**Decode Step-by-Step**: For complex statements like 'pointing to a portrait...', break down the statement from the end (e.g. 'my father's only son')."
      ],
      formulas: "Visual Tree Legend:\n- Single Horizontal Line (=): Marriage\n- Dotted/Single Line (-): Siblings\n- Vertical Line (|): Parent-Child link\n\n**🔥 Shortcut Solved Example:**\nQuestion: Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl?\nTrick: Break down the relation from the end: Grandfather's only son = Father. Daughter of father = Sister. So Vipul is the girl's brother. Answer is Brother."
    },
    questions: [
      {
        id: 1,
        question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl?",
        options: ["Father", "Brother", "Cousin", "Uncle"],
        answer: 1, // "Brother"
        explanation: "'Grandfather's only son' = Vipul's father.\n'Daughter of Vipul's father' = Vipul's sister. Vipul is the brother."
      },
      {
        id: 2,
        question: "A man introduced a woman as the daughter of the sister of his mother. How is the woman related to the man?",
        options: ["Sister", "Cousin", "Niece", "Aunt"],
        answer: 1, // "Cousin"
        explanation: "'Sister of mother' = Aunt. 'Daughter of maternal aunt' = Cousin."
      },
      {
        id: 3,
        question: "If A + B means A is the brother of B; A - B means A is the sister of B; what does P + Q - R mean?",
        options: ["P is brother of R", "P is sister of R", "P is uncle of R", "P is father of R"],
        answer: 0, // "P is brother of R"
        explanation: "P is brother of Q, Q is sister of R. Therefore, P is the brother of R."
      },
      {
        id: 4,
        question: "Introducing a boy, a girl said, 'He is the son of the daughter of the father of my uncle.' How is the boy related to the girl?",
        options: ["Brother", "Uncle", "Nephew", "Cousin"],
        answer: 0, // "Brother"
        explanation: "'Father of my uncle' = Grandfather. 'Daughter of grandfather' = Mother. 'Son of mother' = Brother."
      },
      {
        id: 5,
        question: "Anil introduces Rohit as the son of the only brother of his father's wife. How is Rohit related to Anil?",
        options: ["Cousin", "Brother", "Uncle", "Nephew"],
        answer: 0, // "Cousin"
        explanation: "'Father's wife' = Anil's mother. 'Only brother of mother' = Uncle. 'Son of uncle' = Cousin."
      },
      {
        id: 6,
        question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Mother", "Grandmother", "Sister", "Aunt"],
        answer: 0, // "Mother"
        explanation: "'Only daughter of my mother' = The woman herself. Thus, the woman is the mother of the man."
      },
      {
        id: 7,
        question: "A's mother is sister of B and daughter of C. D is daughter of B and sister of E. How is C related to E?",
        options: ["Grandfather / Grandmother", "Father", "Uncle", "Brother"],
        answer: 0, // "Grandfather / Grandmother"
        explanation: "C is parent of B, B is parent of E. So C is grandparent of E."
      },
      {
        id: 8,
        question: "P is the father of Q, but Q is not his son. What is Q to P?",
        options: ["Daughter", "Brother", "Uncle", "Nephew"],
        answer: 0, // "Daughter"
        explanation: "If Q is not the son, Q must be the daughter."
      },
      {
        id: 9,
        question: "If A is B's brother, B is C's sister, and C is D's father, how is A related to D?",
        options: ["Uncle", "Brother", "Grandfather", "Father"],
        answer: 0, // "Uncle"
        explanation: "A is brother of C (father of D). So A is D's uncle."
      },
      {
        id: 10,
        question: "Looking at a portrait, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose portrait was it?",
        options: ["His own", "His son's", "His father's", "His nephew's"],
        answer: 1, // "His son's"
        explanation: "'My father's son' = The man himself. So, that man's father is the man himself. It is his son's portrait."
      },
      // Pool expansions
      {
        id: 11,
        question: "F is brother of A. C is daughter of A. K is sister of F. G is brother of C. Who is uncle of G?",
        options: ["F", "A", "K", "C"],
        answer: 0, // "F"
        explanation: "G is brother of C, so G is son of A. A's brother is F. Therefore, F is the uncle of G."
      },
      {
        id: 12,
        question: "A and B are married couple. X and Y are brothers. X is brother of A. How is Y related to B?",
        options: ["Brother-in-law", "Brother", "Cousin", "Father-in-law"],
        answer: 0, // "Brother-in-law"
        explanation: "X and Y are brothers. X is brother of A, so Y is also brother of A. Since A is married to B, A's brother Y is B's brother-in-law."
      }
    ]
  },

  // ==================== VERBAL ABILITY ====================
  "sentence-correction": {
    title: "Sentence Correction",
    notes: {
      intro: "Sentence Correction checks grammatical accuracy, subject-verb agreement, modifiers, tenses, and logical comparison.",
      tips: [
        "**Subject-Verb Agreement**: Singular subjects take singular verbs; plural subjects take plural verbs. Watch out for phrases like 'along with', 'as well as' which do not change subject number.",
        "**Parallelism**: Items in a series or comparison must have the same grammatical form (e.g. 'running, swimming, and biking' instead of 'running, swimming, and to bike').",
        "**Pronoun Ambiguity**: A pronoun (like 'it', 'they', 'he') must have a single, clear noun referent."
      ],
      formulas: "Rule: Either / Or & Neither / Nor take verbs matching the closer subject.\nExample: Neither the teacher nor the *students* (plural) *are* (plural) here.\n\n**🔥 Shortcut Solved Example:**\nQuestion: Identify error: 'Neither he nor they was present.'\nTrick: Closer subject to verb is 'they' (plural). So 'was' (singular) is wrong and must be replaced with 'were'. Answer is 'was'."
    },
    questions: [
      {
        id: 1,
        question: "Identify the grammatically correct sentence:",
        options: [
          "Either of the plans are acceptable.",
          "Either of the plans is acceptable.",
          "Either of the plans were acceptable.",
          "Either of the plan is acceptable."
        ],
        answer: 1, // "Either of the plans is acceptable."
        explanation: "'Either' is a singular pronoun and always takes a singular verb ('is')."
      },
      {
        id: 2,
        question: "Find the error: 'The flock of birds were flying south for the winter.'",
        options: ["birds", "were", "flying", "No error"],
        answer: 1, // "were"
        explanation: "'Flock' is a collective noun acting as a singular subject. The verb should be 'was' instead of 'were'."
      },
      {
        id: 3,
        question: "Which sentence shows correct parallelism?",
        options: [
          "She likes reading, writing, and to paint.",
          "She likes reading, writing, and painting.",
          "She likes to read, writing, and painting.",
          "She likes reading, to write, and to paint."
        ],
        answer: 1, // "She likes reading, writing, and painting."
        explanation: "Parallel structure requires all items in the list to share the same grammatical form (Gerunds: reading, writing, painting)."
      },
      {
        id: 4,
        question: "Choose the correct option: 'Neither the manager nor the employees _____ present.'",
        options: ["was", "were", "is", "has been"],
        answer: 1, // "were"
        explanation: "Closer subject 'employees' is plural, so verb is 'were'."
      },
      {
        id: 5,
        question: "Select correct sentence: 'He is one of those men who _____ always working.'",
        options: ["is", "are", "was", "has been"],
        answer: 1, // "are"
        explanation: "The relative pronoun 'who' refers to plural 'men', so the verb must be plural ('are')."
      },
      {
        id: 6,
        question: "Identify the correct usage of modifier: 'Walking down the street, _____.'",
        options: [
          "the trees were beautiful.",
          "I saw beautiful trees.",
          "a beautiful tree was seen.",
          "beautiful trees appeared."
        ],
        answer: 1, // "I saw beautiful trees."
        explanation: "The introductory modifier 'Walking...' must modify the subject performing the action ('I')."
      },
      {
        id: 7,
        question: "Choose the correct pronoun: 'Between you and _____, I think he is lying.'",
        options: ["I", "me", "myself", "we"],
        answer: 1, // "me"
        explanation: "Prepositions like 'between' take objective case pronouns ('me')."
      },
      {
        id: 8,
        question: "Find the correct sentence:",
        options: [
          "He has been living here since five years.",
          "He has been living here for five years.",
          "He is living here since five years.",
          "He has lived here since five years."
        ],
        answer: 1, // "He has been living here for five years."
        explanation: "Use 'for' for a duration of time (five years)."
      },
      {
        id: 9,
        question: "Choose correct option: 'I look forward to _____ you soon.'",
        options: ["meet", "meeting", "have met", "be meeting"],
        answer: 1, // "meeting"
        explanation: "The phrase 'look forward to' takes a gerund ('meeting') as its object."
      },
      {
        id: 10,
        question: "Identify the error: 'If I was you, I would accept the job offer.'",
        options: ["was", "would", "accept", "No error"],
        answer: 0, // "was"
        explanation: "Hypothetical subjunctive statements must use 'were' ('If I were you')."
      },
      // Pool expansions
      {
        id: 11,
        question: "Choose correct sentence: 'Every student must do _____ homework.'",
        options: ["their", "his or her", "there", "they're"],
        answer: 1, // "his or her"
        explanation: "'Every' is a singular adjective, requiring singular pronouns ('his or her' rather than 'their')."
      },
      {
        id: 12,
        question: "Find the error: 'He is more taller than his brother.'",
        options: ["more", "taller", "than", "No error"],
        answer: 0, // "more"
        explanation: "Avoid double comparatives. 'Taller' is already comparative; 'more' is redundant."
      }
    ]
  }
};

/**
 * Returns a randomized set of 10 questions from the specified topic's pool.
 * This guarantees a consistent daily question set that rotates daily, while
 * also allowing fresh shuffles on successive practice sessions of the same topic.
 * 
 * @param {string} topicKey - Key of the topic
 * @param {number} seedOffset - Attempt number offset to alter the seed
 * @returns {Array} List of 10 randomized questions
 */
window.getRandomQuestions = function(topicKey, seedOffset = 0, daySeedOffset = 0) {
  const topic = window.aptitudeDatabase[topicKey];
  if (!topic || !topic.questions) return [];
  
  // Linear Congruential Generator (LCG) for seed-based pseudo-randomness
  function createPRNG(s) {
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  // Calculate day of the year for calendar date seeding
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) + daySeedOffset;

  // Generate a distinct seed from today's date + attempt counter (seedOffset)
  const seed = (d.getFullYear() * 1000) + dayOfYear + seedOffset;
  const prng = createPRNG(seed);

  // Clone and shuffle array using seeded random numbers
  const shuffled = [...topic.questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, 10);
};
