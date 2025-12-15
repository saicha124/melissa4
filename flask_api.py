from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def caesar_cipher(text, shift, decrypt=False):
    s = (26 - (shift % 26)) if decrypt else (shift % 26)
    result = ""
    for char in text.upper():
        if char in ALPHABET:
            index = ALPHABET.index(char)
            result += ALPHABET[(index + s) % 26]
        else:
            result += char
    return result

def vigenere_cipher(text, key, decrypt=False):
    if not key:
        return text
    clean_key = ''.join(c for c in key.upper() if c in ALPHABET)
    if not clean_key:
        return text
    
    result = ""
    key_index = 0
    for char in text.upper():
        if char in ALPHABET:
            char_index = ALPHABET.index(char)
            shift = ALPHABET.index(clean_key[key_index % len(clean_key)])
            key_index += 1
            s = (26 - (shift % 26)) if decrypt else (shift % 26)
            result += ALPHABET[(char_index + s) % 26]
        else:
            result += char
    return result

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

def gcd(a, b):
    return a if b == 0 else gcd(b, a % b)

def mod_inverse(e, phi):
    m0 = phi
    y = 0
    x = 1
    if phi == 1:
        return 0
    while e > 1:
        q = e // phi
        t = phi
        phi = e % phi
        e = t
        t = y
        y = x - q * y
        x = t
    if x < 0:
        x += m0
    return x

def mod_pow(base, exp, mod):
    res = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            res = (res * base) % mod
        exp = exp // 2
        base = (base * base) % mod
    return res

def generate_keys(p, q):
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 3
    while gcd(e, phi) != 1:
        e += 2
    d = mod_inverse(e, phi)
    return {
        'publicKey': {'e': e, 'n': n},
        'privateKey': {'d': d, 'n': n},
        'phi': phi
    }

def rsa_encrypt(text, e, n):
    trimmed = text.strip()
    import re
    if re.match(r'^(\d+\s*)+$', trimmed):
        numbers = trimmed.split()
        return ' '.join(str(mod_pow(int(num), e, n)) for num in numbers if num.isdigit() or num.lstrip('-').isdigit())
    
    result = []
    for char in text.upper():
        if 'A' <= char <= 'Z':
            m = ord(char) - 64
            c = mod_pow(m, e, n)
            result.append(str(c))
        else:
            result.append('0')
    return ' '.join(result)

def rsa_decrypt(text, d, n):
    result = ""
    for num_str in text.split():
        try:
            c = int(num_str)
            if c == 0:
                result += ' '
            else:
                m = mod_pow(c, d, n)
                result += chr(m + 64)
        except:
            pass
    return result

@app.route('/api/caesar', methods=['POST'])
def caesar_route():
    data = request.json
    text = data.get('text', '')
    shift = int(data.get('shift', 0))
    decrypt = data.get('decrypt', False)
    result = caesar_cipher(text, shift, decrypt)
    return jsonify({'result': result})

@app.route('/api/vigenere', methods=['POST'])
def vigenere_route():
    data = request.json
    text = data.get('text', '')
    key = data.get('key', '')
    decrypt = data.get('decrypt', False)
    result = vigenere_cipher(text, key, decrypt)
    return jsonify({'result': result})

@app.route('/api/rsa/keys', methods=['POST'])
def rsa_keys_route():
    data = request.json
    p = int(data.get('p', 11))
    q = int(data.get('q', 17))
    if not (is_prime(p) and is_prime(q) and p != q):
        return jsonify({'error': 'p et q doivent etre des nombres premiers differents'})
    keys = generate_keys(p, q)
    return jsonify(keys)

@app.route('/api/rsa/encrypt', methods=['POST'])
def rsa_encrypt_route():
    data = request.json
    text = data.get('text', '')
    e = int(data.get('e', 3))
    n = int(data.get('n', 187))
    result = rsa_encrypt(text, e, n)
    return jsonify({'result': result})

@app.route('/api/rsa/decrypt', methods=['POST'])
def rsa_decrypt_route():
    data = request.json
    text = data.get('text', '')
    d = int(data.get('d', 107))
    n = int(data.get('n', 187))
    result = rsa_decrypt(text, d, n)
    return jsonify({'result': result})

@app.route('/api/rsa/is-prime', methods=['POST'])
def is_prime_route():
    data = request.json
    n = int(data.get('n', 0))
    return jsonify({'isPrime': is_prime(n)})

@app.route('/api/rsa/mod-pow', methods=['POST'])
def mod_pow_route():
    data = request.json
    base = int(data.get('base', 0))
    exp = int(data.get('exp', 0))
    mod = int(data.get('mod', 1))
    result = mod_pow(base, exp, mod)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
