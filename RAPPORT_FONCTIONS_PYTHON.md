# Rapport Détaillé des Fonctions de Cryptographie en Python

## Projet de Mathématiques - SAIDI Melissa
### Lycée des Mathématiques Mohand Mokhbi

---

## Table des Matières

1. [Introduction et Contexte](#1-introduction-et-contexte)
2. [Chiffrement de César](#2-chiffrement-de-césar)
3. [Chiffrement de Vigenère](#3-chiffrement-de-vigenère)
4. [Chiffrement RSA](#4-chiffrement-rsa)
5. [Conclusion](#5-conclusion)

---

## 1. Introduction et Contexte

### Conventions Utilisées

- **Alphabet** : 26 lettres de A à Z (indices 0 à 25)
- **Modulo 26** : Toutes les opérations sur les lettres utilisent l'arithmétique modulo 26
- **Encodage ASCII** : 
  - 'A' = 65, 'Z' = 90 (majuscules)
  - 'a' = 97, 'z' = 122 (minuscules)
- **Caractères non-alphabétiques** : Conservés sans modification

---

## 2. Chiffrement de César

### 2.1 Description

Le chiffrement de César est une technique de substitution où chaque lettre du message est remplacée par une lettre située à un nombre fixe de positions plus loin dans l'alphabet.

### 2.2 Formule Mathématique

**Chiffrement :**
```
L' = (L + décalage) mod 26
```

**Déchiffrement :**
```
L = (L' - décalage) mod 26
```

Où :
- L = position de la lettre originale (0-25)
- L' = position de la lettre chiffrée (0-25)
- décalage = clé de chiffrement (nombre entier)

### 2.3 Fonction `caesar_encrypt(text, shift)`

```python
def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            # Déterminer le point de départ ASCII (majuscule ou minuscule)
            ascii_offset = ord('A') if char.isupper() else ord('a')
            # Appliquer le décalage avec modulo 26
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
        else:
            # Garder les caractères non-alphabétiques
            result += char
    return result
```

**Algorithme pas à pas :**

1. Parcourir chaque caractère du texte
2. Si c'est une lettre :
   - Calculer l'offset ASCII (65 pour majuscule, 97 pour minuscule)
   - Convertir la lettre en position (0-25)
   - Ajouter le décalage
   - Appliquer modulo 26 pour rester dans l'alphabet
   - Reconvertir en caractère ASCII
3. Sinon, garder le caractère tel quel
4. Retourner le résultat

### 2.4 Fonction `caesar_decrypt(text, shift)`

```python
def caesar_decrypt(text, shift):
    return caesar_encrypt(text, -shift)
```

Le déchiffrement utilise simplement un décalage négatif.

### 2.5 Exemple Complet

**Entrée :**
- Texte : `"BONJOUR"`
- Décalage : `3`

**Calcul détaillé :**

| Lettre | Position | + Décalage | Mod 26 | Résultat |
|--------|----------|------------|--------|----------|
| B | 1 | 1 + 3 = 4 | 4 | E |
| O | 14 | 14 + 3 = 17 | 17 | R |
| N | 13 | 13 + 3 = 16 | 16 | Q |
| J | 9 | 9 + 3 = 12 | 12 | M |
| O | 14 | 14 + 3 = 17 | 17 | R |
| U | 20 | 20 + 3 = 23 | 23 | X |
| R | 17 | 17 + 3 = 20 | 20 | U |

**Sortie :** `"ERQMRXU"`

**Vérification du déchiffrement :**
- Entrée : `"ERQMRXU"`, Décalage : `3`
- Sortie : `"BONJOUR"` ✓

---

## 3. Chiffrement de Vigenère

### 3.1 Description

Le chiffrement de Vigenère est une amélioration du César utilisant un mot-clé au lieu d'un décalage fixe. Chaque lettre du mot-clé définit le décalage à appliquer.

### 3.2 Formule Mathématique

**Chiffrement :**
```
L'[i] = (L[i] + K[i mod len(K)]) mod 26
```

**Déchiffrement :**
```
L[i] = (L'[i] - K[i mod len(K)]) mod 26
```

Où :
- L[i] = i-ème lettre du message
- K[i] = i-ème lettre de la clé (cyclique)
- len(K) = longueur de la clé

### 3.3 Fonction `vigenere_encrypt(text, key)`

```python
def vigenere_encrypt(text, key):
    if not key:
        return text
    result = ""
    key = key.upper()
    key_index = 0
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            # Calculer le décalage basé sur la lettre de la clé
            shift = ord(key[key_index % len(key)]) - ord('A')
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
            key_index += 1
        else:
            result += char
    return result
```

**Algorithme pas à pas :**

1. Convertir la clé en majuscules
2. Initialiser un index pour la clé à 0
3. Pour chaque caractère du texte :
   - Si c'est une lettre :
     - Obtenir la lettre de la clé (cyclique)
     - Calculer le décalage (position de la lettre de clé)
     - Appliquer le décalage comme dans César
     - Incrémenter l'index de la clé
   - Sinon, garder le caractère
4. Retourner le résultat

### 3.4 Fonction `vigenere_decrypt(text, key)`

```python
def vigenere_decrypt(text, key):
    if not key:
        return text
    result = ""
    key = key.upper()
    key_index = 0
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            # Soustraire le décalage au lieu de l'ajouter
            shift = ord(key[key_index % len(key)]) - ord('A')
            result += chr((ord(char) - ascii_offset - shift) % 26 + ascii_offset)
            key_index += 1
        else:
            result += char
    return result
```

### 3.5 Exemple Complet

**Entrée :**
- Texte : `"MATHEMATIQUES"`
- Clé : `"CLE"`

**Table de correspondance de la clé :**
- C = 2
- L = 11
- E = 4

**Calcul détaillé :**

| Lettre | Position | Clé | Décalage | Calcul | Mod 26 | Résultat |
|--------|----------|-----|----------|--------|--------|----------|
| M | 12 | C | 2 | 12 + 2 | 14 | O |
| A | 0 | L | 11 | 0 + 11 | 11 | L |
| T | 19 | E | 4 | 19 + 4 | 23 | X |
| H | 7 | C | 2 | 7 + 2 | 9 | J |
| E | 4 | L | 11 | 4 + 11 | 15 | P |
| M | 12 | E | 4 | 12 + 4 | 16 | Q |
| A | 0 | C | 2 | 0 + 2 | 2 | C |
| T | 19 | L | 11 | 19 + 11 | 4 (30 mod 26) | E |
| I | 8 | E | 4 | 8 + 4 | 12 | M |
| Q | 16 | C | 2 | 16 + 2 | 18 | S |
| U | 20 | L | 11 | 20 + 11 | 5 (31 mod 26) | F |
| E | 4 | E | 4 | 4 + 4 | 8 | I |
| S | 18 | C | 2 | 18 + 2 | 20 | U |

**Sortie :** `"OLXJPQCEMSFIU"`

---

## 4. Chiffrement RSA

### 4.1 Introduction au RSA

RSA (Rivest-Shamir-Adleman) est un système de cryptographie asymétrique utilisant deux clés : une clé publique pour chiffrer et une clé privée pour déchiffrer.

### 4.2 Fonctions Auxiliaires

#### 4.2.1 Test de Primalité : `is_prime(n)`

```python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True
```

**Algorithme :**
1. Si n < 2, retourner False
2. Tester tous les diviseurs de 2 à √n
3. Si un diviseur est trouvé, n n'est pas premier
4. Sinon, n est premier

**Exemple :**
- `is_prime(61)` → True (61 n'a aucun diviseur entre 2 et 7)
- `is_prime(60)` → False (60 = 2 × 30)

#### 4.2.2 Plus Grand Commun Diviseur : `gcd(a, b)`

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
```

**Algorithme d'Euclide :**
1. Tant que b ≠ 0 :
   - Remplacer (a, b) par (b, a mod b)
2. Retourner a

**Exemple :**
```
gcd(48, 18)
→ (18, 48 mod 18) = (18, 12)
→ (12, 18 mod 12) = (12, 6)
→ (6, 12 mod 6) = (6, 0)
→ Résultat : 6
```

#### 4.2.3 Inverse Modulaire : `mod_inverse(e, phi)`

```python
def mod_inverse(e, phi):
    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        gcd, x1, y1 = extended_gcd(b % a, a)
        x = y1 - (b // a) * x1
        y = x1
        return gcd, x, y
    
    _, x, _ = extended_gcd(e % phi, phi)
    return (x % phi + phi) % phi
```

**Principe mathématique :**
Trouver d tel que : `e × d ≡ 1 (mod φ)`

Utilise l'algorithme d'Euclide étendu pour trouver les coefficients de Bézout.

**Exemple :**
- e = 65537, φ = 3120
- `mod_inverse(65537, 3120)` calcule d tel que 65537 × d ≡ 1 (mod 3120)

### 4.3 Génération des Clés RSA : `generate_rsa_keys(p, q)`

```python
def generate_rsa_keys(p, q):
    if not (is_prime(p) and is_prime(q)):
        return None, None, None, None
    
    n = p * q                    # Module RSA
    phi = (p - 1) * (q - 1)      # Indicatrice d'Euler
    
    e = 65537                    # Exposant public standard
    if gcd(e, phi) != 1:
        for candidate in range(3, phi, 2):
            if gcd(candidate, phi) == 1:
                e = candidate
                break
    
    d = mod_inverse(e, phi)      # Exposant privé
    return n, e, d, phi
```

**Algorithme pas à pas :**

1. **Vérification** : p et q doivent être premiers
2. **Calcul de n** : n = p × q (module RSA)
3. **Calcul de φ(n)** : φ = (p-1) × (q-1) (indicatrice d'Euler)
4. **Choix de e** : Exposant public tel que gcd(e, φ) = 1
5. **Calcul de d** : Inverse modulaire de e modulo φ

**Clés générées :**
- Clé publique : (e, n)
- Clé privée : (d, n)

### 4.4 Chiffrement RSA : `rsa_encrypt(message, e, n)`

```python
def rsa_encrypt(message, e, n):
    encrypted = []
    for char in message:
        m = ord(char)           # Valeur ASCII du caractère
        c = pow(m, e, n)        # c = m^e mod n
        encrypted.append(str(c))
    return " ".join(encrypted)
```

**Formule mathématique :**
```
c = m^e mod n
```

Où :
- m = valeur numérique du message (code ASCII)
- e = exposant public
- n = module RSA
- c = message chiffré

### 4.5 Déchiffrement RSA : `rsa_decrypt(encrypted_message, d, n)`

```python
def rsa_decrypt(encrypted_message, d, n):
    try:
        numbers = encrypted_message.strip().split()
        decrypted = ""
        for num in numbers:
            c = int(num)
            m = pow(c, d, n)    # m = c^d mod n
            decrypted += chr(m)
        return decrypted
    except:
        return "Erreur de déchiffrement"
```

**Formule mathématique :**
```
m = c^d mod n
```

**Pourquoi ça fonctionne (Théorème d'Euler) :**
```
c^d = (m^e)^d = m^(e×d) = m^(1 + k×φ) = m × (m^φ)^k ≡ m × 1^k ≡ m (mod n)
```

### 4.6 Exemple Complet RSA

**Paramètres :**
- p = 61 (premier)
- q = 53 (premier)

**Génération des clés :**
```
n = 61 × 53 = 3233
φ = (61-1) × (53-1) = 60 × 52 = 3120
e = 65537 → gcd(65537, 3120) = 1 ✓
d = mod_inverse(65537, 3120) = 2753
```

**Clés :**
- Clé publique : (e=65537, n=3233)
- Clé privée : (d=2753, n=3233)

**Chiffrement du message "AB" :**

| Caractère | ASCII (m) | Calcul c = m^e mod n | Résultat |
|-----------|-----------|----------------------|----------|
| A | 65 | 65^65537 mod 3233 | 2790 |
| B | 66 | 66^65537 mod 3233 | 2304 |

**Message chiffré :** `"2790 2304"`

**Déchiffrement :**

| Chiffré (c) | Calcul m = c^d mod n | ASCII | Caractère |
|-------------|----------------------|-------|-----------|
| 2790 | 2790^2753 mod 3233 | 65 | A |
| 2304 | 2304^2753 mod 3233 | 66 | B |

**Message déchiffré :** `"AB"` ✓

---

## 5. Conclusion

### Comparaison des Méthodes

| Critère | César | Vigenère | RSA |
|---------|-------|----------|-----|
| Type | Symétrique | Symétrique | Asymétrique |
| Clé | Nombre (1-25) | Mot | Deux clés (publique/privée) |
| Sécurité | Très faible (26 clés) | Moyenne | Très forte |
| Complexité | O(n) | O(n) | O(n × log(e)) |
| Usage | Pédagogique | Pédagogique | Réel (communications sécurisées) |

### Limites de l'Implémentation

1. **César et Vigenère** :
   - Vulnérables à l'analyse fréquentielle
   - Adaptés uniquement à des fins pédagogiques

2. **RSA (version pédagogique)** :
   - Utilise des nombres premiers petits (non sécurisé)
   - En production, p et q doivent avoir 1024+ bits chacun
   - Chiffre caractère par caractère (inefficace)
   - En production, on utilise RSA pour échanger une clé symétrique

### Fichiers Python du Projet

- `app.py` : Implémentation principale avec gestion de la casse
- `flask_api.py` : Version alternative (convertit tout en majuscules)

---

*Document généré pour le projet de Cryptographie et Mathématiques*
*Lycée des Mathématiques Mohand Mokhbi*
