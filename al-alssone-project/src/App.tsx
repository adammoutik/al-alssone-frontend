import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import StudentPage from "./pages/Tables/StudentPage";
import UserPage from "./pages/users/UserPage";
import FeePage from "./pages/fees/FeePage";
import FamilyPage from './pages/families/FamilyPage';
import PaymentPage from "./pages/payments/PaymentPage";
import PaymentsHistory from "./components/Historique/PaymentsHistory";
import NotificationPage from "./pages/notifications/NotificationPage";
import StudentForm from "./components/students/StudentForm";
import StudentsListPage from "./components/students/StudentsList";
import StudentPaymentsPage from "./components/students/StudentPaymentsPage";
import { TranslationProvider } from "./context/TranslationContext"; 
import Accueil from "./components/acceuil/Acceuil";

export default function App() {
  return (
    <TranslationProvider> 
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/fees" element={<FeePage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/students/create" element={<StudentForm />} />
            <Route path="/students/list" element={<StudentsListPage />} />
            <Route path="/families" element={<FamilyPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/Historique" element={<PaymentsHistory />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route index path="/acceuil" element={<Accueil />} />
          <Route path="/public/student/payments/:studentCode" element={<StudentPaymentsPage />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}