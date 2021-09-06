
export interface CreditCardHolderJunctionRepository {
    createCreditCardHolderJunction(holderId:string, creditCardId:string):Promise<void>
};