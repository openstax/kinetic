import { React, useEffect, useNavigate, useState } from '@common'
import { capitalize, useCurrentUser, useFetchEnvironment } from '@lib'
import { AvailableUsers } from './users'
import { loginAsUser } from '@models';
import { Anchor, Card, Container, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { colors } from '@theme';

interface UserCardProps {
    users: AvailableUsers
    type: 'admins' | 'researchers' | 'users'
    becomeUser: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

const UserCard:React.FC<UserCardProps> = ({ users, type, becomeUser }) => {
    if (!users[type]?.length) return null

    return (
        <Card shadow='md' bg='ash' withBorder>
            <Title order={5}>{capitalize(type)}</Title>
            <Stack p='md' gap='md'>
                {users[type].map(u => (
                    <Anchor
                        key={u.id}
                        c={colors.text}
                        href='#'
                        data-user-id={u.id}
                        onClick={becomeUser}
                    >
                        <b>{u.fullName}</b> ({u.id})
                    </Anchor>
                ))}
            </Stack>
        </Card>
    )
}

export default function Dev() {
    const [users, setUsers] = useState<AvailableUsers>(new AvailableUsers())

    const { refetch: refetchEnvironment } = useFetchEnvironment()
    const nav = useNavigate()
    useEffect(() => {
        AvailableUsers.fetch().then(setUsers)
    }, [])

    const becomeUser = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
        const userId = ev.currentTarget.dataset.userId
        ev.preventDefault()
        if (userId) {
            await loginAsUser(userId)
            await refetchEnvironment()
            nav('/studies')
        }
    }

    return (
        <Container className="dev-console">
            <LoggedInUser />
            <Container mt='xl'>
                <SimpleGrid cols={2}>
                    <UserCard users={users} type="admins" becomeUser={becomeUser} />
                    <UserCard users={users} type="researchers" becomeUser={becomeUser} />
                    <UserCard users={users} type="users" becomeUser={becomeUser} />
                </SimpleGrid>
            </Container>
        </Container>
    )
}

const LoggedInUser = () => {
    const currentUser = useCurrentUser()

    if (!currentUser.userId) return null

    return (
        <Stack>
            <Container>
                <Group justify='space-around' gap='xl'>
                    <NavLink to="/">
                        Home
                    </NavLink>
                    <Title order={3}>Logged in as: {currentUser.userId}</Title>
                </Group>
            </Container>
        </Stack>
    )
}
