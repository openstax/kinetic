import { React, Box, styled } from '@common'
import { BoxProps } from 'boxible'

export const Grid = styled.div({
    display: 'grid',
    height: '100vh',
    width: '100vw',
    gridTemplateColumns: 'auto 3fr',
    gridTemplateRows: 'auto 1fr auto',
    overflow: 'hidden',
    gridTemplateAreas: `
    "header  header"
    "sidebar main"
    "footer  footer"
  `,
});

export const Sidebar = styled(Box)({
    flexDirection: 'column',
    gridArea: 'sidebar',
    overflow: 'auto',
    borderRight: '1px solid #ccc',
})

export const Main = styled(Box)({
    flexDirection: 'column',
    gridArea: 'main',
    overflow: 'auto',
})

