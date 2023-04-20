import { Delete, Edit } from '@mui/icons-material';
import { Box, Tooltip, IconButton, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

export const EstadoActions = ( params:any ) => {

	const history = useHistory();

	const deleteHandler = async (params:any) =>
	{

		await axios.delete('http://localhost:8080/app/deleteestado', { params: { id : params.param.id } } ).then( (response)=>{ updateHandler('/estadosList');  } ).catch( (error) => { console.log( error ) } );
	}	

	const updateHandler = (location:any) =>
	{
		history.go(0);
	}
	
	
	return(
		
		<Box>
			<Tooltip title='Editar'>
				<Link to={`/updateEstado/${params.param.id}`}>
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
	);

};
