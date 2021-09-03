import { React, useEffect, useState, useHistory } from '@common'
import { ParticipantStudies, ParticipantStudy } from '@api'
import { Box, Col, LinkButton, LoadingAnimation, Row, Icon } from '@components'
import { useStudyApi } from '@lib'
import { isStudyLaunchable } from '@models'
import { StudyModal } from './modal'

export enum StudyTypes {
    research_study = 'Research Studies',
    cognitive_task = 'Cognitive Tasks',
    survey = 'Surveys',
}

interface StudyBlockProps {
    type: keyof typeof StudyTypes
    studies: ParticipantStudies
}

const StudyTypeBlock:React.FC<StudyBlockProps> = ({ type, studies: allStudies }) => {
    const history = useHistory()
    const studies = (allStudies.data || []).filter(st => st.category == type)
    if (!studies.length) { return null }

    return (
        <div>
            <h3>{StudyTypes[type]}</h3>
            <Row css={{ marginBottom: '3rem' }}>
                {studies.map(s => (
                    <Col key={s.id} sm={12} md={6} align="stretch" className="mb-2">
                        <Box
                            flex
                            className="card raise-on-hover"
                            css={{
                                opacity: s.completedAt ? 0.7 : 1.0,
                            }}
                            data-study-id={s.id}
                            onClick={() => history.push(`/study/details/${s.id}`)}
                        >
                            <Box className="card-body" direction="column">
                                <Box justify="between">
                                    <h5 className="card-title">{s.title}</h5>
                                    {s.completedAt && <Icon icon="checkCircle" css={{ flex: '0 0 25px' }} color="green" />}
                                </Box>
                                <p>{s.shortDescription}</p>
                                <Box flex />
                                <Box css={{ fontSize: '14px' }} justify="between">
                                    <Box align="center">
                                        <Icon icon="clock" color="#005380" />
                                        <div css={{ marginLeft: '0.5rem' }}>{s.durationMinutes} min</div>
                                    </Box>
                                    {s.participationPoints && <div css={{ color: '#A3A3A3' }}>{s.participationPoints}pts</div>}
                                </Box>
                            </Box>
                        </Box>
                    </Col>
                ))}

            </Row>
        </div>
    )
}


export const UserListing = () => {
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

    if (!studies) {
        return <LoadingAnimation message="Loading studies" />
    }

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container-fluid">
                    <LinkButton icon="back" secondary to="/">
                        Home
                    </LinkButton>
                </div>
            </nav>
            <StudyModal study={mandatoryStudy} />
            <div>
                <StudyTypeBlock studies={studies} type="research_study" />
                <StudyTypeBlock studies={studies} type="cognitive_task" />
                <StudyTypeBlock studies={studies} type="survey" />
            </div>
        </div>
    )
}
