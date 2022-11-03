interface ResultTestFailure {
    name: string,
    tests: Array <TestFailure>
}

interface TestFailure{
    message: string,
    test: string
}
export default ResultTestFailure