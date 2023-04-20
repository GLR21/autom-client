
import Button from '@mui/material/Button';
import { Field, Form, Formik } from 'formik';
import { GenericField } from './GenericField';
import { pessoaSchema, pessoaSchemaUpdate } from '../schemas/Pessoa.schema';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SelectWrapper } from './SelectWrapper';

interface Values{
	
	id?: number|undefined|string;
	nome: string;
	email: string;
	senha?: string|undefined;
	telefone: string;
	sys_auth?: Number|undefined;
	cep: string;
	rua: string;
	bairro: string;
	numero_endereco: Number;
	ref_cidade: Number;
	tipo_pessoa?: Number|undefined;
}

export const PessoaForm = ( param:any ) => {

	const history = useHistory();
	const { id } = useParams<{ id: string }>();
	
	

	const tipo_pessoa = [ { id: 0, nome: 'Selecione um tipo de pessoa' }, { id: 1, nome: 'Física' }, { id: 2, nome: 'Jurídica' } ];

	const [initialValues, setInitialValues] = useState<Values>
	( 
		{
			id: '',
			nome: '',
			email: '',
			senha: '',
			telefone: '',
			sys_auth: 0,
			cep: '',
			rua: '',
			bairro: '',
			numero_endereco: 0,
			ref_cidade: 0,
			tipo_pessoa: 0
		}
	);
	const [cidades, setCidades] = useState<any>([ { id: 0, nome: 'Selecione um cidade' } ]);
	const [sys_auth, setSys_auth] = useState<any>([ { id: 0, nome: 'Selecione um tipo de autorização' }, { id: 1, nome: 'Administrador' }, { id: 2, nome: 'Usuário' } ]);

	const getPessoa = async ( id:any ) =>
	{
		try
		{
			console.log(id);
			const response = await axios.get('http://localhost:8080/app/getpessoa',{ params: { id: id } } )
			setInitialValues(
								{
									id: response.data.id,
									nome: response.data.nome,
									email: response.data.email,
									senha: response.data.senha,
									telefone: response.data.telefone,
									sys_auth: response.data.sys_auth,
									cep: response.data.cep,
									rua: response.data.rua,
									bairro: response.data.bairro,
									numero_endereco: response.data.numero_endereco,
									ref_cidade: response.data.ref_cidade,
									tipo_pessoa: response.data.tipo_pessoa
								}
							);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getCidades = async ( id?:any ) =>
	{
		try
		{
			const response = await axios.get('http://localhost:8080/app/getcidades' );
			response.data.unshift( cidades[0] );
			setCidades( response.data );
			
		}
		catch( error )
		{
			console.log(error);
		}
	}

	useEffect( () => {  getCidades(); if( typeof id != 'undefined' ) { getPessoa( id ); } }, [] );

	return (
				<Formik
					initialValues={initialValues}
					enableReinitialize={true}
					onSubmit=
					{
						async (values,actions)=>
						{
							if( typeof values.id == 'undefined' || values.id == '' )
							{
								console.log(values);

								let newValues =
								{
									nome: values.nome,
									email: values.email,
									senha: values.senha,
									telefone: values.telefone,
									sys_auth: values.sys_auth,
									cep: values.cep,
									rua: values.rua,
									bairro: values.bairro,
									numero_endereco: values.numero_endereco,
									ref_cidade: values.ref_cidade,
									tipo_pessoa: values.tipo_pessoa
								}

								await axios.post('http://localhost:8080/app/createpessoa', newValues).
								then
								(
									(response) => 
									{ 
										history.push('/pessoasList')
									}
								).catch( (error) => { console.log(error) } );
							}
							else
							{
								let updatedValues =
								{
									id: values.id,
									nome: values.nome,
									email: values.email,
									telefone: values.telefone,
									sys_auth: values.sys_auth,
									cep: values.cep,
									rua: values.rua,
									bairro: values.bairro,
									numero_endereco: values.numero_endereco,
									ref_cidade: values.ref_cidade,
									tipo_pessoa: values.tipo_pessoa
								}

								await axios.put(`http://localhost:8080/app/updatepessoa`, updatedValues ).then( (response) => { history.push('/pessoasList') } ).catch( (error) => { console.log(error) } );
							}
						}
					}

					validationSchema={ ( typeof id != 'undefined' ) ? pessoaSchemaUpdate : pessoaSchema }
				>
					{
						({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) =>
						(
							<Form>
								<div>
									<Field
									 	name='id'
										placeholder='Código'
										disabled={true}
										component={ GenericField }
									/>
								</div>
								<div>
									<Field
										name='nome'
										label="Nome"
										error={ ( errors.nome && touched.nome ) }
										helperText={ (errors.nome && touched.nome ) ? errors.nome : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									<Field
										name='email'
										label="Email"
										error={ ( errors.email && touched.email ) }
										helperText={ (errors.email && touched.email ) ? errors.email : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									
									<Field
										name='senha'
										label="Senha"
										error={ ( errors.senha && touched.senha ) }
										helperText={ (errors.senha && touched.senha ) ? errors.senha : '' }
										component={ GenericField }
										disabled={ ( typeof id != 'undefined' ) ? true : false }
									/>
								</div>
								<div>
									<Field
										name='telefone'
										label="Telefone"
										error={ ( errors.telefone && touched.telefone ) }
										helperText={ (errors.telefone && touched.telefone ) ? errors.telefone : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									<SelectWrapper
										name='sys_auth'
										label="Tipo de Autorização"
										error={ ( errors.sys_auth && touched.sys_auth ) }
										helperText={ (errors.sys_auth && touched.sys_auth ) ? errors.sys_auth : '' }
										options={ sys_auth }
										value={ values.sys_auth }
										
									/>
								</div>
								<div>
									<Field
										name='cep'
										label="CEP"
										error={ ( errors.cep && touched.cep ) }
										helperText={ (errors.cep && touched.cep ) ? errors.cep : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									<Field
										name='rua'
										label="Rua"
										error={ ( errors.rua && touched.rua ) }
										helperText={ (errors.rua && touched.rua ) ? errors.rua : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									<Field
										name='bairro'
										label="Bairro"
										error={ ( errors.bairro && touched.bairro ) }
										helperText={ (errors.bairro && touched.bairro ) ? errors.bairro : '' }
										component={ GenericField }
									/>
								</div>
								<div>
									<Field
										name='numero_endereco'
										label="Número"
										error={ ( errors.numero_endereco && touched.numero_endereco ) }
										helperText={ (errors.numero_endereco && touched.numero_endereco ) ? errors.numero_endereco : '' }
										component={ GenericField }
										type="number"
									/>
								</div>
								<div>
									<SelectWrapper
										defaultValue=""
										name='ref_cidade'
										label="Cidade"
										options={ cidades }
									/>
									
								</div>
								<div>
									<SelectWrapper
										defaultValue=''
										name='tipo_pessoa'
										label="Tipo de Pessoa"
										options={ tipo_pessoa }
										error={ ( errors.tipo_pessoa && touched.tipo_pessoa ) }
										helperText={ (errors.tipo_pessoa && touched.tipo_pessoa ) ? errors.tipo_pessoa : '' }
									/>
								</div>

								<Button type='submit' variant='contained' color='success' size='small'  disabled={isSubmitting} >Enviar</Button>
							</Form>
						)
						
					}
				</Formik>
			);
}
