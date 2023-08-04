import { colors } from '@theme';
import { React } from '@common';
import { Link } from 'react-router-dom';

export const ExitButton: FC<{navTo: string}> = ({ navTo }) => {
    return (
        <Link
            to={navTo}
            css={{
                textDecoration: 'underline',
                textUnderlineOffset: '.5rem',
                color: colors.text,
                cursor: 'pointer',
                alignSelf: 'end',
            }}
        >
            Exit
        </Link>
    )
}
