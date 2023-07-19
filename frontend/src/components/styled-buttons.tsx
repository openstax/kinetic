import { React } from '@common'
import { colors } from '@theme'
import { Button, ButtonProps } from '@components'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const StyledLinkButton = styled(Button)<ButtonProps>({
    svg: {
        color: colors.lightGray,
    },
    '&:hover': {
        svg: {
            color: colors.blue,
        },
    },
})


export const LinkButton: React.FC<LinkButtonProps> = ({ to, children, ...props }) => {
    const nav = useNavigate()
    return (
        <StyledLinkButton {...props} onClick={() => nav(to)}>
            {children}
        </StyledLinkButton>
    )
}
