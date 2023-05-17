import { useToggle } from 'rooks';
import { Box, React } from '@common';
import { colors } from '@theme';
import { Button, Icon } from '../index';

export const CollapsibleSection: FCWC<{
    title: string,
    description?: string,
    open?: boolean,
    collapsible?: boolean,
}> = ({
    title,
    description,
    open = false,
    collapsible = true,
    children,
}) => {
    const [expanded, toggleExpanded] = useToggle(open || !collapsible)

    return (
        <Box css={{ backgroundColor: colors.pageBackground }} className='p-2' direction='column'>
            <Box justify='between'>
                <Box direction='column' gap>
                    <h5>{title}</h5>
                    {description &&
                        <small css={{ color: colors.grayText }}>
                            {description}
                        </small>
                    }
                </Box>

                {collapsible &&
                    <Button link onClick={toggleExpanded}>
                        {expanded ? 'Collapse' : 'Expand'}
                        <Icon icon={expanded ? 'chevronUp' : 'chevronDown'}/>
                    </Button>
                }
            </Box>

            {expanded &&
                <div className='py-2'>
                    {children}
                </div>
            }

        </Box>
    )
}
