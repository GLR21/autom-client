import { apiPrivate } from "../services/api";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
	
	//@ts-ignore
	const { signed } = useAuth();
	const refresh = useRefreshToken();

	useEffect(() => {

		const requestInterceptor = apiPrivate.interceptors.request.use(
		
			config =>
			{
				
				if( !config.headers["Authorization"] )
				{
					config.headers["Authorization"] = `Bearer ${signed.accessToken}`;
				}
				
				return config;
			},
			error => Promise.reject(error)
		);

		const responseInterceptor = apiPrivate.interceptors.response.use(
		
			response=>response,
			async (error) => {
				const originalRequest = error?.config;

				if( error?.response?.status === 403 && !originalRequest.sent )
				{
					originalRequest.sent = true;
					const newAccessToken = await refresh();
					originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return apiPrivate(originalRequest);
				}
				return Promise.reject(error);
			}

		);

		return () => {
			apiPrivate.interceptors.request.eject(requestInterceptor);
			apiPrivate.interceptors.response.eject(responseInterceptor);
		};
	}, [signed,refresh]);

	return apiPrivate;
}

export default useAxiosPrivate;