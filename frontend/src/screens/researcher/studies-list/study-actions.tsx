import { React, styled, useNavigate } from '@common';
import { Box, Icon } from '@components';
import { Study, StudyStatusEnum } from '@api';
import { colors } from '../../../theme';
import { Button, Modal } from '@nathanstitt/sundry';
import { useApi } from '@lib';
import { CellContext } from '@tanstack/react-table';

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
    const updateStudy = (study: Study, status: StudyStatusEnum) => {
        try {
            study.status = status;
            api.updateStudy({ id: study.id, updateStudy: { study: study as any } }).then((study) => {
                cell.table.options.meta?.updateData(cell.row.index, cell.column.id, study)
            })
        }
        catch (err) {
            console.error(err) // eslint-disable-line no-console
        }
        onHide()
    }

    // TODO How to deal with HIDDEN vs DELETED?
    const deleteStudy = (study: Study) => {
        try {
            api.deleteStudy({ studyId: study.id })
        } catch (err) {
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
                cancelText='Keep active'
                actionText='Pause now'
                onSubmit={() => updateStudy(study, StudyStatusEnum.Paused)}
                onHide={onHide}
            />
        case ModalType.End:
            return <StudyActionContainer
                header='End Study'
                warning={true}
                body="This action will set the study status as 'Completed', rendering it no longer visible to participants."
                cancelText='Keep active'
                actionText='End now'
                onSubmit={() => updateStudy(study, StudyStatusEnum.Completed)}
                onHide={onHide}
            />
        case ModalType.Resume:
            return <StudyActionContainer
                header="Resume Study"
                warning={false}
                body="This action will render the study visible to learners and open for participation."
                cancelText='Keep paused'
                actionText='Resume now'
                onSubmit={() => updateStudy(study, StudyStatusEnum.Active)}
                onHide={onHide}
            />
        case ModalType.Reopen:
            return <StudyActionContainer
                header="Reopen Study"
                warning={false}
                body='This action will re-open the study and make it visible to learners and open for participation.'
                cancelText='Cancel'
                actionText='Reopen'
                onSubmit={() => updateStudy(study, StudyStatusEnum.Active)}
                onHide={onHide}
            />
        case ModalType.Delete:
            return <StudyActionContainer
                header="Delete Draft"
                warning={true}
                body='This action will delete the draft. This is permanent and cannot be undone.'
                cancelText='No, keep it'
                actionText='Yes, delete it'
                onSubmit={() => deleteStudy(study)}
                onHide={onHide}
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
    onHide: () => void
}> = ({
    warning, header, body, cancelText, actionText, onSubmit, onHide,
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
                <Button css={{ width: 180, justifyContent: 'center' }} outline primary onClick={onHide}>
                    {cancelText}
                </Button>
                <Button css={{ width: 180, justifyContent: 'center' }} primary onClick={onSubmit}>
                    {actionText}
                </Button>
            </Box>
        </Box>
    )
}

const Actions = styled(Box)({
    'svg': {
        cursor: 'pointer',
    },
    '.disabled': {
        color: colors.lightGray,
    },
})

export const ActionColumn: React.FC<{study: Study, cell: CellContext<Study, any>}> = ({ study, cell }) => {
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

    const pauseEnabled = study.status !== StudyStatusEnum.Scheduled && study.status !== StudyStatusEnum.Draft
    const resumeEnabled = study.status === StudyStatusEnum.Draft || study.status === StudyStatusEnum.Scheduled
    const endStudyDisabled = study.status === StudyStatusEnum.Draft
    const showEndStudy = study.status !== StudyStatusEnum.Completed
    const showReopen = study.status === StudyStatusEnum.Completed
    const showResumeButton = study.status === StudyStatusEnum.Paused

    return (
        <Actions gap='xlarge' justify='center' align='center'>
            <div>
                <Icon
                    icon="pencilFill"
                    tooltip="Edit Study"
                    height={20}
                    color={colors.purple}
                    onClick={() => nav(`/study/edit/${study.id}`)}
                />
            </div>
            <div>
                {showResumeButton &&
                    <Icon
                        icon="playFill"
                        tooltip="Resume Study"
                        height={20}
                        color={colors.purple}
                        onClick={() => setAndShowModal(ModalType.Resume)}
                    />
                }
                {!showResumeButton &&
                    <Icon
                        icon="pause"
                        tooltip="Pause Study"
                        height={20}
                        color={colors.purple}
                        onClick={() => setAndShowModal(ModalType.Pause)}
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
                    <li>
                        <span
                            className="dropdown-item cursor-pointer"
                            css={{ color: colors.red }}
                            onClick={() => setAndShowModal(ModalType.Delete)}
                        >
                            Delete
                        </span>
                    </li>
                </ul>
            </div>
            <Modal center show={showModal} large onHide={onHide}>
                <Modal.Body>
                    <ActionModalContent modalType={modalType} study={study} onHide={onHide} cell={cell} />
                </Modal.Body>
            </Modal>
        </Actions>
    )
}
