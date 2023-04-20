import * as yup from 'yup';

export const pessoaSchema = yup.object().shape
(
	{
		id: yup.number().optional(),
		nome: yup.string().min(3).required( "O campo nome é obrigatório" ),
		email: yup.string().email().required( "O campo email é obrigatório" ),
		senha: 
				yup
				.string()
				.required( "O campo senha é obrigatório" )
				.matches
						(
							/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
							"Este campo não deve ser vazio. Deve conter no mínimo: um caractere maiúsculo, um caractere especial, um caractere minúsculo e ter um tamanho mínimo de 8 caracteres"
						),
		telefone: yup.string().required( "O campo telefone é obrigatório" ),
		sys_auth: yup.number().default(2),
		cep: yup.string().required( "O campo CEP é obrigatório" ).matches(  /^[0-9]{5}-[0-9]{3}$/, "O CEP deve estar no formato 00000-000" ),
		rua: yup.string().required( "O campo rua é obrigatório" ),
		bairro: yup.string().required( "O campo bairro é obrigatório" ),
		numero_endereco: yup.number().required( "O campo número é obrigatório" ).min(1, "O campo número é obrigatório" ),
		ref_cidade: yup.number().required( "O campo cidade é obrigatório" ).min(1, "O campo cidade é obrigatório" ),
		tipo_pessoa: yup.number().min(1)
	}
);

export const pessoaSchemaUpdate = yup.object().shape
(
	{
		id: yup.number().optional(),
		nome: yup.string().min(3).required( "O campo nome é obrigatório" ),
		email: yup.string().email().required( "O campo email é obrigatório" ),
		telefone: yup.string().required( "O campo telefone é obrigatório" ),
		sys_auth: yup.number().optional().default(2),
		cep: yup.string().required( "O campo CEP é obrigatório" ).matches(  /^[0-9]{5}-[0-9]{3}$/, "O CEP deve estar no formato 00000-000" ),
		rua: yup.string().required( "O campo rua é obrigatório" ),
		bairro: yup.string().required( "O campo bairro é obrigatório" ),
		numero_endereco: yup.number().required( "O campo número é obrigatório" ),
		ref_cidade: yup.number().required( "O campo cidade é obrigatório" ).min(1, "O campo cidade é obrigatório" ),
		tipo_pessoa: yup.number().optional().default(1)
	}
)