import { React } from '@common'
import styled from '@emotion/styled'
import { colors } from '../theme'
import { Field } from 'formik'
import { useApi, useUserInfo, useEnvironment, useUserPreferences } from '@lib'
import {
    TopNavBar, Box, Icon, LoadingAnimation, Footer, Form, FormSaveButton,
} from '@components'
import { UserPreferences } from '@api'

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

export default function AdminHome() {
    const env = useEnvironment()
    const api = useApi()
    const userInfo = useUserInfo()
    const prefs = useUserPreferences()
    if (!userInfo || !prefs) return <LoadingAnimation message="Loading account…" />;

    const email = userInfo.contact_infos.find(e => e.type == 'EmailAddress')
    const savePrefs = async (update: UserPreferences) => {
        await api.updatePreferences({ updatePreferences: { preferences: update } })
    }

    return (
        <Wrapper className="account">
            <TopNavBar />
            <div className="container">
                <h1>My Account</h1>
                <Box justify='between'>
                    <h5>General</h5>
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
                    initialValues={prefs}

                    onSubmit={savePrefs}
                >
                    <h5>Email Notification</h5>
                    <h6>Opt-in to your preferred email communications. </h6>
                    <p css={{ color: colors.grayText }}>*Exception: when you win a prize on Kinetic, we will email you your gift card.</p>

                    <label className="check">
                        <Field type="checkbox" name="cycleDeadlinesEmail" /> Notify me of upcoming prize cycle deadlines
                    </label>
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
                </Form>
            </div>

            <Footer />
        </Wrapper>
    )
}
