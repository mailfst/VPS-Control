import { Box, Card, CardContent, Skeleton } from '@mui/material'

const ServerSkeleton = () => (
	<Card sx={{ height: '100%' }}>
		<CardContent>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Skeleton variant='text' width='60%' height={32} />
				<Skeleton variant='rectangular' width={80} height={24} sx={{ borderRadius: 1 }} />
			</Box>
			<Skeleton variant='text' width='80%' height={24} sx={{ mb: 2 }} />
			<Box sx={{ display: 'flex', gap: 1 }}>
				<Skeleton variant='rectangular' width='33%' height={36} sx={{ borderRadius: 1 }} />
				<Skeleton variant='rectangular' width='33%' height={36} sx={{ borderRadius: 1 }} />
				<Skeleton variant='rectangular' width='33%' height={36} sx={{ borderRadius: 1 }} />
			</Box>
		</CardContent>
	</Card>
)

export default ServerSkeleton
