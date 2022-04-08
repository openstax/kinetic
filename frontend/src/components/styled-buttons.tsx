import { React } from '@common'
import { colors } from '../theme'
import { useFormikContext } from 'formik'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { useCurrentUser, ENV } from '@lib'
import { Button, ButtonProps } from './button'

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const StyledLinkButton = styled(Button)<ButtonProps>({
    svg: {
        color: colors.linkButtonIcon,
    },
    '&:hover': {
        svg: {
            color: colors.linkButtonIconHover,
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

export const SubmitButton: React.FC<ButtonProps> = ({
    busyMessage = 'Submitting',
    children,
    ...props
}) => {
    const { isSubmitting } = useFormikContext()

    return (
        <Button
            primary
            busy={isSubmitting}
            busyMessage={busyMessage}
            type="submit"
            {...props}
        >
            {children}
        </Button>
    )
}


export const LogoutButton: React.FC = () => {
    const user = useCurrentUser()
    const nav = useNavigate()
    if (!ENV.IS_LOCAL) {
        return null
    }

    const onClick = async () => {
        await user.logout()
        nav('/')
    }

    return (
        <Button secondary onClick={onClick}>
            Logout
        </Button>
    )
}
