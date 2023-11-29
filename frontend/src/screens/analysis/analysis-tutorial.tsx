import { React, styled, useState } from '@common';
import { useApi, useUserPreferences } from '@lib';
import Tutorial1 from '@images/analysis/tutorial1.svg'
import Tutorial2 from '@images/analysis/tutorial2.svg'
import Tutorial3 from '@images/analysis/tutorial3.svg'
import { colors } from '@theme';
import { Button, Grid, Group, Image, List, Modal, Stack, Text, Title } from '@mantine/core';

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
        <Modal
            centered
            size='70%'
            closeOnClickOutside={false}
            closeOnEscape={false}
            opened={showTutorial}
            onClose={() => closeTutorial()}
            withCloseButton={false}
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <Modal.Body data-testid='analysis-tutorial-modal'>
                <TutorialStep step={step} setStep={setStep} close={() => closeTutorial()} />
            </Modal.Body>
        </Modal>
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
        <Grid>
            <Grid.Col span={6}>
                <Stack p='xl' h='100%'>
                    <StepIndicator step={step} setStep={setStep}/>
                    <Stack>
                        <Title order={6} c='blue'>Why is Analysis on Kinetic different?</Title>
                        <Title order={3}>Important Notice</Title>
                    </Stack>
                    <Text>Due to the sensitive nature of educational data, Kinetic has built in privacy-by-design. Therefore, analysis on Kinetic looks different from typical research platforms. That is, we bring your analytical software to the data instead of bringing the data to you.</Text>

                    <Button color='blue' mt='auto' data-testid='analysis-tutorial-continue' onClick={()=>setStep(1)} style={{ alignSelf: 'end' }}>
                        Continue
                    </Button>
                </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
                <Image src={Tutorial1} alt='tutorial-1'/>
            </Grid.Col>
        </Grid>
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
        <Grid>
            <Grid.Col span={6}>
                <Stack p='xl' h='100%'>
                    <StepIndicator step={step} setStep={setStep}/>
                    <Stack>
                        <Title order={6} c='blue'>Why is Analysis on Kinetic different?</Title>
                        <Title order={3}>What does that mean?</Title>
                    </Stack>
                    <List type='ordered'>
                        <List.Item>You will have access to simulated data in a protected containerized environment where you’ll be able to build your analysis script in R.</List.Item>
                        <List.Item>When your analysis script is ready, it will run against real data, analyze all individual data points, and return aggregated knowledge back to you.</List.Item>
                    </List>

                    <Group justify='space-between' mt='auto'>
                        <StyledPrevious onClick={()=>setStep(step - 1)}>
                            Previous
                        </StyledPrevious>
                        <Button color='blue' data-testid='analysis-tutorial-continue' onClick={()=>setStep(step + 1)}>
                            Continue
                        </Button>
                    </Group>
                </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
                <Image src={Tutorial2} alt='tutorial-2'/>
            </Grid.Col>
        </Grid>
    )
}

const Step3: FC<{
    step: number,
    setStep: (step: number) => void,
    close: () => void
}> = ({ step, setStep, close }) => {
    return (
        <Grid>
            <Grid.Col span={6}>
                <Stack p='xl' h='100%'>
                    <StepIndicator step={step} setStep={setStep}/>
                    <Stack>
                        <Title order={6} c='blue'>Why is Analysis on Kinetic different?</Title>
                        <Title order={3}>Why?</Title>
                    </Stack>
                    <Text>
                        Traditional approaches of reducing data size or de-identifying data can result in loss of critical learner and contextual factors, blocking you from understanding who your learners are, what works for them and under what context.
                    </Text>
                    <Text>
                        With Kinetic you can do so while protecting your participant’s right for privacy.
                    </Text>

                    <Group justify='space-between' mt='auto'>
                        <StyledPrevious onClick={() => setStep(step - 1)}>
                            Previous
                        </StyledPrevious>
                        <Button color='blue' data-testid='analysis-tutorial-finish' onClick={() => close()}>
                            Get Started
                        </Button>
                    </Group>
                </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
                <Image src={Tutorial3} alt='tutorial-3'/>
            </Grid.Col>
        </Grid>
    )
}

const StyledStep = styled.div<{ active: boolean }>(({ active }) => ({
    borderRadius: 25,
    height: 5,
    width: 20,
    backgroundColor: active ? colors.blue : colors.gray50,
}))

const StepIndicator: FC<{step: number, setStep: (step: number) => void}> = ({ step, setStep }) => {
    return (
        <Group>
            <StyledStep active={step == 0} onClick={() => setStep(0)}/>
            <StyledStep active={step == 1} onClick={() => setStep(1)}/>
            <StyledStep active={step == 2} onClick={() => setStep(2)}/>
        </Group>
    )
}
