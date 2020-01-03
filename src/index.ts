import "reflect-metadata";

import { Console } from "./modules/console/console";
import { LoggerInterface } from "./modules/logger/loggerInterface";
import { Types as LoggerTypes } from "./modules/logger/types";
import { container } from "./core/inversify.config";

if (require.main === module) {
    const console = container.resolve<Console>(Console);
    console.start().catch((error: Error) => {
        const logger = container.get<LoggerInterface>(LoggerTypes.Logger);
        logger.logError(error.message);
    });
}
