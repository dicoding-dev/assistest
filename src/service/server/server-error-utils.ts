export const getPortFromLogError = (log: string) => {
    const portErrorRegex = new RegExp(/Error: listen EADDRINUSE: address already in use.+?:(\d+)/g)
    const result = portErrorRegex.exec(log)
    if (result !== null) {
        return parseInt(result[1])
    }
    return null
}

export const getCommandFromLogError = (log: string) => {
    const portErrorRegex = new RegExp(/sh: 1: (.+): not found/g)
    const result = portErrorRegex.exec(log)
    if (result !== null) {
        return result[1]
    }
    return null
}


