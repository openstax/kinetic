import { cx, React } from '@common';

export const PageContainer: FCWC<{className?: string}> = ({ className, children }) => {
    return (
        <div className={cx('container-lg', 'h-100', 'py-4', className)}>
            {children}
        </div>
    )
}
