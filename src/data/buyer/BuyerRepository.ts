import { Buyer } from "../../models/Buyer";

export interface BuyerRepository {
    findBuyerByEmail(email: string): Promise<Buyer | undefined>,
    findBuyerIdByEmail(email: string): Promise<string | undefined>,
    createBuyer(newBuyer: Buyer): Promise<void>
};