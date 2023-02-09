import { Box, cx, Footer, HelpLink, Icon, InputField, ResourceLinks, SelectField, TopNavBar } from '@components';
import { React, styled, useState } from '@common';
import { useApi, useCurrentResearcher, useEnvironment } from '@lib';
import { colors } from '../../theme';
import { Researcher } from '@api';
import { Button, Form, FormCancelButton, FormSaveButton, Select, Tooltip } from '@nathanstitt/sundry';
import * as Yup from 'yup';
import CustomerSupportImage from '../../components/customer-support-image';
import RiceLogoURL from '../../images/rice-logo-darktext.png';
import DefaultAvatar from '../../images/default-avatar.png';
import FileUploader from '../../components/file-upload';
// TODO Use modal from @components (sundry) when center fix is applied
//  if relying on sundry modal we should remove the one in source
import { Modal } from '../../components/modal';

export const ResearcherValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(50),
    lastName: Yup.string().max(50),
    institution: Yup.string(),
    researchInterest1: Yup.string().max(25),
    researchInterest2: Yup.string().max(25),
    researchInterest3: Yup.string().max(25),
    labPage: Yup.string().url(),
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

export default function ResearcherProfile() {
    const env = useEnvironment()
    const researcher = useCurrentResearcher()

    if (!researcher) {
        return <></>
    }

    return (
        <PageWrapper>
            <TopNavBar />
            <Box className='container-lg py-5' justify='between'>
                <Box className='col-9' css={{ paddingRight: '2rem' }} direction='column'>
                    <Box justify='between' height='40px'>
                        <h3>My Account</h3>
                        <a href={`${env.accounts_url}`} target='_blank'>
                            <span>Update Email & Password</span>
                            <Icon icon="right" />
                        </a>
                    </Box>

                    <Box justify='between' gap='xxlarge'>
                        <Box direction='column' gap='xlarge'>
                            <ProfileSection className='researcher-profile'>
                                <Box gap='large' className='container-fluid'>
                                    <Avatar />
                                    <ProfileForm className='col-10'/>
                                </Box>
                            </ProfileSection>

                            <ProfileSection direction='column' gap='large'>
                                <h5 className='fw-bolder'>Research Agreements</h5>
                                <IRB/>
                                {/*<TermsOfUse/>*/}
                            </ProfileSection>
                        </Box>
                    </Box>
                </Box>

                <Box className='col-3 pl-3'>
                    <Resources direction='column' gap='small'>
                        <ResourceLinks />
                        <Box gap='medium' className='mt-1' align='center'>
                            <CustomerSupportImage height={100} />
                            <Box direction='column'>
                                <HelpLink/>
                            </Box>
                        </Box>
                    </Resources>
                </Box>
            </Box>

            <Footer className='mt-auto' />
        </PageWrapper>
    )
}

const IRB = () => {
    return (
        <Box gap='large' className='container-fluid'>
            <div className='col-2'>
                <h6>IRB Detail</h6>
            </div>
            <Box className='col-8'>
                <Box direction='column' gap css={{ border: '1px solid grey', padding: 15, width: 400 }}>
                    <Box justify='between'>
                        <img alt="Rice University logo" css={{ width: 120, height: 50 }} src={RiceLogoURL} className='col-6'/>
                        <Box direction='column' className='col-6 x-small'>
                            <span>IRB Number: IRB-FY2022-19</span>
                            <span css={{ color: colors.grayText }}>Expires on 09-01-2026</span>
                        </Box>
                    </Box>
                    <Box direction='column' className='small'>
                        <Box justify='between'>
                            <span className='col-6'>Principal Investigator:</span>
                            <span className='col-6'>Richard G Baraniuk</span>
                        </Box>
                        <Box justify='between'>
                            <div className='col-6'>Institution Name:</div>
                            <div className='col-6'>Rice University</div>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className='col-2'>
                <a href='https://drive.google.com/file/d/1x1M8EcrOOu5U1ZQAtVmhvH3DkTlhtc8I/view' target='_blank'>
                    <span>Check Details</span>
                    <Icon icon="right" />
                </a>
            </Box>
        </Box>
    )
}

// Will be used in the future
// const TermsOfUse = () => {
//     return (
//         <Box justify='between'>
//             <h6>Terms of Use</h6>
//             <p>Guidelines for Kinetic use</p>
//             <Link to='/'>
//                 <span>Check Details</span>
//                 <Icon icon="right" />
//             </Link>
//         </Box>
//     )
// }

