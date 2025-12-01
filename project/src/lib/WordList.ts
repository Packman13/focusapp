// WordList module with 500 common, neutral English nouns and verbs
const WORD_BANK = [
  "apple", "river", "mountain", "forest", "ocean", "garden", "bridge", "castle", "desert", "island",
  "valley", "meadow", "cloud", "storm", "rainbow", "sunset", "sunrise", "moon", "star", "planet",
  "book", "paper", "pencil", "table", "chair", "window", "door", "wall", "floor", "ceiling",
  "road", "path", "street", "building", "house", "tower", "village", "city", "town", "country",
  "music", "song", "dance", "art", "paint", "canvas", "brush", "color", "shape", "form",
  "water", "fire", "earth", "wind", "ice", "snow", "rain", "fog", "mist", "dew",
  "tree", "leaf", "branch", "root", "flower", "seed", "fruit", "grass", "plant", "herb",
  "bird", "fish", "animal", "insect", "butterfly", "eagle", "falcon", "dove", "swan", "crane",
  "stone", "rock", "crystal", "gem", "pearl", "diamond", "silver", "gold", "copper", "iron",
  "bread", "cheese", "wine", "tea", "coffee", "sugar", "salt", "spice", "honey", "oil",
  "think", "walk", "run", "jump", "climb", "swim", "fly", "drive", "ride", "travel",
  "read", "write", "draw", "paint", "create", "build", "make", "design", "plan", "imagine",
  "speak", "talk", "listen", "hear", "see", "watch", "look", "observe", "notice", "find",
  "learn", "teach", "study", "practice", "train", "exercise", "play", "perform", "compete", "win",
  "eat", "drink", "taste", "smell", "touch", "feel", "sense", "perceive", "understand", "know",
  "love", "care", "help", "support", "guide", "lead", "follow", "join", "connect", "unite",
  "grow", "develop", "improve", "advance", "progress", "evolve", "change", "transform", "adapt", "adjust",
  "start", "begin", "initiate", "launch", "open", "close", "end", "finish", "complete", "conclude",
  "give", "take", "share", "exchange", "trade", "offer", "receive", "accept", "reject", "refuse",
  "choose", "select", "pick", "decide", "determine", "resolve", "settle", "agree", "disagree", "argue",
  "light", "shadow", "darkness", "brightness", "glow", "shine", "sparkle", "gleam", "flash", "beam",
  "circle", "square", "triangle", "sphere", "cube", "pyramid", "cone", "cylinder", "spiral", "helix",
  "morning", "evening", "noon", "midnight", "dawn", "dusk", "day", "night", "week", "month",
  "spring", "summer", "autumn", "winter", "season", "weather", "climate", "temperature", "heat", "cold",
  "hand", "foot", "head", "heart", "mind", "body", "soul", "spirit", "energy", "force",
  "dream", "hope", "wish", "goal", "purpose", "mission", "vision", "plan", "strategy", "tactic",
  "peace", "calm", "quiet", "silence", "stillness", "rest", "sleep", "wake", "rise", "fall",
  "joy", "smile", "laugh", "cheer", "delight", "pleasure", "comfort", "ease", "relief", "bliss",
  "strength", "power", "courage", "bravery", "valor", "honor", "respect", "dignity", "pride", "grace",
  "wisdom", "knowledge", "insight", "truth", "fact", "reality", "fiction", "story", "tale", "legend",
  "sound", "noise", "echo", "voice", "whisper", "shout", "cry", "call", "signal", "message",
  "word", "phrase", "sentence", "paragraph", "chapter", "verse", "line", "text", "script", "code",
  "number", "count", "amount", "total", "sum", "difference", "product", "quotient", "ratio", "rate",
  "pattern", "design", "structure", "system", "order", "chaos", "random", "sequence", "series", "cycle",
  "wave", "ripple", "current", "flow", "stream", "tide", "surge", "rush", "drift", "float",
  "space", "time", "place", "moment", "instant", "period", "duration", "span", "range", "scope",
  "edge", "corner", "center", "middle", "side", "top", "bottom", "front", "back", "surface",
  "open", "closed", "empty", "full", "whole", "part", "piece", "fragment", "portion", "section",
  "clean", "dirty", "pure", "mixed", "clear", "cloudy", "bright", "dark", "sharp", "dull",
  "smooth", "rough", "soft", "hard", "flexible", "rigid", "solid", "liquid", "gas", "vapor",
  "move", "stop", "pause", "continue", "proceed", "advance", "retreat", "return", "arrive", "depart",
  "rise", "sink", "float", "dive", "soar", "glide", "hover", "land", "launch", "lift",
  "push", "pull", "press", "squeeze", "stretch", "bend", "twist", "turn", "spin", "rotate",
  "hold", "release", "grasp", "catch", "throw", "toss", "cast", "fling", "hurl", "pitch",
  "gather", "scatter", "collect", "distribute", "spread", "concentrate", "focus", "blur", "sharpen", "soften",
  "increase", "decrease", "expand", "contract", "grow", "shrink", "enlarge", "reduce", "multiply", "divide",
  "add", "subtract", "combine", "separate", "merge", "split", "unite", "divide", "join", "detach",
  "attach", "connect", "disconnect", "link", "unlink", "bind", "unbind", "tie", "untie", "fasten",
  "lock", "unlock", "seal", "unseal", "cover", "uncover", "hide", "reveal", "show", "display",
  "present", "represent", "symbolize", "signify", "indicate", "point", "direct", "guide", "navigate", "steer",
  "control", "manage", "operate", "handle", "manipulate", "adjust", "regulate", "balance", "stabilize", "maintain"
];

export function getRandomWords(count: number): string[] {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getWordCount(): number {
  return WORD_BANK.length;
}
