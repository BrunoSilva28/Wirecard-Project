import moment from "moment";

import { Boleto } from "../models/Boleto";
import { Buyer, BuyerInputDTO } from "../models/Buyer";
import { CARD_BRANDS, CreditCard, CreditCardInputDTO } from "../models/CreditCard";
import { Holder, HolderInputDTO } from "../models/Holder";
import { Payment, PaymentInputDTO, PAYMENT_METHODS, PAYMENT_STATUS } from "../models/Payment";

import { CodePaymentGenerator } from "../services/CodePaymentGenerator";
import { ExpirationDateGenerator } from "../services/ExpirationDateGenerator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { RandomStatusGenerator } from "../services/RandomStatusGenerator";

import { CustomError } from "../error/CustomError";
import { BoletoRepository } from "../data/boleto/BoletoRepository";
import { BuyerRepository } from "../data/buyer/BuyerRepository";
import { ClientRepository } from "../data/costumer/ClientRepository";
import { CreditCardRepository } from "../data/creditCard/CreditCardRepository";
import { CreditCardHolderJunctionRepository } from "../data/creditCardHolderJunction/CreditCardHolderJunctionRepository";
import { HolderRepository } from "../data/holder/HolderRepository";
import { PurchaseRepository } from "../data/purchase/PurchaseRepository";



export class PurchaseBusiness {
    static regExValidateEmail: RegExp = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;

    constructor(        
        private boletoDatabase: BoletoRepository,
        private buyerDatabase: BuyerRepository,
        private clientDatabase: ClientRepository,
        private creditCardDatabase: CreditCardRepository, 
        private creditCardHolderJunctionDatabase: CreditCardHolderJunctionRepository,
        private holderDatabase: HolderRepository,
        private purchaseDatabase: PurchaseRepository,
        private codePaymentGenerator: CodePaymentGenerator,
        private expirationDateGenerator: ExpirationDateGenerator,
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private randomStatusGenerator: RandomStatusGenerator
        ) {};

    findPaymentById = async (paymentId: string): Promise<Payment> => {

        const payment = await this.purchaseDatabase.findPaymentById(paymentId);

        if (!payment) {
            throw new CustomError(404, "payment hasn´t been found! Please, check 'paymentId'");
        };

        return payment;
    };

