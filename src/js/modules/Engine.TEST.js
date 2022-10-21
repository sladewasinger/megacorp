import { Assert } from './utils/Assert.js';
import { Engine } from './Engine.js';
import { User } from './models/User.js';
import { randomUUID } from 'crypto';

const callbackFn = (error, result) => {
  if (error) {
    Assert.fail(error);
  }
  Assert.notNull(result);
};

const ioMock = {
  to: (id) => ({
    emit: () => { },
  }),
};

export default class EngineTests {
  testEngineCreation() {
    const engine = new Engine();
    Assert.notNull(engine.users);
    Assert.notNull(engine.lobbies);
  }

  testRegisterName() {
    const engine = new Engine();
    const user1 = new User(randomUUID());
    engine.users.push(user1);
    engine.registerName(user1.id, 'UserName', callbackFn);
    Assert.equal(user1.name, 'UserName');
  }

  testCreateLobby() {
    const engine = new Engine(ioMock);
    const user1 = new User(randomUUID());
    engine.users.push(user1);

    let exceptionThrown = false;
    try {
      engine.createLobby(user1.id, callbackFn);
    } catch (e) {
      exceptionThrown = true;
      Assert.true(e.message.includes('You have not registered a name'));
    }
    engine.registerName(user1.id, 'UserName', callbackFn);
    engine.createLobby(user1.id, callbackFn);
    Assert.true(exceptionThrown);
    Assert.equal(1, engine.lobbies.length);
    Assert.equal(1, engine.lobbies[0].users.length);
    Assert.equal(user1.id, engine.lobbies[0].users[0].id);
  }

  testJoinLobby() {
    const engine = new Engine(ioMock);
    const user1 = new User(randomUUID());
    engine.users.push(user1);
    engine.registerName(user1.id, 'UserName', callbackFn);
    engine.createLobby(user1.id, callbackFn);

    const user2 = new User(randomUUID());
    engine.users.push(user2);
    engine.registerName(user2.id, 'UserName2', callbackFn);
    engine.joinLobby(user2.id, engine.lobbies[0].id, callbackFn);

    Assert.equal(1, engine.lobbies.length);
    Assert.equal(2, engine.lobbies[0].users.length);
    Assert.equal(user1.id, engine.lobbies[0].users[0].id);
    Assert.equal(user2.id, engine.lobbies[0].users[1].id);
  }

  testDisconnect() {
    const engine = new Engine(ioMock);
    const user1 = new User(randomUUID());
    engine.users.push(user1);
    engine.registerName(user1.id, 'UserName', callbackFn);
    engine.createLobby(user1.id, callbackFn);

    const user2 = new User(randomUUID());
    engine.users.push(user2);
    engine.registerName(user2.id, 'UserName2', callbackFn);
    engine.joinLobby(user2.id, engine.lobbies[0].id, callbackFn);

    engine.userDisconnected(user2.id);

    Assert.equal(1, engine.lobbies.length);
    Assert.equal(1, engine.lobbies[0].users.length);
    Assert.equal(user1.id, engine.lobbies[0].users[0].id);
  }
}
