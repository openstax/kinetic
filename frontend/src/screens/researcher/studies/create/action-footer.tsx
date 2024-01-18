import { Box, React, styled, useCallback, useState } from '@common';
import { Icon, Step } from '@components';
import { Button } from '@mantine/core';

const FakeLink = styled.span({
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
})

export const ActionFooter: FC<{ step: Step, }> = ({ step }) => {
    const [busy, setBusy] = useState(false)
    const triggerAnimation = useCallback(() => {
        setBusy(true)
        const timer = setTimeout(() => {
            setBusy(false)
        }, 750);
        return () => clearTimeout(timer);
    }, [setBusy]);

    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ zIndex: 200, minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='between'>
                {step.backAction ? <FakeLink>
                    <Box align='center' gap='small' onClick={() => step.backAction?.()}>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back</span>
                    </Box>
                </FakeLink> : <span></span>}

                <Box align='center' gap='large'>
                    {step.secondaryAction ?
                        <Button
                            color='blue'
                            variant='outline'
                            data-testid='secondary-action'
                            loading={busy}
                            disabled={step.secondaryAction.disabled}
                            onClick={() => {
                                step.secondaryAction?.action?.()
                                triggerAnimation()
                            }}
                        >
                            {step.secondaryAction?.text}
                        </Button>
                        : null
                    }

                    {step.primaryAction ?
                        <Button
                            color='blue'
                            data-testid='study-primary-action'
                            disabled={step.primaryAction.disabled}
                            onClick={() => step.primaryAction?.action?.()}
                        >
                            {step.primaryAction?.text}
                        </Button>
                        : null
                    }
                </Box>
            </Box>
        </Box>
    )
}
