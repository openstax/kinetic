import { Button } from '@components';
import { cx, React } from '@common';

interface ResearcherButtonProps {
    type?: 'primary' | 'secondary'
    disabled?: boolean
    onClick: () => void
    className?: string
    fixedWidth?: boolean
}

export const ResearcherButton: FCWC<ResearcherButtonProps> = ({
    type = 'primary',
    disabled = false,
    onClick,
    className,
    children,
    fixedWidth = false,
}) => {
    return (
        <Button
            className={cx(className, `btn-researcher-${type}`)}
            data-testid={`${type}-action`}
            disabled={disabled}
            css={{ width: fixedWidth ? 170 : 'auto', justifyContent: 'center' }}
            onClick={() => onClick()}
        >
            {children}
        </Button>
    )
}
