import { BannerMessage } from '@api'
import { Box, Icon } from '@components'
import { cx, React } from '@common'
import { useBanners } from '@models'
import { colors } from '../theme'
import { useIsMobileDevice } from '@lib';

const Banner: React.FC<{
    onRemove: (b: BannerMessage) => void,
    banner: BannerMessage,
}> = ({ banner, onRemove }) => (
    <Box className="py-2 d-flex justify-content-between">
        <span className={cx({ 'x-small': useIsMobileDevice() })}>
            {banner.message}
        </span>
        <Icon
            height={25}
            icon="close"
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
                backgroundColor: colors.purple,
                boxShadow: '0px 10px 20px -5px rgba(0, 0, 0, 0.08)',
            }}
        >
            <div className="container">
                {banners.map(b => <Banner key={b.id} banner={b} onRemove={removeBanner} />)}
            </div>
        </div>
    )
}
