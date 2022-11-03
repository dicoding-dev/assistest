interface PackageJson {
    scripts?: object
    dependencies?: Dependencies
    devDependencies?: Dependencies
}

interface Dependencies{
    eslint?: string
}

export default PackageJson