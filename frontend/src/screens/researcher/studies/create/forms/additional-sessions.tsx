import { EditingStudy } from '@models';
import { Box, React, useEffect, useState } from '@common';
import { FieldErrorMessage, Icon } from '@components';
import { colors } from '@theme';
import { Button, Col, useFormContext } from '@nathanstitt/sundry';
import { NewStage, Stage, Study } from '@api';
import { uniqueId } from 'lodash-es';
import { useFieldArray } from 'react-hook-form';

export const AdditionalSessions: FC<{study: EditingStudy}> = ({ study }) => {
    // const [additionalSession, setAdditionalSession] = useState<boolean>(!!study.stages && study.stages.length > 1)
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap direction='column'>
                <Box gap='xlarge'>
                    <h3 className='fw-bold'>Additional sessions (optional)</h3>
                    <Box gap align='center'>
                        <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                        <span>ETA: 10 min</span>
                    </Box>
                </Box>

                <p>You can skip this part if you don’t have any other session to add. Feel free to come back at any time to add session(s).</p>
            </Box>

            <Sessions study={study}/>
        </Box>
    )
}

const Sessions: FC<{study: EditingStudy}> = ({ study }) => {
    const { control, watch } = useFormContext<EditingStudy>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'stages',
    })

    console.log(fields, watch('stages'));

    const addSession = () => {
        append({ order: fields.length, config: {}, id: -1 })
        // setSessions(prev => ([
        //     ...prev,
        //     {
        //         order: prev.length,
        //         config: {},
        //     } as NewStage,
        // ]))
    }

    const removeSession = (index: number) => {
        remove(index)
        // unregister(`stages.${index}`, { keepValue: false })
        // setSessions(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Col direction='column' sm={8} gap='large'>
            {fields.map((stage, index) => (
                <AdditionalSession
                    key={stage.id}
                    index={index}
                    session={stage}
                    onDelete={removeSession}
                />
            ))}

            <Button
                icon='plus'
                align='center'
                css={{
                    border: `1px solid ${colors.lightGray}`,
                    padding: 12,
                }}
                onClick={addSession}
            >
                Add another session
            </Button>
        </Col>
    )
}


const AdditionalSession: FC<{
    index: number,
    onDelete: (index: number) => void,
    session: Stage | NewStage
}> = ({ index, onDelete, session }) => {
    // don't show the first session
    if (index === 0) return null
    const { register, getValues } = useFormContext()
    const prevStagePoints = getValues(`stages.${index - 1}.points`)

    return (
        <Col direction='column' css={{ border: `1px solid ${colors.lightGray}`, borderRadius: 10 }}>
            <Box css={{ backgroundColor: colors.gray, padding: `1rem`, borderRadius: `10px 10px 0 0` }} justify='between'>
                <h4>Session {index + 1}</h4>
                <Icon color={colors.red} icon='trash' onClick={() => onDelete(index) } />
            </Box>

            <Box direction='column' css={{ padding: '1rem' }} gap='xlarge'>
                <Box gap='xlarge'>
                    <Col sm={4} direction='column' gap>
                        <h6>Session Duration*</h6>
                    </Col>

                    <Col sm={6} gap>
                        <Box direction='column'>
                            <Box gap>
                                <input
                                    type='radio'
                                    value={5}
                                    {...register(`stages.${index}.durationMinutes`)}
                                    defaultChecked={session?.durationMinutes === 5}
                                />
                                <label>~5 minutes</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='radio'
                                    value={15}
                                    {...register(`stages.${index}.durationMinutes`)}
                                    defaultChecked={session?.durationMinutes === 15}
                                />
                                <label>~15 minutes</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='radio'
                                    value={25}
                                    {...register(`stages.${index}.durationMinutes`)}
                                    defaultChecked={session?.durationMinutes === 25}
                                />
                                <label>~25 minutes</label>
                            </Box>
                        </Box>
                    </Col>
                </Box>

                <Box gap='xlarge'>
                    <Col sm={4} direction='column' gap>
                        <h6>Session Points*</h6>
                    </Col>

                    <Col sm={6} gap>
                        <Box gap>
                            <input
                                type='radio'
                                id='pts'
                                readOnly={true}
                                checked={true}
                                {...register(`stages.${index}.points]`)}
                                value={+prevStagePoints + 5}
                            />
                            <label htmlFor="pts">{+prevStagePoints + 5} points</label>
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
                                <input
                                    type='checkbox'
                                    id='score'
                                    value='score'
                                    {...register(`stages.${index}.feedbackTypes]`)}
                                />
                                <label htmlFor="score">Score</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='checkbox'
                                    id='debrief'
                                    value='debrief'
                                    {...register(`stages.${index}.feedbackTypes]`)}
                                />
                                <label htmlFor="debrief">Debrief</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='checkbox'
                                    id='personalized'
                                    value='personalized'
                                    {...register(`stages.${index}.feedbackTypes]`)}
                                />
                                <label htmlFor="personalized">Personalized</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='checkbox'
                                    id='general'
                                    value='general'
                                    {...register(`stages.${index}.feedbackTypes]`)}
                                />
                                <label htmlFor="general">General</label>
                            </Box>
                            <FieldErrorMessage name={`stages.${index}.feedbackTypes]`} />
                        </Box>
                    </Col>
                </Box>
            </Box>
        </Col>
    )
}
