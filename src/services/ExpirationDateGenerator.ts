import moment from 'moment';

export class ExpirationDateGenerator {
    generate = ():string => {
        const actualDate:string = moment().format("YYYY-MM-DD");
        const splitActualDate: string[] = actualDate.split("-");

        const expireDate:string = splitActualDate[0] + "-" + 
            splitActualDate[1] + "-" + (Number(splitActualDate[2])+7).toString(); 

        return expireDate;
    };
};