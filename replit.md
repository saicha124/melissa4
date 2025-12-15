# Replit.md

## Overview

This is an educational cryptography application that teaches three encryption methods: Caesar cipher, Vigenere cipher, and RSA asymmetric encryption. The app is built as a French-language interactive tool for learning mathematical cryptography concepts, using Python Flask with pure HTML/CSS/JavaScript.

## User Preferences

Preferred communication style: Simple, everyday language.
Language preference: French

## System Architecture

### Backend Architecture
- **Framework**: Python Flask
- **Server**: Flask development server (development) / Gunicorn (production)
- **Templates**: Jinja2 HTML templates

### Project Structure
- `app.py` - Main Flask application with all cryptography algorithms and API routes
- `templates/index.html` - Single-page HTML template with embedded CSS and JavaScript
- `static/` - Static assets (currently unused)

### Cryptography Algorithms (in app.py)
1. **Caesar Cipher**: Simple letter substitution with fixed shift
2. **Vigenere Cipher**: Polyalphabetic substitution using a keyword
3. **RSA**: Asymmetric encryption with public/private key pairs

### API Endpoints
- `GET /` - Serves the main HTML interface
- `POST /api/caesar` - Caesar cipher encryption/decryption
- `POST /api/vigenere` - Vigenere cipher encryption/decryption
- `POST /api/rsa` - RSA encryption/decryption
- `POST /api/rsa/keys` - Generate RSA key pairs

## Running the Application

### Development
```bash
python app.py
```

### Production
```bash
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

## External Dependencies

### Python Packages
- **Flask**: Web framework
- **Gunicorn**: Production WSGI server
