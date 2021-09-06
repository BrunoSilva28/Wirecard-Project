import { Boleto } from "../../models/Boleto";

export interface BoletoRepository {
    createBoleto(newBoleto: Boleto): Promise<void>
};