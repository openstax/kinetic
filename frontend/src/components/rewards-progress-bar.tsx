import { React } from '@common'
import { Box, Popover, Icon } from '@components'
import {
    useRewardsSchedule,
    CalculatedRewardsScheduleSegment,
} from '@models'
import { ParticipantStudy } from '@api'
import { colors } from '../theme'
import trophyIcon from '@iconify-icons/bi/trophy'


interface RewardsProgressBarProps {
    studies: ParticipantStudy[]
}

const barWidth = 7

const RewardSegmentCircle: React.FC<{
    segment: CalculatedRewardsScheduleSegment
    points: number
    totalPoints: number
}> = ({ segment, points, totalPoints }) => {
    const achieved = points > segment.totalPoints
    let popover = ''
    if (achieved) {
        popover = `You’ve been entered in a giveaway for an ${segment.prize}`
    } else {
        popover = `reach ${segment.totalPoints} points to be entered in an ${segment.prize} giveaway`
    }
    return (
        <Popover
            displayType="tooltip"
            style={{ left: `${(segment.totalPoints / totalPoints) * 100}%` }}
            css={{
                height: '20px',
                width: '20px',
                position: 'absolute',
                top: `-${barWidth}px`,
                borderRadius: '10px',
                background: achieved ? colors.purple : colors.lightGray,
                '.tooltip-inner': { width: '220px' },
            }}
            popover={popover}
        />
    )
}

export const RewardsProgressBar:React.FC<RewardsProgressBarProps> = ({ studies }) => {

    const {
        schedule,
        points,
        totalPoints,
    } = useRewardsSchedule(studies)

    /* const schedule = env?.config.rewardsSchedule || []
     * sortBy(schedule, 'startAt')
     * let ttlPoints = 0
     * schedule.forEach(s => {
     *     ttlPoints = s.totalPoints = s.points + ttlPoints
     * })
     * const points = useMemo(() => rewardPointsEarned(studies), [studies])
     * const totalPoints = useMemo(
     *     () => schedule.reduce((pts, seg) => pts + seg.points, 0),
     *     [schedule],
     * )
     * if (!env) return null */

    return (
        <nav className="navbar navbar-light" css={{
        }}>
            <div className="container">
                <Box height="40px" align="center" >

                    <div
                        css={{
                            height: `${barWidth}px`,
                            flex: 1,
                            marginRight: `${barWidth * 4}px`,
                            background: colors.lightGray,
                            position: 'relative',
                        }}
                    >
                        <div css={{
                            height: '100%',
                            width: `${(points / totalPoints) * 100}%`,
                            position: 'absolute',
                            background: colors.purple,
                        }} />
                        {schedule.map((segment) => (
                            <RewardSegmentCircle
                                totalPoints={totalPoints}
                                key={segment.index}
                                points={points}
                                segment={segment}
                            />
                        ))}
                    </div>
                    <Icon icon={trophyIcon} height="30px" color={colors.lightGray} />
                </Box>
            </div>
        </nav>

    )
}
