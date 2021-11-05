import { React } from '@common'
import { useCurrentUser } from '@lib'
import { ResearcherListing } from './studies/researcher-listing'
import { UserListing } from './studies/user-listing'

export default function StudiesListing() {
    const user = useCurrentUser()
    if (user.is_researcher) {
        return <ResearcherListing />
    }
    return <UserListing />
}
