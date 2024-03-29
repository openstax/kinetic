import { Box, cx, React } from '@common'
import { Icon, Segment, segmentCircleStyle, SegmentedBar, Tooltip } from '@components'
import { RewardsSegment, useRewardsSchedule } from '@models'
import { toDayJS, useIsMobileDevice } from '@lib'
import { ParticipantStudy } from '@api'
import { colors } from '@theme'
import { CSSObject } from '@emotion/react'

interface RewardsProgressBarProps {
    studies: ParticipantStudy[]
}

const popOverStyle: CSSObject = {
    '.tooltip-inner': { width: '180px' },
}

const SegmentLabel: React.FC<{ segment: RewardsSegment }> = ({ segment }) => {
    return (
        <Box
            direction="column"
            justify='center'
            align='center'
            className="explanation" css={{
                fontSize: useIsMobileDevice() ? 11 : 12,
                color: segment.isCurrent ? 'black' : colors.gray70,
                textWrap: 'nowrap',
            }}>
            {segment.points == 0 ? <></> : <span>{segment.totalPoints}pts</span>}
            <span>{toDayJS(segment.endAt).format('DD MMM')}</span>
        </Box>
    )
}


const popOverMessage = (segment: RewardsSegment) => {
    if (segment.achieved) {
        return `🎉 ${segment.isPast ? 'You were' : 'You’ve been'} entered in a giveaway for a ${segment.prize}`
    } else {
        if (segment.isPast) {
            return `Missed it? No worries, more prizes ahead`
        } else {
            return `${segment.description}`
        }
    }
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


const GrandPrize: React.FC<{ segment?: RewardsSegment }> = ({ segment }) => {
    if (!segment) return null

    if (segment.isPast && !segment.achieved) {
        return <MissedGrandPrize />
    }

    return (
        <Box direction='column' align='center'>
            <Icon
                css={{ background: 'white', marginTop: -5 }}
                color={segment.achieved ? colors.purple : colors.gray50}
                icon={segment.isCurrent ? 'trophy' : 'trophyOutline'}
                height={25}
            />
            <SegmentLabel segment={segment} />
        </Box>
    )
}

const RewardSegment: React.FC<{
    segment: RewardsSegment,
    className?: string
}> = ({ segment, className }) => {

    if (segment.isFinal) {
        return (
            <Tooltip
                tooltip={popOverMessage(segment)}
                className={className}
                css={popOverStyle}
            >
                <GrandPrize segment={segment} />
            </Tooltip>
        )
    }

    return (
        <>
            <Tooltip
                className={cx({
                    past: segment.isPast,
                    future: segment.isFuture,
                    current: segment.isCurrent,
                    achieved: segment.achieved,
                }, className)}
                css={segmentCircleStyle}
                tooltip={popOverMessage(segment)}
            >
                <span />
            </Tooltip>
            <SegmentLabel segment={segment} />
        </>
    )
}

const SegmentInfo: React.FC<{ schedule: RewardsSegment[] }> = ({ schedule }) => {
    const segment = schedule.find(s => s.recentlyAchieved) || schedule.find(s => s.isCurrent)
    if (!segment) return null

    let msg;

    if (segment.recentlyAchieved) {
        msg = `🎉 Yay! You were entered into giveaway`
    } else {
        msg = `${segment.isFinal ? 'Grand ' : ''}Giveaway`
    }

    return (
        <Box gap>
            <span>{toDayJS(segment.endAt).format('LL')}</span>
            <span>{msg}:</span>
            <b css={{
                textTransform: 'capitalize',
            }}>{segment.prize}</b>
        </Box>
    )
}

const FINAL_STEP_WIDTH = 50

export const RewardsProgressBar: React.FC<RewardsProgressBarProps> = ({ studies }) => {
    const {
        schedule,
        pointsEarned,
        totalPoints,
    } = useRewardsSchedule(studies)
    const completion = (pointsEarned / totalPoints) * 100

    return (
        <nav className="navbar navbar-light py-1" css={{
            backgroundColor: 'white',
            boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
        }}>
            <div className="container-lg">

                <SegmentInfo schedule={schedule} />

                <Box align="start" padding={{ top: 'large' }} gap css={{
                    height: 60,
                    paddingRight: FINAL_STEP_WIDTH,
                }}>
                    <Box direction='column' margin={{ top: '-10px' }}>
                        <b>{pointsEarned} / {totalPoints} pts</b>
                    </Box>

                    <SegmentedBar completedPercentage={completion}>
                        {schedule.map((segment) => (
                            <Segment
                                key={segment.index}
                                margin={segment.isFinal ? { left: FINAL_STEP_WIDTH } : {}}
                                isFinal={segment.isFinal}
                                percentage={(segment.points / totalPoints) * 100}
                            >
                                <RewardSegment
                                    className={segment.isFinal ? 'rewardsPointGrand' : `rewardsPoint${segment.index + 1}`}
                                    key={segment.index}
                                    segment={segment}
                                />
                            </Segment>
                        ))}
                    </SegmentedBar>
                </Box>
            </div>
        </nav >
    )
}
