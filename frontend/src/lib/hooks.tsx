import { React, useEffect, useMemo, useState } from '@common'
import { useLocation, useParams } from 'react-router-dom'
import { LoadingAnimation } from '@components'
import qs from 'qs'

export const usePendingState = (isEnabled = true, delay = 150) => {
    const [isPending, setPending] = useState<boolean>(false)
    useEffect(() => {
        if (isEnabled) {
            const timer = setTimeout(() => {
                setPending(true)
            }, delay)
            return () => {
                clearTimeout(timer)
            }
        } else {
            setPending(false)
        }
    }, [isEnabled, delay])
    return isPending
};

export function useQueryParam<T = string>(param: string) {
    const { search } = useLocation();
    return useMemo(() => {
        const query = qs.parse(search.slice(1));
        return query[param] as any as T
    }, [search])
}

interface FetcherArgs<T> {
    fetch(): Promise<T[]>
    addRecord(): Promise<T>
}

export function useFetchState<T>({ fetch, addRecord }: FetcherArgs<T>) {
    const [records, setRecords] = useState<T[]>([])
    const [isBusy, setBusy] = useState(true)

    const fetchRecords = () => {
        setBusy(true)
        setRecords([])
        fetch().then((records) => {
            setRecords(records)
            setBusy(false)
        }).catch(() => {
            setBusy(false)
        })
    }
    useEffect(fetchRecords, [])

    const addNewRecord = async () => {
        setBusy(true)
        const rec = await addRecord()
        setRecords([rec, ...records])
        setBusy(false)
    }

    return {
        busy: isBusy ? <LoadingAnimation /> : null,
        fetchRecords,
        records,
        addNewRecord,
    }
}

export const useParamId = (name: string, throwIfMissing = true) => {
    const id = useParams()[name]
    if (!id && throwIfMissing) throw new Error(`${name} is not found in URL parameters`);

    return Number(id);
}
