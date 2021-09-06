import { PAYMENT_STATUS } from "../../../src/models/Payment";

export class RandomStatusGeneratorMock {
    generate = (): PAYMENT_STATUS => {
        return PAYMENT_STATUS.CREATED;
    };
};