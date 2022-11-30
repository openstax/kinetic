import { Box, cx, React, styled, useState } from '@common'

import '../../src/index.css'
import '../../src/styles/main.scss'
import { colors, media } from '../../src/theme';
import { Funders, Icon } from '@components';
import 'bootstrap/dist/js/bootstrap.min'
import {
    alumni,
    AlumnusMember,
    Publication,
    publications,
    ResearchArea,
    researchFocusAreas,
    ResearchMember,
    researchMembers,
} from './research-data';
import boxArrowInUpRight from '@iconify-icons/bi/box-arrow-in-up-right';
import HowManyLettersYouRemember from '../../src/components/study-card-images/HowManyLettersYouRemember';
import chevronDown from '@iconify-icons/bi/chevron-down';
import chevronUp from '@iconify-icons/bi/chevron-up';
import { Button, Modal } from '@restart/ui';
import { useIsMobileDevice } from '@lib';
import Accordion from 'react-bootstrap/Accordion';
import { useRef } from 'react';

export const ResearchHomepage = () => {
    return (
        <div css={{ backgroundColor: colors.white, fontSize: '1rem', lineHeight: 1.5 }}>
            <style>
                {`
                .nav-tabs .nav-link.active {
                    color: #495057;
                    background-color: rgba(0,0,0,0) !important;
                    border-bottom-width: 4px;
                    border-color: rgba(0,0,0,0) rgba(0,0,0,0) #63A524 rgba(0,0,0,0);
                }
            `}
            </style>

            <Header></Header>
            <Banner></Banner>
            <ColorBar></ColorBar>
            <ResearchSection></ResearchSection>
            <Publications></Publications>
            <MembersSection></MembersSection>
            <Funders></Funders>
            <ContactUs></ContactUs>
        </div>
    )
}

export const Header = () => (
    <div className="py-5" css={{ backgroundColor: colors.lightBlue }}>
        <Box direction={{ mobile: 'column' }} className='container' align='center'>
            <h1 className='fw-bolder' css={{ color: colors.white, flex: 3 }}>
                Advancing multi-disciplinary research to improve learner success.
            </h1>
            {/* TODO Update with correct image */}
            <HowManyLettersYouRemember css={{ flex: 2 }}/>
        </Box>
    </div>
)

export const Banner = () => (
    <div className="py-4" css={{ backgroundColor: colors.lightTeal }}>
        <Box direction={{ mobile: 'column' }} className='container align-items-center' gap='medium'>
            <h4 className='fw-bold text-center' css={{ color: colors.blackText, flex: 1 }}>
                Calling all learning researchers!
            </h4>
            <Box align={{ mobile: 'center' }} direction='column' css={{ flex: 4 }}>
                <>Learn about the research workflow on OpenStax Kinetic during office hours hosted with IES!</>
                <a className='text-decoration-none' href='https://ies.ed.gov/funding/technicalassistance.asp' target='_blank'>
                    <Box align='center'>
                        IES Office Hours
                        &nbsp;
                        <Icon icon={boxArrowInUpRight}></Icon>
                    </Box>
                </a>
            </Box>
        </Box>
    </div>
)

export const ColorBar = () => (
    <Box>
        <span css={{
            backgroundColor: colors.orange,
            height: 10,
            width: '36%',
        }}></span>
        <span css={{
            backgroundColor: colors.purple,
            height: 10,
            width: '16%',
        }}></span>
        <span css={{
            backgroundColor: colors.red,
            height: 10,
            width: '10%',
        }}></span>
        <span css={{
            backgroundColor: colors.yellow,
            height: 10,
            width: '20%',
        }}></span>
        <span css={{
            backgroundColor: colors.lightBlue,
            height: 10,
            width: '18%',
        }}></span>
    </Box>
)

