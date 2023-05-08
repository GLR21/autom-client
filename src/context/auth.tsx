import React, { createContext, useState } from 'react';
 
export const AuthContext = createContext( {} );

export const AuthProvider = ( { children }: any ) =>
{
	const [signed, setSigned] = useState( {} );

	return(
		<AuthContext.Provider value={{ signed, setSigned }}>
			{children}
		</AuthContext.Provider>
	);
}