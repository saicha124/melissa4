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
// Converts chars to ASCII codes (or A=1 mapping) -> encrypts -> returns space-separated numbers
export function rsaEncrypt(text: string, e: number, n: number): string {
  return text
    .toUpperCase()
    .split("")
    .map(char => {
      // Map A-Z to 1-26 (0 is problematic in simple RSA if padding isn't used correctly, but 1-26 is safe if n > 26)
      // Actually standard ASCII is fine if n > 127.
      // Let's stick to A=1, B=2... Z=26 for pedagogical consistency with Caesar
      const code = char.charCodeAt(0);
      let m = 0;
      if (code >= 65 && code <= 90) {
         m = code - 64; // A=1
      } else {
         m = 0; // Space or other
      }
      
      if (m === 0) return "0"; // Treat 0 as space/special
      
      // c = m^e mod n
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
