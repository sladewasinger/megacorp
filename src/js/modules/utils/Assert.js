
export class Assert {
  static equal(expected, actual) {
    if (actual !== expected) {
      // console.error('\nAssert.equal failed');
      // console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notEqual(expected, actual) {
    if (actual === expected) {
      // console.error('\nAssert.notEqual failed');
      // console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notNull(actual) {
    if (actual === null || actual === undefined) {
      // console.error('\nAssert.notNull failed');
      // console.error('Expected:\n', 'not null', '\nActual:\n', actual);
      throw new Error(`\nExpected\n \tnot null\n but got\n \t${JSON.stringify(actual)}`);
    }
  }
}
