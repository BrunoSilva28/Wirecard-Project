import { CreditCard } from "../../../src/models/CreditCard";
import { CreditCardMockSuccess } from "./CreditCardMock";

export class CreditCardDatabaseMock {

    public findCreditCardByHolderName = async(holderName: string):Promise<CreditCard | undefined> => {
        switch (holderName) {
            case "HOLDER NAME":
                return CreditCardMockSuccess;
            default:
                return undefined;
        };
    };

    public createCreditCard = async (newCreditCard: CreditCard): Promise<void> => {
       
    };
};