import { Box, React, styled } from '@common';
import { colors } from '@theme';
import ActiveStep from '@images/icons/active-step.svg'
import InactiveStep from '@images/icons/inactive-step.svg'
import CompletedStep from '@images/icons/completed-step.svg'
import OptionalStep from '@images/icons/optional-step.svg'
import DisabledStep from '@images/icons/disabled-step.svg'
import { Step, StudyStep } from './edit-study';

const getLineColor = (step: Step, currentStep: Step) => {
    if (step.index === currentStep.index) {
        return `linear-gradient(90deg, ${colors.kineticResearcher} 50%, ${colors.lightGray} 50%)`
    }

    if (step.index < currentStep.index) {
        return colors.kineticResearcher
    } else {
        return colors.lightGray
    }
}

export const StudyCreationProgressBar: FC<{
    steps: Step[],
    currentStep: Step,
    setStepIndex: (index: number) => void
}> = ({ steps, currentStep, setStepIndex }) => {
    const onClickStep = (step: Step) => {
        // TODO uncomment after dev, users cant navigate if on the following steps
        // if (currentStep.index === StudyStep.ReviewStudy || currentStep.index === StudyStep.FinalizeStudy) {
        //     return
        // }

        setStepIndex(step.index)
    }

    return (
        <Box width='100%'>
            {steps.map((step) => {
                return (
                    <Box key={step.index} direction='column' flex={{ grow: 1 }} gap='large' onClick={() => onClickStep(step)}>
                        <Box
                            css={{
                                background: getLineColor(step, currentStep),
                                height: 7,
                                width: '105%',
                                borderRadius: 5,
                            }}
                            justify='center'
                            align='center'
                        >
                            <StepIcon step={step} currentStep={currentStep} />
                        </Box>
                        <small className='x-small' css={{ alignSelf: 'center' }}>
                            {step.text}
                        </small>
                    </Box>
                )
            })}
        </Box>
    )
}

const StepIcon: FC<{step: Step, currentStep: Step}> = ({ step, currentStep }) => {
    if (step.index < currentStep.index) {
        // if (currentStep.index === StudyStep.ReviewStudy || currentStep.index === StudyStep.FinalizeStudy) {
        //     return <img height={25} src={InactiveStep} alt='complete' />
        // }
        return <img height={25} src={CompletedStep} alt='complete' />
    }

    if (step.index === StudyStep.AdditionalSessions) {
        return <img height={25} src={OptionalStep} alt='optional' />
    }

    if (step.index > currentStep.index) {
        return <img height={25} src={DisabledStep} alt='disabled' />
    }

    return <img height={25} src={ActiveStep} alt='active' />
}
