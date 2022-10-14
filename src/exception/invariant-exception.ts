export default class InvariantException extends Error{
    constructor(message) {
        super(message);
        this.message = message
    }

}