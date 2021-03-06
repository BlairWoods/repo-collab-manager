import { default as Chalk } from "chalk";
import { ConsoleWriterInterface } from "./consoleWriterInterface";
import { injectable } from "inversify";

@injectable()
export class ConsoleWriter implements ConsoleWriterInterface {
    public write(message: string): void {
        console.log(Chalk.grey(message));
    }

    public writeHeading(heading: string): void {
        console.log(Chalk.bgCyan(heading));
    }
}
