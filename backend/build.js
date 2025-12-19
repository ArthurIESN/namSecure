import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { readdirSync, statSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Step 1: Compile with TypeScript (ignore errors)
console.log('Compiling TypeScript...');
try {
  execSync('tsc', { stdio: 'inherit' });
} catch (err) {
  console.log('⚠ TypeScript errors (continuing anyway)...');
}

// Step 2: Post-process all .js files in dist to replace @/ with relative paths
console.log('Replacing path aliases...');

function processDirectory(dir) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf-8');

      // Calculate relative path from this file to dist root
      const fileDir = path.dirname(filePath);
      const distRoot = path.join(__dirname, 'dist');
      const relativeToRoot = path.relative(fileDir, distRoot);
      const prefix = relativeToRoot ? relativeToRoot + '/' : './';

      // Replace @utils/ imports with relative paths
      content = content.replace(/from\s+["']@utils\/([^"']+)["']/g, (match, importPath) => {
        const pathWithExt = importPath.endsWith('.js') ? importPath : importPath + '.js';
        return `from "${prefix}utils/${pathWithExt}"`;
      });

      content = content.replace(/import\s+["']@utils\/([^"']+)["']/g, (match, importPath) => {
        const pathWithExt = importPath.endsWith('.js') ? importPath : importPath + '.js';
        return `import "${prefix}utils/${pathWithExt}"`;
      });

      // Replace @/ imports with relative paths
      content = content.replace(/from\s+["']@\/([^"']+)["']/g, (match, importPath) => {
        const pathWithExt = importPath.endsWith('.js') ? importPath : importPath + '.js';
        return `from "${prefix}${pathWithExt}"`;
      });

      content = content.replace(/import\s+["']@\/([^"']+)["']/g, (match, importPath) => {
        const pathWithExt = importPath.endsWith('.js') ? importPath : importPath + '.js';
        return `import "${prefix}${pathWithExt}"`;
      });

      // Fix any remaining imports that are missing .js (safety pass)
      content = content.replace(/from\s+["']([^"']+)["']/g, (match, importPath) => {
        if ((importPath.startsWith('./') || importPath.startsWith('../')) &&
            !importPath.endsWith('.js') &&
            !importPath.endsWith('.json') &&
            !importPath.match(/\.[a-z]+$/)) {
          return match.replace(importPath, importPath + '.js');
        }
        return match;
      });

      fs.writeFileSync(filePath, content);
    }
  }
}

processDirectory(path.join(__dirname, 'dist'));
console.log('✓ Build complete with path aliases resolved');
