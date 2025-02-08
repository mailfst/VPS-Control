export interface User {
	email: string
	password: string
}

export interface AuthState {
	token: string | null
	isLoading: boolean
	error: string | null
}
