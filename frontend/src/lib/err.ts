import { isFunction } from './util'
import { toSentence } from './string'

export const errorToString = async (err: any): Promise<string> => {
    if (!err) return ''
    if (isFunction(err.json)) {
        try {
            const apiErr = await err.json()
            if (apiErr.exception) {
                return `${apiErr.error}: ${apiErr.exception}`
            }
            if (apiErr.messages) {
                return `Error ${apiErr.status_code}: ${toSentence(apiErr.messages)}`
            }
        }
        catch {}
    }
    return String(err)
}
