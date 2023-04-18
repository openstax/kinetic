import { Box, React, useEffect, useMemo, useNavigate, useParams, useState } from '@common'
import { useApi, useQueryParam } from '@lib';
import { EditingStudy } from '@models';
import { Icon, LoadingAnimation, TopNavBar } from '@components';
import { ProgressBar } from './progress-bar';
import { Button, Col, Form, Modal, useFormContext, useFormState, Yup } from '@nathanstitt/sundry';
import { ResearchTeam } from './forms/research-team';
import { InternalDetails } from './forms/internal-details';
import { ParticipantView } from './forms/participant-view';
import { AdditionalSessions } from './forms/additional-sessions';
import { NewStudy, ResearcherRoleEnum, Study } from '@api';
import { ActionFooter } from './action-footer';
import { ReactNode } from 'react';
import { colors } from '@theme';

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
        researcherPi: Yup.number().when('step', {
            is: 1,
            then: Yup.number().required(),
        }),
        researcherLead: Yup.number().when('step', {
            is: 1,
            then: Yup.number().required(),
        }),
        stages: Yup.array().when('step', {
            is: 2,
            then: Yup.array().of(
                Yup.object({
                    points: Yup.number(),
                    duration: Yup.number(),
                    feedbackTypes: Yup.array().test(
                        'At least one',
                        'Select at least one item',
                        (feedbackTypes) => (feedbackTypes?.length || 0) > 0
                    ),
                })
            ),
        }),
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
                })
                return
            }
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            } else {
                // setError('study was not found')
                // Navigate back to /studies if no study found?
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
    const initialStep = +useQueryParam('step') || 0
    const { pi, lead } = useMemo(() => {
        const pi = study.researchers?.find(r => r.role === ResearcherRoleEnum.Pi)?.id
        const lead = study.researchers?.find(r => r.role === ResearcherRoleEnum.Lead)?.id
        return { pi, lead }
    }, [study.researchers])

    return (
        <Form
            validationSchema={getValidationSchema(studies, study)}
            defaultValues={{
                ...study,
                step: initialStep,
                researcherPi: pi,
                researcherLead: lead,
            }}
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

    const currentStep = watch('step')
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id
    const nav = useNavigate()
    const api = useApi()

    const { isValid, isDirty } = useFormState()

    const setStep = (index: number) => {
        setValue('step', index, { shouldValidate: true })
    }

    const saveStudy = async (study: EditingStudy) => {
        console.log(isNew);
        if (isNew) {
            const savedStudy = await api.addStudy({
                addStudy: {
                    study: study as NewStudy,
                },
            })
            if (savedStudy) {
                nav(`/study/edit/${savedStudy.id}?step=${currentStep + 1}`)
            }
        } else {
            isDirty && await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
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
                        setStep(1)
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
            backAction: () => setStep(0),
            primaryAction: {
                text: 'Continue',
                action: async () => {
                    // save study?
                    const valid = await trigger()
                    setStep(2)
                },
                // TODO disable if dirty, make sure
                disabled: !isDirty,
            },
            secondaryAction: {
                text: 'Save as draft',
                action: () => saveStudy(watch() as EditingStudy),
                disabled: !isDirty,
            },
        },
        {
            index: 2,
            component: <ParticipantView study={study} />,
            text: 'Participant View',
            key: 'participant-view',
            backAction: () => setStep(1),
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setStep(3)
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
            backAction: () => setStep(2),
            optional: true,
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setStep(4)
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
                        <ProgressBar steps={steps} currentStep={steps[currentStep]} setStepIndex={(i) => setStep(i)}/>
                    </Col>
                    <Col sm={1}>
                        <ExitButton isNew={isNew} />
                    </Col>
                </Box>
                {steps[currentStep].component}
            </div>
            <ActionFooter step={steps[currentStep]} />
        </Box>
    )
}

const ExitButton: FC<{
    isNew?: boolean
}> = ({ isNew }) => {
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const { isDirty } = useFormState()

    const nav = useNavigate()
    return (
        <div>
            <h6
                css={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '.5rem',
                    color: colors.grayText,
                    cursor: 'pointer',
                    alignSelf: 'end',
                }}
                onClick={() => {
                    if (isDirty && !isNew) {
                        setShowWarning(true)
                    } else {
                        nav('/studies')
                    }
                }}
            >
                Exit
            </h6>
            <Modal
                center
                show={showWarning}
                large
            >
                <Modal.Body>
                    <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                        <Box gap='large' align='center'>
                            <Icon height={20} icon="warning" color={colors.red} />
                            <span className='fs-4 fw-bold'>Exit Page</span>
                        </Box>
                        <Box align='center' direction='column'>
                            <span>You're about to leave this study creation process.</span>
                            <span>Would you like to save the changes you made thus far?</span>
                        </Box>
                        <Box gap='large'>
                            <Button className='btn-researcher-secondary' onClick={() => {
                                nav('/studies')
                            }}>
                                No, discard changes
                            </Button>
                            <Button className='btn-researcher-primary' onClick={() => {
                                // save, then navigate away
                            }}>
                                Yes, save changes
                            </Button>
                        </Box>
                    </Box>
                </Modal.Body>
            </Modal>
        </div>
    )
}
