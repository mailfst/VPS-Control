export interface Server {
	id: string
	servname: string
	servnote: string
	status: string
}

export interface ServersState {
	servers: Server[]
	isLoading: boolean
	error: string | null
}