export const ResearchSection = () => {
    const mobile = useIsMobileDevice();
    return (
        <div className='container py-4'>
            <h2 className='py-2'>Areas of Research Focus</h2>
            {
                mobile && <p>
                Our team has significant expertise in <strong>learning science, education research, and AI/ML
                in education.</strong> We use a multidisciplinary approach to examine who our learners are,
                what are they learning, and how are they learning; to provide appropriate supports when and
                where learners need them. To enable large-scale rapid cycle research, we are developing Kinetic,
                a research infrastructure connecting researchers with adult higher ed learners in the US.
                </p>
            }
            {mobile ? <MobileResearchFocusAreas/> : <ResearchFocusAreas/>}
        </div>
    )
}

export const ResearchFocusAreas = () => (
    <div>
        <ul className="nav nav-tabs" id="research-areas" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="kinetic-tab" data-bs-toggle="tab" data-bs-target="#kinetic"
                    type="button" role="tab" aria-controls="kinetic" aria-selected="true">
                    Research on OpenStax Kinetic
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="ai-tab" data-bs-toggle="tab" data-bs-target="#ai"
                    type="button" role="tab" aria-controls="ai" aria-selected="false">
                    AI/ML in education
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="education-tab" data-bs-toggle="tab" data-bs-target="#education"
                    type="button" role="tab" aria-controls="education" aria-selected="false">
                    Applied Education Research
                </button>
            </li>
        </ul>
        <div className="tab-content py-3">
            <div className="tab-pane fade show active" id="kinetic" role="tabpanel" aria-labelledby="kinetic-tab">
                <div className='py-2'>
                    <p className='fs-5'>
                        OpenStax Kinetic is a new research infrastructure that enables researchers to connect with real
                        learners studying curricular content in authentic learning environments. Researchers can leverage
                        Qualtrics to design a variety of studies (e.g., surveys, Randomized Control Trials, A/B/N tests)
                        and make them available on Kinetic to <strong>US adult higher education learners.</strong>
                        Kinetic researchers can effectively address 3 key questions in learning and how they interact:
                    </p>
                    <ol>
                        <li><strong>Who is the learner?</strong></li>
                        <li><strong>What are they learning?</strong></li>
                        <li><strong>How are they learning?</strong></li>
                    </ol>
                </div>
                <hr/>
                {researchFocusAreas['kinetic'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
            </div>
            <div className="tab-pane fade" id="ai" role="tabpanel" aria-labelledby="ai-tab">
                <p>
                    In collaboration with leading researchers in the AI/ML in education space and the&nbsp;
                    <a href='https://dsp.rice.edu/' target='_blank'>Digital Signal Processing research group</a>
                    &nbsp;at Rice University, we investigate how to
                    effectively utilize AI/ML advancements to address crucial issues in learning and education.
                    Our research explores natural language processing for content generation, predictive models
                    for learning analytics, and hybrid models for generation of knowledge graphs. We aim to use
                    a combination of these efforts to optimally personalize learning experiences for learners.
                </p>
                <hr/>
                {researchFocusAreas['ai'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
            </div>
            <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                <p>
                    This learner- and educator- centered initiative aims to promote educational equity.
                    To this end, we engage with learners, educators, institutions, and the community and
                    utilize participatory and mixed- research methods. By working with educators and learners,
                    we identify issues that are most important for them and work toward evidence-based approaches
                    to address them. Ultimately, we work with our product teams to build evidence-based learner
                    supports that are iteratively refined.
                </p>
                <hr/>
                {researchFocusAreas['education'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
            </div>
        </div>
    </div>
)

export const MobileResearchFocusAreas = () => {
    return (
        <div>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Research on OpenStax Kinetic</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            OpenStax Kinetic is a new research infrastructure that enables researchers to connect with real
                            learners studying curricular content in authentic learning environments. Researchers can leverage
                            Qualtrics to design a variety of studies (e.g., surveys, Randomized Control Trials, A/B/N tests)
                            and make them available on Kinetic to <strong>US adult higher education learners.</strong>
                            Kinetic researchers can effectively address 3 key questions in learning and how they interact:
                        </p>
                        <ol>
                            <li><strong>Who is the learner?</strong></li>
                            <li><strong>What are they learning?</strong></li>
                            <li><strong>How are they learning?</strong></li>
                        </ol>
                        <hr/>
                        {researchFocusAreas['kinetic'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" css={{ backgroundColor: colors.white }}>
                    <Accordion.Header>AI/ML in education</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            In collaboration with leading researchers in the AI/ML in education space and the&nbsp;
                            <a href='https://dsp.rice.edu/' target='_blank'>Digital Signal Processing research group</a>
                            &nbsp;at Rice University, we investigate how to
                            effectively utilize AI/ML advancements to address crucial issues in learning and education.
                            Our research explores natural language processing for content generation, predictive models
                            for learning analytics, and hybrid models for generation of knowledge graphs. We aim to use
                            a combination of these efforts to optimally personalize learning experiences for learners.
                        </p>
                        {researchFocusAreas['ai'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Applied Education Research</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            This learner- and educator- centered initiative aims to promote educational equity.
                            To this end, we engage with learners, educators, institutions, and the community and
                            utilize participatory and mixed- research methods. By working with educators and learners,
                            we identify issues that are most important for them and work toward evidence-based approaches
                            to address them. Ultimately, we work with our product teams to build evidence-based learner
                            supports that are iteratively refined.
                        </p>
                        {researchFocusAreas['education'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const ResearchFocusArea: React.FC<{researchArea: ResearchArea}> = ({ researchArea }) => (
    <div className='py-1'>
        <Box gap='large' direction={{ mobile: 'column' }}>
            <img src={researchArea.image} css={{ flex: 2 }} alt={researchArea.title}/>
            <Box direction='column' css={{ flex: 6 }}>
                <h5 className='fw-bold'>{researchArea.title}</h5>
                <p>{researchArea.description}</p>
                {researchArea.cta &&
                    <div>
                        <a href={researchArea.cta?.url} target='_blank'>
                            {researchArea.cta?.text}
                        </a>
                    </div>
                }
            </Box>
            {/*<p css={{ flex: 1 }}>view more?</p>*/}
        </Box>
        <hr/>
    </div>
)

export const Publications = () => {
    const [viewAll, setViewAll] = useState(false);
    const initialCount = useIsMobileDevice() ? 3 : 5;
    const publicationList = viewAll ? publications : publications.slice(0, initialCount);

    const publicationsRef = useRef<null | HTMLDivElement>(null);
    const scrollToPublications = () => {
        publicationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <Box direction='column' className='container mt-3'>
            <h2 ref={publicationsRef}>Publications</h2>
            {publicationList.map((publication, index) =>
                <PublicationItem key={index} publication={publication}/>
            )}
            <p className='py-4 align-self-center'
                onClick={() => {
                    if (viewAll) {
                        scrollToPublications()
                    }
                    setViewAll(!viewAll)
                }}
                css={{ cursor: 'pointer', color: colors.linkText }}
            >
                <Icon icon={viewAll ? chevronUp : chevronDown}></Icon>
                &nbsp;
                {viewAll ? 'View Less' : 'View All Publications'}
            </p>
        </Box>
    )
}

export const PublicationItem: React.FC<{publication: Publication}> = ({ publication }) => (
    <Box direction='column' css={{ paddingTop: '.75rem', paddingBottom: '.75rem' }}>
        <div className='mb-1'>
            <a className='fw-bold' href={publication.pdf} target='_blank'>
                {publication.title}
            </a>
        </div>
        <div>
            <span>{publication.date} &middot;&nbsp;</span>
            <span css={{ color: colors.grayText }}>
                {publication.body}
            </span>
        </div>
        <Box gap='xlarge' className='mt-2'>
            <a className='text-decoration-none' href={publication.pdf} target='_blank'>
                <Box align='center'>
                    Pdf&nbsp;
                    <Icon icon={boxArrowInUpRight}></Icon>
                </Box>
            </a>
            {publication.github && <a className='text-decoration-none' href={publication.github} target='_blank'>
                <Box align='center'>
                    Github
                    <Icon icon={boxArrowInUpRight}></Icon>
                </Box>
            </a>}
        </Box>
    </Box>
)

const MemberGrid = styled.div({
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    [media.mobile]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '3rem',
    },
});

const AlumniGrid = styled(Box)({
    flexDirection: 'column',
    [media.mobile]: {
        textAlign: 'center',
    },
});

export const MembersSection = () => {
    const isMobile = useIsMobileDevice();
    return (
        <div css={{ backgroundColor: colors.lightGrayBackground }}>
            <div className='container py-3' >
                <h2 className='pt-4 pb-2'>Team Members</h2>
                {isMobile ? <MobileMembers/> : <Members/>}
            </div>
        </div>
    )
}

export const MobileMembers = () => {
    const [viewAll, setViewAll] = useState(false);
    const membersRef = useRef<null | HTMLDivElement>(null);
    const scrollToMembers = () => {
        membersRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const members = viewAll ? researchMembers['current'] : researchMembers['current'].slice(0, 4);
    return (
        <div>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" >
                    <Accordion.Header ref={membersRef}>Current Members</Accordion.Header>
                    <Accordion.Body>
                        <MemberGrid>
                            {members.map((member, index) =>
                                <Member member={member} key={index}/>
                            )}
                        </MemberGrid>

                        <p className='py-4 align-self-center text-center'
                            onClick={() => {
                                if (viewAll) {
                                    scrollToMembers()
                                }
                                setViewAll(!viewAll)
                            }}
                            css={{ cursor: 'pointer', color: colors.linkText }}
                        >
                            <Icon icon={viewAll ? chevronUp : chevronDown}></Icon>
                            &nbsp;
                            {viewAll ? 'View Less' : 'View All Current Members'}
                        </p>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Collaborating Researchers</Accordion.Header>
                    <Accordion.Body>
                        <MemberGrid>
                            {researchMembers['collaborating'].map((member, index) =>
                                <Member member={member} key={index}/>
                            )}
                        </MemberGrid>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Alumni</Accordion.Header>
                    <Accordion.Body>
                        <AlumniGrid>
                            {alumni.map((alumnus, index) =>
                                <Alumnus alumnus={alumnus} key={index}/>
                            )}
                        </AlumniGrid>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const Members = () => (
    <div>
        <ul className="nav nav-tabs" id="team-members" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="current-tab" data-bs-toggle="tab" data-bs-target="#current"
                    type="button" role="tab" aria-controls="current" aria-selected="true">
                        Current Members
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="collaborating-tab" data-bs-toggle="tab" data-bs-target="#collaborating"
                    type="button" role="tab" aria-controls="collaborating" aria-selected="false">
                        Collaborating Researchers
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="alumni-tab" data-bs-toggle="tab" data-bs-target="#alumni"
                    type="button" role="tab" aria-controls="alumni" aria-selected="false">
                        Alumni
                </button>
            </li>
        </ul>
        <div className="tab-content px-2 py-5">
            <div className="tab-pane fade show active" id="current" role="tabpanel" aria-labelledby="current-tab">
                <MemberGrid>
                    {researchMembers['current'].map((member, index) =>
                        <Member member={member} key={index}/>
                    )}
                </MemberGrid>
            </div>
            <div className="tab-pane fade" id="collaborating" role="tabpanel" aria-labelledby="collaborating-tab">
                <MemberGrid>
                    {researchMembers['collaborating'].map((member, index) =>
                        <Member member={member} key={index}/>
                    )}
                </MemberGrid>
            </div>
            <div className="tab-pane fade" id="alumni" role="tabpanel" aria-labelledby="alumni-tab">
                <AlumniGrid>
                    {alumni.map((alumnus, index) =>
                        <Alumnus alumnus={alumnus} key={index}/>
                    )}
                </AlumniGrid>
            </div>
        </div>
    </div>
)


export const Member: React.FC<{member: ResearchMember}> = ({ member }) => {
    const [show, setShow] = useState(false);
    return (
        <Box direction='column' align='center' className='text-center'>
            <img alt={member.firstName} src={member.image} onClick={() => setShow(true)}/>
            <Button className='mt-2' as='a' type='button' onClick={() => setShow(true)}>
                {member.firstName}
            </Button>
            <small>{member.title}</small>
            <Modal
                show={show}
                className={cx('modal', 'fade', {
                    show,
                })}
                onBackdropClick={() => setShow(false)}
                style={{ display: 'block', pointerEvents: 'none', overflow: 'auto' }}
                onHide={() => setShow(false)}
                renderBackdrop={(props) => (
                    <div className={cx('modal-backdrop', 'fade', {
                        show,
                    })} {...props} />
                )}
            >
                <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable mx-auto' css={{
                    width: '50%',
                    [media.mobile]: {
                        width: '90%',
                    },
                }}>
                    <div className="modal-content overflow-auto" css={{ padding: '1.75rem' }}>
                        <MemberDetails member={member}/>
                        <Icon icon="x" height={30} onClick={() => setShow(false)} css={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                        }}/>
                    </div>
                </div>
            </Modal>
        </Box>
    )
}

export const MemberDetails: React.FC<{member: ResearchMember}> = ({ member }) => {
    return (
        <Box css={{ fontSize: 15 }}>
            <Box direction='column' gap='medium'>
                <MemberInfo member={member}/>
                <MemberEducation member={member}/>
                <MemberResearchInterest member={member}/>
                <MemberBio member={member}/>
                <MemberLinks member={member}/>
            </Box>
        </Box>
    )
}

const MemberImage = styled.img({
    marginBottom: '.5rem',
    width: 145,
    height: 145,
    [media.mobile]: {
        width: 75,
        height: 75,
    },
});

export const MemberInfo: React.FC<{member: ResearchMember}> = ({ member }) => {
    return (
        <Box align='center'>
            <MemberImage src={member.image} alt={member.firstName}/>
            <Box direction='column' margin={{ left: '1.5rem' }}>
                <h4>{member.firstName} {member.lastName}</h4>
                <p css={{ color: colors.grayText }}>
                    {member.title}
                </p>
            </Box>
        </Box>
    )
}

export const MemberEducation: React.FC<{member: ResearchMember}> = ({ member }) => {
    if (!member.education) {
        return <></>;
    }
    return (
        <Box direction='column'>
            <h5>Education</h5>
            <p>
                {member.education}
                <br/>
                {member.specialization && <span css={{ color: colors.grayText }}>{member.specialization}</span>}
            </p>
        </Box>
    )
}

export const MemberResearchInterest: React.FC<{member: ResearchMember}> = ({ member }) => {
    if (!member.researchInterest) {
        return <></>;
    }
    return (
        <Box direction='column'>
            <h5>Research Interest</h5>
            <p>{member.researchInterest}</p>
        </Box>
    )
}

export const MemberBio: React.FC<{member: ResearchMember}> = ({ member }) => {
    return (
        <Box direction='column'>
            <h5>Bio</h5>
            <p>{member.bio}</p>
        </Box>
    )
}

export const MemberLinks: React.FC<{member: ResearchMember}> = ({ member }) => {
    return (
        <Box gap='large'>
            {member.linkedIn && <a href={member.linkedIn} target='_blank'>Linkedin</a>}
            {member.googleScholar && <a href={member.googleScholar} target='_blank'>Google Scholar</a>}
            {member.website && <a href={member.website} target='_blank'>Website</a>}
        </Box>
    )
}

export const Alumnus: React.FC<{alumnus: AlumnusMember}> = ({ alumnus }) => (
    <Box direction={{ mobile: 'column' }} justify='center'>
        <a css={{ flex: 1 }} href={alumnus.linkedin}>{alumnus.name}</a>
        <p css={{ flex: 3, color: colors.grayText }}>{alumnus.title}</p>
    </Box>
)

export const ContactUs = () => (
    <div css={{ backgroundColor: colors.lightTeal }}>
        <Box className='container py-4' direction={{ mobile: 'column' }} align='center' justify='center' gap='large'>
            <h4>Connect with our Research Team</h4>
            <Button as='a'
                href='https://riceuniversity.co1.qualtrics.com/jfe/form/SV_6EbRsmpDb2Hs69w?jfefe=new'
                target='_blank'
                className='btn btn-lg'
                css={{
                    color: colors.white,
                    backgroundColor: colors.primaryButton,
                }}>
                Contact Us
            </Button>
        </Box>
    </div>
)
