import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { login } from '../store/slices/authSlice'
import { AppDispatch, RootState } from '../store/store'

export const validationSchema = Yup.object().shape({
	email: Yup.string().email('Некорректный формат email').required('Email обязателен'),
	password: Yup.string().required('Пароль обязателен'),
})

const Login: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false)
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const { token, error, isLoading } = useSelector((state: RootState) => state.auth)

	useEffect(() => {
		if (token) {
			navigate('/')
		}
	}, [token, navigate])

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema,
		onSubmit: async values => {
			try {
				await dispatch(login(values)).unwrap()
				if (!isLoading) {
					toast.success('Вы вошли в систему!')
					setTimeout(() => {
						navigate('/')
					}, 1500)
				}
			} catch (error) {
				console.error('Ошибка авторизации:', error)
				toast.error('Ошибка входа. \nПовторите попытку еще раз.')
			}
		},
	})

	const handleClickShowPassword = () => setShowPassword(show => !show)

	const isFormEmpty = !formik.values.email || !formik.values.password

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'background.default',
				p: 2,
			}}
		>
			<Container maxWidth="sm">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Paper
						elevation={2}
						sx={{
							p: { xs: 3, sm: 6 },
							borderRadius: 2,
							bgcolor: 'background.paper',
						}}
					>
						<Typography
							variant="h4"
							component="h1"
							gutterBottom
							sx={{
								textAlign: 'center',
								fontWeight: 700,
								color: 'text.primary',
								mb: 4,
							}}
						>
							Вход в панель FST
						</Typography>

						<form onSubmit={formik.handleSubmit}>
							<Stack spacing={3}>
								<TextField
									fullWidth
									id="email"
									name="email"
									label="Email"
									variant="outlined"
									value={formik.values.email}
									onChange={formik.handleChange}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email && formik.errors.email}
									sx={{ bgcolor: 'background.paper' }}
								/>

								<TextField
									fullWidth
									id="password"
									name="password"
									label="Пароль"
									type={showPassword ? 'text' : 'password'}
									value={formik.values.password}
									onChange={formik.handleChange}
									error={formik.touched.password && Boolean(formik.errors.password)}
									helperText={formik.touched.password && formik.errors.password}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleClickShowPassword} edge="end">
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{ bgcolor: 'background.paper' }}
								/>

								{error && (
									<Typography
										color="error"
										variant="body2"
										sx={{ textAlign: 'center', mt: 2 }}
									>
										{error}
									</Typography>
								)}

								<Button
									type="submit"
									variant="contained"
									size="large"
									disabled={isFormEmpty || isLoading}
									sx={{
										mt: 3,
										py: 1.5,
										fontSize: '1rem',
										fontWeight: 600,
										textTransform: 'none',
										borderRadius: 2,
									}}
								>
									{isLoading ? 'Вход...' : 'Войти'}
								</Button>
							</Stack>
						</form>
					</Paper>
				</motion.div>
			</Container>
		</Box>
	)
}

export default Login