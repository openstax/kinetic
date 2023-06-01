import { Box, React } from '@common'
import { CharacterCount, Icon, useFormState } from '@components';
import { get } from 'lodash';
import { colors } from '@theme';

export const FieldErrorMessage: FC<{name: string, liveCountMax?: number}> = ({
    name,
    liveCountMax = null,
}) => {
    const { errors }  = useFormState()
    const error = get(errors, name)

    if (!error?.message && liveCountMax)  {
        return (
            <CharacterCount max={liveCountMax} name={name} />
        )
    }

    if (error?.type === 'max' && liveCountMax) {
        return (
            <CharacterCount max={liveCountMax} name={name} />
        )
    }

    if (!error?.message) {
        return null
    }

    return (
        <small css={{ color: colors.red }}>
            <Box gap>
                <Icon icon="warning" height={18}></Icon>
                <span>{String(error?.message)}</span>
            </Box>
            {liveCountMax && <CharacterCount max={liveCountMax} name={name} />}
        </small>
    )
}
