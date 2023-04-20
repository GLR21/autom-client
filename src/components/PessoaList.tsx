import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link, useHistory } from 'react-router-dom';

export const PessoaList = () =>
{
	const [data, setData] = useState([]);
	const history = useHistory();
	const getPessoas = async () =>
	{
		await axios.get
		(
			'http://localhost:8080/app/getpessoas'
		)
			.then
			(
				(response) =>
				{
					setData(response.data)
				}
			)
			.catch( (error) => { console.log(error) } );
	}

	const deleteHandler = async (params:any) =>
	{
		await axios.delete
		(
			'http://localhost:8080/app/deletepessoa',
			{ params: { id : params.id } }
		)
		.then
			(
				(response)=>
				{ 
					history.go(0);
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
							<IconButton onClick={ () => { deleteHandler( params ) } }>
								<Delete color='error'/>
							</IconButton>
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