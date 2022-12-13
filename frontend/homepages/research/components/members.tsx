import { Box, cx, React, styled, useState } from '@common';
import { colors, media } from '../../../src/theme';
import { useRef } from 'react';
import { alumni, AlumnusMember, ResearchMember, researchMembers } from '../research-data';
import Accordion from 'react-bootstrap/Accordion';
import { Icon } from '@components';
import chevronUp from '@iconify-icons/bi/chevron-up';
import chevronDown from '@iconify-icons/bi/chevron-down';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { ENV } from '@lib';
import { Button, Modal } from '@restart/ui';
import { Section } from '../research-homepage';

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
    return (
        <Section backgroundColor={colors.lightGrayBackground}>
            <h2 className='pt-4 pb-2'>Team Members</h2>
            <MobileMembers />
            <Members />
        </Section>
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
        <div className='mobile'>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" >
                    <Accordion.Header ref={membersRef}>Current Members</Accordion.Header>
                    <Accordion.Body>
                        <MemberGrid>
                            {members.map((member, index) =>
                                <Member member={member} key={index} />
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
                                <Member member={member} key={index} />
                            )}
                        </MemberGrid>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Alumni</Accordion.Header>
                    <Accordion.Body>
                        <AlumniGrid>
                            {alumni.map((alumnus, index) =>
                                <Alumnus alumnus={alumnus} key={index} />
                            )}
                        </AlumniGrid>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const Members = () => (
    <div className='desktop'>
        <Tabs defaultActiveKey="current-members" >
            <Tab eventKey="current-members" title="Current Members" className='px-2 py-5'>
                <MemberGrid>
                    {researchMembers['current'].map((member, index) =>
                        <Member member={member} key={index} />
                    )}
                </MemberGrid>
            </Tab>
            <Tab eventKey="collaborating-members" title="Collaborating Researchers" className='px-2 py-5'>
                <MemberGrid>
                    {researchMembers['collaborating'].map((member, index) =>
                        <Member member={member} key={index} />
                    )}
                </MemberGrid>
            </Tab>
            <Tab eventKey="alumni" title="Alumni" className='px-2 py-5'>
                <AlumniGrid>
                    {alumni.map((alumnus, index) =>
                        <Alumnus alumnus={alumnus} key={index} />
                    )}
                </AlumniGrid>
            </Tab>
        </Tabs>
    </div>
)

const MemberModal: React.FC<{ member: ResearchMember, show: boolean, onHide(): void }> = ({ member, show, onHide }) => {
    if (ENV.IS_SSR) return null

    return (
        <Modal
            container={document.getElementById('research-homepage')}
            css={{ backgroundColor: 'transparent' }}
            show={show}
            className={cx('modal', 'modal-lg', 'fade', {
                show,
            })}
            onBackdropClick={onHide}
            style={{ display: 'block', pointerEvents: 'none', overflow: 'auto' }}
            onHide={onHide}
            renderBackdrop={(props) => (
                <div className={cx('modal-backdrop', 'fade', {
                    show,
                })} {...props} />
            )}
        >
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable mx-auto'>
                <div className="modal-content overflow-auto" css={{
                    padding: '3rem',
                    [media.mobile]: {
                        padding: '2rem',
                    },
                    margin: '0 20px',
                }}>
                    <MemberDetails member={member} />
                    <Icon icon="x" height={30} onClick={onHide} css={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                    }} />
                </div>
            </div>
        </Modal>
    )

}

export const Member: React.FC<{ member: ResearchMember }> = ({ member }) => {
    const [show, setShow] = useState(false);
    return (
        <Box direction='column' align='center' className='text-center'>
            <img height={145} width={145} alt={member.firstName} src={member.image} onClick={() => setShow(true)} />
            <Button className='mt-2' as='a' type='button' onClick={() => setShow(true)}>
                {member.firstName}
            </Button>
            <small>{member.title}</small>
            <MemberModal member={member} show={show} onHide={() => setShow(false)} />
        </Box>
    )
}

export const MemberDetails: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box css={{ fontSize: 15 }}>
            <Box gap='large'>
                <MemberImage className='desktop' src={member.image} alt={member.firstName} />
                <Box direction='column' gap='medium'>
                    <MemberInfo member={member} />
                    <MemberEducation member={member} />
                    <MemberResearchInterest member={member} />
                    <MemberBio member={member} />
                    <MemberLinks member={member} />
                </Box>
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
        marginRight: '2rem',
    },
});

export const MemberInfo: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box align='center'>
            <MemberImage className='mobile' src={member.image} alt={member.firstName} />
            <Box direction='column'>
                <h4>{member.firstName} {member.lastName}</h4>
                <p css={{ color: colors.grayText }}>
                    {member.title}
                </p>
            </Box>
        </Box>
    )
}

export const MemberEducation: React.FC<{ member: ResearchMember }> = ({ member }) => {
    if (!member.education) {
        return null;
    }
    return (
        <Box direction='column'>
            <h5>Education</h5>
            <p>
                {member.education}
                <br />
                {member.specialization && <span css={{ color: colors.grayText }}>{member.specialization}</span>}
            </p>
        </Box>
    )
}

export const MemberResearchInterest: React.FC<{ member: ResearchMember }> = ({ member }) => {
    if (!member.researchInterest) {
        return null;
    }
    return (
        <Box direction='column'>
            <h5>Research Interest</h5>
            <p>{member.researchInterest}</p>
        </Box>
    )
}

export const MemberBio: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box direction='column'>
            <h5>Bio</h5>
            <p>{member.bio}</p>
        </Box>
    )
}

export const MemberLinks: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box gap='large'>
            {member.linkedIn && <a href={member.linkedIn} target='_blank'>LinkedIn</a>}
            {member.googleScholar && <a href={member.googleScholar} target='_blank'>Google Scholar</a>}
            {member.website && <a href={member.website} target='_blank'>Website</a>}
        </Box>
    )
}

export const Alumnus: React.FC<{ alumnus: AlumnusMember }> = ({ alumnus }) => (
    <Box direction={{ mobile: 'column' }} justify='center'>
        <a css={{ flex: 1 }} href={alumnus.linkedin} target='_blank'>{alumnus.name}</a>
        <p css={{ flex: 3, color: colors.grayText }}>{alumnus.title}</p>
    </Box>
)
