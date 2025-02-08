import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { RootState } from '../store/store'

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
	const { token } = useSelector((state: RootState) => state.auth)
	const location = useLocation()

	if (!token) {
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	return <>{children}</>
}
