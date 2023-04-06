import { Box, React, useEffect, useMemo, useNavigate, useParams, useState } from '@common'
import { useApi, useQueryParam } from '@lib';
import { EditingStudy } from '@models';
import { LoadingAnimation, TopNavBar } from '@components';
import { ProgressBar } from './progress-bar';
import { ExitButton } from './researcher-study-landing';
import { Col, Form, useFormContext, useFormState, Yup } from '@nathanstitt/sundry';
import { ResearchTeam } from './forms/research-team';
import { InternalDetails } from './forms/internal-details';
import { ParticipantView } from './forms/participant-view';
import { AdditionalSessions } from './forms/additional-sessions';
import { NewStudy, Study } from '@api';
import { ActionFooter } from './action-footer';
import { ReactNode } from 'react';

export type StepKey =
    'research-team' |
    'internal-details' |
    'participant-view' |
    'additional-sessions' |
    'waiting-period' |
    'finalize-study'

interface Action {
    text: string
    action?: Function
    disabled?: boolean
}

export interface Step {
    index: number
    component?: ReactNode
    text: string
    key: StepKey
    optional?: boolean
    disabled?: boolean
    primaryAction?: Action
    secondaryAction?: Action
    backAction?: () => void
}

const getValidationSchema = (studies: Study[], study: EditingStudy) => {
    const allOtherStudies = useMemo(() => studies?.filter(s => 'id' in study && s.id !== study.id), [studies])
    return Yup.object().shape({
        titleForResearchers: Yup.string().when('step', {
            is: 0,
            then: (s) => s.required('Required').max(100)
                    .test(
                        'Unique',
                        'This study title is already in use. Please change your study title to make it unique.',
                        (value) => {
                            if (!studies.length) {
                                return true
                            }
                            return allOtherStudies.every(study => study.titleForResearchers?.toLowerCase() !== value?.toLowerCase())
                        }
                    ),
        }),
        internalDescription: Yup.string().max(250).when('step', {
            is: 0,
            then: (s) => s.required('Required'),
        }),
        stages: Yup.array().of(
            Yup.object({
                points: Yup.number().required(),
                duration: Yup.number().required(),
                feedbackTypes: Yup.array().test(
                    'At least one',
                    'Select at least one item',
                    (feedbackTypes) => (feedbackTypes?.length || 0) > 0
                ),
            })
        ),
        titleForParticipants: Yup.string()
            .when('step', {
                is: 2,
                then: (s) =>
                    s.required('Required').max(45).test(
                        'Unique',
                        'This study title is already in use. Please change your study title to make it unique.',
                        (value) => {
                            if (!studies.length) {
                                return true
                            }
                            return allOtherStudies.every(study => study.titleForParticipants?.toLowerCase() !== value?.toLowerCase())
                        }
                    ),
            }),
    })
}

export default function EditStudy() {
    const api = useApi()
    const [study, setStudy] = useState<EditingStudy | null>()
    const [allStudies, setAllStudies] = useState<Study[]>([])
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id

    useEffect(() => {
        api.getStudies().then(studies => {
            setAllStudies(studies.data || [])
            if (isNew) {
                setStudy({
                    titleForResearchers: '',
                    internalDescription: '',
                    titleForParticipants: ' ',
                    shortDescription: '',
                    longDescription: '',
                    stages: [],
                })
                return
            }
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            } else {
                // setError('study was not found')
            }
        })
    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study details" />
    }

    return (
        <Box direction='column' className='edit-study vh-100'>
            <TopNavBar hideBanner/>
            <StudyForm study={study} studies={allStudies}>
                <FormContent study={study} />
            </StudyForm>
        </Box>
    )
}

const StudyForm: FCWC<{ study: EditingStudy, studies: Study[] }> = ({ study, studies, children }) => {
    // const initialStep = +useQueryParam('step') || 0

    return (
        <Form
            validationSchema={getValidationSchema(studies, study)}
            defaultValues={{ ...study, step: 0 }}
            onSubmit={() => {}}
            onCancel={() => {}}
            className='h-100'
        >
            {children}
        </Form>
    )
}

const FormContent: FC<{study: EditingStudy}> = ({ study }) => {
    const { watch, setValue, trigger } = useFormContext()
    const formState = useFormState()
    const currentStep = watch('step')
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id
    const nav = useNavigate()
    const api = useApi()

    const { isValid } = formState

    const saveStudy = async (study: EditingStudy) => {
        if (isNew) {
            const savedStudy = await api.addStudy({
                addStudy: {
                    study: study as NewStudy,
                },
            })
            if (savedStudy) {
                nav(`/study/edit/${savedStudy.id}?step=${currentStep}`)
            }
        } else {
            await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
        }
    }

    const steps: Step[] = [
        {
            index: 0,
            component: <InternalDetails study={study} />,
            text: 'Internal Details',
            key: 'internal-details',
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    const valid = await trigger()
                    if (valid) {
                        await saveStudy(watch() as EditingStudy)
                        setValue('step', 1)
                    }
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                disabled: !isValid,
                action: () => saveStudy(watch() as EditingStudy),
            },
        },
        {
            index: 1,
            component: <ResearchTeam study={study} />,
            text: 'Research Team',
            key: 'research-team',
            backAction: () => setValue('step', 0),
            primaryAction: {
                text: 'Continue',
                action: async () => {
                    // save study?
                    const valid = await trigger()
                    setValue('step', 2)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: () => saveStudy(watch() as EditingStudy),
            },
        },
        {
            index: 2,
            component: <ParticipantView study={study} />,
            text: 'Participant View',
            key: 'participant-view',
            backAction: () => setValue('step', 1),
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setValue('step', 3)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: () => saveStudy(watch() as EditingStudy),

            },
        },
        {
            index: 3,
            component: <AdditionalSessions study={study} />,
            text: 'Additional Sessions (optional)',
            key: 'additional-sessions',
            backAction: () => setValue('step', 2),
            optional: true,
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setValue('step', 4)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: () => saveStudy(watch() as EditingStudy),
            },
        },
        {
            index: 4,
            text: 'Waiting Period',
            key: 'waiting-period',
            disabled: true,
        },
        {
            index: 5,
            text: 'Finalize Study',
            key: 'finalize-study',
            disabled: true,
        },
    ]

    return (
        <Box direction='column' justify='between' className='h-100'>
            <div className="container-lg py-4 mb-10">
                <Box justify='between'>
                    <Col sm={1}>
                        <span></span>
                    </Col>
                    <Col sm={10}>
                        <ProgressBar steps={steps} currentStep={steps[currentStep]} setStepIndex={(i) => setValue('step', i)}/>
                    </Col>
                    <Col sm={1}>
                        <ExitButton step={steps[currentStep]} />
                    </Col>
                </Box>
                {steps[currentStep].component}
            </div>
            <ActionFooter step={steps[currentStep]} />
        </Box>
    )
}
