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
						"&:hover": { color: "#22c55e" },
						marginLeft: "60px",
						fontSize: "0.88rem",
						fontWeight: 500,
					}}
				>
					Programmes
				</Button>
				<Button
					onClick={() => navigate("/eleves")}
					sx={{
						color: "#7a8fa6",
						"&:hover": { color: "#22c55e" },
						marginLeft: "45px",
						fontSize: "0.88rem",
						fontWeight: 500,
					}}
				>
					Elèves
				</Button>
				<Button
					onClick={() => navigate("/progression")}
					sx={{
						color: "#7a8fa6",
						"&:hover": { color: "#22c55e" },
						marginLeft: "45px",
						fontSize: "0.88rem",
						fontWeight: 500,
					}}
				>
					Progression
				</Button>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					onClick={() => navigate("/profil")}
					sx={{ color: "#7a8fa6", fontSize: "0.88rem", fontWeight: 500 }}
				>
					Mon profil - Coach
				</Button>
			</Toolbar>
		</AppBar>
	);
}
