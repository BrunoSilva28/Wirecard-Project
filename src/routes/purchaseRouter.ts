import express from 'express';

import { PurchaseBusiness } from '../business/PurchaseBusiness';

import { PurchaseController } from '../controller/PurchaseController';

import { BoletoDatabase } from '../data/boleto/BoletoDatabase';
import { BuyerDatabase } from '../data/buyer/BuyerDatabase';
import { ClientDatabase } from '../data/costumer/ClientDatabase';
import { CreditCardDatabase } from '../data/creditCard/CreditCardDatabase';
import { CreditCardHolderJunctionDatabase } from '../data/creditCardHolderJunction/CreditCardHolderJunctionDatabase';
import { HolderDatabase } from '../data/holder/HolderDatabase';
import { PurchaseDatabase } from '../data/purchase/PurchaseDatabase';

import { CodePaymentGenerator } from '../services/CodePaymentGenerator';
import { ExpirationDateGenerator } from '../services/ExpirationDateGenerator';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import { RandomStatusGenerator } from '../services/RandomStatusGenerator';

export const purchaseRouter = express.Router();

const codePaymentGenerator = new CodePaymentGenerator();
const expirationDateGenerator = new ExpirationDateGenerator();
const hashManager = new HashManager();
const idGenerator = new IdGenerator();
const randomStatusGenerator = new RandomStatusGenerator();

const boletoDatabase = new BoletoDatabase();
const buyerDatabase = new BuyerDatabase();
const clientDatabase = new ClientDatabase();
const creditCardDatabase = new CreditCardDatabase();
const creditCardHolderJunctionDatabase = new CreditCardHolderJunctionDatabase();
const holderDatabase = new HolderDatabase();
const purchaseDatabase = new PurchaseDatabase();

const userBusiness = new PurchaseBusiness(
    boletoDatabase,
    buyerDatabase,
    clientDatabase,
    creditCardDatabase,
    creditCardHolderJunctionDatabase,
    holderDatabase,
    purchaseDatabase,
    codePaymentGenerator,
    expirationDateGenerator,
    hashManager,
    idGenerator,
    randomStatusGenerator
);

const purchaseController = new PurchaseController(userBusiness);

purchaseRouter.get("/:id", (req,res) => purchaseController.findPaymentById(req,res));

purchaseRouter.post("/:clientId", (req,res) => purchaseController.createPayment(req,res));