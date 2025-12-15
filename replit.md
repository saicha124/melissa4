# Replit.md

## Overview

This is an educational cryptography application that teaches three encryption methods: Caesar cipher, Vigenere cipher, and RSA asymmetric encryption. The app is built as a French-language interactive tool with a hybrid architecture: React frontend with animations and Python Flask backend for cryptography algorithms.

## User Preferences

Preferred communication style: Simple, everyday language.
Language preference: French

## System Architecture

### Hybrid Architecture
- **Frontend**: React with TypeScript, Framer Motion animations
- **Backend**: Python Flask API for cryptography algorithms
- **Proxy**: Vite proxies /api requests to Flask on port 8000

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Build Tool**: Vite
- Location: `client/src/`

### Backend (Python Flask)
- **File**: `flask_api.py` - Flask API with all cryptography algorithms
- **Port**: 8000 (internal)
- **Algorithms**: Caesar, Vigenere, RSA in Python

### API Endpoints (Flask)
- `POST /api/caesar` - Caesar cipher encryption/decryption
- `POST /api/vigenere` - Vigenere cipher encryption/decryption
- `POST /api/rsa/keys` - Generate RSA key pairs
- `POST /api/rsa/encrypt` - RSA encryption
- `POST /api/rsa/decrypt` - RSA decryption
- `POST /api/rsa/is-prime` - Check if number is prime
- `POST /api/rsa/mod-pow` - Modular exponentiation

## Running the Application

### Development
Two workflows run simultaneously:
1. **Flask API**: `python flask_api.py` on port 8000
2. **Start application**: `npm run dev` on port 5000

### Production
```bash
gunicorn --bind=0.0.0.0:5000 --reuse-port app:app
```

## External Dependencies

### Python Packages
- Flask: Web framework
- Flask-CORS: Cross-origin support
- Gunicorn: Production WSGI server

### Node.js Packages
- React, Vite, Tailwind CSS, Framer Motion, shadcn/ui
