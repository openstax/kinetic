import { EditingStudy, getStudyLead, getStudyPi } from '@models';
import { Box, React } from '@common';
import { colors } from '@theme';
import { Button, Col, useFormContext } from '@nathanstitt/sundry';
import { StudyCardPreview, Tag } from '../../../../learner/card';
import { StudyStep } from '../edit-study';

export const ReviewStudy: FC<{study: EditingStudy}> = ({ study }) => {
    const { setValue } = useFormContext()
    const setStep = (step: StudyStep) => {
        setValue('step', step, { shouldValidate: true })
    }

    const pi = getStudyPi(study);
    const lead = getStudyLead(study);

    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge' direction='column'>
                <h3 className='fw-bold'>Review your study</h3>
                <p>You can skip this part if you don’t have any other session to add. Feel free to come back at any time to add session(s).</p>
            </Box>

            <Box gap='xxlarge'>
                <Col sm={4} direction='column' gap='large'>
                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>About researcher</h6>
                            <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.ResearchTeam)}>
                                Edit
                            </Button>
                        </Col>
                        <Col sm={8} direction='column'>
                            <small>IRB-FY2022-19</small>
                            <small>Rice University</small>
                            {pi && <small>PI: {pi.firstName} {pi.lastName}</small>}
                            {lead && <small>Study Lead: {lead.firstName} {lead.lastName}</small>}
                        </Col>
                    </Box>

                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Information Available to Researchers</h6>
                            <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.InternalDetails)}>
                                Edit
                            </Button>
                        </Col>
                        <Col sm={8} direction='column' gap>
                            <small>Title: {study.titleForParticipants}</small>
                            <Box gap>
                                <small>Tags: </small>
                                <Tag tag={study.studyType} />
                                <Tag tag={study.studySubject} />
                            </Box>
                        </Col>

                    </Box>

                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Information Available to Participants</h6>
                            <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.ParticipantView)}>
                                Edit
                            </Button>
                        </Col>
                        <Col sm={8} direction='column'>
                            <small>Interact with the study card on the right-hand side to review how participants view your study</small>
                        </Col>
                    </Box>

                    <svg css={{ strokeWidth: 2, height: 40 }}>
                        <line x1="0" y1="30" x2="500" y2="30" strokeDasharray={5} stroke={colors.grayText} />
                    </svg>

                    <Box justify='between' direction='column'>
                        <Col justify='between' direction='row'>
                            <h6 className='fw-bold'>Additional Session (optional)</h6>
                            <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.AdditionalSessions)}>
                                Edit
                            </Button>
                        </Col>
                        <Col sm={8} direction='column'>
                            {study.stages?.map((stage, index) => {
                                if (index === 0) return null
                                return (
                                    <small>
                                        Session {index + 1}: {stage.durationMinutes} minutes, {stage.points} points
                                    </small>
                                )
                            })}
                        </Col>
                    </Box>
                </Col>

                <StudyCardPreview study={study} />
            </Box>
        </Box>
    )
}
