import ServerErrorHandler from "./server-error-handler";
import ProjectErrorException from "../../exception/project-error-exception";
import ServerErrorException from "../../exception/server-error-exception";
import SubmissionProject from "../../entities/submission-project/submission-project";
import PackageJson from "../../entities/submission-project/package-json";


describe('test server utils', () => {
    it('should return error when error log match port regex', function () {
        const logErrors = ["UnhandledPromiseRejectionWrning: Error: listen EADDRINUSE: address already in use 127.0.0.1:8000 at Server.setupListenHandle [as _listen2] (net.js:1320:16) at listenInCluster (net.js:1368:12) at GetAddrInfoReqWrap.doListen [as callback] (net.js:1505:7) at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:71:8) (Use `node --trace-warnings ...` to show where the warning was created) ,(node:444154) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1) (node:444154) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code."]
        const serverErrorHandling = createServerErrorHandling(logErrors)
        expect(()=> serverErrorHandling.throwError()).toThrow(new ProjectErrorException('PORT_NOT_MEET_REQUIREMENT'))
    });

    it('should return error when error log match command error regex', function () {
        const logErrors = ["sh: 1: nodemon: not found"]
        const serverErrorHandling = createServerErrorHandling(logErrors)

        expect(()=> serverErrorHandling.throwError()).toThrow(new ServerErrorException('COMMAND_NOT_FOUND'))
    });

    it('should return error when error log match module not found error regex', function () {
        const logErrors = [" internal/modules/cjs/loader.js:892 throw err; ^ Error: Cannot find module '/home/agis/Desktop/assistest/experiment-storage/project/1536730 erid_ade_putra_i1ru failed/index.js' at Function.Module._resolveFilename (internal/modules/cjs/loader.js:889:15) at Function.Module._load (internal/modules/cjs/loader.js:745:27) at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12) at internal/main/run_main_module.js:17:47 { code: 'MODULE_NOT_FOUND', requireStack: [] }"]
        const serverErrorHandling = createServerErrorHandling(logErrors)

        expect(()=> serverErrorHandling.throwError()).toThrow(new ServerErrorException('MODULE_NOT_FOUND'))
    });

    it('should return default error if no match regex pattern', function () {
        const logErrors = ["a log of error"]
        const serverErrorHandling = createServerErrorHandling(logErrors)

        expect(()=> serverErrorHandling.throwError()).toThrow(new ServerErrorException('SERVER_ERROR'))
    });


    const createServerErrorHandling = (logErrors: string[]) => {
        const submissionProject :SubmissionProject = {
            packageJsonPath: '',
            packageJsonContent: <PackageJson>{},
            runnerCommand: ''
        }
       return  new ServerErrorHandler(logErrors, submissionProject)
    }
})
