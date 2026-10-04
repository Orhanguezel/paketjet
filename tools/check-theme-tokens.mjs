import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const cssDir = 'frontend/src/app';
const cssFiles = readdirSync(cssDir).filter((name) => name.endsWith('.css')).map((name) => join(cssDir, name));
const visualComponents = [
  'admin_panel/src/app/(main)/admin/(admin)/audit/_components/audit-daily-chart.tsx',
  'admin_panel/src/app/(main)/admin/(admin)/audit/_components/audit-geo-map.tsx',
  'admin_panel/src/app/(main)/admin/(admin)/audit/_components/audit-turkey-map.tsx',
  'admin_panel/src/app/(main)/admin/_components/dashboard-activity.tsx',
];
const checks = [...cssFiles, 'admin_panel/src/app/admin-design.css', ...visualComponents];
const rawColor = /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(\s*\d/gi;
const rawRadius = /border-radius\s*:\s*\d*\.?\d+(?:px|rem)\b/gi;
const failures = [];
const paletteClass = /\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:red|blue|green|yellow|amber|orange|purple|violet|indigo|slate|gray|zinc|neutral|stone|pink|rose|emerald|sky|cyan|teal|lime)-(?:\d+)|\b(?:bg|text|border|ring)-(?:white|black)\b/gi;

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

for (const file of checks) {
  let source = readFileSync(file, 'utf8');
  if (file.endsWith('/globals.css')) source = source.slice(source.indexOf('@layer base'));
  if (file.endsWith('/design-v2.css')) source = source.slice(source.indexOf('body .site-container'));
  const lines = source.split('\n');
  for (const [index, line] of lines.entries()) {
    if (rawColor.test(line) || rawRadius.test(line)) failures.push(`${file}:${index + 1}: ${line.trim().slice(0, 160)}`);
    rawColor.lastIndex = 0;
    rawRadius.lastIndex = 0;
  }
}

for (const file of [...sourceFiles('frontend/src'), ...sourceFiles('admin_panel/src')]) {
  for (const [index, line] of readFileSync(file, 'utf8').split('\n').entries()) {
    if (paletteClass.test(line)) failures.push(`${file}:${index + 1}: ${line.trim().slice(0, 160)}`);
    paletteClass.lastIndex = 0;
  }
}

if (failures.length) {
  console.error('Theme values must reference semantic tokens outside token declarations:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Theme token check passed (${checks.length} UI files).`);
}
