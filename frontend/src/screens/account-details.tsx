import { cx, React } from '@common'
import styled from '@emotion/styled'
import { colors } from '../theme'

import { useApi, useUserInfo, useEnvironment, useIsMobileDevice, useUserPreferences } from '@lib'
import {
    TopNavBar, Box, Icon, HelpLink, LoadingAnimation, Footer, ResourceLinks,
    Form, FormSaveButton, InputField,
} from '@components'
import { UserPreferences } from '@api'
import CustomerSupportImage from '../components/customer-support-image'


const Wrapper = styled(Box)({
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
            margin: '15px 0',
            input: {
                marginRight: 5,
            },
        },
    },
})

const SidebarWrapper = styled.div({
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 80,
    borderLeft: '1px solid grey',
    height: 'auto',
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
    const isMobile = useIsMobileDevice()

    const prefs = useUserPreferences()
    if (!userInfo || !prefs) return <LoadingAnimation message="Loading account…" />;

    const email = userInfo.contact_infos.find(e => e.type == 'EmailAddress')
    const savePrefs = async (update: UserPreferences) => {
        await api.updatePreferences({ updatePreferences: { preferences: update } })
    }

    return (
        <Wrapper direction='column' className="account">
            <TopNavBar />

            <Box className="container-lg py-4" justify='between'>
                <div >
                    <h2 className="mb-3">My Account</h2>
                    <Box justify='between' align="center">
                        <h5 className="mb-0 p-0">General</h5>
                        <a href={`${env.accounts_url}`}>
                            <span>Update Account</span>
                            <Icon icon="right" />
                        </a>
                    </Box>

                    <label className="text">
                        <span>Name</span>
                        <input disabled value={userInfo.full_name} />
                    </label>

                    {email && (<label className="text">
                        <span>Email</span>
                        <input disabled value={email.value} />
                    </label>)}

                    <Form
                        defaultValues={prefs}
                        onSubmit={savePrefs}
                    >
                        <h5 className="mt-5 mb-3 p-0">Email Notifications</h5>
                        <h6>Adjust your preferred email communications. </h6>
                        <p className="x-small" css={{ color: colors.grayText }}>
                            *Exception: when you win a prize on Kinetic, we will email you your gift card.
                        </p>

                        <InputField type="checkbox"
                            name="cycleDeadlinesEmail"
                            label="Notify me of upcoming prize cycle deadlines" />

                        <InputField type="checkbox"
                            name="prizeCycleEmail" label="Notify me of the start of a new prize cycle" />

                        <InputField type="checkbox"
                            name="studyAvailableEmail"
                            label="Notify me when a new study becomes available" />

                        <InputField type="checkbox"
                            name="sessionAvailableEmail"
                            label="Notify me when follow up sessions become available on multi-session studies" />

                        <FormSaveButton className="mt-3" primary>Update Preferences</FormSaveButton>
                    </Form >
                </div>

                {!isMobile && <Sidebar />}
            </Box >

            <Footer className={cx({ 'fixed-bottom': !isMobile })}/>
        </Wrapper>
    )
}
