import { Box, React } from '@common'
import { Icon, useFormState } from '@components';
import { get } from 'lodash';
import { colors } from '@theme';

export const FieldErrorMessage: FC<{name: string}> = ({ name }) => {
    const { errors }  = useFormState()
    const error = get(errors, name)
    if (!error?.message) return null

    return (
        <small css={{ color: colors.red }}>
            <Box gap>
                <Icon icon="warning" height={18}></Icon>
                <span>{String(error.message)}</span>
            </Box>
        </small>
    )
}
