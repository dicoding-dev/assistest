import {getCommandFromLogError, getPortFromLogError} from "./server-error-utils";


describe('test server utils', () => {
    it('should return port 8000 when error log match port regex', function () {
        const errorLog = "UnhandledPromiseRejectionWarning: Error: listen EADDRINUSE: address already in use 127.0.0.1:8000 at Server.setupListenHandle [as _listen2] (net.js:1320:16) at listenInCluster (net.js:1368:12) at GetAddrInfoReqWrap.doListen [as callback] (net.js:1505:7) at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:71:8) (Use `node --trace-warnings ...` to show where the warning was created) ,(node:444154) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1) (node:444154) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code."
        const result = getPortFromLogError(errorLog)

        expect(result).toStrictEqual(8000)
    });

    it('should return null when error log not match port regex', function () {
        const errorLog = "a error"
        const result = getPortFromLogError(errorLog)

        expect(result).toStrictEqual(null)
    });

    it('should return nodemon when error log match command error regex', function () {
        const errorLog = "sh: 1: nodemon: not found"
        const result = getCommandFromLogError(errorLog)

        expect(result).toStrictEqual('nodemon')
    });

    it('should return null when error log not match command error regex', function () {
        const errorLog = "a error"
        const result = getCommandFromLogError(errorLog)

        expect(result).toStrictEqual(null)
    });
})
