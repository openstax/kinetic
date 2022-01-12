import { React } from '@common'
import { Box, Popover, Icon } from '@components'
import {
    useRewardsSchedule,
    CalculatedRewardsScheduleSegment,
} from '@models'
import { ParticipantStudy } from '@api'
import { colors } from '../theme'
import trophyFilledIcon from '@iconify-icons/bi/trophy-fill'
import trophyOutlineIcon from '@iconify-icons/bi/trophy'

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
        isCompleted,
        finalDrawing,
    } = useRewardsSchedule(studies)

    return (
        <nav className="navbar navbar-light py-1" css={{
            backgroundColor: 'white',
            boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
        }}>
            <div className="container">
                <div>
                    <span className="fs-6 fw-light">{finalDrawing?.prize} Giveaway: </span>
                    <b>{points} / {totalPoints} pts({Math.round((points/totalPoints)*100)}%)</b>
                </div>
                <Box align="center" >

                    <div
                        css={{
                            height: `${barWidth}px`,
                            flex: 1,

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
                    <Icon
                        color={isCompleted ? colors.purple : colors.lightGray}
                        icon={isCompleted ? trophyFilledIcon : trophyOutlineIcon}
                        height="30px"
                        className="ms-3 me-1"
                    />
                    {finalDrawing?.prize && (
                        <a href="https://openstax.org/kinetic" css={{ maxWidth: '200px' }}>
                            Find out more information about the {finalDrawing.prize} drawing
                        </a>
                    )}
                </Box>
            </div>
        </nav>
    )
}