const Avatar: React.FC = () => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    if (!researcher) {
        return <></>
    }
    const imageURL = researcher.avatarUrl || DefaultAvatar;
    const AvatarImage = styled.img({
        borderRadius: '50%',
        border: `1px solid ${colors.lightGray}`,
        padding: researcher.avatarUrl ? 0 : 25,
        height: 125,
        width: 125,
    })
    const [avatar, setAvatar] = useState<Blob>()
    const [isShowingModal, setShowingModal] = useState(false)
    const onHide = () => setShowingModal(false)

    const saveResearcher = async (researcher: Researcher) => {
        if (!researcher.id) {
            return;
        }
        const r = await api.updateResearcherAvatar({
            id: researcher.id,
            avatar,
        })
        setResearcher(r)
        onHide()
    }

    const updateImage = (file: File) => {
        setAvatar(file)
    }

    return (
        <Box className='col-2' justify='start' direction='column'>
            <Box onClick={() => setShowingModal(true)} direction='column' align='center' gap='large' css={{ cursor: 'pointer' }} >
                <AvatarImage alt="User Avatar" src={imageURL}/>

                <Box align='baseline' gap>
                    <a className='links'>{researcher.avatarUrl ? 'Change Image' : 'Upload Image'}</a>
                    <Tooltip tooltip='Upload a picture that best introduces you to learners'>
                        <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={14}/>
                    </Tooltip>
                </Box>
            </Box>

            <Modal
                onHide={onHide}
                center
                show={isShowingModal}
                large
                data-test-id="update-avatar-modal"
                title='Update Avatar'
            >
                <Modal.Body>
                    <Form
                        onSubmit={saveResearcher}
                        showControls
                        onCancel={onHide}
                        defaultValues={researcher}
                    >
                        <Box direction='column' align='center' justify='center' gap>
                            <FileUploader name='avatar' onChange={updateImage} accept='image/jpg, image/png' />
                        </Box>
                    </Form>
                </Modal.Body>
            </Modal>
        </Box>
    )
}

const CharacterCount: React.FC<{count: number, max: number}> = ({ count, max }) => {
    return (
        (count > max) ?
            <Box css={{ color: colors.red }} align='center' gap='small'>
                <Icon icon="warning" height={16} />
                <small>{count} / {max} character</small>
            </Box> :
            <small css={{ color: colors.grayText }}>{count} / {max} character</small>
    )
}

const ProfileForm: React.FC<{className?: string}> = ({ className }) => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    if (!researcher) {
        return <></>
    }
    const formCountDefaults = {
        ['firstName']: researcher.firstName?.length || 0,
        ['lastName']: researcher.lastName?.length || 0,
        ['researchInterest1']: researcher.researchInterest1?.length || 0,
        ['researchInterest2']: researcher.researchInterest2?.length|| 0,
        ['researchInterest3']: researcher.researchInterest3?.length || 0,
        ['bio']: researcher.bio?.length || 0,
    }
    const [editing, setEditing] = useState(false)
    const [counts, setCounts] = useState<{[key: string]: number}>(formCountDefaults)
    const [institution, setInstitution] = useState(researcher.institution)

    const formStyles = {
        button: {
            width: 130,
            justifyContent: 'center',
        },
        '.form-control': {
            backgroundColor: editing ? 'transparent' : `${colors.lightGray} !important`,
        },
        '.select': {
            backgroundColor: editing ? 'transparent' : `${colors.lightGray} !important`,
        },
    }

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

    const validateCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const current = e.target.value.length;
        const name = e.target.name;
        setCounts({
            ...counts,
            [name]: current,
        })
    }

    const onCancel = () => {
        setEditing(false)
        setCounts(formCountDefaults)
    }

    return (
        <Form
            onSubmit={saveResearcher}
            className={cx(className, 'row')}
            css={formStyles}
            readOnly={!editing}
            onCancel={onCancel}
            defaultValues={researcher}
            validationSchema={ResearcherValidationSchema}
        >
            <div className='col-6'>
                <h6>First Name</h6>
                <InputField
                    name="firstName"
                    onChange={validateCount}
                />
                <CharacterCount count={counts['firstName']} max={50} />
            </div>

            <div className='col-6'>
                <h6>Last Name</h6>
                <InputField
                    name="lastName"
                    onChange={validateCount}
                />
                <CharacterCount count={counts['lastName']} max={50} />
            </div>

            <div className='col-12 mt-1'>
                <h6>Institution</h6>
                <Select
                    name="institution"
                    isDisabled={!editing}
                    id="institution"
                    placeholder={editing ? 'Select Option' : ''}
                    onChange={(opt: string) => setInstitution(opt)}
                    value={institution}
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
                    name="researchInterest1"
                    maxLength={25}
                    onChange={validateCount}
                />
                <CharacterCount count={counts['researchInterest1']} max={25} />
            </div>

            <div className='col-4'>
                <InputField
                    name="researchInterest2"
                    maxLength={25}
                    onChange={validateCount}
                />
                <CharacterCount count={counts['researchInterest2']} max={25} />
            </div>

            <div className='col-4'>
                <InputField
                    name="researchInterest3"
                    maxLength={25}
                    onChange={validateCount}
                />
                <CharacterCount count={counts['researchInterest3']} max={25} />
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
                    maxLength={250}
                    placeholder='Please add a brief bio to share with learners'
                    onChange={validateCount}
                />
                <CharacterCount count={counts['bio']} max={250} />
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
        </Form>
    );
}

const PageWrapper = styled(Box)({
    backgroundColor: colors.pageBackground,
    flexDirection: 'column',
    height: '100vh',
})

const ProfileSection = styled(Box)({
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightGray}`,
    borderRadius: 5,
    padding: 30,
})

const Resources = styled(Box)({
    maxHeight: 250,
    border: `1px solid ${colors.lightGray}`,
    marginTop: 40,
    borderRadius: 5,
    backgroundColor: colors.white,
    padding: 20,
    'a': {
        color: colors.grayText,
    },
})
