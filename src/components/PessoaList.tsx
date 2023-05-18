import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

export const PessoaList = () =>
{
	//@ts-ignore
	const { signed } = useAuth();
	const [data, setData] = useState([]);
	const apiPrivate = useAxiosPrivate();
	const history = useNavigate();
	
	const getPessoas = async () =>
	{
		
		try
		{
			const response = await apiPrivate.get('/app/getpessoas');

			await Promise.all( response.data.map( async ( pessoa:any ) =>
			{
				console.log( pessoa );
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
		{ field: 'id', headerName: 'Código', width: 100    },
		{ field: 'nome', headerName: 'Nome', width: 180    },
		{ field: 'email', headerName: 'E-mail', width: 250  },
		{ field: 'telefone', headerName: 'Telefone', width: 130 },
		{ field: 'cep', headerName: 'CEP', width: 130 },
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

	const rows = data.map( ( pessoa:any ) => ( { id: pessoa.id, nome: pessoa.nome, email: pessoa.email, telefone: pessoa.telefone, cep: pessoa.cep, ref_cidade: pessoa.ref_cidade } ) );

	return(
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid  rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
		</Box>
	)
}