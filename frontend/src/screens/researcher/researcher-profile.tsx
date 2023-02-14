import { Box, Footer, HelpLink, Icon, ResourceLinks, TopNavBar } from '@components';
import { React, styled, useState } from '@common';
import { useApi, useCurrentResearcher, useEnvironment } from '@lib';
import { colors } from '../../theme';
import { Researcher } from '@api';
import { Col, Form, Modal, Tooltip } from '@nathanstitt/sundry';
import CustomerSupportImage from '../../components/customer-support-image';
import RiceLogoURL from '../../images/rice-logo-darktext.png';
import DefaultAvatar from '../../images/default-avatar.png';
import FileUploader from '../../components/file-upload';
import { ProfileForm } from './researcher-account-form';


export default function ResearcherProfile() {
    const env = useEnvironment()
    const researcher = useCurrentResearcher()

    if (!researcher) {
        return null
    }

    return (
        <PageWrapper>
            <TopNavBar />
            <Box className='container-lg py-5' justify='between'>
                <Col sm={9} css={{ paddingRight: '2rem' }} direction='column'>
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
                </Col>

                <Col sm={3} className='pl-3'>
                    <Resources direction='column' gap='small'>
                        <ResourceLinks />
                        <Box gap='medium' className='mt-1' align='center'>
                            <CustomerSupportImage height={100} />
                            <Box direction='column'>
                                <HelpLink/>
                            </Box>
                        </Box>
                    </Resources>
                </Col>
            </Box>

            <Footer className='mt-auto' />
        </PageWrapper>
    )
}

const IRB = () => {
    return (
        <Box gap='large' className='container-fluid'>
            <Col sm={2}>
                <h6>IRB Detail</h6>
            </Col>
            <Col sm={8}>
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
            </Col>
            <Col sm={2}>
                <a href='https://drive.google.com/file/d/1x1M8EcrOOu5U1ZQAtVmhvH3DkTlhtc8I/view' target='_blank'>
                    <span>Check Details</span>
                    <Icon icon="right" />
                </a>
            </Col>
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
        return null
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
                            <FileUploader name='avatar' onChange={setAvatar} accept='image/jpg, image/png' />
                        </Box>
                    </Form>
                </Modal.Body>
            </Modal>
        </Box>
    )
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
