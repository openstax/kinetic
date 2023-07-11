import { studySubjects, studyTopics } from '@models';
import { Box, React, useState, Yup } from '@common';
import {
    Col,
    FieldErrorMessage,
    FieldTitle,
    InputField,
    ResearcherButton,
    ResearcherDetailedCheckbox,
    SelectField,
    StepHeader,
    useFormContext,
} from '@components';
import { ImageLibrary } from '../image-library';
import { StudyCardPreview } from '../../../../learner/card';
import { first } from 'lodash-es';
import { Study } from '@api';
import { useFieldArray } from 'react-hook-form';

export const participantViewValidation = (allOtherStudies: Study[]) => {
    return {
        titleForParticipants: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) =>
                s.required('Required').max(45).test(
                    'Unique',
                    'This study title is already in use. Please change your study title to make it unique on Kinetic.',
                    (value: string) => {
                        if (!allOtherStudies.length) {
                            return true
                        }
                        return allOtherStudies.every(study => study.titleForParticipants?.toLowerCase().trim() !== value?.toLowerCase().trim())
                    }
                ),
        }),
        shortDescription: Yup.string().max(120).when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        longDescription: Yup.string().max(250).when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        topic: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        stages: Yup.array().when('step', {
            is: (step: number) => step == 2 || step == 3,
            then: Yup.array().of(
                Yup.object({
                    points: Yup.number().required().positive(),
                    durationMinutes: Yup.number().required().positive(),
                    feedbackTypes: Yup.array().test(
                        'At least one',
                        'Select at least one item',
                        (feedbackTypes?: string[]) => {
                            return (feedbackTypes?.length || 0) > 0
                        }
                    ),
                })
            ),
        }),
        benefits: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        imageId: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
    }
}

