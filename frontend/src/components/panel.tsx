import { Box } from 'boxible'
import styled from '@emotion/styled'

export const Panel = styled(Box, {
    target: 'row',
})(({ containsForm }: { containsForm?: boolean }) => ({
    flexDirection: containsForm ? 'row' : 'column',
    backgroundColor: '#fcfcfc',
    padding: 12,
    marginBottom: 2,
    marginTop: 2,
    border: '4px solid #eeeeee',
}))
