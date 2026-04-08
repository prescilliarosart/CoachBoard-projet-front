import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardCoach from "./pages/DashboardCoach";
import DashboardEleves from "./pages/DashboardEleves";
import ExercicesPage from "./pages/ExercicesPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import MonSuivi from "./pages/MonSuivi";
import NouveauProgramme from "./pages/NouveauProgramme";
import NouvelExercicePage from "./pages/NouvelExercicePage";
import NouvelleSeance from "./pages/NouvelleSeance";
import MonProgramme from "./pages/ProgrammeEleve";
import Programmes from "./pages/Programmes";
import Seances from "./pages/Seances";

function ProtectedRoute({
	allowedRoles,
}: {
	allowedRoles?: ("coach" | "eleve")[];
}) {
	const { token, user } = useAuth();

	if (!token) {
		return <Navigate to="/login" />;
	}

	if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}
function ProtectedCoach() {
	return <ProtectedRoute allowedRoles={["coach"]} />;
}

function ProtectedEleve() {
	return <ProtectedRoute allowedRoles={["eleve"]} />;
}
function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<Login />} />
			<Route element={<ProtectedCoach />}>
				<Route path="/dashboard-coach" element={<DashboardCoach />} />

				<Route path="/exercices" element={<ExercicesPage />} />
				<Route path="/exercices/nouveau" element={<NouvelExercicePage />} />

				<Route path="/programmes" element={<Programmes />} />
				<Route path="/programmes/nouveau" element={<NouveauProgramme />} />
				<Route path="/seances" element={<Seances />} />
				<Route path="/seances/nouvelle" element={<NouvelleSeance />} />
			</Route>
			<Route element={<ProtectedEleve />}>
				<Route path="/mon-programme" element={<MonProgramme />} />
				<Route path="/mon-suivi" element={<MonSuivi />} />
				<Route path="/dashboard-eleves" element={<DashboardEleves />} />
			</Route>
		</Routes>
	);
}

export default App;
