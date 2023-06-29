
import Button from '@mui/material/Button';
import { Field, Form, Formik } from 'formik';
import { GenericField } from './GenericField';
import { pessoaSchema, pessoaSchemaUpdate } from '../schemas/Pessoa.schema';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SelectWrapper } from './SelectWrapper';
import { MenuItem, Stack, TextField } from '@mui/material';
import axios from 'axios';



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
	complemento?: string|undefined;
}

export const PessoaForm = ( param:any ) => {

	const history = useNavigate();
	const { id } = useParams<{ id: string }>();
	const apiPrivate = useAxiosPrivate();

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
			tipo_pessoa: 0,
			complemento: ''
		}
	);
	const [cidades, setCidades] = useState<any>([ { id: 0, nome: 'Selecione um cidade' } ]);
	const [sys_auth, setSys_auth] = useState<any>([ { id: 0, nome: 'Selecione um tipo de autorização' }, { id: 1, nome: 'Administrador' }, { id: 2, nome: 'Usuário' } ]);
	const [tipo_pessoa, setTipo_pessoa] = useState<any>([ { id: 0, nome: 'Selecione um tipo de pessoa' }, { id: 1, nome: 'Física' }, { id: 2, nome: 'Jurídica' } ]);

	const getPessoa = async ( id:any ) =>
	{
		try
		{
			if( typeof id != 'undefined' )
			{
				const response = await apiPrivate.get('http://localhost:8080/app/getpessoa',{ params: { id: id } } )
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
										tipo_pessoa: response.data.tipo_pessoa,
										complemento: response.data.complemento
									}
								);
			}
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
			const response = await apiPrivate.get('http://localhost:8080/app/getcidades' );
			response.data.unshift( cidades[0] );
			setCidades( response.data );
			
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const findByCep = async ( cep:any, returnIbge:boolean = false ) => {
		
		try
		{
			if( returnIbge )
			{
				const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
				return response.data;
			}
			else
			{
				const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`);
				return response.data;
			}
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const findCidadeByIBGE = async ( ibge:any ) => {
		
		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getcidadebyibge/', { params: { ibge: ibge } } );
			return response.data;
		}
		catch( error )
		{
			console.log(error);
		}
	}


	useEffect
	( 
		() =>
		{
			getCidades();
			if( typeof id != 'undefined' )
			{ 
				getPessoa( id );
			}
			else
			{
				setInitialValues
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
						tipo_pessoa: 0,
						complemento: ''
					}
				)
			}
		},[initialValues] );

	return (
		<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
				<Formik
					initialValues={initialValues}
					enableReinitialize={true}
					onSubmit=
					{
						async (values,actions)=>
						{
							if( typeof values.id == 'undefined' || values.id == '' )
							{
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
									tipo_pessoa: values.tipo_pessoa,
									complemento: values.complemento
								}

								console.log(newValues);

								await apiPrivate.post('http://localhost:8080/app/createpessoa', newValues).
								then
								(
									(response) => 
									{ 
										history('/pessoasList')
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
									tipo_pessoa: values.tipo_pessoa,
									complemento: values.complemento
								}

								await apiPrivate.put(`http://localhost:8080/app/updatepessoa`, updatedValues ).then( (response) => { history('/pessoasList') } ).catch( (error) => { console.log(error) } );
							}
						}
					}

					// validationSchema={ ( typeof id != 'undefined' ) ? pessoaSchemaUpdate : pessoaSchema }
				>
					{
						({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue }) =>
						(
							<Form
								style={{ width: '50%' }}
							>
							<Stack spacing={2} direction="column" style={{ width: '100%' }}>
								<Stack spacing={2} direction="row" style={{ width: '100%' }} >
									<TextField
										name='id'
										label="Código"
										value={values.id}
										disabled={true}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '10%' } }
									>
									</TextField>
									<TextField
										name='nome'
										label="Nome"
										value={values.nome}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '45%' } }
									>

									</TextField>
									<TextField
										name='email'
										label="Email"
										value={values.email}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '45%' } }
									>
									</TextField>
								</Stack>
								<Stack spacing={2} direction="row" style={{ width: '100%' }} >
									{
										( typeof id == 'undefined' ) &&
											<TextField
												name='senha'
												label="Senha"
												value={values.senha}
												onChange={handleChange}
												size='small'
												variant='outlined'
												style={ { width: '50%' } }
											>

											</TextField>	
									}
									<TextField
										name='telefone'
										label="Telefone"
										value={values.telefone}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ typeof id == 'undefined' ? { width: '50%' } : { width: '100%' }}
									>
									</TextField>
								</Stack>
									
								<Stack spacing={2} direction="row" style={{ width: '100%' }} >
									<TextField
										name='sys_auth'
										label="Tipo de Autorização"
										value={values.sys_auth}
										onChange={handleChange}
										size='small'
										variant='outlined'
										select={true}
										style={ { width: '50%' } }
									>
										{
											(Array.isArray(sys_auth) ? sys_auth.map(({id, nome })=> ([id, nome])) : Object.entries(sys_auth)).map(([key,value])=>
											{
												return (
													<MenuItem key={key} value={key}>
														{value}
													</MenuItem>
												)
											})
										}										

									</TextField>
									<TextField
										name='tipo_pessoa'
										label="Tipo de Pessoa"
										value={values.tipo_pessoa}
										onChange={handleChange}
										size='small'
										variant='outlined'
										select={true}
										style={ { width: '50%' } }	
									>
										{
											(Array.isArray(tipo_pessoa) ? tipo_pessoa.map(({id, nome })=> ([id, nome])) : Object.entries(tipo_pessoa)).map(([key,value])=>
											{
												return (
													<MenuItem key={key} value={key}>
														{value}
													</MenuItem>
												)
											})
										}
									</TextField>
								</Stack>

								<Stack spacing={2} direction="row" style={{ width: '100%' }} >
									<TextField
										name='cep'
										label="CEP"
										value={values.cep}
										onChange={handleChange}
										onBlur={async (e:any) =>
											{
												let fieldValue = e.target.value.replace(/\D/g, '');
												let cep = await findByCep( fieldValue );
												let cepIbge = await findByCep( fieldValue, true );
												let cidade = await findCidadeByIBGE( cepIbge.ibge );
												
												setFieldValue('rua', cep.street);
												setFieldValue('bairro', cep.neighborhood);
												setFieldValue('ref_cidade', cidade.id);
												handleChange(e);
											}
										}
										size='small'
										variant='outlined'
										style={ { width: '15%' } }
									>
									</TextField>
									<TextField
										name='rua'
										label="Rua"
										value={values.rua}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '40%' } }
									>
									</TextField>
									<TextField
										name='bairro'
										label="Bairro"
										value={values.bairro}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '30%' } }
									>
									</TextField>
									<TextField
										name='numero_endereco'
										label="Número"
										value={values.numero_endereco}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '15%' } }
									>
									</TextField>
								</Stack>
								<Stack spacing={2} direction="row" style={{ width: '100%' }} >
									<TextField
										name='ref_cidade'
										label="Cidade"
										value={values.ref_cidade}
										onChange={handleChange}
										size='small'
										select={true}
										variant='outlined'
										style={ { width: '50%' } }
										disabled={true}
									>	
										{
											(Array.isArray(cidades) ? cidades.map(({id, nome })=> ([id, nome])) : Object.entries(cidades)).map(([key,value])=>
											{
												return (
													<MenuItem key={key} value={key}>
														{value}
													</MenuItem>
												)
											})
										}
									</TextField>
									<TextField
										name='complemento'
										label="Complemento"
										value={values.complemento}
										onChange={handleChange}
										size='small'
										variant='outlined'
										style={ { width: '50%' } }
									>
									</TextField>
								</Stack>
								<Button type='submit' variant='contained' color='success' size='small'  disabled={isSubmitting} >Enviar</Button>
							</Stack>								
							</Form>
						)
						
					}
				</Formik>
			</div>
			);
}
