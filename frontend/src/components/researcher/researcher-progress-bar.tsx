import { React } from '@common';
import { colors } from '@theme';
import ActiveStep from '@images/icons/active-step.svg'
import CompletedStep from '@images/icons/completed-step.svg'
import OptionalStep from '@images/icons/optional-step.svg'
import DisabledStep from '@images/icons/disabled-step.svg'
import { ReactNode } from 'react';
import { Group, Stack, Text } from '@mantine/core';

export interface StepAction {
    text: string
    action?: Function
    disabled?: boolean
}

export interface Step {
    index: number
    component?: ReactNode
    text: string
    primaryAction?: StepAction
    secondaryAction?: StepAction
    backAction?: () => void
    optional?: boolean
}

const getLineColor = (step: Step, currentStep: Step) => {
    if (step.index === currentStep.index) {
        return `linear-gradient(90deg, ${colors.blue} 50%, ${colors.gray50} 50%)`
    }

    if (step.index < currentStep.index) {
        return colors.blue
    } else {
        return colors.gray50
    }
}

export const ResearcherProgressBar: FC<{
    steps: Step[],
    currentStep: Step,
    setStep: (step: number) => void,
    maxStep: number,
}> = ({ steps, currentStep, setStep, maxStep }) => {
    const navigateToStep = (step: Step) => {
        if (step.index <= maxStep) {
            setStep(step.index)
        }
    }
    return (
        <Group gap='0'>
            {steps.map((step) => {
                return (
                    <Stack key={step.index} onClick={() => navigateToStep(step)} style={{ flexGrow: 1 }}>
                        <Stack
                            h='7px'
                            w='105%'
                            css={{
                                background: getLineColor(step, currentStep),
                                borderRadius: 5,
                            }}
                            justify='center'
                        >
                            <StepIcon step={step} currentStep={currentStep} />
                        </Stack>
                        <Text size='xs' ta='center'>{step.text}</Text>
                    </Stack>
                )
            })}
        </Group>
    )
}

const StepIcon: FC<{step: Step, currentStep: Step}> = ({ step, currentStep }) => {
    if (step.index < currentStep.index) {
        return <img height={25} src={CompletedStep} alt='complete' />
    }

    if (step.optional) {
        return <img height={25} src={OptionalStep} alt='optional' />
    }

    if (step.index > currentStep.index) {
        return <img height={25} src={DisabledStep} alt='disabled' />
    }

    return <img height={25} src={ActiveStep} alt='active' />
}
