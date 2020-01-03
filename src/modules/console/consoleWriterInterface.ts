export interface ConsoleWriterInterface {
    write(message: string): void;
    writeHeading(heading: string): void;
}