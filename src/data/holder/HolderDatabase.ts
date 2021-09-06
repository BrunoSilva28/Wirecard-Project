import { CustomError } from "../../error/CustomError";
import { Holder } from "../../models/Holder";
import { BaseDatabase } from "../BaseDatabase";


export class HolderDatabase extends BaseDatabase {
    private static TABLE_NAME = "Holder";

    findHolderByDocumentNumber = async(holderRegister: string):Promise<Holder | undefined> => {
        const holder = await BaseDatabase.connection(HolderDatabase.TABLE_NAME)
            .select()
            .where({ documentNumber: holderRegister });
        
        if(holder.length < 1){
            return undefined;
        }
        return new Holder(holder[0].id, holder[0].name, holder[0].birthDate, holder[0].documentNumber);
    };

    createHolder = async (newHolder: Holder): Promise<void> => {
        try {
            await BaseDatabase.connection(HolderDatabase.TABLE_NAME)
                .insert({
                    id: newHolder.getId(),
                    name: newHolder.getName(),
                    birthDate: newHolder.getBirthDate(),
                    documentNumber: newHolder.getDocumentNumber()
                });

        } catch (error: any) {
            throw new CustomError(400, error.sqlMessage);
        };
    };
};