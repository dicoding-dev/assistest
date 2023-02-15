import * as newman from 'newman';
import ResultTestFailure from "./failure-test";
import raiseDomainEvent from "../../common/domain-event";

class PostmanRunner {
    private readonly collection: string;
    private readonly environment: string;

    constructor(collection, environment) {
        this.collection = collection;
        this.environment = environment;
    }

    async run(): Promise<Array<ResultTestFailure>> {
        const runningNewman = newman.run({
            collection: this.collection,
            environment: this.environment,
        })

        const failureTest = await new Promise((resolve) => {
            runningNewman.on('done', (_, summary) => resolve(summary.run.failures));
        })

        raiseDomainEvent('postman testing completed')
        return this.groupResult(failureTest)
    }

    private async groupResult(summaryTest): Promise<Array<ResultTestFailure>> {
        return summaryTest.reduce((previousValue, currentValue) => {
            const requestName = currentValue.source.name
            const parentGroup = previousValue.find(value => value.name == requestName)
            const testResult = {test: currentValue.error.test, message: currentValue.error.message}
            if (!parentGroup) {
                previousValue.push({
                    name: requestName,
                    tests: [testResult]
                })
            } else {
                parentGroup.tests.push(testResult)
            }
            return previousValue
        }, [])
    }

}

export default PostmanRunner
