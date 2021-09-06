import { Holder } from '../../../src/models/Holder';

export const HolderMockSuccess = new Holder(
    "holder_id",
    "HOLDER",
    "01/06/2000",
    "123456789"
);

export const HolderInputDTOMockSuccess = {
    name: "HOLDER",
    birthDate: "01/06/2000",
    documentNumber: "123456789"
};