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
            color: colors.darkGray,
            content: '"✕"',
            fontWeight: 'bold',
        },
    },
}


const segmentWidth = 50

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
        <Box
            direction="column"
            justify='center'
            className="explanation" css={{
                fontSize: 12,
                color: segment.isCurrent ? 'black' : colors.darkGray,
            }}>
            <span>{segment.totalPoints}pts</span>
            <span>{toDayJS(segment.endAt).format('DD MMM')}</span>
        </Box>
    )
}


const popOverMessage = (segment: CalculatedRewardsScheduleSegment) => {
    let popover = ''
    if (segment.achieved) {
        popover = `🎉 ${segment.isPast ? 'You were' : 'You’ve been'} entered in a giveaway for a ${segment.prize}`
    } else {
        if (segment.isPast) {
            popover = `Missed it? No worries, more prizes ahead`
        } else {
            popover = `Reach ${segment.totalPoints} points by ${formatDate(segment.endAt, 'll')} to be entered in an ${segment.prize} giveaway`
        }
    }
    return popover
}


const MissedGrandPrize = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width={38}
        height={33}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M36.417 4.125h-6.861V1.547C29.556.709 28.83 0 27.972 0H10.028c-.924 0-1.584.709-1.584 1.547v2.578h-6.86C.66 4.125 0 4.834 0 5.672v3.61c0 2.32 1.451 4.704 4.024 6.509 2.111 1.482 4.618 2.385 7.257 2.707 2.111 3.352 4.552 4.705 4.552 4.705v4.64h-3.166c-2.375 0-4.223 1.354-4.223 3.61v.774c0 .45.33.773.792.773h19.528c.396 0 .792-.322.792-.773v-.774c0-2.256-1.914-3.61-4.223-3.61h-3.166v-4.64s2.375-1.353 4.486-4.705c2.639-.322 5.146-1.225 7.257-2.707 2.573-1.805 4.09-4.19 4.09-6.51v-3.61c0-.837-.726-1.546-1.583-1.546ZM6.53 12.44c-1.65-1.096-2.309-2.385-2.309-3.159V8.25h4.222c.066 2.127.396 3.996.858 5.607-1.055-.386-1.98-.837-2.77-1.417ZM33.778 9.28c0 1.096-1.188 2.385-2.375 3.159-.792.58-1.715 1.03-2.771 1.417.462-1.61.792-3.48.858-5.607h4.288v1.031Z"
            fill="#DBDBDB"
        />
        <path
            d="M12 8.5 13.5 0h10l-5 7.5 5 6-3.5 5 1.5 7-3 7v-6l-2-7 1-6-5.5-5Z"
            fill="#848484"
        />
    </svg>
)


const GrandPrize: React.FC<{ segment?: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    if (!segment) return null

    if (segment.isPast && !segment.achieved) {
        return <MissedGrandPrize css={{ margin: '-10px 0 10px 50px' }} />
    }

    return (
        <Box direction='column' align='center'>
            <Icon
                css={{ background: 'white', marginTop: -5 }}
                color={segment.achieved ? colors.purple : colors.lightGray}
                icon={segment.isCurrent ? trophyFilledIcon : trophyOutlineIcon}
                height={30}
            />
            <SegmentLabel segment={segment} />
        </Box>
    )
}

const RewardSegment: React.FC<{
    segment: CalculatedRewardsScheduleSegment
    segmentCount: number,
}> = ({ segment, segmentCount }) => {

    let body: React.ReactNode
    if (segment.isFinal) {
        body = (
            <Popover
                popover={popOverMessage(segment)}
                displayType="tooltip"
            >
                <GrandPrize segment={segment} />
            </Popover>
        )
    } else {
        body = (
            <>
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
            </>
        )
    }

    return (
        <div
            css={{
                ...segmentStyle,
                left: `calc(${(100 / segmentCount) * (segment.index + 1)}% - ${segmentWidth / 2}px)`,
            }}
        >
            {body}
        </div>
    )
}

const CurrentSegmentInfo: React.FC<{ segment?: CalculatedRewardsScheduleSegment }> = ({ segment }) => {
    if (!segment) return null
    let msg = ''
    let displayedSegment = segment // : CalculatedRewardsScheduleSegment | null = null

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

export const RewardsProgressBar: React.FC<RewardsProgressBarProps> = ({ studies }) => {
    const {
        schedule,
        pointsEarned,
        totalPoints,

    } = useRewardsSchedule(studies)
    const completion = (pointsEarned / totalPoints) * 100

    return (
        <nav className="navbar sticky-top navbar-light py-1" css={{
            backgroundColor: 'white',
            boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
        }}>
            <div className="container">

                <CurrentSegmentInfo segment={schedule.find(s => s.isCurrent)} />

                <Box align="start" padding={{ top: 'large' }} gap css={{
                    height: 60,
                }}>
                    <Box direction='column' margin={{ top: '-10px' }}>
                        <b>{pointsEarned} / {totalPoints} pts</b>
                    </Box>
                    <div
                        css={{
                            height: `${barWidth}px`,
                            flex: 1,
                            borderRadius: '4px',
                            background: colors.lightGray,
                            position: 'relative',
                            marginRight: '20px',
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

                        {schedule.map((segment) => (
                            <RewardSegment
                                segmentCount={schedule.length}
                                key={segment.index}
                                segment={segment}
                            />
                        ))}
                    </div>
                </Box>
            </div>
        </nav>
    )
}
