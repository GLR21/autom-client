import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box } from '@mui/material';
import { EstadoActions } from './EstadoActions';
import { PedidosActions } from './PedidosActions';


export const PedidosList = () =>
{
	const [data, setData] = useState([]);
	const apiPrivate = useAxiosPrivate();

	const getPedidos = async () =>
	{
		try
		{
			const response = await apiPrivate.get('/app/getpedidos');

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

			}));

			setData(response.data);
		}
		catch (error)
		{
			console.log(error);
		}
		
	}

	useEffect( () => { getPedidos(); }, [] );

	const columns: GridColDef[] =
	[
		{ field: 'id', headerName: 'Código', width: 130    },
		{ field: 'pessoa', headerName: 'Cliente', width: 130    },
		{ field: 'total', headerName: 'Total', width: 130  },
		{ field: 'status', headerName: 'Status', width: 130 },
		{ field: 'action', headerName: '', type: 'actions', width: 130, renderCell: ( param:any ) => <PedidosActions{...{ param }}/> }
	];

	const rows = data.map( ( pedido:any ) => ( { id: pedido.id, pessoa: pedido.ref_pessoa, total: `R$`+pedido.total, ref_status: pedido.ref_status,  status: pedido.status  } ) );

	return(
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid  rows={rows} rowSelection={false} getRowId={row=>row.id} columns={columns} pageSizeOptions={[10]} autoPageSize/>
		</Box>
	)
}