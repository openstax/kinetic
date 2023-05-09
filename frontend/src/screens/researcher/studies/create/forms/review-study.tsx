import { EditingStudy, getStudyLead, getStudyPi, getStudyStatus } from '@models';
import { Box, React, useNavigate, useState } from '@common';
import { colors } from '@theme';
import { StudyCardPreview, Tag } from '../../../../learner/card';
import { StudyStep } from '../edit-study';
import { Button, Col, Icon, Modal, useFormContext } from '@components';
import { useToggle } from 'rooks';
import Waiting from '@images/study-creation/waiting.svg'
import { StageStatusEnum, Study } from '@api';
import { Toast } from '@nathanstitt/sundry/ui';
import { useApi } from '@lib';

export const ReviewStudy: FC<{study: EditingStudy}> = ({ study }) => {

    if (getStudyStatus(study) === StageStatusEnum.WaitingPeriod) {
    // if (true) {
        // disable buttons
        return <WaitingForTemplate study={study} />
    }


    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='large' direction='column'>
                <h3 className='fw-bold'>Review your study</h3>
                <p>You're almost done! Make sure to review your study, and check on any last details before submitting it to the Kinetic team</p>
            </Box>

            <StudyInformation study={study} />

        </Box>
    )
}

const StudyInformation: FC<{study: EditingStudy, viewOnly?: boolean}> = ({ study, viewOnly = false }) => {
    const { setValue } = useFormContext()
    const setStep = (step: StudyStep) => {
        setValue('step', step, { shouldValidate: true })
    }
    const pi = getStudyPi(study);
    const lead = getStudyLead(study);

    return (
        <Box gap='xxlarge'>
            <Col sm={5} direction='column' gap='large'>
                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Internal Details</h6>
                        {!viewOnly && <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.InternalDetails)}>
                            Edit
                        </Button>}
                    </Col>
                    <Col sm={8} direction='column'>
                        <small>Title: {study.titleForResearchers}</small>
                        <small>Description: {study.internalDescription}</small>
                        <div><Tag tag={study.studyType} /></div>
                    </Col>
                </Box>

                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Research Team</h6>
                        {!viewOnly && <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.ResearchTeam)}>
                            Edit
                        </Button>}
                    </Col>
                    <Col sm={8} direction='column'>
                        <small>IRB-FY2022-19</small>
                        <small>Rice University</small>
                        {pi && <small>Study PI: {pi.firstName} {pi.lastName}</small>}
                        {lead && <small>Study Lead: {lead.firstName} {lead.lastName}</small>}
                    </Col>
                </Box>

                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Participant View</h6>
                        {!viewOnly && <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.ParticipantView)}>
                            Edit
                        </Button>}
                    </Col>
                    <Col sm={8} direction='column'>
                        <small>Interact with the study card on the right-hand side to review how participants view your study</small>
                    </Col>
                </Box>

                <svg css={{ strokeWidth: 2, height: 40 }}>
                    <line x1="0" y1="30" x2="500" y2="30" strokeDasharray={10} stroke={colors.grayText} />
                </svg>

                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Additional Session (optional)</h6>

                        {!viewOnly && <Button
                            className={!study.stages?.length ? 'btn-researcher-primary' : 'btn-researcher-secondary'}
                            onClick={() => setStep(StudyStep.AdditionalSessions)}
                        >
                            {!study.stages?.length ? 'Start' : 'Edit'}
                        </Button>}
                    </Col>
                    <Col sm={8} direction='column'>
                        {!study.stages?.length &&
                            <small>Turn your single session study into a longitudinal study by adding retention measures</small>
                        }
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
            </Col>

            <StudyCardPreview study={study} />
        </Box>
    )
}

