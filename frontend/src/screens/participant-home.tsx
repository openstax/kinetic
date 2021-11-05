import { React, useEffect, useState, useHistory, cx } from '@common'
import { ParticipantStudies, ParticipantStudy } from '@api'
import { Box, Col, LinkButton, LoadingAnimation, Row, Icon } from '@components'
import { useStudyApi } from '@lib'
import { isStudyLaunchable, StudyTypeLabels } from '@models'
import { StudyModal } from './studies/modal'

interface StudyBlockProps {
    type: keyof typeof StudyTypeLabels
    studies: ParticipantStudies
}

const StudyBlock:React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    const history = useHistory()
    const isEnabled = isStudyLaunchable(study)
    const onClick = () => {
        isEnabled && history.push(`/study/details/${study.id}`)
    }

    return (
        <Col key={study.id} sm={12} md={6} align="stretch" className="mb-2">
            <Box
                flex
                className={cx('card', { 'raise-on-hover': isEnabled })}
                css={{
                    opacity: isEnabled ? 1.0 : 0.7,
                }}
                aria-disabled={!isEnabled}
                data-study-id={study.id}
                role="link"
                onClick={onClick}
            >
                <Box className="card-body" direction="column">
                    <Box justify="between">
                        <h5 className="card-title">{study.title}</h5>
                        {study.completedAt && <Icon icon="checkCircle" css={{ flex: '0 0 25px' }} color="green" />}
                    </Box>
                    <p>{study.shortDescription}</p>
                    <Box flex />
                    <Box css={{ fontSize: '14px' }} justify="between">
                        <Box align="center">
                            <Icon icon="clock" color="#005380" />
                            <div css={{ marginLeft: '0.5rem' }}>{study.durationMinutes} min</div>
                        </Box>
                        {study.participationPoints && <div css={{ color: '#A3A3A3' }}>{study.participationPoints}pts</div>}
                    </Box>
                </Box>
            </Box>
        </Col>
    )
}

export default function ParticipantHome() {
    const api = useStudyApi()
    const [mandatoryStudy, setMandatoryStudy] = useState<ParticipantStudy>()
    const [studies, setStudies] = useState<ParticipantStudies>()
    useEffect(() => {
        api.getParticipantStudies().then((studies) => {
            const mandatory = studies.data?.find(s => isStudyLaunchable(s) && s.isMandatory)
            if (mandatory) {
                setMandatoryStudy(mandatory)
            }
            setStudies(studies)
        })
    }, [])

    if (!studies?.data) {
        return <LoadingAnimation message="Loading studies" />
    }

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container">
                    <LinkButton icon="back" secondary to="/">
                        Home
                    </LinkButton>
                </div>
            </nav>
            <StudyModal study={mandatoryStudy} onHide={() => setMandatoryStudy(undefined)} />
            <Row>
                {studies.data.map(s => <StudyBlock key={s.id} study={s} />)}
            </Row>
        </div>
    )
}
