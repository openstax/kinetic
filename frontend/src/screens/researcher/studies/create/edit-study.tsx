import { React, useMemo, useNavigate, useParams, useState, Yup } from '@common'
import { useApi, useQueryParam } from '@lib';
import { isDraft, useFetchStudy } from '@models';
import {
    ConfirmNavigationIfDirty,
    ExitButton,
    Form,
    LoadingAnimation,
    Page,
    ResearcherProgressBar,
    showResearcherNotification,
    Step,
    useFormContext,
    useFormState,
} from '@components';
import { researcherValidation, ResearchTeam } from './forms/research-team';
import { InternalDetails, internalDetailsValidation } from './forms/internal-details';
import { ParticipantView, participantViewValidation } from './forms/participant-view';
import { AdditionalSessions } from './forms/additional-sessions';
import { NewStudy, ResearcherRoleEnum, Study } from '@api';
import { ActionFooter } from './action-footer';
import { colors } from '@theme';
import { ReviewStudy, SubmitStudyModal } from './forms/review-study';
import { noop } from 'lodash-es';
import { useLocalstorageState } from 'rooks';
import { Navigate } from 'react-router-dom';
import { Box, Grid, Stack } from '@mantine/core';
import { useEffect } from 'react';

const buildValidationSchema = (allOtherStudies: Study[]) => {
    return Yup.object().shape({
        ...internalDetailsValidation(allOtherStudies),
        ...researcherValidation(),
        ...participantViewValidation(allOtherStudies),
    })
}

const getFormDefaults = (study: Study, step: StudyStep) => {
    const pi = study.researchers?.find(r => r.role === ResearcherRoleEnum.Pi)?.id
    const lead = study.researchers?.find(r => r.role === ResearcherRoleEnum.Lead)?.id
    return {
        ...study,
        researcherPi: pi,
        researcherLead: lead,
        stages: study.stages,
        step,
    }
}

export default function EditStudy() {
    const id = useParams<{ id: string }>().id
    const { loading, study, setStudy, allStudies } = useFetchStudy(id || 'new')

    if (loading) {
        return <LoadingAnimation />
    }

    if (!study) {
        return <Navigate to={'/studies'} />
    }

    return (
        <Page className='edit-study' backgroundColor={colors.white} hideFooter>
            <StudyForm study={study} studies={allStudies}>
                <FormContent study={study} setStudy={setStudy} />
            </StudyForm>
        </Page>
    )
}

const StudyForm: FCWC<{ study: Study, studies: Study[] }> = ({ study, studies, children }) => {
    const id = useParams<{ id: string }>().id
    const [studyProgressStep] = useLocalstorageState(`study-progress-${id}`, 0)
    let initialStep = +useQueryParam('step') || studyProgressStep

    const defaults = useMemo(() => {
        return getFormDefaults(study, initialStep)
    }, [])

    const allOtherStudies = useMemo(() => studies?.filter(s => 'id' in study && s.id !== study.id), [studies])
    const validationSchema = useMemo(() => {
        return buildValidationSchema(allOtherStudies)
    }, [study])

    return (
        <Form
            validationSchema={validationSchema}
            defaultValues={defaults}
            onSubmit={noop}
            onCancel={noop}
        >
            {children}
        </Form>
    )
}

export enum StudyStep {
    InternalDetails = 0,
    ResearchTeam = 1,
    ParticipantView = 2,
    AdditionalSessions = 3,
    ReviewStudy = 4,
}

