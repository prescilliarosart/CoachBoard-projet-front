import { Route, Routes } from "react-router-dom";
import DashboardCoach from "./pages/DashboardCoach";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/dashboard-coach" element={<DashboardCoach />} />
		</Routes>
	);
}

export default App;
