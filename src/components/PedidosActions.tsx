import { Box, Tooltip, IconButton, Alert, Snackbar } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

export const PedidosActions = ( params:any ) => {

	const history = useNavigate();
	const apiPrivate = useAxiosPrivate();

	const cancelPedidoHandler = async (params:any) =>
	{
		try
		{
			const response = await apiPrivate.get( '/app/cancelpedido', { params: { id: params.param.id } } );
			console.log( response.data );
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
			const response = await apiPrivate.get( '/app/concludepedido', { params: { id: params.param.id } } );
			console.log( response.data );
			history( 0 );
		}
		catch( error )
		{
			console.log( error );
		}


	}
	
	return(
		
		<Box>
			
			<Tooltip title='Concluir'>
				<IconButton onClick={ () => { concludePedidoHandler( params );  } } disabled={ params.param.row.ref_status != 2 }>
					<CheckIcon color={ params.param.row.ref_status == 2 ? 'success' : 'disabled' }/>
				</IconButton>			
			</Tooltip>
			<Tooltip title='Cancelar'>
				<IconButton onClick={ () => { cancelPedidoHandler( params ); } }  disabled={ params.param.row.ref_status != 2 } >
					<ClearIcon  color={ params.param.row.ref_status == 2 ? 'error' : 'disabled' }/>
				</IconButton>
			</Tooltip>
		</Box>
	);

};
