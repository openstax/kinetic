import { React } from '@common';
import { colors } from '@theme';

export const FieldTitle: FCWC<{required?: boolean}> = ({ required, children }) => {
    return (
        <h6 className='fw-bold'>
            {children}{required && <span css={{ color: colors.red }}>*</span>}
        </h6>
    )
}
