import { api } from "../services/api";
import useAuth from "./useAuth";

const useLogout = () => {

	//@ts-ignore
	const { setSigned } = useAuth();

	const logout = async () => {
	
		setSigned({});

		try
		{
			await api.get("/app/logout",
			{
				withCredentials: true
			}
			);
		}
		catch( error )
		{
			console.log(error);
		}

	}

	return logout;
}

export default useLogout;