import { useEffect, useState } from '../common'

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
