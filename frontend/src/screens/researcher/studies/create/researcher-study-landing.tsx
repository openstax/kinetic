import { React, styled, useNavigate, useState } from '@common'
import { ExitButton, Page } from '@components';
import { colors } from '@theme';
import StartProcess from '@images/study-creation/start-process.svg'
import { Button, Group, Stack, Title } from '@mantine/core';

export default function ResearcherStudyLanding() {
    const [showSteps, setShowSteps] = useState<boolean>(false)

    return (
        <Page className='create-study-overview' hideFooter backgroundColor={colors.white}>
            {showSteps ? <StepsOverview /> : <Introduction onClickStart={() => setShowSteps(true)} />}
        </Page>
    )
}

const SectionHeader = styled.h5({
    marginTop: `1rem`,
})

const SectionText = styled.small({
    color: colors.text,
})

const StepSection: FCWC<{
    header: string,
    borderColor: string
}> = ({ header, borderColor, children }) => {
    return (
        <Stack
            w={570}
            css={{ border: `1px solid ${borderColor}`, borderRadius: 10 }}
        >
            <div css={{ backgroundColor: colors.gray30, padding: `1rem`, borderRadius: `10px 10px 0 0` }}>
                <h4>{header}</h4>
            </div>
            <div css={{ padding: `0 1rem 1rem` }}>
                {children}
            </div>
        </Stack>
    )
}

const StepsOverview: FC = () => {
    const nav = useNavigate()

    return (
        <Stack align='center'>
            <ExitButton navTo='/studies'/>
            <Stack w={750}>
                <h2 className='fw-bold'>A brief overview of the study creation flow</h2>
                <Group>
                    <StepSection header='Study Details' borderColor={colors.blue}>
                        <SectionHeader>
                            1. Internal Details - 2min ETA
                        </SectionHeader>
                        <SectionText>
                            Create an internal study title, and add other study parameters visible to researchers only
                        </SectionText>

                        <SectionHeader>
                            2. Research Team - 2min ETA
                        </SectionHeader>
                        <SectionText>
                            Identify the researchers that will be collaborating with you on this study
                        </SectionText>

                        <SectionHeader>
                            3. Participant View - 10min ETA
                        </SectionHeader>
                        <SectionText>
                            Add study information and describe your study in a way that appeals to your target participant population
                        </SectionText>

                        <hr css={{ borderTop: `2px dashed ${colors.text}` }}/>

                        <SectionHeader>
                            Additional Sessions (optional) - 2min ETA
                        </SectionHeader>
                        <SectionText>
                            Turn your single session study into a longitudinal study by adding retention measures
                        </SectionText>
                    </StepSection>

                    <Button color='blue' onClick={() => nav('/study/edit/new')}>
                        Start
                    </Button>
                </Group>

                <StepSection header='Finalize Study' borderColor={colors.gray50}>
                    <SectionHeader>5. Waiting Period</SectionHeader>
                    <SectionText>
                        Brief time during which the Kinetic team will setup the correct permissions and generate a Qualtrics template for your study
                    </SectionText>

                    <SectionHeader>6. Finalize Study - 5min ETA</SectionHeader>
                    <SectionText>
                        Choose your opening date and closing criteria to make your study visible to participants
                    </SectionText>
                </StepSection>
            </Stack>
        </Stack>
    )
}

const Introduction: FC<{onClickStart: () => void}> = ({ onClickStart }) => {
    return (
        <Stack align='center'>
            <ExitButton navTo='/studies'/>
            <Stack w={650} ta='center' align='center' gap='xl'>
                <Title order={2}>
                    Create a study to collect new data
                </Title>
                <img height={240} width={300} src={StartProcess} alt='get-started'/>
                <Title order={5} lh='xl'>
                    The following steps will guide you through some fundamental questions that will help you determine your study needs. This process can take about 10-20 minutes.
                </Title>
                {/* TODO Add back when analysis feature is ready */}
                {/*<h6 className='mt-2' css={{ color: colors.text }}>*/}
                {/*    <span>If you’re rather looking to access existing Kinetic data, please visit the </span>*/}
                {/*    <Link to='/analysis'>analysis center.</Link>*/}
                {/*</h6>*/}
                <Button color='blue' onClick={() => onClickStart()}>
                    Start process
                </Button>
            </Stack>
        </Stack>
    )
}
