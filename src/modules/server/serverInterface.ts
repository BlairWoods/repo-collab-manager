import { Repository } from "../../models/Repository";
import { ServerResponse } from "./serverResponse";

export interface ServerInterface {
    getFullRepoList(username: string, password: string, url: string): Promise<ServerResponse<Repository[]>>;
    getPublicRepoList(username: string, password: string, url: string): Promise<ServerResponse<Repository[]>>;
}