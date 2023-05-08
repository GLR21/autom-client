import * as Yup from 'yup';

export const validationLoginSchema = Yup.object().shape
(
	{
		email: Yup.string().email('Invalid email').required('Required'),
		senha: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  	}
);
  
  