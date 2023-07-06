import { Box, React, useEffect, useNavigate, useParams } from '@common';
import { Study } from '@api';
import { Col, CollapsibleSection, ExitButton, LoadingAnimation, Page, ResearcherButton } from '@components';
import { getStudyLead, getStudyPi, isReadyForLaunch, isWaiting, useFetchStudy } from '@models';
import { StudyCardPreview, Tag } from '../../../learner/card';
import { colors } from '@theme';
import { FinalizeStudy } from './finalize-study';
import Waiting from '@images/study-creation/waiting.svg'
import { EditSubmittedStudy } from './edit-submitted-study';

export default function StudyOverview() {
    const nav = useNavigate()
    const id = useParams<{ id: string }>().id

    if (!id) {
        useEffect(() => {
            nav('/studies')
        }, [])
        return <></>
    }

    const { loading, study } = useFetchStudy(id)

    if (loading) {
        return <LoadingAnimation />
    }

    if (!study) {
        useEffect(() => {
            nav('/studies')
        }, [])
        return <></>
    }


    return (
        <Page hideFooter backgroundColor={colors.white}>
            <StudyOverviewContent study={study} />
        </Page>
    )
}

const StudyOverviewContent: FC<{study: Study}> = ({ study }) => {
    if (isWaiting(study)) {
        return <WaitingForTemplate study={study} />
    }

    if (isReadyForLaunch(study)) {
        return (
            <FinalizeStudy study={study} />
        )
    }

    return (
        <Box direction='column' gap='xxlarge'>
            <Box align='center' justify='between'>
                <h3>{study?.titleForResearchers}</h3>
                <ExitButton navTo='/studies'/>
            </Box>

            <StudyInformation study={study} />

            <CollapsibleSection title='Edit Study' description='Make changes to open and close criteria' open={false}>
                <EditSubmittedStudy study={study} />
            </CollapsibleSection>

            <AnalysisSection study={study} />
        </Box>
    )
}

const AnalysisSection: FC <{study: Study}> = ({ study }) => {
    const nav = useNavigate()

    return (
        <Box className='p-2' align='center' justify='between' css={{ border: `1px solid ${colors.lightGray}` }}>
            <Box direction='column' gap>
                <h5>Analyze Data</h5>
                <small css={{ color: colors.grayText }}>
                    Write your R code to analyze the data relevant for this study
                </small>
            </Box>

            <ResearcherButton onClick={() => nav(`/analysis/edit/new?studyId=${study.id}`)}>
                + Create New Analysis
            </ResearcherButton>
        </Box>
    )
}

export const StudyInformation: FC<{ study: Study }> = ({ study }) => {
    const pi = getStudyPi(study);
    const lead = getStudyLead(study);

    return (
        <CollapsibleSection title='Study Overview' description='Expand this section to see a high-level overview of your study'>
            <Box gap='xxlarge'>
                <Col sm={5} direction='column' gap='large'>
                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Internal Details</h6>
                        </Col>
                        <Col sm={8} direction='column'>
                            <ul>
                                <li>
                                    <small css={{ color: colors.grayerText }}>
                                        Study Title: <span css={{ color: colors.grayText }}>{study.titleForResearchers}</span>
                                    </small>
                                </li>
                                <li>
                                    <small css={{ color: colors.grayerText }}>
                                        Description: <span css={{ color: colors.grayText }}>{study.internalDescription}</span>
                                    </small>
                                </li>
                                <li>
                                    <small css={{ color: colors.grayerText }}>
                                        Tag: <span css={{ color: colors.grayText }}><Tag tag={study.category} /></span>
                                    </small>
                                </li>
                            </ul>
                        </Col>
                    </Box>

                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Research Team</h6>
                        </Col>
                        <Col sm={8} direction='column'>
                            <ul>
                                <li>
                                    <small css={{ color: colors.grayerText }}>
                                        IRB: <span css={{ color: colors.grayText }}>IRB-FY2022-19</span>
                                    </small>
                                </li>
                                <li>
                                    <small css={{ color: colors.grayerText }}>
                                        University: <span css={{ color: colors.grayText }}>Rice University</span>
                                    </small>
                                </li>
                                {pi && <li>
                                    <small css={{ color: colors.grayerText }}>
                                        Study PI: <span css={{ color: colors.grayText }}>{pi.firstName} {pi.lastName}</span>
                                    </small>
                                </li>}
                                {lead && <li>
                                    <small css={{ color: colors.grayerText }}>
                                        Study Lead: <span css={{ color: colors.grayText }}>{lead.firstName} {lead.lastName}</span>
                                    </small>
                                </li>}
                            </ul>
                        </Col>
                    </Box>

                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Participant View</h6>
                        </Col>
                        <Col sm={8} direction='column'>
                            <small>Interact with the study card on the right-hand side to review how participants view your study</small>
                        </Col>
                    </Box>

                    <AdditionalSessionsInformation study={study} />
                </Col>

                <StudyCardPreview study={study} />
            </Box>
        </CollapsibleSection>
    )
}

const AdditionalSessionsInformation: FC<{ study: Study}> = ({ study }) => {
    if (!study.stages || study.stages.length < 2) {
        return null
    }

    return (
        <Box direction='column' gap='large'>
            <svg css={{ strokeWidth: 2, height: 40 }}>
                <line x1="0" y1="30" x2="500" y2="30" strokeDasharray={10} stroke={colors.grayText} />
            </svg>

            <Box justify='between' direction='column'>
                <h6 className='fw-bold'>Additional Sessions (optional)</h6>

                <Col sm={8} direction='column'>
                    {study.stages?.map((stage, index) => {
                        if (index === 0) return null
                        return (
                            <small key={stage.order}>
                                Session {index + 1}: {stage.durationMinutes} minutes, {stage.points} points
                            </small>
                        )
                    })}
                </Col>
            </Box>
        </Box>
    )
}

const WaitingForTemplate: FC<{study: Study}> = ({ study }) => {
    return (
        <Box direction='column' gap='xxlarge'>
            <Box align='center' justify='between'>
                <h3>{study?.titleForResearchers}</h3>
                <ExitButton navTo='/studies'/>
            </Box>
            <Box direction='column' align='center' className='text-center' gap='large' alignSelf='center'>
                <img src={Waiting} alt='waiting' height={200}/>
                <h5 className='fw-bold'>Almost there! We’re setting up the right permissions</h5>
                <h6 className='lh-lg' css={{ color: colors.grayerText }}>
                    Our team is creating a Qualtrics template and setting up the correct permissions for your study. You will receive an email from owlsurveys@rice.edu containing an access code to your Qualtrics template and further instructions via your registered email within the next business day.
                </h6>
                <h6 className='lh-lg' css={{ color: colors.grayerText }}>
                    Follow the instructions to build your task and come back here to proceed with finalizing your study and launching it on Kinetic.
                </h6>
            </Box>
            <StudyInformation study={study} />
        </Box>
    )
}
