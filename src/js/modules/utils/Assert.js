
export class AssertError extends Error {
}

export class Assert {
  static true(actual) {
    if (!actual) {
      throw new AssertError(`Expected true, but was ${actual}`);
    }
  }

  static false(actual) {
    if (actual) {
      throw new AssertError(`Expected false, but was ${actual}`);
    }
  }

  static equal(expected, actual) {
    if (actual !== expected) {
      // console.error('\nAssert.equal failed');
      // console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new AssertError(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notEqual(expected, actual) {
    if (actual === expected) {
      // console.error('\nAssert.notEqual failed');
      // console.error('Expected:\n', expected, '\nActual:\n', actual);
      throw new AssertError(`Expected\n ${JSON.stringify(expected)}\n but got\n ${JSON.stringify(actual)}`);
    }
  }

  static notNull(actual) {
    if (actual === null || actual === undefined) {
      // console.error('\nAssert.notNull failed');
      // console.error('Expected:\n', 'not null', '\nActual:\n', actual);
      throw new AssertError(`\nExpected\n \tnot null\n but got\n \t${JSON.stringify(actual)}`);
    }
  }

  static fail(error) {
    throw new AssertError(error);
  }
}
