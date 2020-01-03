import Chalk from "chalk";
import { LogTypes } from "./logTypes";
import { LoggerInterface } from "./loggerInterface";
import { injectable } from "inversify";

@injectable()
export class Logger implements LoggerInterface {
    public log(message: string, logType: LogTypes = LogTypes.Debug): void {
        let formattedMessage: string;
        switch (logType) {
            case LogTypes.Info:
                formattedMessage = Chalk.bgBlue(message);
                break;
            case LogTypes.Warning:
                formattedMessage = Chalk.bgMagenta(message);
                break;
            default:
                formattedMessage = Chalk.green(message);
                break;
        }

        console.log(`${logType.toString()}: ${formattedMessage}`);
    }

    public logError(error: string): void {
        console.error(`Error: ${Chalk.red(error)}`);
    }
}
