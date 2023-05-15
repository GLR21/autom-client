import { useLocation,Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { boolean } from "yup";

export const RequireAuth = () => {
	
	//@ts-ignore
	const auth = useAuth();
	const location = useLocation();

	return(
		//@ts-ignore
		// console.log( typeof auth?.signed.accessToken  ),
		//@ts-ignore
	  	typeof auth?.signed.accessToken != 'undefined' ? <Outlet/> : <Navigate to='/login' state={{ from: location }} replace/>
	)

}