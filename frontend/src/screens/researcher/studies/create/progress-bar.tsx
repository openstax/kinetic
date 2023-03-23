import { Box, React } from '@common';
import { colors } from '@theme';
import ActiveStep from '@images/icons/active-step.svg'
import CompletedStep from '@images/icons/completed-step.svg'
import OptionalStep from '@images/icons/optional-step.svg'
import DisabledStep from '@images/icons/disabled-step.svg'
import { Step } from './edit-study';


const getLineColor = (step: Step, currentStepIndex: number, finalStep: boolean = false) => {
    if (finalStep) {
        if (step.index === currentStepIndex) {
            return `linear-gradient(90deg, ${colors.kineticResearcher} 50%, rgba(0,0,0,0) 50%)`
        } else {
            return `linear-gradient(90deg, ${colors.lightGray} 50%, rgba(0,0,0,0) 50%)`
        }
    }

    if (step.index === currentStepIndex) {
        return `linear-gradient(90deg, ${colors.kineticResearcher} 50%, ${colors.lightGray} 50%)`
    }

    if (step.index < currentStepIndex) {
        return colors.kineticResearcher
    }

    return colors.lightGray
}

export const ProgressBar: FC<{
    steps: Step[],
    currentStep: Step,
    setStepIndex: (index: number) => void
}> = ({ steps, currentStep, setStepIndex }) => {
    return (
        <Box width='100%'>
            {steps.map((step) => {
                return (
                    <Box key={step.index} direction='column' flex={{ grow: 1 }} gap='large'>
                        <Box
                            css={{
                                background: getLineColor(step, currentStep.index, step.index === steps.length - 1),
                                height: 7,
                                width: '101%',
                                borderRadius: `5px 0 0 5px`,
                            }}
                            justify='center'
                            align='center'
                            onClick={() => setStepIndex(step.index)}
                        >
                            <StepIcon step={step} currentIndex={currentStep.index} />
                        </Box>
                        <small className='x-small' css={{ alignSelf: 'center' }} onClick={() => setStepIndex(step.index)}>
                            {step.text}
                        </small>
                    </Box>
                )
            })}
        </Box>
    )
}

const StepIcon: FC<{step: Step, currentIndex: number}> = ({ step, currentIndex }) => {
    if (step.index < currentIndex) {
        return <img src={CompletedStep} alt='complete' />
    }

    if (step.optional) {
        return <img src={OptionalStep} alt='optional' />
    }

    if (step.disabled) {
        return <img src={DisabledStep} alt='disabled' />
    }

    return <img src={ActiveStep} alt='active' />
}
