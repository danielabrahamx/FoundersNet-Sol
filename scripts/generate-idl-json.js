const fs = require('fs');
const path = require('path');

const tsPath = path.resolve(__dirname, '../client/src/idl/foundersnet.ts');
const outDir = path.resolve(__dirname, '../target/idl');
const outPath = path.join(outDir, 'foundersnet.json');

let src = fs.readFileSync(tsPath, 'utf8');

// Remove TypeScript/JS comments (block and line)
src = src.replace(/\/\*[\s\S]*?\*\//g, '');
src = src.replace(/\/\/.*$/gm, '');

// Find the start of the object after `export const IDL =`
const match = src.match(/export\s+const\s+IDL\s*=\s*([\s\S]*);?\s*$/m);
if (!match) {
  console.error('Could not find IDL object in', tsPath);
  process.exit(1);
}
let objText = match[1].trim();

// Ensure it is a single JS object expression (wrap in parentheses to be safe)
const wrapped = '(' + objText + ')';

let idl;
try {
  // Use Function to safely evaluate the object literal
  idl = Function('return ' + wrapped)();
} catch (err) {
  console.error('Failed to evaluate IDL object:', err);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(idl, null, 2));
console.log('Wrote IDL JSON to', outPath);
