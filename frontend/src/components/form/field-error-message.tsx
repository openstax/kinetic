import { React } from '@common'
import { useFormState } from '@nathanstitt/sundry';
import { Icon } from '@components';

export const FieldErrorMessage: FC<{name: string}> = ({ name }) => {
    const { errors }  = useFormState()
    if (!errors[name]) return null

    return (
        <div className="invalid-feedback">
            <>
                <Icon icon="warning" color='red' height={18}></Icon>
                 &nbsp;
                {errors[name]?.message}
            </>
        </div>
    )
}
