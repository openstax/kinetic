import * as Yup from 'yup'
import { BannerNotice, BannerNoticeFromJSON } from '@api'
import { React, useEffect, useState } from '@common'
import {
    Box, Icon, Col, EditingForm as Form, Alert, DateField, InputField,
} from '@components'
import { useApi } from '@lib'


const Banner:React.FC<{ banner: BannerNotice, onUpdate():void }> = ({ banner, onUpdate }) => {
    const [error, setError] = useState('')
    const api = useApi()
    const onDelete = () => {
        api.deleteBanner({ id: banner.id! }).then(onUpdate)
    }
    const saveBanner = async (banner: BannerNotice, meta: any) => {
        let reply
        if (banner.id) {
            reply = await api.updateBanner({ id: banner.id, updateBanner: { banner } })
        } else {
            reply = await api.createBanner({ addBanner: { banner } })
        }
        meta.resetForm(reply)
        onUpdate()
    }
    return (
        <Col sm={12} align="stretch" direction="column" className="mb-2 border">
            <Box className="card-header" justify="end">
                <Icon icon="trash" onClick={onDelete} />
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
                    <InputField name="message" id="message" label="Message" type="textarea" />


                    <DateField name="startAt" id="start_at" label="Start At" />
                    <DateField name="endAt" id="end_at" label="End At" />
                </Form>
            </Box>
        </Col>
    )
}

export function AdminBanners() {
    const api = useApi()
    const [banners, setBanners] = useState<BannerNotice[]>([])
    const fetchBanners = () => {
        api.getBanners().then((list) => setBanners(list.data))
    }
    useEffect(fetchBanners, [])
    const addNewBanner = () => {
        setBanners([BannerNoticeFromJSON({}), ...banners ])
    }

    return (
        <div>
            <Box justify="between">
                <h4>Banners!</h4>
                <Icon height={15} icon="plusCircle" data-test-id="add-stage" onClick={addNewBanner} />
            </Box>
            {banners.map((banner, i) => <Banner key={banner.id || i} banner={banner} onUpdate={fetchBanners}/>)}

        </div>
    )
}
