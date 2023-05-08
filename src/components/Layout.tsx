import { Outlet } from "react-router-dom";
import { NavbarComponent } from "./NavbarComponent";

export const Layout = () => {
	return (	
		<main className="App">
			<NavbarComponent/>
			<Outlet/>
		</main>
	);
}