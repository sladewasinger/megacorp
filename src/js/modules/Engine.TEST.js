import { Assert } from './utils/Assert.js';
import { Engine } from './Engine.js';

export default class Test {
  testEngineCreation() {
    const engine = new Engine();
    Assert.notNull(engine);
  }
}
