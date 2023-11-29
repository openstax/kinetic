import { React } from '@common';
import { Button } from '@mantine/core';

interface ResearcherButtonProps {
    buttonType?: 'primary' | 'secondary'
    disabled?: boolean
    onClick: () => void
    testId?: string
}

export const ResearcherButton: FCWC<ResearcherButtonProps> = ({
    buttonType = 'primary',
    disabled = false,
    onClick,
    children,
    testId,
    ...props
}) => {
    return (
        <Button
            data-testid={testId || `${buttonType}-action`}
            disabled={disabled}
            onClick={() => onClick()}
            {...props}
        >
            {children}
        </Button>
    )
}
