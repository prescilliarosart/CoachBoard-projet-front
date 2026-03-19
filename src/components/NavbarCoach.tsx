import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function NavbarCoach() {
	const navigate = useNavigate();
	return (
		<AppBar
			sx={{
				background: "rgba(11, 21, 32, 0.9)",
				backdropFilter: "blur(16px)",
				borderBottom: "1px solid rgba(34, 197, 94, 0.13)",
			}}
		>
			<Toolbar sx={{ alignItems: "center" }}>
				<Typography
					variant="h6"
					component="div"
					sx={{
						color: "#fff",
						fontStyle: "italic",
						fontSize: "1.1rem",
						fontWeight: 700,
						letterSpacing: "0.04em",
						fontFamily: "'Barlow Condensed', sans-serif",
					}}
				>
					Julien Marchal · Coach Sportif
				</Typography>
				<Button
					onClick={() => navigate("/programmes")}
					sx={{
						color: "#7a8fa6",
						position: "relative",
						padding: 0,
						"&:hover": { color: "#22c55e" },
						marginLeft: "60px",
						fontSize: "0.88rem",
						fontWeight: 500,
						"&::after": {
							content: '""',
							position: "absolute",
							left: 0,
							bottom: "-3px",
							width: 0,
							height: "1.5px",
							background: "#22c55e",
							transition: "width 0.25s",
						},
						"&:hover::after": {
							width: "100%",
						},
					}}
				>
					Programmes
				</Button>
				<Button
					onClick={() => navigate("/eleves")}
					sx={{
						color: "#7a8fa6",
						position: "relative",
						padding: 0,
						"&:hover": { color: "#22c55e" },
						marginLeft: "60px",
						fontSize: "0.88rem",
						fontWeight: 500,
						"&::after": {
							content: '""',
							position: "absolute",
							left: 0,
							bottom: "-3px",
							width: 0,
							height: "1.5px",
							background: "#22c55e",
							transition: "width 0.25s",
						},
						"&:hover::after": {
							width: "100%",
						},
					}}
				>
					Elèves
				</Button>
				<Button
					onClick={() => navigate("/progression")}
					sx={{
						color: "#7a8fa6",
						position: "relative",
						padding: 0,
						"&:hover": { color: "#22c55e" },
						marginLeft: "60px",
						fontSize: "0.88rem",
						fontWeight: 500,
						"&::after": {
							content: '""',
							position: "absolute",
							left: 0,
							bottom: "-3px",
							width: 0,
							height: "1.5px",
							background: "#22c55e",
							transition: "width 0.25s",
						},
						"&:hover::after": {
							width: "100%",
						},
					}}
				>
					Progression
				</Button>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					onClick={() => navigate("/profil")}
					sx={{
						color: "#22c55e",
						"&:hover": { background: "#22c55e", color: "#0b1520" },
						fontStyle: "italic",
						fontSize: "0.92rem",
						fontWeight: 700,
						border: "1.5px solid #22c55e",
						borderRadius: "4px",
					}}
				>
					Mon profil - Coach
				</Button>
			</Toolbar>
		</AppBar>
	);
}
