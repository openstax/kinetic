import { Box, React, styled, useParams } from '@common'
import EditStudy from '../../../study-edit';
import { Footer, TopNavBar } from '@components';
import { colors } from '../../../../theme';
import { Button } from '@nathanstitt/sundry';

export default function ResearcherStudyLanding() {
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id

    if (isNew) {
        return <NewStudy />
    }

    return <EditStudy />
}

const ExitButton = styled.h6({
    textDecoration: 'underline',
    textUnderlineOffset: '.5rem',
    color: colors.grayText,
    cursor: 'pointer',
    alignSelf: 'end',
})

const NewStudy: FC<{}> = () => {
    return (
        <div className='new-study'>
            <TopNavBar hideBanner/>
            <Box className="container-lg h-100 py-4" direction='column' align='center'>
                <ExitButton>Exit</ExitButton>
                <Box direction='column' width='650px' className='text-center' align='center'>
                    <h2 className='fw-bold mt-2'>Create a study to collect new data</h2>
                    <img className='mt-2' height={240} width={300} src="https://picsum.photos/200" alt='get-started'/>
                    <h5 className='lh-lg mt-2'>The following steps will guide you through some fundamental questions that will help you determine your study needs. This process can take about 10-20 minutes.</h5>
                    <h6 className='mt-2' css={{ color: colors.grayerText }}>If you’re rather looking to access existing Kinetic data, please visit the analysis center.</h6>
                    {/*TODO Onclick*/}
                    <Button className='btn-researcher-primary mt-4' onClick={() => {}}>
                        Start process
                    </Button>
                </Box>

            </Box>
            <Footer className='fixed-bottom' />
        </div>
    )
}
