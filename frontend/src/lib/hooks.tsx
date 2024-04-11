import { useEffect, useMemo, useState } from '@common'
import { useLocation, useParams } from 'react-router-dom'
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

export const useParamId = (name: string, throwIfMissing = true) => {
    const id = useParams()[name]
    if (!id && throwIfMissing) throw new Error(`${name} is not found in URL parameters`);

    return Number(id);
}
