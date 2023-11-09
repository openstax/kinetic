import { cx, React, styled, useState, Yup } from '@common';
import { useApi, useCurrentResearcher, useFetchEnvironment, useUserInfo } from '@lib';
import { colors } from '@theme';
import { Researcher } from '@api';
import {
    Box,
    CharacterCount,
    FieldErrorMessage,
    Form,
    FormSaveButton,
    Icon,
    InputField,
    Tooltip,
    useFormContext,
    useFormState,
    SelectField,
} from '@components';

const urlRegex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
export const ResearcherValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(50),
    lastName: Yup.string().max(50),
    researchInterest1: Yup.string().max(25),
    researchInterest2: Yup.string().max(25),
    researchInterest3: Yup.string().max(25),
    institution: Yup.mixed().required('Required'),
    labPage: Yup.string().matches(urlRegex, {
        message: 'Please enter a valid URL',
        excludeEmptyString: true,
    }),
    bio: Yup.string().max(250).required('Required'),
})

const institutionList = [
    { value: 'Arizona State University', label: 'Arizona State University' },
    { value: 'Georgia State University', label: 'Georgia State University' },
    { value: 'Mississippi State University', label: 'Mississippi State University' },
    { value: 'Rice University', label: 'Rice University' },
    { value: 'University of California, Santa Barbara', label: 'University of California, Santa Barbara' },
    { value: 'University of Florida', label: 'University of Florida' },
    { value: 'University of Massachusetts, Amherst', label: 'University of Massachusetts, Amherst' },
    { value: 'University of North Dakota', label: 'University of North Dakota' },
    { value: 'University of Pennsylvania', label: 'University of Pennsylvania' },
];

const StyledForm = styled(Form<Researcher>)(({ readOnly }) => ({
    button: {
        width: 130,
        justifyContent: 'center',
    },
    '.form-control': {
        backgroundColor: readOnly ? colors.gray50 : 'transparent',
    },
    '.select': {
        backgroundColor: readOnly ? colors.gray50 : 'transparent',
    },
}))

export const ResearcherAccountForm: React.FC<{className?: string}> = ({ className }) => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    const { refetch: refetchEnv } = useFetchEnvironment()
    const { data: userInfo, refetch: refetchUser } = useUserInfo()

    if (!researcher) {
        return null
    }

    // Default to OpenStax accounts first/last name if blank
    researcher.firstName = researcher.firstName || userInfo?.first_name
    researcher.lastName = researcher.lastName || userInfo?.last_name

    const saveResearcher = async (researcher: Researcher) => {
        try {
            if (!researcher.id) {
                return;
            }
            const r = await api.updateResearcher({
                id: researcher.id,
                updateResearcher: { researcher },
            })
            setResearcher(r)
            refetchUser()
            refetchEnv()
        }
        catch (err) {
            console.error(err) // eslint-disable-line no-console
        }
    }

    return (
        <StyledForm
            onSubmit={saveResearcher}
            className={cx(className, 'row')}
            defaultValues={researcher}
            validationSchema={ResearcherValidationSchema}
        >
            <div className='col-6'>
                <h6>First Name</h6>
                <InputField name="firstName"/>
                <CharacterCount max={50} name={'firstName'} />
            </div>

            <div className='col-6'>
                <h6>Last Name</h6>
                <InputField name="lastName"/>
                <CharacterCount max={50} name='lastName' />
            </div>

            <div className='col-12 mt-1'>
                <h6>Institution</h6>

                <SelectField
                    name="institution"
                    isClearable={true}
                    placeholder={'Select Option'}
                    defaultValue={researcher.institution}
                    options={institutionList}
                />
                <FieldErrorMessage name='institution' />
            </div>
            <Box align='baseline' gap className='mt-1'>
                <h6>Research Interests</h6>
                <Tooltip tooltip='Examples: Multimedia Learning; AI in Education; Adaptive Tutoring Systems'>
                    <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={16}/>
                </Tooltip>
            </Box>
            <div className='col-4'>
                <InputField name="researchInterest1" />
                <CharacterCount max={25} name='researchInterest1' />
            </div>

            <div className='col-4'>
                <InputField name="researchInterest2" />
                <CharacterCount max={25} name='researchInterest2' />
            </div>

            <div className='col-4'>
                <InputField name="researchInterest3" />
                <CharacterCount max={25} name='researchInterest3' />
            </div>

            <div className='mt-1'>
                <h6>Lab Page Link</h6>
                <InputField placeholder='https://' name="labPage" />
                <FieldErrorMessage name='labPage' />
            </div>

            <div className='mb-1 mt-1'>
                <Box align='baseline' gap>
                    <h6 className='field-title'>Bio</h6>
                    <Tooltip tooltip='This bio will be visible to learners, as a chance for them to know more about the researcher conducting the study'>
                        <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={16}/>
                    </Tooltip>
                </Box>

                <InputField
                    name="bio"
                    type="textarea"
                    placeholder='Please add a brief bio to share with learners'
                />
                <CharacterCount max={250} name={'bio'} />
                <FieldErrorMessage name='bio' />
            </div>

            <FormSave />
        </StyledForm>
    );
}

const FormSave: FC = () => {
    const { isDirty, isValid } = useFormState()

    return (
        <Box gap justify='end' className='mt-4'>
            <FormSaveButton primary disabled={!isValid || !isDirty}>
                Save
            </FormSaveButton>
        </Box>
    )
}
