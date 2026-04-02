import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";

export default function DashboardCoach() {
	const navigate = useNavigate();

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Elèves", path: "/eleves" },
					{ label: "Suivi", path: "/progression" },
				]}
				profilLabel="Profil"
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					minHeight: "200px",
					margin: "80px 0 0",
					paddingTop: "60px",
					padding: "0 36px",
					paddingBottom: "45px",
					position: "relative",
					zIndex: 2,
					borderBottom: "1px solid rgba(34, 197, 94, 0.5)",
				}}
			>
				<Box
					component="section"
					sx={{
						color: "#fff",
						padding: "24px 36px",
						position: "relative",
						zIndex: 2,
					}}
				>
					<Typography
						variant="h1"
						sx={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: "3.5rem",
							fontStyle: "italic",
							fontWeight: 700,
						}}
					>
						Dashboard Coach
					</Typography>
					<p
						style={{
							fontSize: "1.5rem",
							marginTop: "16px",
							marginBottom: "50px",
							fontFamily: "'Barlow', sans-serif",
						}}
					>
						Gérez vos programmes de coaching et suivez la progression de vos
						élèves depuis un tableau de bord central.
					</p>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						gap: 2,
						alignSelf: "flex-end",
						marginRight: "200px",
						position: "relative",
						zIndex: 2,
					}}
				>
					<Button
						variant="contained"
						onClick={() => navigate("/eleves")}
						sx={{
							zIndex: 2,
							backgroundColor: "#22c55e",
							color: "#0b1520",
							fontStyle: "italic",
							fontSize: "1.25rem",
							fontWeight: 700,
							border: "1.5px solid #22c55e",
							borderRadius: "4px",
							"&:hover": {
								backgroundColor: "#16a34a",
								transform: "translateY(-2px)",
								boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
							},
						}}
					>
						Suivre mes élèves
					</Button>

					<Button
						variant="contained"
						onClick={() => navigate("/exercices")}
						sx={{
							zIndex: 2,
							backgroundColor: "#22c55e",
							color: "#0b1520",
							fontStyle: "italic",
							fontSize: "1.25rem",
							fontWeight: 700,
							border: "1.5px solid #22c55e",
							borderRadius: "4px",
							"&:hover": {
								backgroundColor: "#16a34a",
								transform: "translateY(-2px)",
								boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
							},
						}}
					>
						Bibliothèques d'exercices
					</Button>

					<Button
						variant="contained"
						onClick={() => navigate("/exercices/nouveau")}
						sx={{
							zIndex: 2,
							backgroundColor: "#22c55e",
							color: "#0b1520",
							fontStyle: "italic",
							fontSize: "1.25rem",
							fontWeight: 700,
							border: "1.5px solid #22c55e",
							borderRadius: "4px",
							"&:hover": {
								backgroundColor: "#16a34a",
								transform: "translateY(-2px)",
								boxShadow: "0 8px 28px rgba(34, 197, 94, 0.22)",
							},
						}}
					>
						Créer un exercice
					</Button>
				</Box>
			</Box>
			<Typography>
				<h2 style={{ color: "#fff", margin: "40px 0 24px", padding: "0 36px" }}>
					Historique des séances
				</h2>
			</Typography>
			<Box
				sx={{
					background: "#1E293B",
					borderRadius: "12px",
					padding: "24px",
					margin: "40px 36px",
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ color: "#fff" }}>Date</TableCell>
							<TableCell sx={{ color: "#fff" }}>Programme</TableCell>
							<TableCell sx={{ color: "#fff" }}>Séance</TableCell>
							<TableCell sx={{ color: "#fff" }}>Statut</TableCell>
							<TableCell sx={{ color: "#fff" }}>Elève concerné</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell sx={{ color: "#fff" }}>2023-10-01</TableCell>
							<TableCell sx={{ color: "#fff" }}>Programme 1</TableCell>
							<TableCell sx={{ color: "#fff" }}>50%</TableCell>
							<TableCell sx={{ color: "#fff" }}>✅</TableCell>
							<TableCell sx={{ color: "#fff" }}>John Doe</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Box>
		</div>
	);
}
