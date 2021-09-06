import { Client } from '../../models/Client';
import { BaseDatabase } from '../BaseDatabase';

export class ClientDatabase extends BaseDatabase {
    private static TABLE_NAME = "Client";

    findClientById = async (id: string): Promise<Client | undefined> => {

        const client = await BaseDatabase.connection(ClientDatabase.TABLE_NAME)
            .select()
            .where({ id: id });

        return client[0] && Client.toClientModel(client[0]);
    };
};