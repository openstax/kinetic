import { React, cx } from '../../common'

import { BSVariants, bsClassNames } from './bs'

interface ButtonProps extends BSVariants, React.HTMLProps<HTMLButtonElement> {
    className?: string
}
export const Button:React.FC<ButtonProps> = ({ className, ...otherProps }) => {
    const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })
    return <button className={cx(className, bsClasses)} {...props} />
}
