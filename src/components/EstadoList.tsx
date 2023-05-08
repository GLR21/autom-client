import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box } from '@mui/material';
import { EstadoActions } from './EstadoActions';

export const EstadoList = () =>
{
	const [data, setData] = useState([]);
	const apiPrivate = useAxiosPrivate();

	const getEstados = async () =>
	{
		await apiPrivate.get('/app/getestados').then( (response:any) => { setData(response.data) } ).catch( (error:any) => { console.log(error) } );
	}

	useEffect( () => { getEstados(); }, [] );

	const columns: GridColDef[] =
	[
		{ field: 'id', headerName: 'Código', width: 130    },
		{ field: 'nome', headerName: 'Nome', width: 130    },
		{ field: 'sigla', headerName: 'Sigla', width: 130  },
		{ field: 'cod_ibge', headerName: 'Código IBGE', width: 130 },
		{ field: 'action', headerName: '', type: 'actions', width: 130, renderCell: ( param:any ) => <EstadoActions{...{ param }}/> }
	];

	const rows = data.map( ( estado:any ) => ( { id: estado.id, nome: estado.nome, sigla: estado.sigla, cod_ibge: estado.cod_ibge  } ) );

	return(
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid  rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
		</Box>
	)
}