import commander from "commander";

export interface Params extends commander.Command {
    username?: string;
    password?: string;
    githubapi?: string;
    list?: boolean;
    public?: boolean;
}
