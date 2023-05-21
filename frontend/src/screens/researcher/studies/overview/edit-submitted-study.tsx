import { Stage, Study } from '@api';
import { useApi } from '@lib';
import { FormContext } from '@nathanstitt/sundry/form-hooks';
import {
    Col,
    DateTime,
    DateTimeField,
    DateTimeFormats, FieldErrorMessage,
    Form,
    FormSaveButton,
    Icon,
    InputField,
    ResearcherCheckbox,
    SelectField,
    useFormContext,
    useFormState,
} from '@components';
import { Box, React, useNavigate, Yup } from '@common';
import { getFirstStage, isReadyForLaunch } from '@models';
import { colors } from '@theme';

const studyValidation = Yup.object().shape({
    opensAt: Yup.mixed().required(),
    targetSampleSize: Yup.mixed().when('hasSampleSize', {
        is: true,
        then: Yup.number()
            .nullable(true)
            .required('Required')
            .max(1000, 'We recommend aiming for a sample size of 1000 or less as we work to amplify our recruitment efforts')
            .min(1, 'Only whole numbers above 0 are valid'),
    }),
    closesAt: Yup.mixed().when('hasClosingDate', {
        is: true,
        then: Yup.date().nullable(true).required('Required'),
    }),
    stages: Yup.array().of(
        Yup.object().shape({
            availableAfterDays: Yup.number().typeError('Required').min(0).required('Required'),
        })
    ),
});

export const EditSubmittedStudy: FC<{
    study: Study,
    formDisabled?: boolean
}> = ({ study, formDisabled = false }) => {
    const api = useApi()
    const saveStudy = async (study: Study, context: FormContext<any>) => {
        const { reset } = context
        const savedStudy = await api.updateStudy({ id: Number(study.id), updateStudy: { study: study } })
        reset(savedStudy, { keepIsValid: true })
    }

    return (
        <Form
            readOnly={formDisabled}
            validationSchema={studyValidation}
            defaultValues={{
                ...study,
                hasSampleSize: !!study.targetSampleSize,
                hasClosingDate: !!study.closesAt,
                shareStudy: study.shareableAfterMonths !== null,
            }}
            onSubmit={(values, context) => saveStudy(values, context)}
            onCancel={() => {}}
        >
            <Sessions study={study} />
            <FormActions study={study} />
        </Form>
    )
}

const StudyFields: FC<{study: Study}> = ({ study }) => {
    return (
        <Box className='mt-2' direction='column' gap='xlarge'>
            <OpensAt />
            <ClosingCriteria study={study} />
        </Box>
    )
}

const Sessions: FC<{study: Study}> = ({ study }) => {
    if (study.stages?.length === 1) {
        return <StudyFields study={study} />
    }

    return (
        <Box className='mt-2' direction='column' gap='xlarge'>
            {study.stages?.map((stage, i) => {
                if (i == 0) {
                    return (
                        <Box key={stage.order} direction='column'>
                            <h4>Session {i + 1}</h4>
                            <StudyFields study={study} />
                        </Box>
                    )
                }

                return (
                    <Box direction='column' gap key={stage.order}>
                        <h4>Session {i + 1}</h4>
                        <Box className='mt-2' gap='xlarge'>
                            <Col sm={3} direction='column' gap>
                                <h6>Set an Interval*</h6>
                                <small>Set a time interval between your previous and next study sessions</small>
                            </Col>

                            <Col sm={2} direction='column' gap>
                                <Box gap align='center'>
                                    <InputField
                                        name={`stages.${i}.availableAfterDays`}
                                        placeholder='0-100'
                                        type='number'
                                    />
                                    <span>Days</span>
                                </Box>
                                <FieldErrorMessage name={`stages.${i}.availableAfterDays`}/>
                            </Col>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

const FormActions: FC<{study: Study}> = ({ study }) => {
    const nav = useNavigate()
    const { isValid, isDirty } = useFormState()
    const { handleSubmit, watch } = useFormContext()
    const api = useApi()

    if (isReadyForLaunch(study)) {
        return (
            <Box className='fixed-bottom bg-white' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
                <Box className='container-lg' align='center' justify='end'>
                    <FormSaveButton
                        className='btn-researcher-primary'
                        disabled={!isValid}
                        onSubmit={() => {
                            // call launch instead?
                            handleSubmit((study) => {
                                api.updateStudyStatus({
                                    id: study.id,
                                    study: study as Study,
                                    statusAction: 'launch',
                                }).then(() => {
                                    // Open Modal with return to dashboard button
                                    nav('/studies')
                                })
                            })
                        }}
                        css={{ width: 170, justifyContent: 'center' }}
                    >
                        Launch Study
                    </FormSaveButton>
                </Box>
            </Box>
        )
    }

    return (
        <Box className='container-lg' align='center' justify='end'>
            <FormSaveButton className='btn-researcher-primary mt-2' disabled={!isValid}>
                Publish Changes
            </FormSaveButton>
        </Box>
    )
}

const OpensAt: FC = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Opens on*</h6>
                <small>Date and Time when study is made visible to participants. Set date/time to your local timezone.</small>
            </Col>

            <Col sm={6} direction='column' gap>
                <div>
                    <DateTimeField
                        name='opensAt'
                        label='Pick a Date'
                        withTime
                        format={DateTimeFormats.shortDateTime}
                        options={{
                            defaultHour: 9,
                            minDate: 'today',
                        }}
                        hint='Your Local Timezone'
                    />
                </div>
            </Col>
        </Box>
    )
}

const ShareStudy: FC<{study: Study}> = ({ study }) => {
    const { watch } = useFormContext()

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Sharing this study for public analysis (optional)</h6>
                <small>Date & Time when study becomes public</small>
            </Col>

            <Col direction='column' gap>
                <Box gap align='center'>
                    <ResearcherCheckbox name='shareStudy' type='checkbox' id='share-study' />
                    <label htmlFor="share-study">
                        I would like to make my study available to other researchers for replication, extension, etc
                    </label>
                </Box>
                {watch('shareStudy') &&
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
    const { watch, setValue, getValues } = useFormContext()

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Closing Criteria*</h6>
                <small>Select your preferred closing criteria indicating completion of data collection process. Leave blank if unknown.</small>
                <Box gap css={{ color: colors.kineticResearcher }} align='center'>
                    <small>Recommended Sample Size</small>
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
                            onChange={() => {
                                const checked = getValues('hasSampleSize')
                                if (!checked) {
                                    setValue('targetSampleSize', null, { shouldValidate: true })
                                }
                            }}
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
                        <FieldErrorMessage name='targetSampleSize'/>
                    </Col>
                </Box>

                <Box gap>
                    <Col gap sm={3} direction='row' align='center'>
                        <ResearcherCheckbox
                            name='hasClosingDate'
                            type='checkbox'
                            id='closing-date'
                            onChange={() => {
                                const checked = getValues('hasClosingDate')
                                if (!checked) {
                                    setValue('closesAt', null, { shouldValidate: true })
                                }
                            }}
                        />
                        <label htmlFor='closing-date'>By due date</label>
                    </Col>
                    <Col sm={5}>
                        <DateTime
                            name='closesAt'
                            readOnly={!watch('hasClosingDate')}
                            placeholder='Pick a Date'
                            format={DateTimeFormats.shortDateTime}
                            options={{
                                defaultHour: 9,
                                minDate: watch('opensAt'),
                            }}
                            withTime
                        />
                        <FieldErrorMessage name='closesAt'/>
                    </Col>
                </Box>
            </Col>
        </Box>
    )
}
