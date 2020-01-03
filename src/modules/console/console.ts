import { inject, injectable } from "inversify";
import { ArgumentProcessorInterface } from "../argsProcessor/argumentProcessorInterface";
import { Types as ArgumentProcessorTypes } from "../argsProcessor/types";
import { CommandParams } from "../../models/CommandParams";
import { Types as ConsoleTypes } from "./types";
import { ConsoleWriterInterface } from "./consoleWriterInterface";
import { EventType } from "../argsProcessor/argumentProcessor";
import { LoggerInterface } from "../logger/loggerInterface";
import { Types as LoggerTypes } from "../logger/types";
import { Repository } from "../../models/Repository";
import { ServerInterface } from "../server/serverInterface";
import { Types as ServerTypes } from "../server/types";

@injectable()
export class Console {
    private readonly repoHeader: string = "ID | Repo Name | Owner | Is Private";
    private readonly logger: LoggerInterface;
    private readonly argumentProcessor: ArgumentProcessorInterface;
    private readonly server: ServerInterface;
    private readonly consoleWriter: ConsoleWriterInterface;

    public constructor(@inject(LoggerTypes.Logger) logger: LoggerInterface,
        @inject(ArgumentProcessorTypes.ArgumentProcessor) argumentProcessor: ArgumentProcessorInterface,
        @inject(ServerTypes.Server) server: ServerInterface,
        @inject(ConsoleTypes.ConsoleWriter) consoleWriter: ConsoleWriterInterface
    ) {
        this.logger = logger;
        this.argumentProcessor = argumentProcessor;
        this.server = server;
        this.consoleWriter = consoleWriter;
    }

    public async start(): Promise<void> {
        try {
            const params: CommandParams = this.argumentProcessor.getRequiredParams();
            for (const option of params.options) {
                switch (option) {
                    case EventType.displayList:
                        const displayListResponse = await this.server.getFullRepoList(params.username, params.password, params.url);
                        if (!displayListResponse.isError) {
                            this.writeRepoList(displayListResponse.content, "Full Repository List:", this.repoHeader);
                        }
                        break;

                    case EventType.displayPublicRepos:
                        const displayPublicReposResponse = await this.server.getPublicRepoList(params.username, params.password, params.url);
                        if (!displayPublicReposResponse.isError) {
                            this.writeRepoList(displayPublicReposResponse.content, "Public Repository List:", this.repoHeader);
                        }
                        break;

                    default:
                        break;
                }
            }
        } catch (error) {
            this.logger.logError(error);
        }
    }

    private writeRepoList(repoList: Repository[], title: string, header: string): void {
        this.consoleWriter.writeHeading(title);
        if (repoList.length > 0) {
            this.consoleWriter.write(`Repository Count: ${repoList.length}`);
            this.consoleWriter.writeHeading(header);
            repoList.forEach((repo: Repository) => {
                this.consoleWriter.write(`${repo.id} | ${repo.full_name} | ${repo.owner.login} | ${repo.private}`);
            });
        } else {
            this.consoleWriter.write("No repositories were found!");
        }
    }
}
