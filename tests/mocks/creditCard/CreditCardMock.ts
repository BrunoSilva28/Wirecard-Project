import { CreditCard } from '../../../src/models/CreditCard';
import { CARD_BRANDS } from '../../../src/models/CreditCard';

export const CreditCardMockSuccess = new CreditCard(
    "creditCard_id",
    "HOLDER NAME",
    CARD_BRANDS.ELO,
    "1234567890123456",
    "01/08/2027",
    "666"
);

export const CreditCardInputDTOMockSuccess = {
    holderName: "HOLDER NAME",
    brand: CARD_BRANDS.ELO || undefined,
    cardNumber: "1234567890123456",
    expirationDate: "01/08/2027",
    cvv: "666"
};