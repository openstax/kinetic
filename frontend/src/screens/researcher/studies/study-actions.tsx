import { React, styled, useNavigate } from '@common';
import { Box, Icon } from '@components';
import { Study, StudyStatusEnum } from '@api';
import { colors } from '../../../theme';
import { Button, dayjs, Modal } from '@nathanstitt/sundry';
import { useApi } from '@lib';
import { CellContext } from '@tanstack/react-table';
import { NotificationType } from './study-action-notification';

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
    cell: CellContext<Study, any>,
    addNotification: (message: string, type?: NotificationType) => void
}> = ({ study , modalType, onHide, cell, addNotification }) => {
    const api = useApi()
    const nav = useNavigate()

    const updateStudy = (study: Study, status: StudyStatusEnum, message: string) => {
        const oldStatus = study.status
        try {
            study.status = status
            api.updateStudy({ id: study.id, updateStudy: { study: study as any } })
                .then((study) => {
                    cell.table.options.meta?.updateData(cell.row.index, cell.column.id, study)
                    addNotification(message)
                })
        }
        catch (err) {
            study.status = oldStatus
            addNotification(String(err), 'error')
            console.error(err) // eslint-disable-line no-console
        }
        onHide()
    }

    const deleteStudy = (study: Study, message: string) => {
        try {
            api.deleteStudy({ studyId: study.id }).then(() => {
                addNotification(message)
                study.isHidden = true
                cell.table.options.meta?.updateData(cell.row.index, cell.column.id, study)
            })
        } catch (err) {
            study.isHidden = false
            addNotification(String(err), 'error')
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
                cancelText='Keep Study Active'
                actionText='Pause Study'
                onSubmit={() => updateStudy(
                    study,
                    StudyStatusEnum.Paused,
                    `Study ${study.titleForResearchers} has been paused.`
                )}
                onCancel={onHide}
            />
        case ModalType.Resume:
            if (dayjs().isBefore(dayjs(study.closesAt))) {
                return <StudyActionContainer
                    header="Resume Study"
                    warning={false}
                    body="This action will render the study visible to learners and open for participation."
                    cancelText='Keep Study Paused'
                    actionText='Resume Study'
                    onSubmit={() => updateStudy(
                        study,
                        StudyStatusEnum.Active,
                        `Study ${study.titleForResearchers} has been resumed.`
                    )}
                    onCancel={onHide}
                />
            } else {
                return <StudyActionContainer
                    header="Resume Study"
                    warning={false}
                    body="The study you wish to resume has passed the original closing date. Please choose one of the options below."
                    actionText='Adjust Closing Date'
                    onSubmit={() => nav(`/study/edit/${study.id}`)}
                    cancelText='End Study'
                    onCancel={() => {
                        updateStudy(
                            study,
                            StudyStatusEnum.Completed,
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
                cancelText='Keep Study Active'
                actionText='End Study'
                onSubmit={() => updateStudy(
                    study,
                    StudyStatusEnum.Completed,
                    `Study ${study.titleForResearchers} has been manually closed. It can now be found under 'Completed' studies`
                )}
                onCancel={onHide}
            />
        case ModalType.Delete:
            return <StudyActionContainer
                header="Delete Study"
                warning={true}
                body={study.status === StudyStatusEnum.Scheduled ?
                    'This action will delete the study and all data collected thus far. This is permanent and cannot be undone. Are you sure?' :
                    'This action will delete the study draft. This is permanent and cannot be undone. Are you sure?'
                }
                cancelText='No, keep the study'
                actionText='Yes, delete the study'
                onSubmit={() => deleteStudy(
                    study,
                    study.status === StudyStatusEnum.Scheduled ?
                        `Scheduled study ${study.titleForResearchers} has been deleted.` :
                        `Study draft ${study.titleForResearchers} has been deleted.`
                )}
                onCancel={onHide}
            />
        case ModalType.Reopen:
            {/* TODO on submit, route to new study creation flow -> researcher facing info page */}
            return <StudyActionContainer
                header="Reopen Study"
                warning={false}
                body="Reopening the study will make it visible to participants and data collection will resume. 'Reopen Study' will prompt you to review your study parameters before relaunch."
                actionText='Reopen Study'
                onSubmit={() => nav(`/study/edit/${study.id}`)}
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
        <Box direction='column' className='py-8 px-16' gap='large' align='center'>
            <Box gap='large' align='center'>
                {warning && <Icon icon="warning" css={{ color: colors.red }} height={20}/>}
                <span className='fs-4 fw-bold'>{header}</span>
            </Box>
            <div className='text-center'>
                {body}
            </div>
            <Box gap='xlarge'>
                <Button css={{ width: 180, justifyContent: 'center' }} outline primary onClick={onCancel}>
                    {cancelText}
                </Button>
                <Button css={{ width: 180, justifyContent: 'center' }} primary onClick={onSubmit}>
                    {actionText}
                </Button>
            </Box>
        </Box>
    )
}

const ActionIcon = styled(Icon)(({ disabled }) => ({
    color: disabled ? colors.lightGray : colors.purple,
    cursor: disabled ? 'default' : 'pointer',
}))

export const ActionColumn: React.FC<{
    study: Study,
    cell: CellContext<Study, any>,
    addNotification: (message: string, type?: NotificationType) => void
}> = ({ study, cell, addNotification }) => {
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

    const editDisabled = study.status === StudyStatusEnum.Completed
    const pauseDisabled = study.status !== StudyStatusEnum.Active
    const resumeDisabled = study.status !== StudyStatusEnum.Paused

    const showEndStudy =
        study.status === StudyStatusEnum.Paused ||
        (study.status !== StudyStatusEnum.Completed && study.status === StudyStatusEnum.Active)

    const showReopen = study.status === StudyStatusEnum.Completed

    const showDelete =
        study.status === StudyStatusEnum.Draft ||
        study.status === StudyStatusEnum.Scheduled

    const showResumeButton = study.status === StudyStatusEnum.Paused

    return (
        <Box gap='xlarge' justify='center' align='center'>
            <div>
                <ActionIcon
                    icon="pencilFill"
                    disabled={editDisabled}
                    height={20}
                    tooltip={!editDisabled && 'Edit Study'}
                    onClick={() => !editDisabled && nav(`/study/edit/${study.id}`)}
                />
            </div>
            <div>
                {showResumeButton &&
                    <ActionIcon
                        icon="playFill"
                        tooltip={!resumeDisabled && 'Resume Study'}
                        height={20}
                        disabled={resumeDisabled}
                        onClick={() => !resumeDisabled && setAndShowModal(ModalType.Resume)}
                    />
                }
                {!showResumeButton &&
                    <ActionIcon
                        icon="pauseFill"
                        tooltip={!pauseDisabled && 'Pause Study'}
                        height={20}
                        disabled={pauseDisabled}
                        onClick={() => !pauseDisabled && setAndShowModal(ModalType.Pause)}
                    />
                }
            </div>
            <div>
                <Icon
                    icon="tripleDotVertical"
                    height={20}
                    color={colors.purple}
                    id="action-menu-button"
                    className='dropdown-toggle'
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    css={{ cursor: 'pointer' }}
                />
                <ul className="dropdown-menu" aria-labelledby="action-menu-button">
                    {showEndStudy &&
                        <li>
                            <span
                                className="dropdown-item cursor-pointer"
                                onClick={() => setAndShowModal(ModalType.End)}
                            >
                                End Study Test
                            </span>
                        </li>
                    }
                    {showReopen &&
                        <li>
                            <span
                                className="dropdown-item cursor-pointer"
                                onClick={() => setAndShowModal(ModalType.Reopen)}
                            >
                                Reopen Study
                            </span>
                        </li>
                    }
                    {showDelete &&
                        <li>
                            <span
                                className="dropdown-item cursor-pointer"
                                css={{ color: colors.red }}
                                onClick={() => setAndShowModal(ModalType.Delete)}
                            >
                            Delete
                            </span>
                        </li>
                    }
                </ul>
            </div>
            <Modal center show={showModal} large onHide={onHide}>
                <Modal.Body>
                    <ActionModalContent
                        modalType={modalType}
                        study={study}
                        onHide={onHide}
                        cell={cell}
                        addNotification={addNotification}
                    />
                </Modal.Body>
            </Modal>
        </Box>
    )
}
