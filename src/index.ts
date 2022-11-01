import * as fs from 'fs'
import * as path from "path";
import ServerStarter from "./service/server/server-starter";
import SubmissionProject from "./domain/sever/object/submissionProject";

async function main() {
    for (const projectPath of fs.readdirSync('./experiment-storage')) {
        const absoluteProjectPath = path.resolve(`./experiment-storage/${projectPath}`)
        let server: SubmissionProject
        let serverStarter: ServerStarter
        try {
            server = new SubmissionProject(
                absoluteProjectPath,
                'localhost',
                5000,
                'start',
            );
            serverStarter = new ServerStarter()

            console.log(`${projectPath} starting...`)
            await serverStarter.run(server)

        } catch (e) {
            console.log(e)
            console.log(`Error in ${projectPath}: ${e.message}`)
        }

        await serverStarter.stop()


        console.log()
    }
}

main().then(()=>{
    console.log('success')
    process.exit()
})