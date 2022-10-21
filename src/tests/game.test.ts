import { Player } from "../Game/Player";
import { Game } from "../Game/Game";

describe('testing game', () => {
  test('test 1', () => {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 1);
    expect(game.stateMachine.currentState.name).toBe('Baltic Avenue');
  });

  test('test 2', () => {
    const players = [
      new Player('1', 'Player 1'),
      new Player('2', 'Player 2'),
    ];
    const game = new Game(players);
    game.rollDice(1, 3);
    expect(game.stateMachine.currentState.name).toBe('Go');
  });
});
