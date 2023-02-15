import * as events from "events";

const eventEmitter = new events.EventEmitter();

const raiseDomainEvent = (...args: string[]) => eventEmitter.emit('domain', args);
export default raiseDomainEvent

eventEmitter.on('domain', (...args)=>{
    const parameters = args.join(', ');
    console.log(new Date().toISOString(), parameters)
});
