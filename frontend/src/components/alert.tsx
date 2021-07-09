import { React, cx, useState, useEffect } from '../common'
import { BSVariants, bsClassNames } from './bs'
import { Button } from './button'

export interface AlertProps extends BSVariants {
    message?: string
    className?: string
    canDismiss?: boolean
    onDismiss?: () => void
}

export const Alert:React.FC<AlertProps> = ({
    message, className = '',
    canDismiss = true,
    onDismiss,
    ...types
}) => {
    const [visible, setVisible] = useState(canDismiss)

    useEffect(() => {
        setVisible(Boolean(message))
    }, [message])

    if (!(visible && message)) {
        return null
    }

    const onClose = () => {
        setVisible(false)
        onDismiss?.()
    }
    
    return (
        <div
            role="alert"
            data-test-id="alert"
            className={cx(
                'alert',
                bsClassNames('alert', types)[0],
                className, {
                    'alert-dismissible': canDismiss,
                },
            )}
        >
            <div>{message}</div>
            {canDismiss && (
                <Button icon="close" className="btn-close" onClick={onClose}
                    data-dismiss="alert"
                    aria-label="Close"
                />
            )}
        </div>
    )
}
