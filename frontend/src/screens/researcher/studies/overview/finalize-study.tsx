import { Box, React, styled, useEffect, useNavigate, useState, Yup } from '@common';
import { CollapsibleSection, Form, Icon, Modal, ResearcherButton, ResearcherCheckbox, useFormState } from '@components';
import { Study } from '@api';
import QualtricsReady from '@images/study-creation/qualtricsready.svg'
import { colors } from '@theme';
import { EditSubmittedStudy } from './edit-submitted-study';
import { StudyInformation } from './study-overview';

export const FinalizeStudy: FC<{study: Study, }> = ({ study }) => {
    const [userCheckedQualtrics, setUserCheckedQualtrics] = useState<boolean>(false)

    return (
        <Box direction='column' gap='large'>
            <ReadyForLaunch study={study} setUserCheckedQualtrics={setUserCheckedQualtrics} />

            {userCheckedQualtrics &&
                <CollapsibleSection title= '' collapsible={false}>
                    <h3>Finalize your study</h3>
                    <EditSubmittedStudy study={study} />
                </CollapsibleSection>
            }

            <StudyInformation study={study} />
        </Box>
    )
}

const ReadyForLaunch: FC<{
    study: Study,
    setUserCheckedQualtrics: (checked: boolean) => void
}> = ({ study, setUserCheckedQualtrics }) => {
    return (
        <Box direction='column' gap='xxlarge'>
            <Box align='center' justify='between'>
                <h3>{study?.titleForResearchers}</h3>
                <ExitWithConfirmation navTo='/studies'/>
            </Box>
            <Box direction='column' align='center' className='text-center' gap='large' alignSelf='center' padding={{ left: '3em', right: '3em' }}>
                <img src={QualtricsReady} alt='qualtrics-ready' height={200}/>
                <h5 className='fw-bold'>All set up and ready to go!</h5>
                <h6 className='lh-lg' css={{ color: colors.text }}>
                   The correct permissions are now all set! An access code has now been sent to your email from owlsurveys@rice.edu providing you with further instructions on how to access your Qualtrics template.
                </h6>
                <h6 className='lh-lg' css={{ color: colors.text }}>
                    Once you’ve set up your study in Qualtrics and it’s ready for data collection, return here to finalize it and launch it on Kinetic.
                </h6>
                <span css={{ color: colors.text }}>Didn’t receive an email with your Qualtrics collaboration code? Please email us at <a href="mailto:kinetic@openstax.org">kinetic@openstax.org</a> and we’ll get it all up and running for you</span>

                <Form
                    defaultValues={{
                        userHasCheckedQualtrics: null,
                    }}
                    validationSchema={Yup.object().shape({
                        userHasCheckedQualtrics: Yup.array().test(
                            'All checked',
                            'Check all boxes to continue',
                            (checks?: boolean[]) => !!checks?.length && checks.every(c => c)
                        ),
                    })}
                    onSubmit={() => {}}
                >
                    <QualtricsConfirmationContainer study={study} setUserCheckedQualtrics={setUserCheckedQualtrics} />
                </Form>
            </Box>
        </Box>
    )
}

const QualtricsConfirmation = styled(Box)({
    border: `1px solid ${colors.blue}`,
    padding: `1rem 2rem`,
    borderRadius: 5,
})

const QualtricsConfirmationContainer: FC<{
    study: Study,
    setUserCheckedQualtrics: (checked: boolean) => void
}> = ({ study, setUserCheckedQualtrics }) => {
    const { isValid } = useFormState()
    useEffect(() => {
        setUserCheckedQualtrics(isValid)
    })

    if (study.stages?.length === 1) {
        return (
            <div>
                <QualtricsConfirmation gap align='center'>
                    <ResearcherCheckbox type='checkbox' name='userHasCheckedQualtrics.0' data-testid='confirm-qualtrics' id='confirm-qualtrics'/>
                    <label htmlFor='confirm-qualtrics'>Yes, I have set up my study in Qualtrics</label>
                </QualtricsConfirmation>

                <div style={{ height: '50px' }}></div>
            </div>
        )
    }

    return (
        <div>
            {study.stages?.map((stage, index) => (
                <div key={stage.order} className='mt-1'>
                    <QualtricsConfirmation gap align='center'>
                        <ResearcherCheckbox type='checkbox' name={`userHasCheckedQualtrics.${index}`} data-testid={`confirm-qualtrics-${index}`} id={`confirm-qualtrics-${index}`} />
                        <label htmlFor={`confirm-qualtrics-${index}`}>Yes, I have set up Session {index + 1} in Qualtrics</label>
                    </QualtricsConfirmation>
                    {index === (study.stages?.length ?? -1) - 1 && (
                        <div style={{ height: '50px' }}></div>
                    )}
                </div>
            ))}
        </div>
    )
}

export const ExitWithConfirmation: FC<{navTo: string}> = ({ navTo }) => {
    const [showWarning, setShowWarning] = useState(false);
    const nav = useNavigate();

    return (
        <div>
            <h6
                style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '.5rem',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    if (showWarning) {
                        setShowWarning(false);
                    } else {
                        setShowWarning(true);
                    }
                }}
            >
                Exit
            </h6>
            {showWarning && (
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
                                <span>Would you like leave?</span>
                            </Box>
                            <Box gap='large'>
                                <ResearcherButton
                                    onClick={() => {
                                        nav(navTo);
                                    }}
                                    buttonType='secondary'
                                >
                                    No, continue editing
                                </ResearcherButton>

                                <ResearcherButton onClick={() => {
                                    // Perform the save operation here if needed
                                    nav(navTo);
                                }}>
                                    Yes, return to Studies
                                </ResearcherButton>
                            </Box>
                        </Box>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};
