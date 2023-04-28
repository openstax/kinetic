import { Box, React } from '@common';
import { colors } from '@theme';
import { Icon, useFormContext, useFormState } from '@components';
import { get } from 'lodash';

export const CharacterCount: FC<{ max: number, name: string }> = ({ max, name }) => {
    const value = useFormContext().watch(name, '')
    const { errors }  = useFormState()
    const error = get(errors, name)

    if (error) {
        return null
    }

    if (value.length > max) {
        return (
            <Box css={{ color: colors.red }} align='center' gap>
                <Icon icon="warning" height={18} />
                <small>{value.length} / {max} character</small>
            </Box>
        )
    }

    return (
        <small css={{ color: colors.grayText }}>{value.length} / {max} character</small>
    )
}
