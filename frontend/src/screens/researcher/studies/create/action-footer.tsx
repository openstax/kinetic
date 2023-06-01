import { Box, React } from '@common';
import { Link } from 'react-router-dom';
import { Icon, ResearcherButton, Step } from '@components';

export const ActionFooter: FC<{ step: Step, }> = ({ step }) => {
    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='between'>
                {step.backAction ? <Link to=''>
                    <Box align='center' gap='small' onClick={() => step.backAction?.()}>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back</span>
                    </Box>
                </Link> : <span></span>}

                <Box align='center' gap='large'>
                    {step.secondaryAction ?
                        <ResearcherButton
                            type='secondary'
                            fixedWidth
                            disabled={step.secondaryAction.disabled}
                            onClick={() => step.secondaryAction?.action?.()}
                        >
                            {step.secondaryAction?.text}
                        </ResearcherButton>
                        : <></>
                    }

                    {step.primaryAction ?
                        <ResearcherButton
                            fixedWidth
                            disabled={step.primaryAction.disabled}
                            onClick={() => step.primaryAction?.action?.()}
                        >
                            {step.primaryAction?.text}
                        </ResearcherButton>
                        : <></>
                    }
                </Box>
            </Box>
        </Box>
    )
}
