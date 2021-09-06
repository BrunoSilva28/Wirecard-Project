import { Payment } from '../../../src/models/Payment';
import { PAYMENT_METHODS } from '../../../src/models/Payment';
import { PAYMENT_STATUS } from '../../../src/models/Payment';

export const PaymentMockBoletoSuccess = new Payment(
    "paymentBoleto_id",
    100.00,
    PAYMENT_METHODS.BOLETO,
    PAYMENT_STATUS.CREATED,
    "buyer_id",
    "client_id"
);

export const PaymentMockCreditCardSuccess = new Payment(
    "paymentCreditCard_id",
    150.00,
    PAYMENT_METHODS.CREDIT_CARD,
    PAYMENT_STATUS.CREATED,
    "buyer_id",
    "client_id"
);

export const PaymentInputDTOMockBoletoSuccess = {
    amount: 100.00 || undefined,
    method: PAYMENT_METHODS.BOLETO || undefined
};

export const PaymentInputDTOMockCreditCardSuccess = {
    amount: 150.00 || undefined,
    method: PAYMENT_METHODS.CREDIT_CARD || undefined
};