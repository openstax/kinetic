import { Button, ButtonProps } from '@components';
import { cx, React } from '@common';

interface ResearcherButtonProps {
    buttonType?: 'primary' | 'secondary'
    disabled?: boolean
    onClick: () => void
    className?: string
    fixedWidth?: boolean
    testId?: string
}

export const ResearcherButton: FCWC<ButtonProps & ResearcherButtonProps> = ({
    buttonType = 'primary',
    disabled = false,
    onClick,
    className,
    children,
    fixedWidth = false,
    testId,
    ...props
}) => {
    return (
        <Button
            className={cx(className, `btn-researcher-${buttonType}`)}
            data-testid={testId || `${buttonType}-action`}
            disabled={disabled}
            css={{ width: fixedWidth ? 170 : 'auto', justifyContent: 'center' }}
            onClick={() => onClick()}
            {...props}
        >
            {children}
        </Button>
    )
}
