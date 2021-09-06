import { Payment } from "../../models/Payment";

export interface PurchaseRepository {
    findPaymentById(paymentId: string): Promise<Payment | undefined>,
    createPayment(newPayment: Payment): Promise<void>
};