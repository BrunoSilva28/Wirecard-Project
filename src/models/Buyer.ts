export class Buyer {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private cpf: string
    ){}

    getId():string {
        return this.id;
    };

    getName():string {
        return this.name;
    };

    getEmail():string {
        return this.email;
    };

    getCpf():string {
        return this.cpf;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setName(newName:string):void {
        this.name = newName;
    };

    setEmail(newEmail:string):void {
        this.email = newEmail;
    };

    setCpf(newCpf:string):void {
        this.cpf = newCpf;
    }

    static toBuyerModel(data:any):Buyer {
        return new Buyer(data.id, data.name, data.email, data.cpf);
    };
};

export interface BuyerInputDTO {
    name: string,
    email: string,
    cpf: string
};