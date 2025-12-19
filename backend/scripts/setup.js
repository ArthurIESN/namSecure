import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`[SUCCESS] ${description} - Completed`);
    return true;
  } catch (error) {
    console.error(`[ERROR] Failed during: ${description}`);
    return false;
  }
}

function cleanPrismaSchema()
{
  console.log('\nCleaning Prisma schema file...');

  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

  if (!fs.existsSync(schemaPath))
  {
    console.log('[WARNING] The prisma/schema.prisma file does not exist');
    return true;
  }

  try
  {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    const lines = content.split('\n');

    const cleanedContent = lines.slice(0, 9).join('\n') + '\n';

    fs.writeFileSync(schemaPath, cleanedContent, 'utf-8');
    console.log('[SUCCESS] Prisma schema cleaned (kept first 9 lines)');
    return true;
  }
  catch (error)
  {
    console.error('[ERROR] Failed to clean Prisma schema:', error.message);
    return false;
  }
}

function deleteIndexFiles()
{
  console.log('\nDeleting index files in node_modules/.prisma...');

  const prismaDir = path.join(__dirname, 'node_modules', '.prisma');

  if (!fs.existsSync(prismaDir))
  {
    console.log('[WARNING] The node_modules/.prisma directory does not exist yet');
    return true;
  }

  try
  {
    function deletePrismaIndexFiles(dir)
    {
      const files = fs.readdirSync(dir);

      files.forEach(file =>
      {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory())
        {
          deletePrismaIndexFiles(filePath);
        }
        else if (file.startsWith('index'))
        {
          fs.unlinkSync(filePath);
          console.log(`  Deleted: ${path.relative(prismaDir, filePath)}`);
        }
      });
    }

    deletePrismaIndexFiles(prismaDir);
    console.log('[SUCCESS] Index files deleted');
    return true;
  } catch (error) {
    console.error('[ERROR] Failed to delete index files:', error.message);
    return false;
  }
}

async function setup()
{
  console.log('Starting namSecure server installation\n');
  console.log('='.repeat(50));

  // Install dependencies
  if (!runCommand('npm install', 'Installing npm dependencies')) {
    process.exit(1);
  }

  // Clean Prisma schema file
  /*if (!cleanPrismaSchema()) {
   process.exit(1);
 }*/

  // Delete index files
  if (!deleteIndexFiles()) {
    process.exit(1);
  }

  // Prisma db pull
  if (!runCommand('npx prisma db pull', 'Synchronizing Prisma schema')) {
    process.exit(1);
  }

  // Prisma generate
  if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('[SUCCESS] Installation completed successfully!');
  console.log('You can now start the server with: npm run dev');
  console.log('='.repeat(50) + '\n');
}

setup().catch(error =>
{
  console.error('[ERROR] Fatal error:', error);
  process.exit(1);
});
