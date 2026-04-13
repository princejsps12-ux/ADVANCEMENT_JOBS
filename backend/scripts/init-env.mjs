import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '..');
const envPath = path.join(backendRoot, '.env');
const examplePath = path.join(backendRoot, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('backend/.env already exists — skipping copy.');
  process.exit(0);
}

if (!fs.existsSync(examplePath)) {
  console.error('Missing backend/.env.example');
  process.exit(1);
}

fs.copyFileSync(examplePath, envPath);
console.log('Created backend/.env from .env.example — edit MONGO_URI if needed.');
process.exit(0);
