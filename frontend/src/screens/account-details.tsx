import { React } from '@common'
import styled from '@emotion/styled'
import { colors } from '@theme'

import { useAccountsURL, useApi, useCurrentUser, useIsMobileDevice, useUserPreferences } from '@lib'
import {
    Box,
    Footer,
    Form,
    FormSaveButton,
    HelpLink,
    Icon,
    InputField,
    LoadingAnimation,
    ResourceLinks,
    TopNavBar,
} from '@components'
import { UserPreferences } from '@api'
import CustomerSupportImage from '../components/customer-support-image'


const Wrapper = styled(Box)({
    minHeight: '100vh',
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
                background: colors.gray50,
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
        color: colors.gray70,
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

export default function AccountDetails() {
    const api = useApi()
    const isMobile = useIsMobileDevice()
    const { data: prefs } = useUserPreferences()
    const accountsURL = useAccountsURL()
    const user = useCurrentUser()

    if (!user || !prefs) return <LoadingAnimation message="Loading account…" />;

    const email = user.contactInfos?.find(e => e.type == 'EmailAddress')
    const savePrefs = async (update: UserPreferences) => {
        await api.updatePreferences({ updatePreferences: { preferences: update } })
    }

    return (
        <Wrapper direction='column' className="account">
            <TopNavBar />

            <Box className="container-lg py-4 mb-auto" justify='between'>
                <div>
                    <h2 className="mb-3">My Account</h2>
                    <Box justify='between' align="center">
                        <h5 className="mb-0 p-0">General</h5>
                        <a href={`${accountsURL}`}>
                            <span>Update Account</span>
                            <Icon icon="chevronRight" />
                        </a>
                    </Box>

                    <label className="text">
                        <span>Name</span>
                        <input disabled value={user.fullName} />
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
                        <p className="x-small" css={{ color: colors.text }}>
                            *Exception: when you win a prize on Kinetic, we will email you your gift card.
                        </p>

                        <InputField
                            type="checkbox"
                            name="digitalBadgeAvailableEmail"
                            className="newDigitalBadgeAvailableEmail"
                            label="Notify me of when a new digital badge is available"
                        />

                        <InputField
                            type="checkbox"
                            name="studyAvailableEmail"
                            className="newStudyEmail"
                            label="Notify me when a new study becomes available"
                        />

                        <InputField
                            type="checkbox"
                            name="sessionAvailableEmail"
                            className="followupMultiSessionEmail"
                            label="Notify me when follow up sessions become available on multi-session studies"
                        />

                        <FormSaveButton className="mt-3 emailPreferencesUpdated" primary>Update Preferences</FormSaveButton>
                    </Form >
                </div>
                {!isMobile && <Sidebar />}
            </Box>

            <Footer />
        </Wrapper>
    )
}
