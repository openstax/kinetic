import {
    React, cx, useContext,
} from '../common'
import { ReactElement } from 'react'
import { Formik, Form as FormikForm } from 'formik'
import type { FormikHelpers } from 'formik'
import { useFormikContext, FormikConfig, FormikProps } from 'formik'
import { Button, ButtonProps } from './button'
import { Footer } from './footer'

interface FormContextI {
    readOnly?: boolean
}

export type { FormikHelpers as FormHelpers }
export const FormContext = React.createContext<FormContextI>({})
export function useFormContext<T>(): (FormContextI & FormikProps<T>) {
    return useContext(FormContext) as (FormContextI & FormikProps<T>)
}

interface FormProps<T> extends FormikConfig<T> {
    className?: string
    readOnly?: boolean
    onCancel?(): void
    showControls?: boolean
}

export type FormSubmitHandler<T> = (values: T, helpers: FormikHelpers<T>) => Promise<void>

export function Form<T>(props: React.PropsWithChildren<FormProps<T>>): ReactElement {
    const { readOnly, className, children, ...formProps } = props
    return (
        <Formik
            {...formProps}
        >
            {(formState) => (
                <FormikForm method="POST" className={className}>
                    <FormContext.Provider value={{ ...formState, readOnly }}>
                        {children}

                    </FormContext.Provider>
                </FormikForm>
            )}
        </Formik>
    )
}


export const FormCancelButton:React.FC<ButtonProps> = ({ children, ...props }) => {
    const fc = useFormikContext()
    const { isSubmitting } = fc
    return (
        <Button
            disabled={isSubmitting}
            {...props}
        >{children}</Button>
    )
}

export const FormSaveButton:React.FC<ButtonProps> = ({ children, ...props }) => {
    const fc = useFormikContext()
    const { isSubmitting } = fc
    return (
        <Button
            busy={isSubmitting}
            {...props}
        >{children}</Button>
    )
}

interface SaveCancelBtnProps {
    showControls?: boolean
    onCancel?(): void
}
const SaveCancelBtn: React.FC<SaveCancelBtnProps> = ({ onCancel, showControls }) => {
    const fc = useFormikContext()
    const { isSubmitting, resetForm, dirty } = fc
    if (!showControls && !dirty) { return null }

    const onSubmit = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault() // stop form from submit
        await fc.submitForm()
    }

    const onFormCancel = () => {
        resetForm()
        onCancel && onCancel()
    }

    return (
        <Footer>
            <Button
                data-test-id="form-cancel-btn"
                disabled={isSubmitting}
                onClick={onFormCancel}
            >Cancel</Button>
            <Button
                data-test-id="form-save-btn"
                busy={isSubmitting}
                onClick={onSubmit}
                primary
            >Save</Button>
        </Footer>
    )
}


export function EditingForm<T>({
    children, showControls, className, onCancel, ...props
}: FormProps<T>): ReactElement {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            <SaveCancelBtn onCancel={onCancel} showControls={showControls} />
        </Form>
    )
}
