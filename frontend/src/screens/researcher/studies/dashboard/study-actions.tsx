import { dayjs, React, styled, useNavigate } from '@common';
import { Icon, showResearcherNotification, showResearcherNotificationError } from '@components';
import { StageStatusEnum, Study, UpdateStudyStatusStatusActionEnum } from '@api';
import { colors } from '@theme';
import { useApi } from '@lib';
import { CellContext } from '@tanstack/react-table';
import {
    getStudyEditUrl,
    isActive,
    isCompleted,
    isDraft,
    isDraftLike,
    isPaused,
    isReadyForLaunch,
    isScheduled,
    isWaiting,
    useFetchStudies,
} from '@models';
import { Button, Group, Menu, Modal, Stack } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

const ModalType = {
    Pause: 'pauseStudy',
    End: 'endStudy',
    Resume: 'resumeStudy',
    Reopen: 'reopenStudy',
    Delete: 'deleteDraft',
};

type ModalTypeEnum = typeof ModalType[keyof typeof ModalType];

const ActionModalContent: FC<{
    study: Study,
    modalType: string,
    onHide: () => void,
    cell: CellContext<Study, any>
}> = ({ study , modalType, onHide, cell }) => {
    const api = useApi()
    const nav = useNavigate()

    const updateStudyStatus = (
        study: Study,
        statusAction: UpdateStudyStatusStatusActionEnum,
        message: string,
        stageIndex: number | undefined = undefined
    ) => {
        try {
            api.updateStudyStatus({
                id: study.id,
                statusAction,
                stageIndex,
            }).then(() => {
                showResearcherNotification(message)
                cell.table.options.meta?.refreshData()
            })
        }
        catch (err) {
            showResearcherNotificationError(String(err))
            console.error(err) // eslint-disable-line no-console
        }
        onHide()
    }

    const deleteStudy = (study: Study, message: string) => {
        try {
            api.deleteStudy({ studyId: study.id }).then(() => {
                showResearcherNotification(message)
                study.isHidden = true
                cell.table.options.meta?.refreshData()
            })
        } catch (err) {
            study.isHidden = false
            showResearcherNotificationError(String(err))
            console.error(err) // eslint-disable-line no-console
        }
        onHide()
    }

    switch(modalType) {
        case ModalType.Pause:
            return <StudyActionContainer
                header="Pause Study"
                warning={true}
                body="This action will pause the study and participants will no longer be able to view it until you resume."
                cancelText='Continue Study'
                actionText='Pause Study'
                onSubmit={() => {
                    updateStudyStatus(
                        study,
                        'pause',
                        `Study ${study.titleForResearchers} has been paused.`,
                        cell.row.depth ? cell.row.index : 0
                    )
                }}
                onCancel={onHide}
            />
        case ModalType.Resume:
            if (!study.closesAt || dayjs().isBefore(dayjs(study.closesAt))) {
                return <StudyActionContainer
                    header="Resume Study"
                    warning={false}
                    body="This action will render the study visible to learners and open for participation."
                    cancelText='Keep Study Paused'
                    actionText='Resume Study'
                    onSubmit={() => updateStudyStatus(
                        study,
                        'resume',
                        `Study ${study.titleForResearchers} has been resumed.`,
                        cell.row.depth ? cell.row.index : 0
                    )}
                    onCancel={onHide}
                />
            } else {
                return <StudyActionContainer
                    header="Resume Study"
                    warning={false}
                    body="The study you wish to resume has passed the original closing date. Please choose one of the options below."
                    actionText='Adjust Closing Date'
                    onSubmit={() => nav(`/study/overview/${study.id}?reopen=true`)}
                    cancelText='End Study'
                    onCancel={() => {
                        updateStudyStatus(
                            study,
                            'end',
                            `Study ${study.titleForResearchers} has been manually closed. It can now be found under 'Completed' studies`
                        )
                        onHide()
                    }}
                />
            }
        case ModalType.End:
            return <StudyActionContainer
                header='End Study'
                warning={true}
                body="This action will set the study status as 'Completed', rendering it no longer visible to participants."
                cancelText='Continue Study'
                actionText='End Study'
                onSubmit={() => updateStudyStatus(
                    study,
                    'end',
                    `Study ${study.titleForResearchers} has been manually closed. It can now be found under 'Completed' studies`
                )}
                onCancel={onHide}
            />
        case ModalType.Delete:
            return <StudyActionContainer
                header="Delete Study"
                warning={true}
                data-testid='delete-study'
                body={study.status === StageStatusEnum.Scheduled ?
                    'This action will delete the study and all data collected thus far. This is permanent and cannot be undone. Are you sure?' :
                    'This action will delete the study draft. This is permanent and cannot be undone. Are you sure?'
                }
                cancelText='No, keep the study'
                actionText='Yes, delete the study'
                onSubmit={() => deleteStudy(
                    study,
                    study.status === StageStatusEnum.Scheduled ?
                        `Scheduled study ${study.titleForResearchers} has been deleted.` :
                        `Study draft ${study.titleForResearchers} has been deleted.`
                )}
                onCancel={onHide}
            />
        case ModalType.Reopen:
            return <StudyActionContainer
                header="Reopen Study"
                warning={false}
                body="Reopening the study will make it visible to participants and data collection will resume. 'Reopen Study' will prompt you to review your study parameters before relaunch."
                actionText='Reopen Study'
                onSubmit={() => nav(`/study/overview/${study.id}?reopen=true`)}
                cancelText='Keep Study Closed'
                onCancel={onHide}
            />
        default:
            return null
    }
}

