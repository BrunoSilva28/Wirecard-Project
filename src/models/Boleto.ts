export class Boleto {
    constructor(
        private id: string,
        private code: string,
        private expirationDate: string
    ){}

    getId():string {
        return this.id;
    };

    getCode():string {
        return this.code;
    };

    getExpirationDate():string {
        return this.expirationDate;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setCode(newCode:string):void {
        this.code = newCode;
    };

    setExpirationDate(newExpirationDate:string):void {
        this.expirationDate = newExpirationDate;
    };

    static toBoletoModel(data:any):Boleto {
        return new Boleto(data.id, data.code, data.expirationDate);
    };
};

export interface BoletoInputDTO {
    code: string,
    expirationDate: string
};