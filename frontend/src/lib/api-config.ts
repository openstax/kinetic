import { useMemo } from 'react'
import { ENV } from './env'
import { Configuration, StudiesApi } from '../api'

console.log(ENV.API_ADDRESS)

export const useStudyApi = () => {

    const api = useMemo(() => {
        const configuration = new Configuration({
            basePath: ENV.API_ADDRESS + ENV.API_PATH,
            credentials: 'include',
        })
        return new StudiesApi( configuration )
    }, [])

    return api
}
