import { Analysis } from '@api';
import { Box, cx, React, styled, useParams, useState } from '@common';
import { useFetchAnalysis } from '@models';
import { Col, CollapsibleSection, ExitButton, Icon, LoadingAnimation, PageNotFound } from '@components';
import { colors } from '@theme';
import { FAQSection } from './researcher-faq';
import { Link } from 'react-router-dom';
import { RunsTable } from './runs-table';
import { ENV } from '@lib'
import { Button } from '@mantine/core';

export const AnalysisOverview: FC = () => {
    const { analysisId } = useParams<string>();
    const { data: analysis, isLoading } = useFetchAnalysis(Number(analysisId))
    if (isLoading) return <LoadingAnimation />
    if (!analysis) return <PageNotFound name='analysis' />
    return (
        <Col className='analysis-overview' sm={12} gap='xlarge'>
            <Box align='center' justify='between' >
                <h3 className='fw-bolder'>{analysis?.title}</h3>
                <ExitButton navTo='/analysis'/>
            </Box>

            {!!analysis.runs?.length && <RunsTable analysis={analysis}/>}

            <CollapsibleSection title='Help Materials' open={!analysis.runs || analysis.runs.length == 0}>
                <HelpMaterials />
            </CollapsibleSection>

            <BottomBar analysis={analysis}/>
        </Col>
    )
}

const HelpTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h6': {
        color: colors.text,
        fontWeight: 'bolder',
    },
    '.active > h6': {
        color: colors.blue,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.blue}`,
    },
})


const HelpMaterials = () => {
    const [currentTab, setCurrentTab] = useState('Steps')

    return (
        <Box direction='column' >
            <HelpTabs className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <a data-target="#"
                        id="steps-tab"
                        onClick={() => setCurrentTab('Steps')}
                        className={cx('nav-link cursor-pointer', { active: currentTab == 'Steps' })}
                        data-bs-toggle="tab"
                        data-bs-target="#steps"
                        role="tab"
                        aria-controls="steps"
                        aria-selected={currentTab == 'Steps'}
                    >
                        <h6>Steps Overview</h6>
                    </a>
                </li>
                {/* TODO When Debshila has created the guide, we can add this back in */}
                {/*<li className="nav-item" role="presentation">*/}
                {/*    <a data-target="#"*/}
                {/*        id="tutorial-tab"*/}
                {/*        onClick={() => setCurrentTab('Tutorial')}*/}
                {/*        className={cx('nav-link cursor-pointer', { active: currentTab == 'Tutorial' })}*/}
                {/*        data-bs-toggle="tab"*/}
                {/*        data-bs-target="#tutorial"*/}
                {/*        role="tab"*/}
                {/*        aria-controls="tutorial"*/}
                {/*        aria-selected={currentTab == 'Tutorial'}*/}
                {/*    >*/}
                {/*        <h6>Tutorial Video & Guide</h6>*/}
                {/*    </a>*/}
                {/*</li>*/}
                <li className="nav-item" role="presentation">
                    <a data-target="#"
                        id="faq-tab"
                        onClick={() => setCurrentTab('FAQ')}
                        className={cx('nav-link cursor-pointer', { active: currentTab == 'FAQ' })}
                        data-bs-toggle="tab"
                        data-bs-target="#faq"
                        role="tab"
                        aria-controls="faq"
                        aria-selected={currentTab == 'FAQ'}
                    >
                        <h6>Frequently Asked Questions</h6>
                    </a>
                </li>
            </HelpTabs>
            <div className="tab-content">
                <div className={cx('tab-pane', { active: currentTab == 'Steps' })}
                    id="steps"
                    role="tabpanel"
                    aria-labelledby="steps-tab"
                >
                    <ol>
                        <Col>
                            <li>
                                <h5 className='fw-bold'>Click Open R Studio</h5>
                                <p>Once you click  ‘Open R Studio’, you will see the R Studio environment, running R 4.3.1, open in a new tab in your browser containing all the datasets that you've previously selected for analysis. This environment will come with a host of pre-installed packages (e.g., tidyverse; lme4), and more. You can always install other packages that you need into your workspace.</p>
                            </li>
                            <li>
                                <h5 className='fw-bold'>Review Simulated Dataset</h5>
                                <p>When landing on R Studio, you will see a simulated dataset (synthetic data) that was carefully crafted based on each of the studies you have just now chosen to analyze.</p>
                            </li>
                            <li>
                                <h5 className='fw-bold'>Write Analysis Script</h5>
                                <p>Against this simulated dataset, you will be able to write your intended script for data analysis. Any analytic code that you create will persist in this environment even once you close out. You can always come back to your script.</p>
                            </li>
                            <li>
                                <h5 className='fw-bold'>Submit Analysis</h5>
                                <p>Once you click ‘Submit Analysis’ on the top right-hand corner of the page, your script will be sent to the Kinetic team for review.</p>
                            </li>
                            <li>
                                <h5 className='fw-bold'>If needed, Edit your Script</h5>
                                <p>If you find that you’d want to edit your script after submission, simply open RStudio and submit another run of your script with the intended changes.</p>
                            </li>
                            <li>
                                <h5 className='fw-bold'>Receive Results</h5>
                                <p>Your script will then be exposed to real data to collect your intended analysis, and return aggregate knowledge back to you.</p>
                            </li>
                        </Col>
                    </ol>
                </div>
                {/* TODO When Debshila has created the guide, we can add this back in */}
                {/*<div*/}
                {/*    className={cx('tab-pane', { active: currentTab == 'Tutorial' })}*/}
                {/*    id="Tutorial"*/}
                {/*    role="tabpanel"*/}
                {/*    aria-labelledby="profile-tab"*/}
                {/*>*/}
                {/*    TODO @Debshila*/}
                {/*</div>*/}
                <div className={cx('tab-pane', { active: currentTab == 'FAQ' })}
                    id="FAQ"
                    role="tabpanel"
                    aria-labelledby="faq-tab"
                >
                    <AnalysisOverviewFAQ />
                </div>
            </div>
        </Box>
    )
}

export const AnalysisOverviewFAQ: FC = () => {
    const [currentSection, setCurrentSection] = useState('')

    return (
        <Box direction='column'>
            <FAQSection title='What if I use a different analytic toolkit than R Studio?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>
                    At OpenStax, we promote the use of open source toolkits that are loved by our Researcher community. For the moment, we’re starting out with R and RStudio, and as we continue to expand we’re exploring adding Python, Jamovi, and Julia based enclaves and resources. We are also considering the feasibility of enabling researchers to use proprietary tools with their own licenses. We will share periodic updates on how our product evolves overtime.
                </p>
            </FAQSection>
            <FAQSection title='How are synthetic datasets generated on Kinetic?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>
                    Kinetic utilizes progressively more sophisticated algorithms for synthetic data generation depending on the volume of raw data available to train the model. At the very basic level, when there are 0-300 respondents in the raw data, Kinetic synthetic datasets are generated by randomly sampling response options for every individual question included in the dataset aligned with the data schema. As we acquire 300+ or more responses, we utilize the models outlined in the toolkit to generate higher fidelity synthetic dataset representing the statistical features of the raw data.
                </p>
            </FAQSection>
            <FAQSection title='What data will researchers see? How close will that be to the raw data?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>
                    The quality of the synthetic datasets will depend on how many participants are included in the raw data. For newly deployed activities with fewer than 300 respondents, the synthetic dataset will be aligned with the data schema of the task and involve random sampling of the response options such that researchers can develop their analytic scripts without accounting for the statistical features. As the task reaches 300 or more respondents, the quality of synthetic data progressively increases to incorporate the statistical features of the raw data.
                </p>
            </FAQSection>
            <FAQSection title='What if I still want direct access to data?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>
                    Kinetic will work with its members on a case-by-case basis to provide access to real data, subject to additional training - so that important safeguards, monitoring, and design-enforced limitations are in place  for proper compliance with our learners' right to privacy and data security.
                </p>
            </FAQSection>
            <FAQSection title='Who will see the raw data?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>
                    Limited number of individuals will see the raw data, including the core Kinetic team members on a need only basis. These individuals will all have undergone additional training on data security practices, IRB training, and FERPA. External researchers can access de-identified raw data subject to additional training, agreements, and review on a case-by-case basis.
                </p>
            </FAQSection>
            <FAQSection title='What kind of review is being conducted? Who is conducting this review?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>In efforts to ensure that privacy is consistently preserved, OpenStax Kinetic conducts manual reviews of the analytic code. The sole purpose is to ensure that individual cases are not exposed, re-identifiable or that values aggregated with less than 5 respondents in each cell are not returned either as part of any coding errors or otherwise. <strong>We do not check for validity of the code, or best practices.</strong></p>
                <p>Our internal team of engineers and researchers conduct the code review for the following:</p>
                <ul>
                    <li>Are there any coding errors that include messages around individual cases?</li>
                    <li>Are there any print statements in the code that reveal individually identifiable cases?</li>
                    <li>Are the aggregated results for subgroups of over 5 respondents? This number is subject to change as our recruitment and research cycles get faster.</li>
                </ul>
            </FAQSection>
            <FAQSection title='How long will the review process take?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>The review process is focused on maintaining diligent privacy compliance during the analysis process aligned with the steps in the above question. Your script will be manually reviewed by our team of engineers, and we strive to have it completed within no more than 1 to 2 business days.</p>
            </FAQSection>
            <FAQSection title='What do errors mean? What steps should I take to resolve them?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>Errors can be caused by many factors. The most common cause is simple coding errors, such as incorrect variable names  - we recommend testing a complete run of your code on the synthetic data sets before submitting it. For any errors that you experience building your code with the synthetic data, make sure to resolve or “debug” it before submission. Typically, googling the error message should help you address the errors. StackOverflow will be your best friend for addressing errors. Here’s another <a href='https://statsandr.com/blog/top-10-errors-in-r/' target='_blanket'>resource</a> for typical R coding errors.</p>
            </FAQSection>
            <FAQSection title='Again, what is the purpose of this method?' setCurrentSection={setCurrentSection} currentSection={currentSection}>
                <p>Data is crucial for large-scale education research (we’re referring to larger than gigabytes - at terabyte or petabyte level), but sharing it with researchers poses important challenges on a privacy level, and additional technical and logistical barriers.</p>
                <p>To address this problem, traditional approaches often recur to methods such as reducing data size or de-identifying their data, which leads to loss of critical student and contextual factors, and ultimately hindering researchers seeking to perform interventions that work well for diverse learners.</p>
                <strong>An Alternative Approach</strong>
                <p>At Kinetic, we’re instead choosing to adopt modern confidential computing practices for large-scale educational research that are shifting the paradigm from traditional practices – that is, we bring researcher’s analytical software to the data instead of bringing the data to the researcher.</p>
                <p>This approach entails the use of secure enclaves for data analysis - a protected containerized environment that enables researchers to analyze all individual data points without direct access to the data, instead returning aggregated knowledge, ultimately reducing significant privacy risks.</p>
            </FAQSection>
        </Box>
    )
}

const BottomBar: FC<{analysis: Analysis}> = ({ analysis }) => {

    const openEditor = () => {
        const url = `https://workspaces.kinetic.${ENV.IS_PRODUCTION ? '' : 'sandbox.'}openstax.org/editor/#${analysis.id}`
        // use window.open so the editor can use window.opener to refocus this window
        window.open(url, 'kinetic-workspaces-editor')
    }

    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='between'>
                <Link to={`/analysis/edit/${analysis.id}`}>
                    <Box align='center' gap='small'>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back to Analysis Basics</span>
                    </Box>
                </Link>
                <Button color='blue' onClick={openEditor}>
                    Open R Studio
                </Button>
            </Box>
        </Box>
    )
}
