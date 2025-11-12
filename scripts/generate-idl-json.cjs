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
const exportIndex = src.indexOf('export const IDL');
if (exportIndex === -1) {
  console.error('Could not find "export const IDL" in', tsPath);
  process.exit(1);
}
const assignIndex = src.indexOf('=', exportIndex);
if (assignIndex === -1) {
  console.error('Could not find assignment after export const IDL in', tsPath);
  process.exit(1);
}
// Find the opening brace of the object
const openBraceIndex = src.indexOf('{', assignIndex);
if (openBraceIndex === -1) {
  console.error('Could not find opening brace for IDL object in', tsPath);
  process.exit(1);
}

// Walk the file to find matching closing brace
let i = openBraceIndex;
let depth = 0;
for (; i < src.length; i++) {
  const ch = src[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      // Found matching closing brace
      i++;
      break;
    }
  }
}
if (depth !== 0) {
  console.error('Could not find matching closing brace for IDL object in', tsPath);
  process.exit(1);
}
let objText = src.slice(openBraceIndex, i).trim();

// Ensure it is a single JS object expression (wrap in parentheses to be safe)
const wrapped = '(' + objText + ')';

let idl;
try {
  // Use Function to safely evaluate the object literal
  idl = Function('return ' + wrapped)();
} catch (err) {
  console.error('Failed to evaluate IDL object:', err.message);
  // Show a bit of the extracted object for debugging
  console.error('Preview of extracted object (first 300 chars):\n', objText.slice(0, 300));
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(idl, null, 2));
console.log('Wrote IDL JSON to', outPath);
