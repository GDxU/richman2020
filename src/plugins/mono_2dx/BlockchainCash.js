var DigitalWallet = (function () {
    function DigitalWallet(_store, userid) {
        this.cash = 0;
        this.exchange_okex_wallet = 0;
        this.exchange_binance_wallet = 0;
        this.exchange_huobi_wallet = 0;
        this.risk_wallet = 0;
        this.user_id = userid;
        this.store = _store;
    }
    DigitalWallet.prototype.SetCashStart = function (amount) {
        this.dispatchStoreCashAmount(amount);
        this.cash = amount;
    };
    DigitalWallet.prototype.dispatchStoreCashAmount = function (amount) {
        this.store.dispatch("mono/updateCashLine", {
            userId: this.user_id,
            cash: amount,
        });
    };
    DigitalWallet.prototype.ReduceCash = function (amount) {
        this.cash = this.cash - amount;
        this.dispatchStoreCashAmount(this.cash);
    };
    DigitalWallet.prototype.EarnCash = function (amount) {
        this.cash = this.cash + amount;
        this.dispatchStoreCashAmount(this.cash);
    };
    DigitalWallet.prototype.isCash50Enough = function () {
        if (this.cash > 1000) {
            return true;
        }
        else {
            return false;
        }
    };
    DigitalWallet.prototype.isCash10Enough = function () {
        if (this.cash > 500) {
            return true;
        }
        else {
            return false;
        }
    };
    return DigitalWallet;
}());
export { DigitalWallet };
