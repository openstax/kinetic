import { Alert, Box, Footer, HelpLink, Icon, InputField, ResourceLinks, SelectField, TopNavBar } from '@components';
import { React, styled, useNavigate, useState } from '@common';
import { errorToString, useApi, useCurrentResearcher, useEnvironment } from '@lib';
import { colors } from '../../theme';
import { Link } from 'react-router-dom';
import { SelectedStudies } from '../analysis/selected-studies';
import { Researcher } from '@api';
import { Button, Form, FormCancelButton, FormSaveButton } from '@nathanstitt/sundry';
import * as Yup from 'yup';
import CustomerSupportImage from '../../components/customer-support-image';
import RiceLogoURL from '../../images/rice-logo-darktext.png';

export const ResearcherValidationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    institution: Yup.string().required('Required'),
    researchInterest1: Yup.string(),
    researchInterest2: Yup.string(),
    researchInterest3: Yup.string(),
    labPage: Yup.string().url(),
    bio: Yup.string().required('Required'),
})


export default function ResearcherProfile() {
    const env = useEnvironment()
    const researcher = useCurrentResearcher()

    if (!researcher) {
        return useNavigate()('/');
    }

    return (
        <PageWrapper>
            <TopNavBar />
            <Content className='container-lg py-5'>
                <Box justify='between'>
                    <h3>My Account</h3>
                    <Link to={`${env.accounts_url}`}>
                        <span>Update Email & Password</span>
                        <Icon icon="right" />
                    </Link>
                </Box>

                <Box justify='between' gap='xxlarge'>
                    <Box direction='column' flex={{ grow: 12 }}>
                        <ProfileSection className='researcher-profile'>
                            <Box gap='xlarge' justify='between'>
                                <Avatar researcher={researcher} />
                                <ProfileForm researcher={researcher} />
                            </Box>
                        </ProfileSection>

                        <ProfileSection direction='column' gap='xxlarge'>
                            <IRB/>
                            <TermsOfUse/>
                        </ProfileSection>
                    </Box>
                    <Resources direction='column' flex={{ grow: 1 }}>
                        <ResourceLinks />
                        <CustomerSupportImage />
                        <HelpLink />
                    </Resources>
                </Box>
            </Content>

            <Footer className='mt-auto' />
        </PageWrapper>
    )
}

const IRB = () => {
    return (
        <Box justify='between'>
            <h6>IRB Detail</h6>
            <Box css={{ border: '1px solid grey', padding: 10 }} className='small' direction='column' gap>
                <Box gap='large'>
                    <img alt="Rice University logo" height="50" src={RiceLogoURL}/>
                    <Box direction='column'>
                        <span>IRB Number: DSA5CSA4</span>
                        <span css={{ color: colors.grayText }}>Expires on 12/31/2025</span>
                    </Box>
                </Box>
                <Box direction='column'>
                    <Box justify='between'>
                        <span>Principal Investigator:</span>
                        <span>First Name Last Name</span>
                    </Box>
                    <Box justify='between'>
                        <div>Institution Name:</div>
                        <div>Rice University</div>
                    </Box>
                </Box>
            </Box>
            <Link to='/'>
                <span>Check Details</span>
                <Icon icon="right" />
            </Link>
        </Box>
    )
}

const TermsOfUse = () => {
    return (
        <Box justify='between'>
            <h6>Terms of Use</h6>
            <p>Guidelines for Kinetic use</p>
            <Link to='/'>
                <span>Check Details</span>
                <Icon icon="right" />
            </Link>
        </Box>
    )
}

const Avatar: React.FC<{researcher: Researcher}> = ({ researcher }) => {
    return (
        <Box flex={{ grow: 1 }}>
            Avatar
        </Box>
    )
}

const ProfileForm: React.FC<{researcher: Researcher}> = ({ researcher }) => {
    console.log(researcher);

    const api = useApi()
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(false)
    const [institution, setInstitution] = useState(researcher.institution)

    const saveResearcher = async (researcher: Researcher) => {
        console.log('updating: ', researcher);
        try {
            if (!researcher.id) {
                return;
            }
            await api.updateResearcher({
                id: researcher.id,
                updateResearcher: { researcher },
            })
        }
        catch (err) {
            setError(await errorToString(err))
        }
        setEditing(false)
    }

    return (
        <Box flex={{ grow: 6 }} width='100%'>
            <Form
                onSubmit={saveResearcher}
                showControls
                onCancel={() => setEditing(false)}
                enableReinitialize
                readOnly={!editing}
                defaultValues={researcher}
                validationSchema={ResearcherValidationSchema}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error} />
                <h6>Name</h6>
                <InputField disabled={!editing} name="name" label="Researcher Name" auto md={6}/>
                <h6>Institution</h6>
                <SelectField
                    name="institution" id="institution" label="Institution"
                    onChange={(opt: string) => setInstitution(opt)}
                    value={institution}
                    options={[{ value: 'rice', label: 'Rice' }]}
                    auto
                    md={6}
                />
                <h6>Researcher Interest 1</h6>
                <InputField name="researchInterest1" label="Research Interest 1" lg={4} />
                <h6>Researcher Interest 2</h6>
                <InputField name="researchInterest2" label="Research Interest 2" md={4} />
                <h6>Researcher Interest 3</h6>
                <InputField name="researchInterest3" label="Research Interest 3" md={4} />

                <h6>Lab Page Link</h6>
                <InputField name="labPage" label="Lab Page Link" />

                <InputField name="bio" type="textarea" label="Bio" />

                {!editing && <Button large primary data-test-id="form-edit-btn" onClick={() => setEditing(true)}> Edit Profile</Button>}
                {editing &&
                <Box gap>
                    <FormSaveButton large primary>
                        Save
                    </FormSaveButton>
                    <FormCancelButton large onClick={() => setEditing(false)}>
                        Cancel
                    </FormCancelButton>
                </Box>
                }
                <SelectedStudies />
            </Form>
        </Box>
    );
}

const PageWrapper = styled(Box)({
    backgroundColor: colors.pageBackground,
    flexDirection: 'column',
    height: '100vh',
})

const Content = styled.div({
})

const ProfileSection = styled(Box)({
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 10,
    padding: 30,
})

const Resources = styled(Box)({
    height: '100%',
    backgroundColor: colors.white,
    marginTop: 20,
    marginBottom: 10,
    padding: 30,
})
