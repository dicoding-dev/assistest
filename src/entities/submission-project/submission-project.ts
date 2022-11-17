import PackageJson from "./package-json";

export default interface SubmissionProject {
    packageJsonContent: PackageJson,
    packageJsonPath: string
}