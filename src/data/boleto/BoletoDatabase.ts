import { CustomError } from "../../error/CustomError";
import { Boleto } from "../../models/Boleto";
import { BaseDatabase } from "../BaseDatabase";


export class BoletoDatabase extends BaseDatabase {
    private static TABLE_NAME = "Boleto";

    createBoleto = async(newBoleto: Boleto):Promise<void> => {
        try {
            await BaseDatabase.connection(BoletoDatabase.TABLE_NAME)
                .insert({
                    id: newBoleto.getId(),
                    code: newBoleto.getCode(),
                    expirationDate: newBoleto.getExpirationDate()
                });

        } catch (error: any) {
            throw new CustomError(400, error.sqlMessage);
        };
    };
};