import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { Server, ServersState } from '../../types/server'
import { getServerUrl, postServerUrl } from '../../utils/api'

const initialState: ServersState = {
	servers: [],
	isLoading: false,
	error: null,
}

export const fetchServers = createAsyncThunk('servers/fetchServers', async ({ token }: { token: string | null }) => {
	try {
		const url = import.meta.env.VITE_GET_USER_SERVER_LIST
		const urlServerStatus = import.meta.env.VITE_GET_SERVER_STATUS

		const response = await getServerUrl(url, { token })
		const servers: Server[] = response.data.data

		const statusPromises = servers.map(server =>
			getServerUrl(urlServerStatus, { token, id: server.id }).then(res => ({
				...server,
				status: res.data.data,
			}))
		)
		const serversWithStatus = await Promise.all(statusPromises)

		return serversWithStatus
	} catch (error) {
		console.error('Ошибка:', error)
		throw new Error('Ошибка запроса серверов')
	}
})

export const controlServer = createAsyncThunk(
	'servers/controlServer',
	async ({
		token,
		serverId,
		action,
	}: {
		token: string | null
		serverId: string
		action: 'start' | 'stop' | 'reboot'
	}) => {
		try {
			const urlServerAction = `${import.meta.env.VITE_POST_SERVER_ACTION}${action}`
			const urlServerStatus = `${import.meta.env.VITE_GET_SERVER_STATUS}`
			const contentType = `${import.meta.env.VITE_AUTH_TYPE_URL}`

			await postServerUrl(urlServerAction, { token, id: serverId }, contentType)

			const serverStatus = await getServerUrl(urlServerStatus, { token: token, id: serverId })
			const { data } = serverStatus.data

			return { id: serverId, status: data, action }
		} catch (error) {
			console.error('Ошибка: ', error)
			throw new Error('Ошибка управления сервером')
		}
	}
)

const serversSlice = createSlice({
	name: 'servers',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchServers.pending, state => {
				state.isLoading = true
			})
			.addCase(fetchServers.fulfilled, (state, action) => {
				state.isLoading = false
				state.servers = action.payload
				state.error = null
			})
			.addCase(fetchServers.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.error.message || 'Ошибка получения сервера'
				toast.error(state.error)
			})
			.addCase(controlServer.fulfilled, (state, action) => {
				const { id, status, action: serverAction } = action.payload
				const index = state.servers.findIndex(server => server.id === id)
				if (index !== -1) {
					state.servers[index].status = status
				}

				switch (serverAction) {
					case 'start':
						toast.success('Сервер запущен')
						break
					case 'stop':
						toast.success('Сервер остановлен')
						break
					case 'reboot':
						toast.success('Сервер перезагружен')
						break
				}
			})
			.addCase(controlServer.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.error.message || 'Ошибка управления сервером'
				toast.error(state.error)
			})
	},
})

export default serversSlice.reducer
