import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mlDir = path.join(__dirname, '..', 'ml-service');
const uvicornArgs = [
  '-m',
  'uvicorn',
  'app.main:app',
  '--reload',
  '--host',
  '127.0.0.1',
  '--port',
  '8765'
];

const attempts = [
  { cmd: 'python', args: uvicornArgs },
  { cmd: 'py', args: ['-3', ...uvicornArgs] },
  { cmd: 'python3', args: uvicornArgs }
];

function run(i) {
  if (i >= attempts.length) {
    console.error(
      'Could not start ML service: no Python found. Install Python 3, then:\n' +
        '  cd ml-service && pip install -r requirements.txt'
    );
    process.exit(1);
  }
  const { cmd, args } = attempts[i];
  const child = spawn(cmd, args, {
    cwd: mlDir,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  child.on('error', () => run(i + 1));
  child.on('exit', (code, signal) => {
    if (signal) process.exit(1);
    process.exit(code ?? 0);
  });
}

run(0);
