import { Box, React, styled, useNavigate, useState } from '@common'
import { Footer, TopNavBar } from '@components';
import { colors } from '../../../../theme';
import { Button } from '@nathanstitt/sundry';
import { Link } from 'react-router-dom';

export default function ResearcherStudyLanding() {
    const [showSteps, setShowSteps] = useState<boolean>(false)

    return (
        <div className='create-study-overview'>
            <TopNavBar hideBanner/>
            <div className="container-lg h-100 py-4">
                {showSteps ? <StepsOverview /> : <Introduction onClickStart={() => setShowSteps(true)} />}
            </div>
            <Footer className='fixed-bottom' />
        </div>
    )
}

export const ExitButton = () => {
    const nav = useNavigate()
    return (
        <h6
            css={{
                textDecoration: 'underline',
                textUnderlineOffset: '.5rem',
                color: colors.grayText,
                cursor: 'pointer',
                alignSelf: 'end',
            }}
            onClick={() => nav('/studies')}
        >
            Exit
        </h6>
    )
}

const SectionHeader = styled.h5({
    marginTop: `1rem`,
})

const SectionText = styled.small({
    color: colors.grayText,
})

const StepSection: FCWC<{
    header: string,
    borderColor: string
}> = ({ header, borderColor, children }) => {
    return (
        <Box
            direction='column'
            width='570px'
            css={{ border: `1px solid ${borderColor}`, borderRadius: 10 }}
        >
            <div css={{ backgroundColor: colors.gray, padding: `1rem`, borderRadius: `10px 10px 0 0` }}>
                <h4>{header}</h4>
            </div>
            <div css={{ padding: `0 1rem 1rem` }}>
                {children}
            </div>
        </Box>
    )
}

const StepsOverview: FC = () => {
    const nav = useNavigate()

    return (
        <Box direction='column' align='center'>
            <ExitButton/>
            <Box width='750px' gap='large' direction='column'>
                <h2 className='fw-bold'>Here are the steps you need to go through</h2>
                <Box gap='large'>
                    <StepSection header='Study Details' borderColor={colors.kineticResearcher}>
                        <SectionHeader>1. Research Team - 2min ETA</SectionHeader>
                        <SectionText>
                                Identify the researchers that will be collaborating with you on this study
                        </SectionText>

                        <SectionHeader>2. Internal Details - 2min ETA</SectionHeader>
                        <SectionText>
                                Pick an internal study title and related metadata
                        </SectionText>

                        <SectionHeader>3. Participant View - 10min ETA</SectionHeader>
                        <SectionText>
                                Describe your study, its duration, and its benefits to participants, in a way that appeals to the target population
                        </SectionText>

                        <hr css={{ borderTop: `2px dashed ${colors.grayText}` }}/>

                        <SectionHeader>4. Additional Sessions (optional) - 2min ETA</SectionHeader>
                        <SectionText>
                                Choose to turn your single session study into a longitudinal study
                        </SectionText>
                    </StepSection>

                    <Button
                        className='btn-researcher-primary'
                        onClick={() => nav('/study/edit/new')}
                        css={{ alignSelf: 'center', padding: `10px 40px` }}
                    >
                        Start
                    </Button>
                </Box>
                <StepSection header='Finalize Study' borderColor={colors.lightGray}>
                    <SectionHeader>5. Waiting Period</SectionHeader>
                    <SectionText>
                        Brief time during which the Kinetic team will setup the correct permissions and generate a Qualtrics template for your study
                    </SectionText>

                    <SectionHeader>6. Finalize Study - 5min ETA</SectionHeader>
                    <SectionText>
                        Choose your opening and closing criteria and make your study visible to participants
                    </SectionText>
                </StepSection>
            </Box>
        </Box>
    )
}

const Introduction: FC<{onClickStart: () => void}> = ({ onClickStart }) => {
    return (
        <Box direction='column' align='center'>
            <ExitButton/>
            <Box direction='column' width='650px' className='text-center' align='center'>
                <h2 className='fw-bold mt-2'>Create a study to collect new data</h2>
                <img className='mt-2' height={240} width={300} src="https://picsum.photos/200" alt='get-started'/>
                <h5 className='lh-lg mt-2'>The following steps will guide you through some fundamental questions that will help you determine your study needs. This process can take about 10-20 minutes.</h5>
                <h6 className='mt-2' css={{ color: colors.grayerText }}>
                    <span>If you’re rather looking to access existing Kinetic data, please visit the </span>
                    <Link to='/analysis'>analysis center.</Link>
                </h6>
                {/*TODO Onclick*/}
                <Button className='btn-researcher-primary mt-4' onClick={() => onClickStart()}>
                    Start process
                </Button>
            </Box>
        </Box>
    )
}
