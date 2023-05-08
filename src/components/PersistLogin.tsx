import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () =>
{
	const [isLoading,seLoading] = useState(true);
	const refresh = useRefreshToken();
	
	//@ts-ignore
	const { signed } = useAuth();

	useEffect(()=>
	{
		const verifyRefreshToken = async () =>
		{
			try
			{
				await refresh();
			}
			catch(error)
			{
				console.log(error);
			}
			finally
			{
				seLoading(false);
			}
		}

		!signed?.token ? verifyRefreshToken() : seLoading(false);
	},[]);

	return(
		<>
			{
				isLoading ? <h1>Loading...</h1> : <Outlet/>
			}
		</>
	);
}

export default PersistLogin;