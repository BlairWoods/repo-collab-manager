import { EventType } from "../modules/argsProcessor/argumentProcessor";

export interface CommandParams {
    username: string;
    password: string;
    url: string;
    options: EventType[];
}
