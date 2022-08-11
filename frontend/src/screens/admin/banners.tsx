import * as Yup from 'yup'
import { BannerNotice, BannerNoticeFromJSON } from '@api'
import { React, useState } from '@common'
import {
    Box, Icon, Col, EditingForm as Form, Alert, DateTimeField, InputField,
} from '@components'
import { useApi, useFetchState } from '@lib'


const Banner: React.FC<{ banner: BannerNotice, onUpdate(): void }> = ({ banner, onUpdate }) => {
    const [error, setError] = useState('')
    const api = useApi()
    const onDelete = () => {
        api.deleteBanner({ id: banner.id! }).then(onUpdate)
    }
    const saveBanner = async (banner: BannerNotice, meta: any) => {
        let reply: BannerNotice
        try {
            if (banner.id) {
                reply = await api.updateBanner({ id: banner.id, updateBanner: { banner } })
            } else {
                reply = await api.createBanner({ addBanner: { banner } })
            }
            meta.resetForm(reply)
            onUpdate()
        } catch (e) {
            setError(String(e))
        }
    }
    return (
        <Col
            data-banner-id={banner.id || 'new'}
            sm={12}
            align="stretch"
            direction="column"
            className="mb-2 border bg-white"
        >
            <Box className="card-header" justify="end">
                <Icon icon="trash" data-test-id="delete-banner" onClick={onDelete} />
            </Box>
            <Box className="card-body" direction="column">
                <Form
                    onSubmit={saveBanner}
                    validationSchema={Yup.object().shape({
                        message: Yup.string().required(),
                        startAt: Yup.string().required(),
                        endAt: Yup.string().required(),
                    })}
                    initialValues={banner}
                >
                    <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
                    <DateTimeField name="dates" withTime rangeNames={['startAt', 'endAt']} label="Date range" />
                    <InputField name="message" id="message" label="Message" type="textarea" />
                </Form>
            </Box>
        </Col>
    )
}


export function AdminBanners() {
    const api = useApi()
    const state = useFetchState<BannerNotice>({
        fetch: async () => api.getBanners().then(list => list.data),
        addRecord: async () => BannerNoticeFromJSON({}),
    })
    if (state.busy) return state.busy

    return (
        <div>
            <Box justify="between" align="center" margin="bottom">
                <h4>Scheduled Banners</h4>
                <Icon height={15} icon="plusCircle" data-test-id="add-banner" onClick={state.addNewRecord} />
            </Box>
            {state.records.map((banner, i) => <Banner key={banner.id || i} banner={banner} onUpdate={state.fetchRecords} />)}
        </div>
    )
}
