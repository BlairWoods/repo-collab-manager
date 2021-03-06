import { AxiosInstance, AxiosRequestConfig } from "axios";
import { inject, injectable } from "inversify";
import { LoggerInterface } from "../logger/loggerInterface";
import { Types as LoggerTypes } from "../logger/types";

import { Repository } from "../../models/Repository";
import { ServerInterface } from "./serverInterface";
import { ServerResponse } from "./serverResponse";
import { Types as ServerTypes } from "./types";

@injectable()
export class Server implements ServerInterface {
    private readonly logger: LoggerInterface;
    private readonly requestServer: AxiosInstance;

    public constructor(@inject(LoggerTypes.Logger) logger: LoggerInterface,
        @inject(ServerTypes.AxiosInstance) requestServer: AxiosInstance
    ) {
        this.logger = logger;
        this.requestServer = requestServer;
    }

    public async getFullRepoList(username: string, password: string, url: string): Promise<ServerResponse<Repository[]>> {
        const repoList = await this.getRepoList(username, password, url, (responseData: Repository[]) => {
            return responseData;
        });

        return repoList;
    }

    public async getPublicRepoList(username: string, password: string, url: string): Promise<ServerResponse<Repository[]>> {
        const repoList = await this.getRepoList(username, password, url, (responseData: Repository[]) => {
            return responseData.filter((repo: Repository) => {
                return !repo.private;
            });
        });

        return repoList;
    }

    private async getRepoList(username: string, password: string, url: string, filter: (responseData: Repository[]) => Repository[]): Promise<ServerResponse<Repository[]>> {
        try {
            const repoListResponse = await this.requestServer.get<Repository[]>("/user/repos", this.generateAxiosConfig(username, password, url));
            const data = filter(repoListResponse.data);
            return {
                isError: false,
                content: data.length > 0 ? data : []
            };
        } catch (error) {
            this.logger.logError(error.message);
            return {
                isError: true,
                content: []
            };
        }
    }

    private generateAxiosConfig(username: string, password: string, url: string): AxiosRequestConfig {
        return {
            baseURL: url,
            headers: {
                common: {
                    Authorization: this.buildAuthHeader(username, password),
                    Accept: "application/vnd.github.v3+json"
                }
            }
        };
    }

    private buildAuthHeader(username: string, password: string): string {
        const buffer = Buffer.from(`${username}:${password}`);
        return `Basic ${buffer.toString("base64")}`;
    }
}
