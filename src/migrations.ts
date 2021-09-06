import { BaseDatabase } from "./data/BaseDatabase";
import client from './clients.json';

const printError = (error: any) => { console.log(error.sqlMessage || error.message) };

class Migrations extends BaseDatabase {
    public static createTables = async (): Promise<void> => {
        await BaseDatabase.connection.raw(`
        CREATE TABLE IF NOT EXISTS Boleto (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            code VARCHAR(60) NOT NULL UNIQUE,
            expirationDate DATE NOT NULL
        );
            
        CREATE TABLE IF NOT EXISTS Buyer (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            cpf VARCHAR(11) NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS Client (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS Payment (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            amount FLOAT NOT NULL,
            method ENUM("BOLETO", "CREDIT_CARD") NOT NULL,
            status ENUM("CREATED", "IN_ANALYSIS", "AUTHORIZED", "CANCELLED", "SETTLED") DEFAULT "CREATED",
            buyerId VARCHAR(255) NOT NULL,
            clientId VARCHAR(255) NOT NULL,
            FOREIGN KEY (buyerId) REFERENCES Buyer(id),
            FOREIGN KEY (clientId) REFERENCES Client(id)
        );
        
        CREATE TABLE IF NOT EXISTS Holder (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            birthDate DATE NOT NULL,
            documentNumber VARCHAR(9) NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS CreditCard (
            id VARCHAR(255) PRIMARY KEY NOT NULL,
            holderName VARCHAR(255) NOT NULL UNIQUE,
            brand ENUM("AMERICAN_EXPRESS", "ELO", "HIPERCARD", "MASTERCARD", "VISA") NOT NULL,
            cardNumber VARCHAR(255) NOT NULL UNIQUE,
            expirationDate DATE NOT NULL,
            cvv VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS Holder_CreditCard_junction (
            holderId VARCHAR(255) NOT NULL,
            creditCardId VARCHAR(255) NOT NULL UNIQUE,
            FOREIGN KEY Holder_CreditCard_junction(holderId) REFERENCES Holder(id),
            FOREIGN KEY Holder_CreditCard_junction(creditCardId) REFERENCES CreditCard(id)
        );
            `)
            .then(() => console.log("Tables created successfully!"))
            .catch(printError);
    };

    public static insertClient = async (data: any): Promise<void> => {
        await BaseDatabase.connection("Client")
            .insert(client)
            .then(() => console.log(`Clients created successfully!`))
            .catch(printError);
    };

    public static closeConnection(): Promise<void> {
        return BaseDatabase.connection.destroy();
    }
};

const up = async () => {
    try {
        await Migrations.createTables();

        await Migrations.insertClient(client);

    } catch (error: any) {
        throw new Error(error.sqlMessage);
    } finally {
        Migrations.closeConnection();
    }
};

up().then(res => console.log("Ending migrations!")).catch(error => console.log(error));