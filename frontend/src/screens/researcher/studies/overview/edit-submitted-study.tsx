import { Study } from '@api';
import { useApi, useQueryParam } from '@lib';
import { FormContext } from '@nathanstitt/sundry/form-hooks';
import {
    Col,
    ConfirmNavigationIfDirty,
    DateTime,
    DateTimeFormats,
    FieldErrorMessage,
    FieldTitle,
    Form,
    FormSaveButton,
    Icon,
    InputField,
    Modal,
    ResearcherButton,
    ResearcherCheckbox,
    useFormContext,
    useFormState,
} from '@components';
import { Box, React, useNavigate, useState, Yup } from '@common';
import { getFirstStage, isCompleted, isReadyForLaunch } from '@models';
import { colors } from '@theme';

const studyValidation = Yup.object().shape({
    opensAt: Yup.mixed().required(),
    targetSampleSize: Yup.mixed().when('hasSampleSize', {
        is: true,
        then: Yup.number()
            .nullable(true)
            .required('Required')
            .min(1, 'Only whole numbers above 0 are valid'),
    }),
    closesAt: Yup.mixed().when('hasClosingDate', {
        is: true,
        then: Yup.date().nullable(true).required('Required'),
    }),
    publicOn: Yup.mixed().when('shareStudy', {
        is: true,
        then: Yup.date().nullable(true).required('Required'),
    }),
    stages: Yup.array().of(
        Yup.object().shape({
            availableAfterDays: Yup.number().typeError('Required').min(1, 'Only whole numbers above 0 are valid').required('Required'),
        })
    ),
});

const getDefaultValues = (study: Study, reopening = false) => {
    return {
        ...study,
        hasSampleSize: reopening ? false : !!study.targetSampleSize,
        hasClosingDate: reopening ? false : !!study.closesAt,
        closesAt: reopening ? null : study.closesAt,
        targetSampleSize: reopening ? null : study.targetSampleSize,
        shareStudy: !!study.publicOn,
        stages: isReadyForLaunch(study) ? study.stages?.map((stage, index) => {
            if (index == 0) {
                return stage
            }
            return ({
                ...stage,
                availableAfterDays: undefined,
            })
        }) : study.stages,
    }
}

export const EditSubmittedStudy: FC<{ study: Study }> = ({ study }) => {
    const api = useApi()
    const reopening: boolean = useQueryParam('reopen') || false

    const saveStudy = async (study: Study, context: FormContext<any>) => {
        const { reset } = context
        const savedStudy = await api.updateStudy({ id: Number(study.id), updateStudy: { study: study } })
        reset(getDefaultValues(savedStudy), { keepIsValid: true })
    }

    const isDisabled = !reopening && isCompleted(study)

    return (
        <Form
            readOnly={isDisabled}
            validationSchema={studyValidation}
            defaultValues={getDefaultValues(study, reopening)}
            onSubmit={(values, context) => saveStudy(values, context)}
            onCancel={() => {}}
        >
            <ConfirmNavigationIfDirty />
            <Box direction='column' gap='xlarge'>
                <Sessions study={study} />
                <ShareStudy study={study} />
                <FormActions study={study} />
            </Box>
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
                                <FieldTitle required>Set an Interval</FieldTitle>
                                <small>Set a time interval between your previous and next study sessions</small>
                            </Col>

                            <Col sm={2} direction='column' gap>
                                <Box gap align='center'>
                                    <InputField
                                        name={`stages.${i}.availableAfterDays`}
                                        placeholder='1-100'
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
    const { isValid, isDirty } = useFormState()
    const api = useApi()
    const [show, setShow] = useState(false)
    const { getValues, reset } = useFormContext()

    if (isReadyForLaunch(study)) {
        return (
            <Box className='fixed-bottom bg-white' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
                <Box className='container-lg' align='center' justify='end'>
                    <ResearcherButton
                        disabled={!isValid}
                        data-testid='launch-study-button'
                        onClick={() => {
                            api.updateStudyStatus({
                                id: study.id,
                                study: getValues() as Study,
                                statusAction: 'launch',
                            }).then(() => {
                                reset(undefined, { keepValues: true, keepDirty: false });
                                setShow(true)
                            })
                        }}
                    >
                        Launch Study
                    </ResearcherButton>
                    <LaunchStudyModal show={show} setShow={setShow} />
                </Box>
            </Box>
        )
    }

    return (
        <Box className='container-lg' align='center' justify='end'>
            <FormSaveButton className='btn-researcher-primary mt-2' disabled={!isValid || !isDirty}>
                Publish Changes
            </FormSaveButton>
        </Box>
    )
}

const LaunchStudyModal: FC<{show: boolean, setShow: (show: boolean) => void}> = ({ show, setShow }) => {
    const nav = useNavigate()
    return (
        <Modal
            center
            show={show}
            large
            closeBtn={false}
            onHide={() => setShow(false)}
        >
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='xlarge'>
                    <Box align='center' className='text-center' direction='column'>
                        <span>Congratulations! Your study has been successfully launched on Kinetic, and can now be found under 'Studies'. Please note, it will only become available to participants at your set opening date </span>
                    </Box>
                    <ResearcherButton onClick={() => {
                        setShow(false)
                        nav('/studies')
                    }}>
                        Return to Dashboard
                    </ResearcherButton>
                </Box>
            </Modal.Body>
        </Modal>
    )
}

const OpensAt: FC = () => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <FieldTitle required>Opens on</FieldTitle>
                <small>Date and Time when the study is made visible to participants. Set date/time to your local timezone.</small>
            </Col>

            <Col sm={5} direction='column' gap>
                <DateTime
                    name='opensAt'
                    placeholder='Select a date'
                    withTime
                    options={{
                        defaultHour: 9,
                    }}
                />
            </Col>
        </Box>
    );
}


