
import { React, useEffect, cx, useState } from '../common'
import { BSVariants, bsClassNames } from './bs'


export interface AlertProps extends BSVariants {
    message?: string
    onDismiss?(): void
    className?: string
    canDismiss?: boolean
}

export const Alert: FC<AlertProps> = ({
    message,
    onDismiss,
    className = '',
    canDismiss = true,
    ...types
}) => {
    const [visible, setVisible] = useState(canDismiss)
    useEffect(() => {
        setVisible(!!message)
    }, [message])
    const onDismissClick = () => {
        onDismiss?.()
        setVisible(false)
    }
    if (!(visible && message)) {
        return null
    }

    return (
        <div
            role="alert"
            data-test-id="alert"
            className={cx(
                'alert',
                bsClassNames('alert', types)[0],
                className,
                { 'alert-dismissible': canDismiss },
            )}
        >
            <div>{message}</div>
            {canDismiss && (
                <button
                    type="button"
                    className="btn-close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={onDismissClick}
                />)}
        </div>
    )
}

export type ErrorTypes = Error | string | false | undefined

interface ErrorAlertProps {
    error?: ErrorTypes
    onDismiss?(): void
}
export const ErrorAlert: FC<ErrorAlertProps> = ({ error, onDismiss: onDismissProp }) => {
    const [err, setError] = useState<ErrorTypes>(error)
    useEffect(() => {
        setError(error)
    }, [error])
    if (!err) {
        return null
    }
    const onDismiss = () => {
        setError(false)
        onDismissProp?.()
    }
    return (
        <Alert
            danger
            message={typeof err == 'object' ? err?.message : err}
            onDismiss={onDismiss}
        />
    )
}
