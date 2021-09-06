export class Holder {
    constructor(
        private id: string,
        private name: string,
        private birthDate: string,
        private documentNumber: string
    ){}

    getId():string {
        return this.id;
    };

    getName():string {
        return this.name;
    };

    getBirthDate():string {
        return this.birthDate;
    };

    getDocumentNumber():string {
        return this.documentNumber;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setName(newName:string):void {
        this.name = newName;
    };

    setBirthDate(newBirthDate:string):void {
        this.birthDate = newBirthDate;
    };

    setDocumentNumber(newDocumentNumber:string):void {
        this.documentNumber = newDocumentNumber;
    }

    static toHolderModel(data:any):Holder {
        return new Holder(data.id, data.name, data.birthDate, data.documentNumber);
    };
};

export interface HolderInputDTO {
    name: string,
    birthDate: string,
    documentNumber: string
};