const ShareStudy: FC<{study: Study}> = () => {
    const { watch, setValue, getValues, trigger } = useFormContext()

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Share your study data on Kinetic (Optional)</h6>
                <small>Opting in to share your study data on Kinetic will support replication and extension of your work by other researchers</small>
            </Col>

            <Col sm={5} direction='column' gap>
                <Box gap align='center' >
                    <ResearcherCheckbox name='shareStudy' type='checkbox' id='share-study' onChange={() => {
                        trigger('publicOn').then(() => {
                            const checked = getValues('shareStudy')
                            if (!checked) {
                                setValue('publicOn', null, { shouldValidate: true, shouldTouch: true })
                            }
                        })
                    }} />
                    <label htmlFor="share-study" className='small'>
                        I would like to share my study data with other researchers on Kinetic for the purpose of replication, extension, etc.
                    </label>
                </Box>
                {watch('shareStudy') &&
                    <Col direction='row' align='center' gap>
                        <DateTime
                            name='publicOn'
                            placeholder='Share study on [select date]'
                            format={DateTimeFormats.shortDate}
                        />
                        <Icon css={{ color: colors.blue }} icon='helpCircle' tooltip="We recommend picking a date set at least 3 months after your study's opening date to allow enough time for data collection."/>
                    </Col>
                }
                <FieldErrorMessage name='publicOn'/>
            </Col>
        </Box>
    )
}

const ClosingCriteria: FC<{study: Study}> = ({ study }) => {
    const { watch, setValue, getValues, trigger } = useFormContext()

    const firstStage = getFirstStage(study)
    if (!firstStage) {
        return null
    }

    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6>Closing Criteria (optional)</h6>
                <small>Select your preferred closing criteria indicating completion of data collection process. Leave blank if unknown.</small>
                <Box gap css={{ color: colors.blue }} align='center'>
                    <small>Recommended Sample Size</small>
                    <Icon icon='helpCircle' tooltip='Consider Inflating sample size by 5% of your desired N to enable exclusion as we work to amplify our recruitment efforts'/>
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
                                    setValue('targetSampleSize', undefined, { shouldValidate: true })
                                }
                                trigger('targetSampleSize')
                            }}
                        />
                        <label htmlFor='sample-size'>By sample size</label>
                    </Col>
                    <Col sm={5} gap>
                        <InputField
                            name='targetSampleSize'
                            disabled={!watch('hasSampleSize')}
                            placeholder='1-1000'
                            type='number'
                        />
                        {watch('targetSampleSize') > 1000 && <small css={{ color: colors.blue }}>
                            We recommend aiming for a sample size of 1000 or less as we work to amplify our recruitment efforts
                        </small>}
                        <FieldErrorMessage name='targetSampleSize'/>
                    </Col>
                </Box>

                <Box gap>
                    <Col gap sm={3} direction='row' align='center'>
                        <ResearcherCheckbox
                            name='hasClosingDate'
                            type='checkbox'
                            id='closing-date'
                            onChange={async () => {
                                const checked = getValues('hasClosingDate')
                                if (!checked) {
                                    setValue('closesAt', null, { shouldValidate: true })
                                }
                                await trigger('closesAt')
                            }}
                        />
                        <label htmlFor='closing-date'>By due date</label>
                    </Col>
                    <Col sm={5}>
                        <DateTime
                            name='closesAt'
                            readOnly={!watch('hasClosingDate')}
                            format={DateTimeFormats.shortDateTime}
                            options={{
                                defaultHour: 9,
                                minDate: watch('opensAt'),
                                minTime: watch('opensAt'),
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
