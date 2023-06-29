import { Box, Tooltip, IconButton, Alert, Snackbar } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import LockOpenIcon from '@mui/icons-material/LockOpen';


export const PedidosActions = ( params:any ) => {

	const history = useNavigate();
	const apiPrivate = useAxiosPrivate();

	const PEDIDO_STATUS_CONCLUDED 	= 1;
	const PEDIDO_STATUS_OPEN 		= 2;
	const PEDIDO_STATUS_CANCELED 	= 3;
	
	const cancelPedidoHandler = async (params:any) =>
	{
		try
		{
			const response = await apiPrivate.put( '/app/cancelpedido', { params: { id: params.param.id } } );
			history( 0 );
		}
		catch( error )
		{
			console.log( error );
		}


	}
	
	const concludePedidoHandler = async (params:any) =>
	{
		try
		{
			const response = await apiPrivate.put( '/app/concludepedido', { params: { id: params.param.id } } );
			history( 0 );
		}
		catch( error )
		{
			console.log( error );
		}


	}

	const openPedidoHandler = async (params:any) =>
	{
		try
		{
			const response = await apiPrivate.put( '/app/openpedido', { params: { id: params.param.id } } );
			history( 0 );
		}
		catch( error )
		{
			console.log( error );
		}
	}

	let ref_status = params.param.row.ref_status;
	
	return(
		
		
		<Box>
			<Tooltip title='Concluir'>
				<span>
					<IconButton onClick={ () => { concludePedidoHandler( params );  } } disabled={ ref_status != PEDIDO_STATUS_OPEN }>
						<CheckIcon color={ ref_status == PEDIDO_STATUS_OPEN ? 'success' : 'disabled' }/>
					</IconButton>			
				</span>
			</Tooltip>
			<Tooltip title='Abrir'>
				<span>
					<IconButton onClick={ () => { openPedidoHandler( params ) } } disabled={ ref_status == PEDIDO_STATUS_OPEN } >
						<LockOpenIcon color={ ref_status != PEDIDO_STATUS_OPEN ? 'warning' : 'disabled' }/>
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title='Cancelar'>
				<span>
					<IconButton onClick={ () => { cancelPedidoHandler( params ); } }  disabled={ ref_status != PEDIDO_STATUS_OPEN } >
						<ClearIcon  color={ ref_status == PEDIDO_STATUS_OPEN ? 'error' : 'disabled' }/>
					</IconButton>
				</span>
			</Tooltip>
		</Box>
	);

};
