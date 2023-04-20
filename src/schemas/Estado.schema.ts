import * as yup from 'yup';

export const estadoSchema = yup.object().shape
(
	{
		id: yup.number().optional(),
		nome: yup.string().min(3).required( "O campo nome é obrigatório" ),
		sigla: yup.string().min(2).max(2).required( "O campo sigla é obrigatório" ),
		cod_ibge: yup.number().required( "O campo código IBGE é obrigatório" ),
	}
);