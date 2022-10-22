
export class ChanceDeck {
  constructor() {
    this.cards = [
      // new AdvanceToGo(),
      // new AdvanceToIllinoisAvenue(),
      // new AdvanceToStCharlesPlace(),
      // new AdvanceToNearestUtility(),
      // new AdvanceToNearestRailroad(),
      // new BankPaysYouDividend(),
      // new GetOutOfJailFree(),
      // new GoBackThreeSpaces(),
      // new GoToJail(),
      // new MakeGeneralRepairs(),
      // new PayPoorTax(),
      // new TakeATripToReadingRailroad(),
      // new TakeATripToBoardwalk(),
      // new AdvanceToReadingRailroad(),
      // new AdvanceToBoardwalk(),
      // new AdvanceToPennsylvaniaAvenue(),
      // new AdvanceToShortLine(),
    ];
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
