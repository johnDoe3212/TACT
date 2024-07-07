import "@stdlib/deploy";
import "@stdlib/ownable";

contract Initializer with Deployable {
    admin: Address;
    recipient: Address;
    payoutDate: Int;

    init(admin: Address, recipient: Address, payoutDate: Int) {
        self.admin = admin;
        self.recipient = recipient;
        self.payoutDate = payoutDate;
        self.deploySavingsContract();
    }

    fun deploySavingsContract() {
        let init: StateInit = initOf SavingsContract(self.recipient, self.payoutDate);
        let address: Address = contractAddress(init);
        send(SendParameters{
            to: address,
            value: ton("0.1"),
            mode: SendIgnoreErrors,
            body: "Deploy".asComment(),
            code: init.code,
            data: init.data
        });
    }
}

contract SavingsContract with Deployable {
    recipient: Address;
    payoutDate: Int;
    balance: Int as coins;

    init(recipient: Address, payoutDate: Int) {
        self.recipient = recipient;
        self.payoutDate = payoutDate;
        self.balance = 0;
    }

    receive() {
        self.checkAndTransferFunds();
        self.balance = self.balance + context().value;
    }

    fun checkAndTransferFunds() {
        if (now() >= self.payoutDate && self.balance > 0) {
            send(SendParameters{
                to: self.recipient,
                value: self.balance,
                mode: SendIgnoreErrors
            });
            self.balance = 0;
        }
    }

    get fun balance(): Int {
        return self.balance;
    }

    get fun payoutDate(): Int {
        return self.payoutDate;
    }

    get fun recipient(): Address {
        return self.recipient;
    }
}