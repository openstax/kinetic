import { HelpLink, Icon, Page, ResourceLinks, Tooltip } from '@components';
import { React, styled, useState } from '@common';
import { useAccountsURL, useApi, useCurrentResearcher, useFetchEnvironment } from '@lib';
import { colors } from '@theme';
import CustomerSupportImage from '../../../components/customer-support-image';
import RiceLogoURL from '../../../images/rice-logo-darktext.png';
import DefaultAvatar from '../../../images/default-avatar.png';
import { ResearcherAccountForm } from './researcher-account-form';
import { Button, Container, Grid, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';

export default function ResearcherAccountPage() {
    const researcher = useCurrentResearcher()
    const accountsUrl = useAccountsURL()

    if (!researcher) {
        return null
    }

    return (
        <Page hideFooter>
            <Container py='xl'>
                <Grid gutter='xl'>
                    <Grid.Col span={{ lg: 9 }}>
                        <Group justify='space-between' h='40px'>
                            <h3>My Account</h3>
                            <a href={`${accountsUrl}`} target='_blank'>
                                <span>Update Email & Password</span>
                                <Icon icon="chevronRight" />
                            </a>
                        </Group>

                        <Stack gap='xl'>
                            <ProfileSection>
                                <Stack>
                                    <h5 className='fw-bolder pb-2'>Researcher Profile</h5>
                                    <Grid gutter='lg'>
                                        <Grid.Col span={2}>
                                            <Avatar />
                                        </Grid.Col>
                                        <Grid.Col span={10}>
                                            <ResearcherAccountForm />
                                        </Grid.Col>
                                    </Grid>
                                </Stack>
                            </ProfileSection>


                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{ lg: 3 }}>
                        <Resources gap='md'>
                            <ResourceLinks />
                            <Group mt='lg'>
                                <CustomerSupportImage height={100} />
                                <HelpLink/>
                            </Group>
                        </Resources>
                    </Grid.Col>

                    <Grid.Col span={{ lg: 9 }}>
                        <IRBSection gap='large'>
                            <h5 className='fw-bolder'>Research Agreements</h5>
                            <Grid gutter='lg' align='flex-start' justify='space-between'>
                                <Grid.Col span={2}>
                                    <h6>IRB Detail</h6>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <IRB/>
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <a href='https://drive.google.com/file/d/1x1M8EcrOOu5U1ZQAtVmhvH3DkTlhtc8I/view' target='_blank'>
                                        <span>Check Details</span>
                                        <Icon icon="chevronRight" />
                                    </a>
                                </Grid.Col>
                            </Grid>
                            {/*<TermsOfUse/>*/}
                        </IRBSection>
                    </Grid.Col>

                </Grid>
            </Container>
        </Page>
    )
}

export const IRB = () => {
    return (
        <Stack gap='xs' css={{ border: '1px solid grey', padding: 15, width: '100%' }}>
            <Grid>
                <Grid.Col span={6}>
                    <img alt="Rice University logo" css={{ width: 120, height: 50 }} src={RiceLogoURL} />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Stack align='flex-start' gap='0'>
                        <Text size='xs'>IRB Number: IRB-FY2022-19</Text>
                        <Text size='xs' c={colors.text}>Expires on 09-01-2026</Text>
                    </Stack>
                </Grid.Col>
            </Grid>

            <Stack gap='xs'>
                <Grid>
                    <Grid.Col span={6}>
                        <Text size='sm'>Principal Investigator:</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Text size='sm'>Richard G Baraniuk</Text>
                    </Grid.Col>
                </Grid>
                <Grid>
                    <Grid.Col span={6}>
                        <Text size='sm'>Institution Name:</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Text size='sm'>Rice University</Text>
                    </Grid.Col>
                </Grid>
            </Stack>
        </Stack>
    )
}

// Will be used in the future
// const TermsOfUse = () => {
//     return (
//         <Group justify='space-between'>
//             <h6>Terms of Use</h6>
//             <p>Guidelines for Kinetic use</p>
//             <Link to='/'>
//                 <span>Check Details</span>
//                 <Icon icon="chevronRight" />
//             </Link>
//         </Group>
//     )
// }

const Avatar: React.FC = () => {
    const api = useApi()
    const [researcher, setResearcher] = useState(useCurrentResearcher())
    const { refetch: refetchEnv } = useFetchEnvironment()
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [files, setFiles] = useState<FileWithPath[]>([]);

    if (!researcher) {
        return null
    }

    const previews = files.map((file) => {
        const url = URL.createObjectURL(file);
        return (
            <Image key={file.path} alt='Avatar preview' h={200} w={200} src={url} style={{
                border: `1px solid ${colors.gray50}`,
                borderRadius: '50%',
                objectFit: 'cover',
                aspectRatio: '1/1',
            }} />
        )
    });

    const imageURL = researcher.avatarUrl || DefaultAvatar;
    const onHide = () => {
        setShowAvatarModal(false)
        setFiles([])
    }

    const updateAvatar = async () => {
        const file = files[0];
        if (!researcher.id || !file) {
            return;
        }
        const r = await api.updateResearcherAvatar({
            id: researcher.id,
            avatar: file,
        })
        await refetchEnv()
        setResearcher(r)
        onHide()
    }

    return (
        <Stack justify='start'>
            <Stack onClick={() => setShowAvatarModal(true)} align='center' gap='large' css={{ cursor: 'pointer' }} >
                <Image alt='User Avatar' h={125} w={125} radius='lg' src={imageURL} p={researcher.avatarUrl ? '0' : '25px'} style={{
                    border: `1px solid ${colors.gray50}`,
                    borderRadius: '50%',
                }} />

                <Group align='baseline' gap='xs'>
                    <a className='links'>{researcher.avatarUrl ? 'Change Image' : 'Upload Image'}</a>
                    <Tooltip tooltip='Upload a picture that best introduces you to learners'>
                        <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={14}/>
                    </Tooltip>
                </Group>
            </Stack>
            <Modal size='lg' centered opened={showAvatarModal} onClose={onHide} title="Update Avatar">
                <Stack>
                    <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles} maxFiles={1}>
                        {previews.length ?
                            <Stack gap='xl' align='center'>
                                {previews}
                            </Stack> :
                            <Stack align='center'>
                                <Icon icon='cloudUpload' height={120}/>
                                <h5>Drag and drop your profile image here</h5>
                                <h5>or click here to upload an image</h5>
                                <small>File format: jpg or png only</small>
                            </Stack>
                        }
                    </Dropzone>
                    <Stack align='center'>
                        {!!previews.length && <Button color='purple' onClick={updateAvatar}>
                            Save Changes
                        </Button> }
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    )
}

const IRBSection = styled(Stack)({
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray50}`,
    borderRadius: 5,
    padding: 30,
})


const ProfileSection = styled(Group)({
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray50}`,
    borderRadius: 5,
    padding: 30,
})

const Resources = styled(Stack)({
    border: `1px solid ${colors.gray50}`,
    borderRadius: 5,
    backgroundColor: colors.white,
    padding: 20,
    'a': {
        color: colors.text,
    },
})
