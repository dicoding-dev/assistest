import * as newman from 'newman';

class PostmanRunner {
    private readonly collection: string;
    private readonly environment: string;

    constructor(collection, environment) {
        this.collection = collection;
        this.environment = environment;
    }

    async run() {
        const runningNewman = newman.run({
            collection: this.collection,
            environment: this.environment,
        })

        const failureTest = await new Promise((resolve) => {
            runningNewman.on('done', (_, summary) => resolve(summary.run.failures));
        })


        return this.groupResult(failureTest)
    }

    private async groupResult(summaryTest) {
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