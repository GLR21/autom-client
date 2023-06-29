
import Button from '@mui/material/Button';
import { Field, Form, Formik } from 'formik';
import { GenericField } from './GenericField';
import { estadoSchema } from '../schemas/Estado.schema';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MenuItem, Stack, TextField } from '@mui/material';

interface Values
{
	
	ref_pessoa: number;
	ref_pedido: number;
}

export const PedidosReport = () => {

	const history = useNavigate();
	const [initialValues, setInitialValues] = useState<any>( { ref_pessoa: 0, ref_peca: 0 } );
	const [pecas,setPecas] = useState<any>([ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 }]);
	const [pessoas,setPessoas] = useState<any>([ { id: 0, nome: 'Selecione uma pessoa' } ]);	
	const apiPrivate = useAxiosPrivate();

	const getPecas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpecas');

			let pecasLoad = [ { id: 0, nome: 'Selecione uma peça', valor_unidade: 0 } ];

			response.data.map( (peca:any) => { pecasLoad.push( { id: peca.id, nome: peca.nome, valor_unidade: peca.valor_compra } ) });
			setPecas(pecasLoad);
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

	useEffect( () => {   getPecas(); getPessoas();  }, [] );

	return (
			<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
				<h1>Relatório de Pedidos</h1>
			<Formik
				initialValues={initialValues}
				enableReinitialize={true}
				onSubmit=
				{
					async (values,actions)=>
					{
						try
						{
							// let data = { ref_pessoa: ( values.ref_pessoa == 0 ? null: values.ref_pessoa ), ref_peca: ( values.ref_peca == 0 ? null : values.ref_peca ), ref_report: 'RelatorioPedidos' };
							values.ref_report = 'RelatorioPedidos';
							const response = await apiPrivate.post('http://localhost:8080/app/reports',  values );
							
							const date = new Date();

							const aTag = document.createElement('a');
							aTag.href =`data:application/pdf;base64,${response.data}`;
							aTag.download = `RelatorioPedidos_${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.pdf`;
							aTag.click();

						}
						catch( error )
						{
							console.log(error);
						}
					}
				}
			>
					{
						({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) =>
						(

							<Form
								style={{ width: '30%' }}
							>
								<Stack spacing={2} direction="column" style={{ width: '100%' }} >
									<TextField 
										select={true}
										variant='outlined'
										name='ref_pessoa'
										onChange={handleChange}
										size='small'
										value={values.ref_pessoa}
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
									<TextField 
										select={true}
										variant='outlined'
										name='ref_peca'
										onChange={handleChange}
										size='small'
										value={values.ref_peca}
										InputLabelProps={{ shrink: true }}
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
									<TextField
										variant='outlined'
										name='dt_abertura_inicial'
										size='small'
										onChange={handleChange}
										label='Data de abertura inicial'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
									<TextField
										variant='outlined'
										name='dt_abertura_final'
										size='small'
										onChange={handleChange}
										label='Data de abertura final'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
									<TextField
										variant='outlined'
										name='dt_encerramento_inicial'
										size='small'
										onChange={handleChange}
										label='Data de conclusão inicial'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
									<TextField
										variant='outlined'
										name='dt_encerramento_final'
										size='small'
										onChange={handleChange}
										label='Data de conclusão final'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
									<TextField
										variant='outlined'
										name='dt_cancelamento_inicial'
										size='small'
										onChange={handleChange}
										label='Data de cancelamento inicial'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
									<TextField
										variant='outlined'
										name='dt_cancelamento_final'
										size='small'
										onChange={handleChange}
										label='Data de cancelamento final'
										type='date'
										InputLabelProps={{ shrink: true }}
									>
									</TextField>
								</Stack>
								<Button style={{ marginLeft: '25%', display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '50%', marginTop:'20px', height:'100%' }} type='submit' variant='contained' color='success' size='small'  disabled={isSubmitting} >Gerar</Button>
							</Form>
						)
						
					}
				</Formik>
			</div>
			);
}
