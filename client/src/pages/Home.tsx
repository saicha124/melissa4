import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, RefreshCw, ArrowRight, Info, Sparkles, Shield, Key, BarChart3, ChevronDown, Check, Calculator, Globe, Binary } from "lucide-react";
import { caesarCipher, vigenereCipher, ALPHABET } from "@/lib/caesar";
import { generateKeys, rsaEncrypt, rsaDecrypt, isPrime } from "@/lib/rsa";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const translations = {
  fr: {
    header_tag: "Cryptographie & Mathématiques",
    header_title: "César vs Vigenère vs RSA",
    header_desc: "Explore trois méthodes de chiffrement : du simple décalage à la cryptographie asymétrique moderne.",
    tab_caesar: "César",
    tab_vigenere: "Vigenère",
    tab_rsa: "RSA (Asymétrique)",
    input_label: "Ton Message (Texte ou Nombres)",
    btn_reset: "Effacer",
    placeholder_caesar: "Écris ton message secret ici...",
    placeholder_rsa: "Ex: 'A' (pour 1) ou '12' (nombre direct)",
    shift_label: "Décalage (Clé)",
    key_label: "Mot-Clé Secret",
    key_desc: "Le mot-clé est répété pour correspondre à la longueur du message.",
    rsa_primes_label: "Nombres Premiers (p, q)",
    rsa_public_key: "Clé Publique (e, n)",
    rsa_private_key: "Clé Privée (d, n)",
    rsa_warn: "A=1, B=2... ou entrez des nombres directement.",
    btn_encrypt: "Chiffrer",
    btn_decrypt: "Déchiffrer",
    result_label: "Résultat",
    result_char_count: "caractères",
    result_placeholder: "Le message transformé apparaîtra ici...",
    btn_explain: "Comprendre le calcul",
    math_title: "Logique Mathématique",
    math_desc_caesar: "Le chiffre de César décale chaque lettre d'un nombre fixe.",
    math_desc_vigenere: "Vigenère utilise une série de chiffres de César différents basés sur un mot-clé.",
    math_desc_rsa: "RSA utilise deux clés différentes (publique pour chiffrer, privée pour déchiffrer) basées sur des grands nombres premiers.",
    math_formula_label: "Formule de chiffrement",
    legend_l: "L = Lettre Originale",
    legend_mod: "mod = Reste division",
    comp_title: "Comparaison Rapide",
    comp_col_criteria: "Critère",
    comp_row_simplicity: "Simplicité",
    comp_val_simple: "Très Simple",
    comp_val_medium: "Moyen",
    comp_val_complex: "Complexe",
    comp_row_security: "Sécurité",
    comp_val_weak: "Faible",
    comp_val_better: "Meilleure",
    comp_val_strong: "Très Forte",
    comp_row_key: "Type de Clé",
    comp_val_number: "Un nombre",
    comp_val_word: "Un mot",
    comp_val_pair: "Paire de clés",
    comp_row_weakness: "Usage",
    comp_val_freq: "Historique",
    comp_val_repeat: "Historique",
    comp_val_internet: "Sécurise Internet",
    preview_title: "Aperçu de la transformation",
    preview_empty: "Commence à écrire pour voir la transformation...",
    dialog_title: "La Magie des Maths",
    dialog_desc: "Voici comment nous transformons la lettre",
    dialog_desc_rsa: "Voici comment nous transformons la valeur",
    dialog_index: "Index",
    dialog_shift: "Décalage",
    dialog_key: "Clé",
    dialog_details: "Détails du calcul :",
    dialog_step1: "1. Position de départ :",
    dialog_step2: "2. On ajoute le décalage :",
    dialog_step3: "3. Modulo 26 (reste) :",
    dialog_step4: "4. Nouvelle lettre :",
    dialog_rsa_step1: "1. Valeur (M) :",
    dialog_rsa_step2: "2. Puissance (e) :",
    dialog_rsa_step3: "3. Modulo n :",
    dialog_rsa_step4: "4. Résultat chiffré :",
    dialog_footer: "* Le modulo 26 permet de revenir au début de l'alphabet (Z → A)"
  },
  en: {
    header_tag: "Cryptography & Mathematics",
    header_title: "Caesar vs Vigenère vs RSA",
    header_desc: "Explore three encryption methods: from simple shifts to modern asymmetric cryptography.",
    tab_caesar: "Caesar",
    tab_vigenere: "Vigenère",
    tab_rsa: "RSA (Asymmetric)",
    input_label: "Your Message (Text or Numbers)",
    btn_reset: "Clear",
    placeholder_caesar: "Type your secret message here...",
    placeholder_rsa: "Ex: 'A' (for 1) or '12' (direct number)",
    shift_label: "Shift (Key)",
    key_label: "Secret Keyword",
    key_desc: "The keyword is repeated to match the message length.",
    rsa_primes_label: "Prime Numbers (p, q)",
    rsa_public_key: "Public Key (e, n)",
    rsa_private_key: "Private Key (d, n)",
    rsa_warn: "A=1, B=2... or enter numbers directly.",
    btn_encrypt: "Encrypt",
    btn_decrypt: "Decrypt",
    result_label: "Result",
    result_char_count: "characters",
    result_placeholder: "The transformed message will appear here...",
    btn_explain: "Understand the Math",
    math_title: "Mathematical Logic",
    math_desc_caesar: "The Caesar cipher shifts every letter by a fixed number.",
    math_desc_vigenere: "Vigenère uses a series of different Caesar ciphers based on a keyword.",
    math_desc_rsa: "RSA uses two different keys (public to encrypt, private to decrypt) based on large prime numbers.",
    math_formula_label: "Encryption Formula",
    legend_l: "L = Original Letter",
    legend_mod: "mod = Remainder",
    comp_title: "Quick Comparison",
    comp_col_criteria: "Criteria",
    comp_row_simplicity: "Simplicity",
    comp_val_simple: "Very Simple",
    comp_val_medium: "Medium",
    comp_val_complex: "Complex",
    comp_row_security: "Security",
    comp_val_weak: "Weak",
    comp_val_better: "Better",
    comp_val_strong: "Very Strong",
    comp_row_key: "Key Type",
    comp_val_number: "A Number",
    comp_val_word: "A Word",
    comp_val_pair: "Key Pair",
    comp_row_weakness: "Usage",
    comp_val_freq: "Historical",
    comp_val_repeat: "Historical",
    comp_val_internet: "Secures Internet",
    preview_title: "Transformation Preview",
    preview_empty: "Start typing to see the transformation...",
    dialog_title: "The Magic of Math",
    dialog_desc: "Here is how we transform the letter",
    dialog_desc_rsa: "Here is how we transform the value",
    dialog_index: "Index",
    dialog_shift: "Shift",
    dialog_key: "Key",
    dialog_details: "Calculation Details:",
    dialog_step1: "1. Starting Position:",
    dialog_step2: "2. Add the shift:",
    dialog_step3: "3. Modulo 26 (remainder):",
    dialog_step4: "4. New Letter:",
    dialog_rsa_step1: "1. Value (M):",
    dialog_rsa_step2: "2. Power (e):",
    dialog_rsa_step3: "3. Modulo n:",
    dialog_rsa_step4: "4. Encrypted Result:",
    dialog_footer: "* Modulo 26 allows wrapping back to the start of the alphabet (Z → A)"
  },
  ar: {
    header_tag: "التشفير والرياضيات",
    header_title: "قيصر ضد فيجينير ضد RSA",
    header_desc: "استكشف ثلاث طرق للتشفير: من الإزاحة البسيطة إلى التشفير غير المتماثل الحديث.",
    tab_caesar: "قيصر",
    tab_vigenere: "فيجينير",
    tab_rsa: "RSA (غير متماثل)",
    input_label: "رسالتك (نص أو أرقام)",
    btn_reset: "مسح",
    placeholder_caesar: "اكتب رسالتك السرية هنا...",
    placeholder_rsa: "مثال: 'A' (لـ 1) أو '12' (رقم مباشر)",
    shift_label: "الإزاحة (المفتاح)",
    key_label: "الكلمة المفتاحية السرية",
    key_desc: "يتم تكرار الكلمة المفتاحية لتتناسب مع طول الرسالة.",
    rsa_primes_label: "الأعداد الأولية (p, q)",
    rsa_public_key: "المفتاح العام (e, n)",
    rsa_private_key: "المفتاح الخاص (d, n)",
    rsa_warn: "A=1, B=2... أو أدخل أرقامًا مباشرة.",
    btn_encrypt: "تشفير",
    btn_decrypt: "فك التشفير",
    result_label: "النتيجة",
    result_char_count: "حروف",
    result_placeholder: "ستظهر الرسالة المحولة هنا...",
    btn_explain: "افهم الحساب",
    math_title: "المنطق الرياضي",
    math_desc_caesar: "يقوم تشفير قيصر بإزاحة كل حرف بمقدار رقم ثابت.",
    math_desc_vigenere: "يستخدم فيجينير سلسلة من شفرات قيصر المختلفة بناءً على كلمة مفتاحية.",
    math_desc_rsa: "يستخدم RSA مفتاحين مختلفين (عام للتشفير، وخاص لفك التشفير) بناءً على أعداد أولية كبيرة.",
    math_formula_label: "صيغة التشفير",
    legend_l: "L = الحرف الأصلي",
    legend_mod: "mod = الباقي",
    comp_title: "مقارنة سريعة",
    comp_col_criteria: "المعيار",
    comp_row_simplicity: "البساطة",
    comp_val_simple: "بسيط جداً",
    comp_val_medium: "متوسط",
    comp_val_complex: "معقد",
    comp_row_security: "الأمان",
    comp_val_weak: "ضعيف",
    comp_val_better: "أفضل",
    comp_val_strong: "قوي جداً",
    comp_row_key: "نوع المفتاح",
    comp_val_number: "رقم",
    comp_val_word: "كلمة",
    comp_val_pair: "زوج مفاتيح",
    comp_row_weakness: "الاستخدام",
    comp_val_freq: "تاريخي",
    comp_val_repeat: "تاريخي",
    comp_val_internet: "يؤمن الإنترنت",
    preview_title: "معاينة التحويل",
    preview_empty: "ابدأ بالكتابة لرؤية التحويل...",
    dialog_title: "سحر الرياضيات",
    dialog_desc: "إليك كيفية تحويل الحرف",
    dialog_desc_rsa: "إليك كيفية تحويل القيمة",
    dialog_index: "فهرس",
    dialog_shift: "إزاحة",
    dialog_key: "مفتاح",
    dialog_details: "تفاصيل الحساب:",
    dialog_step1: "1. موضع البداية:",
    dialog_step2: "2. نضيف الإزاحة:",
    dialog_step3: "3. باقي القسمة (Modulo 26):",
    dialog_step4: "4. الحرف الجديد:",
    dialog_rsa_step1: "1. القيمة (M):",
    dialog_rsa_step2: "2. الأس (e):",
    dialog_rsa_step3: "3. باقي القسمة n:",
    dialog_rsa_step4: "4. النتيجة المشفرة:",
    dialog_footer: "* يسمح Modulo 26 بالعودة إلى بداية الأبجدية (Z → A)"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const t = translations[lang];
  const isRTL = lang === "ar";
  
  const [activeCipher, setActiveCipher] = useState<"caesar" | "vigenere" | "rsa">("caesar");
  
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  
  // Caesar State
  const [caesarShift, setCaesarShift] = useState(3);
  
  // Vigenere State
  const [vigenereKey, setVigenereKey] = useState("MATHS");

  // RSA State
  const [p, setP] = useState(11);
  const [q, setQ] = useState(17);
  const [keys, setKeys] = useState({ publicKey: { e: 3, n: 187 }, privateKey: { d: 107, n: 187 }, phi: 160 });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  // Update RSA Keys when primes change
  useEffect(() => {
    if (isPrime(p) && isPrime(q) && p !== q) {
      const k = generateKeys(p, q);
      setKeys(k);
    }
  }, [p, q]);

  // Auto-update result when inputs change
  useEffect(() => {
    let output = "";
    if (activeCipher === "caesar") {
      output = caesarCipher(message, caesarShift, mode === "decrypt");
    } else if (activeCipher === "vigenere") {
      output = vigenereCipher(message, vigenereKey, mode === "decrypt");
    } else if (activeCipher === "rsa") {
       if (mode === "encrypt") {
         output = rsaEncrypt(message, keys.publicKey.e, keys.publicKey.n);
       } else {
         output = rsaDecrypt(message, keys.privateKey.d, keys.privateKey.n);
       }
    }
    setResult(output);
  }, [message, caesarShift, vigenereKey, mode, activeCipher, keys]);

  const handleAction = (newMode: "encrypt" | "decrypt") => {
    setMode(newMode);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const resetApp = () => {
    setMessage("");
    setCaesarShift(3);
    setVigenereKey("MATHS");
    // Reset RSA default primes
    setP(11);
    setQ(17);
    setMode("encrypt");
    setResult("");
  };

  // Calculation for the explanation modal
  const getExplanationData = () => {
    const cleanMessage = message.toUpperCase().replace(/[^A-Z]/g, "");
    const firstChar = cleanMessage.length > 0 ? cleanMessage[0] : "A";
    const charIndex = ALPHABET.indexOf(firstChar) + 1; // RSA uses 1-based index here for math
    
    let shift = 0;
    let keyChar = "";
    let rsaCalc = { m: 0, e: 0, n: 0, res: 0, step1: "", step2: "" };
    
    if (activeCipher === "caesar") {
      shift = caesarShift;
    } else if (activeCipher === "vigenere") {
      const cleanKey = vigenereKey.toUpperCase().replace(/[^A-Z]/g, "");
      keyChar = cleanKey.length > 0 ? cleanKey[0] : "A";
      shift = ALPHABET.indexOf(keyChar);
    } else if (activeCipher === "rsa") {
      // RSA explanation logic
      const m = charIndex; // Using 1-based index (A=1) for RSA demo
      if (mode === "encrypt") {
        rsaCalc = {
          m: m,
          e: keys.publicKey.e,
          n: keys.publicKey.n,
          res: Number(BigInt(m) ** BigInt(keys.publicKey.e) % BigInt(keys.publicKey.n)),
          step1: `${firstChar} → ${m}`,
          step2: `${m}^${keys.publicKey.e} mod ${keys.publicKey.n}`
        };
      } else {
        // For decryption explanation, take the first number from message
        const nums = message.trim().split(" ");
        const firstNum = parseInt(nums[0]) || 0;
        rsaCalc = {
          m: firstNum,
          e: keys.privateKey.d, // using d as exponent
          n: keys.privateKey.n,
          res: Number(BigInt(firstNum) ** BigInt(keys.privateKey.d) % BigInt(keys.privateKey.n)),
          step1: `${firstNum}`,
          step2: `${firstNum}^${keys.privateKey.d} mod ${keys.privateKey.n}`
        };
      }
    }

    // Adjust shift for decryption if needed (Caesar/Vigenere)
    const effectiveShift = mode === "decrypt" ? (26 - (shift % 26)) % 26 : shift;
    
    const sum = (ALPHABET.indexOf(firstChar)) + effectiveShift;
    const newIndex = sum % 26;
    const newChar = ALPHABET[newIndex];

    return { firstChar, charIndex: ALPHABET.indexOf(firstChar), shift, keyChar, sum, newIndex, newChar, effectiveShift, rsaCalc };
  };

  const explanation = getExplanationData();

  return (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col items-center justify-start font-sans text-slate-800 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 ${isRTL ? "font-cairo" : ""}`}>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white">
              <Globe className="w-5 h-5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={() => setLang("fr")} className="cursor-pointer">🇫🇷 Français</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("en")} className="cursor-pointer">🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("ar")} className="cursor-pointer font-cairo">🇸🇦 العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/60 rounded-full shadow-sm backdrop-blur-sm ring-1 ring-white/50">
            <Sparkles className="w-5 h-5 text-indigo-500 mx-2" />
            <span className="text-indigo-600 font-bold tracking-wide text-xs md:text-sm uppercase">{t.header_tag}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
            {t.header_title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.header_desc}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Interface */}
          <div className="lg:col-span-7 space-y-6">
            
            <Tabs defaultValue="caesar" value={activeCipher} onValueChange={(v) => setActiveCipher(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 bg-white/50 backdrop-blur p-1 rounded-2xl shadow-sm border border-white/40">
                <TabsTrigger value="caesar" className="rounded-xl text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md transition-all">
                  {t.tab_caesar}
                </TabsTrigger>
                <TabsTrigger value="vigenere" className="rounded-xl text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-md transition-all">
                  {t.tab_vigenere}
                </TabsTrigger>
                <TabsTrigger value="rsa" className="rounded-xl text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md transition-all">
                  {t.tab_rsa}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <motion.div 
              layout
              className="glass-card rounded-3xl p-6 md:p-8 space-y-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-indigo-500/5"
            >
              {/* Input Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    {t.input_label}
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetApp}
                    className="h-8 text-xs hover:bg-slate-100 rounded-full text-slate-400"
                    title={t.btn_reset}
                  >
                    <RefreshCw className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                    {t.btn_reset}
                  </Button>
                </div>
               
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeCipher === "rsa" ? t.placeholder_rsa : t.placeholder_caesar}
                  className="min-h-[120px] text-lg bg-white border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl resize-none shadow-inner"
                  data-testid="input-message"
                />
              </div>

              {/* Dynamic Controls based on Cipher */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-4">
                {activeCipher === "caesar" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-500" />
                        {t.shift_label}
                      </label>
                      <span className="bg-indigo-600 text-white font-mono font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg shadow-md shadow-indigo-200">
                        {caesarShift}
                      </span>
                    </div>
                    <Slider 
                      value={[caesarShift]}
                      onValueChange={(vals) => setCaesarShift(vals[0])}
                      min={0}
                      max={25}
                      step={1}
                      className="py-4"
                      data-testid="slider-shift"
                    />
                    <div className="flex justify-between text-xs text-slate-400 font-mono px-1">
                      <span>A=A</span>
                      <span>A=N</span>
                      <span>A=Z</span>
                    </div>
                  </div>
                ) : activeCipher === "vigenere" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-600" />
                        {t.key_label}
                      </label>
                    </div>
                    <Input 
                      value={vigenereKey}
                      onChange={(e) => setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                      placeholder="EX: MATHS"
                      className="h-12 text-lg font-mono tracking-widest uppercase bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20"
                      data-testid="input-key"
                    />
                    <p className="text-xs text-cyan-600/70 ml-1">
                      {t.key_desc}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                        <Binary className="w-4 h-4 text-emerald-600" />
                        {t.rsa_primes_label}
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-emerald-600 font-bold">p (premier)</span>
                        <Input 
                          type="number" 
                          value={p} 
                          onChange={(e) => setP(parseInt(e.target.value) || 0)} 
                          className="bg-white border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                         <span className="text-xs text-emerald-600 font-bold">q (premier)</span>
                        <Input 
                          type="number" 
                          value={q} 
                          onChange={(e) => setQ(parseInt(e.target.value) || 0)} 
                          className="bg-white border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-emerald-100/50 p-3 rounded-xl border border-emerald-100">
                        <div className="text-[10px] uppercase text-emerald-500 font-bold mb-1">{t.rsa_public_key}</div>
                        <div className="font-mono text-emerald-800 font-bold text-lg">({keys.publicKey.e}, {keys.publicKey.n})</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                        <div className="text-[10px] uppercase text-red-500 font-bold mb-1">{t.rsa_private_key}</div>
                        <div className="font-mono text-red-800 font-bold text-lg">({keys.privateKey.d}, {keys.privateKey.n})</div>
                      </div>
                    </div>
                     <p className="text-xs text-emerald-600/70 ml-1">
                      {t.rsa_warn}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAction("encrypt")}
                  variant={mode === "encrypt" ? "default" : "outline"}
                  className={`h-14 text-lg rounded-xl transition-all duration-300 ${
                    mode === "encrypt" 
                      ? activeCipher === "caesar" 
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 scale-[1.02]" 
                        : activeCipher === "vigenere" ? "bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200 scale-[1.02]"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 scale-[1.02]"
                      : "hover:bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                  data-testid="btn-encrypt"
                >
                  <Lock className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t.btn_encrypt}
                </Button>
                <Button
                  onClick={() => handleAction("decrypt")}
                  variant={mode === "decrypt" ? "default" : "outline"}
                  className={`h-14 text-lg rounded-xl transition-all duration-300 ${
                    mode === "decrypt" 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]" 
                      : "hover:bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                  data-testid="btn-decrypt"
                >
                  <Unlock className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t.btn_decrypt}
                </Button>
              </div>
            </motion.div>

            {/* Result Area */}
            <motion.div 
              layout
              className={`result-card rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 bg-white border-2 ${
                mode === "encrypt" 
                  ? activeCipher === "caesar" ? "border-indigo-100 shadow-xl shadow-indigo-100" 
                    : activeCipher === "vigenere" ? "border-cyan-100 shadow-xl shadow-cyan-100" 
                    : "border-emerald-100 shadow-xl shadow-emerald-100"
                  : "border-emerald-100 shadow-xl shadow-emerald-100"
              }`}
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r opacity-80 ${
                 mode === "encrypt" 
                  ? activeCipher === "caesar" ? "from-indigo-400 via-purple-400 to-indigo-400" 
                    : activeCipher === "vigenere" ? "from-cyan-400 via-teal-400 to-cyan-400"
                    : "from-emerald-400 via-green-400 to-emerald-400"
                  : "from-emerald-400 via-green-400 to-emerald-400"
              }`} />
              
              <div className="flex justify-between items-start mb-6">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    mode === "encrypt" 
                      ? activeCipher === "caesar" ? "bg-indigo-500" : activeCipher === "vigenere" ? "bg-cyan-500" : "bg-emerald-500"
                      : "bg-emerald-500"
                  }`}></span>
                  {t.result_label}
                </label>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal">
                  {result.length} {t.result_char_count}
                </Badge>
              </div>
              
              <div className="min-h-[80px] flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100/50 mb-4">
                {result ? (
                  <motion.p 
                    key={result}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-mono font-medium text-slate-800 break-all leading-relaxed w-full text-left"
                    style={{ direction: 'ltr' }} 
                    data-testid="text-result"
                  >
                    {result}
                  </motion.p>
                ) : (
                  <span className="text-slate-300 italic text-lg w-full text-center">{t.result_placeholder}</span>
                )}
              </div>

              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-2">
                      <Calculator className="w-4 h-4" />
                      {t.btn_explain}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md md:max-w-lg rounded-3xl" dir={isRTL ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        {t.dialog_title}
                      </DialogTitle>
                      <DialogDescription>
                         {activeCipher === "rsa" ? t.dialog_desc_rsa : 
                           <>{t.dialog_desc} <span className="font-bold text-indigo-600">"{explanation.firstChar}"</span>.</>
                         }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {activeCipher === "rsa" ? (
                         // RSA Explanation
                         <div className="space-y-4">
                           <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                             <div className="flex justify-between mb-2">
                               <span className="text-sm font-bold text-emerald-800">{t.dialog_rsa_step1}</span>
                               <span className="font-mono">{explanation.firstChar} → {explanation.rsaCalc.m}</span>
                             </div>
                             <div className="flex justify-between mb-2">
                               <span className="text-sm font-bold text-emerald-800">{t.dialog_rsa_step2}</span>
                               <span className="font-mono">{explanation.rsaCalc.m}^{explanation.rsaCalc.e}</span>
                             </div>
                             <div className="flex justify-between mb-2">
                               <span className="text-sm font-bold text-emerald-800">{t.dialog_rsa_step3}</span>
                               <span className="font-mono">mod {explanation.rsaCalc.n}</span>
                             </div>
                              <div className="border-t border-emerald-200 pt-2 flex justify-between">
                               <span className="text-sm font-bold text-emerald-800">{t.dialog_rsa_step4}</span>
                               <span className="font-mono font-bold text-lg">{explanation.rsaCalc.res}</span>
                             </div>
                           </div>
                           <p className="text-xs text-center text-slate-500 italic">
                             RSA travaille avec des nombres très grands. Ici, nous utilisons de petits nombres premiers pour l'exemple.
                           </p>
                         </div>
                      ) : (
                        // Caesar/Vigenere Explanation
                        <>
                          <div className="flex items-center justify-center gap-2 text-center" dir="ltr">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 border border-slate-200">
                                {explanation.firstChar}
                              </div>
                              <span className="text-xs text-slate-400 mt-1 font-mono">{t.dialog_index} {explanation.charIndex}</span>
                            </div>
                            
                            <div className="text-slate-300 font-bold text-xl">+</div>
                            
                            <div className="flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${activeCipher === 'caesar' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-cyan-100 text-cyan-700 border-cyan-200'}`}>
                                {activeCipher === 'caesar' ? explanation.shift : explanation.keyChar}
                              </div>
                              <span className="text-xs text-slate-400 mt-1 font-mono">
                                {activeCipher === 'caesar' ? t.dialog_shift : `${t.dialog_key} "${explanation.keyChar}"`}
                              </span>
                            </div>

                            <div className="text-slate-300 font-bold text-xl">=</div>

                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                                {explanation.newChar}
                              </div>
                              <span className="text-xs text-slate-400 mt-1 font-mono">{t.dialog_index} {explanation.newIndex}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-sm">
                            <p className="font-semibold text-slate-700 mb-2">{t.dialog_details}</p>
                            <div className="grid grid-cols-[1fr_auto] gap-2 font-mono text-slate-600">
                              <span>{t.dialog_step1}</span>
                              <span className="font-bold">{explanation.charIndex}</span>
                              
                              <span>{t.dialog_step2}</span>
                              <span className="font-bold" dir="ltr">{explanation.charIndex} + {explanation.effectiveShift} = {explanation.sum}</span>
                              
                              <span>{t.dialog_step3}</span>
                              <span className="font-bold" dir="ltr">{explanation.sum} % 26 = {explanation.newIndex}</span>
                              
                              <span>{t.dialog_step4}</span>
                              <span className="font-bold text-indigo-600">"{explanation.newChar}"</span>
                            </div>
                          </div>

                          <div className="text-xs text-center text-slate-400 italic">
                            {t.dialog_footer}
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>

          {/* Educational Side Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Math Explanation Card */}
            <div className={`rounded-3xl p-6 text-white shadow-xl transition-colors duration-500 relative overflow-hidden ${
              activeCipher === "caesar" 
                ? "bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-500/20" 
                : activeCipher === "vigenere" ? "bg-gradient-to-br from-cyan-600 to-teal-700 shadow-cyan-500/20"
                : "bg-gradient-to-br from-emerald-600 to-green-700 shadow-emerald-500/20"
            }`}>
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BarChart3 size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xl">{t.math_title}</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {activeCipher === "caesar" 
                      ? t.math_desc_caesar 
                      : activeCipher === "vigenere" ? t.math_desc_vigenere : t.math_desc_rsa}
                  </p>

                  <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-center border border-white/10 shadow-inner">
                    <div className="mb-2 text-white/60 text-xs uppercase tracking-widest">{t.math_formula_label}</div>
                    {activeCipher === "caesar" ? (
                      <span className="text-lg font-bold" dir="ltr">L' = (L + {caesarShift}) mod 26</span>
                    ) : activeCipher === "vigenere" ? (
                      <span className="text-lg font-bold" dir="ltr">L' = (L + K<span className="text-xs align-sub">i</span>) mod 26</span>
                    ) : (
                       <div className="flex flex-col gap-2">
                         <span className="text-lg font-bold" dir="ltr">C = M<sup className="text-xs">e</sup> mod n</span>
                         <span className="text-xs opacity-70" dir="ltr">M = C<sup className="text-[10px]">d</sup> mod n</span>
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-white/70 text-center">
                    <div className="bg-white/5 rounded px-2 py-1">{t.legend_l}</div>
                    <div className="bg-white/5 rounded px-2 py-1">{t.legend_mod}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="glass-card rounded-3xl p-6 bg-white/60 backdrop-blur-md border border-white/60">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{t.comp_title}</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  <span className="text-left rtl:text-right col-span-1">{t.comp_col_criteria}</span>
                  <span className="text-indigo-600">César</span>
                  <span className="text-cyan-600">Vig.</span>
                  <span className="text-emerald-600">RSA</span>
                </div>

                {/* Row 1: Simplicity */}
                <div className="grid grid-cols-4 text-xs md:text-sm items-center py-3 border-b border-slate-100">
                  <span className="font-medium text-slate-600 col-span-1">{t.comp_row_simplicity}</span>
                  <div className="flex justify-center"><span className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_simple}</span></div>
                  <div className="flex justify-center"><span className="bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_medium}</span></div>
                  <div className="flex justify-center"><span className="bg-red-100 text-red-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_complex}</span></div>
                </div>

                {/* Row 2: Security */}
                <div className="grid grid-cols-4 text-xs md:text-sm items-center py-3 border-b border-slate-100">
                  <span className="font-medium text-slate-600 col-span-1">{t.comp_row_security}</span>
                   <div className="flex justify-center"><span className="bg-red-100 text-red-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_weak}</span></div>
                   <div className="flex justify-center"><span className="bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_better}</span></div>
                   <div className="flex justify-center"><span className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-[10px] font-bold text-center">{t.comp_val_strong}</span></div>
                </div>

                {/* Row 3: Key Type */}
                <div className="grid grid-cols-4 text-xs md:text-sm items-center py-3 border-b border-slate-100">
                  <span className="font-medium text-slate-600 col-span-1">{t.comp_row_key}</span>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_number}</div>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_word}</div>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_pair}</div>
                </div>
                
                 {/* Row 4: Vulnerability */}
                 <div className="grid grid-cols-4 text-xs md:text-sm items-center py-3">
                  <span className="font-medium text-slate-600 col-span-1">{t.comp_row_weakness}</span>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_freq}</div>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_repeat}</div>
                  <div className="text-center text-slate-500 text-[10px]">{t.comp_val_internet}</div>
                </div>
              </div>
            </div>

            {/* Alphabet Visualization (Simplified for Comparison view) */}
            {activeCipher !== "rsa" ? (
            <div className="glass-card rounded-3xl p-5 bg-white/40 backdrop-blur-sm border border-white/40">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                 {t.preview_title}
               </h3>
               <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
                  {message.slice(0, 15).toUpperCase().split('').map((char, i) => {
                     if (!ALPHABET.includes(char)) return null;
                     
                     let shiftedChar = char;
                     if (activeCipher === "caesar") {
                       const idx = ALPHABET.indexOf(char);
                       shiftedChar = ALPHABET[(idx + caesarShift) % 26];
                     } else if (vigenereKey) {
                       const idx = ALPHABET.indexOf(char);
                       const cleanKey = vigenereKey.replace(/[^A-Z]/g, "");
                       if (cleanKey) {
                         const k = cleanKey[i % cleanKey.length];
                         const shift = ALPHABET.indexOf(k);
                         shiftedChar = ALPHABET[(idx + shift) % 26];
                       }
                     }

                     return (
                       <div key={i} className="flex flex-col items-center gap-1">
                         <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-slate-400 font-mono text-xs border border-slate-100">{char}</div>
                         <ArrowRight className="w-3 h-3 text-slate-300 rotate-90" />
                         <div className={`w-8 h-8 rounded flex items-center justify-center font-bold font-mono text-sm text-white shadow-sm ${
                           activeCipher === "caesar" ? "bg-indigo-500" : "bg-cyan-500"
                         }`}>
                           {shiftedChar}
                         </div>
                       </div>
                     )
                  })}
                  {message.length === 0 && (
                    <div className="text-slate-400 text-sm italic py-4">{t.preview_empty}</div>
                  )}
               </div>
            </div>
            ) : (
               // RSA Preview just shows numbers
                <div className="glass-card rounded-3xl p-5 bg-white/40 backdrop-blur-sm border border-white/40">
                  <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center">
                     {t.preview_title} (Nombres)
                  </h3>
                   <div className="flex flex-wrap gap-2 justify-center font-mono text-xs text-emerald-800" dir="ltr">
                     {result ? result.split(" ").slice(0, 10).map((n, i) => (
                       <span key={i} className="bg-emerald-100 px-2 py-1 rounded">{n}</span>
                     )) : <span className="text-slate-400 italic">{t.preview_empty}</span>}
                   </div>
                </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
