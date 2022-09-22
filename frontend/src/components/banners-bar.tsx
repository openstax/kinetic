import { BannerMessage } from '@api'
import { Box, Icon } from '@components'
import { React } from '@common'
import { useBanners } from '@models'
import { colors } from '../theme'
import { useIsMobileDevice } from '@lib';

const Banner: React.FC<{
    onRemove: (b: BannerMessage) => void,
    banner: BannerMessage,
}> = ({ banner, onRemove }) => (
    <Box className="py-2">
        <span className="px-1">{banner.message}</span>
        <Icon css={{ position: 'relative', top: '-15px', right: '-5px' }} icon="x" onClick={() => onRemove(banner)} color="white" />
    </Box>
)


export const BannersBar: React.FC = () => {
    const [banners, removeBanner] = useBanners()
    const isMobile = useIsMobileDevice()
    if (!banners.length) {
        return null
    }

    return (
        <div
            css={{
                margin: isMobile ? '0' : '0 10px',
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Helvetica Neue',
                textAlign: 'center',
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
