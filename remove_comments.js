import fs from 'fs';
import path from 'path';

function removeComments(code) {
  let result = '';
  let i = 0;
  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      i += 2;
      while (i < code.length && code[i] !== '\n') i++;
      if (code[i] === '\n') result += '\n';
    } else if (code[i] === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      if (code[i - 2] === '*' && code[i - 1] === '/') {
        while (i < code.length && code[i] === ' ') i++;
        if (code[i] === '\n') result += '\n';
      }
    } else {
      result += code[i];
      i++;
    }
  }
  return result;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = removeComments(content);
  fs.writeFileSync(filePath, cleaned, 'utf8');
  console.log(`Cleaned: ${filePath}`);
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('node_modules')) {
        processDirectory(fullPath);
      }
    } else if (/\.(js|jsx|cjs|mjs)$/i.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

processDirectory('client/src');
processDirectory('server');
console.log('All comments removed!');
