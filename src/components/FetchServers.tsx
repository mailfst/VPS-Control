import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import RefreshIcon from '@mui/icons-material/Refresh'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Grid2,
	IconButton,
	Link,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { controlServer, fetchServers } from '../store/slices/serversSlice'
import { AppDispatch, RootState } from '../store/store'
import ServerSkeleton from './Skeletons/ServerSceleton'

const FetchServers = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const dispatch = useDispatch<AppDispatch>()
	const { token } = useSelector((state: RootState) => state.auth)
	const { servers, isLoading } = useSelector((state: RootState) => state.servers)

	useEffect(() => {
		dispatch(fetchServers({ token }))
		const interval = setInterval(() => {
			dispatch(fetchServers({ token }))
			toast.success('Список серверов обновлен')
		}, 30000)

		return () => clearInterval(interval)
	}, [dispatch, token])

	const handleServerAction = (serverId: string, action: 'start' | 'stop' | 'reboot') => {
		dispatch(controlServer({ token, serverId, action })).unwrap()
	}

	if (isLoading) {
		return (
			<Grid2 container spacing={2}>
				{[1, 2, 3].map(i => (
					<Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
						<ServerSkeleton />
					</Grid2>
				))}
			</Grid2>
		)
	}

	return (
		<Box sx={{ mt: 4 }}>
			{servers && servers.length === 0 && (
				<Box
					component={motion.div}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					sx={{
						textAlign: 'center',
						p: 4,
						bgcolor: 'background.paper',
						borderRadius: 2,
						boxShadow: 1,
					}}
				>
					<Typography variant='h6' gutterBottom>
						Серверов пока нет
					</Typography>
					<Typography color='textSecondary'>
						Вы можете приобрести сервер на сайте:{' '}
						<Link
							href={import.meta.env.VITE_URL_BUY_VPS}
							target='_blank'
							rel='noopener noreferrer'
							style={{ color: theme.palette.primary.main }}
						>
							FST
						</Link>
					</Typography>
				</Box>
			)}
			<Grid2 container spacing={2}>
				{servers &&
					servers.length > 0 &&
					servers.map(server => (
						<Grid2 size={{ xs: 12, sm: 6, md: 4 }} /*xs={12} sm={6} md={4}*/ key={server.id}>
							<Card
								component={motion.div}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									'&:hover': {
										boxShadow: 3,
										transform: 'translateY(-4px)',
										transition: 'all 0.3s ease-in-out',
									},
								}}
							>
								<CardContent sx={{ flexGrow: 1 }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
										<Typography variant='h6' component='div' sx={{ wordBreak: 'break-word' }}>
											{server.servname}
										</Typography>
										<Chip
											label={server.status === 'online' ? 'Онлайн' : 'Оффлайн'}
											color={server.status === 'online' ? 'success' : 'error'}
											size='small'
											sx={{
												ml: 1,
												minWidth: 80,
												textTransform: 'capitalize',
											}}
										/>
									</Box>

									<Typography
										variant='body2'
										color='text.secondary'
										sx={{
											mb: 2,
											minHeight: '3em',
											wordBreak: 'break-word',
										}}
									>
										{server.servnote}
									</Typography>

									<Box
										sx={{
											display: 'flex',
											gap: 1,
											flexWrap: 'wrap',
											justifyContent: isMobile ? 'center' : 'space-between',
										}}
									>
										{isMobile ? (
											<>
												<Tooltip title='Запустить'>
													<IconButton
														color='primary'
														onClick={() => handleServerAction(server.id, 'start')}
														disabled={server.status === 'online'}
													>
														<PowerSettingsNewIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title='Остановить'>
													<IconButton
														color='error'
														onClick={() => handleServerAction(server.id, 'stop')}
														disabled={server.status === 'offline'}
													>
														<StopCircleIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title='Перезагрузить'>
													<IconButton
														color='warning'
														onClick={() => handleServerAction(server.id, 'reboot')}
														disabled={server.status === 'offline'}
													>
														<RefreshIcon />
													</IconButton>
												</Tooltip>
											</>
										) : (
											<>
												<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
													<Button
														size='small'
														variant='contained'
														startIcon={<PowerSettingsNewIcon />}
														onClick={() => handleServerAction(server.id, 'start')}
														disabled={server.status === 'online'}
														sx={{ flex: 1 }}
													>
														Запустить
													</Button>
													<Button
														size='small'
														variant='contained'
														color='error'
														startIcon={<StopCircleIcon />}
														onClick={() => handleServerAction(server.id, 'stop')}
														disabled={server.status === 'offline'}
														sx={{ flex: 1 }}
													>
														Остановить
													</Button>
												</Box>
												<Button
													size='small'
													fullWidth
													variant='contained'
													color='warning'
													startIcon={<RefreshIcon />}
													onClick={() => handleServerAction(server.id, 'reboot')}
													disabled={server.status === 'offline'}
													sx={{ flex: 1 }}
												>
													Перезагрузить
												</Button>
											</>
										)}
									</Box>
								</CardContent>
							</Card>
						</Grid2>
					))}
			</Grid2>
		</Box>
	)
}

export default FetchServers
