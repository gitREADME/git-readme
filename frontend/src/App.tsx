
import 'react-toastify/dist/ReactToastify.css'

import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import LoadingComponent from './components/loading'

import {setAuth} from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import Dashboard from './components/dashboard'
import ProtectedRoutes from './components/protectedRoutes'
import Landing from './components/landing'
import GuestRoutes from './components/guestRoutes'
import { ProfileGeneration } from './components/profileGeneration'
import Docs from './components/docs'
import OAuthCallback from './components/oauthCallback'
import { authApiFn } from './api/authApi'
import { getAccessToken, saveAuthUser } from './utils/authStorage'


function App() {
	const dispatch = useAppDispatch();
	
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkAuth() {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
      const res = await authApiFn.fetchCurrentUser();
		console.log('App.jsx:' + JSON.stringify(res));
		if(!res.data || !res.success) {
			return ;
		}

      saveAuthUser(res.data);
		dispatch(setAuth(res.data));
      } catch (error) {
        console.log('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <Routes>
      <Route path='/oauth/callback' element={<OAuthCallback />} />
		
		<Route path='/docs' element={<Docs />} />

		{/* Public only Auth Routes */}
		<Route path="/" element={<GuestRoutes />}>
			<Route path='/' element={<Landing />} />
		</Route>	

		{/* Normal Auth Routes */}
		<Route path="/" element={<ProtectedRoutes permsType="normal"/>}>
			<Route path='dashboard' element={<Dashboard />} />
		</Route>		

		{/* Elevated Auth Routes */}
		<Route path="/" element={<ProtectedRoutes permsType="elevated"/>}>
			<Route path='/generate-profile' element={<ProfileGeneration />} />
		</Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
