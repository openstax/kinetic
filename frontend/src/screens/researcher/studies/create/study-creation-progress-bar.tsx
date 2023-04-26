import { Box, React } from '@common';
import { colors } from '@theme';
import ActiveStep from '@images/icons/active-step.svg'
import InactiveStep from '@images/icons/inactive-step.svg'
import CompletedStep from '@images/icons/completed-step.svg'
import OptionalStep from '@images/icons/optional-step.svg'
import DisabledStep from '@images/icons/disabled-step.svg'
import { Step, StudyStep } from './edit-study';

const getLineColor = (step: Step, currentStep: Step, finalStep: boolean = false) => {
    if (finalStep) {
        if (step.index === currentStep.index) {
            return `linear-gradient(90deg, ${colors.kineticResearcher} 50%, rgba(0,0,0,0) 50%)`
        } else {
            return `linear-gradient(90deg, ${colors.lightGray} 50%, rgba(0,0,0,0) 50%)`
        }
    }

    if (step.index === currentStep.index) {
        return `linear-gradient(90deg, ${colors.kineticResearcher} 50%, ${colors.lightGray} 50%)`
    }

    if (step.index < currentStep.index) {
        return colors.kineticResearcher
    } else {
        return colors.lightGray
    }
}

// TODO remove onclick / setStepIndex after dev (just a dev superpower)
export const StudyCreationProgressBar: FC<{
    steps: Step[],
    currentStep: Step,
    setStepIndex: (index: number) => void
}> = ({ steps, currentStep, setStepIndex }) => {
    return (
        <Box width='100%'>
            {steps.map((step, i) => {
                return (
                    <Box key={step.index} direction='column' flex={{ grow: 1 }} gap='large'>
                        <Box
                            css={{
                                background: getLineColor(step, currentStep, step.index === steps.length - 1),
                                height: 7,
                                borderRadius: i === 0 ? `5px 0 0 5px` : 0 ,
                            }}
                            justify='center'
                            align='center'
                            onClick={() => setStepIndex(step.index)}
                        >
                            <StepIcon step={step} currentStep={currentStep} />
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

const StepIcon: FC<{step: Step, currentStep: Step}> = ({ step, currentStep }) => {
    if (step.index < currentStep.index) {
        if (currentStep.index === StudyStep.ReviewStudy || currentStep.index === StudyStep.FinalizeStudy) {
            return <img height={25} src={InactiveStep} alt='complete' />
        }
        return <img height={25} src={CompletedStep} alt='complete' />
    }

    if (step.optional) {
        return <img height={25} src={OptionalStep} alt='optional' />
    }

    if (step.disabled) {
        return <img height={25} src={DisabledStep} alt='disabled' />
    }

    return <img height={25} src={ActiveStep} alt='active' />
}
