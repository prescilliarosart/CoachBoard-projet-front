import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FormProgramme from "../components/FormProgramme";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Programmes() {
	const { token } = useAuth();
	const [programmes, setProgrammes] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		console.log("Token :", token);
		fetch("http://localhost:3310/api/programmes", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				console.log("Status :", response.status);
				return response.json();
			})
			.then((data) => {
				console.log("Data reçue :", data);
				setProgrammes(data);
			})
			.catch((error) => {
				console.error("Erreur lors de la récupération des programmes :", error);
			});
	}, []);

	const handleDelete = async (
		idProgramme: number,
		idEleveProgramme: number,
	) => {
		try {
			const response = await fetch(
				`http://localhost:3310/api/eleves-programmes/${idEleveProgramme}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok)
				throw new Error(
					"Erreur lors de la suppression de l'association élève-programme",
				);

			const response2 = await fetch(
				`http://localhost:3310/api/programmes/${idProgramme}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response2.ok)
				throw new Error("Erreur lors de la suppression du programme");

			setProgrammes(programmes.filter((p) => p.ID_PROGRAMME !== idProgramme));
		} catch (error) {
			console.error("Erreur lors de la suppression du programme :", error);
		}
	};

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "Exercices", path: "/exercices" },
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
						onClick={() => setShowForm(!showForm)}
						sx={{}}
					>
						{showForm ? "Annuler" : "Créer un programme"}
					</Button>
				</Box>
			</Box>
			<Box
				sx={{
					background: "#16a34a",
					borderRadius: "12px",
					padding: "24px",
					margin: "40px 36px",
				}}
			>
				{showForm && (
					<FormProgramme
						onSuccess={() => {
							setShowForm(false);
						}}
					/>
				)}
				<Table>...</Table>
			</Box>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell sx={{ color: "#fff" }}>Date de début</TableCell>
						<TableCell sx={{ color: "#fff" }}>Date de fin</TableCell>
						<TableCell sx={{ color: "#fff" }}>Programme</TableCell>
						<TableCell sx={{ color: "#fff" }}>Statut</TableCell>
						<TableCell sx={{ color: "#fff" }}>Elève concerné</TableCell>
						<TableCell sx={{ color: "#fff" }}></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{programmes.map((programme) => {
						const dateFin = new Date(programme.DATE_DEBUT);
						dateFin.setDate(dateFin.getDate() + programme.duree_programme);
						return (
							<TableRow key={programme.ID_PROGRAMME}>
								<TableCell sx={{ color: "#fff" }}>
									{new Date(programme.DATE_DEBUT).toLocaleDateString("fr-FR")}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{dateFin.toLocaleDateString("fr-FR")}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{programme.nom_programme}
								</TableCell>
								<TableCell sx={{ color: "#fff" }}>{programme.STATUT}</TableCell>
								<TableCell sx={{ color: "#fff" }}>
									{programme.nom_eleve} {programme.prenom_eleve}
								</TableCell>
								<TableCell>
									<DeleteIcon
										onClick={() =>
											handleDelete(
												programme.ID_PROGRAMME,
												programme.ID_ELEVE_PROGRAMME,
											)
										}
										sx={{
											color: "#7a8fa6",
											cursor: "pointer",
											fontSize: "24px",
											"&:hover": { color: "#22c55e" },
										}}
									/>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
