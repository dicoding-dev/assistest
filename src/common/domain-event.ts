import * as events from "events";
import * as fs from "fs";
import * as util from "util";
import {createWriteStream, existsSync, mkdirSync} from "fs";

const logFolderPath = `./logs`
const logFilePath= `${(new Date()).toISOString().split('T')[0]}.log`

if (!existsSync(logFolderPath)){
    mkdirSync(logFolderPath)
}

const logFile = createWriteStream(`${logFolderPath}/${logFilePath}`, {flags : 'a'});

const eventEmitter = new events.EventEmitter();

const raiseDomainEvent = (...args: string[]) => eventEmitter.emit('domain', args);
export default raiseDomainEvent

eventEmitter.on('domain', (...args)=>{
    const parameters = args.join(', ');
    const log = (new Date().toISOString() + ": " + parameters)
    logFile.write(util.format(log) + '\n');
});
