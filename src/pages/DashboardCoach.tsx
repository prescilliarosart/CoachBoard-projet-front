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
import FormExercices from "../components/FormExercices";
import FormProgramme from "../components/FormProgramme";
import FormSeanceExercice from "../components/FormSeanceExercice";
import FormSeances from "../components/FormSeances";
import Navbar from "../components/Navbar";
import SelectSeance from "../components/SelectSeance";
import SelectExercice from "../components/selectExercice";
import { ProgressionCanvas } from "../components/useProgressionCanvas";
import { useAuth } from "../context/AuthContext";

const STEPS = ["Programme", "Séance", "Exercice"];

const SX_TOGGLE_ACTIVE = {
	background: "#22c55e",
	color: "#0b1520",
	fontFamily: "'Barlow Condensed',sans-serif",
	fontStyle: "italic",
	fontWeight: 700,
	"&:hover": { background: "#16a34a" },
};

const SX_TOGGLE_INACTIVE = {
	borderColor: "rgba(34,197,94,0.4)",
	color: "#22c55e",
	fontFamily: "'Barlow Condensed',sans-serif",
	fontStyle: "italic",
	fontWeight: 700,
	"&:hover": { borderColor: "#22c55e", background: "rgba(34,197,94,0.08)" },
};

export default function DashboardCoach() {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [programmeId, setProgrammeId] = useState<number | null>(null);
	const [seanceId, setSeanceId] = useState<number | null>(null);
	const [exerciceId, setExerciceId] = useState<number | null>(null);
	const [modeSeance, setModeSeance] = useState<"select" | "create">("select");
	const [modeExercice, setModeExercice] = useState<"select" | "create">(
		"select",
	);
	const [showParamsExercice, setShowParamsExercice] = useState(false);
	const { token } = useAuth();

	const [done, setDone] = useState(false);

	const handleProgrammeSuccess = (id: number) => {
		setProgrammeId(id);
		setActiveStep(1);
	};

	const handleSeanceSuccess = async (id: number) => {
		if (programmeId) {
			await fetch(`/api/seances/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id_programme: programmeId }),
			});
		}

		if (modeSeance === "select") {
			await fetch(`/api/seances_exercices/seance/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
		}

		setSeanceId(id);
		setActiveStep(2);
	};

	const handleExerciceSuccess = (id: number) => {
		setExerciceId(id);
		setShowParamsExercice(true);
	};
	const handleReset = () => {
		setProgrammeId(null);
		setSeanceId(null);
		setExerciceId(null);
		setModeSeance("select");
		setModeExercice("select");
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
							<>
								<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
									<Button
										variant={modeSeance === "select" ? "contained" : "outlined"}
										onClick={() => setModeSeance("select")}
										sx={
											modeSeance === "select"
												? SX_TOGGLE_ACTIVE
												: SX_TOGGLE_INACTIVE
										}
									>
										Choisir existante
									</Button>
									<Button
										variant={modeSeance === "create" ? "contained" : "outlined"}
										onClick={() => setModeSeance("create")}
										sx={
											modeSeance === "create"
												? SX_TOGGLE_ACTIVE
												: SX_TOGGLE_INACTIVE
										}
									>
										Créer nouvelle
									</Button>
								</Box>
								{modeSeance === "select" ? (
									<SelectSeance onSuccess={handleSeanceSuccess} />
								) : (
									<FormSeances
										programmeId={programmeId ?? undefined}
										onSuccess={handleSeanceSuccess}
									/>
								)}
							</>
						)}
						{activeStep === 2 && seanceId && (
							<>
								<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
									<Button
										variant={
											modeExercice === "select" ? "contained" : "outlined"
										}
										onClick={() => setModeExercice("select")}
										sx={
											modeExercice === "select"
												? SX_TOGGLE_ACTIVE
												: SX_TOGGLE_INACTIVE
										}
									>
										Choisir existant
									</Button>
									<Button
										variant={
											modeExercice === "create" ? "contained" : "outlined"
										}
										onClick={() => setModeExercice("create")}
										sx={
											modeExercice === "create"
												? SX_TOGGLE_ACTIVE
												: SX_TOGGLE_INACTIVE
										}
									>
										Créer nouveau
									</Button>
								</Box>
								{modeExercice === "select" ? (
									<SelectExercice onSuccess={handleExerciceSuccess} />
								) : (
									<FormExercices onSuccess={handleExerciceSuccess} />
								)}
								{showParamsExercice && exerciceId && seanceId && (
									<FormSeanceExercice
										seanceId={seanceId}
										exerciceId={exerciceId}
										modeExercice={modeExercice}
										onSuccess={() => setShowParamsExercice(false)}
									/>
								)}
								<Box sx={{ display: "flex", gap: 2, mt: 3 }}>
									<Button
										onClick={() => setActiveStep(2)}
										sx={SX_TOGGLE_INACTIVE}
									>
										Ajouter un autre exercice
									</Button>
									<Button onClick={handleNewSeance} sx={SX_TOGGLE_INACTIVE}>
										Ajouter une autre séance
									</Button>
									<Button onClick={handleFinish} sx={SX_TOGGLE_ACTIVE}>
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
