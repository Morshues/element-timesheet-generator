import fs from 'fs'
import path from 'path'

function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, target, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function copyDirectory(source, target) {
  await fs.promises.mkdir(target, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(source, entry.name);
    const tgtPath = path.join(target, entry.name);

    entry.isDirectory() ? await copyDirectory(srcPath, tgtPath) : await copyFile(srcPath, tgtPath);
  }
}

async function main() {
  try {
    await copyDirectory('./src/generator', './dist');
    await copyDirectory('./resources', './dist/resources');

  } catch (err) {
    console.error('Error:', err);
  }
}

main();