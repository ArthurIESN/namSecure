import fs from 'fs';
import util from 'util';
import { fileURLToPath } from 'url';
import path from 'path';
import colors from 'colors';
import { WriteStream } from "node:fs";

enum LogType
{
    ERROR = "ERROR",
    WARNING = "WARNING",
    DEBUG = "DEBUG",
    INFO = "INFO"
}

const typeColorFn: Record<LogType, (str: string) => string> =
{
    ERROR: colors.red,
    WARNING: colors.yellow,
    DEBUG: colors.blue,
    INFO: colors.green,
};

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const rootFolder: string = path.resolve(__dirname, '../');

const logsDir: string = path.join(rootFolder, '../logs');
if (!fs.existsSync(logsDir))
{
    fs.mkdirSync(logsDir, { recursive: true });
}

const date: Date = new Date();
const formattedDate: string = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
const logFileName: string = `logs-${formattedDate}.txt`;
const logFile: WriteStream = fs.createWriteStream(path.join(logsDir, logFileName), { flags: 'a' });
const logStdout: NodeJS.WriteStream & { fd: 1 } = process.stdout;


function enhancedLog(type: LogType, ...args: any[]): void
{
    const isDev: boolean = process.env.NODE_ENV === 'development';

    if (!isDev && (type === "DEBUG" || type === "INFO"))
    {
        return; // Ignore DEBUG and INFO logs in production
    }

    const timestamp: string = new Date().toISOString();
    const formattedArgs: string = util.format(...args);

    const errorStack: string[] = new Error().stack?.split('\n') || [];
    let stackLine: string = "";

    for (let i: number  = 2; i < errorStack.length; i++)
    {
        const line: string = errorStack[i].trim();
        if (!line.includes(__filename))
        {
            stackLine = line;
            break;
        }
    }

    const match: RegExpMatchArray | null = stackLine?.match(/at (.+) \((.+):(\d+):(\d+)\)/) || stackLine?.match(/at (.+):(\d+):(\d+)/);

    let functionName: string = 'anonymous';
    let fileName: string = 'unknown';
    let line: string = 'unknown';

    if (match)
    {
        // Keep the full match which includes the path format like "function (path:line:col)"
        functionName = match[0] || 'anonymous';
        functionName = functionName.replace('at ', '').trim();

        // Modify it to use file:// protocol for clickability
        functionName = functionName.replace(/\(([^:]+):(\d+):(\d+)\)/, `(file://$1:$2:$3)`);

        fileName = path.basename(match[2]);
        line = match[3];
    }

    const coloredFilePath: string = fileName.green;
    const coloredFunctionName: string = functionName.yellow;
    const coloredLine: string = line.cyan;

    const coloredType: string = typeColorFn[type](type);

    const message: string = `[${timestamp}] [${coloredType}] [${coloredFilePath}:${coloredLine}][${coloredFunctionName}] ${formattedArgs}\n`;
    const fileMessage: string = `[${timestamp}] [${type}] [${fileName}:${functionName}:${line}] ${formattedArgs}\n`;
    logFile.write(fileMessage);
    logStdout.write(message);
}

console.log = (...args : any[]) => enhancedLog(LogType.INFO, ...args);
console.error = (...args : any[]) => enhancedLog(LogType.ERROR, ...args);
console.warn = (...args : any[]) => enhancedLog(LogType.WARNING, ...args);
console.debug = (...args : any[]) => enhancedLog(LogType.DEBUG, ...args);
console.info = (...args : any[]) => enhancedLog(LogType.INFO, ...args);

console.log(`Log file initialized: ${logFileName}`);