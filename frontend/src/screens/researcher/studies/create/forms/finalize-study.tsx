import { EditingStudy } from '@models';
import { Box, React } from '@common';
import { Icon, Col, DateTime, DateTimeField, InputField, SelectField } from '@components';
import { StudyOverview } from './review-study';
import { colors } from '@theme';
import { useToggle } from 'rooks';

export const FinalizeStudy: FC<{study: EditingStudy}> = ({ study }) => {
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge' direction='column'>
                <h3 className='fw-bold'>Finalize your study</h3>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Opens on*</h6>
                    <small>Date & Time when study becomes public</small>
                </Col>

                <Col sm={6} direction='column' gap>
                    <div>
                        {/* TODO central time zone values */}
                        <DateTimeField
                            name='opensAt'
                            label='Opens On'
                            withTime
                            options={{
                                formatDate: (date: Date) => date.toLocaleDateString('en-US', { timeZone: 'America/Chicago' }),
                                defaultHour: 9,
                            }}
                            hint='Central Time - US'
                        />
                    </div>
                </Col>
            </Box>

            <ClosingCriteria study={study} />

            <ShareStudy study={study} />

            <StudyOverview study={study} />
        </Box>
    )
}

const ShareStudy: FC<{study: EditingStudy}> = ({ study }) => {
    const [shareStudy, toggleShareStudy] = useToggle()

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Sharing this study for public analysis (optional)</h6>
                <small>Date & Time when study becomes public</small>
            </Col>

            <Col sm={6} direction='column' gap>
                <Box gap>
                    <input type='checkbox' id='share-study' value='shareStudyForAnalysis' onChange={toggleShareStudy}/>
                    <label className='small' htmlFor="share-study">
                        I would like to make my study available to other researchers for replication, extension, etc
                    </label>
                </Box>
                <Box gap align='center'>
                    <small>After an embargo period of</small>
                    <SelectField
                        name="shareableAfterDays"
                        readOnly={!shareStudy}
                        options={[]}
                    />
                </Box>
            </Col>
        </Box>
    )
}


const ClosingCriteria: FC<{study: EditingStudy}> = ({ study }) => {
    const [hasClosingCriteria, toggleHasClosingCriteria] = useToggle()
    const [sampleSize, toggleSampleSize] = useToggle()
    const [closesAt, toggleClosesAt] = useToggle(false)

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Close criteria*</h6>
                <small>Select your preferred closing criteria indicating completion of data collection process. It can be left blank if unknown.</small>
                <Box gap css={{ color: colors.kineticResearcher }} align='center'>
                    <small>What is the Sample Size</small>
                    <Icon icon='questionCircleFill' tooltip='Consider Inflating sample size by 5% of your desired N to enable exclusion as we work to amplify our recruitment efforts'/>
                </Box>
            </Col>

            <Col sm={6} direction='column' gap>
                <Box gap>
                    <Col gap sm={4} direction='row' align='center'>
                        <input type='checkbox' id='sample-size' checked={sampleSize} onChange={toggleSampleSize}/>
                        <label htmlFor='sample-size'>By sample size</label>
                    </Col>
                    <Col sm={4}>
                        <InputField name={`stages.0.targetSampleSize`} disabled={!sampleSize} placeholder='1-1000' type='number'/>
                    </Col>
                </Box>

                <Box gap >
                    <Col gap sm={4} direction='row' align='center'>
                        <input type='checkbox' id='due-date' checked={closesAt} onChange={toggleClosesAt}/>
                        <label htmlFor='due-date'>By due date</label>
                    </Col>
                    <Col sm={4}>
                        <DateTime name={`stages.0.closesAt`} readOnly={!closesAt} placeholder='Select a date' withTime/>
                    </Col>
                </Box>
            </Col>
        </Box>
    )
}
