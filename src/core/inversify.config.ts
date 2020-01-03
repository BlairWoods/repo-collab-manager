import { ArgumentProcessor } from "../modules/argsProcessor/argumentProcessor";
import { ArgumentProcessorInterface } from "../modules/argsProcessor/argumentProcessorInterface";
import { Types as ArgumentProcessorTypes } from "../modules/argsProcessor/types";
import { AxiosInstance } from "axios";
import { Types as ConsoleTypes } from "../modules/console/types";
import { ConsoleWriter } from "../modules/console/consoleWriter";
import { ConsoleWriterInterface } from "../modules/console/consoleWriterInterface";
import { Container } from "inversify";
import { Logger } from "../modules/logger/logger";
import { LoggerInterface } from "../modules/logger/loggerInterface";
import { Types as LoggerTypes } from "../modules/logger/types";
import { Server } from "../modules/server/server";
import { ServerInterface } from "../modules/server/serverInterface";
import { Types as ServerTypes } from "../modules/server/types";
import axios from "axios";

const container = new Container();
container.bind<LoggerInterface>(LoggerTypes.Logger).to(Logger);
container.bind<ArgumentProcessorInterface>(ArgumentProcessorTypes.ArgumentProcessor).to(ArgumentProcessor);
container.bind<ServerInterface>(ServerTypes.Server).to(Server);
container.bind<ConsoleWriterInterface>(ConsoleTypes.ConsoleWriter).to(ConsoleWriter);
container.bind<AxiosInstance>(ServerTypes.AxiosInstance).toDynamicValue(() => {
    return axios.create();
});

export { container };