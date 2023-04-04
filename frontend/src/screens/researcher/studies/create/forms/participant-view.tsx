import { EditingStudy } from '@models';
import { Box, React, useState } from '@common';
import { CharacterCount, FieldErrorMessage, Icon, SelectField } from '@components';
import { colors } from '@theme';
import { Button, Col, InputField, useFormContext } from '@nathanstitt/sundry';
import { ImageLibrary } from '../image-library';
import { StudyCardPreview } from '../../../../learner/card';

export const ParticipantView: FC<{study: EditingStudy}> = ({ study }) => {
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
    const { setValue, watch, register } = useFormContext()
    const studyPreview = watch() as EditingStudy

    const setDurationAndPoints = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                            <span>ETA: 10 min</span>
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
                            <small>Craft a description visible to participants that can be a hook for your study - relevant, brief, simple, and engaging</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField type='textarea' name='shortDescription' />
                                <CharacterCount max={120} name='shortDescription' />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Long Study Description*</h6>
                            <small>Share more about what participants could expect when taking your study</small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <div>
                                <InputField type='textarea' name='longDescription' />
                                <CharacterCount max={250} name='longDescription' />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Add tags*</h6>
                            <small>Select the study type and subject area of the study (if applicable) that best describes your study to participants</small>
                        </Col>

                        {/* TODO handle tags and subjects */}
                        <Col sm={6} direction='column' gap>
                            <div>
                                <SelectField
                                    name="tags" id="tags" placeholder="Tags"
                                    allowCreate isMulti
                                    options={[]}
                                />
                            </div>
                            <div>
                                <SelectField
                                    name="subjects" id="subjects" placeholder="Subjects"
                                    allowCreate isMulti
                                    options={[]}
                                />
                            </div>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Duration & points*</h6>
                            <small>Select the option that best describes your estimated study duration. Study points are based on study duration</small>
                        </Col>

                        {/* TODO Setup handler */}
                        <Col sm={6} direction='column'>
                            <Box direction='column'>
                                <Box gap>
                                    <input type='radio' {...register('stages.0.durationAndPoints')} value={5} onChange={setDurationAndPoints}/>
                                    <label>~5 minutes: 10 pts</label>
                                </Box>
                                <Box gap>
                                    <input type='radio' {...register('stages.0.durationAndPoints')} value={15} onChange={setDurationAndPoints}/>
                                    <label>~15 minutes: 20 pts</label>
                                </Box>
                                <Box gap>
                                    <input type='radio' {...register('stages.0.durationAndPoints')} value={25} onChange={setDurationAndPoints}/>
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
                                <FieldErrorMessage name='stages[0].feedbackTypes'/>
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
