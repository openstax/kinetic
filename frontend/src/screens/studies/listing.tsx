import { React } from '@common'
import { useCurrentUser } from '@lib'
import { ResearcherListing } from './researcher-listing'
import { UserListing } from './user-listing'

export function StudiesListing() {
    const user = useCurrentUser()
    if (user.is_researcher) {
        return <ResearcherListing />
    }
    return <UserListing />
}
