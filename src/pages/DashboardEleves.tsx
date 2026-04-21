import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";

export default function DashboardEleves() {
	const navigate = useNavigate();

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/mon-programme" },
					{ label: "Suivi", path: "/mon-suivi" },
				]}
				profilLabel="Mon profil - Eleve"
			/>
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", sm: "row" },
					justifyContent: "space-between",
					alignItems: { xs: "flex-start", sm: "center" },
					mt: "80px",
					px: "36px",
					py: "40px",
					borderBottom: "1px solid rgba(34, 197, 94, 0.5)",
					position: "relative",
					zIndex: 2,
					gap: 3,
				}}
			>
				<Box sx={{ color: "#fff" }}>
					<Typography
						variant="h1"
						sx={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: { xs: "2.5rem", sm: "3.5rem" },
							fontStyle: "italic",
							fontWeight: 700,
						}}
					>
						Mon espace
					</Typography>
					<Typography
						sx={{
							fontSize: { xs: "1rem", sm: "1.5rem" },
							mt: 2,
							fontFamily: "'Barlow', sans-serif",
							color: "rgba(255,255,255,0.7)",
						}}
					>
						Consultez votre programme, enregistrez vos performances et suivez
						votre progression séance après séance.
					</Typography>
				</Box>

				<Button
					variant="contained"
					onClick={() => navigate("/seance-en-cours")}
					sx={{
						backgroundColor: "#22c55e",
						color: "#0b1520",
						fontStyle: "italic",
						fontSize: "1rem",
						fontWeight: 700,
						whiteSpace: "nowrap",
						borderRadius: "4px",
						width: { xs: "100%", sm: "auto" },
						"&:hover": {
							backgroundColor: "#16a34a",
							transform: "translateY(-2px)",
							boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
						},
					}}
				>
					Démarrer une séance
				</Button>
			</Box>
		</div>
	);
}
