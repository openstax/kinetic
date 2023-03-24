import { EditingStudy } from '@models';
import { Box, React, useState } from '@common';
import { Icon, CharacterCount, SelectField, FieldErrorMessage } from '@components';
import { colors } from '@theme';
import { Button, Col, InputField, useFormContext } from '@nathanstitt/sundry';
import { ImageLibrary } from '../image-library';
import { StudyCardPreview } from '../../../../learner/card';

export const ParticipantView: FC<{study: EditingStudy}> = ({ study }) => {
    const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
    const { setValue, watch } = useFormContext()
    const studyPreview = watch() as EditingStudy

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
                                <InputField name='shortDescription' />
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
                                <InputField name='longDescription' />
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
                                    <input type='radio' id='5' name='pointsAndDuration'  />
                                    <label htmlFor="5">5 minutes: 10 pts</label>
                                </Box>
                                <Box gap>
                                    <input type='radio' id='15' name='pointsAndDuration'  />
                                    <label htmlFor="15">15 minutes: 20 pts</label>
                                </Box>
                                <Box gap>
                                    <input type='radio' id='25' name='pointsAndDuration'  />
                                    <label htmlFor="25">25 minutes: 30pts</label>
                                </Box>
                            </Box>
                        </Col>
                    </Box>

                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>Participant Feedback*</h6>
                            <small>Share with participants what type of feedback to expect at the end of the study. Preferred feedback indicated.</small>
                        </Col>

                        <Col sm={6} direction='column' gap='small'>
                            <Box direction='column'>
                                <Box gap>
                                    <input type='checkbox' id='score' name='feedbackScore' />
                                    <label htmlFor="score">Score</label>
                                </Box>
                                <Box gap>
                                    <input type='checkbox' id='debrief' name='feedbackDebrief' />
                                    <label htmlFor="debrief">Debrief</label>
                                </Box>
                                <Box gap>
                                    <input type='checkbox' id='personalized' name='feedbackPersonalized' />
                                    <label htmlFor="personalized">Personalized</label>
                                </Box>
                                <Box gap>
                                    <input type='checkbox' id='general' name='feedbackGeneral' />
                                    <label htmlFor="general">General</label>
                                </Box>
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
                                <InputField name='benefits' />
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
