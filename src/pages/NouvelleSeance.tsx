import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SaveIcon from "@mui/icons-material/Save";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

interface FormSeance {
	titre: string;
	jour: string;
	ordre: number | "";
	id_programme: number | "";
}

interface Programme {
	ID_PROGRAMME: number;
	NOM: string;
}

interface Exercice {
	ID_EXERCICE: number;
	NOM: string;
	GROUPE_MUSCULAIRE: string;
	TYPE: string;
}

const SX_IN = {
	"& .MuiOutlinedInput-root": {
		background: "#111e2c",
		borderRadius: "6px",
		fontFamily: "'Barlow',sans-serif",
		fontSize: "0.88rem",
		color: "#e2e8f0",
		"& fieldset": { borderColor: "rgba(34,197,94,0.18)" },
		"&:hover fieldset": { borderColor: "rgba(34,197,94,0.4)" },
		"&.Mui-focused fieldset": { borderColor: "#22c55e" },
	},
	"& .MuiInputLabel-root": { color: "#7a8fa6", fontSize: "0.82rem" },
	"& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
};

const SX_BTN = {
	background: "#22c55e",
	color: "#0b1520",
	fontFamily: "'Barlow Condensed',sans-serif",
	fontStyle: "italic",
	fontWeight: 700,
	fontSize: "0.85rem",
	textTransform: "uppercase" as const,
	px: "16px",
	py: "7px",
	borderRadius: "4px",
	transition: "all 0.2s",
	"&:hover": {
		background: "#16a34a",
		transform: "translateY(-1px)",
		boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
	},
};

