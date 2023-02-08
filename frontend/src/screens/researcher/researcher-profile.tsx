import { Box, cx, Footer, HelpLink, Icon, InputField, ResourceLinks, SelectField, TopNavBar } from '@components';
import { React, styled, useState } from '@common';
import { useApi, useCurrentResearcher, useEnvironment } from '@lib';
import { colors } from '../../theme';
import { Researcher } from '@api';
import { Button, Form, FormCancelButton, FormSaveButton, Tooltip } from '@nathanstitt/sundry';
import * as Yup from 'yup';
import CustomerSupportImage from '../../components/customer-support-image';
import RiceLogoURL from '../../images/rice-logo-darktext.png';
import DefaultAvatar from '../../images/default-avatar.png';
import FileUploader from '../../components/file-upload';
// TODO Use modal from @components (sundry) when center fix is applied
//  if relying on sundry modal we should remove the one in source
import { Modal } from '../../components/modal';

export const ResearcherValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required').max(50),
    lastName: Yup.string().required('Required').max(50),
    institution: Yup.string().required('Required'),
    researchInterest1: Yup.string().max(25),
    researchInterest2: Yup.string().max(25),
    researchInterest3: Yup.string().max(25),
    labPage: Yup.string().url(),
    bio: Yup.string().required('Required').max(250),
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
            <Box className='container-lg py-5' gap='xlarge'>
                <Box className='col-9' direction='column'>
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

                <Box className='col-3'>
                    <Resources direction='column' gap='small'>
                        <ResourceLinks />
                        <Box gap='medium' className='mt-1' align='center'>
                            <CustomerSupportImage height={120} />
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
        <Box justify='between'>
            <h6>IRB Detail</h6>
            <Box css={{ border: '1px solid grey', padding: 15, width: 400 }} direction='column' gap>
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
            <a href='https://drive.google.com/file/d/1x1M8EcrOOu5U1ZQAtVmhvH3DkTlhtc8I/view' target='_blank'>
                <span>Check Details</span>
                <Icon icon="right" />
            </a>
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

const AvatarImage = styled.img({
    borderRadius: '50%',
    border: `1px solid ${colors.lightGray}`,
    height: 125,
    width: 125,
})

const Avatar: React.FC = () => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    if (!researcher) {
        return <></>
    }
    const imageURL = researcher.avatarUrl || DefaultAvatar;
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
                    <a className='links'>Upload Image</a>
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
                            <FileUploader name='avatar' onChange={updateImage} accept='image/*' />
                        </Box>
                    </Form>
                </Modal.Body>
            </Modal>
        </Box>
    )
}

const ProfileForm: React.FC<{className?: string}> = ({ className }) => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    if (!researcher) {
        return <></>
    }
    const [editing, setEditing] = useState(false)
    const [counts, setCounts] = useState<{[key: string]: string}>({
        ['firstName']: `${researcher.firstName?.length} / 50`,
        ['lastName']: `${researcher.lastName?.length} / 50`,
        ['researchInterest1']: `${researcher.researchInterest1?.length} / 25`,
        ['researchInterest2']: `${researcher.researchInterest2?.length} / 25`,
        ['researchInterest3']: `${researcher.researchInterest3?.length} / 25`,
        ['bio']: `${researcher.bio?.length} / 250`,
    })
    const [institution, setInstitution] = useState(researcher.institution)

    const formStyles = {
        button: {
            width: 130,
            justifyContent: 'center',
        },
        '.form-control': {
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
        const max = e.target.maxLength;
        const name = e.target.name;
        setCounts({
            ...counts,
            [name]: `${current} / ${max}`,
        })
    }

    const onCancel = () => {
        setEditing(false)
        setCounts({
            ['firstName']: `${researcher.firstName?.length} / 50`,
            ['lastName']: `${researcher.lastName?.length} / 50`,
            ['researchInterest1']: `${researcher.researchInterest1?.length} / 25`,
            ['researchInterest2']: `${researcher.researchInterest2?.length} / 25`,
            ['researchInterest3']: `${researcher.researchInterest3?.length} / 25`,
            ['bio']: `${researcher.bio?.length} / 250`,
        })
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
                <InputField name="firstName" maxLength={50}  onChange={validateCount} />
                <small>{counts['firstName']}</small>
            </div>

            <div className='col-6'>
                <h6>Last Name</h6>
                <InputField name="lastName" maxLength={50} onChange={validateCount}/>
                <small>{counts['lastName']}</small>
            </div>

            <div className='col-12 mt-1'>
                <h6>Institution</h6>
                <SelectField
                    name="institution" id="institution"
                    label='Institution'
                    placeholder='Select Option'
                    onChange={(opt: string) => setInstitution(opt)}
                    value={institution}
                    options={institutionList}
                    auto
                />
            </div>

            <Box align='baseline' gap>
                <h6>Research Interests</h6>
                <Tooltip tooltip='Examples: Multimedia Learning; AI in Education; Adaptive Tutoring Systems'>
                    <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                </Tooltip>
            </Box>
            <div className='col-4'>
                <InputField name="researchInterest1" maxLength={25} onChange={validateCount}/>
                <small>{counts['researchInterest1']}</small>
            </div>

            <div className='col-4'>
                <InputField name="researchInterest2" maxLength={25} onChange={validateCount}/>
                <small>{counts['researchInterest2']}</small>
            </div>

            <div className='col-4'>
                <InputField name="researchInterest3" maxLength={25} onChange={validateCount}/>
                <small>{counts['researchInterest3']}</small>
            </div>

            <div className='mt-1'>
                <h6>Lab Page Link</h6>
                <InputField name="labPage" />
            </div>

            <div className='mb-1 mt-1'>
                <Box align='baseline' gap>
                    <h6 className='field-title'>Bio</h6>
                    <Tooltip tooltip='Your biography'>
                        <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                    </Tooltip>
                </Box>

                <InputField name="bio" type="textarea" maxLength={250} onChange={validateCount}/>
                <small>{counts['bio']}</small>
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
    width: '100%',
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
