export class CodePaymentGenerator {
    generate = () => {
        let codePayment: string = "";
        
        for ( let i=0; i < 8; i++) {
            if(i % 2 === 0) {
                codePayment = codePayment + Math.floor(Math.random() * 100000000000).toString() + ".";
            } else if(i % 2 === 1 && i === 3) {
                codePayment = codePayment + Math.floor(Math.random() * 1000).toString() + ".";
            } else if(i % 2 === 1 && i === 7) {
                codePayment = codePayment + Math.floor(Math.random() * 10).toString();
            } else {
                codePayment = codePayment + Math.floor(Math.random() * 10).toString() + ".";
            };
        };

        return codePayment;
    };
};