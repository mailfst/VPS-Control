import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import serversReducer from './slices/serversSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		servers: serversReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
