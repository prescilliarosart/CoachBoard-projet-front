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
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Programmes() {
	const navigate = useNavigate();
	const { token } = useAuth();
	const [programmes, setProgrammes] = useState<any[]>([]);


	useEffect(() => {
		fetch("http://localhost:3310/api/programmes", {
			headers: {
				Authorization: `Bearer ${token}` },
			})
			.then((response) => response.json())
			.then((data) => {
				setProgrammes(data);
			})
			.catch((error) => {
				console.error("Erreur lors de la récupération des programmes :", error);
			});
	}, []);

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Elèves", path: "/eleves" },
					{ label: "Progression", path: "/progression" },
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
						Programmes personnalisés
					</Typography>
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
						Bibliothèque d'exercices
					</Button>

					<Button
						variant="contained"
						onClick={() => navigate("/seances/nouvelle")}
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
						Créer une séance
					</Button>

					<Button
						variant="contained"
						onClick={() => navigate("/programmes/nouveau")}
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
						Créer un programme
					</Button>
				</Box>
			</Box>
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
						{programmes.map((programme) => (
							<TableRow key={programme.ID_PROGRAMME}>
								<TableCell sx={{ color: "#fff" }}>{programme.date}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{programme.nom}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{programme.seance}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{programme.statut}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{programme.eleve}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>


			</Box>
		</div>
	);
}