import { EditingStudy } from '@models';
import { Box, React } from '@common';
import { CharacterCount, FieldErrorMessage, Icon } from '@components';
import { colors } from '@theme';
import { Button, Col, InputField, SelectField } from '@nathanstitt/sundry';
import { StudyCardPreview } from '../../../../learner/card';

export const FinalizeStudy: FC<{study: EditingStudy}> = ({ study }) => {
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge' direction='column'>
                <h3 className='fw-bold'>Finalize your study</h3>
                <p>After you confirm all the details are correct, send this for Kinetic to generate a Qualtrics template for you. </p>
            </Box>

            <Box gap='large'>
                <Col sm={5} direction='column' gap='large'>
                    <Box gap='xlarge'>
                        <Col sm={4} direction='column' gap>
                            <h6>About researcher</h6>
                            <small>
                                IRB-FY2022-19
                                Rice University
                                PI: Richard G Baraniuk
                                Study Lead: Dsdadsad
                            </small>
                        </Col>

                        <Col sm={6} direction='column' gap>
                            <Button>
                                Edit
                            </Button>
                        </Col>
                    </Box>
                </Col>

                <Col sm={3}>
                    <StudyCardPreview study={study} />
                </Col>
            </Box>
        </Box>
    )
}
