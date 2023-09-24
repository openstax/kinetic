import * as Yup from 'yup'
import { Reward, RewardFromJSON } from '@api'
import { React, useState } from '@common'
import { Alert, Box, Col, DateTimeField, EditingForm as Form, Icon, InputField } from '@components'
import { useApi, useFetchState } from '@lib'
import { Main } from './grid'
import { colors } from '@theme';

const RewardCard: React.FC<{ reward: Reward, onUpdate(): void }> = ({ reward, onUpdate }) => {
    const [error, setError] = useState('')
    const api = useApi()
    const onDelete = async () => {
        if (reward.id) {
            await api.deleteReward({ id: reward.id })
        }
        onUpdate()
    }
    const saveReward = async (reward: Reward) => {
        try {
            if (reward.id) {
                await api.updateReward({ id: reward.id, updateReward: { reward } })
            } else {
                await api.createReward({ addReward: { reward } })
            }
            onUpdate()
        } catch (e) { setError(String(e)) }
    }

    return (
        <Col
            data-reward-id={reward.id || 'new'}
            sm={12} align="stretch" direction="column" className="mb-2 border"
        >
            <Box className="card-header" justify="end">
                <Icon height={24} color={colors.red} icon="trash" data-testid="delete-reward" onClick={onDelete} />
            </Box>
            <Box className="card-body" direction="column">
                <Form
                    name="reward"
                    onSubmit={saveReward}
                    showControls={!reward.id}
                    validationSchema={Yup.object().shape({
                        points: Yup.string().required(),
                        prize: Yup.string().required(),
                        startAt: Yup.string().required(),
                        endAt: Yup.string().required(),
                        description: Yup.string(),
                    })}
                    defaultValues={reward}
                >
                    <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
                    <InputField name="points" id="points" label="Points" type="number" md={2} />
                    <DateTimeField
                        rangeNames={['startAt', 'endAt']}
                        name="dates"
                        label="Date Range"
                        withTime
                        sm={10}
                    />
                    <InputField name="prize" id="prize" label="Prize" type="text" />
                    <InputField name="description" id="description" label="Reward Description" type="text" />
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
        <Main className="container pt-2">
            <Box justify="between" align="center" margin="bottom">
                <h4>Scheduled Rewards</h4>
                <Icon height={24} icon="plusCircleOutline" data-testid="add-reward" onClick={state.addNewRecord} />
            </Box>
            {state.records.map((reward, i) => (
                <RewardCard key={reward.id || i} reward={reward} onUpdate={state.fetchRecords} />
            ))}
        </Main>
    )
}
