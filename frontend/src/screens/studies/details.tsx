import { React, useEffect, useParams, useState } from '@common'
import {
    LoadingAnimation, Row, Col, LinkButton, Button, Box,
} from '@components'
import { LaunchStudy } from '@models'
import { ParticipantStudy } from '@api'
import { titleize, useStudyApi } from '@lib'
import dayjs from 'dayjs'


const LaunchStudyButton: React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    const api = useStudyApi()
    if (study.completedAt) {
        return (
            <b>Completed on {dayjs(study.completedAt).format('LL')}</b>
        )
    }
    return (
        <Button primary onClick={() => LaunchStudy(api, study)}>
            Begin study
        </Button>
    )
}


export const StudyDetails:React.FC = () => {
    const api = useStudyApi()

    const [ study, setStudy ] = useState<ParticipantStudy|null>()
    const id = useParams<{ id: string }>().id

    useEffect(() => {
        api.getParticipantStudy({ id: Number(id) }).then((s) => {
            setStudy(s)
        })

    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study" />
    }

    const category = titleize(study.category)
    const researcher = (study.researchers || [])[0] || {}

    return (
        <div className="studies mt-6">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container-fluid d-flex justify-content-between">
                    <LinkButton icon="back" data-test-id="back-to-studies" secondary to="/studies">
                        Studies
                    </LinkButton>
                    <LaunchStudyButton study={study} />
                </div>
            </nav>
            <div className="border-bottom bg-white py-2">
                <div className="container">
                    <Box justify="between" align="end">
                        <Box direction="column">
                            <p css={{
                                fontSize: 24,
                            }}>{category}</p>
                            <h3>{study.title}</h3>
                        </Box>
                        <Box align="center" gap justify="end" css={{ minWidth: 240 }}>
                            <h3 css={{ margin: 0, minWidth: 100 }}>{study.durationMinutes} min</h3>
                            <LaunchStudyButton study={study}/>
                        </Box>
                    </Box>
                </div>
            </div>
            <div className="container mt-4 d-flex flex-row">
                <Row css={{ width: '100%' }}>
                    <Col md={8} sm={8} direction="column">
                        <h5>{category} details</h5>
                        <p>{study.longDescription}</p>
                        {study.closesAt && (
                            <Box gap direction="column">
                                <h5>Close Date</h5>
                                <span>{dayjs(study.closesAt).format('LL')}</span>
                            </Box>
                        )}
                    </Col>

                    <Col sm={4} direction="column">
                        <h5>
                            About the researcher
                        </h5>
                        <b>
                            {researcher.name}
                        </b>
                        <b className="text-black-50 mt-1">
                            {researcher.institution}
                        </b>
                        <p className="mt-2">
                            {researcher.bio}
                        </p>
                    </Col>
                </Row>
            </div>
        </div>
    )

}
