# Windows Local Setup Guide

## Prerequisites

1. Install Node.js (version 20 or higher)
   - Download from: https://nodejs.org
   - Choose the LTS version
   - Run the installer and follow the prompts

## Installation Steps

1. Extract the downloaded zip file to a folder (e.g., `C:\Projects\my-app`)

2. Open Command Prompt or PowerShell

3. Navigate to the project folder:
   ```
   cd C:\Projects\my-app
   ```

4. Install dependencies:
   ```
   npm install
   ```

5. Run the application in development mode:
   ```
   npm run dev
   ```

6. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Running in Production Mode

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm run start
   ```

## Quick Start (Windows Batch File)

You can also double-click `start-windows.bat` to automatically install dependencies and start the app.

## Troubleshooting

- If you see "tsx not found", make sure you ran `npm install` first
- If port 5000 is already in use, you can change it by setting the PORT environment variable:
  ```
  set PORT=3000
  npm run dev
  ```
