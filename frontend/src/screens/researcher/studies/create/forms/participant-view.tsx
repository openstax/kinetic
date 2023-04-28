import { EditingStudy, studySubjects, studyTopics } from '@models';
import { Box, React, useMemo, useState, Yup } from '@common';
import { CharacterCount, FieldErrorMessage, Icon, SelectField, Button, Col, InputField, useFormContext } from '@components';
import { colors } from '@theme';
import { ImageLibrary } from '../image-library';
import { StudyCardPreview } from '../../../../learner/card';
import { first } from 'lodash-es';
import { Study } from '@api';

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
    }
}

export const ParticipantView: FC<{study: EditingStudy}> = ({ study }) => {
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
    const { setValue, watch, register } = useFormContext()
    const studyPreview = watch() as EditingStudy
    const firstSession = first(study.stages)

    const setDurationAndPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO Use useFormArray().update()
        if (e.target.value === '5') {
            setValue('stages.0.points', 10)
            setValue('stages.0.durationMinutes', 5)
        }

        if (e.target.value === '15') {
            setValue('stages.0.points', 20)
            setValue('stages.0.durationMinutes', 15)
        }

        if (e.target.value === '25') {
            setValue('stages.0.points', 30)
            setValue('stages.0.durationMinutes', 25)
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

                        <Col sm={6} direction='column' gap='small'>
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
                            <div>
                                <SelectField
                                    name="studyTopic"
                                    placeholder="Topic"
                                    options={studyTopics.map(s => ({ value: s, label: s }))}
                                />
                            </div>
                            <div>
                                <SelectField
                                    name="studySubject"
                                    placeholder="Subject"
                                    options={studySubjects.map(s => ({ value: s, label: s }))}
                                />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Duration & points*</h6>
                            <small>Select the option that best describes your estimated study duration. Study points are based on study duration</small>
                        </Col>

                        <Col sm={6} direction='column'>
                            <Box direction='column'>
                                <Box gap>
                                    <input
                                        type='radio'
                                        {...register('stages.0.points')}
                                        value={10}
                                        defaultChecked={firstSession?.points === 10}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label>~5 minutes: 10 pts</label>
                                </Box>
                                <Box gap>
                                    <input
                                        type='radio'
                                        {...register('stages.0.points')}
                                        value={20}
                                        defaultChecked={firstSession?.points === 20}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label>~15 minutes: 20 pts</label>
                                </Box>
                                <Box gap>
                                    <input
                                        type='radio'
                                        {...register('stages.0.points')}
                                        value={30}
                                        defaultChecked={firstSession?.points === 30}
                                        onChange={setDurationAndPoints}
                                    />
                                    <label>~25 minutes: 30 pts</label>
                                </Box>
                            </Box>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Participant Feedback*</h6>
                            <small>Share with participants what type of feedback to expect at the end of the study. Preferred feedback indicated.</small>
                        </Col>

                        <Col sm={6} direction='column' gap='medium'>
                            <Box direction='column'>
                                <Box gap>
                                    <input {...register('stages.0.feedbackTypes')} name='stages.0.feedbackTypes' type='checkbox' id='score' value='score' />
                                    <label htmlFor="score">Score</label>
                                </Box>
                                <Box gap>
                                    <input {...register('stages.0.feedbackTypes')} type='checkbox' id='debrief' value='debrief' />
                                    <label htmlFor="debrief">Debrief</label>
                                </Box>
                                <Box gap>
                                    <input {...register('stages.0.feedbackTypes')} type='checkbox' id='personalized' value='personalized' />
                                    <label htmlFor="personalized">Personalized</label>
                                </Box>
                                <Box gap>
                                    <input {...register('stages.0.feedbackTypes')} type='checkbox' id='general' value='general' />
                                    <label htmlFor="general">General</label>
                                </Box>
                                <FieldErrorMessage name='stages.0.feedbackTypes'/>
                            </Box>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Benefits to Participants*</h6>
                            <small>Consider sharing how the feedback and findings from the study may benefit the participant</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField type='textarea' name='benefits' />
                                <CharacterCount max={170} name='benefits' />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Select image*</h6>
                            <small>Consider selecting an image that best describes your study to participants</small>
                        </Col>

                        <Col sm={6} direction='column' gap align='start'>
                            <Button className='btn-researcher-secondary' onClick={() => setShowImagePicker(true)}>
                                Select a Study Card Image
                            </Button>
                            <ImageLibrary
                                show={showImagePicker}
                                onHide={() => setShowImagePicker(false)}
                                onSelect={(imageId) => setValue('imageId', imageId)}
                                currentImage={watch('imageId')}
                            />
                            <input
                                type='text'
                                className='d-none'
                                name='imageId'
                                defaultValue={watch('imageId')}
                            />
                        </Col>
                    </Box>
                </Box>
            </Col>

            <Col sm={4} direction='column' align='center'>
                <p>Preview of what learner will see</p>
                <StudyCardPreview study={studyPreview} />
            </Col>
        </Box>
    )
}
