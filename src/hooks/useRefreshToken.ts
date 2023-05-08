import { api } from "../services/api";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	//@ts-ignore
	const { setSigned } = useAuth();

	const refresh = async () => {
		const response = await api.get("/app/refresh",
		{
			withCredentials: true
		}
		);

		setSigned(

			//@ts-ignore
			prev =>
			{
				return {
					...prev,
					pessoa_id: response.data.pessoa_id,
					pessoa_email: response.data.pessoa_email,
					accessToken: response.data.accessToken
				}
			}
		)

		return response.data.accessToken;
	}

	return refresh;
}

export default useRefreshToken;

