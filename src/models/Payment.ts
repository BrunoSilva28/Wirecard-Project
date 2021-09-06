export enum PAYMENT_METHODS {
    BOLETO = "BOLETO",
    CREDIT_CARD = "CREDIT_CARD"
};

export enum PAYMENT_STATUS {
    CREATED = "CREATED",
    IN_ANALYSIS = "IN_ANALYSIS", 
    AUTHORIZED = "AUTHORIZED",
    CANCELLED = "CANCELLED",
    SETTLED = "SETTLED"
};

export class Payment {
    constructor(
        private id: string,
        private amount: number,
        private method: PAYMENT_METHODS,
        private status: PAYMENT_STATUS,
        private buyerId: string,
        private clientId: string
    ){}

    getId():string {
        return this.id;
    };

    getAmount():number {
        return this.amount;
    };

    getMethod():PAYMENT_METHODS {
        return this.method;
    };

    getStatus():PAYMENT_STATUS {
        return this.status;
    };

    getBuyerId():string {
        return this.buyerId;
    };

    getClientId():string {
        return this.clientId;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setAmount(newAmount:number):void {
        this.amount = newAmount;
    };

    setMethod(newMethod:PAYMENT_METHODS):void {
        this.method = newMethod;
    };

    setStatus(newStatus:PAYMENT_STATUS):void {
        this.status = newStatus;
    };

    setBuyerId(newBuyerId:string):void {
        this.buyerId = newBuyerId;
    };

    setClientId(newClientId:string):void {
        this.clientId = newClientId;
    }

    static toPaymentModel(data:any):Payment {
        return new Payment(data.id, data.amount, data.method, data.status, data.buyerId, data.clientId);
    };
};

export interface PaymentInputDTO {
    amount: number,
    method: PAYMENT_METHODS
};