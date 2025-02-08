import axios from 'axios'

export const getUser = async () => {
	try {
		const userData = await axios.get(import.meta.env.VITE_GET_USER_INFO, {
			params: {
				token: localStorage.getItem('token'),
			},
		})

		return { username: userData.data.data.username }
	} catch (error) {
		console.error('Ошибка получения пользователя: ', error)
		return null
	}
}

export const getServerUrl = async (url: string, params: Record<string, any> = {}) => {
	return await axios.get(url, {
		params,
	})
}

export const postServerUrl = async (url: string, params: Record<string, any> = {}, contentType: string) => {
	return await axios.post(url, params, {
		headers: {
			'Content-Type': contentType,
		},
	})
}
