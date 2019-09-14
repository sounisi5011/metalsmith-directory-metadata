const fs = require('fs');
const path = require('path');
const util = require('util');

const Mustache = require('mustache');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function main(templatePath) {
  const templateCode = await readFileAsync(templatePath, 'utf8');
  const view = {
    pkg: require(path.resolve(process.cwd(), 'package.json')),
    pkgLock: require(path.resolve(process.cwd(), 'package-lock.json')),
  };
  const output = Mustache.render(templateCode, view);
  const outputPath = path.join(path.dirname(templatePath), 'README.md');
  await writeFileAsync(outputPath, output);
}

(async () => {
  try {
    await main(
      process.argv[2] || path.resolve(process.cwd(), 'README.mustache'),
    );
  } catch (err) {
    process.exitCode = 1;
    console.error(err);
  }
})();
