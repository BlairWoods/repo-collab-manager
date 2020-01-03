import { LogTypes } from "./logTypes";

export interface LoggerInterface {
    log(message: string, logType: LogTypes): void;
    logError(error: string): void;
}