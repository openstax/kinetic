import { useMemo } from 'react'

import { Configuration, StudiesApi } from '../api'


export const useStudyApi = () => {

    const api = useMemo(() => {
        const configuration = new Configuration({
            credentials: 'include',
        })
        return new StudiesApi( configuration )
    }, [])

    return api
}
