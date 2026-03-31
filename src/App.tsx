import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import DashboardCoach from "./pages/DashboardCoach";
import DashboardEleves from "./pages/DashboardEleves";
import ExercicesPage from "./pages/ExercicesPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import NouveauProgramme from "./pages/NouveauProgramme";
import NouvelExercicePage from "./pages/NouvelExercicePage";
import Programmes from "./pages/Programmes";

function ProtectedRoute() {
	const { token } = useAuth();
	return token ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/login" element={<Login />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard-coach" element={<DashboardCoach />} />
				<Route path="/dashboard-eleves" element={<DashboardEleves />} />
				<Route path="/exercices" element={<ExercicesPage />} />
				<Route path="/exercices/nouveau" element={<NouvelExercicePage />} />
				<Route path="/programmes" element={<Programmes />} />
				<Route path="/programmes/nouveau" element={<NouveauProgramme />} />
			</Route>
		</Routes>
	);
}

export default App;
