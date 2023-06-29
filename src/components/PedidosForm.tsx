import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik';
import { Button, FormControlLabel, FormGroup, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const PedidosForm = ( param:any ) => {

	const apiPrivate = useAxiosPrivate();
	const history = useNavigate();
	const { id }  = useParams<{ id: string }>();

	const [pecas,setPecas] = useState<any>([ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 }]);
	const [pessoas,setPessoas] = useState<any>([ { id: 0, nome: 'Selecione uma pessoa' } ]);
	const [cidades,setCidades] = useState<any>([ { id: 0, nome: '' } ]);	
	const [fields, setFields] = useState({ cliente: 0, fields: [{ peca: 0, quantidade: 0 ,valor_unidade: 0 }], cep: '', rua: '', bairro: '', numero_endereco: '', ref_cidade: 0, sigla_estado: '', fl_usar_endereco_cliente: false });
	const [fl_usar_endereco_cliente, setfl_usar_endereco_cliente] = useState(false);

	const getPecas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpecas');

			let pecasLoad = [ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 } ];

			response.data.map( (peca:any) => { pecasLoad.push( { id: peca.id, nome: peca.nome, valor_unidade: peca.valor_revenda } ) });
			setPecas(pecasLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const pecaChangeHandler = async ( id:any ) => {
		
		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpeca/', { params: { id: id } } );
			return response.data;
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getPessoas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpessoas');

			let pessoasLoad = [ { id: 0, nome: 'Selecione uma pessoa' } ];

			response.data.map( (pessoa:any) => { pessoasLoad.push( { id: pessoa.id, nome: pessoa.nome } ) });
			setPessoas(pessoasLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getCidades = async () => {
		
		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getcidades');

			let cidadesLoad = [ { id: 0, nome: '' } ];

			response.data.map( (cidade:any) => { cidadesLoad.push( { id: cidade.id, nome: cidade.nome } ) });
			setCidades(cidadesLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getPedido = async ( id:any ) => {

		try
		{
			let pedido =
			{
				cliente: 0,
				fields: [{ peca: 0, quantidade: 0 ,valor_unidade: 0, valor_total: '0' }],
				cep: '',
				rua: '',
				bairro: '',
				numero_endereco: '',
				ref_cidade: 0,
				sigla_estado: '',
				fl_usar_endereco_cliente: false
			}

			const response = await apiPrivate.get('http://localhost:8080/app/getpedido/', { params: { id: id } } );	
			
			let responseData = response.data[0];

			pedido.cliente = responseData.ref_pessoa;
			pedido.fl_usar_endereco_cliente = responseData.fl_usar_endereco_cliente;

			setfl_usar_endereco_cliente( responseData.fl_usar_endereco_cliente );

			if( !responseData.fl_usar_endereco_cliente  )
			{
				pedido.cep = responseData.cep;
				pedido.rua = responseData.rua;
				pedido.bairro = responseData.bairro;
				pedido.numero_endereco = responseData.numero_endereco;
				pedido.ref_cidade = responseData.ref_cidade;

				let sigla_estado = await findByCep( responseData.cep );
				pedido.sigla_estado = sigla_estado.state;
			}

			await Promise.all
			( 
				responseData.pecasPedido.map( async (peca:any) =>
				{
					let pecaData = await pecaChangeHandler( peca.ref_peca );
					pedido.fields.push( { peca: peca.ref_peca, quantidade: peca.quantidade, valor_unidade: pecaData.valor_revenda, valor_total: (pecaData.valor_revenda * peca.quantidade).toFixed(2)  } );
				}
			));
			
			pedido.fields.shift();
			setFields( pedido );
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
	
	useEffect( () => { if( typeof id != 'undefined' ){ getPedido( id ) } getPecas();getPessoas();getCidades(); }, [] );

	return (
	<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
		<Formik
		initialValues={fields}
		onSubmit={

				async (values,actions)=>
				{
					let param:any;
					if( typeof id != 'undefined' )
					{
						param = {
							id: parseInt(id),
							ref_pessoa: values.cliente,
							total: 0,
							status: 2,
							pecasPedido: [{ ref_peca: 0, quantidade: 0}],
							cep: values.cep,
							rua: values.rua,
							bairro: values.bairro,
							numero_endereco: values.numero_endereco,
							ref_cidade: values.ref_cidade,
							fl_usar_endereco_cliente: values.fl_usar_endereco_cliente
						};
					}
					else
					{
						param = {
							ref_pessoa: values.cliente,
							total: 0,
							status: 2,
							pecasPedido: [{ ref_peca: 0, quantidade: 0}],
							cep: values.cep,
							rua: values.rua,
							bairro: values.bairro,
							numero_endereco: values.numero_endereco,
							ref_cidade: values.ref_cidade,
							fl_usar_endereco_cliente: values.fl_usar_endereco_cliente
						};
					}

					if( values.fl_usar_endereco_cliente )
					{
						delete param.cep;
						delete param.rua;
						delete param.bairro;
						delete param.numero_endereco;
						delete param.ref_cidade;
					}

					param.pecasPedido.shift();
					values.fields.map( async (field:any) => 
					{
						param.total+= parseFloat( field.valor_total );
						param.pecasPedido.push( { ref_peca: field.peca, quantidade: field.quantidade } );
					});

					try
					{
						if( typeof id != 'undefined' )
						{
							const response = await apiPrivate.put('http://localhost:8080/app/updatepedido', param );
							history('/pedidosList');
						}
						else
						{
							const response = await apiPrivate.post('http://localhost:8080/app/createpedido', param );
							history('/pedidosList');
						}
					}
					catch( error )
					{
						console.log(error);
					}
				}
		}
		enableReinitialize={true}
		>

		{({ values, handleChange, setFieldValue, getFieldProps }) => (
			<Form
				style={{ width: '50%' }}
			>
				<Stack spacing={2} direction="column" style={{ width: '100%' }}>
					<TextField 
						select={true}
						variant='outlined'
						name='cliente'
						size='small'
						onChange={handleChange}
						style={{ width: '100%' }}
						value={values.cliente}
						disabled={ typeof id != 'undefined' ? true : false }
					>
						{
							(Array.isArray(pessoas) ? pessoas.map(({id, nome })=> ([id, nome])) : Object.entries(pessoas)).map(([key,value])=>
							{
								return (
									<MenuItem key={key} value={key}>
										{value}
									</MenuItem>
								)
							})
						}
					</TextField>
					{
						!fl_usar_endereco_cliente &&
						<Stack spacing={2} direction="row" style={{ width: '100%' }}>
					<TextField
						variant='outlined'
						name='cep'
						size='small'
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
								setFieldValue('sigla_estado', cep.state);
								handleChange(e);
							}
						}
						style={{ width: '20%' }}
						value={values.cep}
						label='CEP'
						helperText='Ex: 12345678'
					/>
						
					<TextField
						variant='outlined'
						name='rua'
						size='small'
						onChange={handleChange}
						style={{ width: '80%' }}
						value={values.rua}
						label='Endereço'
					/>
						</Stack>
					}
					{
						!fl_usar_endereco_cliente &&
						<Stack spacing={2} direction="row" style={{ width: '100%' }}>
						<TextField
							variant='outlined'
							name='bairro'
							size='small'
							onChange={handleChange}
							style={{ width: '70%' }}
							value={values.bairro}
							label='Bairro'
						/>
						<TextField
							variant='outlined'
							name='numero_endereco'
							size='small'
							onChange={handleChange}
							style={{ width: '30%' }}
							value={values.numero_endereco}
							label='Número da residência'
							helperText='Ex: 123 ou s/n'
						/>
						</Stack>
					}
					{
						!fl_usar_endereco_cliente &&
						<Stack spacing={2} direction="row" style={{ width: '100%' }}>
						<TextField
							variant='outlined'
							name='ref_cidade'
							size='small'
							select={true}
							onChange={handleChange}
							style={{ width: '50%' }}
							value={values.ref_cidade}
							label='Cidade'
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
							variant='outlined'
							name='sigla_estado'
							size='small'
							onChange={handleChange}
							style={{ width: '50%' }}
							value={values.sigla_estado}
							label='Estado'
							disabled={true}
						/>
						</Stack>
					}

					<FieldArray 
						name="fields" 
					>
						{({ push, remove }) => (
						<>
							{values.fields.map((field, index ) => (
								<div key={index}>
									<Stack spacing={2} direction="row" style={{ width: '100%' }}>
										<Stack spacing={1} direction="row" style={{ width: '100%' }}>
											<TextField
												select={true}
												variant='outlined'
												fullWidth={true}
												name={`fields.${index}.peca`}
												value={field.peca}
												style={{ width: '50%' }}
												size='small'
												onChange={ async (e:any) => {

													const { value } = e.target;
													const peca = await pecaChangeHandler( value );
													
													const valorQuantidade = getFieldProps( `fields.${index}.quantidade` ).value;
													setFieldValue( `fields.${index}.valor_unidade`, peca.valor_revenda, false );
													setFieldValue( `fields.${index}.valor_total`, (peca.valor_revenda * valorQuantidade).toFixed(2), false );
													

													handleChange(e);
												}}
											>
											{
												(Array.isArray(pecas) ? pecas.map(({id, nome })=> ([id, nome])) : Object.entries(pecas)).map(([key,value])=>
												{
													return (
														<MenuItem key={key} value={key}>
															{value}
														</MenuItem>
													)
												})
											}
											</TextField>
											<Field
												
												as={TextField}
												name={`fields.${index}.quantidade`}
												variant="outlined"
												label="Quantidade"
												value={field.quantidade}
												type="number"
												size='small'
												style={{ width: '20%' }}
												onChange=
												{
													(e:any) => {

														const { value } = e.target;
														const valorUnidade = getFieldProps( `fields.${index}.valor_unidade` ).value;

														setFieldValue( `fields.${index}.valor_total`, (valorUnidade * value).toFixed(2), false );
														handleChange(e);
												} }
											/>
											<Field as={TextField} style={{ width: '30%' }} name={`fields.${index}.valor_unidade`} variant="outlined" label="Valor Unitário" defaultValue="0" size='small' disabled/>
											<Field as={TextField} style={{ width: '30%' }} name={`fields.${index}.valor_total`} variant="outlined" label="Valor Total"  defaultValue="0"     size='small' disabled/>
										</Stack>
										<Stack spacing={2} direction="row" style={{ width: '10%' }}>
											{
												index <= 0 &&
												<Button	variant="outlined" style={{ width:'100%' }}	color="primary"	onClick={() => push( { peca: 0, quantidade: 0 } )}> <Add></Add> </Button>
											}
											{
												index > 0 &&
												<Button variant="outlined" style={{ width:'100%' }} color="secondary" onClick={() => remove(index)}><Delete></Delete></Button>
											}
										</Stack>
									</Stack>
								</div>
							))}
							
						</>
						)}
					</FieldArray>
					<FormGroup>
  						<FormControlLabel
							control=
							{
								<Switch
									name='fl_usar_endereco_cliente'
									onChange=
									{
										async (e:any)=>
										{
											const { checked } = e.target;
											setfl_usar_endereco_cliente( checked );
											handleChange(e);
										}
									}
									checked={values.fl_usar_endereco_cliente}
									value={values.fl_usar_endereco_cliente} />
							}
							label="Usar endereço do cadastro do cliente?"
						/>
					</FormGroup>
					<Button variant="contained" color="primary" type="submit">
						Enviar
					</Button>
					
				</Stack>
			</Form>
		)}
		</Formik>
	</div>
  );

};

export default PedidosForm;
