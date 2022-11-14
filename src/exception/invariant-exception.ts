export default class InvariantException extends Error{
    constructor(code: string, payload?) {
        super(code);
        this.message = code
    }

}