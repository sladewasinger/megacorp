import { GameTests } from './js/modules/Game.TEST.js';

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

try {
  const gameTester = new GameTests();
  const tests = getAllMethods(gameTester);
  tests.forEach((testName) => {
    console.log(`Running test ${testName}`);
    gameTester[testName]();
  });
  console.log('All tests passed!');
} catch (error) {
  console.error('Test failed! ', error);
}
