import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sh = (cmd, args, cwd = root) => {
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  if (r.status !== 0 && r.status != null) process.exit(r.status);
};

console.log('\n[setup] init .env if missing…');
sh('node', ['backend/scripts/init-env.mjs']);

console.log('\n[setup] npm install (root, backend, frontend)…');
sh('npm', ['install'], root);
sh('npm', ['install'], path.join(root, 'backend'));
sh('npm', ['install'], path.join(root, 'frontend'));

console.log('\n[setup] Python ML dependencies…');
const pip = spawnSync('python', ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
  cwd: path.join(root, 'ml-service'),
  stdio: 'inherit',
  shell: true
});
if (pip.status !== 0) {
  spawnSync('py', ['-3', '-m', 'pip', 'install', '-r', 'requirements.txt'], {
    cwd: path.join(root, 'ml-service'),
    stdio: 'inherit',
    shell: true
  });
}

console.log('\n[setup] seed demo jobs (skipped if DB already has jobs)…');
const seed = spawnSync('npm', ['run', 'seed', '--prefix', 'backend'], {
  cwd: root,
  stdio: 'inherit',
  shell: true
});
if (seed.status !== 0) {
  console.error(
    '\n[setup] Seed skipped or failed — fix MONGO_URI in backend/.env, then run: npm run seed --prefix backend\n' +
      '  Atlas: user/password must match your cluster user.\n' +
      '  Local: docker compose up -d  →  MONGO_URI=mongodb://127.0.0.1:27017/advancement_jobs\n'
  );
} else {
  console.log('\n[setup] Database seeded (or already had jobs).');
}

console.log('\n[setup] Done. Start everything with: npm run dev\n');
