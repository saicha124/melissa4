import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, Pause, RotateCcw, ChevronRight, Lightbulb, History, Cog, ArrowRight, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ALPHABET } from "@/lib/caesar";

interface CipherEducationProps {
  cipher: "caesar" | "vigenere" | "rsa";
  lang: "fr" | "en" | "ar";
  caesarShift?: number;
  vigenereKey?: string;
  rsaKeys?: {
    publicKey: { e: number; n: number };
    privateKey: { d: number; n: number };
  };
}

const educationContent = {
  caesar: {
    fr: {
      title: "Chiffre de César",
      history: "Inventé par Jules César (100-44 av. J.-C.) pour protéger ses messages militaires. C'est l'un des plus anciens systèmes de chiffrement connus.",
      howItWorks: "Chaque lettre est remplacée par une lettre située un certain nombre de positions plus loin dans l'alphabet. Ce nombre est appelé la 'clé' ou le 'décalage'.",
      example: {
        title: "Exemple avec décalage de 3",
        steps: [
          { original: "A", shifted: "D", explanation: "A (position 0) + 3 = D (position 3)" },
          { original: "B", shifted: "E", explanation: "B (position 1) + 3 = E (position 4)" },
          { original: "Z", shifted: "C", explanation: "Z (position 25) + 3 = C (position 2, on revient au début)" }
        ],
        message: "BONJOUR",
        encrypted: "ERQMRXU"
      },
      formula: "Chiffrement: C = (P + K) mod 26\nDéchiffrement: P = (C - K) mod 26",
      weakness: "Vulnérable à l'analyse de fréquence car chaque lettre est toujours remplacée par la même lettre."
    },
    en: {
      title: "Caesar Cipher",
      history: "Invented by Julius Caesar (100-44 BC) to protect his military messages. It is one of the oldest known encryption systems.",
      howItWorks: "Each letter is replaced by a letter located a certain number of positions further in the alphabet. This number is called the 'key' or 'shift'.",
      example: {
        title: "Example with shift of 3",
        steps: [
          { original: "A", shifted: "D", explanation: "A (position 0) + 3 = D (position 3)" },
          { original: "B", shifted: "E", explanation: "B (position 1) + 3 = E (position 4)" },
          { original: "Z", shifted: "C", explanation: "Z (position 25) + 3 = C (position 2, wraps around)" }
        ],
        message: "HELLO",
        encrypted: "KHOOR"
      },
      formula: "Encryption: C = (P + K) mod 26\nDecryption: P = (C - K) mod 26",
      weakness: "Vulnerable to frequency analysis because each letter is always replaced by the same letter."
    },
    ar: {
      title: "شفرة قيصر",
      history: "اخترعها يوليوس قيصر (100-44 ق.م) لحماية رسائله العسكرية. وهي من أقدم أنظمة التشفير المعروفة.",
      howItWorks: "يتم استبدال كل حرف بحرف يقع على مسافة معينة في الأبجدية. يسمى هذا الرقم 'المفتاح' أو 'الإزاحة'.",
      example: {
        title: "مثال مع إزاحة 3",
        steps: [
          { original: "A", shifted: "D", explanation: "A (موقع 0) + 3 = D (موقع 3)" },
          { original: "B", shifted: "E", explanation: "B (موقع 1) + 3 = E (موقع 4)" },
          { original: "Z", shifted: "C", explanation: "Z (موقع 25) + 3 = C (موقع 2، نعود للبداية)" }
        ],
        message: "HELLO",
        encrypted: "KHOOR"
      },
      formula: "التشفير: C = (P + K) mod 26\nفك التشفير: P = (C - K) mod 26",
      weakness: "عرضة لتحليل التردد لأن كل حرف يُستبدل دائماً بنفس الحرف."
    }
  },
  vigenere: {
    fr: {
      title: "Chiffre de Vigenère",
      history: "Créé par Blaise de Vigenère au 16e siècle. Pendant 300 ans, il fut considéré comme 'indéchiffrable' - surnommé 'le chiffre indéchiffrable'.",
      howItWorks: "Utilise un mot-clé qui est répété pour correspondre à la longueur du message. Chaque lettre du mot-clé indique le décalage à appliquer à la lettre correspondante du message.",
      example: {
        title: "Exemple avec clé 'CLE'",
        steps: [
          { original: "B", key: "C", shifted: "D", explanation: "B + C(2) = D" },
          { original: "O", key: "L", shifted: "Z", explanation: "O + L(11) = Z" },
          { original: "N", key: "E", shifted: "R", explanation: "N + E(4) = R" }
        ],
        message: "BONJOUR",
        key: "CLE",
        encrypted: "DZVMWCV"
      },
      formula: "Chiffrement: C_i = (P_i + K_i) mod 26\nDéchiffrement: P_i = (C_i - K_i) mod 26",
      weakness: "Peut être cassé par l'analyse de Kasiski si la clé est courte et réutilisée."
    },
    en: {
      title: "Vigenère Cipher",
      history: "Created by Blaise de Vigenère in the 16th century. For 300 years, it was considered 'unbreakable' - nicknamed 'le chiffre indéchiffrable'.",
      howItWorks: "Uses a keyword that is repeated to match the message length. Each letter of the keyword indicates the shift to apply to the corresponding letter of the message.",
      example: {
        title: "Example with key 'KEY'",
        steps: [
          { original: "H", key: "K", shifted: "R", explanation: "H + K(10) = R" },
          { original: "E", key: "E", shifted: "I", explanation: "E + E(4) = I" },
          { original: "L", key: "Y", shifted: "J", explanation: "L + Y(24) = J" }
        ],
        message: "HELLO",
        key: "KEY",
        encrypted: "RIJVS"
      },
      formula: "Encryption: C_i = (P_i + K_i) mod 26\nDecryption: P_i = (C_i - K_i) mod 26",
      weakness: "Can be broken by Kasiski analysis if the key is short and reused."
    },
    ar: {
      title: "شفرة فيجينير",
      history: "ابتكرها بليز دي فيجينير في القرن السادس عشر. لمدة 300 عام، اعتُبرت 'غير قابلة للكسر'.",
      howItWorks: "تستخدم كلمة مفتاحية تُكرر لتتناسب مع طول الرسالة. كل حرف من الكلمة المفتاحية يحدد الإزاحة للحرف المقابل.",
      example: {
        title: "مثال مع مفتاح 'KEY'",
        steps: [
          { original: "H", key: "K", shifted: "R", explanation: "H + K(10) = R" },
          { original: "E", key: "E", shifted: "I", explanation: "E + E(4) = I" },
          { original: "L", key: "Y", shifted: "J", explanation: "L + Y(24) = J" }
        ],
        message: "HELLO",
        key: "KEY",
        encrypted: "RIJVS"
      },
      formula: "التشفير: C_i = (P_i + K_i) mod 26\nفك التشفير: P_i = (C_i - K_i) mod 26",
      weakness: "يمكن كسرها بتحليل كاسيسكي إذا كان المفتاح قصيراً ومُعاداً."
    }
  },
  rsa: {
    fr: {
      title: "Chiffrement RSA",
      history: "Inventé en 1977 par Rivest, Shamir et Adleman. Premier algorithme de chiffrement asymétrique public. Utilisé pour sécuriser Internet (HTTPS, emails).",
      howItWorks: "Utilise deux clés: une clé publique pour chiffrer (que tout le monde peut voir) et une clé privée pour déchiffrer (gardée secrète). Basé sur la difficulté de factoriser de grands nombres.",
      example: {
        title: "Exemple avec p=11, q=17",
        steps: [
          { step: "1", description: "n = p × q = 11 × 17 = 187" },
          { step: "2", description: "φ(n) = (p-1)(q-1) = 10 × 16 = 160" },
          { step: "3", description: "Choisir e copremier avec φ(n): e = 3" },
          { step: "4", description: "Calculer d tel que 3×d ≡ 1 (mod 160)" },
          { step: "5", description: "Division euclidienne: 160 ÷ 3 = 53 reste 1, donc 160 = 53×3 + 1" },
          { step: "6", description: "Réarrangement: 1 = 160 - 53×3, donc 3×(-53) ≡ 1 (mod 160)" },
          { step: "7", description: "Conversion: -53 mod 160 = 160 - 53 = 107, donc d = 107" },
          { step: "8", description: "Vérification: 3 × 107 = 321 = 2×160 + 1 ≡ 1 (mod 160)" }
        ],
        encryption: "Pour chiffrer M=7: C = 7³ mod 187 = 343 mod 187 = 156",
        decryption: "Pour déchiffrer C=156: M = 156¹⁰⁷ mod 187 = 7"
      },
      formula: "Chiffrement: C = M^e mod n\nDéchiffrement: M = C^d mod n",
      weakness: "Sûr avec de grands nombres premiers (2048+ bits). Vulnérable aux ordinateurs quantiques (algorithme de Shor)."
    },
    en: {
      title: "RSA Encryption",
      history: "Invented in 1977 by Rivest, Shamir and Adleman. First public asymmetric encryption algorithm. Used to secure the Internet (HTTPS, emails).",
      howItWorks: "Uses two keys: a public key to encrypt (everyone can see) and a private key to decrypt (kept secret). Based on the difficulty of factoring large numbers.",
      example: {
        title: "Example with p=11, q=17",
        steps: [
          { step: "1", description: "n = p × q = 11 × 17 = 187" },
          { step: "2", description: "φ(n) = (p-1)(q-1) = 10 × 16 = 160" },
          { step: "3", description: "Choose e coprime with φ(n): e = 3" },
          { step: "4", description: "Calculate d such that 3×d ≡ 1 (mod 160)" },
          { step: "5", description: "Euclidean division: 160 ÷ 3 = 53 remainder 1, so 160 = 53×3 + 1" },
          { step: "6", description: "Rearrange: 1 = 160 - 53×3, so 3×(-53) ≡ 1 (mod 160)" },
          { step: "7", description: "Convert: -53 mod 160 = 160 - 53 = 107, so d = 107" },
          { step: "8", description: "Verification: 3 × 107 = 321 = 2×160 + 1 ≡ 1 (mod 160)" }
        ],
        encryption: "To encrypt M=7: C = 7³ mod 187 = 343 mod 187 = 156",
        decryption: "To decrypt C=156: M = 156¹⁰⁷ mod 187 = 7"
      },
      formula: "Encryption: C = M^e mod n\nDecryption: M = C^d mod n",
      weakness: "Secure with large prime numbers (2048+ bits). Vulnerable to quantum computers (Shor's algorithm)."
    },
    ar: {
      title: "تشفير RSA",
      history: "اخترع في 1977 بواسطة ريفست وشامير وأدلمان. أول خوارزمية تشفير غير متماثلة عامة. يُستخدم لتأمين الإنترنت.",
      howItWorks: "يستخدم مفتاحين: مفتاح عام للتشفير (يمكن للجميع رؤيته) ومفتاح خاص لفك التشفير (يُحفظ سراً). يعتمد على صعوبة تحليل الأعداد الكبيرة.",
      example: {
        title: "مثال مع p=11, q=17",
        steps: [
          { step: "1", description: "n = p × q = 11 × 17 = 187" },
          { step: "2", description: "φ(n) = (p-1)(q-1) = 10 × 16 = 160" },
          { step: "3", description: "اختيار e أولي نسبياً مع φ(n): e = 3" },
          { step: "4", description: "حساب d بحيث 3×d ≡ 1 (mod 160)" },
          { step: "5", description: "القسمة الإقليدية: 160 ÷ 3 = 53 والباقي 1، إذن 160 = 53×3 + 1" },
          { step: "6", description: "إعادة الترتيب: 1 = 160 - 53×3، إذن 3×(-53) ≡ 1 (mod 160)" },
          { step: "7", description: "التحويل: -53 mod 160 = 160 - 53 = 107، إذن d = 107" },
          { step: "8", description: "التحقق: 3 × 107 = 321 = 2×160 + 1 ≡ 1 (mod 160)" }
        ],
        encryption: "للتشفير M=7: C = 7³ mod 187 = 156",
        decryption: "لفك التشفير C=156: M = 156¹⁰⁷ mod 187 = 7"
      },
      formula: "التشفير: C = M^e mod n\nفك التشفير: M = C^d mod n",
      weakness: "آمن مع أعداد أولية كبيرة (2048+ بت). عرضة للحواسيب الكمومية."
    }
  }
};

