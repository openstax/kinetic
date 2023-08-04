import { Box, Col, Modal, ResearcherButton, Row } from '@components';
import { React, styled, useState } from '@common';
import { useApi, useUserPreferences } from '@lib';
import { noop } from 'lodash-es';
import Tutorial1 from '@images/analysis/tutorial1.svg'
import Tutorial2 from '@images/analysis/tutorial2.svg'
import Tutorial3 from '@images/analysis/tutorial3.svg'
import { colors } from '@theme';

const StyledModal = styled(Modal)({
    '[data-test-id="modal-close-btn"]': {
        color: 'white',
    },
})

export const AnalysisTutorial: FC<{show: boolean}> = ({ show }) => {
    const api = useApi()
    const [showTutorial, setShowTutorial] = useState(show)
    const [step, setStep] = useState(0)
    const { refetch } = useUserPreferences()

    const closeTutorial = () => {
        api.updatePreferences({ updatePreferences: { preferences: { hasViewedAnalysisTutorial: true } } }).then(() => {
            refetch().then(() => {
                setShowTutorial(false)
            })
        })
    }

    return (
        <StyledModal
            xlarge
            scrollable={false}
            center
            show={showTutorial}
            onBackdropClick={noop}
            onEscapeKeyDown={noop}
            onHide={() => closeTutorial()}
            closeBtn={true}
        >
            <Modal.Body css={{ padding: 0 }} data-testid='analysis-tutorial-modal'>
                <TutorialStep step={step} setStep={setStep} close={() => closeTutorial()} />
            </Modal.Body>
        </StyledModal>
    )
}

const TutorialStep: FC<{
    step: number,
    setStep: (step: number) => void,
    close: () => void
}> = ({ step, setStep, close }) => {
    switch(step) {
        case 0:
            return <Step1 step={step} setStep={setStep} />
        case 1:
            return <Step2 step={step} setStep={setStep} />
        case 2:
            return <Step3 step={step} setStep={setStep} close={close} />
    }

    return null
}

const Step1: FC<{step: number, setStep: (step: number) => void}> = ({ step, setStep }) => {
    return (
        <Row>
            <Col sm={6} padding='xxlarge' gap='xlarge'>
                <StepIndicator step={step} setStep={setStep}/>
                <Col>
                    <h6 css={{ color: colors.blue }}>Why is Analysis on Kinetic different?</h6>
                    <h2 className='fw-bolder'>Important Notice</h2>
                </Col>
                <p>Due to the sensitive nature of educational data, Kinetic has built in privacy-by-design. Therefore, analysis on Kinetic looks different from typical research platforms. That is, we bring your analytical software to the data instead of bringing the data to you.</p>

                <ResearcherButton data-testid='analysis-tutorial-continue' className='mt-auto' css={{ width: 100, alignSelf: 'flex-end' }} onClick={()=>setStep(1)}>
                    Continue
                </ResearcherButton>
            </Col>
            <Col sm={6}>
                <img src={Tutorial1} alt='tutorial-1'/>
            </Col>
        </Row>
    )
}

const StyledPrevious = styled.div({
    color: colors.text,
    textDecoration: 'underline',
    textUnderlineOffset: 5,
    cursor: 'pointer',
    alignSelf: 'center',
})

const Step2: FC<{step: number, setStep: (step: number) => void}> = ({ step, setStep }) => {
    return (
        <Row>
            <Col sm={6} padding='xxlarge' gap='xlarge'>
                <StepIndicator step={step} setStep={setStep}/>
                <Col>
                    <h6 css={{ color: colors.blue }}>Why is Analysis on Kinetic different?</h6>
                    <h2 className='fw-bolder'>What does that mean?</h2>
                </Col>
                <ol>
                    <li>You will have access to simulated data in a protected containerized environment where you’ll be able to build your analysis script in R.</li>
                    <li>When your analysis script is ready, it will run against real data, analyze all individual data points, and return aggregated knowledge back to you.</li>
                </ol>

                <Box justify='between' className='mt-auto'>

                    <StyledPrevious onClick={()=>setStep(step - 1)}>
                        Previous
                    </StyledPrevious>
                    <ResearcherButton data-testid='analysis-tutorial-continue' onClick={()=>setStep(step + 1)}>
                        Continue
                    </ResearcherButton>

                </Box>
            </Col>
            <Col sm={6}>
                <img src={Tutorial2} alt='tutorial-1'/>
            </Col>
        </Row>
    )
}

const Step3: FC<{
    step: number,
    setStep: (step: number) => void,
    close: () => void
}> = ({ step, setStep, close }) => {
    return (
        <Row>
            <Col sm={6} padding='xxlarge' gap='xlarge'>
                <StepIndicator step={step} setStep={setStep}/>
                <Col>
                    <h6 css={{ color: colors.blue }}>Why is Analysis on Kinetic different?</h6>
                    <h2 className='fw-bolder'>Why?</h2>
                </Col>
                <p>
                    Traditional approaches of reducing data size or de-identifying data can result in loss of critical learner and contextual factors, blocking you from understanding who your learners are, what works for them and under what context.
                </p>
                <p>
                    With Kinetic you can do so while protecting your participant’s right for privacy.
                </p>

                <Box justify='between' className='mt-auto'>

                    <StyledPrevious onClick={() => setStep(step - 1)}>
                        Previous
                    </StyledPrevious>
                    <ResearcherButton data-testid='analysis-tutorial-finish' onClick={() => close()}>
                        Get Started
                    </ResearcherButton>

                </Box>
            </Col>
            <Col sm={6}>
                <img src={Tutorial3} alt='tutorial-1'/>
            </Col>
        </Row>
    )
}

const StyledStep = styled.div<{ active: boolean }>(({ active }) => ({
    borderRadius: 25,
    height: 5,
    width: 20,
    backgroundColor: active ? colors.blue : colors.gray,
}))

const StepIndicator: FC<{step: number, setStep: (step: number) => void}> = ({ step, setStep }) => {
    return (
        <Box gap>
            <StyledStep active={step == 0} onClick={() => setStep(0)}/>
            <StyledStep active={step == 1} onClick={() => setStep(1)}/>
            <StyledStep active={step == 2} onClick={() => setStep(2)}/>
        </Box>
    )
}
