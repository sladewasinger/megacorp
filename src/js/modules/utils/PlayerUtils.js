export class PlayerUtils {
  static getProperties(player, stateMachine, gameState) {
    return stateMachine.getStates().filter((state) => state.owner?.id === player.id);
  }
}
