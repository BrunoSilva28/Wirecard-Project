import { CreditCard } from "../../models/CreditCard";

export interface CreditCardRepository {
    findCreditCardByHolderName(holderName: string):Promise<CreditCard | undefined>,
    createCreditCard(newCreditCard: CreditCard): Promise<void>
};