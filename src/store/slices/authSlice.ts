import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState, User } from '../../types/auth'

const loadInitialState = (): AuthState => {
	const getToken = localStorage.getItem('token')
	return {
		token: getToken || null,
		isLoading: false,
		error: null,
	}
}

const initialState: AuthState = loadInitialState()

export const login = createAsyncThunk('auth/login', async ({ email, password }: User) => {
	try {
		const url = `${import.meta.env.VITE_AUTH_API_URL}`
		const response = await axios.post(
			url,
			{ email, password },
			{
				headers: {
					'Content-Type': import.meta.env.VITE_AUTH_TYPE_URL,
				},
			}
		)
		const { token } = response.data
		localStorage.setItem('token', token)
		return { token }
	} catch (error) {
		throw new Error('Неверный логин или пароль')
	}
})

export const logout = createAsyncThunk('auth/logout', async () => {
	localStorage.removeItem('token')
})

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: state => {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.pending, state => {
				state.isLoading = true
				state.error = null
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false
				state.token = action.payload.token
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.error.message || 'Login failed'
			})
			.addCase(logout.fulfilled, state => {
				state.token = null
			})
	},
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
