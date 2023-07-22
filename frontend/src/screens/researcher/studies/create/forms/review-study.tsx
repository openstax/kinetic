import { getStudyLead, getStudyPi } from '@models';
import { Box, React, useNavigate, useState } from '@common';
import { colors } from '@theme';
import { StudyCardPreview, Tag } from '../../../../learner/card';
import { StudyStep } from '../edit-study';
import { Col, Modal, ResearcherButton, useFormContext } from '@components';
import { Study } from '@api';
import { useApi } from '@lib';

export const ReviewStudy: FC<{ study: Study }> = ({ study }) => {
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='large' direction='column'>
                <h3 className='fw-bold'>Review your study</h3>
                <p>You're almost done! Make sure to review your study, and check on any last details before submitting
                    it to the Kinetic team</p>
            </Box>

            <EditingStudyInformation study={study}/>
        </Box>
    )
}

const EditingStudyInformation: FC<{ study: Study }> = ({ study }) => {
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
                        <ResearcherButton buttonType='secondary' onClick={() => setStep(StudyStep.InternalDetails)}>
                            Edit
                        </ResearcherButton>
                    </Col>
                    <Col sm={8} direction='column'>
                        <ul>
                            <li>
                                <small css={{ color: colors.text }}>
                                    Study Title: <span css={{ color: colors.text }}>{study.titleForResearchers}</span>
                                </small>
                            </li>
                            <li>
                                <small css={{ color: colors.text }}>
                                    Description: <span css={{ color: colors.text }}>{study.internalDescription}</span>
                                </small>
                            </li>
                            <li>
                                <small css={{ color: colors.text }}>
                                    Tag: <span css={{ color: colors.text }}><Tag tag={study.category}/></span>
                                </small>
                            </li>
                        </ul>
                    </Col>
                </Box>

                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Research Team</h6>
                        <ResearcherButton buttonType='secondary' onClick={() => setStep(StudyStep.ResearchTeam)}>
                            Edit
                        </ResearcherButton>
                    </Col>
                    <Col sm={8} direction='column'>
                        <ul>
                            <li>
                                <small css={{ color: colors.text }}>
                                    IRB: <span css={{ color: colors.text }}>IRB-FY2022-19</span>
                                </small>
                            </li>
                            <li>
                                <small css={{ color: colors.text }}>
                                    University: <span css={{ color: colors.text }}>Rice University</span>
                                </small>
                            </li>
                            {pi && <li>
                                <small css={{ color: colors.text }}>
                                    Study PI: <span css={{ color: colors.text }}>{pi.firstName} {pi.lastName}</span>
                                </small>
                            </li>}
                            {lead && <li>
                                <small css={{ color: colors.text }}>
                                    Study Lead: <span
                                        css={{ color: colors.text }}>{lead.firstName} {lead.lastName}</span>
                                </small>
                            </li>}
                        </ul>
                    </Col>
                </Box>

                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>Participant View</h6>
                        <ResearcherButton buttonType='secondary' onClick={() => setStep(StudyStep.ParticipantView)}>
                            Edit
                        </ResearcherButton>
                    </Col>
                    <Col sm={8} direction='column'>
                        <small>Interact with the study card on the right-hand side to review how participants view your
                            study</small>
                    </Col>
                </Box>

                <AdditionalSessionsOverview study={study}/>
            </Col>

            <StudyCardPreview study={study}/>
        </Box>
    )
}

const AdditionalSessionsOverview: FC<{ study: Study }> = ({ study }) => {
    const { setValue } = useFormContext()
    const setStep = (step: StudyStep) => {
        setValue('step', step, { shouldValidate: true })
    }

    const stageCount = study.stages?.length || 0

    if (!stageCount) {
        return null
    }

    return (
        <Box direction='column' gap='large'>
            <svg css={{ strokeWidth: 2, height: 40 }}>
                <line x1="0" y1="30" x2="500" y2="30" strokeDasharray={10} stroke={colors.text}/>
            </svg>

            <Box justify='between' direction='column'>
                <Col justify='between' direction='row'>
                    <h6 className='fw-bold'>Additional Sessions (optional)</h6>

                    <ResearcherButton
                        buttonType={stageCount == 1 ? 'primary' : 'secondary'}
                        onClick={() => setStep(StudyStep.AdditionalSessions)}
                    >
                        {stageCount == 1 ? 'Start' : 'Edit'}
                    </ResearcherButton>
                </Col>

                <Col sm={8} direction='column'>
                    {stageCount == 1 &&
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
        </Box>
    )

}

export const SubmitStudyModal: FC<{
    study: Study,
    show: boolean,
    setShow: (show: boolean) => void
}> = ({ study, show, setShow }) => {
    const api = useApi()
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    if (submitted) {
        return <SubmitSuccess show={submitted} />
    }

    const submitStudy = () => {
        return api.updateStudyStatus({
            id: study.id,
            statusAction: 'submit',
        })
    }

    return (
        <Modal
            center
            show={show}
            large
        >
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='xlarge'>
                    <Box align='center' className='text-center' direction='column'>
                        <p>You’re about to submit your study to the Kinetic team so that the appropriate permissions are set. Please review and confirm any final changes.</p>
                        <p className='fw-bold text-danger'>You won’t be able to change your Kinetic study information past this point.</p>
                        <p>Are you ready to proceed?</p>
                    </Box>
                    <Box gap='large'>
                        <ResearcherButton buttonType='secondary' onClick={() => setShow(false)}>
                            Not yet, edit study
                        </ResearcherButton>
                        <ResearcherButton data-testid='submit-study-button' busyMessage='Submitting' busy={submitting} onClick={() => {
                            setSubmitting(true)
                            submitStudy().then(() => {
                                setSubmitted(true)
                                setSubmitting(false)
                                setShow(false)
                            })
                        }}>
                            Yes, submit study
                        </ResearcherButton>
                    </Box>
                </Box>
            </Modal.Body>
        </Modal>
    )
}

const SubmitSuccess: FC<{ show: boolean }> = ({ show }) => {
    const nav = useNavigate()
    return (
        <Modal center show={show} large>
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='xlarge'>
                    <Box align='center' className='text-center' direction='column'>
                        <span>Our team is creating a Qualtrics template and setting up the correct permissions for your study. You will receive an email from owlsurveys@rice.edu containing an access code to your Qualtrics template and further instructions via your registered email within the next business day.</span>
                        <br/>
                        <span>Follow the instructions to build your task and come back here to proceed with finalizing your study and launching it on Kinetic.</span>
                    </Box>

                    <ResearcherButton data-testid='submit-study-success-button' onClick={() => {
                        nav('/studies')
                    }}>
                        Return to Studies Dashboard
                    </ResearcherButton>
                </Box>
            </Modal.Body>
        </Modal>
    )
}