    createPayment = async (
        clientId: string,
        buyer: BuyerInputDTO | undefined,
        payment: PaymentInputDTO | undefined,
        holder: HolderInputDTO | undefined,
        creditCard: CreditCardInputDTO | undefined,
        saveCreditCard: boolean | undefined
    ): Promise<string> => {
        if (!buyer) {
            throw new CustomError(422, `'buyer' must be provided as an object with 'name',
                'email' and 'cpf' properties`
            );
        };

        if (!payment) {
            throw new CustomError(422, `'payment' must be provided as an object with 'amount',
                and 'method' properties`
            );
        };

        const { name: buyerName, email: buyerEmail, cpf: buyerCpf } = buyer as BuyerInputDTO;
        const { amount, method } = payment as PaymentInputDTO;

        if (!buyerName || !buyerEmail || !buyerCpf || typeof buyerName !== "string" ||
            typeof buyerEmail !== "string" || typeof buyerCpf !== "string") {
            throw new CustomError(422, `'name', 'email' and 'cpf' of buyer should be provided, 
                and as a string type one! Please, check input´s values`
            );
        };

        if (buyerName.length < 3) {
            throw new CustomError(422, "Buyer´s 'name' should have at least 3 words! Please, try again!");
        };

        if (!PurchaseBusiness.regExValidateEmail.test(buyerEmail)) {
            throw new CustomError(422, "Insert a valid e-mail to buyer, such as: 'xxxx@yyyyy.zzz.www");
        };

        if (buyerCpf.length !== 11) {
            throw new CustomError(422, `Buyer 'cpf' should have exactly 11 numbers in a string format type! Please, try again`
            );
        };

        if (!amount || !method) {
            throw new CustomError(422, `'amount' and 'method' of payment should be provided! Please, check
                input´s values`
            );
        };

        if (typeof amount !== "number" || amount <= 0) {
            throw new CustomError(422, `'amount' should be a positive and non-zero number type input! Please, check input value`);
        };

        if (method !== PAYMENT_METHODS.BOLETO && method !== PAYMENT_METHODS.CREDIT_CARD) {
            throw new CustomError(422, `Payment 'method' is only allowed to 'BOLETO' or 'CREDIT_CARD'! Please, try again`);
        };

        const isClientAlreadyExist = await this.clientDatabase.findClientById(clientId);

        if (!isClientAlreadyExist) {
            throw new CustomError(422, `Client hasn´t been found! Please, check 'clientId'`);
        };

        const isBuyerAlreadyExist = await this.buyerDatabase.findBuyerByEmail(buyerEmail);

        if (!isBuyerAlreadyExist) {
            const newBuyerId = this.idGenerator.generateId();

            const newBuyer = new Buyer(newBuyerId, buyerName, buyerEmail, buyerCpf);
            await this.buyerDatabase.createBuyer(newBuyer);
        };

        if (method === "BOLETO") {
            const newPaymentId = this.idGenerator.generateId();
            const buyerId = await this.buyerDatabase.findBuyerIdByEmail(buyerEmail);

            if (!buyerId) {
                throw new CustomError(500, "Internal error server! Please, try again");
            };

            const status = "CREATED";

            const newPayment = new Payment(newPaymentId, amount, method, status as PAYMENT_STATUS, buyerId, clientId);

            await this.purchaseDatabase.createPayment(newPayment);

            const newBoletoId = this.idGenerator.generateId();

            const newCodePayment = this.codePaymentGenerator.generate();

            const newExpirationDate = this.expirationDateGenerator.generate();

            const newBoleto = new Boleto(newBoletoId, newCodePayment, newExpirationDate);

            await this.boletoDatabase.createBoleto(newBoleto);

            return newBoleto.getCode();
        } else {
            if (!holder) {
                throw new CustomError(422, `'holder' must be provided as an object with 'name', 'birthDate' and 'documentNumber' properties when payment´s method is 'CREDIT_CARD'`);
            };

            if (!creditCard) {
                throw new CustomError(422, `'creditCard' must be provided as an object with 'amount', and 'method' properties when payment´s method is 'CREDIT_CARD'`);
            };

            const { name: holderName, birthDate: holderBirth, documentNumber: holderRegister } = holder;
            const { holderName: cardHolderName, brand, cardNumber, expirationDate, cvv } = creditCard;

            if (!holderName || !holderBirth || !holderRegister) {
                throw new CustomError(422, `'name', 'birthDate' and 'documentNumber' of holder should be provided when 'CREDIT_CARD' is the payment method, and as a string type one! Please, check input´s values`);
            };

            const actualYear = new Date().getFullYear();
            const holderBirthYear: string = holderBirth.split("/")[2];
            if (actualYear - Number(holderBirthYear) < 18) {
                throw new CustomError(422, `Holder should have at least 18 years old! Please, check 'birthDate'`);
            };

            const isBirthValid: string = moment(holderBirth, "DD/MM/YYYY").format("YYYY-MM-DD");
            if (isBirthValid === "Invalid date") {
                throw new CustomError(422, `'birthDate' from holder should be a 'DD/MM/YYYY format, where DD is a valid day, MM is a valid month and YYYY is a valid year`
                );
            };

            const timestampBirthIsValid: number = moment(holderBirth, "DD/MM/YYYY").unix() - moment().unix();
            if (timestampBirthIsValid > 0) {
                throw new CustomError(422, `'birthDate' can´t be a future time one! Please, check input value`);
            };

            if (holderRegister.length !== 9) {
                throw new CustomError(422, `Holder 'documentNumber' should have exactly 9 numbers in a string format type! Please, try again`
                );
            };

            if (!brand || !cardNumber || !expirationDate || !cvv) {
                throw new CustomError(422, `'brand', 'cardNumber', 'expirationDate' and 'cvv' of CreditCard should be provided when 'CREDIT_CARD' is the payment method, and as a string type one! Please, check input´s values`);
            };

            if (brand !== CARD_BRANDS.AMERICAN_EXPRESS && brand !== CARD_BRANDS.ELO &&
                brand !== CARD_BRANDS.HIPERCARD && brand !== CARD_BRANDS.MASTERCARD &&
                brand !== CARD_BRANDS.VISA
            ) {
                throw new CustomError(422, `CreditCard 'brand' is only allowed to 'AMERICAN_EXPRESS', 'ELO', 'HIPERCARD', 'MASTERCARD' or 'VISA'! Please, try again`);
            };

            if (cardNumber.length < 13 || cardNumber.length > 16) {
                throw new CustomError(422, `'cardNumber' should have from 13 to 16 digits as a stryng format! Please, check input value`
                );
            };

            const isExpirationDateValid: string = moment(expirationDate, "DD/MM/YYYY").format("YYYY-MM-DD");
            if (isExpirationDateValid === "Invalid date") {
                throw new CustomError(422, `'expirationDate' from CreditCard should be a 'DD/MM/YYYY format, where 
                    DD is a valid day (anyone to your choice), MM is a valid month and YYYY is a valid year`
                );
            };

            const timestampExpirationDateIsValid: number = moment(expirationDate, "DD/MM/YYYY").unix() - moment().unix();
            if (timestampExpirationDateIsValid < 0) {
                throw new CustomError(422, `'expirationDate' can´t be a past time one! Please, check input value`);
            };

            if (cvv.length !== 3) {
                throw new CustomError(422, `'cvv' should have exactly 3 digits as stryng format! Please, check input value`
                );
            };

            const isHolderAlreadyExist = await this.holderDatabase.findHolderByDocumentNumber(holderRegister);

            if (!isHolderAlreadyExist) {

                const newHolderId = this.idGenerator.generateId();
                const modifyHolderBirth: string = moment(holderBirth, "DD/MM/YYYY").format("YYYY-MM-DD");

                const newHolder = new Holder(newHolderId, holderName, modifyHolderBirth, holderRegister);
                await this.holderDatabase.createHolder(newHolder);
            };

            const isCreditCardAlreadyExist = await this.creditCardDatabase.findCreditCardByHolderName(cardHolderName);

            if (!isCreditCardAlreadyExist && saveCreditCard) {
                const newCreditCardId = this.idGenerator.generateId();

                const encryptedCardNumber = await this.hashManager.hash(cardNumber);
                const encryptedCVV = await this.hashManager.hash(cvv);
                const modifyExpirationDate: string = moment(expirationDate, "DD/MM/YYYY").format("YYYY-MM-DD");

                const newCreditCard = new CreditCard(newCreditCardId, cardHolderName, brand as CARD_BRANDS,
                    encryptedCardNumber, modifyExpirationDate, encryptedCVV
                );

                await this.creditCardDatabase.createCreditCard(newCreditCard);

                const registeredHolder = await this.holderDatabase.findHolderByDocumentNumber(holderRegister) as Holder;

                await this.creditCardHolderJunctionDatabase.createCreditCardHolderJunction(
                    registeredHolder.getId(),
                    newCreditCardId
                );
            };

            const newPaymentId = this.idGenerator.generateId();
            const buyerId = await this.buyerDatabase.findBuyerIdByEmail(buyerEmail);

            if (!buyerId) {
                throw new CustomError(500, "Internal error server! Please, try again");
            };

            const randomStatus = this.randomStatusGenerator.generate();

            const newPayment = new Payment(newPaymentId, amount, method, randomStatus as PAYMENT_STATUS,
                buyerId, clientId
            );

            await this.purchaseDatabase.createPayment(newPayment);

            return newPayment.getStatus() === "AUTHORIZED" ? "Transaction has been successfully!" :
                `Transaction has been failed! '${newPayment.getStatus()}' status`;
        };
    };
};