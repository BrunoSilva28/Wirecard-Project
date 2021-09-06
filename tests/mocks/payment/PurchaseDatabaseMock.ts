import { Payment } from "../../../src/models/Payment";
import { PaymentMockBoletoSuccess, PaymentMockCreditCardSuccess } from "./PaymentMock";

export class PurchaseDatabaseMock {

    findPaymentById = async (paymentId: string): Promise<Payment | undefined> => {
        switch (paymentId) {
            case "paymentBoleto_id":
                return PaymentMockBoletoSuccess;
            case "paymentCreditCard_id":
                return PaymentMockCreditCardSuccess;
            default:
                return undefined;
        };
    };

    createPayment = async (newPayment: Payment): Promise<void> => {
        
    };
};