export function CipherEducation({ cipher, lang, caesarShift = 3, vigenereKey = "KEY", rsaKeys }: CipherEducationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const content = educationContent[cipher][lang];
  const isRTL = lang === "ar";

  const labels = {
    fr: { history: "Histoire", howItWorks: "Comment ça marche", example: "Exemple pratique", formula: "Formule", weakness: "Point faible", tryIt: "Voir l'animation", step: "Étape" },
    en: { history: "History", howItWorks: "How it works", example: "Practical example", formula: "Formula", weakness: "Weakness", tryIt: "See animation", step: "Step" },
    ar: { history: "التاريخ", howItWorks: "كيف تعمل", example: "مثال عملي", formula: "الصيغة", weakness: "نقطة الضعف", tryIt: "شاهد الرسوم المتحركة", step: "خطوة" }
  };

  const l = labels[lang];

  const startAnimation = () => {
    setShowAnimation(true);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <Card className="bg-white/90 backdrop-blur border-0 shadow-xl overflow-hidden">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${
          cipher === "caesar" ? "from-indigo-600 to-purple-600" :
          cipher === "vigenere" ? "from-cyan-600 to-teal-600" :
          "from-emerald-600 to-green-600"
        } p-4 text-white`}>
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h3 className="text-lg font-bold">{content.title}</h3>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <History className="w-4 h-4" />
              {l.history}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
              {content.history}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <Cog className="w-4 h-4" />
              {l.howItWorks}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-3 rounded-xl border border-blue-100">
              {content.howItWorks}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {l.example}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={startAnimation}
                className="text-xs gap-1"
                data-testid="button-start-animation"
              >
                <Play className="w-3 h-3" />
                {l.tryIt}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="text-sm font-bold text-amber-800">{content.example.title}</div>
              
              {cipher !== "rsa" ? (
                <div className="space-y-2">
                  {content.example.steps.map((step: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm bg-white/60 p-2 rounded-lg"
                    >
                      <span className="font-mono font-bold text-amber-700 w-6">{step.original}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-bold text-green-700 w-6">{step.shifted}</span>
                      <span className="text-slate-500 text-xs flex-1">{step.explanation}</span>
                    </motion.div>
                  ))}
                  
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-center gap-4 font-mono">
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase mb-1">Message</div>
                      <div className="font-bold text-lg text-slate-700">{(content.example as any).message}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-amber-400" />
                    <div className="text-center">
                      <div className="text-[10px] text-slate-400 uppercase mb-1">
                        {lang === "fr" ? "Chiffré" : lang === "ar" ? "مشفر" : "Encrypted"}
                      </div>
                      <div className="font-bold text-lg text-green-600">{(content.example as any).encrypted}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {content.example.steps.map((step: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm bg-white/60 p-2 rounded-lg"
                    >
                      <span className="bg-emerald-100 text-emerald-700 font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">{step.step}</span>
                      <span className="text-slate-600 font-mono text-xs">{step.description}</span>
                    </motion.div>
                  ))}
                  
                  <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
                    <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <Lock className="w-3 h-3" />
                        <span className="font-mono">{(content.example as any).encryption}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-blue-700">
                        <Unlock className="w-3 h-3" />
                        <span className="font-mono">{(content.example as any).decryption}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase mb-2">{l.formula}</div>
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap" dir="ltr">
                {content.formula}
              </pre>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <div className="text-[10px] text-red-400 uppercase mb-2">{l.weakness}</div>
              <p className="text-xs text-red-700">{content.weakness}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StepByStepAnimationProps {
  cipher: "caesar" | "vigenere" | "rsa";
  message: string;
  shift?: number;
  keyword?: string;
  rsaKeys?: {
    publicKey: { e: number; n: number };
    privateKey: { d: number; n: number };
  };
  isEncrypting: boolean;
  lang: "fr" | "en" | "ar";
}

export function StepByStepAnimation({ 
  cipher, 
  message, 
  shift = 3, 
  keyword = "KEY",
  rsaKeys,
  isEncrypting,
  lang 
}: StepByStepAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // For RSA decryption, we need to handle space-separated numbers differently
  const isRsaDecrypt = cipher === "rsa" && !isEncrypting;
  const rawCleanMessage = message.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 50);
  
  // For RSA decryption, split by spaces to get numbers; otherwise use characters
  const rsaNumbers = isRsaDecrypt ? rawCleanMessage.trim().split(/\s+/).filter(n => n.length > 0) : [];
  const cleanMessage = isRsaDecrypt 
    ? rsaNumbers.join(" ") 
    : rawCleanMessage.replace(/\s+/g, "").slice(0, 10);
  
  // Display items: for RSA decrypt, show each number as a unit; otherwise each character
  const displayItems = isRsaDecrypt ? rsaNumbers : cleanMessage.split("");
  
  const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
  
  const labels = {
    fr: { 
      title: "Animation étape par étape",
      original: "Original",
      key: "Clé",
      result: "Résultat",
      position: "Position",
      calculation: "Calcul",
      play: "Lancer",
      pause: "Pause",
      reset: "Recommencer",
      noMessage: "Entrez un message pour voir l'animation"
    },
    en: { 
      title: "Step-by-step animation",
      original: "Original",
      key: "Key",
      result: "Result",
      position: "Position",
      calculation: "Calculation",
      play: "Play",
      pause: "Pause",
      reset: "Reset",
      noMessage: "Enter a message to see animation"
    },
    ar: { 
      title: "الرسوم المتحركة خطوة بخطوة",
      original: "الأصل",
      key: "المفتاح",
      result: "النتيجة",
      position: "الموقع",
      calculation: "الحساب",
      play: "تشغيل",
      pause: "إيقاف",
      reset: "إعادة",
      noMessage: "أدخل رسالة لرؤية الرسوم المتحركة"
    }
  };
  
  const l = labels[lang];

  const startAnimation = () => {
    setIsPlaying(true);
    setCurrentCharIndex(0);
    setAnimationComplete(false);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentCharIndex(-1);
    setAnimationComplete(false);
  };

  const getCharResult = (item: string, index: number): { result: string; keyChar: string; calculation: string } => {
    // For RSA decryption, item is a number string like "156"
    if (isRsaDecrypt) {
      if (!rsaKeys) return { result: "?", keyChar: "-", calculation: "-" };
      const c = parseInt(item, 10);
      if (isNaN(c)) return { result: "?", keyChar: "-", calculation: "-" };
      
      const d = rsaKeys.privateKey.d;
      const n = rsaKeys.publicKey.n;
      
      // Calculate c^d mod n
      let result = 1;
      let base = c % n;
      let exp = d;
      while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % n;
        exp = Math.floor(exp / 2);
        base = (base * base) % n;
      }
      
      // Convert back to letter (1=A, 2=B, etc.)
      const letter = result >= 1 && result <= 26 ? String.fromCharCode(result + 64) : String(result);
      
      return {
        result: letter,
        keyChar: `(d=${d}, n=${n})`,
        calculation: `${c}^${d} mod ${n} = ${result} → ${result}=${letter}`
      };
    }
    
    // For non-RSA decrypt cases, item is a single character
    const char = item;
    if (!ALPHABET.includes(char)) {
      return { result: char, keyChar: "-", calculation: "-" };
    }
    
    const charPos = ALPHABET.indexOf(char);
    
    if (cipher === "caesar") {
      if (isEncrypting) {
        const newPos = (charPos + shift) % 26;
        return {
          result: ALPHABET[newPos],
          keyChar: String(shift),
          calculation: `(${charPos} + ${shift}) mod 26 = ${newPos}`
        };
      } else {
        const rawResult = charPos - shift;
        const newPos = ((rawResult % 26) + 26) % 26;
        return {
          result: ALPHABET[newPos],
          keyChar: String(shift),
          calculation: `(${charPos} - ${shift}) mod 26 = (${rawResult}) mod 26 = ${newPos}`
        };
      }
    } else if (cipher === "vigenere") {
      const keyChar = cleanKeyword[index % cleanKeyword.length];
      const keyShift = ALPHABET.indexOf(keyChar);
      if (isEncrypting) {
        const newPos = (charPos + keyShift) % 26;
        return {
          result: ALPHABET[newPos],
          keyChar: `${keyChar} (${keyShift})`,
          calculation: `(${charPos} + ${keyShift}) mod 26 = ${newPos}`
        };
      } else {
        const rawResult = charPos - keyShift;
        const newPos = ((rawResult % 26) + 26) % 26;
        return {
          result: ALPHABET[newPos],
          keyChar: `${keyChar} (${keyShift})`,
          calculation: `(${charPos} - ${keyShift}) mod 26 = (${rawResult}) mod 26 = ${newPos}`
        };
      }
    } else {
      // RSA encryption (not decryption)
      if (!rsaKeys) return { result: "?", keyChar: "-", calculation: "-" };
      const m = charPos + 1; // A=1, B=2, etc.
      const exponent = rsaKeys.publicKey.e;
      const n = rsaKeys.publicKey.n;
      let result = 1;
      let base = m % n;
      let exp = exponent;
      while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % n;
        exp = Math.floor(exp / 2);
        base = (base * base) % n;
      }
      const originalChar = ALPHABET[charPos];
      return {
        result: String(result),
        keyChar: `(e=${exponent}, n=${n})`,
        calculation: `${originalChar}=${m} → ${m}^${exponent} mod ${n} = ${result}`
      };
    }
  };

  if (!cleanMessage) {
    return (
      <div className="text-center py-8 text-slate-400 italic">
        {l.noMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-700 flex items-center gap-2">
          <Play className="w-4 h-4" />
          {l.title}
        </h4>
        <div className="flex gap-2">
          {!isPlaying ? (
            <Button size="sm" onClick={startAnimation} className="gap-1" data-testid="button-play-animation">
              <Play className="w-3 h-3" />
              {l.play}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={pauseAnimation} className="gap-1">
              <Pause className="w-3 h-3" />
              {l.pause}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={resetAnimation} className="gap-1">
            <RotateCcw className="w-3 h-3" />
            {l.reset}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${displayItems.length}, 1fr)` }}>
            <div className="text-[10px] font-bold text-slate-400 uppercase p-2">{l.original}</div>
            {displayItems.map((item, i) => (
              <motion.div
                key={`orig-${i}`}
                className={`${isRsaDecrypt ? "min-w-14 px-2" : "w-10"} h-10 rounded-lg flex items-center justify-center font-mono font-bold ${isRsaDecrypt ? "text-sm" : "text-lg"} transition-all ${
                  i === currentCharIndex 
                    ? "bg-amber-400 text-white scale-110 shadow-lg" 
                    : i < currentCharIndex 
                      ? "bg-slate-200 text-slate-500" 
                      : "bg-white border border-slate-200 text-slate-700"
                }`}
                animate={i === currentCharIndex ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {item}
              </motion.div>
            ))}

            {cipher !== "rsa" && (
              <>
                <div className="text-[10px] font-bold text-slate-400 uppercase p-2">{l.key}</div>
                {displayItems.map((item, i) => {
                  const { keyChar } = getCharResult(item, i);
                  return (
                    <motion.div
                      key={`key-${i}`}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm transition-all ${
                        i === currentCharIndex 
                          ? "bg-purple-400 text-white" 
                          : i < currentCharIndex 
                            ? "bg-purple-100 text-purple-500" 
                            : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {cipher === "caesar" ? shift : (ALPHABET.includes(item) ? cleanKeyword[i % cleanKeyword.length] : "-")}
                    </motion.div>
                  );
                })}
              </>
            )}

            <div className="text-[10px] font-bold text-slate-400 uppercase p-2 flex items-center">
              <ArrowRight className="w-3 h-3 mr-1" />
              {l.result}
            </div>
            {displayItems.map((item, i) => {
              const { result } = getCharResult(item, i);
              const isProcessed = i < currentCharIndex || (i === currentCharIndex && animationComplete);
              return (
                <motion.div
                  key={`result-${i}`}
                  className={`${isRsaDecrypt ? "min-w-14 px-2" : "w-10"} h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all ${
                    i === currentCharIndex && !animationComplete
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg animate-pulse" 
                      : isProcessed
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-slate-50 text-slate-300 border border-dashed border-slate-200"
                  }`}
                  initial={i === currentCharIndex ? { scale: 0, rotate: -180 } : {}}
                  animate={i === currentCharIndex ? { scale: 1, rotate: 0 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  {isProcessed ? result : "?"}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {currentCharIndex >= 0 && currentCharIndex < displayItems.length && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
              >
                <div className="text-xs text-slate-500 mb-2">{l.calculation}:</div>
                <div className="font-mono text-lg text-indigo-700 font-bold" dir="ltr">
                  {getCharResult(displayItems[currentCharIndex], currentCharIndex).calculation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isPlaying && currentCharIndex >= 0 && (
        <motion.div
          key={currentCharIndex}
          onAnimationComplete={() => {
            if (currentCharIndex < displayItems.length - 1) {
              setTimeout(() => setCurrentCharIndex(prev => prev + 1), 100);
            } else {
              setIsPlaying(false);
              setAnimationComplete(true);
            }
          }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      )}
    </div>
  );
}
