import { useApi } from '@lib';
import { useQuery } from 'react-query';

export const useFetchResearchers = () => {
    const api = useApi()
    return useQuery('fetchResearchers', () => {
        return api.getResearchers().then(res => res.data || [])
    })
}
