const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const defaultInsomniaPath = 'C:\\Program Files\\Insomnia\\Insomnia.exe';
const insomniaPath = process.argv[2] || process.env.INSOMNIA_PATH || defaultInsomniaPath;
const profile = path.resolve(__dirname, '..', '.insomnia-profile');

try {
  fs.mkdirSync(profile, { recursive: true });
  console.log('Profile directory ensured at:', profile);
} catch (e) {
  console.error('Failed to create profile dir', e);
  process.exit(2);
}

console.log('Spawning Insomnia with APPDATA set to profile...');
console.log('Executable:', insomniaPath);

const child = spawn(insomniaPath, [], {
  env: Object.assign({}, process.env, { APPDATA: profile }),
  stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.on('data', (d) => process.stdout.write(d.toString()));
child.stderr.on('data', (d) => process.stderr.write(d.toString()));

child.on('error', (err) => console.error('Spawn error:', err));
child.on('exit', (code, sig) => console.log('Child exited:', code, sig));

setTimeout(() => {
  console.log('\n--- PROFILE DIRECTORY LISTING ---');
  function walk(p) {
    if (!fs.existsSync(p)) return [];
    const results = [];
    const stat = fs.statSync(p);
    if (stat.isFile()) return [p];
    const items = fs.readdirSync(p);
    for (const it of items) {
      results.push(...walk(path.join(p, it)));
    }
    return results;
  }

  const files = walk(profile);
  if (files.length === 0) {
    console.log('(no files found in profile)');
  } else {
    for (const f of files) {
      try {
        const s = fs.statSync(f);
        console.log(f, s.size);
      } catch (e) {
        console.log(f, '(stat failed)');
      }
    }
  }

  console.log('\nKilling child process (if still running) and exiting.');
  try { child.kill(); } catch (e) {}
  setTimeout(() => process.exit(0), 1000);
}, 8000);
