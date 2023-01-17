import {
    React, cx, useContext, useMemo,
} from '@common'
import styled from '@emotion/styled'
import {
    Formik, Form as FormikForm, useFormikContext, FormikConfig, FormikProps,
} from 'formik'
import { Box, BoxProps } from 'boxible'
import { ErrorAlert, ErrorTypes } from './alert'
import { Button, ButtonProps } from './button'
import { emptyFn } from '@lib'


const ERROR_FIELD_KEY = 'FORM_ERROR'

export type FormContext<T> = FormContextI & FormikProps<T>

interface FormContextI {
    readOnly?: boolean
    setFormError(error?: ErrorTypes): void
}

export const FORM_CONTEXT = React.createContext<FormContextI>({
    setFormError: emptyFn,
})


export function useFormContext<T>(): (FormContextI & FormikProps<T>) {
    return useContext(FORM_CONTEXT) as (FormContextI & FormikProps<T>)
}

export type FormSubmitHandler<T> = FormikConfig<T>['onSubmit']
export type FormCancelHandler<T> = (fc: FormContext<T>) => void
export type FormDeleteHandler<T> = (fc: FormContext<T>) => void


interface FormProps<T> extends FormikConfig<T> {
    children: React.ReactNode
    className?: string
    readOnly?: boolean
    onDelete?: FormDeleteHandler<T>
    onCancel?: FormCancelHandler<T>
    showControls?: boolean
    action?: string
}

const FooterWrapper = styled(Box)(props => ({
    ...props.theme.css.topLine,
}))

const Footer: FCWC<{ className?: string } & BoxProps> = ({ className, children, ...boxProps }) => {
    return (
        <FooterWrapper className={cx('footer', className)} justify="end" gap {...boxProps}>
            {children}
        </FooterWrapper>
    )
}

function InnerForm<T>(formProps: FormProps<T>) {
    const { className, action, children, readOnly } = formProps

    const C: React.FC<FormikProps<T>> = (props) => {

        const context = useMemo(() => ({
            readOnly,
            setFormError: (err: ErrorTypes) => props.setFieldError(ERROR_FIELD_KEY, err as any),
            ...props,
        }), [props])


        return (
            <FormikForm method="POST" className={className} action={action}>
                <FORM_CONTEXT.Provider value={context}>
                    {children}
                </FORM_CONTEXT.Provider>
            </FormikForm>
        )
    }
    return C
}

export function Form<T>(props: PropsWithChildren<FormProps<T>>): JSX.Element {
    return (
        <Formik
            {...props}
            component={InnerForm<T>(props)}
        />
    )
}


export const FormCancelButton: FCWC<ButtonProps> = ({ children, ...props }) => {
    const fc = useFormikContext()
    const { isSubmitting } = fc
    return (
        <Button
            disabled={isSubmitting}
            {...props}
        >{children}</Button>
    )
}

export const FormSaveButton: FCWC<ButtonProps> = ({
    children,
    busyMessage = 'Saving',
    type = 'submit',
    ...props
}) => {
    const fc = useFormikContext()

    const { isSubmitting } = fc
    return (
        <Button
            type={type}
            busyMessage={busyMessage}
            busy={isSubmitting}
            {...props}
        >{children}</Button>
    )
}

interface SaveCancelBtnProps<T> {
    showControls?: boolean
    onDelete?: FormDeleteHandler<T>
    onCancel?: FormCancelHandler<T>
}
function SaveCancelBtn<T>({
    onCancel, onDelete, showControls,
}: SaveCancelBtnProps<T>): JSX.Element | null {
    const fc = useFormContext<T>()
    const { isSubmitting, resetForm, dirty } = fc
    if (!showControls && !dirty) { return null }

    const onSubmit = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault() // stop form from submit
        await fc.submitForm()
    }

    const onFormCancel = async () => {
        resetForm()
        onCancel?.(fc)
    }

    const onFormDelete = () => onDelete?.(fc)

    return (
        <Footer justify={onDelete ? 'between' : 'end'}>
            {onDelete && (
                <Button
                    danger
                    data-test-id="form-delete-btn"
                    disabled={isSubmitting}
                    onClick={onFormDelete}
                >Delete</Button>

            )}
            <Box gap>
                {onCancel && (
                    <Button
                        data-test-id="form-cancel-btn"
                        disabled={isSubmitting}
                        onClick={onFormCancel}
                    >Cancel</Button>
                )}
                <Button
                    data-test-id="form-save-btn"
                    busy={isSubmitting}
                    onClick={onSubmit}
                    primary
                >Save</Button>
            </Box>
        </Footer>
    )
}

export function FormSaveError<T>() {
    const fc = useFormikContext<T>()
    const onDismiss = () => {
        fc.setFieldError(ERROR_FIELD_KEY, undefined)
    }
    return (
        <ErrorAlert error={(fc.errors as any)['FORM_ERROR'] as any} onDismiss={onDismiss} />
    )
}

export function EditingForm<T>({
    children, showControls, className, onCancel, onDelete, ...props
}: FormProps<T>): JSX.Element {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            <FormSaveError />
            <SaveCancelBtn onCancel={onCancel} onDelete={onDelete} showControls={showControls} />
        </Form>
    )
}
