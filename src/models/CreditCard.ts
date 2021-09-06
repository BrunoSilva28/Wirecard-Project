export enum CARD_BRANDS {
    AMERICAN_EXPRESS = "AMERICAN_EXPRESS",
    ELO = "ELO",
    HIPERCARD = "HIPERCARD",
    MASTERCARD = "MASTERCARD",
    VISA = "VISA"
};

export class CreditCard {
    constructor(
        private id: string,
        private holderName: string,
        private brand: CARD_BRANDS,
        private cardNumber: string,
        private expirationDate: string,
        private cvv: string
    ){}

    getId():string {
        return this.id;
    };

    getHolderName():string {
        return this.holderName;
    };

    getBrand():string {
        return this.brand;
    };

    getCardNumber():string {
        return this.cardNumber;
    };

    getExpirationDate():string {
        return this.expirationDate;
    };

    getCVV():string {
        return this.cvv;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setHolderName(newHolderName:string):void {
        this.holderName = newHolderName;
    };

    setBrand(newBrand:CARD_BRANDS):void {
        this.brand = newBrand;
    };

    setCardNumber(newCardNumber:string):void {
        this.cardNumber = newCardNumber;
    }

    setExpirationDate(newExpirationDate:string):void {
        this.expirationDate = newExpirationDate;
    };

    setCVV(newCVV:string):void {
        this.cvv = newCVV;
    };

    static toCreditCardModel(data:any):CreditCard {
        return new CreditCard(
            data.id,
            data.holderName,
            data.brand,
            data.cardNumber,
            data.expirationDate,
            data.cvv
        );
    };
};

export interface CreditCardInputDTO {
    holderName: string,
    brand: CARD_BRANDS,
    cardNumber: string,
    expirationDate: string,
    cvv: string
};