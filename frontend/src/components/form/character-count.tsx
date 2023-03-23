import { useFormContext } from '@nathanstitt/sundry';
import { Box, React } from '@common';
import { colors } from '@theme';
import { Icon } from '@components';

export const CharacterCount: FC<{ max: number, name: string }> = ({ max, name }) => {
    const value = useFormContext().watch(name, '')

    if (value.length > max) {
        return (
            <Box css={{ color: colors.red }} align='center' gap='small'>
                <Icon icon="warning" height={16} />
                <small>{value.length} / {max} character</small>
            </Box>
        )
    }

    return (
        <small css={{ color: colors.grayText }}>{value.length} / {max} character</small>
    )
}
