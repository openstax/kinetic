import { colors } from '@theme';
import { React, useNavigate } from '@common';

export const ExitButton: FC = () => {
    const nav = useNavigate()
    return (
        <h6
            css={{
                textDecoration: 'underline',
                textUnderlineOffset: '.5rem',
                color: colors.text,
                cursor: 'pointer',
                alignSelf: 'end',
            }}
            onClick={() => {nav('/studies')}}
        >
            Exit
        </h6>
    )
}
