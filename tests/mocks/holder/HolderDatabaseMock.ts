import { Holder } from "../../../src/models/Holder";
import { HolderMockSuccess } from "./HolderMock";


export class HolderDatabaseMock {

    public findHolderByDocumentNumber = async(holderRegister: string):Promise<Holder | undefined> => { 
        switch (holderRegister) {
            case "123456789":
                return HolderMockSuccess;
            default:
                return undefined;
        };
    };

    public createHolder = async (newHolder: Holder): Promise<void> => {
        
    };
};