export const ParticipantView: FC<{study: Study}> = ({ study }) => {
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
    const { setValue, watch, getValues, control } = useFormContext<Study>()
    const { update } = useFieldArray({
        control,
        name: 'stages',
        keyName: 'customId',
    })
    const firstSession = first(study.stages)

    const setDurationAndPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stage = getValues('stages.0')
        if (e.target.value === '10') {
            update(0, {
                ...stage,
                points: 10,
                durationMinutes: 5,
            })
        }

        if (e.target.value === '20') {
            update(0, {
                ...stage,
                points: 20,
                durationMinutes: 15,
            })
        }

        if (e.target.value === '30') {
            update(0, {
                ...stage,
                points: 30,
                durationMinutes: 25,
            })
        }
    }

    return (
        <Box className='mt-6' gap='xlarge'>
            <Col sm={8}>
                <Box direction='column' gap='xlarge'>
                    <StepHeader title='Participant View' eta={10} />
                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Study Title for Participants</FieldTitle>
                            <small>Consider a title that helps make the study relevant, friendly, and appealing to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField name='titleForParticipants' />
                                <FieldErrorMessage name='titleForParticipants' liveCountMax={45} />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Short Study Description</FieldTitle>
                            <small>Craft a description that best engages participants with your study - relevant, brief, and simple</small>
                        </Col>

                        <Col sm={6} direction='column' gap='small'>
                            <InputField type='textarea' name='shortDescription' />
                            <FieldErrorMessage name='shortDescription' liveCountMax={120} />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Long Study Description</FieldTitle>
                            <small>Share more about what participants should expect when participating in your study</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <InputField type='textarea' name='longDescription' />
                            <FieldErrorMessage name='longDescription' liveCountMax={250} />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Add tags</FieldTitle>
                            <small>Select the study type and content area (if applicable) that best describes your study to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <SelectField
                                name="topic"
                                placeholder="Study Topic*"
                                options={studyTopics.map(s => ({ value: s, label: s }))}
                            />
                            <FieldErrorMessage name='topic' />
                            <SelectField
                                name="subject"
                                placeholder="Study Content Area (optional)"
                                options={studySubjects.map(s => ({ value: s, label: s }))}
                            />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Duration & points</FieldTitle>
                            <small>Select the option that best describes your estimated study duration. Study points are based on duration.</small>
                        </Col>

                        <Col sm={6} direction='column'>
                            <Box direction='column'>
                                <Box gap>
                                    <input
                                        id='points-10'
                                        type='radio'
                                        name='stages.0.points'
                                        value={10}
                                        defaultChecked={firstSession?.points === 10}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label htmlFor='points-10'>~5 minutes: 10 pts</label>
                                </Box>
                                <Box gap>
                                    <input
                                        id='points-20'
                                        type='radio'
                                        name='stages.0.points'
                                        value={20}
                                        defaultChecked={firstSession?.points === 20}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label htmlFor='points-20'>~15 minutes: 20 pts</label>
                                </Box>
                                <Box gap>
                                    <input
                                        id='points-30'
                                        type='radio'
                                        name='stages.0.points'
                                        value={30}
                                        defaultChecked={firstSession?.points === 30}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label htmlFor='points-30'>~25 minutes: 30 pts</label>
                                </Box>
                                <FieldErrorMessage name='stages.0.points'/>
                            </Box>
                        </Col>
                    </Box>

                    <StudyFeedback sessionIndex={0} />

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Benefits to Participants</FieldTitle>
                            <small>Share how the feedback and findings from the study may benefit the participant</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField type='textarea' name='benefits' />
                                <FieldErrorMessage name='benefits' liveCountMax={170}/>
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <FieldTitle required>Study Card Illustration</FieldTitle>
                            <small>Select an illustration that more closely represents your study to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap align='start' justify='center'>
                            <ResearcherButton buttonType='secondary' testId='image-picker' onClick={() => setShowImagePicker(true)}>
                                {getValues('imageId') ? 'Change Selected Image' : 'Select Study Card Image'}
                            </ResearcherButton>
                            <ImageLibrary
                                show={showImagePicker}
                                onHide={() => setShowImagePicker(false)}
                                onSelect={(imageId) => setValue('imageId', imageId, { shouldValidate: true, shouldDirty: true })}
                                currentImage={getValues('imageId')}
                            />
                            <FieldErrorMessage name='imageId' />
                            <input type='text' className='d-none' name='imageId'/>
                        </Col>
                    </Box>
                </Box>
            </Col>

            <Col sm={4} direction='column' align='start'>
                <p>Preview of what the participant will see</p>
                <StudyCardPreview study={watch() as Study} />
            </Col>
        </Box>
    )
}

export const StudyFeedback: FC<{sessionIndex: number}> = ({ sessionIndex }) => {
    return (
        <Box gap='xlarge'>
            <Col sm={4} direction='column' gap>
                <FieldTitle required>Feedback</FieldTitle>
                <small>Share with participants what type of feedback to expect at the end of the study. Preferred feedback indicated.</small>
            </Col>

            <Col sm={6} direction='column' gap='large'>
                <Box direction='column' gap>
                    <ResearcherDetailedCheckbox
                        name={`stages.${sessionIndex}.feedbackTypes`}
                        value='score'
                        label='Score'
                        desc='An estimate of the participant’s performance or attributes'
                    />
                    <ResearcherDetailedCheckbox
                        name={`stages.${sessionIndex}.feedbackTypes`}
                        value='debrief'
                        label='Debrief'
                        desc='A summary (e.g., study procedures, results, etc.). Designed to provide a sense of closure'
                    />
                    <ResearcherDetailedCheckbox
                        name={`stages.${sessionIndex}.feedbackTypes`}
                        value='general'
                        label='General feedback (learner favorite)'
                        desc='Information about the constructs addressed and how they broadly relate to the participant'
                    />
                    <ResearcherDetailedCheckbox
                        name={`stages.${sessionIndex}.feedbackTypes`}
                        value='personalized'
                        label='Personalized feedback (learner favorite)'
                        desc="Tailored information to participant's specific characteristics, behaviors, needs, performance, or some combination"
                    />

                    <FieldErrorMessage name={`stages.${sessionIndex}.feedbackTypes`} />
                </Box>
            </Col>
        </Box>
    )
}
