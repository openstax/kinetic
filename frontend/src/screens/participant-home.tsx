import { React, useEffect, useState, useNavigate, useMemo, cx } from '@common'
import { ParticipantStudies, ParticipantStudy } from '@api'
import { get } from 'lodash'
import {
    Box, Col, LoadingAnimation, Row, Footer, Icon, Logo,
    RewardsProgressBar, BannersBar,
} from '@components'
import envelopeIcon from '@iconify-icons/bi/envelope'
import { useApi, useEnvironment } from '@lib'
import {
    isStudyLaunchable, tagOfType, tagsOfType, TagLabels,
} from '@models'
import { Controls, applyControls, ControlState } from './studies/participant-controls'
import { StudyModal } from './studies/modal'


const Tag: React.FC<{ tag?: string }> = ({ tag }) => (
    tag ? <span className="badge bg-light text-dark border border-1">{get(TagLabels, tag, tag)}</span> : null
)


const StudyCard: React.FC<{ study: ParticipantStudy }> = ({ study }) => {
    const nav = useNavigate()
    const isEnabled = isStudyLaunchable(study)
    const onClick = () => {
        isEnabled && nav(`/study/details/${study.id}`)
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
                role={isEnabled ? 'link' : ''}
                onClick={onClick}
            >
                <Box className="card-body" direction="column">
                    <Box justify="between">
                        <h5 className="card-title">{study.title}</h5>
                        {study.completedAt && <Icon icon="checkCircle" css={{ flex: '0 0 25px' }} color="green" />}
                    </Box>
                    <p>{study.shortDescription}</p>
                    <Box flex />
                    <Box css={{ fontSize: '14px' }} justify="between" wrap>
                        <Box gap>
                            <Box align="center">
                                <Icon icon="clock" color="#005380" />
                                <div css={{ marginLeft: '0.5rem' }}>{study.durationMinutes} min</div>
                            </Box>
                            {study.participationPoints && <span>• {study.participationPoints}pts</span>}
                        </Box>
                        <Box gap>
                            <Tag tag={tagOfType(study, 'type')} />
                            {tagsOfType(study, 'subject').map(tag => <Tag key={tag} tag={tag} />)}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Col>
    )
}

const Studies: React.FC<{ isFiltering: boolean, studies: ParticipantStudy[] }> = ({ studies, isFiltering }) => {
    if (isFiltering && !studies.length) {
        return <h3 className="my-4">No studies match the selected filters.</h3>
    }
    if (!studies.length) {
        return <h3 className="my-4">No studies are currently available.</h3>
    }

    return (
        <>{studies.map((s, i) => <StudyCard key={`${i}.${s.id}`} study={s} />)}</>
    )
}

export default function ParticipantHome() {
    const api = useApi()
    const env = useEnvironment()

    const [mandatoryStudy, setMandatoryStudy] = useState<ParticipantStudy>()
    const [allStudies, setStudies] = useState<ParticipantStudies>()
    const [controlState, setControlState] = useState<ControlState>({})

    const fetchStudies = async () => {
        const studies = await api.getParticipantStudies()
        const mandatory = studies.data?.find(s => isStudyLaunchable(s) && s.isMandatory)
        if (mandatory) {
            setMandatoryStudy(mandatory)
        }
        setStudies(studies)
    }

    useEffect(() => { fetchStudies() }, [])


    const onMandatoryClose = () => {
        setMandatoryStudy(undefined)
        fetchStudies()
    }

    const studies = useMemo<ParticipantStudy[]>(() => {
        return applyControls(controlState, allStudies?.data || [])
    }, [allStudies?.data, controlState])

    if (!allStudies?.data) {
        return <LoadingAnimation message="Loading studies" />
    }


    return (
        <div className="studies">
            <nav className="navbar navbar-light">
                <div className="navbar-dark bg-dark py-1">
                    <div className="container">
                        <a href={env?.config.homepageUrl}>
                            <Logo height={45} />
                        </a>
                    </div>
                </div>
                <BannersBar />
            </nav>
            <RewardsProgressBar studies={allStudies?.data || []} />

            <div className="container studies my-8">
                <StudyModal study={mandatoryStudy} onHide={onMandatoryClose} />
                <Controls state={controlState} onChange={setControlState} />
                <Row>
                    <Studies studies={studies} isFiltering={!!controlState.subjects?.length} />
                </Row>
            </div>
            <Footer isBottom>
                <a className="text-decoration-none" href="https://openstax.org/privacy-policy">
                    Privacy Policy
                </a>
                <span>|</span>
                <p className="mb-0">
                    <b>Need help?</b>
                </p>
                <p className="mb-0">
                    Contact support
                </p>
                <a className="text-decoration-none" href="mailto:kinetic@openstax.org?subject=[Kinetic help]"><Icon icon={envelopeIcon} /> kinetic@openstax.org</a>
            </Footer>
        </div>
    )
}
