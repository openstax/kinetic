import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, StudiesApi } from '../api'


export const ApiConfiguration = new Configuration({
    basePath: ENV.API_PATH,
    credentials: 'include',
})

export const useStudyApi = () => {
    const api = useMemo(() => {
        return new StudiesApi( ApiConfiguration )
    }, [])
    return api
}
