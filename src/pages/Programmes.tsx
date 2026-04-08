import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Chip,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Toolbar,
	Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import FormProgramme from "../components/FormProgramme";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

export default function Programmes() {
	const { token } = useAuth();
	const [programmes, setProgrammes] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState("");
	const [statutFilter, setStatutFilter] = useState("");

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
	const filteredProgrammes = useMemo(
		() =>
			programmes.filter(
				(p) =>
					(p.nom_programme.toLowerCase().includes(search.toLowerCase()) ||
						p.nom_eleve.toLowerCase().includes(search.toLowerCase()) ||
						p.prenom_eleve.toLowerCase().includes(search.toLowerCase())) &&
					(statutFilter === "" || p.STATUT === statutFilter),
			),
		[search, statutFilter, programmes],
	);

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
			<Toolbar />
			<Box
				sx={{
					px: "36px",
					py: "18px",
					borderBottom: "1px solid rgba(34,197,94,0.18)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					position: "relative",
					zIndex: 2,
				}}
			>
				<Typography
					sx={{
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "1.6rem",
						color: "#e2e8f0",
						textTransform: "uppercase",
					}}
				>
					Programmes personnalisés
				</Typography>
				<Button
					onClick={() => setShowForm(!showForm)}
					startIcon={<AddIcon sx={{ fontSize: 15 }} />}
					sx={{
						background: "#22c55e",
						color: "#0b1520",
						fontFamily: "'Barlow Condensed',sans-serif",
						fontStyle: "italic",
						fontWeight: 700,
						fontSize: "0.85rem",
						textTransform: "uppercase",
						px: "16px",
						py: "7px",
						borderRadius: "4px",
						transition: "all 0.2s",
						"&:hover": {
							background: "#16a34a",
							transform: "translateY(-1px)",
							boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
						},
					}}
				>
					{showForm ? "Annuler" : "Créer un programme"}
				</Button>
			</Box>
			<Box sx={{ margin: "40px 36px" }}>
				{/* Formulaire de création */}
				{showForm && (
					<Box
						sx={{
							background: "#1E293B", // vert seulement pour le formulaire ouvert
							borderRadius: "12px",
							padding: "24px",
							marginBottom: "24px",
						}}
					>
						<FormProgramme onSuccess={() => setShowForm(false)} />
					</Box>
				)}

				{/* Barre de recherche */}
				<Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
					<TextField
						placeholder="Rechercher un programme ou un élève"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						size="small"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon sx={{ color: "#7a8fa6", fontSize: 18 }} />
								</InputAdornment>
							),
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								background: "#111e2c", // fond neutre pour la recherche
								borderRadius: "6px",
								fontFamily: "'Barlow',sans-serif",
								fontSize: "0.88rem",
								color: "#e2e8f0",
								height: "40px",
								"& fieldset": { borderColor: "rgba(34,197,94,0.18)" },
								"&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" },
								"&.Mui-focused fieldset": { borderColor: "#22c55e" },
							},
							"& input::placeholder": { color: "#7a8fa6" },
						}}
					/>
				</Box>

				{/* Table des programmes */}
				<Box
					sx={{
						background: "#111e2c", // fond neutre pour la table
						borderRadius: "12px",
						padding: "24px",
					}}
				>
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
							{filteredProgrammes.map((programme) => {
								const dateFin = new Date(programme.DATE_DEBUT);
								dateFin.setDate(dateFin.getDate() + programme.duree_programme);
								return (
									<TableRow key={programme.ID_PROGRAMME}>
										<TableCell sx={{ color: "#fff" }}>
											{new Date(programme.DATE_DEBUT).toLocaleDateString(
												"fr-FR",
											)}
										</TableCell>
										<TableCell sx={{ color: "#fff" }}>
											{dateFin.toLocaleDateString("fr-FR")}
										</TableCell>
										<TableCell sx={{ color: "#fff" }}>
											{programme.nom_programme}
										</TableCell>
										<TableCell sx={{ color: "#fff" }}>
											{programme.STATUT}
										</TableCell>
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
				</Box>
			</Box>
		</div>
	);
}
