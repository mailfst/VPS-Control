import { Provider } from 'react-redux'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PrivateRoute } from './components/PrivateRoute'
import './index.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { store } from './store/store'

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route
						path='/'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
				<ToastContainer className={`whitespace-pre-wrap`} position='top-right' autoClose={3000} />
			</Router>
		</Provider>
	)
}

export default App
