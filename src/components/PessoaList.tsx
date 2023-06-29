import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Tooltip, IconButton, Stack, TextField, MenuItem, Button } from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { Form, Formik } from 'formik';

export const PessoaList = () =>
{
	//@ts-ignore
	const { signed } = useAuth();
	const [data, setData] = useState([]);
	const apiPrivate = useAxiosPrivate();
	const history = useNavigate();
	
	const getPessoas = async ( filter?:any ) =>
	{
		
		try
		{
			const response = await apiPrivate.get('/app/getpessoas', { params: filter });

			await Promise.all( response.data.map( async ( pessoa:any ) =>
			{
				const respondeCidade = await apiPrivate.get(`/app/getcidade`, { params: { id: pessoa.ref_cidade } } );
				pessoa.ref_cidade = respondeCidade.data.nome;

			}));

			setData(response.data);
		}
		catch (error)
		{
			console.log(error);
		}
	}

	const deleteHandler = async (params:any) =>
	{
		await apiPrivate.delete
		(
			'http://localhost:8080/app/deletepessoa',
			{ params: { id : params.id } }
		)
		.then
			(
				(response)=>
				{ 
					history(0)
				}
			)
			.catch( (error) => { console.log( error ) } );
	}

	useEffect( () => { getPessoas(); }, [] );

	const columns: GridColDef[] =
	[
		{ field: 'id', headerName: 'Código', width: 80    },
		{ field: 'nome', headerName: 'Nome', width: 180    },
		{ field: 'email', headerName: 'E-mail', width: 250  },
		{ field: 'telefone', headerName: 'Telefone', width: 130 },
		{ field: 'cep', headerName: 'CEP', width: 130 },
		{ field: 'rua', headerName: 'Rua', width: 200 },
		{ field: 'bairro', headerName: 'Bairro', width: 200 },
		{ field: 'numero_endereco', headerName: 'Número', width: 130 },
		{ field: 'ref_cidade', headerName: 'Cidade', width: 130 },
		{
			field: 'editAction',
			headerName: '',
			sortable: false,
			renderCell: (params) =>
			{
				return(
					<Box>
						<Tooltip title='Editar'>
							<Link to={`/updatePessoa/${params.id}`}>
								<IconButton>
									<Edit color='success'/>
								</IconButton>			
							</Link>
						</Tooltip>
						<Tooltip title='Excluir'>
							<span>
								<IconButton onClick={ () => { deleteHandler( params ) } } disabled={ params.id == signed.pessoa_id }>
									<Delete color={ params.id == signed.pessoa_id ? 'disabled' : 'error' }/>
								</IconButton>
							</span>
						</Tooltip>
					</Box>
				)
			}
		}
		
	];

	const rows = data.map( ( pessoa:any ) => ( { id: pessoa.id, nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone, cep: pessoa.cep, rua:pessoa.rua, bairro:pessoa.bairro, numero_endereco: pessoa.numero_endereco, ref_cidade: pessoa.ref_cidade } ) );

	return(
		<div style={{display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop:'100px', height:'100%' }} >
			<Stack spacing={2} direction={"column"} style={{ width: '80%' }} >
			<Formik
					initialValues={{}}
					onSubmit={ async ( values, form ) =>
					{
						await getPessoas( values );
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
											style={{ width: '10%' }}	
											label='Código'
										>
										
										</TextField>
										<TextField
											variant='outlined'
											name='nome'
											size='small'
											onChange={handleChange}
											style={{ width: '20%' }}
											label='Nome'
										>
										</TextField>
										<TextField
											variant='outlined'
											name='email'
											size='small'
											onChange={handleChange}
											style={{ width: '20%' }}
											label='E-mail'
										>
										</TextField>
									</Stack>
									<Stack spacing={2} direction={"row"} style={{ width: '100%', justifyContent: 'center' }} >
										<TextField
												variant='outlined'
												name='cep'
												size='small'
												onChange={handleChange}
												style={{ width: '10%' }}
												label='CEP'
											>
											</TextField>
											<TextField
												variant='outlined'
												name='rua'
												size='small'
												onChange={handleChange}
												style={{ width: '20%' }}
												label='Rua'
											>
											</TextField>
											<TextField
												variant='outlined'
												name='bairro'
												size='small'
												onChange={handleChange}
												style={{ width: '20%' }}
												label='Bairro'
											>
											</TextField>
									</Stack>
									{/* <Stack spacing={2} direction={"row"} style={{ width: '100%' }} >
										<TextField
											variant='outlined'
											name='numero_endereco'
											size='small'
											onChange={handleChange}
											style={{ width: '10%' }}
											label='Número'
										>
										</TextField>
										
									</Stack> */}
									<Stack spacing={2} direction={"row-reverse"} style={{ width: '100%' }}>
										<Button variant="contained"  color="success" style={{width:'5%'}} title='Buscar' type="submit" >
											<Search />
										</Button>
										<Button variant="contained" color="primary"  style={{width:'5%'}} title='Cadastrar' onClick={ (e:any)=>{history('/createPessoa')} } type="button" >
											<Add />
										</Button>
									</Stack>
								</Stack>
							</Form>
						)
					}
				</Formik>
				<Box sx={{ height: 400, width: '100%' }}>
					<DataGrid disableColumnFilter disableColumnSelector disableColumnMenu rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
				</Box>
			</Stack>
		</div>
	)
}