import { React, cx, useEffect, useState, useHistory } from '@common'
import { Studies, Study } from '@api'
import {
    Row, Col, Box, Icon, LogoutButton, Logo,
} from '@components'
import { useStudyApi, formatDate } from '@lib'
import { StudyStatus, getStatus, getStatusName, useEnv } from '@models'

const StudyRow:React.FC<{ study: Study }> = ({ study }) => {
    const history = useHistory()
    return (
        <Row
            css={{
                boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.06)',
                backgroundColor: 'white',
                marginBottom: '1.5rem',
            }}>
            <Col sm={7} className="py-1">
                <Box direction="column">
                    <div>
                        {study.titleForResearchers || study.titleForParticipants}
                    </div>
                    <Box gap wrap>
                        {study.tags?.map(t => <span key={t} className="badge bg-secondary rounded-pill">{t}</span>)}
                    </Box>
                </Box>
            </Col>
            <Col sm={2}>{formatDate(study.opensAt)}</Col>
            <Col sm={2}>{getStatusName(study)}</Col>
            <Col sm={1}><Icon icon="tripleDot" data-test-id="edit-study" onClick={() => history.push(`/study/edit/${study.id}`)}/></Col>
        </Row>
    )
}

const StudiesTable:React.FC<{ studies: Study[] }> = ({ studies }) => {
    if (!studies.length) return null

    return (
        <div
            data-test-id="studies-table"
            css={{
                '> div': {
                    minHeight: '4rem',
                    alignItems: 'center',
                },
            }}
        >
            <Row css={{ alignItems: 'flex-end' }}>
                <Col sm={7}>NAME</Col>
                <Col sm={2}>OPENED</Col>
                <Col sm={3}>STATUS</Col>
            </Row>
            {studies.map((study) => <StudyRow key={study.id} study={study} />)}
        </div>
    )
}


export default function ResearcherHome() {
    const api = useStudyApi()
    const history = useHistory()
    const env = useEnv()
    const [studies, setStudies] = useState<Studies>()
    useEffect(() => {
        api.getStudies().then(setStudies)
    }, [])
    const [currentStatus, setCurrentStudies] = useState<StudyStatus>(StudyStatus.Active)
    const setStatus = (ev: React.MouseEvent<HTMLAnchorElement>) => setCurrentStudies(ev.currentTarget.dataset.status! as any)
    const displayingStudies = (studies?.data || []).filter(s => getStatus(s) == currentStatus)

    return (
        <div className="container studies mt-8">
            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container d-flex  justify-content-between">
                    <a href={env?.config.homepageUrl}>
                        <Logo height={45} />
                    </a>
                    <LogoutButton />
                </div>
            </nav>
            <Box align="center" justify="between">
                <h1>Studies</h1>
                <Icon
                    height="1.5rem"
                    icon="plusCircle"
                    data-test-id="add-study"
                    onClick={() => history.push('/study/edit/new')}
                />
            </Box>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Active" className={cx('nav-link', { active: currentStatus == StudyStatus.Active })}>
                        Active
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Scheduled" className={cx('nav-link', { active: currentStatus == StudyStatus.Scheduled })}>
                        Scheduled
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Completed" className={cx('nav-link', { active: currentStatus == StudyStatus.Completed })}>
                        Completed
                    </a>
                </li>
            </ul>
            <StudiesTable studies={displayingStudies} />
        </div>
    )

}
