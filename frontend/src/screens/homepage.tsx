import { React, useEffect } from '../common'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { analytics } from '../lib/analytics'


export default function Homepage() {
    const location = useLocation()
    useEffect(() => {
        analytics.page()
    }, [location.pathname])

    if (location.pathname === '/') return <Navigate to="/studies" />

    return <Outlet />
}
