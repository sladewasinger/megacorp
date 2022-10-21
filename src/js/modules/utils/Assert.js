
export class Assert {
  static equal(actual, expected) {
    if (actual !== expected) {
      console.error('\nAssert.equal failed');
      console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notEqual(actual, expected) {
    if (actual === expected) {
      console.error('\nAssert.notEqual failed');
      console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new Error(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notNull(actual) {
    if (actual === null || actual === undefined) {
      console.error('\nAssert.notNull failed');
      console.error('Expected:\n', 'not null', '\nActual:\n', actual);
      throw new Error(`Expected\n not null\n but got\n ${JSON.stringify(actual)}`);
    }
  }
}
