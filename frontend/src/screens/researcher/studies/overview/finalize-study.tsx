import { Box, React, styled, Yup } from '@common';
import {
    Button,
    Col,
    DateTime,
    DateTimeField,
    DateTimeFormats,
    Form,
    FormSaveButton,
    Icon,
    InputField,
    SelectField,
    useFormContext,
    useFormState,
} from '@components';
import { colors } from '@theme';
import { useToggle } from 'rooks';
import { Study, StudyStatusEnum } from '@api';
import { useApi } from '@lib';
import { FormContext } from '@nathanstitt/sundry/form-hooks';
import { getFirstStage } from '@models';

const ResearcherCheckbox = styled(InputField)({
    '.form-check-input, &.form-check-input': {
        height: 16,
        width: 16,
        '&:checked': {
            backgroundColor: colors.kineticResearcher,
            borderColor: colors.kineticResearcher,
        },
    },
})

const finalizeValidation = Yup.object().shape({

});

export const FinalizeStudyForm: FC<{study: Study, disabled?: boolean}> = ({ study, disabled = false }) => {
    const api = useApi()
    const saveStudy = async (study: Study, context: FormContext<any>) => {
        const { reset } = context
        const savedStudy = await api.updateStudy({ id: Number(study.id), updateStudy: { study: study } })
        reset(savedStudy, { keepIsValid: true })
    }

    return (
        <Form
            readOnly={disabled}
            validationSchema={finalizeValidation}
            defaultValues={{
                ...study,
                hasSampleSize: !!study.targetSampleSize,
                hasClosingDate: !!study.closesAt,
            }}
            onSubmit={(values, context) => saveStudy(values, context)}
            onCancel={() => {}}
        >
            <FormContent study={study} />
        </Form>
    )
}

const FormContent: FC<{study: Study}> = ({ study }) => {
    const { isValid } = useFormState()
    return (
        <div>
            <FinalizeStudy study={study} />
            <FormSaveButton className='btn-researcher-primary mt-2' disabled={!isValid}>
                Publish Changes
            </FormSaveButton>
        </div>
    )
}

const SubmitStudyButton: FC<{study: Study}> = ({ study }) => {
    const { isValid } = useFormState()

    if (study.status === StudyStatusEnum.ReadyForLaunch) {
        return (
            <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
                <Box className='container-lg' align='center' justify='between'>
                    <span></span>
                    <Button
                        className='btn-researcher-primary'
                        disabled={true}
                        css={{ width: 170, justifyContent: 'center' }}
                        onClick={() => {
                        }}
                    >
                        Finalize Study
                    </Button>

                    {/*<Box align='center' gap='large'>*/}
                    {/*    {step.secondaryAction ? <Button*/}
                    {/*        className='btn-researcher-secondary'*/}
                    {/*        disabled={step.secondaryAction.disabled}*/}
                    {/*        css={{ width: 170, justifyContent: 'center' }}*/}
                    {/*        onClick={() => step.secondaryAction?.action?.()}*/}
                    {/*    >*/}
                    {/*        {step.secondaryAction?.text}*/}
                    {/*    </Button> : <></>}*/}

                    {/*{step.primaryAction ? <Button*/}
                    {/*    className='btn-researcher-primary'*/}
                    {/*    disabled={step.primaryAction.disabled}*/}
                    {/*    css={{ width: 170, justifyContent: 'center' }}*/}
                    {/*    onClick={() => step.primaryAction?.action?.()}*/}
                    {/*>*/}
                    {/*    {step.primaryAction?.text}*/}
                    {/*</Button> : <></>}*/}
                    {/*</Box>*/}
                </Box>
            </Box>
        )
    }

    return (
        <FormSaveButton className='btn-researcher-primary mt-2' disabled={!isValid}>
            Publish Changes
        </FormSaveButton>
    )
}

export const FinalizeStudy: FC<{study: Study}> = ({ study }) => {
    return (
        <Box className='mt-2' direction='column' gap='xlarge'>
            <OpensAt />

            <ClosingCriteria study={study} />

            <ShareStudy study={study} />
        </Box>
    )
}

const OpensAt: FC = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Opens on*</h6>
                <small>Date & Time when study becomes public</small>
            </Col>

            <Col sm={6} direction='column' gap>
                <div>
                    <DateTimeField
                        name='opensAt'
                        label='Opens On'
                        withTime
                        format={DateTimeFormats.shortDateTime}
                        options={{
                            defaultHour: 9,
                        }}
                        hint='Central Time - US'
                    />
                </div>
            </Col>
        </Box>
    )
}

const ShareStudy: FC<{study: Study}> = ({ study }) => {
    const shareable = study.shareableAfterMonths !== null
    const [shareStudy, toggleShareStudy] = useToggle(shareable)
    const { setValue } = useFormContext()
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Sharing this study for public analysis (optional)</h6>
                <small>Date & Time when study becomes public</small>
            </Col>

            <Col sm={6} direction='column' gap>
                <Box gap>
                    <input type='checkbox' defaultChecked={shareable} id='share-study' onChange={() => {
                        toggleShareStudy()
                        if (shareStudy) {
                            setValue('shareableAfterMonths', null)
                        }
                    }}/>
                    <label className='small' htmlFor="share-study">
                        I would like to make my study available to other researchers for replication, extension, etc
                    </label>
                </Box>
                {shareStudy &&
                    <Box gap align='center'>
                        <small>After an embargo period of</small>
                        <SelectField
                            name="shareableAfterMonths"
                            value={0}
                            options={[
                                { value: 0, label: 'No embargo' },
                                { value: 6, label: '6 months' },
                                { value: 12, label: '12 months' },
                                { value: 18, label: '18 months' },
                            ]}
                        />
                    </Box>
                }
            </Col>
        </Box>
    )
}


const ClosingCriteria: FC<{study: Study}> = ({ study }) => {
    const firstStage = getFirstStage(study)
    if (!firstStage) {
        return null
    }
    const { watch } = useFormContext()

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
                    <Col gap sm={3} direction='row' align='center'>
                        <ResearcherCheckbox
                            name='hasSampleSize'
                            type='checkbox'
                            id='sample-size'
                        />
                        <label htmlFor='sample-size'>By sample size</label>
                    </Col>
                    <Col sm={5}>
                        <InputField
                            name='targetSampleSize'
                            disabled={!watch('hasSampleSize')}
                            placeholder='1-1000'
                            type='number'
                        />
                    </Col>
                </Box>

                <Box gap>
                    <Col gap sm={3} direction='row' align='center'>
                        <ResearcherCheckbox
                            name='hasClosingDate'
                            type='checkbox'
                            id='closing-date'
                        />
                        <label htmlFor='closing-date'>By closing date</label>
                    </Col>
                    <Col sm={5}>
                        <DateTime
                            name='closesAt'
                            readOnly={!watch('hasClosingDate')}
                            placeholder='Select a date'
                            format={DateTimeFormats.shortDateTime}
                            options={{
                                defaultHour: 9,
                            }}
                            withTime
                        />
                    </Col>
                </Box>
            </Col>
        </Box>
    )
}
