import { useEffect, useState } from '../common'

export const useDelay = (delay = 300): boolean => {
    const [expired, setExpired] = useState(false)
    useEffect(() => {
        let id = setTimeout(() => setExpired(true), delay);
        return () => clearTimeout(id)
    }, [delay]);
    return expired
};