export default function NouvelleSeance() {
	const navigate = useNavigate();
	const { token } = useAuth();

	const [seances, setSeances] = useState<any[]>([]);
	const [programmes, setProgrammes] = useState<Programme[]>([]);
	const [exercices, setExercices] = useState<Exercice[]>([]);

	const [form, setForm] = useState<FormSeance>({
		titre: "",
		jour: "",
		ordre: "",
		id_programme: "",
	});

	useEffect(() => {
		fetch("http://localhost:3310/api/programmes", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Programmes chargés :", data);
				setProgrammes(data);
			})
			.catch((err) =>
				console.error("Erreur lors du chargement des programmes :", err),
			);

		fetch("http://localhost:3310/api/seances", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Séances chargées :", data);
				setSeances(data);
			})
			.catch((err) => console.error("Erreur chargement séances :", err));

		fetch("http://localhost:3310/api/exercices", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Exercices chargés :", data);
				setExercices(data);
			})
			.catch((err) => console.error("Erreur chargement exercices :", err));
	}, []);

	const handleSave = async () => {
		if (!form.titre || !form.jour || !form.ordre || !form.id_programme) return;

		try {
			const response = await fetch("http://localhost:3310/api/seances", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					titre: form.titre,
					jour: form.jour,
					ordre: form.ordre,
					id_programme: form.id_programme,
				}),
			});

			if (!response.ok)
				throw new Error("Erreur lors de la création de la séance");

			navigate("/seances");
		} catch (err) {
			console.error("Erreur handleSave séance :", err);
			alert("Impossible de créer la séance.");
		}
	};

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
				<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
						Nouvelle séance
					</Typography>
					<FitnessCenterIcon sx={{ color: "#22c55e", fontSize: 22 }} />
				</Box>
				<Button
					onClick={handleSave}
					startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
					sx={SX_BTN}
				>
					Enregistrer
				</Button>
			</Box>
			<Box sx={{ p: "32px 36px", position: "relative", zIndex: 2 }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "2fr 1fr",
						gap: "40px",
						alignItems: "start",
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column", gap: "40px" }}>
						{/* Formulaire de création de séance */}
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 3,
								background: "rgba(15,27,39,0.85)",
								border: "1px solid rgba(34,197,94,0.13)",
								borderRadius: "12px",
								p: "32px",
							}}
						>
							<Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
								<TextField
									label="Titre de la séance"
									value={form.titre}
									onChange={(e) => setForm({ ...form, titre: e.target.value })}
									fullWidth
									sx={SX_IN}
								/>
								<FormControl fullWidth sx={SX_IN}>
									<InputLabel>Jour</InputLabel>
									<Select
										value={form.jour}
										onChange={(e) => setForm({ ...form, jour: e.target.value })}
									>
										{[
											"Lundi",
											"Mardi",
											"Mercredi",
											"Jeudi",
											"Vendredi",
											"Samedi",
											"Dimanche",
										].map((j) => (
											<MenuItem key={j} value={j}>
												{j}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									label="Ordre"
									type="number"
									value={form.ordre}
									onChange={(e) =>
										setForm({ ...form, ordre: Number(e.target.value) })
									}
									fullWidth
									sx={SX_IN}
								/>
								<FormControl fullWidth sx={SX_IN}>
									<InputLabel>Programme associé</InputLabel>
									<Select
										value={form.id_programme}
										onChange={(e) =>
											setForm({
												...form,
												id_programme: e.target.value as number,
											})
										}
									>
										{programmes.map((p) => (
											<MenuItem key={p.ID_PROGRAMME} value={p.ID_PROGRAMME}>
												{p.NOM}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>
						{/* Liste des séances */}
						<Box sx={{ mt: 2, position: "relative", zIndex: 2 }}>
							{seances.map((seance) => (
								<Box
									key={seance.ID_SEANCE}
									sx={{
										background: "rgba(15,27,39,0.85)",
										border: "1px solid rgba(34,197,94,0.13)",
										borderRadius: "8px",
										padding: "16px",
										marginBottom: "12px",
										width: "100%",
										position: "relative",
									}}
								>
									<DeleteIcon
										onClick={() => handleDelete(seance.ID_SEANCE)}
										sx={{
											position: "absolute",
											top: 8,
											right: 8,
											color: "#7a8fa6",
											cursor: "pointer",
											fontSize: "24px",
											"&:hover": { color: "#22c55e" },
										}}
									/>
									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											gap: 2,
											alignItems: "center",
										}}
									>
										<Box
											sx={{
												width: 56,
												height: 56,
												borderRadius: "8px",
												background: "rgba(34,197,94,0.1)",
												flexShrink: 0,
											}}
										/>
										<Box>
											<Typography sx={{ color: "#e2e8f0", fontWeight: 900 }}>
												{seance.TITRE}
											</Typography>
											<Typography sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
												{seance.ID_PROGRAMME}
											</Typography>
										</Box>
									</Box>
									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											gap: 3,
											mt: 2,
										}}
									>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Jour : {seance.JOUR}
										</Typography>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Ordre : {seance.ORDRE}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
					{/* Bibliothèque d'exercices */}
					<Box
						sx={{
							px: "36px",
							py: "18px",
							background: "rgba(15,27,39,0.85)",
							border: "1px solid rgba(34,197,94,0.13)",
							borderRadius: "12px",
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							position: "relative",
							zIndex: 2,
						}}
					>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontWeight: 900,
								fontSize: "1.1rem",
								color: "#e2e8f0",
								textTransform: "uppercase",
								paddingBottom: "12px",
							}}
						>
							Bibliothèque d'exercices
						</Typography>
						<TextField label="Rechercher un exercice" sx={SX_IN} />
						<Box sx={{ mt: 2, width: "100%" }}>
							{exercices.map((ex) => (
								<Box
									key={ex.ID_EXERCICE}
									sx={{
										background: "rgba(15,27,39,0.85)",
										border: "1px solid rgba(34,197,94,0.13)",
										borderRadius: "8px",
										padding: "16px",
										marginBottom: "12px",
										width: "100%",
									}}
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											gap: 2,
											alignItems: "center",
										}}
									>
										<Box
											sx={{
												width: 56,
												height: 56,
												borderRadius: "8px",
												background: "rgba(34,197,94,0.1)",
												flexShrink: 0,
											}}
										/>
										<Box>
											<Typography sx={{ color: "#e2e8f0", fontWeight: 700 }}>
												{ex.NOM}
											</Typography>
											<Typography sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
												{ex.GROUPE_MUSCULAIRE}
											</Typography>
										</Box>
									</Box>
									<Box sx={{ mt: 2 }}>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Type : {ex.TYPE}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Box>
		</div>
	);
}
