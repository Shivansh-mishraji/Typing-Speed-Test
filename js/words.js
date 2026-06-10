// ============================================================
// WORD BANKS — Easy, Medium, Hard, Numbers, Quotes
// ============================================================

const WORDS = {
  easy: [
    "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he",
    "as","you","do","at","this","but","his","by","from","they","we","say","her","she","or",
    "an","will","my","one","all","would","there","their","what","so","up","out","if","about",
    "who","get","which","go","me","when","make","can","like","time","no","just","him","know",
    "take","people","into","year","your","good","some","could","them","see","other","than","then",
    "now","look","only","come","its","over","think","also","back","after","use","two","how",
    "our","work","first","well","way","even","new","want","because","any","these","give","day",
    "most","us","great","between","need","large","often","hand","high","place","hold","real",
    "life","few","north","open","seem","together","next","white","children","begin","got","walk",
    "example","ease","paper","group","always","music","those","both","mark","book","letter","until"
  ],
  medium: [
    "about","above","across","after","again","against","almost","along","already","although",
    "always","around","because","before","behind","believe","between","beyond","bought","breath",
    "brought","build","built","careful","carry","caught","certain","change","choose","circle",
    "clear","close","color","coming","common","complete","continue","control","corner","could",
    "country","create","current","decide","describe","difference","difficult","discuss","during",
    "earth","enough","enter","every","example","experience","explain","express","family","father",
    "figure","finally","follow","forest","forget","forward","found","friend","front","general",
    "getting","given","govern","ground","happen","having","health","heart","heavy","history",
    "however","hundred","important","include","inside","interest","island","itself","journey",
    "justice","knowledge","language","leader","learn","leave","length","letter","light","likely",
    "listen","living","local","longer","machine","manage","matter","measure","member","method",
    "middle","might","minute","modern","moment","money","month","morning","mother","mountain",
    "movement","music","nation","nature","nearly","neither","normal","notice","number","object",
    "office","often","order","outside","perfect","period","person","picture","planet","plastic",
    "plenty","point","possible","practice","prepare","present","pretty","problem","process",
    "product","program","protect","provide","public","question","quickly","quiet","rather","reach",
    "reason","receive","recent","record","relate","remain","report","require","result","return",
    "right","river","science","second","secret","sentence","serve","simple","since","single",
    "sister","social","society","someone","something","sometimes","special","start","state",
    "station","still","store","story","street","strong","student","study","subject","support",
    "system","table","teach","technology","temperature","through","toward","travel","trouble",
    "understand","until","usually","valley","value","various","voice","water","whether","while",
    "whole","without","wonder","world","write","young","yourself"
  ],
  hard: [
    "aberration","abhorrence","abominable","absolution","abstinence","accentuate","accessibility",
    "accommodate","accomplishment","accountability","accumulation","acknowledgment","acquaintance",
    "acquisition","administration","advertisement","affectionate","aggravation","agriculture",
    "amusement","anthropological","antipathy","apocalyptic","appreciation","approximately",
    "architecture","argumentative","arrangement","assassination","astonishment","asynchronous",
    "authentication","authorization","autobiography","bureaucratic","catastrophic","charismatic",
    "choreography","circumstances","claustrophobia","collaboration","commemoration","commissioned",
    "communication","compensation","comprehension","concentration","configuration","congratulations",
    "consciousness","consequently","constitutional","contradiction","controversial","coordination",
    "counterproductive","crystallography","customization","decomposition","deliberation",
    "demonstration","denomination","deterioration","determination","differentiation","disadvantage",
    "disappointment","discrimination","disorganization","dissatisfaction","documentation",
    "electromagnetic","embarrassment","environmental","establishment","exaggeration","examination",
    "exceptional","exhaustion","extraterrestrial","facilitation","fanaticism","fascination",
    "flabbergasted","fluorescence","functionality","fundamental","generalization","geographical",
    "glorification","hallucination","humanitarian","hypocrisy","identification","impersonation",
    "implementation","impossibility","infrastructure","initialization","interdependence","intuition",
    "investigation","justification","knowledgeable","legitimization","liberation","magnification",
    "manipulation","materialistic","Mediterranean","metamorphosis","miscommunication","misconception",
    "misinterpretation","modernization","multiplication","nanotechnology","naturalization","negotiation",
    "nevertheless","nomenclature","normalization","obsolescence","optimization","orchestration",
    "overwhelming","parallelism","parliamentary","perpendicular","pharmaceutical","philosophical",
    "photosynthesis","physiological","popularization","precipitation","prioritization","procrastination",
    "pronunciation","proportional","psychological","questionable","rationalization","rehabilitation",
    "reinforcement","responsibilities","sophisticated","specialization","spirituality","staggering",
    "standardization","straightforward","subscription","sustainability","synchronization",
    "telecommunications","temperamental","transformation","transparency","troubleshooting",
    "unbelievable","understanding","uncomfortable","unpredictable","visualization","vulnerability"
  ],
  quotes: [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein"
    },
    {
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius"
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The only thing we have to fear is fear itself.",
      author: "Franklin D. Roosevelt"
    },
    {
      text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
      author: "Albert Einstein"
    },
    {
      text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
      author: "Ralph Waldo Emerson"
    },
    {
      text: "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",
      author: "Robert Frost"
    },
    {
      text: "In three words I can sum up everything I've learned about life: it goes on.",
      author: "Robert Frost"
    },
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela"
    },
    {
      text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
      author: "Mother Teresa"
    },
    {
      text: "When you reach the end of your rope, tie a knot in it and hang on.",
      author: "Franklin D. Roosevelt"
    },
    {
      text: "Always remember that you are absolutely unique. Just like everyone else.",
      author: "Margaret Mead"
    },
    {
      text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
      author: "Ralph Waldo Emerson"
    },
    {
      text: "You will face many defeats in life, but never let yourself be defeated.",
      author: "Maya Angelou"
    },
    {
      text: "The greatest danger for most of us is not that our aim is too high and we miss it, but that it is too low and we reach it.",
      author: "Michelangelo"
    },
    {
      text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
      author: "Maya Angelou"
    },
    {
      text: "If life were predictable it would cease to be life, and be without flavor.",
      author: "Eleanor Roosevelt"
    },
    {
      text: "If you look at what you have in life, you will always have more. If you look at what you don't have in life, you will never have enough.",
      author: "Oprah Winfrey"
    },
    {
      text: "If you set your goals ridiculously high and it is a failure, you will fail above everyone else's success.",
      author: "James Cameron"
    },
    {
      text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
      author: "Dr. Seuss"
    },
    {
      text: "If life is a journey then the road is your thoughts. So think wisely and choose a path that brings inner peace.",
      author: "Leon Brown"
    },
    {
      text: "Whether you think you can or you think you cannot, you are right.",
      author: "Henry Ford"
    }
  ]
};

// Generate word list for a test
function generateWordList(difficulty, count, includeNumbers, includePunctuation) {
  const pool = WORDS[difficulty] || WORDS.medium;
  const words = [];
  for (let i = 0; i < count; i++) {
    let word = pool[Math.floor(Math.random() * pool.length)];
    if (includeNumbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 1000));
    }
    if (includePunctuation && Math.random() < 0.1) {
      word += ['.',',','!','?',';',':'][Math.floor(Math.random()*6)];
    }
    words.push(word);
  }
  return words;
}

// Get a random quote
function getRandomQuote() {
  const quotes = WORDS.quotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
}
