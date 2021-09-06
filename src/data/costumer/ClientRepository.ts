import { Client } from "../../models/Client";

export interface ClientRepository {
    findClientById (id: string): Promise<Client | undefined>
};