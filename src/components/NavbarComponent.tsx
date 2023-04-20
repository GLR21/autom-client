import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Menu, MenuItem, Link } from '@mui/material';
import CatchingPokemon from '@mui/icons-material/CatchingPokemon';
import { useState } from 'react';
import './NavbarComponent.css';

export const NavbarComponent = () => 
{

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

	return (
		<AppBar position="static">
			<Toolbar className='navbar'>
				<IconButton	size='large' edge='start' color='inherit' aria-label='logo'>
					<CatchingPokemon/>
				</IconButton>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					Autom
				</Typography>
				<Stack direction='row' spacing={2}>
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
					<Button color='inherit'>Login</Button>
				</Stack>
				<Menu
					id='estado-menu'
					anchorEl={anchorEstados}
					open={openEstados}
					MenuListProps={{ "aria-labelledby": 'estados-button' }}
					onClose={handleCloseEstados}
				>
					<MenuItem  onClick={handleCloseEstados}>
						<Link href='/createEstado' color='inherit' underline='none'>Cadastro de estados</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseEstados} >
						<Link href='/estadosList' color='inherit' underline='none'>Lista de estados</Link>
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
						<Link href='/createPessoa' color='inherit' underline='none'>Cadastro de pessoas</Link>
					</MenuItem>
					<MenuItem onClick={handleClosePessoas} >
						<Link href='/pessoasList' color='inherit' underline='none'>Lista de pessoas</Link>
					</MenuItem>
				</Menu>		
			</Toolbar>
		</AppBar>
	)
}