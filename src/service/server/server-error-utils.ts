const getPortFromLogError = (log: string) => {
    const portErrorRegex = new RegExp(/Error: listen EADDRINUSE: address already in use.+?:(\d+)/g)
    const result = portErrorRegex.exec(log)
    if (result !== null) {
        return parseInt(result[1])
    }
    return null
}

export default getPortFromLogError

