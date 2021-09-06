import { Request, Response } from 'express';

import { PurchaseBusiness } from '../business/PurchaseBusiness';

import { BuyerInputDTO } from '../models/Buyer';
import { CreditCardInputDTO } from '../models/CreditCard';
import { HolderInputDTO } from '../models/Holder';
import { PaymentInputDTO } from '../models/Payment';

export class PurchaseController {
    constructor(
        private purchaseBusiness: PurchaseBusiness
    ){};

    findPaymentById = async (req: Request, res: Response):Promise<void> => {
        try {
            const paymentId = req.params.id as string;

            const paymentInformations = await this.purchaseBusiness.findPaymentById(paymentId);

            res.status(200).send({ payment: paymentInformations});
        } catch (error: any) {
            res.status(error.code || 400).send({ message: error.message? error.message : error.sqlMessage });
        };
    };

    createPayment = async (req: Request, res: Response):Promise<void> => {
        try {
            const clientId = req.params.clientId as string;
            const { buyer, payment, holder, creditCard, saveCreditCard } =  req.body;

            const buyerInput: BuyerInputDTO | undefined = buyer && {
                name: buyer.name,
                email: buyer.email,
                cpf: buyer.cpf
            };

            const paymentInput: PaymentInputDTO | undefined = {
                amount: payment.amount,
                method: payment.method?.toLocaleUpperCase()
            };

            const holderInput: HolderInputDTO | undefined = {
                name: holder.name,
                birthDate: holder.birthDate,
                documentNumber: holder.documentNumber
            };

            const creditCardInput: CreditCardInputDTO | undefined = {
                holderName: creditCard.holderName,
                brand: creditCard.brand,
                cardNumber: creditCard.cardNumber,
                expirationDate: creditCard.expirationDate,
                cvv: creditCard.cvv
            };

            const result = await this.purchaseBusiness.createPayment(
                clientId, 
                buyerInput, 
                paymentInput,
                holderInput, 
                creditCardInput,
                saveCreditCard
            );

            res.status(201).send({ message: result });
        } catch (error: any) {
            res.status(error.code || 400).send({ message: error.message? error.message : error.sqlMessage });
        };
    };
};