import { React } from '@common'
import styled from '@emotion/styled'
import { colors } from '../theme'

import { Field } from 'formik'
import { useApi, useUserInfo, useEnvironment, useUserPreferences } from '@lib'
import {
    TopNavBar, Box, Icon, Row, HelpLink, LoadingAnimation, Footer, ResourceLinks,
} from '@components'
import { UserPreferences } from '@api'
import CustomerSupportImage from '../components/customer-support-image'


const Wrapper = styled.div({
    h5: {
        paddingTop: 20,
        paddingBottom: 10,
    },
    label: {
        display: 'flex',
        '&.text': {
            margin: '20px 0',
            flexDirection: 'column',
            span: {
                marginBottom: 10,
            },
            input: {
                padding: 10,
                background: colors.lightGray,
                border: 0,
                borderRadius: 2,
            },
        },
        '&.check': {
            margin: '10px 0',
            input: {
                marginRight: 5,
            },
        },
    },
})

const SidebarWrapper = styled.div({
    height: '100%',
    paddingTop: 40,
    backgroundColor: '#e9ecef',
    width: 300,
    right: 0,
    top: 0,
    position: 'fixed',
    padding: '120px 20px',
    display: 'flex',
    flexDirection: 'column',
    a: {
        color: colors.darkGray,
        fontSize: 18,
    },
})

const Sidebar = () => {
    return (
        <SidebarWrapper>
            <ResourceLinks />
            <CustomerSupportImage />
            <HelpLink />
        </SidebarWrapper>
    )
}

export default function AdminHome() {
    const env = useEnvironment()
    const api = useApi()
    const userInfo = useUserInfo()
<<<<<<< HEAD
    const prefs = useUserPreferences()
    if (!userInfo || !prefs) return <LoadingAnimation message="Loading account…" />;
=======
    const isMobile = useIsMobileDevice()

    if (!userInfo) return <LoadingAnimation message="Loading account…" />;
>>>>>>> a2a1804 (add resources sidebar onto account details screen)

    const email = userInfo.contact_infos.find(e => e.type == 'EmailAddress')
    const savePrefs = async (update: UserPreferences) => {
        await api.updatePreferences({ updatePreferences: { preferences: update } })
    }

    return (
        <Wrapper className="account" css={{
            minHeight: '100vh', position: 'relative',
        }}>
            {!isMobile && <Sidebar />}
            <TopNavBar className="fixed-top" />
            <div className="container-lg my-4 py-4">
                <div css={{ maxWidth: '600px' }}>
                    <h2>My Account</h2>
                    <Box justify='between'>
                        <h5>General</h5>
                        <a href={`${env.accounts_url}`}>
                            <span>Update Account</span>
                            <Icon icon="right" />
                        </a>
                    </Box>
                    <Row>
                        <label className="text">
                            <span>Name</span>
                            <input disabled value={userInfo.full_name} />
                        </label>

<<<<<<< HEAD
                <Form
                    initialValues={prefs}

                    onSubmit={savePrefs}
                >
=======
                        <Row>
        </Row>

        {email && (<label className="text">
            <span>Email</span>
            <input disabled value={email.value} />
        </label>)}

    </Row>

>>>>>>> a2a1804 (add resources sidebar onto account details screen)
        <h5>Email Notification</h5>
        <h6>Opt-in to your preferred email communications. </h6>
        <p css={{ color: colors.grayText }}>*Exception: when you win a prize on Kinetic, we will email you your gift card.</p>

        <label className="check">
<<<<<<< HEAD
    <Field type="checkbox" name="cycleDeadlinesEmail" /> Notify me of upcoming prize cycle deadlines
                    </label >
                    <label className="check">
                        <Field type="checkbox" name="prizeCycleEmail" /> Notify me of the start of a new prize cycle
                    </label>
                    <label className="check">
                        <Field type="checkbox" name="studyAvailableEmail" /> Notify me when a new study becomes available
                    </label>
                    <label className="check">
                        <Field type="checkbox" name="sessionAvailableEmail" /> Notify me when follow up sessions become available on multi-session studies
                    </label>

                    <FormSaveButton primary>Update Preferences</FormSaveButton>
                </Form >
=======
                        <input type="checkbox" name="cycle-deadlines" /> Notify me of upcoming prize cycle deadlines
                    </label>
                    <label className="check">
                        <input type="checkbox" name="prize-cycle" /> Notify me of the start of a new prize cycle
                    </label>
                    <label className="check">
                        <input type="checkbox" name="study-available" /> Notify me when a new study becomes available
                    </label>
                    <label className="check">
                        <input type="checkbox" name="session-available" /> Notify me when follow up sessions become available on multi-session studies
                    </label>
                </div>
>>>>>>> a2a1804 (add resources sidebar onto account details screen)
            </div >

        <Footer className='fixed-bottom' />
        </Wrapper >
    )
}
