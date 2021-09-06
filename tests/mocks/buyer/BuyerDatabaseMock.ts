import { Buyer } from "../../../src/models/Buyer";
import { BuyerMockSuccess } from "./BuyerMock";

export class BuyerDatabaseMock {

    public findBuyerByEmail = async (email: string): Promise<Buyer | undefined> => {

        switch (email) {
            case "buyer@buyer.com":
                return BuyerMockSuccess;
            default:
                return undefined;
        };
    };

    public findBuyerIdByEmail = async (email: string): Promise<string | undefined> => {

        switch (email) {
            case "buyer@buyer.com":
                return BuyerMockSuccess.getId();
            default:
                return undefined;
        };
    };

    createBuyer = async (newBuyer: Buyer): Promise<void> => {

    };
};