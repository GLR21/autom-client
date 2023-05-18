import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box } from '@mui/material';
import { EstadoActions } from './EstadoActions';

export const PecasList = () =>
{
	const [data, setData] = useState([]);
	const apiPrivate = useAxiosPrivate();

	const getPecas = async () =>
	{
		await apiPrivate.get('/app/getpecas').then( (response:any) => { setData(response.data) } ).catch( (error:any) => { console.log(error) } );
	}

	useEffect( () => { getPecas(); }, [] );

	const columns: GridColDef[] =
	[
		{ field: 'id', headerName: 'Código', width: 130    },
		{ field: 'nome', headerName: 'Nome', width: 130    },
		{ field: 'descricao', headerName: 'Descricao', width: 130  },
		{ field: 'valor_compra', headerName: 'Valor de compra', width: 130 },
		{ field: 'valor_revenda', headerName: 'Valor de compra', width: 130 },
		
		// { field: 'action', headerName: '', type: 'actions', width: 130, renderCell: ( param:any ) => <EstadoActions{...{ param }}/> }
	];

	const rows = data.map( ( peca:any ) => ( { id: peca.id, nome: peca.nome, descricao: peca.descricao, valor_compra: 'R$'+peca.valor_compra, valor_revenda: 'R$'+peca.valor_revenda  } ) );

	return(
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid  rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
		</Box>
	)
}