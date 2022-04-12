import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, DefaultApi } from '@api'


export const API_CONFIGURATION = new Configuration({
    basePath: ENV.API_PATH,
    credentials: 'include',
})

export const useApi = () => {
    const api = useMemo(() => {
        return new DefaultApi(API_CONFIGURATION)
    }, [])
    return api
}
