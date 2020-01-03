import { CommandParams } from "../../models/CommandParams";

export interface ArgumentProcessorInterface {
    getRequiredParams(): CommandParams;
}