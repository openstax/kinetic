import { React, cx } from '../../common'
import { useHistory } from 'react-router-dom'
import { BSVariants, bsClassNames } from './bs'

interface ButtonProps extends BSVariants, React.HTMLProps<HTMLButtonElement> {
    className?: string
}
export const Button:React.FC<ButtonProps> = ({ className, ...otherProps }) => {
    const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })
    return (
        <button
            css={{ display: 'inline-flex', alignItems: 'center' }}
            className={cx('btn', className, bsClasses)} {...props
            } />
    )
}

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const LinkButton:React.FC<LinkButtonProps> = ({ to, ...otherProps }) => {
    const history = useHistory()
    return <Button onClick={() => history.push(to)} {...otherProps} />
}
