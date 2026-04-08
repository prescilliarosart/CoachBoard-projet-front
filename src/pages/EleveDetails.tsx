import { ArrowBack, Person } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Container,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

type Eleve = {
	ID_ELEVE: number;
	NOM: string;
	PRENOM: string;
	EMAIL: string;
	AGE: number;
	POIDS_INITIAL: number;
	TAILLE: number;
	OBJECTIF: string;
	NIVEAU: string;
	IMAGE_URL: string;
};

function EleveDetails() {
	const { token } = useAuth();
	const { eleveId } = useParams();
	const navigate = useNavigate();
	const [eleve, setEleve] = useState<Eleve | null>(null);

	useEffect(() => {
		console.log("Token :", token);
		fetch(`http://localhost:3310/api/eleves/${eleveId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => setEleve(data));
	}, [eleveId]);

	if (!eleve) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					color: "#e2e8f0",
					fontSize: "1.5rem",
					fontFamily: "'Barlow Condensed',sans-serif",
					fontStyle: "italic",
					fontWeight: 700,
				}}
			>
				Chargement des détails de l'élève...
			</Box>
		);
	}

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "Exercices", path: "/exercices" },
				]}
				profilLabel="Mon profil - Coach"
			/>

			<Toolbar />
			<Box
				sx={{
					backgroundColor: "#0b1520",
					minHeight: "100vh",
					p: 4,
				}}
			>
				<Container maxWidth="lg" sx={{ py: 4 }}>
					<Button
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
						sx={{
							color: "#22c55e",
							bbackgroundColor: "transparent",
							mb: 3,
							"&:hover": {
								backgroundColor: "rgba(34,197,94,0.1)",
							},
						}}
					>
						Retour
					</Button>

					<Box
						sx={{
							maxWidth: 480,
							margin: "auto",
							backgroundColor: "#0f1b27",
							borderRadius: 3,
							border: "1px solid rgba(34,197,94,0.13)",
							p: 4,
						}}
					>
						<Avatar
							src={eleve.IMAGE_URL}
							alt={`${eleve.PRENOM} ${eleve.NOM}`}
							sx={{ width: 120, height: 120 }}
						/>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontStyle: "italic",
								fontWeight: 700,
								fontSize: "1.5rem",
								color: "#e2e8f0",
							}}
						>
							{eleve.PRENOM} {eleve.NOM}
						</Typography>
						<Box sx={{ display: "flex", gap: 1 }}>
							<Chip label={`Objectif : ${eleve.OBJECTIF}`} color="success" />
							<Chip label={`Niveau : ${eleve.NIVEAU}`} color="info" />
						</Box>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontStyle: "italic",
								fontWeight: 700,
								fontSize: "1.25rem",
								color: "#e2e8f0",
							}}
						>
							{eleve.EMAIL}
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontStyle: "italic",
								fontWeight: 700,
								fontSize: "1.25rem",
								color: "#e2e8f0",
							}}
						>
							{eleve.AGE} ans
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontStyle: "italic",
								fontWeight: 700,
								fontSize: "1.25rem",
								color: "#e2e8f0",
							}}
						>
							{eleve.POIDS_INITIAL} kg
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Barlow Condensed',sans-serif",
								fontStyle: "italic",
								fontWeight: 700,
								fontSize: "1.25rem",
								color: "#e2e8f0",
							}}
						>
							{eleve.TAILLE} cm
						</Typography>
					</Box>
				</Container>
			</Box>
		</div>
	);
}

export default EleveDetails;
