import { Holder } from "../../models/Holder";

export interface HolderRepository {
    findHolderByDocumentNumber(holderRegister: string): Promise<Holder | undefined>,
    createHolder(newHolder: Holder): Promise<void>
};