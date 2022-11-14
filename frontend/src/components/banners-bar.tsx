import { BannerMessage } from '@api'
import { Box, Icon } from '@components'
import { React } from '@common'
import { useBanners } from '@models'
import { colors } from '../theme'

const Banner: React.FC<{
    onRemove: (b: BannerMessage) => void,
    banner: BannerMessage,
}> = ({ banner, onRemove }) => (
    <Box className="py-2 d-flex justify-content-between">
        <div css={{ width: 16 }}></div>
        <span className="align-self-center text-center px-2">{banner.message}</span>
        <Icon
            css={{ position: 'relative', top: '-15px', right: '-5px' }}
            icon="x"
            onClick={() => onRemove(banner)}
            color="white"
        />
    </Box>
)


export const BannersBar: React.FC = () => {
    const [banners, removeBanner] = useBanners()
    if (!banners.length) {
        return null
    }

    return (
        <div
            css={{
                color: 'white',
                fontFamily: 'Helvetica Neue',
                backgroundColor: colors.darkTeal,
                boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
            }}
        >
            <div className="container">
                {banners.map(b => <Banner key={b.id} banner={b} onRemove={removeBanner} />)}
            </div>
        </div>
    )
}
