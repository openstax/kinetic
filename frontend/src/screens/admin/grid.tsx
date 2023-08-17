import { Box, styled } from '@common'

export const Grid = styled.div({
    display: 'grid',
    height: '100vh',
    width: '100vw',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto 1fr auto',
    overflow: 'hidden',
    gridTemplateAreas: `
    "header  header"
    "sidebar main"
    "footer  footer"
  `,
});

export const Sidebar = styled(Box)({
    borderRight: '1px solid #ccc',
    flexDirection: 'column',
    gridArea: 'sidebar',
    overflow: 'auto',
    flexWrap: 'nowrap',
    width: 300,
})

export const Main = styled(Box)({
    flexDirection: 'column',
    gridArea: 'main',
    overflow: 'auto',
})
