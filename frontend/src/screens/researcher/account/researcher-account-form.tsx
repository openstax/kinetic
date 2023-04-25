import * as Yup from 'yup';
import { React, styled, useState } from '@common';
import { useApi, useCurrentResearcher, useUserInfo } from '@lib';
import { colors } from '@theme';
import { Researcher } from '@api';
import { Button, Form, FormCancelButton, FormSaveButton, Tooltip } from '@nathanstitt/sundry';
import { Box, CharacterCount, cx, Icon, InputField, SelectField } from '@components';

const urlRegex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm
export const ResearcherValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(50),
    lastName: Yup.string().max(50),
    researchInterest1: Yup.string().max(25),
    researchInterest2: Yup.string().max(25),
    researchInterest3: Yup.string().max(25),
    labPage: Yup.string().matches(urlRegex, 'Enter a valid URL'),
    bio: Yup.string().max(250),
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
        backgroundColor: readOnly ? colors.lightGray : 'transparent',
    },
    '.select': {
        backgroundColor: readOnly ? colors.lightGray : 'transparent',
    },
}))

export const ResearcherAccountForm: React.FC<{className?: string}> = ({ className }) => {
    const api = useApi()

    const [researcher, setResearcher] = useState(useCurrentResearcher())

    if (!researcher) {
        return null
    }
    const userInfo = useUserInfo()
    // Default to OpenStax accounts first/last name if blank
    researcher.firstName = researcher.firstName || userInfo?.first_name
    researcher.lastName = researcher.lastName || userInfo?.last_name

    const [editing, setEditing] = useState(false)
    const [institution, setInstitution] = useState(researcher.institution)

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
        }
        catch (err) {
            console.error(err) // eslint-disable-line no-console
        }
        setEditing(false)
    }

    const onCancel = () => {
        setEditing(false)
    }

    return (
        <StyledForm
            onSubmit={saveResearcher}
            className={cx(className, 'row')}
            readOnly={!editing}
            onCancel={onCancel}
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
                    placeholder={editing ? 'Select Option' : ''}
                    onChange={(value: string) => setInstitution(value)}
                    value={institution}
                    defaultValue={institution}
                    options={institutionList}
                />
            </div>

            <Box align='baseline' gap className='mt-1'>
                <h6>Research Interests</h6>
                <Tooltip tooltip='Examples: Multimedia Learning; AI in Education; Adaptive Tutoring Systems'>
                    <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                </Tooltip>
            </Box>
            <div className='col-4'>
                <InputField
                    name="researchInterest1" />
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
                <div className="invalid-feedback">
                    <Icon icon="warning" color='red' height={18}></Icon>
                    &nbsp;
                    Please enter a valid URL
                </div>
            </div>

            <div className='mb-1 mt-1'>
                <Box align='baseline' gap>
                    <h6 className='field-title'>Bio</h6>
                    <Tooltip tooltip='Simplify your research description for mass appeal'>
                        <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                    </Tooltip>
                </Box>

                <InputField
                    name="bio"
                    type="textarea"
                    placeholder='Please add a brief bio to share with learners'
                />
                <CharacterCount max={250} name={'bio'} />
            </div>

            {!editing &&
                <Box gap>
                    <Button primary data-test-id="form-edit-btn" onClick={() => setEditing(true)}>
                        Edit Profile
                    </Button>
                </Box>
            }
            {editing &&
                <Box gap>
                    <FormSaveButton primary>
                        Save
                    </FormSaveButton>
                    <FormCancelButton onClick={onCancel}>
                        Cancel
                    </FormCancelButton>
                </Box>
            }
        </StyledForm>
    );
}