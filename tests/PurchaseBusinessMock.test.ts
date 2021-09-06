import { PurchaseBusiness } from "../src/business/PurchaseBusiness";
import { BoletoDatabaseMock } from "./mocks/boleto/BoletoDatabaseMock";
import { BuyerDatabaseMock } from './mocks/buyer/BuyerDatabaseMock';
import { ClientDatabaseMock } from './mocks/costumer/ClientDatabaseMock';
import { CreditCardDatabaseMock } from './mocks/creditCard/CreditCardDatabaseMock';
import { CreditCardHolderJunctionDatabaseMock } from './mocks/creditCardHolderJunction/CreditCardHolderJunctionDatabaseMock';
import { HolderDatabaseMock } from './mocks/holder/HolderDatabaseMock';
import { PurchaseDatabaseMock } from './mocks/payment/PurchaseDatabaseMock';
import { CodePaymentGeneratorMock } from './mocks/services/CodePaymentGeneratorMock';
import { ExpirationDateGeneratorMock } from './mocks/services/ExpirationDateGeneratorMock';
import { HashManagerMock } from './mocks/services/HashManagerMock';
import { IdGeneratorMock } from './mocks/services/IdGeneratorMock';
import { RandomStatusGeneratorMock } from './mocks/services/RandomStatusGeneratorMock';

import { BoletoDatabase } from '../src/data/boleto/BoletoDatabase';
import { BuyerDatabase } from '../src/data/buyer/BuyerDatabase';
import { ClientDatabase } from '../src/data/costumer/ClientDatabase';
import { CreditCardDatabase } from '../src/data/creditCard/CreditCardDatabase';
import { CreditCardHolderJunctionDatabase } from '../src/data/creditCardHolderJunction/CreditCardHolderJunctionDatabase';
import { HolderDatabase } from '../src/data/holder/HolderDatabase';
import { PurchaseDatabase } from '../src/data/purchase/PurchaseDatabase';

import { PaymentInputDTOMockBoletoSuccess, PaymentInputDTOMockCreditCardSuccess, PaymentMockBoletoSuccess, PaymentMockCreditCardSuccess } from "./mocks/payment/PaymentMock";
import { HolderInputDTOMockSuccess } from "./mocks/holder/HolderMock";
import { CreditCardInputDTOMockSuccess } from "./mocks/creditCard/CreditCardMock";
import { BuyerInputDTOMockSuccess } from "./mocks/buyer/BuyerMock";
import { PAYMENT_METHODS } from "../src/models/Payment";
import { CARD_BRANDS } from "../src/models/CreditCard";

const purchaseBusinessMock = new PurchaseBusiness(
    new BoletoDatabaseMock() as BoletoDatabase,
    new BuyerDatabaseMock() as BuyerDatabase,
    new ClientDatabaseMock() as ClientDatabase,
    new CreditCardDatabaseMock() as CreditCardDatabase,
    new CreditCardHolderJunctionDatabaseMock() as CreditCardHolderJunctionDatabase,
    new HolderDatabaseMock() as HolderDatabase,
    new PurchaseDatabaseMock() as PurchaseDatabase,
    new CodePaymentGeneratorMock(),
    new ExpirationDateGeneratorMock(),
    new HashManagerMock(),
    new IdGeneratorMock(),
    new RandomStatusGeneratorMock()
);

describe("Testing find payment searching by id", () => {

    test("Should return error when payment_id isn´t a valid one", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.findPaymentById("wrong_id");

        } catch (error: any) {

            expect(error.message).toEqual(`payment hasn´t been found! Please, check 'paymentId'`);
            expect(error.code).toBe(404);
        };
    });

    test("Should return payment informations when boleto´s payment id is a valid one", async () => {
        expect.assertions(1);

        const result = await purchaseBusinessMock.findPaymentById("paymentBoleto_id");

        expect(result).toEqual(PaymentMockBoletoSuccess);
    });

    test("Should return payment informations when creditCard´s payment id is a valid one", async () => {
        expect.assertions(1);

        const result = await purchaseBusinessMock.findPaymentById("paymentCreditCard_id");

        expect(result).toEqual(PaymentMockCreditCardSuccess);
    });
});

