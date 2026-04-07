import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Seances() {
	const navigate = useNavigate();
	const { token } = useAuth();
	const [seances, setSeances] = useState<any[]>([]);

	useEffect(() => {
		fetch("http://localhost:3310/api/seances", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Séances reçues :", data);
				setSeances(data);
			})
			.catch((err) => console.error("Erreur chargement séances :", err));
	}, []);

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:3310/api/seances/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) throw new Error("Erreur lors de la suppression");

			setSeances(seances.filter((s) => s.ID_SEANCE !== id));
		} catch (err) {
			console.error("Erreur suppression séance :", err);
		}
	};

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
						Séances personnalisées
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
						onClick={() => navigate("/programmes")}
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
						Bibliothèque de programmes
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
							<TableCell sx={{ color: "#fff" }}>Titre</TableCell>
							<TableCell sx={{ color: "#fff" }}>Jour</TableCell>
							<TableCell sx={{ color: "#fff" }}>Ordre</TableCell>
							<TableCell sx={{ color: "#fff" }}>Programme associé</TableCell>
							<TableCell sx={{ color: "#fff" }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{seances.map((seance) => (
							<TableRow key={seance.ID_SEANCE}>
								<TableCell sx={{ color: "#fff" }}>{seance.TITRE}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{seance.JOUR}</TableCell>
								<TableCell sx={{ color: "#fff" }}>{seance.ORDRE}</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{seance.nom_programme}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									<DeleteIcon
										onClick={() => handleDelete(seance.ID_SEANCE)}
										sx={{
											color: "#7a8fa6",
											cursor: "pointer",
											fontSize: "24px",
											"&:hover": { color: "#22c55e" },
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</div>
	);
}
