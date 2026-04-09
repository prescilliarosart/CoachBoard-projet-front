import { ArrowBack, Person } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Container,
	Grid,
	Paper,
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
				<Container maxWidth="sm">
					<Button
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
						sx={{
							color: "#22c55e",
							backgroundColor: "transparent",
							mb: 3,
							"&:hover": {
								backgroundColor: "rgba(34,197,94,0.1)",
							},
						}}
					>
						Retour
					</Button>

					<Paper
						sx={{
							backgroundColor: "#0f1b27",
							borderRadius: "16px",
							border: "1px solid rgba(34,197,94,0.15)",
							overflow: "hidden",
							p: 4,
						}}
					>
						<Box sx={{ textAlign: "center", mb: 4 }}>
							<Avatar
								src={eleve.IMAGE_URL}
								sx={{
									width: 100,
									height: 100,
									margin: "0 auto 16px",
									border: "3px solid #22c55e",
									boxShadow: "0 0 15px rgba(34,197,94,0.2)",
								}}
							>
								<Person sx={{ fontSize: "3rem" }} />
							</Avatar>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 800,
									fontFamily: "'Barlow Condensed'",
									fontStyle: "italic",
									textTransform: "uppercase",
									color: "#fff",
								}}
							>
								{eleve.PRENOM} {eleve.NOM}
							</Typography>
							<Typography
								sx={{ color: "rgba(226, 232, 240, 0.6)", fontSize: "0.9rem" }}
							>
								{eleve.EMAIL}
							</Typography>
						</Box>

						<Grid container spacing={3}>
							<Grid size={6}>
								<Typography
									sx={{
										color: "#22c55e",
										fontSize: "0.75rem",
										fontWeight: 700,
										textTransform: "uppercase",
									}}
								>
									Âge
								</Typography>
								<Typography
									sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#fff" }}
								>
									{eleve.AGE} ans
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									sx={{
										color: "#22c55e",
										fontSize: "0.75rem",
										fontWeight: 700,
										textTransform: "uppercase",
									}}
								>
									Poids
								</Typography>
								<Typography
									sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#fff" }}
								>
									{eleve.POIDS_INITIAL} kg
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									sx={{
										color: "#22c55e",
										fontSize: "0.75rem",
										fontWeight: 700,
										textTransform: "uppercase",
									}}
								>
									Taille
								</Typography>
								<Typography
									sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#fff" }}
								>
									{eleve.TAILLE} cm
								</Typography>
							</Grid>
							<Grid size={6}>
								<Typography
									sx={{
										color: "#22c55e",
										fontSize: "0.75rem",
										fontWeight: 700,
										textTransform: "uppercase",
									}}
								>
									Niveau
								</Typography>
								<Chip
									label={eleve.NIVEAU}
									size="small"
									sx={{
										bgcolor: "rgba(34,197,94,0.1)",
										color: "#fff",
										fontWeight: 600,
									}}
								/>
							</Grid>
						</Grid>

						<Box
							sx={{
								mt: 4,
								pt: 3,
								borderTop: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<Typography
								sx={{
									color: "rgba(226, 232, 240, 0.5)",
									fontSize: "0.8rem",
									mb: 1,
								}}
							>
								OBJECTIF ACTUEL
							</Typography>
							<Typography
								sx={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}
							>
								{eleve.OBJECTIF}
							</Typography>
						</Box>
					</Paper>
				</Container>
			</Box>
		</div>
	);
}

export default EleveDetails;
