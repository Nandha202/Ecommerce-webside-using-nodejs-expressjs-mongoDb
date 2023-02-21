import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import Loader from '../layouts/Loader';

export default function ProtectedRoute ({children,isAdmin}) {
    const { isAuthenticated, user,  loading } = useSelector(state => state.authState)
   
    if(!isAuthenticated && !loading) {
        return <Navigate to="/login" />
    }

    if(isAuthenticated) {
        if(isAdmin === true && user.role !== 'admin') {
            return <Navigate to="/" />
        }

        return children;
    }
    

    if(loading) {
        return <Loader/>
    }

   
}