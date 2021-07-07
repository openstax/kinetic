import styled from '@emotion/styled'

export const FloatingLabel = styled.label<{
    isRaised?: boolean, displayHigh?: boolean,
}>(({ isRaised, displayHigh }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    padding: '1rem 0.75rem',
    pointerEvents: 'none',
    border: '1px solid transparent',
    transformOrigin: '0 0',
    transition: 'opacity 0.1s ease-in-out, transform 0.1s ease-in-out',
    opacity: isRaised ? 0.65 : 1.0,
    transform: isRaised ? `scale(0.85) translateY(-0.${displayHigh ? '85' : '65'}rem) translateX(0.15rem)` : 'none',
}))


export const ExtraInfo = styled.div({
    top: 0,
    right: 0,
    margin: 0,
    position: 'absolute',
    padding: '0 0.75rem',
    textAlign: 'right',
    height: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    pointerEvents: 'none',
    fontSize: '0.875em',
    maxWidth: '100%',
    '> *': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    '.invalid': {
        color: '#dc3545',
    },
    '.hint': {
        color: '#6c757d',
        fontStyle: 'italic',
        marginBottom: '-2px',
    },
})

ExtraInfo.defaultProps = {
    className: 'xtra',
}
