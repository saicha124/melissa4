// Simple RSA Implementation for Educational Purposes

// Check if a number is prime
export function isPrime(num: number): boolean {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false; 
  }
  return num > 1;
}

// Greatest Common Divisor
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Modular Inverse (Extended Euclidean Algorithm)
export function modInverse(e: number, phi: number): number {
  let m0 = phi;
  let y = 0;
  let x = 1;

  if (phi === 1) return 0;

  while (e > 1) {
    let q = Math.floor(e / phi);
    let t = phi;
    phi = e % phi;
    e = t;
    t = y;
    y = x - q * y;
    x = t;
  }

  if (x < 0) x += m0;

  return x;
}

// Modular Exponentiation: (base^exp) % mod
export function modPow(base: number, exp: number, mod: number): number {
  let res = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) res = (res * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return res;
}

// Generate Keys based on two primes
export function generateKeys(p: number, q: number) {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Choose e such that 1 < e < phi and gcd(e, phi) = 1
  let e = 3;
  while (gcd(e, phi) !== 1) {
    e += 2;
  }
  
  const d = modInverse(e, phi);
  
  return {
    publicKey: { e, n },
    privateKey: { d, n },
    phi
  };
}

// Encrypt a string using Public Key (e, n)
// Supports:
// - Text: Converts chars to 1-26 (A=1) -> encrypts
// - Numbers: Encrypts raw numbers if input matches "12 34" format
export function rsaEncrypt(text: string, e: number, n: number): string {
  const trimmed = text.trim();
  
  // If input is space-separated numbers (e.g., "12 5 100")
  if (/^(\d+\s*)+$/.test(trimmed)) {
    return trimmed
      .split(/\s+/)
      .map(numStr => {
        const m = parseInt(numStr, 10);
        if (isNaN(m)) return "";
        // Encrypt number directly
        return modPow(m, e, n).toString();
      })
      .join(" ");
  }

  // Otherwise treat as text
  return text
    .toUpperCase()
    .split("")
    .map(char => {
      const code = char.charCodeAt(0);
      let m = 0;
      if (code >= 65 && code <= 90) {
         m = code - 64; // A=1
      } else {
         // Treat digits 0-9 in text mode? Or just ignore?
         // Let's keep strict A-Z for text mode to avoid confusion
         m = 0; 
      }
      
      if (m === 0) return "0"; 
      
      const c = modPow(m, e, n);
      return c.toString();
    })
    .join(" ");
}

// Decrypt a string of space-separated numbers using Private Key (d, n)
export function rsaDecrypt(text: string, d: number, n: number): string {
  return text
    .split(" ")
    .map(numStr => {
      const c = parseInt(numStr, 10);
      if (isNaN(c)) return "";
      if (c === 0) return " "; // Space
      
      // m = c^d mod n
      const m = modPow(c, d, n);
      
      // Convert back to char (1=A)
      return String.fromCharCode(m + 64);
    })
    .join("");
}
