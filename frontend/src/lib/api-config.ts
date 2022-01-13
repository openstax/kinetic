import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, StudiesApi } from '../api'


export const API_CONFIGURATION = new Configuration({
    basePath: ENV.API_PATH,
    credentials: 'include',
})

export const useStudyApi = () => {
    const api = useMemo(() => {
        return new StudiesApi(API_CONFIGURATION)
    }, [])
    return api
}
