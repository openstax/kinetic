import { React, cx } from '@common'
import { Box, Popover, Icon } from '@components'
import {
    useRewardsSchedule,
    CalculatedRewardsScheduleSegment,
} from '@models'
import { formatDate, toDayJS } from '@lib'
import { ParticipantStudy } from '@api'
import { colors } from '../theme'
import trophyFilledIcon from '@iconify-icons/bi/trophy-fill'
import trophyOutlineIcon from '@iconify-icons/bi/trophy'
import { CSSObject } from '@emotion/react'

interface RewardsProgressBarProps {
    studies: ParticipantStudy[]
}

const barWidth = 7

const circleStyle: CSSObject = {
    height: '20px',
    width: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '.tooltip-inner': { width: '220px' },

    '&.achieved': {
        background: colors.purple,
        '&:before': {
            content: '"✓"',
            color: 'white',
            fontWeight: 'bold',
        },
    },

    '&.future': {
        background: colors.lightGray,
    },
    '&.current': {
        background: 'white',
        border: `3px solid ${colors.purple}`,
        '&.achieved': {
            background: 'white',
            '&:before': {
                color: colors.purple,
            },
        },
        '.explanation': {
            color: 'black',
        },
    },
    '&.past:not(.achieved)': {
        background: colors.lightGray,
        '&:before': {
            color: 'white',
            content: '"X"',
            fontWeight: 'bold',
        },
    },
}


const segmentWidth = 150

const segmentStyle: CSSObject = {
    position: 'absolute',
    width: segmentWidth,
    top: `-${barWidth}px`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',

}

const SegmentLabel: React.FC<{ segment: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    return (
        <div className="explanation" css={{
            fontSize: 12,
            color: segment.isCurrent ? 'black' : colors.darkGray,
        }}>
            {segment.points}pts by {toDayJS(segment.endAt).format('ll')}
        </div>
    )
}


const popOverMessage = (segment: CalculatedRewardsScheduleSegment) => {
    let popover = ''
    if (segment.achieved) {
        popover = `🎉 ${segment.isPast ? 'You were' : 'You’ve been'} entered in a giveaway for a ${segment.prize}`
    } else {
        if (segment.isPast) {
            popover = `Missed it ? No worries, more prizes ahead`
        } else {
            popover = `reach ${segment.totalPoints} points by ${formatDate(segment.endAt)} to be entered in an ${segment.prize} giveaway`
        }
    }
    return popover
}

const RewardSegment: React.FC<{
    segment: CalculatedRewardsScheduleSegment
    points: number
    totalPoints: number
}> = ({ segment, totalPoints }) => {

    return (
        <div
            css={{
                ...segmentStyle,
                left: `calc(${(segment.totalPoints / totalPoints) * 100}% - ${segmentWidth / 2}px)`,
            }}
        >
            <Popover
                displayType="tooltip"
                className={cx({
                    past: segment.isPast,
                    future: segment.isFuture,
                    current: segment.isCurrent,
                    achieved: segment.achieved,
                })}

                css={circleStyle}
                popover={popOverMessage(segment)}
            />
            <SegmentLabel segment={segment} />
        </div>
    )
}

const CurrentSegmentInfo: React.FC<{ segment?: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    if (!segment) return null
    let msg = ''
    let displayedSegment = segment // : CalculatedRewardsScheduleSegment | null = null
    //    ${ segment.previousSegment.prize }
    if (segment.justStarted && segment.previousSegment && segment.previousSegment.achieved) {
        msg = `🎉 Yay! You were entered into giveway`
        displayedSegment = segment.previousSegment
    } else {
        msg = `${segment.isFinal ? 'Grand ' : ''}Givaway`
    }

    return (
        <Box gap>
            <span>{toDayJS(segment.endAt).format('LL')}</span>
            <span>{msg}:</span>
            <b css={{
                textTransform: 'capitalize',
            }}>{displayedSegment.prize}</b>
        </Box>
    )
}

const GrandPrize: React.FC<{ segment?: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    if (!segment) return null

    return (
        <Box direction='column' align='center' margin={{ left: '-60px', top: '10px' }}>
            <Icon
                color={segment.achieved ? colors.purple : colors.lightGray}
                icon={segment.isCurrent ? trophyFilledIcon : trophyOutlineIcon}
                height={30}
                className="me-1"
            />
            <SegmentLabel segment={segment} />
        </Box>
    )
}
const FirstSegmentExplain: React.FC<{ segment?: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    if (!segment) return null
    return (
        <Box gap align='end' height='30px' css={{
            fontSize: 12,
            marginLeft: -50,
        }}>
            <span>
                Rewards start {toDayJS(segment.startAt).format('ll')}
            </span>
        </Box >
    )
}

export const RewardsProgressBar: React.FC<RewardsProgressBarProps> = ({ studies }) => {

    const {
        schedule,
        pointsEarned,
        totalPoints,
        finalDrawing,
    } = useRewardsSchedule(studies)
    const completion = (pointsEarned / totalPoints) * 100

    return (
        <nav className="navbar sticky-top navbar-light py-1" css={{
            backgroundColor: 'white',
            boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
        }}>
            <div className="container">

                <CurrentSegmentInfo segment={schedule.find(s => s.isCurrent)} />

                <Box align="center" gap css={{
                    height: 60,
                }}>
                    <Box direction='column'>
                        <b>{pointsEarned} / {totalPoints} pts</b>
                    </Box>
                    <div
                        css={{
                            height: `${barWidth}px`,
                            flex: 1,
                            borderRadius: '4px',
                            background: colors.lightGray,
                            position: 'relative',
                        }}
                    >
                        <div
                            data-test-id="progress-indicator"
                            data-percentage-complete={completion}
                            css={{
                                height: '100%',
                                width: `${completion}% `,
                                position: 'absolute',
                                borderRadius: '4px 0 0 4px',
                                background: colors.purple,
                            }}
                        />

                        <FirstSegmentExplain segment={schedule[0]} />


                        {schedule.map((segment) => (
                            <RewardSegment
                                totalPoints={totalPoints}
                                key={segment.index}
                                points={pointsEarned}
                                segment={segment}
                            />
                        ))}

                    </div>

                    <GrandPrize segment={finalDrawing} />

                    {finalDrawing?.infoUrl && (
                        <a
                            href={finalDrawing.infoUrl}
                            target="_blank"
                            className="fw-light"
                            css={{
                                maxWidth: '200px',
                                fontSize: '0.9rem',
                                color: colors.darkText,
                            }}
                        >
                            Find out more information about the giveaways
                        </a>
                    )}
                </Box>
            </div>
        </nav>
    )
}
