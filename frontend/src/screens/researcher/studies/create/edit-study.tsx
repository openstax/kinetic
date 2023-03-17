import { Box, React, useNavigate, useParams, useState } from '@common'
import { useApi } from '@lib';
import { EditingStudy } from '@models';
import { Icon, TopNavBar } from '@components';
import { ProgressBar } from './progress-bar';
import { ExitButton } from './researcher-study-landing';
import { Button, Col } from '@nathanstitt/sundry';
import ResearchTeam from './forms/research-team';
import { Link } from 'react-router-dom';

export type StepKey =
    'research-team' |
    'internal-details' |
    'participant-view' |
    'additional-sessions' |
    'waiting-period' |
    'finalize-study'

export interface Step {
    index: number
    text: string
    key: StepKey
    optional?: boolean
    disabled?: boolean
}

export const steps: Step[] = [
    { index: 0, text: 'Research Team', key: 'research-team' },
    { index: 1, text: 'Internal Details', key: 'internal-details' },
    { index: 2, text: 'Participant View', key: 'participant-view' },
    { index: 3, text: 'Additional Sessions (optional)', key: 'additional-sessions', optional: true },
    { index: 4, text: 'Waiting Period', key: 'waiting-period', disabled: true },
    { index: 5, text: 'Finalize Study', key: 'finalize-study', disabled: true },
]

export default function EditStudy() {
    const [currentStep, setCurrentStep] = useState<Step>(steps[0])

    const nav = useNavigate()
    const api = useApi()
    const [study, setStudy] = useState<EditingStudy | null>()
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id

    return (
        <Box direction='column' className='edit-study vh-100'>
            <TopNavBar hideBanner/>
            <div className="container-lg py-4">
                <Box justify='between'>
                    <Col sm={1}>
                        <span></span>
                    </Col>
                    <Col sm={10}>
                        <ProgressBar currentStep={currentStep}/>
                    </Col>
                    <Col sm={1}>
                        <ExitButton/>
                    </Col>
                </Box>

                <ResearchTeam />
            </div>
            <ActionFooter currentStep={currentStep}/>
        </Box>
    )
}

const ActionFooter: FC<{currentStep: Step}> = ({ currentStep }) => {
    return (
        <Box className='mt-auto ' css={{ height: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='between'>
                {currentStep.index !== 0 ? <Link to=''>
                    <Box align='center' gap='small'>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back</span>
                    </Box>
                </Link> : <span></span>}

                <Box align='center' gap='large'>
                    <Button
                        className='btn-researcher-secondary'
                        css={{ width: 170, justifyContent: 'center' }}
                        onClick={() => {}}
                    >
                        Save as draft
                    </Button>
                    <Button
                        className='btn-researcher-primary'
                        css={{ width: 170, justifyContent: 'center' }}
                        onClick={() => {}}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
