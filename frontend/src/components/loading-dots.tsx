import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import * as React from 'react'

const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`
const DotWrapper = styled.div`
    display: flex;
    align-items: flex-end;
`

interface DotProps {
    color: string
    delay: string
}
const Dot = styled('div', {
    shouldForwardProp: () => false,
})<DotProps>`
    background-color: ${({ color }) => color};
    border-radius: 50%;
    width: 5px;
    height: 5px;
    margin: 0 5px;
    animation: ${BounceAnimation} 0.9s linear infinite;
    animation-delay: ${({ delay }) => delay};
`

interface LoadingDotsProps {
    color?: string
}

const LoadingDots:React.FC<LoadingDotsProps> = ({ color = 'white' }) => (
    <DotWrapper>
        <Dot color={color} delay="0s" />
        <Dot color={color} delay=".1s" />
        <Dot color={color} delay=".2s" />
    </DotWrapper>
)

export default LoadingDots
