import { Route, Routes } from "react-router-dom";
import DashboardCoach from "./pages/DashboardCoach";
import DashboardEleves from "./pages/DashboardEleves";
import ExercicesPage from "./pages/ExercicesPage";
import HomePage from "./pages/HomePage";
import NouvelExercicePage from "./pages/NouvelExercicePage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/dashboard-coach" element={<DashboardCoach />} />
			<Route path="/dashboard-eleves" element={<DashboardEleves />} />
			<Route path="/exercices" element={<ExercicesPage />} />
			<Route path="/exercices/nouveau" element={<NouvelExercicePage />} />
		</Routes>
	);
}

export default App;
