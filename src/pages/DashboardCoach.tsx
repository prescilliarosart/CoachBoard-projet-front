import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
	Box,
	Button,
	Step,
	StepLabel,
	Stepper,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormExercice from "../components/FormExercices";
import FormProgramme from "../components/FormProgramme";
import Navbar from "../components/Navbar";
import SelectSeance from "../components/SelectSeance";
import { ProgressionCanvas } from "../components/useProgressionCanvas";

const STEPS = ["Programme", "Séance", "Exercice"];

export default function DashboardCoach() {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [programmeId, setProgrammeId] = useState<number | null>(null);
	const [seanceId, setSeanceId] = useState<number | null>(null);
	const [done, setDone] = useState(false);

	const handleProgrammeSuccess = (id: number) => {
		setProgrammeId(id);
		setActiveStep(1);
	};

	const handleSeanceSuccess = (id: number) => {
		setSeanceId(id);
		setActiveStep(2);
	};

	const handleExerciceSuccess = () => {
		setActiveStep(2);
	};

	const handleReset = () => {
		setProgrammeId(null);
		setSeanceId(null);
		setDone(false);
		setActiveStep(0);
	};

	const handleNewSeance = () => {
		setSeanceId(null);
		setActiveStep(1);
	};

	const handleFinish = () => {
		setDone(true);
	};

	return (
		<div style={{ position: "relative", zIndex: 1 }}>
			<ProgressionCanvas />
			<Navbar
				links={[
					{ label: "Programmes", path: "/programmes" },
					{ label: "Seances", path: "/seances" },
					{ label: "exercices", path: "/exercices" },
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
						Liste de mes élèves
					</Button>

					<Button
						variant="contained"
						onClick={() => navigate("/suivi")}
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
						Suivi de mes élèves
					</Button>
				</Box>
			</Box>
			{/* ── Section création ── */}
			<Box sx={{ px: "36px", py: "40px", position: "relative", zIndex: 2 }}>
				<Typography
					sx={{
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: "1.8rem",
						fontStyle: "italic",
						fontWeight: 700,
						color: "#e2e8f0",
						textTransform: "uppercase",
						mb: "32px",
					}}
				>
					Créer un programme complet
				</Typography>

				<Stepper
					activeStep={activeStep}
					sx={{
						mb: "40px",
						"& .MuiStepLabel-label": {
							color: "#94a3b8",
							fontWeight: 600,
						},
						"& .MuiStepLabel-label.Mui-active": {
							color: "#22c55e",
						},
						"& .MuiStepLabel-label.Mui-completed": {
							color: "#22c55e",
						},
						"& .MuiStepIcon-root": {
							color: "#334155",
						},
						"& .MuiStepIcon-root.Mui-active": {
							color: "#22c55e",
						},
						"& .MuiStepIcon-root.Mui-completed": {
							color: "#22c55e",
						},
					}}
				>
					{STEPS.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{!done ? (
					<>
						{activeStep === 0 && (
							<FormProgramme onSuccess={handleProgrammeSuccess} />
						)}
						{activeStep === 1 && programmeId && (
							<SelectSeance onSuccess={handleSeanceSuccess} />
						)}
						{activeStep === 2 && seanceId && (
							<>
								<FormExercice onSuccess={handleExerciceSuccess} />

								<Box sx={{ display: "flex", gap: 2, mt: 3 }}>
									<Button variant="outlined" onClick={() => setActiveStep(2)}>
										Ajouter un autre exercice
									</Button>

									<Button variant="outlined" onClick={handleNewSeance}>
										Ajouter une autre séance
									</Button>

									<Button variant="contained" onClick={handleFinish}>
										Terminer le programme
									</Button>
								</Box>
							</>
						)}
					</>
				) : (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "24px",
						}}
					>
						<CheckCircleIcon sx={{ fontSize: 64, color: "#22c55e" }} />
						<Typography sx={{ color: "#e2e8f0" }}>
							Programme complet créé !
						</Typography>
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button onClick={handleReset} startIcon={<RestartAltIcon />}>
								Créer un autre programme
							</Button>
							<Button
								onClick={() => navigate("/programmes")}
								variant="outlined"
							>
								Voir mes programmes
							</Button>
						</Box>
					</Box>
				)}
			</Box>
		</div>
	);
}
