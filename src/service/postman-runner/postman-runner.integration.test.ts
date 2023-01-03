import PostmanRunner from "./postman-runner";
import ServerService from "../server/server-service";
import * as collection from '../../../test/postman/postman_collection.json'
import * as environment from '../../../test/postman/postman_environment.json'
import SubmissionProjectFactory from "../../factories/submission-project/submission-project-factory";

describe('postman runner test', () => {

    let containerService: ServerService

    afterEach(async () => {
        await containerService.stop()
    })


    it('should return [] when no error found', async function () {
        await runContainer('./test/student-project/passed-project')

        const postmanRunner = new PostmanRunner(collection, environment)
        const failResult = await postmanRunner.run()

        expect(failResult).toStrictEqual([])

    });
    it('should return array object when test have error', async function () {
        await runContainer('./test/student-project/error-project')

        const postmanRunner = new PostmanRunner(collection, environment)
        const failResult = await postmanRunner.run()

        expect(failResult).toStrictEqual(
            [
                {
                    name: "Get Root",
                    tests: [
                        {
                            message: "expected response to have status code 200 but got 404",
                            test: "status code should be 200",
                        },
                        {
                            message: "Unexpected token 'H' at 1:1\nHello World\n^",
                            test: "response body should be an object",
                        },
                    ],
                },
                {
                    name: "Not Found",
                    tests: [{
                        message: "expected response to have status code 404 but got 200",
                        test: "status code should be 200"
                    }],
                },
            ]
        )
    });

    async function runContainer(submissionPath: string) {
        const submissionProjectFactory = new SubmissionProjectFactory()
        containerService = new ServerService()
        await containerService.run(submissionProjectFactory.create(submissionPath))
    }
})