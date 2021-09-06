export class Client {
    constructor(
        private id: string,
        private name: string
    ){}

    getId():string {
        return this.id;
    };

    getName():string {
        return this.name;
    };

    setId(newId:string):void {
        this.id = newId;
    };

    setName(newName:string):void {
        this.name = newName;
    };

    static toClientModel(data:any):Client {
        return new Client(data.id, data.name);
    };
};