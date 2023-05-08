import { Settings } from "@mui/icons-material"
import { IconButton } from "@mui/material"

export const AutomIcon = () => {

	const styles = {
		color: '#a4a4b4'
		
	}

	return (
		<IconButton size='large' style={ styles } disabled>
			<Settings fontSize="large"/>
		</IconButton>
		
	)


}