import { useEffect, useCallback, useMemo, useState } from '@common'
import { useLocation } from 'react-router-dom'
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


// Returning a new object reference guarantees that a before-and-after
//   equivalence check will always be false, resulting in a re-render, even
//   when multiple calls to forceUpdate are batched.
export function useForceUpdate(): () => void {
    const [ , dispatch ] = useState<{}>(Object.create(null));

    // Turn dispatch(required_parameter) into dispatch().
    const memoizedDispatch = useCallback(
        (): void => {
            dispatch(Object.create(null));
        },
        [ dispatch ],
    );
    return memoizedDispatch;
}

export function useQueryParam<T = string>(param: string) {
    const { search } = useLocation();
    return useMemo(() => {
        const query = qs.parse(search.slice(1));
        return query[param] as any as T
    }, [search])
}
