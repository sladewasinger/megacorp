import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllMethods = (obj) => {
  let props = [];

  do {
    const l = Object.getOwnPropertyNames(obj)
      .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
      .sort()
      .filter((p, i, arr) =>
        typeof obj[p] === 'function' && // only the methods
        p !== 'constructor' && // not the constructor
        (i == 0 || p !== arr[i - 1]) && // not overriding in this prototype
        props.indexOf(p) === -1, // not overridden in a child
      );
    props = props.concat(l);
  }
  while (
    (obj = Object.getPrototypeOf(obj)) && // walk-up the prototype chain
    Object.getPrototypeOf(obj) // not the the Object prototype methods (hasOwnProperty, etc...)
  );

  return props;
};

function* walkDirectoriesSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkDirectoriesSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}


try {
  const files = Array.from(walkDirectoriesSync('./src/js/modules'))
    .filter((x) => x.endsWith('.TEST.js'));

  console.log('Test files: ', files, '\n');

  let totalTests = 0;
  let passedTests = 0;
  for (const file of files) {
    console.log(chalk.cyan(`Importing tests from file`), file);

    const test = await import(path.join('file://', __dirname, file));
    const tests = getAllMethods(test.default.prototype);
    totalTests += tests.length;

    for (const testName of tests) {
      let exceptionThrown = false;

      try {
        console.log(chalk.yellow(`[${testName}]`));
        test.default.prototype[testName]();
      } catch (e) {
        exceptionThrown = true;
        console.log(chalk.red(`[TEST FAILED] ${testName}`));
        console.log(chalk.bgRed(e));
        console.log(e);
      }
      if (!exceptionThrown) {
        passedTests++;
        console.log(chalk.bgGreen(`[PASSED]`));
      }

      console.log(''); // empty line
    };
  }
  console.log('\n-----------------------');
  console.log(chalk.green(`${passedTests}/${totalTests} passed`));
  if (passedTests !== totalTests) {
    console.log(chalk.red(`${totalTests - passedTests}/${totalTests} failed`));
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (error) {
  console.error('\nTesting failed! ', error);
}