const FormContent: FC<{
    study: Study,
    setStudy: (study: Study) => void
}> = ({ study, setStudy }) => {
    const {
        watch,
        setValue,
        getValues,
        reset,
        setFormError,
    } = useFormContext()
    const [showSubmitStudy, setShowSubmitStudy] = useState(false)
    const currentStep: number = watch('step')
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id
    const nav = useNavigate()
    const api = useApi()
    const [, setStudyProgressStep] = useLocalstorageState<StudyStep>(`study-progress-${id}`)
    const [maxStep, setMaxStep] = useLocalstorageState<StudyStep>(`study-max-progress-${id}`, 0)
    const { isValid, isDirty } = useFormState()

    useEffect(() => {
        if (!isDraft(study) && !isNew) {
            nav(`/study/overview/${id}`)
        }
    }, [])


    const setStep = (step: StudyStep) => {
        setValue('step', step, { shouldValidate: true, shouldTouch: true })
        if (!isNew) {
            setStudyProgressStep(step)
        }
        if (step > maxStep) {
            setMaxStep(step)
        }
    }

    const saveStudy = async (goToStep: number) => {
        const study = getValues() as Study
        if (isNew) {
            // Need to reset the dirty state before navigating to edit/{id}
            reset(undefined, { keepValues: true, keepDirty: false });

            const savedStudy = await api.addStudy({
                addStudy: { study: study as NewStudy },
            }).catch((err) => setFormError(err))

            if (savedStudy) {
                showResearcherNotification(`New copy of '${study.titleForResearchers}' has been created and saved as a draft. It can now be found under ‘Draft’.`)
                setStudy(savedStudy)
                return nav(`/study/edit/${savedStudy.id}?step=1`)
            }
        }

        if (!isDirty) {
            return;
        }

        const savedStudy = await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
        reset(getFormDefaults(savedStudy, goToStep), { keepIsValid: true, keepDirty: false })
        setStudy(savedStudy)
    }

    const saveAsDraft = async () => {
        saveStudy(currentStep).then(() => {
            showResearcherNotification(`New edits to the study “${study.titleForResearchers}” have successfully been saved.`)
        })
    }

    const steps: Step[] = [
        {
            index: StudyStep.InternalDetails,
            component: <InternalDetails />,
            text: 'Internal Details',
            primaryAction: {
                text: 'Save & Continue',
                disabled: !isValid,
                action: async () => {
                    await saveStudy(currentStep)
                    setStep(StudyStep.ResearchTeam)
                },
            },
        },
        {
            index: StudyStep.ResearchTeam,
            component: <ResearchTeam study={study} />,
            text: 'Research Team',
            backAction: () => {
                if (!isDirty) {
                    return setStep(StudyStep.InternalDetails)
                }
                saveStudy(StudyStep.InternalDetails)
            },
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.ParticipantView)
                    }

                    await saveStudy(currentStep)
                    setStep(StudyStep.ParticipantView)
                    showResearcherNotification(`Invitations to collaborate on study '${study.titleForResearchers}' have successfully been sent.`)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveAsDraft,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.ParticipantView,
            component: <ParticipantView study={study} />,
            text: 'Participant View',
            backAction: () => {
                if (!isDirty) {
                    return setStep(StudyStep.ResearchTeam)
                }
                saveStudy(StudyStep.ResearchTeam)
            },
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.AdditionalSessions)
                    }
                    await saveStudy(currentStep)
                    setStep(StudyStep.AdditionalSessions)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveAsDraft,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.AdditionalSessions,
            component: <AdditionalSessions study={study} />,
            text: 'Additional Sessions (optional)',
            backAction: () => {
                if (!isDirty) {
                    return setStep(StudyStep.ParticipantView)
                }
                saveStudy(StudyStep.ParticipantView)
            },
            optional: true,
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.ReviewStudy)
                    }
                    await saveStudy(currentStep)
                    setStep(StudyStep.ReviewStudy)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveAsDraft,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.ReviewStudy,
            component: <ReviewStudy study={study} />,
            text: 'Review Study',
            backAction: () => {
                if (!isDirty) {
                    return setStep(StudyStep.AdditionalSessions)
                }
                saveStudy(StudyStep.AdditionalSessions)
            },
            primaryAction: {
                text: 'Submit Study',
                action: () => {
                    setShowSubmitStudy(true)
                },
            },
        },
    ]

    return (
        <Stack justify='space-between' className='edit-study-form'>
            <ConfirmNavigationIfDirty />
            <SubmitStudyModal study={study as Study} show={showSubmitStudy} setShow={setShowSubmitStudy} />
            <Grid gutter='xl' py='lg' justify='space-between'>
                <Grid.Col span={1}></Grid.Col>
                <Grid.Col span={9}>
                    <ResearcherProgressBar steps={steps} currentStep={steps[currentStep]} setStep={setStep} maxStep={maxStep}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <ExitButton navTo='/studies'/>
                </Grid.Col>
            </Grid>
            <Box pb='120px'>
                {steps[currentStep].component}
            </Box>
            <ActionFooter step={steps[currentStep]} />
        </Stack>
    )
}