const WaitingForTemplate: FC<{study: EditingStudy}> = ({ study }) => {
    return (
        <Box direction='column' gap='xxlarge' className='mt-6'>
            <Box direction='column' align='center' className='text-center' width='500px' gap='large' alignSelf='center'>
                <img src={Waiting} alt='waiting' height={200}/>
                <h5 className='fw-bold'>Waiting for Qualtrics template</h5>
                <h6 className='lh-lg' css={{ color: colors.grayerText }}>
                    Our team is working hard to create a Qualtrics template for you. Come back and continue when you finish your Qualtrics survey.
                </h6>
            </Box>
            <StudyOverview study={study} />
        </Box>
    )
}

const TemplateReady: FC<{study: EditingStudy}> = ({ study }) => {
    return (
        <Box>

        </Box>
    )
}

export const StudyOverview: FC<{study: EditingStudy}> = ({ study }) => {
    const [expanded, toggleExpanded] = useToggle()

    return (
        <Box css={{ backgroundColor: colors.pageBackground }} className='p-2' direction='column'>
            <Box justify='between'>
                <Box direction='column' gap>
                    <h5>Study overview</h5>
                    <small css={{ color: colors.grayText }}>
                        Expand this section to see a high-level overview of your study
                    </small>
                </Box>

                <Button link onClick={toggleExpanded}>
                    {expanded ? 'Collapse' : 'Expand'}
                    <Icon icon={expanded ? 'chevronUp' : 'chevronDown'}/>
                </Button>
            </Box>

            {expanded &&
                <div className='py-2'>
                    <StudyInformation study={study} viewOnly/>
                </div>
            }

        </Box>
    )
}

export const SubmitStudyModal: FC<{
    study: EditingStudy,
    show: boolean,
    setShow: (show: boolean) => void
}> = ({ study, show, setShow }) => {
    const api = useApi()
    const { getValues } = useFormContext()
    const [submitted, setSubmitted] = useState(false)
    if (submitted) {
        return <SubmitSuccess show={submitted} setShow={setSubmitted} />
    }

    const submitStudy = () => {
        const study: Study = getValues() as Study
        study.stages = study.stages?.map(stage => {
            return {
                ...stage,
                status: StageStatusEnum.WaitingPeriod,
            }
        })
        console.log(study);
        // api.submitStudy()
    }

    return (
        <Modal
            center
            show={show}
            large
            onHide={() => setShow(false)}
        >
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='xlarge'>
                    <Box align='center' className='text-center' direction='column'>
                        <span>You’re about to submit your study to the Kinetic team so that the appropriate permissions are set. Please review and confirm any final changes. You won’t be able to change your Kinetic study information past this point. Are you ready to proceed?</span>
                    </Box>
                    <Box gap='large'>
                        <Button className='btn-researcher-secondary' onClick={() => setShow(false)}>
                            Not yet, edit study
                        </Button>
                        <Button className='btn-researcher-primary' onClick={() => {
                            submitStudy()
                            setSubmitted(true)
                            setShow(false)
                        }}>
                            Yes, submit study
                        </Button>
                    </Box>
                </Box>
            </Modal.Body>
        </Modal>
    )
}

const SubmitSuccess: FC<{
    show: boolean,
    setShow: (show: boolean) => void
}> = ({ show, setShow }) => {
    const nav = useNavigate()
    return (
        <Modal
            center
            show={show}
            large
            onHide={() => setShow(false)}
        >
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='xlarge'>
                    <Box align='center' className='text-center' direction='column'>
                        <span>Our team is creating a Qualtrics template and setting up the correct permissions for your study. You will receive an email from owlsurveys@rice.edu containing an access code to your Qualtrics template and further instructions via your registered email within the next business day.</span>
                        <br/>
                        <span>Follow the instructions to build your task and come back here to proceed with finalizing your study and launching it on Kinetic.</span>
                    </Box>

                    <Button className='btn-researcher-primary' onClick={() => {
                        nav('/studies')
                    }}>
                        Return to Studies Dashboard
                    </Button>
                </Box>
            </Modal.Body>
        </Modal>
    )
}
