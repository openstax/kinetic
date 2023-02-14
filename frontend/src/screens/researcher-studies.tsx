import { cx, React, styled, useEffect, useNavigate, useState } from '@common'
import { Studies, Study } from '@api'
import { Box, Button, Col, Icon, Row, TopNavBar } from '@components'
import { formatDate, useApi } from '@lib'
import { getStatus, getStatusName, StudyStatus } from '@models'
import { colors } from '../theme';

const StudyRow: React.FC<{ study: Study }> = ({ study }) => {
    const nav = useNavigate()
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
            <Col sm={1}><Icon icon="tripleDot" data-test-id="edit-study" onClick={() => nav(`/study/edit/${study.id}`)} /></Col>
        </Row>
    )
}

const StudiesTable: React.FC<{ studies: Study[] }> = ({ studies }) => {
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

const NavTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h4': {
        color: colors.grayText,
        fontWeight: 'bolder',
    },
    '.active > h4': {
        color: colors.purple,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.purple}`,
    },
})

export default function ResearcherStudies() {
    const api = useApi()
    const nav = useNavigate()
    const [studies, setStudies] = useState<Studies>()
    useEffect(() => {
        api.getStudies().then(setStudies)
    }, [])
    const [currentStatus, setCurrentStudies] = useState<StudyStatus>(StudyStatus.Launched)
    const setStatus = (ev: React.MouseEvent<HTMLAnchorElement>) => setCurrentStudies(ev.currentTarget.dataset.status! as any)
    const displayingStudies = (studies?.data || []).filter(s => !s.isHidden && getStatus(s) == currentStatus)

    return (
        <div className="studies">
            <TopNavBar />
            {/* TODO Notifications */}
            {/*<ActionNotification />*/}
            <div className="container-lg mt-8">
                <Box align="center" justify="between">
                    <h3>Studies</h3>
                    <Button
                        primary
                        data-test-id="add-study"
                        onClick={() => nav('/study/edit/new')}
                        className='fw-bold'
                    >
                        <Icon icon="plus" height={28}></Icon>
                        Create New Study
                    </Button>
                </Box>
                <NavTabs className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Launched" className={cx('nav-link', { active: currentStatus == StudyStatus.Launched })}>
                            <h4>Launched</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Draft" className={cx('nav-link', { active: currentStatus == StudyStatus.Draft })}>
                            <h4>Draft</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Completed" className={cx('nav-link', { active: currentStatus == StudyStatus.Completed })}>
                            <h4>Completed</h4>
                        </a>
                    </li>
                </NavTabs>
                <StudiesTable studies={displayingStudies} />
            </div>
        </div >
    )
}

const ActionNotification = () => {
    return (
        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
            <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <img src="..." className="rounded me-2" alt="..."/>
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>
        </div>
    )
}