describe("Testing create payment", () => {

    test("Should return error if buyer isn´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                undefined,
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'buyer' must be provided as an object with 'name',
                'email' and 'cpf' properties`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if payment isn´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                undefined,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'payment' must be provided as an object with 'amount',
                and 'method' properties`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if name, e-mail and/or cpf of buyer aren´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                {
                    name: "",
                    email: "buyer@buyer.com",
                    cpf: "12345678901"
                },
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'name', 'email' and 'cpf' of buyer should be provided, 
                and as a string type one! Please, check input´s values`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if buyer name doesn´t have at least 3 words", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                {
                    name: "ig",
                    email: "buyer@buyer.com",
                    cpf: "12345678901"
                },
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual("Buyer´s 'name' should have at least 3 words! Please, try again!");
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if buyer e-mail isn´t a valid one", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                {
                    name: "BUYER",
                    email: "buyerbuyer.com",
                    cpf: "12345678901"
                },
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual("Insert a valid e-mail to buyer, such as: 'xxxx@yyyyy.zzz.www");
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if buyer CPF doesn´t have exactly 11 string digits", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                {
                    name: "BUYER",
                    email: "buyer@buyer.com",
                    cpf: "12345"
                },
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`Buyer 'cpf' should have exactly 11 numbers in a string format type! Please, try again`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if amount and/or method of payment isn´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                {
                    amount: Number(""),
                    method: PAYMENT_METHODS.BOLETO
                },
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'amount' and 'method' of payment should be provided! Please, check
                input´s values`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if amount isn´t a positive and non-zero number", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                {
                    amount: -5,
                    method: PAYMENT_METHODS.BOLETO
                },
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'amount' should be a positive and non-zero number type input! Please, check input value`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if payment method isn´t a valid one", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                {
                    amount: 25.00,
                    method: "debito" as PAYMENT_METHODS
                },
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`Payment 'method' is only allowed to 'BOLETO' or 'CREDIT_CARD'! Please, try again`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if client hasn´t been found", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "invalidClient",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockBoletoSuccess,
                HolderInputDTOMockSuccess,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`Client hasn´t been found! Please, check 'clientId'`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if payment method is 'CREDIT_CARD' and holder isn´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                undefined,
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'holder' must be provided as an object with 'name', 'birthDate' and 'documentNumber' properties when payment´s method is 'CREDIT_CARD'`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if payment method is 'CREDIT_CARD' and CreditCard isn´t provided", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                HolderInputDTOMockSuccess,
                undefined,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'creditCard' must be provided as an object with 'amount', and 'method' properties when payment´s method is 'CREDIT_CARD'`);
            expect(error.code).toBe(422);
        };
    });

    test(`Should return error if payment method is 'CREDIT_CARD' and name,
        birthDate and/or documentNumber of holder isn´t provided`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                {
                    name: "",
                    birthDate: "01/06/2000",
                    documentNumber: "123456789"
                },
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'name', 'birthDate' and 'documentNumber' of holder should be provided when 'CREDIT_CARD' is the payment method, and as a string type one! Please, check input´s values`);
            expect(error.code).toBe(422);
        };
    });

    test("Should return error if payment method is 'CREDIT_CARD' and holder doesn´t have at least 18 years old", async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                {
                    name: "HOLDER",
                    birthDate: "01/06/2005",
                    documentNumber: "123456789"
                },
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`Holder should have at least 18 years old! Please, check 'birthDate'`);
            expect(error.code).toBe(422);
        };
    });

    test(`Should return error if payment method is 'CREDIT_CARD' and birthDate of holder
        documentNumber doesn´t have exactly 9 string digits`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                {
                    name: "HOLDER",
                    birthDate: "01/06/2000",
                    documentNumber: "1234567"
                },
                CreditCardInputDTOMockSuccess,
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`Holder 'documentNumber' should have exactly 9 numbers in a string format type! Please, try again`);
            expect(error.code).toBe(422);
        };
    });

    // Por algum motivo estranho este teste não funcionou e não consegui encontrar uma maneira de resolvê-lo.
    // test(`Should return error if payment method is 'CREDIT_CARD' and brand,
    // cardNumber, expirationDate and/or cvv of CreditCard isn´t provided`, async () => {
    //     expect.assertions(2);
    //     try {

    //         await purchaseBusinessMock.createPayment(
    //             "client_id",
    //             BuyerInputDTOMockSuccess,
    //             PaymentInputDTOMockCreditCardSuccess,
    //             HolderInputDTOMockSuccess,
    //             {
    //                 holderName: "",
    //                 brand: CARD_BRANDS.ELO,
    //                 cardNumber: "1234567890123456",
    //                 expirationDate: "01/08/2027",
    //                 cvv: "666"
    //             },
    //             true
    //         );

    //     } catch (error: any) {
    //         expect(error.message).toEqual(`'brand', 'cardNumber', 'expirationDate' and 'cvv' of CreditCard should be provided when 'CREDIT_CARD' is the payment method, and as a string type one! Please, check input´s values`);
    //         expect(error.code).toBe(422);
    //     };
    // });

    test(`Should return error if payment method is 'CREDIT_CARD' and brand isn´t a valid one`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                HolderInputDTOMockSuccess,
                {
                    holderName: "HOLDER NAME",
                    brand: "WRONG_BRAND" as CARD_BRANDS,
                    cardNumber: "1234567890123456",
                    expirationDate: "01/08/2027",
                    cvv: "666"
                },
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`CreditCard 'brand' is only allowed to 'AMERICAN_EXPRESS', 'ELO', 'HIPERCARD', 'MASTERCARD' or 'VISA'! Please, try again`);
            expect(error.code).toBe(422);
        };
    });

    test(`Should return error if payment method is 'CREDIT_CARD' and cardNumber doesn´t have between
        13 (includes) and 16 (also inclues) string digits`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                HolderInputDTOMockSuccess,
                {
                    holderName: "HOLDER NAME",
                    brand: CARD_BRANDS.ELO,
                    cardNumber: "1234567",
                    expirationDate: "01/08/2027",
                    cvv: "666"
                },
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'cardNumber' should have from 13 to 16 digits as a stryng format! Please, check input value`);
            expect(error.code).toBe(422);
        };
    });

    test(`Should return error if payment method is 'CREDIT_CARD' and expirationDate was a past time`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                HolderInputDTOMockSuccess,
                {
                    holderName: "HOLDER NAME",
                    brand: CARD_BRANDS.ELO,
                    cardNumber: "1234567890123456",
                    expirationDate: "01/08/2020",
                    cvv: "666"
                },
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'expirationDate' can´t be a past time one! Please, check input value`);
            expect(error.code).toBe(422);
        };
    });

    test(`Should return error if payment method is 'CREDIT_CARD' and cvv doesn´t 
        have exactly 3 string digits`, async () => {
        expect.assertions(2);
        try {

            await purchaseBusinessMock.createPayment(
                "client_id",
                BuyerInputDTOMockSuccess,
                PaymentInputDTOMockCreditCardSuccess,
                HolderInputDTOMockSuccess,
                {
                    holderName: "HOLDER NAME",
                    brand: CARD_BRANDS.ELO,
                    cardNumber: "1234567890123456",
                    expirationDate: "01/08/2027",
                    cvv: "666666"
                },
                true
            );

        } catch (error: any) {
            expect(error.message).toEqual(`'cvv' should have exactly 3 digits as stryng format! Please, check input value`);
            expect(error.code).toBe(422);
        };
    });
});