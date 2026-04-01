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

interface FormData {
	nomProgramme: string;
	objectif: string;
	duree: string;
	dateDebut: string;
	notes: string;
	eleveConcerne: number | "";
}

interface Eleve {
	ID_ELEVE: number;
	NOM: string;
	PRENOM: string;
	EMAIL: string;
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

const seances_fictives = [
	{
		id: 1,
		nom: "Seance Push",
		description: "Pectoraux / Epaules, Triceps",
		serie: 5,
		duree: "45min",
		repos: "1min",
	},
	{
		id: 2,
		nom: "Seance Pull",
		description: "Dos, Biceps",
		serie: 5,
		duree: "45min",
		repos: "1min",
	},
	{
		id: 3,
		nom: "Seance Legs",
		description: "Jambes, Abdominaux",
		serie: 5,
		duree: "45min",
		repos: "1min",
	},
	{
		id: 4,
		nom: "Seance Full Body",
		description: "Corps entier, idéal pour les débutants",
		serie: 4,
		duree: "40min",
		repos: "1min30s",
	},
	{
		id: 5,
		nom: "Seance HIIT",
		description:
			"Entraînement fractionné de haute intensité pour brûler un maximum de calories en peu de temps",
		serie: 6,
		duree: "30min",
		repos: "30s",
	},
];

const programmes_fictifs = [
	{
		id: 1,
		nom: "Programme de prise de masse",
		description: "Un programme intensif pour développer la masse musculaire.",
		objectif: "Gagner du muscle",
		duree: "12 semaines",
		eleveConcerne: "Jean Dupont",
	},
	{
		id: 2,
		nom: "Programme de perte de poids",
		description:
			"Un programme axé sur la perte de graisse et l'amélioration de la condition physique.",
		objectif: "Perdre du gras",
		duree: "8 semaines",
		eleveConcerne: "Marie Curie",
	},
	{
		id: 3,
		nom: "Programme de remise en forme",
		description:
			"Un programme équilibré pour améliorer la condition physique générale.",
		objectif: "Améliorer la condition physique générale",
		duree: "10 semaines",
		eleveConcerne: "Alice Martin",
	},
];

export default function NouveauProgramme() {
	const navigate = useNavigate();
	const { token, user } = useAuth();
	const [programmes, setProgrammes] = useState<any[]>([]);

	const [eleves, setEleves] = useState<Eleve[]>([]);

	const [form, setForm] = useState<FormData>({
		nomProgramme: "",
		objectif: "",
		duree: "",
		dateDebut: "",
		notes: "",
		eleveConcerne: "",
	});

	useEffect(() => {
		fetch("http://localhost:3310/api/eleves", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Eleves chargés :", data);
				setEleves(data);
			})
			.catch((err) =>
				console.error("Erreur lors du chargement des élèves :", err),
			);
	}, []);

	const handleSave = async () => {
    if (!form.nomProgramme || !form.objectif || !form.duree) {
        alert("Veuillez remplir le nom, l'objectif et la durée.");
        return;
    }

    try {

		const idCoach = (user as any)?.ID_COACH || (user as any).id || 1;

        const programmeData = {
            nom: form.nomProgramme,
            objectif: form.objectif,
            duree: parseInt(form.duree, 10),
            id_coach: idCoach
        };

        const response = await fetch("http://localhost:3310/api/programmes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(programmeData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la création");
        }

        const newId = await response.json();
        console.log("Programme créé :", JSON.stringify(newId));

    
        const nouveauProgramme = {
            id: newId.id,
            nom: programmeData.nom,
            objectif: programmeData.objectif,
            duree: programmeData.duree,
            description: form.notes
        };

        setProgrammes([...programmes, nouveauProgramme]);
        navigate("/programmes");

    } catch (err) {
        console.error("Détails de l'erreur :", err);
        alert("Impossible de créer le programme. Vérifiez les types de données (la durée doit être un nombre).");
    }
};

	const handleDelete = (id: number) => {
		setProgrammes(programmes.filter((p) => p.id !== id));
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
						Nouveau programme
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
						{/* Formulaire de création de programme */}

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
									label="Nom du programme"
									value={form.nomProgramme}
									onChange={(e) =>
										setForm({ ...form, nomProgramme: e.target.value })
									}
									fullWidth
									sx={SX_IN}
								/>
								<TextField
									label="Objectif"
									value={form.objectif}
									onChange={(e) =>
										setForm({ ...form, objectif: e.target.value })
									}
									fullWidth
									sx={SX_IN}
								/>
								<TextField
									label="Durée"
									value={form.duree}
									onChange={(e) => setForm({ ...form, duree: e.target.value })}
									fullWidth
									sx={SX_IN}
								/>
								<TextField
									slotProps={{ inputLabel: { shrink: true } }}
									label="Date de début"
									value={form.dateDebut}
									type="date"
									onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
									fullWidth
									sx={SX_IN}
								/>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
								<TextField
									label="Notes (optionnel)"
									value={form.notes}
									onChange={(e) => setForm({ ...form, notes: e.target.value })}
									fullWidth
									multiline
									rows={3}
									sx={SX_IN}
								/>
								<FormControl fullWidth sx={SX_IN}>
									<InputLabel>Élève concerné</InputLabel>
									<Select
										value={form.eleveConcerne}
										onChange={(e) =>
											setForm({ ...form, eleveConcerne: e.target.value })
										}
									>
										{eleves.map((eleve) => (
											<MenuItem key={eleve.ID_ELEVE} value={eleve.ID_ELEVE}>
												{eleve.NOM} {eleve.PRENOM}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>

						{/* Liste des programmes */}

						<Box sx={{ mt: 2, position: "relative", zIndex: 2 }}>
							{programmes.map((programme) => (
								<Box
									key={programme.id}
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
										onClick={() => handleDelete(programme.id)}
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
												{programme.nom}
											</Typography>
											<Typography sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
												{programme.description}
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
											Objectif : {programme.objectif}
										</Typography>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Durée : {programme.duree}
										</Typography>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Eleve concerné : {programme.eleveConcerne}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>

					{/* Bibliothèque */}

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
								height: "100%",
							}}
						>
							Bibliothèque
						</Typography>
						<TextField label="Rechercher une séance" sx={SX_IN} />
						<Box sx={{ mt: 2, width: "100%" }}>
							{seances_fictives.map((seance) => (
								<Box
									key={seance.id}
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
												{seance.nom}
											</Typography>
											<Typography sx={{ color: "#7a8fa6", fontSize: "0.8rem" }}>
												{seance.description}
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
											Série : {seance.serie}
										</Typography>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Durée : {seance.duree}
										</Typography>
										<Typography sx={{ color: "#7a8fa6", fontSize: "0.78rem" }}>
											Repos : {seance.repos}
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
