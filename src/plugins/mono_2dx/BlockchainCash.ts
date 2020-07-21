export interface BlockchainCash {
  /**
   * the liquidity in the wallet which can be transfered or spent anytime without permissions
   */
  cash: number;

  /**
   * the wallet money or the third party network wallet that is limited by deposit lock
   */
  exchange_okex_wallet: number;

  /**
   * the wallet money or the third party network wallet that is limited by deposit lock
   */
  exchange_binance_wallet: number;

  /**
   * the wallet money or the third party network wallet that is limited by deposit lock
   */
  exchange_huobi_wallet: number;

  /**
   * the wallet money or the third party network wallet that is limited by deposit lock | will have high risk of being hacked or closed down due to law and enforcements
   */
  risk_wallet: number;

}

export class DigitalWallet implements BlockchainCash {

  cash: number;
  exchange_okex_wallet: number;
  exchange_binance_wallet: number;
  exchange_huobi_wallet: number;
  risk_wallet: number;
  store: any;
  user_id: number;

  constructor(_store: any, userid: number) {
    this.cash = 0;
    this.exchange_okex_wallet = 0;
    this.exchange_binance_wallet = 0;
    this.exchange_huobi_wallet = 0;
    this.risk_wallet = 0;
    this.user_id = userid;
    this.store = _store;
  }

  SetCashStart(amount: number): void {
    this.dispatchStoreCashAmount(amount);
    this.cash = amount;
  }

  private dispatchStoreCashAmount(amount: number): void {
    this.store.dispatch("mono/updateCashLine", {
      userId: this.user_id,
      cash: amount,
    });
  }

  ReduceCash(amount: number): void {
    this.cash = this.cash - amount;
    this.dispatchStoreCashAmount(this.cash);
  }

  EarnCash(amount: number): void {
    this.cash = this.cash + amount;
    this.dispatchStoreCashAmount(this.cash);
  }

  isCash50Enough(): boolean {
    if (this.cash > 1000) {
      return true
    } else {
      return false;
    }
  }

  isCash10Enough(): boolean {
    if (this.cash > 500) {
      return true
    } else {
      return false;
    }
  }
}
