import { EditingStudy, studySubjects, studyTopics } from '@models';
import { Box, React, useMemo, useState, Yup } from '@common';
import { CharacterCount, FieldErrorMessage, Icon, SelectField, Button, Col, InputField, useFormContext } from '@components';
import { colors } from '@theme';
import { ImageLibrary } from '../image-library';
import { StudyCardPreview } from '../../../../learner/card';
import { first } from 'lodash-es';
import { Study } from '@api';
import { useFieldArray } from 'react-hook-form';

export const participantViewValidation = (studies: Study[], study: EditingStudy) => {
    const allOtherStudies = useMemo(() => studies?.filter(s => 'id' in study && s.id !== study.id), [studies])

    return {
        titleForParticipants: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) =>
                s.required('Required').max(45).test(
                    'Unique',
                    'This study title is already in use. Please change your study title to make it unique.',
                    (value: string) => {
                        if (!studies.length) {
                            return true
                        }
                        return allOtherStudies.every(study => study.titleForParticipants?.toLowerCase() !== value?.toLowerCase())
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
        studyTopic: Yup.string().when('step', {
            is: 2,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        stages: Yup.array().when('step', {
            is: (step: number) => step === 2,
            then: Yup.array().of(
                Yup.object({
                    points: Yup.mixed().required(),
                    feedbackTypes: Yup.array().test(
                        'At least one',
                        'Select at least one item',
                        (feedbackTypes?: string[]) => (feedbackTypes?.length || 0) > 0
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

export const ParticipantView: FC<{study: EditingStudy}> = ({ study }) => {
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
    const { setValue, watch, getValues, control } = useFormContext<EditingStudy>()
    const { fields, update } = useFieldArray({
        control,
        name: 'stages',
    })
    const firstSession = first(study.stages)

    const setDurationAndPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '10') {
            update(0, {
                ...fields[0],
                points: 10,
                durationMinutes: 5,
            })
        }

        if (e.target.value === '20') {
            update(0, {
                ...fields[0],
                points: 20,
                durationMinutes: 15,
            })
        }

        if (e.target.value === '30') {
            update(0, {
                ...fields[0],
                points: 30,
                durationMinutes: 25,
            })
        }
    }

    return (
        <Box className='mt-6' gap='xlarge'>
            <Col sm={8}>
                <Box direction='column' gap='xlarge'>
                    <Box gap='xlarge'>
                        <h3 className='fw-bold'>Participant View</h3>
                        <Box gap align='center'>
                            <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                            <span>ETA: 10min</span>
                        </Box>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Study Title for Participants*</h6>
                            <small>Consider a title that helps make the study relevant, friendly, and appealing to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField name='titleForParticipants' />
                                <FieldErrorMessage name='titleForParticipants' />
                                <CharacterCount max={45} name='titleForParticipants' />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Short Study Description*</h6>
                            <small>Craft a description that best engages participants with your study - relevant, brief, and simple</small>
                        </Col>

                        <Col sm={6} direction='column' gap='small'>
                            <InputField type='textarea' name='shortDescription' />
                            <CharacterCount max={120} name='shortDescription' />
                            <FieldErrorMessage name='shortDescription' />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Long Study Description*</h6>
                            <small>Share more about what participants should expect when participating in your study</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <InputField type='textarea' name='longDescription' />
                            <CharacterCount max={250} name='longDescription' />
                            <FieldErrorMessage name='longDescription' />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Add tags*</h6>
                            <small>Select the study type and content area (if applicable) that best describes your study to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <SelectField
                                name="studyTopic"
                                placeholder="Study Topic*"
                                options={studyTopics.map(s => ({ value: s, label: s }))}
                            />
                            <FieldErrorMessage name='studyTopic' />
                            <SelectField
                                name="studySubject"
                                placeholder="Study Content Area (optional)"
                                options={studySubjects.map(s => ({ value: s, label: s }))}
                            />
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Duration & points*</h6>
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
                            <h6>Benefits to Participants*</h6>
                            <small>Share how the feedback and findings from the study may benefit the participant</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField type='textarea' name='benefits' />
                                <CharacterCount max={170} name='benefits' />
                                <FieldErrorMessage name='benefits' />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Study Card Illustration*</h6>
                            <small>Select an illustration that more closely represents your study to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap align='start'>
                            <Button className='btn-researcher-secondary' onClick={() => setShowImagePicker(true)}>
                                {study.imageId ? 'Change Selected Image' : 'Select Study Card Image'}
                            </Button>
                            <ImageLibrary
                                show={showImagePicker}
                                onHide={() => setShowImagePicker(false)}
                                onSelect={(imageId) => setValue('imageId', imageId)}
                                currentImage={getValues('imageId')}
                            />
                            <FieldErrorMessage name='imageId' />
                            <input
                                type='text'
                                className='d-none'
                                name='imageId'
                                defaultValue={getValues('imageId')}
                            />
                        </Col>
                    </Box>
                </Box>
            </Col>

            <Col sm={4} direction='column' align='center'>
                <p>Preview of what learner will see</p>
                <StudyCardPreview study={watch() as EditingStudy} />
            </Col>
        </Box>
    )
}

export const StudyFeedback: FC<{sessionIndex: number}> = ({ sessionIndex }) => {
    const { register } = useFormContext<EditingStudy>()

    return (
        <Box gap='xlarge'>
            <Col sm={4} direction='column' gap>
                <h6>Feedback*</h6>
                <small>Share with participants what type of feedback to expect at the end of the study. Preferred feedback indicated.</small>
            </Col>

            <Col sm={6} direction='column' gap='large'>
                <Box direction='column' gap>
                    <Box gap align='start'>
                        <input
                            {...register(`stages.${sessionIndex}.feedbackTypes`)}
                            css={{ marginTop: 5 }}
                            type='checkbox'
                            id='score'
                            value='score'
                        />
                        <label htmlFor="score">
                            <Box direction='column' gap='small'>
                                <span>Score</span>
                                <small css={{ color: colors.grayText }}>An estimate of the participant’s performance or attributes</small>
                            </Box>
                        </label>
                    </Box>

                    <Box gap align='start'>
                        <input
                            {...register(`stages.${sessionIndex}.feedbackTypes`)}
                            css={{ marginTop: 5 }}
                            type='checkbox'
                            id='debrief'
                            value='debrief'
                        />
                        <label htmlFor="debrief">
                            <Box direction='column' gap='small'>
                                <span>Debrief</span>
                                <small css={{ color: colors.grayText }}>A summary (e.g., study procedures, results, etc.). Designed to provide a sense of closure</small>
                            </Box>
                        </label>
                    </Box>

                    <Box gap align='start'>
                        <input
                            {...register(`stages.${sessionIndex}.feedbackTypes`)}
                            css={{ marginTop: 5 }}
                            type='checkbox'
                            id='general'
                            value='general'
                        />
                        <label htmlFor="general">
                            <Box direction='column' gap='small'>
                                <span>General feedback (learner favorite)</span>
                                <small css={{ color: colors.grayText }}>Information about the constructs addressed and how they broadly relate to the participant</small>
                            </Box>
                        </label>
                    </Box>

                    <Box gap align='start'>
                        <input
                            {...register(`stages.${sessionIndex}.feedbackTypes`)}
                            css={{ marginTop: 5 }}
                            type='checkbox'
                            id='personalized'
                            value='personalized'
                        />
                        <label htmlFor="personalized">
                            <Box direction='column' gap='small'>
                                <span>Personalized feedback (learner favorite)</span>
                                <small css={{ color: colors.grayText }}>Tailored information to participant's specific characteristics, behaviors, needs, performance, or some combination</small>
                            </Box>
                        </label>
                    </Box>

                    <FieldErrorMessage name='stages.0.feedbackTypes'/>
                </Box>
            </Col>
        </Box>
    )
}
