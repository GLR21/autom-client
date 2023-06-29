import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip } from '@mui/material';
import { PedidosActions } from './PedidosActions';
import { Link, useNavigate } from 'react-router-dom';
import { Add, Edit, ListAlt, Search } from '@mui/icons-material';
import { Form, Formik } from 'formik';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const PedidosList = () =>
{
	const [status,setStatus] = useState<any>([ { id: 0, nome: 'Selecione um status' }, { id: 1, nome: 'Cancelado' }, { id: 2, nome: 'Pendente' }, { id: 3, nome: 'Concluido' } ]);
	const [data, setData] = useState([]);
	const [pessoas,setPessoas] = useState<any>([ { id: 0, nome: 'Selecione um cliente' } ]);
	const apiPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const [dataAberturaSelecionada, setDataAberturaSelecionada] = useState(null);

	const getPedidos = async ( filter?:any ) =>
	{
		try
		{
			const response = await apiPrivate.get('/app/getpedidos', { params: filter } );	

			await Promise.all( response.data.map( async ( pedido:any ) =>
			{
				const responsePessoa = await apiPrivate.get(`/app/getpessoa/`, { params: { id: pedido.ref_pessoa } } );
				pedido.ref_pessoa = responsePessoa.data.nome;

				switch( pedido.status )
				{
					case 1:
						pedido.ref_status = pedido.status;
						pedido.status = 'Cancelado';
					break;
					case 2:
						pedido.ref_status = pedido.status;
						pedido.status = 'Pendente';
					break;
					case 3:
						pedido.ref_status = pedido.status;
						pedido.status = 'Concluído';
					break;
				}

				pedido.dt_abertura = new Date(pedido.dt_abertura).toLocaleDateString('pt-BR');
				pedido.dt_cancelamento = ( pedido.dt_cancelamento != null ? new Date(pedido.dt_cancelamento).toLocaleDateString('pt-BR') : '' );
				pedido.dt_encerramento = ( pedido.dt_encerramento != null ? new Date(pedido.dt_encerramento).toLocaleDateString('pt-BR') : '' );
				pedido.dt_reabertura   = ( pedido.dt_reabertura   != null ? new Date(pedido.dt_reabertura).toLocaleDateString('pt-BR')   : '' );

			}));
			
			setData(response.data);
		}
		catch (error)
		{
			console.log(error);
		}
		
	}

	const getPessoas = async () => {

		try
		{
			const response = await apiPrivate.get('http://localhost:8080/app/getpessoas');

			let pessoasLoad = [ { id: 0, nome: 'Selecione um cliente' } ];

			response.data.map( (pessoa:any) => { pessoasLoad.push( { id: pessoa.id, nome: pessoa.nome } ) });
			setPessoas(pessoasLoad);
		}
		catch( error )
		{
			console.log(error);
		}
	}

	const getPedidosCSV = async ( filter?:any ) =>
	{
		try
		{
			const response = await apiPrivate.get('/app/getpedidoscsv', { params: filter } );
			const url = window.URL.createObjectURL( new Blob([arrayToCSV(response.data)], { type: 'text/csv' } ) );
			const link = document.createElement('a');
			link.href = url;
			let date = new Date();
			let fileName = `pedidos_${date.getFullYear() }_${ date.getMonth() }_${ date.getDay() }_${ date.getHours() }_${date.getMinutes()}.csv`;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
		catch (error)
		{
			console.log(error);
		}

	}

	const arrayToCSV = ( array:any ) =>	
	{

		let csvRows = [];
		let headerValues = Object.keys(array[0]);
		let headerString = headerValues.join(';');
		console.log(headerString);
		csvRows.push(headerString);

		array.forEach( (item:any) =>
		{
			let rowValues = Object.values(item);
			let rowString = rowValues.join(';');
			csvRows.push(rowString);
		});
		

		let csvString = csvRows.join('\n');

		return csvString;
	}

	useEffect( () => { getPedidos(); getPessoas()  }, [] );

	const columns: GridColDef[] =
	[	
		{
			field: 'editAction',
			headerName: '',
			type: 'actions',
			width: 50,
			renderCell: ( param:any ) =>
			<Box>
				<Tooltip title='Editar'>
					<span>
						<IconButton disabled={ param.row.ref_status != 2 } onClick={ () => navigate( `/updatePedido/${param.id}` ) } >
							<Edit color={ param.row.ref_status == 2 ? 'success': 'disabled' } />
						</IconButton>			
					</span>
				</Tooltip>
			</Box>,

		},
		{ field: 'id', headerName: 'Código', width: 80 },
		{ field: 'pessoa', headerName: 'Cliente', width: 200},
		{ field: 'total', headerName: 'Total', width: 100  },
		{ field: 'status', headerName: 'Status', width: 100 },
		{ field: 'fl_usar_endereco_cliente', headerName: 'Usar endereço do cliente', width: 180 },
		{ field: 'dt_abertura', headerName: 'Data de abertura', width: 130 },
		{ field: 'dt_reabertura', headerName: 'Data de reabertura', width: 145 },
		{ field: 'dt_encerramento', headerName: 'Data de conclusão', width: 145 },
		{ field: 'dt_cancelamento', headerName: 'Data de cancelamento', width: 170 },
		{ field: 'action', headerName: '', type: 'actions', width: 100, renderCell: ( param:any ) => <PedidosActions{...{ param }}/>, sortable: false }
	];

	const rows = data.map( ( pedido:any ) =>
	(
		{
			id: pedido.id,
			pessoa: pedido.ref_pessoa,
			total: `R$`+pedido.total,
			ref_status: pedido.ref_status,
			status: pedido.status,
			fl_usar_endereco_cliente:  ( pedido.fl_usar_endereco_cliente ? 'Sim': 'Não' ) ,
			dt_abertura: pedido.dt_abertura,
			dt_cancelamento: pedido.dt_cancelamento,
			dt_encerramento: pedido.dt_encerramento,
			dt_reabertura: pedido.dt_reabertura

		}
	));

	return(
		<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
			<Stack spacing={2} direction={"column"} style={{ width: '80%' }} >
				<Formik
					initialValues={{}}
					onSubmit={ async ( values, form ) =>
					{
						await getPedidos( values );
					}}
				>
					{
						({ values, handleChange, setFieldValue, getFieldProps }) => 
						(
							<Form
								style={{ width: '100%' }}
							>
								<Stack spacing={2} direction={"column"} style={{ width: '100%' }} >
									<Stack spacing={2} direction={"row"} style={{ width: '100%', justifyContent: 'center' }} >
										<TextField
											variant='outlined'
											name='id'
											size='small'
											onChange={handleChange}
											style={{ width: '20%' }}	
											label='Código do pedido'
										>
										
										</TextField>
										<TextField
											variant='outlined'
											name='ref_pessoa'
											size='small'
											onChange={handleChange}
											style={{ width: '45%' }}	
											label='Cliente'
											select={true}
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
											variant='outlined'
											name='status'
											size='small'
											onChange={handleChange}
											style={{ width: '20%' }}	
											label='Status'
											select={true}
										>
											{
												(Array.isArray(status) ? status.map(({id, nome })=> ([id, nome])) : Object.entries(status)).map(([key,value])=>
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
											name='fl_usar_endereco_cliente'
											size='small'
											onChange={handleChange}
											style={{ width: '15%' }}
											label='Usar endereço do cliente'
											select={true}
										>
											<MenuItem value={''}>Todos</MenuItem>
											<MenuItem value={1}>Sim</MenuItem>
											<MenuItem value={0}>Não</MenuItem>
										</TextField>
									</Stack>
									<Stack spacing={2} direction={"row"} style={{ width: '100%', justifyContent: 'center' }} >
										<TextField
											variant='outlined'
											name='dt_abertura_inicial'
											size='small'
											onChange={handleChange}
											style={{ width: '15%' }}
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
											style={{ width: '15%' }}
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
											style={{ width: '15%' }}
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
											style={{ width: '15%' }}
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
											style={{ width: '20%' }}
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
											style={{ width: '20%' }}
											label='Data de cancelamento final'
											type='date'
											InputLabelProps={{ shrink: true }}
										>
										</TextField>
											
									</Stack>
									<Stack spacing={2} direction={"row-reverse"} style={{ width: '100%' }}>
										<Button variant="contained"  color="success" style={{width:'5%'}} title='Buscar' type="submit" >
											<Search />
										</Button>
										<Button variant="contained" color="primary"  style={{width:'5%'}} title='Cadastrar' onClick={ (e:any)=>{navigate('/createPedido')} } type="button" >
											<Add />
										</Button>
										<Button variant="contained" color="warning"  style={{width:'5%'}} title='Exportar CSV' onClick={ async( e:any )=> {  await getPedidosCSV( values );  } } type="button">
											<ListAlt />
										</Button>
									</Stack>
								</Stack>
							</Form>
						)
					}
				</Formik>
				<Box sx={{ height: 400, width: '100%',  }}>
					<DataGrid disableColumnFilter disableColumnSelector disableColumnMenu rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
				</Box>
			</Stack>
		</div>
	)
}