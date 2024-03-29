import { Box, React } from '@common';
import { colors } from '@theme';
import { Icon, useFormContext } from '@components';

export const CharacterCount: FC<{ max: number, name: string }> = ({ max, name }) => {
    const value = useFormContext().watch(name)
    const length = value?.length || 0

    if (length > max) {
        return (
            <Box css={{ color: colors.red }} align='center' gap>
                <Icon icon="warning" height={18} />
                <small>{length} / {max} character</small>
            </Box>
        )
    }

    return (
        <small css={{ color: colors.text }}>{length} / {max} character</small>
    )
}
