import { AdvanceToGo } from './communityChestCards/AdvanceToGo.js';

export class CommunityChestDeck {
  constructor() {
    this.cards = [
      new AdvanceToGo(),
      // new BankErrorInYourFavor(),
      // new DoctorFees(),
      // new FromSaleOfStockYouGet(),
      // new GetOutOfJailFree(),
      // new GoToJail(),
      // new GrandOperaNight(),
      // new HolidayFundMatures(),
      // new IncomeTaxRefund(),
      // new ItIsYourBirthday(),
      // new LifeInsuranceMatures(),
      // new PayHospitalFees(),
      // new PaySchoolFees(),
      // new ReceiveForServices(),
      // new YouAreAssessedForStreetRepairs(),
      // new YouHaveWonSecondPrizeInABeautyContest(),
      // new YouInherit(),
    ];
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
