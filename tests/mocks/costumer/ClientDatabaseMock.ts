import { Client } from '../../../src/models/Client';
import { ClientMockSuccess } from './ClientMock';

export class ClientDatabaseMock {

    public findClientById = async (id: string): Promise<Client | undefined> => {

        switch (id) {
            case "client_id":
                return ClientMockSuccess;
            default:
                return undefined;
        };
    };
};