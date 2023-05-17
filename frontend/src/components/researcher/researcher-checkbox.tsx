import { styled } from '@common';
import { InputField } from '@components';
import { colors } from '@theme';

export const ResearcherCheckbox = styled(InputField)({
    '.form-check-input, &.form-check-input': {
        height: 16,
        width: 16,
        '&:checked': {
            backgroundColor: colors.kineticResearcher,
            borderColor: colors.kineticResearcher,
        },
    },
})
