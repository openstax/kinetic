import { Box, React, useNavigate, useState } from '@common';
import { Icon, Modal, ResearcherButton, useFormContext, useFormState } from '@components';
import { colors } from '@theme';
import { Toast } from '@nathanstitt/sundry/ui';
import { Study } from '@api';

export const ExitStudyFormButton: FC<{study: Study, saveStudy: (study: Study) => void}> = ({ study, saveStudy }) => {
    const [showWarning, setShowWarning] = useState<boolean>(false)
    const { getValues } = useFormContext()
    const { isDirty } = useFormState()

    const nav = useNavigate()
    return (
        <div>
            <h6
                css={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '.5rem',
                    color: colors.grayText,
                    cursor: 'pointer',
                    alignSelf: 'end',
                }}
                onClick={() => {
                    if (isDirty) {
                        setShowWarning(true)
                    } else {
                        nav('/studies')
                    }
                }}
            >
                Exit
            </h6>
            <Modal
                center
                show={showWarning}
                large
                onHide={() => setShowWarning(false)}
            >
                <Modal.Body>
                    <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                        <Box gap='large' align='center'>
                            <Icon height={20} icon="warning" color={colors.red} />
                            <span className='fs-4 fw-bold'>Exit Page</span>
                        </Box>
                        <Box align='center' direction='column'>
                            <span>You're about to leave this study creation process.</span>
                            <span>Would you like to save the changes you made thus far?</span>
                        </Box>
                        <Box gap='large'>
                            <ResearcherButton
                                fixedWidth
                                onClick={() => {
                                    nav('/studies')
                                    Toast.show({
                                        message: `New edits to the study ${study.titleForResearchers} have been discarded`,
                                    })
                                }}
                                buttonType='secondary'
                            >
                                No, discard changes
                            </ResearcherButton>

                            <ResearcherButton fixedWidth onClick={() => {
                                saveStudy(getValues() as Study)
                                nav('/studies')
                                Toast.show({
                                    message: `New edits to the study ${study.titleForResearchers} have successfully been saved`,
                                })}
                            }>
                                Yes, save changes
                            </ResearcherButton>
                        </Box>
                    </Box>
                </Modal.Body>
            </Modal>
        </div>
    )
}
