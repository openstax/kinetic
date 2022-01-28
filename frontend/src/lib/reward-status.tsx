import { React, useEffect } from '@common'
import { ENV } from './env'
import { analytics } from './analytics'
import { useQueryParam, usePendingState } from './hooks'

export type RewardsState = 'unknown' | 'display' | 'hidden'

export const RewardsStateContext = React.createContext<RewardsState>('unknown')

export const RewardsStateProvider:React.FC = ({ children }) => {
    const forced = useQueryParam('points')
    const [currentState, setRewardsState] = React.useState<RewardsState>(
        forced ? (forced == 'true' ? 'display' : 'hidden') : 'unknown'
    )
    const isTimedOut = usePendingState(true, 1500)

    useEffect(() => {
        analytics.track('optimize.callback', {
            name: '<experiment_id>', // TODO: add id
            callback: (value: string) => {
                setRewardsState(value == '0' ? 'display' : 'hidden')
            },
        })
    }, [analytics, setRewardsState])

    useEffect(() => {
        if (!forced && isTimedOut) {
            setRewardsState('display')
        }
    }, [isTimedOut, forced])

    return (
        <RewardsStateContext.Provider value={currentState}>
            {children}
        </RewardsStateContext.Provider>
    )
}

export const useRewardsState = () => React.useContext(RewardsStateContext) as RewardsState

export const useRewardsVisibile = () => React.useContext(RewardsStateContext) === 'display'
