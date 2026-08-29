// subnetCalculator.js
// Pure, dependency-free IPv4 / CIDR math. Every value below is derived,
// never hardcoded, so it stays correct for any address + prefix pair.

/** Validate a dotted-quad IPv4 string. */
export function isValidIPv4(ip) {
  if (typeof ip !== "string") return false;
  const trimmed = ip.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    if (part.length > 1 && part[0] === "0") return false; // no leading zeros
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

/** Validate a CIDR prefix, either as "24" or "/24" or a number. */
export function isValidCIDR(cidr) {
  const n = typeof cidr === "number" ? cidr : Number(String(cidr).replace("/", "").trim());
  return Number.isInteger(n) && n >= 0 && n <= 32;
}

/** "192.168.1.10" -> 3232235786 (unsigned 32-bit integer) */
export function ipToInt(ip) {
  return ip
    .trim()
    .split(".")
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

/** 3232235786 -> "192.168.1.10" */
export function intToIp(int) {
  return [24, 16, 8, 0].map((shift) => (int >>> shift) & 255).join(".");
}

/** Prefix length -> subnet mask as an integer. /0 -> 0, /32 -> 4294967295 */
export function prefixToMaskInt(prefix) {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function prefixToMask(prefix) {
  return intToIp(prefixToMaskInt(prefix));
}

/** Number of bits set in the wildcard (host) portion. */
export function wildcardMaskInt(prefix) {
  return (~prefixToMaskInt(prefix)) >>> 0;
}

export function wildcardMask(prefix) {
  return intToIp(wildcardMaskInt(prefix));
}

/** Classful designation, based purely on the leading bit pattern of the address. */
export function getIpClass(ip) {
  const firstOctet = Number(ip.trim().split(".")[0]);
  if (firstOctet >= 0 && firstOctet <= 127) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D (Multicast)";
  if (firstOctet >= 240 && firstOctet <= 255) return "E (Reserved)";
  return "Unknown";
}

/** 8-bit binary octet string, e.g. 5 -> "00000101" */
function toBinaryOctet(n) {
  return n.toString(2).padStart(8, "0");
}

/** "192.168.1.10" -> "11000000.10101000.00000001.00001010" */
export function ipToBinary(ip) {
  return ip
    .trim()
    .split(".")
    .map((o) => toBinaryOctet(Number(o)))
    .join(".");
}

/**
 * Full subnet breakdown for a given IP + CIDR prefix.
 * Handles /31 (point-to-point, RFC 3021) and /32 (single host) specially:
 * neither has a usable range distinct from network/broadcast.
 */
export function calculateSubnet(ip, prefixInput) {
  if (!isValidIPv4(ip)) {
    throw new Error("That doesn't look like a valid IPv4 address. Use four numbers 0-255, separated by dots — e.g. 192.168.1.10.");
  }
  if (!isValidCIDR(prefixInput)) {
    throw new Error("CIDR prefix must be a number from 0 to 32 — e.g. /24.");
  }

  const prefix = typeof prefixInput === "number" ? prefixInput : Number(String(prefixInput).replace("/", "").trim());
  const ipInt = ipToInt(ip);
  const maskInt = prefixToMaskInt(prefix);
  const wildcardInt = wildcardMaskInt(prefix);

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const totalAddresses = Math.pow(2, 32 - prefix);
  let usableHosts;
  let firstHostInt;
  let lastHostInt;

  if (prefix === 32) {
    usableHosts = 1; // the address itself, e.g. a loopback or host route
    firstHostInt = networkInt;
    lastHostInt = networkInt;
  } else if (prefix === 31) {
    usableHosts = 2; // RFC 3021 point-to-point link, no network/broadcast reserved
    firstHostInt = networkInt;
    lastHostInt = broadcastInt;
  } else {
    usableHosts = Math.max(totalAddresses - 2, 0);
    firstHostInt = networkInt + 1;
    lastHostInt = broadcastInt - 1;
  }

  return {
    ip,
    prefix,
    cidr: `/${prefix}`,
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    totalAddresses,
    usableHosts,
    ipClass: getIpClass(ip),
    binaryIp: ipToBinary(ip),
    binaryMask: ipToBinary(intToIp(maskInt)),
    networkInt,
    broadcastInt,
  };
}

/** Format large numbers with thousands separators, e.g. 16777216 -> "16,777,216" */
export function formatNumber(n) {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// CIDR reference table data (derived, not hardcoded per-row)
// ---------------------------------------------------------------------------
export const CIDR_REFERENCE = Array.from({ length: 33 }, (_, prefix) => {
  const total = Math.pow(2, 32 - prefix);
  const usable = prefix >= 31 ? (prefix === 32 ? 1 : 2) : total - 2;
  return {
    prefix,
    cidr: `/${prefix}`,
    mask: prefixToMask(prefix),
    total,
    usable,
  };
});

// ---------------------------------------------------------------------------
// Practice question generation
// ---------------------------------------------------------------------------

const QUESTION_TYPES = [
  "network",
  "broadcast",
  "firstHost",
  "lastHost",
  "subnetMask",
  "usableHosts",
];

const QUESTION_LABEL = {
  network: "Network Address",
  broadcast: "Broadcast Address",
  firstHost: "First Usable Host",
  lastHost: "Last Usable Host",
  subnetMask: "Subnet Mask",
  usableHosts: "Number of Usable Hosts",
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random private-range-flavored IPv4 octet, biased toward realistic classroom examples. */
function randomIp() {
  const firstOctetPools = [10, 172, 192];
  const first = firstOctetPools[randomInt(0, firstOctetPools.length - 1)];
  let second;
  if (first === 172) second = randomInt(16, 31);
  else if (first === 192) second = 168;
  else second = randomInt(0, 255);
  const third = randomInt(0, 255);
  const fourth = randomInt(1, 254);
  return `${first}.${second}.${third}.${fourth}`;
}

/** Generate one random practice question with everything needed to grade it. */
export function generateQuestion(previousType) {
  // Avoid repeating the same question type twice in a row when possible.
  let type = QUESTION_TYPES[randomInt(0, QUESTION_TYPES.length - 1)];
  if (QUESTION_TYPES.length > 1 && type === previousType) {
    type = QUESTION_TYPES[(QUESTION_TYPES.indexOf(type) + 1) % QUESTION_TYPES.length];
  }

  // Keep the practice range to /8 - /30 so every question has a clean,
  // unambiguous usable range (avoids the /31 and /32 edge cases in quizzes).
  const prefix = randomInt(8, 30);
  const ip = randomIp();
  const result = calculateSubnet(ip, prefix);

  let answer;
  let explanation;

  switch (type) {
    case "network":
      answer = result.networkAddress;
      explanation = `AND the IP address with the subnet mask (${result.subnetMask}). ${ip} in binary is ${result.binaryIp}; masking it with ${result.binaryMask} zeroes out the host bits, leaving the network address ${result.networkAddress}.`;
      break;
    case "broadcast":
      answer = result.broadcastAddress;
      explanation = `Take the network address (${result.networkAddress}) and set every host bit to 1. With a /${prefix} mask, that gives a broadcast address of ${result.broadcastAddress}.`;
      break;
    case "firstHost":
      answer = result.firstHost;
      explanation = `The first usable host is the network address plus 1. The network address is ${result.networkAddress}, so the first usable host is ${result.firstHost}.`;
      break;
    case "lastHost":
      answer = result.lastHost;
      explanation = `The last usable host is the broadcast address minus 1. The broadcast address is ${result.broadcastAddress}, so the last usable host is ${result.lastHost}.`;
      break;
    case "subnetMask":
      answer = result.subnetMask;
      explanation = `A /${prefix} prefix means the first ${prefix} bits are network bits. Written as a dotted-decimal mask, that's ${result.subnetMask}.`;
      break;
    case "usableHosts":
      answer = String(result.usableHosts);
      explanation = `A /${prefix} network has 2^(32-${prefix}) = ${formatNumber(result.totalAddresses)} total addresses. Subtracting the network and broadcast addresses leaves ${formatNumber(result.usableHosts)} usable hosts.`;
      break;
    default:
      break;
  }

  return {
    type,
    label: QUESTION_LABEL[type],
    prompt: `Given the IP address ${ip}/${prefix}, what is the ${QUESTION_LABEL[type]}?`,
    ip,
    prefix,
    answer,
    explanation,
    result,
  };
}

/**
 * Compare a user's typed answer to the correct answer, tolerant of
 * extra whitespace and a leading slash on mask-shaped answers.
 */
export function checkAnswer(userInput, correctAnswer) {
  if (typeof userInput !== "string") return false;
  const normalize = (s) => s.trim().replace(/^\//, "");
  return normalize(userInput) === normalize(correctAnswer);
}

// ---------------------------------------------------------------------------
// Session randomization (Fisher-Yates shuffle over a generated question bank)
// ---------------------------------------------------------------------------

/** How many questions make up one practice session. */
export const QUESTIONS_PER_SESSION = 10;

// The pool a session is drawn from is larger than the session itself so
// that "randomly select N from the bank" is meaningful rather than just
// shuffling exactly N items.
const QUESTION_POOL_SIZE = 30;

/**
 * Fisher-Yates shuffle. Returns a new array in randomized order and never
 * mutates the input, so the original question bank/pool is always safe
 * to reuse.
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Build one practice session: a fresh, randomly-generated question bank,
 * shuffled with Fisher-Yates, deduplicated, then trimmed to session size.
 * Call this every time a session starts (first load, Play Again, or a
 * page refresh) so the order — and the specific questions — are never
 * the same session to session.
 */
export function generateQuestionSession(sessionSize = QUESTIONS_PER_SESSION) {
  const pool = [];
  const seenKeys = new Set();
  const maxAttempts = QUESTION_POOL_SIZE * 20; // safety valve, avoids an infinite loop
  let attempts = 0;

  while (pool.length < QUESTION_POOL_SIZE && attempts < maxAttempts) {
    attempts++;
    const previousType = pool.length ? pool[pool.length - 1].type : undefined;
    const candidate = generateQuestion(previousType);
    const key = `${candidate.ip}/${candidate.prefix}-${candidate.type}`;
    if (seenKeys.has(key)) continue; // no duplicate questions in the bank
    seenKeys.add(key);
    pool.push(candidate);
  }

  return shuffleArray(pool).slice(0, sessionSize);
}
