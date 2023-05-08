import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import CatchingPokemon from '@mui/icons-material/CatchingPokemon';
import { useState } from 'react';
import './NavbarComponent.css';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AutomIcon } from './AutomIcon';

export const NavbarComponent = () => 
{

	//@ts-ignore
	const { signed } = useAuth();
	const logout = useLogout();
	const navigate = useNavigate();

 	const [anchorEstados, setAnchorEstados] = useState<null | HTMLElement>(null);
	const [anchorPessoas, setAnchorPessoas] = useState<null | HTMLElement>(null);
	
	const openEstados = Boolean(anchorEstados);
	const openPessoas = Boolean(anchorPessoas);

	const handleClickEstados = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEstados(event.currentTarget);
	}

	const handleClickPessoas = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorPessoas(event.currentTarget);
	}

	const handleClosePessoas = () => {
		setAnchorPessoas(null);
	}

	const handleCloseEstados = () => {
		
		setAnchorEstados(null);
	}

	const signOut = async () => {
		try
		{
			await logout();
		}
		catch(error)
		{
			console.log(error);
		}
		finally
		{
			navigate('/login');
		}
	}	
	return (
		
		<AppBar position="static">
			<Toolbar className='navbar'>
				<AutomIcon/>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					Autom
				</Typography>
				<Stack direction='row' spacing={2}>
				
					{ 
						typeof signed?.accessToken != 'undefined' &&
							<Button
								color='inherit'
								id='pessoas-button'
								onClick={handleClickPessoas}
								aria-control={ openPessoas? 'pessoas-menu' : undefined } 
								aria-aria-haspopup='true'
								aria-expanded={ openPessoas ? 'true' : undefined}
							>
								Pessoas
							</Button>  
			  		}	
					{
						typeof signed?.accessToken != 'undefined' &&

							<Button 
								color='inherit'
								id='estados-button'
								onClick={handleClickEstados}
								aria-control={ openEstados  ? 'estados-menu' : undefined } 
								aria-aria-haspopup='true'
								aria-expanded={ openEstados ? 'true' : undefined}
							>
								Estados
							</Button>
					}
					
					{
						typeof signed?.accessToken != 'undefined' &&
							<Button
								color='inherit'
								onClick={signOut}
						
							>
								Logout
							</Button>
					}
				</Stack>
				<Menu
					id='estado-menu'
					anchorEl={anchorEstados}
					open={openEstados}
					MenuListProps={{ "aria-labelledby": 'estados-button' }}
					onClose={handleCloseEstados}
				>
					<MenuItem  onClick={handleCloseEstados}>
						<Link to='/createEstado' color='inherit'>Cadastro de estados</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseEstados} >
						<Link to='/estadosList' color='inherit'>Lista de estados</Link>
					</MenuItem>
				</Menu>
				<Menu
					id='pessoas-menu'
					anchorEl={anchorPessoas}
					open={openPessoas}
					MenuListProps={{ "aria-labelledby": 'pessoas-button' }}
					onClose={handleClosePessoas}
				>
					<MenuItem  onClick={handleClosePessoas}>
						<Link to='/createPessoa' color='inherit'>Cadastro de pessoas</Link>
					</MenuItem>
					<MenuItem onClick={handleClosePessoas} >
						<Link to='/pessoasList' color='inherit'>Lista de pessoas</Link>
					</MenuItem>
				</Menu>	
			</Toolbar>
		</AppBar>
	)
}