import { React, useEffect, useParams, useState } from '@common'
import {
    LoadingAnimation, Row, Col, LinkButton, Button, Box, Icon,
} from '@components'
import { LaunchStudy, studyTypeName, studyIsMultipart } from '@models'
import { ParticipantStudy, ParticipantStudyStage } from '@api'
import { useStudyApi } from '@lib'
import dayjs from 'dayjs'


const LaunchStudyButton: React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    const api = useStudyApi()
    const [isBusy, setBusy] = useState(false)

    if (study.stages && !study.stages.find(s => s.isLaunchable)) {
        return null
    }

    const onLaunch = async () => {
        setBusy(true)
        await LaunchStudy(api, study)
        setBusy(false)
    }
    if (study.completedAt) {
        return (
            <b>Completed on {dayjs(study.completedAt).format('LL')}</b>
        )
    }

    const action = (study.stages?.length && !study.stages[0].isCompleted) ?'Begin' : 'Continue'
    return (
        <Button
            busy={isBusy}
            busyMessage="Launching Study…"
            primary
            data-test-id="launch-study"
            onClick={onLaunch}
        >
            {action} study
        </Button>
    )
}

const PartTitle:React.FC<{ index: number, days?: number }> = ({ index, days }) => {
    if (index == 0) {
        return <span>Part # {index+1} will be worked first</span>
    }
    return (
        <span>
            Part # {index+1} will become available {
                days ? `${Math.round(days)} days` : 'immediatly'
            } after the previous part is completed
        </span>
    )
}

const StudyPart:React.FC<{ stage: ParticipantStudyStage, index: number }> = ({ index, stage }) => {
    return (
        <div className="card mb-2" css={{ opacity: stage.isCompleted ? 0.6 : 1.0 }}>
            <div className="card-header">
                <Box justify="between" align="center">
                    <PartTitle index={index} days={stage.availableAfterDays} />
                    {stage.isCompleted && <Icon icon="checkCircle" css={{ flex: '0 0 25px' }} color="green" />}
                </Box>
            </div>
            <div className="card-body">
                <h5 className="card-title">{stage.title}</h5>
                <p className="card-text">{stage.description}</p>
            </div>
        </div>
    )
}

const StudyMultiPartInfo:React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    return (
        <div>
            <h3 className="mb-2">This study has multiple parts</h3>
            {(study.stages || []).map((stage, i) => <StudyPart key={stage.order} index={i} stage={stage} />)}
        </div>
    )
}


export default function StudyDetails() {
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

    const researcher = (study.researchers || [])[0] || {}

    return (
        <div className="studies mt-6">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container d-flex justify-content-between">
                    <LinkButton icon="back" data-test-id="back-to-studies" secondary to="/studies">
                        Studies
                    </LinkButton>
                </div>
            </nav>
            <div className="border-bottom bg-white py-2">
                <div className="container">
                    <Box justify="between" align="start" direction="row" gap>
                        <Box flex><h3>{study.title}</h3></Box>
                        <Box align="center" gap justify="end" alignSelf="end">
                            <h3 css={{ margin: 0, minWidth: 100 }}>{study.durationMinutes} min</h3>
                            <LaunchStudyButton study={study}/>
                        </Box>
                    </Box>
                </div>
            </div>
            <div className="container mt-4 d-flex flex-row">
                <Row css={{ width: '100%' }}>
                    <Col md={8} sm={8} direction="column">
                        {studyIsMultipart(study) && <StudyMultiPartInfo study={study} />}
                        <h5>{studyTypeName(study)} details</h5>
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
