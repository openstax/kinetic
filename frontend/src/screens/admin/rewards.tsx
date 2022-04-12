import * as Yup from 'yup'
import { Reward, RewardFromJSON } from '@api'
import { React, useState } from '@common'
import {
    Box, Icon, Col, EditingForm as Form, Alert, DateField, InputField,
} from '@components'
import { useApi, useFetchState, toDayOnly } from '@lib'

const RewardCard:React.FC<{ reward: Reward, onUpdate():void }> = ({ reward, onUpdate }) => {
    const [error, setError] = useState('')
    const api = useApi()
    const onDelete = async () => {
        if (reward.id) {
            await api.deleteReward({ id: reward.id })
        }
        onUpdate()
    }
    const saveReward = async (reward: Reward, meta: any) => {
        // if we're saving the record has been validated and has dates set
        reward.startAt = toDayOnly(reward.startAt!)
        reward.endAt = toDayOnly(reward.endAt!)
        let reply
        if (reward.id) {
            reply = await api.updateReward({ id: reward.id, updateReward: { reward } })
        } else {
            reply = await api.createReward({ addReward: { reward } })
        }
        meta.resetForm(reply)
        onUpdate()
    }
    return (
        <Col
            data-reward-id={reward.id || 'new'}
            sm={12} align="stretch" direction="column" className="mb-2 border"
        >
            <Box className="card-header" justify="end">
                <Icon icon="trash" data-test-id="delete-reward" onClick={onDelete} />
            </Box>
            <Box className="card-body" direction="column">
                <Form
                    onSubmit={saveReward}
                    validationSchema={Yup.object().shape({
                        points: Yup.string().required(),
                        prize: Yup.string().required(),
                        startAt: Yup.string().required(),
                        endAt: Yup.string().required(),
                        infoUrl: Yup.string().url(),
                    })}
                    initialValues={reward}
                >
                    <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
                    <InputField name="points" id="points" label="Points" type="number" md={2} />
                    <DateField name="startAt" id="start_at" label="Start At" md={5} />
                    <DateField name="endAt" id="end_at" label="End At" md={5} />
                    <InputField name="prize" id="prize" label="Prize" type="text" />
                    <InputField name="infoUrl" id="info_url" label="Information URL" type="url" />
                </Form>
            </Box>
        </Col>
    )
}

export function AdminRewards() {
    const api = useApi()
    const state = useFetchState<Reward>({
        fetch: async () => api.getRewards().then(list => list.data),
        addRecord: async () => RewardFromJSON({}),
    })
    if (state.busy) return state.busy

    return (
        <div>
            <Box justify="between" align="center" margin="bottom">
                <h4>Scheduled Rewards</h4>
                <Icon height={15} icon="plusCircle" data-test-id="add-reward" onClick={state.addNewRecord} />
            </Box>
            {state.records.map((reward, i) => (
                <RewardCard key={reward.id || i} reward={reward} onUpdate={state.fetchRecords} />
            ))}

        </div>
    )
}
