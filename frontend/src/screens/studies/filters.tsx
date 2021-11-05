import { React, useEffect, useState, useHistory, cx } from '@common'
import { Menu } from '@components'

export const Sort = () => {
    return (
        <>

            <div className="dropdown-item">
                Study Type
            </div>
            <div className="dropdown-item">
                Time Low to High
            </div>
            <div className="dropdown-item">
                Time High to Low
            </div>

        </>

    )
}


export const DesktopControls = () => {

    return (
        <Menu label="Sort by">
            <Sort />
        </Menu>

    )

}
