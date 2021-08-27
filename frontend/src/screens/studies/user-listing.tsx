import { React, useEffect, useState } from '@common'
import { ParticipantStudies } from '@api'
import { Box, Col, LinkButton, LoadingAnimation, Row, Icon } from '@components'
import { useStudyApi } from '@lib'
import { LaunchStudy } from '@models'


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
    const api = useStudyApi()
    const studies = (allStudies.data || []).filter(st => st.category == type)
    if (!studies.length) { return null }


    return (
        <div>
            <h3>{StudyTypes[type]}</h3>
            <Row>
                {studies.map(s => (
                    <Col key={s.id} sm={12} md={6} align="stretch">
                        <Box
                            flex
                            className="card raise-on-hover"
                            onClick={() => LaunchStudy(api, s)}
                        >
                            <Box className="card-body" direction="column">
                                <h5 className="card-title">{s.title}</h5>
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
    const [studies, setStudies] = useState<ParticipantStudies>()
    useEffect(() => {
        api.getParticipantStudies().then((studies) => {
            const mandatory = studies.data?.find(s => s.isMandatory)
            if (mandatory) {
                LaunchStudy(api, mandatory)
            } else {
                setStudies(studies)
            }
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
            <div>
                <StudyTypeBlock studies={studies} type="research_study" />
                <StudyTypeBlock studies={studies} type="cognitive_task" />
                <StudyTypeBlock studies={studies} type="survey" />
            </div>
        </div>
    )
}
