import { Logout, Refresh } from '@mui/icons-material'
import { AppBar, Box, Button, Container, IconButton, Paper, Skeleton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FetchServers from '../components/FetchServers'
import { logout } from '../store/slices/authSlice'
import { fetchServers } from '../store/slices/serversSlice'
import { AppDispatch, RootState } from '../store/store'
import { getUser } from '../utils/api'

const Dashboard: React.FC = () => {
	const [user, setUser] = useState<{ username: string } | null>(null)
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const { token } = useSelector((state: RootState) => state.auth)

	useEffect(() => {
		if (!token) {
			toast.info('Вы вышли из системы')
			navigate('/login')
		}
	}, [token, navigate])

	useEffect(() => {
		const fetchUser = async () => {
			const result = await getUser()
			if (result) setUser(result)
		}

		fetchUser()
	}, [])

	const handleLogout = () => {
		toast.info('Вы вышли из системы')
		dispatch(logout())
		navigate('/login')
	}

	const handleRefresh = () => {
		dispatch(fetchServers({ token }))
		toast.success('Данные обновлены')
	}

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
				<Container maxWidth="lg">
					<Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
						<Typography
							variant="h6"
							component={motion.div}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							sx={{ color: 'text.primary', fontWeight: 500 }}
						>
							{user ? user.username : <Skeleton width={136} />}
						</Typography>
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Tooltip title="Обновить данные">
								<IconButton onClick={handleRefresh} color="primary">
									<Refresh />
								</IconButton>
							</Tooltip>
							{isMobile ? (
								<Tooltip title="Выйти">
									<IconButton onClick={handleLogout} color="primary">
										<Logout />
									</IconButton>
								</Tooltip>
							) : (
								<Button
									onClick={handleLogout}
									startIcon={<Logout />}
									sx={{
										color: 'text.secondary',
										'&:hover': { color: 'text.primary' },
									}}
								>
									Выйти
								</Button>
							)}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Container
				maxWidth="lg"
				component={motion.div}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				sx={{ py: 4 }}
			>
				<Paper
					elevation={0}
					sx={{
						p: { xs: 2, sm: 4 },
						borderRadius: 2,
						bgcolor: 'background.paper',
					}}
				>
					<FetchServers />
				</Paper>
			</Container>
		</Box>
	)
}

export default Dashboard