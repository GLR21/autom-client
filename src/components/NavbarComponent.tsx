import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Menu, MenuItem, Modal, Box } from '@mui/material';
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
	const [anchorPecas, setAnchorPecas] = useState<null | HTMLElement>(null);
	const [anchorPedidos, setAnchorPedidos] = useState<null | HTMLElement>(null);
	const [anchorRelatorios, setAnchorRelatorios] = useState<null | HTMLElement>(null);
	const [modalRelatorioPedidosOpen, setModalRelatorioPedidosOpen] = useState(false);
	
	const openEstados = Boolean(anchorEstados);
	const openPessoas = Boolean(anchorPessoas);
	const openPecas = Boolean(anchorPecas);
	const openPedidos = Boolean(anchorPedidos);
	const openRelatorios = Boolean(anchorRelatorios);

	const handleClickEstados = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEstados(event.currentTarget);
	}

	const handleClickPessoas = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorPessoas(event.currentTarget);
	}

	const handleClickPecas = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorPecas(event.currentTarget);
	}

	const handleClickPedidos = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorPedidos(event.currentTarget);
	}

	const handleClickRelatorios = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorRelatorios(event.currentTarget);
	}

	const handleModalRelatorioPedidosOpen = () => {
		setModalRelatorioPedidosOpen(true);
	}
	
	const handleClosePessoas = () => {
		setAnchorPessoas(null);
	}

	const handleCloseEstados = () => {
		
		setAnchorEstados(null);
	}

	const handleClosePecas = () => {
		setAnchorPecas(null);
	}

	const handleClosePedidos = () => {
		setAnchorPedidos(null);
	}

	const handleCloseRelatorios = () => {
		setAnchorRelatorios(null);
	}

	const handleCloseModalRelatorioPedidos = () => {
		setModalRelatorioPedidosOpen(false);
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
								id='reports-button'
								onClick={handleClickRelatorios}
								aria-control={ openRelatorios  ? 'reports-menu' : undefined }
								aria-aria-haspopup='true'
								aria-expanded={ openRelatorios ? 'true' : undefined}
							>
								Relatórios
							</Button>
					}
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
								id='pecas-button'
								onClick={handleClickPecas}
								aria-control={ openPecas  ? 'pecas-menu' : undefined }
								aria-aria-haspopup='true'
								aria-expanded={ openPecas ? 'true' : undefined}
							>
								Peças
							</Button>
					}
					{
						typeof signed?.accessToken != 'undefined' &&
							<Button
								color='inherit'
								id='pedidos-button'
								onClick={handleClickPedidos}
								aria-control={ openPedidos  ? 'pedidos-menu' : undefined }
								aria-aria-haspopup='true'
								aria-expanded={ openPedidos ? 'true' : undefined}
							>
								Pedidos
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
				<Menu
					id='pecas-menu'
					anchorEl={anchorPecas}
					open={openPecas}
					MenuListProps={{ "aria-labelledby": 'pecas-button' }}
					onClose={handleClosePecas}

				>
					{/* <MenuItem  onClick={handleClosePecas}>
						<Link to='/createPeca' color='inherit'>Cadastro de peças</Link>
					</MenuItem> */}
					<MenuItem onClick={handleClosePecas} >
						<Link to='/pecasList' color='inherit'>Lista de peças</Link>
					</MenuItem>
				</Menu>
				<Menu
					id='pedidos-menu'
					anchorEl={anchorPedidos}
					open={openPedidos}
					MenuListProps={{ "aria-labelledby": 'pedidos-button' }}
					onClose={handleClosePedidos}
				>
					<MenuItem  onClick={handleClosePedidos}>
						<Link to='/createPedido' color='inherit'>Cadastro de pedidos</Link>
					</MenuItem>
					<MenuItem onClick={handleClosePedidos} >
						<Link to='/pedidosList' color='inherit'>Lista de pedidos</Link>
					</MenuItem>
				</Menu>	
				<Menu
					id='reports-menu'
					anchorEl={anchorRelatorios}
					open={openRelatorios}
					MenuListProps={{ "aria-labelledby": 'reports-button' }}
					onClose={handleCloseRelatorios}
				>
					<MenuItem onClick={handleCloseRelatorios}>
						<Link to='/pedidosReport' color='inherit'>Relatório de pedidos</Link>
						
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	)
}