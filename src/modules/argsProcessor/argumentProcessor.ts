import { inject, injectable } from "inversify";
import { CommandParams } from "../../models/CommandParams";
import { LogTypes } from "../logger/logTypes";
import { LoggerInterface } from "../../modules/logger/loggerInterface";
import { Types as LoggerTypes } from "../../modules/logger/types";
import { Params } from "../../models/Params";
import commander from "commander";

export enum EventType {
    displayList,
    displayPublicRepos,
    unknown
}

@injectable()
export class ArgumentProcessor {

    private readonly logger: LoggerInterface;

    public constructor(@inject(LoggerTypes.Logger) logger: LoggerInterface) {
        this.logger = logger;
    }

    public getRequiredParams(): CommandParams {

        if (process.argv.length === 0) {
            this.logger.logError("No params passed or incorrect params passed!");
            throw "No params passed!";
        }

        try {
            const program = new commander.Command();
            program
                .option("-u, --username <string>", "Username")
                .option("-p, --password <string>", "Password")
                .option("-e, --githubapi <string>", "The GitHub Api URL.", "https://api.github.com")
                .option("-l --list", "Provides a list of repositories.")
                .option("-i --public", "Provides a list of public repositories.");

            const params: Params = program.parse(process.argv);
            if (params.githubapi === undefined || params.username === undefined || params.password === undefined) {
                this.logger.logError("Incorrect params passed!");
                throw "Incorrect params passed!";
            }

            this.logger.log(`Username: ${params.username}`, LogTypes.Debug);
            this.logger.log(`Password: ${this.maskParam(params.username)}`, LogTypes.Debug);
            this.logger.log(`Url: ${params.githubapi}`, LogTypes.Debug);

            return this.mapParams(params);

        } catch (error) {
            this.logger.logError(`There was a problem passing params: ${error}`);
            throw error;
        }
    }

    private maskParam(param: string | undefined): string {
        if (param === undefined) {
            return "";
        }

        let maskedParam = "";
        param.split("").forEach(() => {
            maskedParam += "*";
        });

        return maskedParam;
    }

    private mapParams(params: Params): CommandParams {
        return {
            username: params.username as string,
            password: params.password as string,
            url: params.githubapi as string,
            options: this.determineOption(params),
        };

    }

    private determineOption(params: Params): EventType[] {
        const eventTypes: EventType[] = [];

        if (params.list != undefined && params.list) {
            eventTypes.push(EventType.displayList);
        }

        if (params.public != undefined && params.public) {
            eventTypes.push(EventType.displayPublicRepos);
        }

        return eventTypes;
    }
}
