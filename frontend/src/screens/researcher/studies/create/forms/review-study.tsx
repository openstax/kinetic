import { EditingStudy, getStudyLead, getStudyPi } from '@models';
import { Box, React } from '@common';
import { colors } from '@theme';
import { Button, Col, useFormContext } from '@nathanstitt/sundry';
import { StudyCardPreview, Tag } from '../../../../learner/card';
import { StudyStep } from '../edit-study';
import { Icon } from '@components';
import { useToggle } from 'rooks';

export const ReviewStudy: FC<{study: EditingStudy}> = ({ study }) => {

    if (study.status === 'waiting-period') {
        // render correct page
        // disable buttons
        return <WaitingForTemplate study={study} />
    }


    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='large' direction='column'>
                <h3 className='fw-bold'>Review your study</h3>
                <p>You can skip this part if you don’t have any other session to add. Feel free to come back at any time to add session(s).</p>
            </Box>

            <StudyInformation study={study} />

            <StudyOverview study={study} />

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
            <Col sm={4} direction='column' gap='large'>
                <Box justify='between' direction='column'>
                    <Col justify='between' direction='row'>
                        <h6 className='fw-bold'>About researcher</h6>
                        {!viewOnly && <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.ResearchTeam)}>
                            Edit
                        </Button>}
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
                        {!viewOnly && <Button className='btn-researcher-secondary' onClick={() => setStep(StudyStep.InternalDetails)}>
                            Edit
                        </Button>}
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
        <Box>

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
