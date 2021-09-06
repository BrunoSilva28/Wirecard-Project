import { PAYMENT_STATUS } from "../models/Payment";

export class RandomStatusGenerator {
    generate = (): PAYMENT_STATUS => {
        const randomNumberFromZeroToNine: number = Math.floor(Math.random() * 10);

        if (randomNumberFromZeroToNine > 7) {
            return PAYMENT_STATUS.AUTHORIZED;
        } else if (randomNumberFromZeroToNine > 5) {
            return PAYMENT_STATUS.CANCELLED;
        } else if (randomNumberFromZeroToNine > 3) {
            return PAYMENT_STATUS.CREATED;
        } else if (randomNumberFromZeroToNine > 1) {
            return PAYMENT_STATUS.IN_ANALYSIS;
        } else {
            return PAYMENT_STATUS.SETTLED;
        };
    };
};