const StudyActionContainer: FC<{
    warning: boolean,
    header: string,
    body: string,
    cancelText: string,
    actionText: string,
    onSubmit: () => void,
    onCancel: () => void
}> = ({
    warning, header, body, cancelText, actionText, onSubmit, onCancel,
}) => {
    return (
        <Stack align='center'>
            <Group gap='sm' align='center'>
                {warning && <Icon icon="warning" css={{ color: colors.red }} height={20}/>}
                <span className='fs-4 fw-bold'>{header}</span>
            </Group>
            <div className='text-center'>
                {body}
            </div>
            <Group>
                <Button variant='outline' color='purple' onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button variant='filled' color='purple' onClick={onSubmit}>
                    {actionText}
                </Button>
            </Group>
        </Stack>
    )
}

const ActionIcon = styled(Icon)(({ disabled }) => ({
    color: disabled ? colors.gray50 : colors.blue,
    cursor: disabled ? 'default' : 'pointer',
}))

const isPausable = (cell: CellContext<Study, any>): boolean => {
    const study = cell.row.original
    if (
        isDraftLike(study) ||
        isCompleted(study) ||
        isScheduled(study)
    ) return false

    const hasChildren = cell.row.getLeafRows().length
    const parent = cell.row.getParentRow()

    if (hasChildren) {
        return false
    }

    const previousSession = parent?.getLeafRows()[cell.row.index - 1]?.original
    if (!previousSession) {
        return true
    }

    return isActive(study)
}

export const ActionColumn: React.FC<{
    study: Study,
    cell: CellContext<Study, any>
}> = ({ study, cell }) => {
    const nav = useNavigate()
    const [modalType, setModalType] = React.useState<ModalTypeEnum>('')
    const [showModal, setShowModal] = React.useState<boolean>(false)
    const setAndShowModal = (type: ModalTypeEnum) => {
        setModalType(type)
        setShowModal(true)
    }
    const onHide = () => {
        setShowModal(false)
    }

    const isLeafNode = !!cell.row.depth
    const canPause = isPausable(cell)
    const canResume = isPaused(study)
    const canEdit = !isCompleted(study)

    const showEndStudy = isPaused(study) || (!isCompleted(study) && isActive(study))

    const showReopen = isCompleted(study)

    const showDelete = !isLeafNode && (isDraft(study) || isWaiting(study) || isReadyForLaunch(study) || isScheduled(study))

    const showResumeButton = study.status === StageStatusEnum.Paused

    return (
        <Group gap='lg' align='center'>
            <div>
                <ActionIcon
                    icon="pencil"
                    height={20}
                    tooltip={canEdit && 'Edit Study'}
                    disabled={!canEdit}
                    onClick={() => canEdit && nav(getStudyEditUrl(study))}
                />
            </div>
            <div>
                {showResumeButton &&
                    <ActionIcon
                        icon="play"
                        tooltip={canResume && 'Resume Session'}
                        height={20}
                        disabled={!canResume}
                        onClick={() => canResume && setAndShowModal(ModalType.Resume)}
                    />
                }
                {!showResumeButton &&
                    <ActionIcon
                        icon="pause"
                        tooltip={canPause && 'Pause Session'}
                        height={20}
                        disabled={!canPause}
                        onClick={() => canPause && setAndShowModal(ModalType.Pause)}
                    />
                }
            </div>
            <div>
                <Menu>
                    <Menu.Target>
                        <IconDotsVertical
                            height={20}
                            color={colors.blue}
                            id="action-menu-button"
                            data-testid={`${cell.row.original.id}-action-menu`}
                            css={{ cursor: 'pointer' }}
                        />
                    </Menu.Target>

                    <Menu.Dropdown>
                        {showEndStudy && <Menu.Item onClick={() => setAndShowModal(ModalType.End)}>
                            End Study
                        </Menu.Item>}
                        {showReopen &&<Menu.Item onClick={() => setAndShowModal(ModalType.Reopen)}>
                            Reopen Study
                        </Menu.Item>}
                        {showDelete && <Menu.Item color={colors.red} onClick={() => setAndShowModal(ModalType.Delete)}>
                            Delete
                        </Menu.Item>}
                    </Menu.Dropdown>
                </Menu>
            </div>
            <Modal centered opened={showModal} size='lg' onClose={onHide}>
                <Modal.Body>
                    <ActionModalContent
                        modalType={modalType}
                        study={study}
                        onHide={onHide}
                        cell={cell}
                    />
                </Modal.Body>
            </Modal>
        </Group>
    )
}
