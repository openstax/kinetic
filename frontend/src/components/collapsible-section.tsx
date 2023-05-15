import { useToggle } from 'rooks';
import { Box, React } from '@common';
import { colors } from '@theme';
import { Button, Icon } from './index';

export const CollapsibleSection: FCWC<{
    title: string,
    description: string,
    open?: boolean
}> = ({
    title,
    description,
    open = false,
    children,
}) => {
    const [expanded, toggleExpanded] = useToggle(open)

    return (
        <Box css={{ backgroundColor: colors.pageBackground }} className='p-2' direction='column'>
            <Box justify='between'>
                <Box direction='column' gap>
                    <h5>{title}</h5>
                    <small css={{ color: colors.grayText }}>
                        {description}
                    </small>
                </Box>

                <Button link onClick={toggleExpanded}>
                    {expanded ? 'Collapse' : 'Expand'}
                    <Icon icon={expanded ? 'chevronUp' : 'chevronDown'}/>
                </Button>
            </Box>

            {expanded &&
                <div className='py-2'>
                    {children}
                </div>
            }

        </Box>
    )
}
