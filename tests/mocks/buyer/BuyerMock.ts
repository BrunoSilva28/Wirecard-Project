import { Buyer } from '../../../src/models/Buyer';

export const BuyerMockSuccess = new Buyer(
    "buyer_id",
    "BUYER",
    "buyer@buyer.com",
    "12345678901"
);

export const BuyerInputDTOMockSuccess = {
    name: "BUYER",
    email: "buyer@buyer.com",
    cpf: "12345678901"
};