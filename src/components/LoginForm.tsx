import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, TextField, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { validationLoginSchema } from '../schemas/Login.schema';
import { api } from '../services/api';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LoginValues
{
	email: string;
	senha: string;
}

export const LoginForm = () =>
{
	//@ts-ignore
	const { setSigned } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from || { pathname: '/' };


	const [initialValues, setInitialValues] = useState<LoginValues>( { email: '', senha: '' } );
	const [isSubmitting, setIsSubmitting] = useState<boolean>( false );
	const LOGIN_URL = '/app/login';

	const getLogin = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) =>{
		
		try
		{
			const response = await api.post( LOGIN_URL , { email: values.email, senha: values.senha }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true } )
			
	 		setSigned( { pessoa_id: response.data.pessoa_id, pessoa_email: response.data.pessoa_email , accessToken: response.data.accessToken } );
			setInitialValues( { email: '', senha: '' } );
			setIsSubmitting( false );
			navigate( from, { replace: true } );
		}
		catch( error )
		{
			console.log(error);
		}
	};


	return (
		<Formik initialValues={initialValues} validationSchema={validationLoginSchema} onSubmit={getLogin}>
		  {({ isSubmitting }) => (
			<Form>
			  <Typography variant="h4" mb={2}>
				Login
			  </Typography>
			  <Field name="email">
				{({ field }: { field: any }) => (
				  <TextField label="Email" variant="outlined" fullWidth margin="normal" {...field} />
				)}
			  </Field>
			  <ErrorMessage name="email" component="div" />
	
			  <Field name="senha">
				{({ field }: { field: any }) => (
				  <TextField label="Password" variant="outlined" fullWidth margin="normal" type="password" {...field} />
				)}
			  </Field>
			  <ErrorMessage name="password" component="div" />
	
			  <Button variant="contained" color="primary" fullWidth type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Logging in...' : 'Login'}
			  </Button>
			</Form>
		  )}
		</Formik>
	  );
}