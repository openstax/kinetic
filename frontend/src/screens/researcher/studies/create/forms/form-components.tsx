import { Box, React } from '@common';
import { Col, InputField, CharacterCount } from '@components';


export const FormSection: FCWC<{}> = ({ }) => {
    return (
        <Box gap='xlarge'>
            <Col sm={3} direction='column' gap>
                <h6></h6>
                <small></small>
            </Col>

            <Col sm={4} direction='column' gap>
                <div>
                    <InputField name='titleForParticipants' />
                    <CharacterCount max={45} name='titleForParticipants' />
                </div>
            </Col>
        </Box>
    )
}
