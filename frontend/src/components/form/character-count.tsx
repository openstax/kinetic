import { Box, React } from '@common';
import { colors } from '@theme';
import { Icon, useFormContext } from '@components';

export const CharacterCount: FC<{ max: number, name: string }> = ({ max, name }) => {
    const value = useFormContext().watch(name, '')

    if (value.length > max) {
        return (
            <Box css={{ color: colors.red }} align='center' gap>
                <Icon icon="warning" height={18} />
                <small>{value.length} / {max} character</small>
            </Box>
        )
    }

    return (
        <small css={{ color: colors.text }}>{value.length} / {max} character</small>
    )
}
