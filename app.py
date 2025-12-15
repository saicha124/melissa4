from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
        else:
            result += char
    return result

def caesar_decrypt(text, shift):
    return caesar_encrypt(text, -shift)

def vigenere_encrypt(text, key):
    if not key:
        return text
    result = ""
    key = key.upper()
    key_index = 0
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            shift = ord(key[key_index % len(key)]) - ord('A')
            result += chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
            key_index += 1
        else:
            result += char
    return result

def vigenere_decrypt(text, key):
    if not key:
        return text
    result = ""
    key = key.upper()
    key_index = 0
    for char in text:
        if char.isalpha():
            ascii_offset = ord('A') if char.isupper() else ord('a')
            shift = ord(key[key_index % len(key)]) - ord('A')
            result += chr((ord(char) - ascii_offset - shift) % 26 + ascii_offset)
            key_index += 1
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
    while b:
        a, b = b, a % b
    return a

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

def generate_rsa_keys(p, q):
    if not (is_prime(p) and is_prime(q)):
        return None, None, None, None
    
    n = p * q
    phi = (p - 1) * (q - 1)
    
    e = 65537
    if gcd(e, phi) != 1:
        for candidate in range(3, phi, 2):
            if gcd(candidate, phi) == 1:
                e = candidate
                break
    
    d = mod_inverse(e, phi)
    return n, e, d, phi

def rsa_encrypt(message, e, n):
    encrypted = []
    for char in message:
        m = ord(char)
        c = pow(m, e, n)
        encrypted.append(str(c))
    return " ".join(encrypted)

def rsa_decrypt(encrypted_message, d, n):
    try:
        numbers = encrypted_message.strip().split()
        decrypted = ""
        for num in numbers:
            c = int(num)
            m = pow(c, d, n)
            decrypted += chr(m)
        return decrypted
    except:
        return "Erreur de déchiffrement"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/caesar', methods=['POST'])
def caesar():
    data = request.json
    text = data.get('text', '')
    shift = int(data.get('shift', 3))
    action = data.get('action', 'encrypt')
    
    if action == 'encrypt':
        result = caesar_encrypt(text, shift)
    else:
        result = caesar_decrypt(text, shift)
    
    return jsonify({'result': result})

@app.route('/api/vigenere', methods=['POST'])
def vigenere():
    data = request.json
    text = data.get('text', '')
    key = data.get('key', 'CLE')
    action = data.get('action', 'encrypt')
    
    if action == 'encrypt':
        result = vigenere_encrypt(text, key)
    else:
        result = vigenere_decrypt(text, key)
    
    return jsonify({'result': result})

@app.route('/api/rsa', methods=['POST'])
def rsa():
    data = request.json
    text = data.get('text', '')
    p = int(data.get('p', 61))
    q = int(data.get('q', 53))
    action = data.get('action', 'encrypt')
    
    n, e, d, phi = generate_rsa_keys(p, q)
    
    if n is None:
        return jsonify({'error': 'p et q doivent être des nombres premiers', 'result': ''})
    
    if action == 'encrypt':
        result = rsa_encrypt(text, e, n)
    else:
        result = rsa_decrypt(text, d, n)
    
    return jsonify({
        'result': result,
        'n': n,
        'e': e,
        'd': d,
        'phi': phi
    })

@app.route('/api/rsa/keys', methods=['POST'])
def rsa_keys():
    data = request.json
    p = int(data.get('p', 61))
    q = int(data.get('q', 53))
    
    n, e, d, phi = generate_rsa_keys(p, q)
    
    if n is None:
        return jsonify({'error': 'p et q doivent être des nombres premiers'})
    
    return jsonify({
        'n': n,
        'e': e,
        'd': d,
        'phi': phi,
        'p': p,
        'q': q
    })

if __name__ == '__main__':
    import os
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug)
