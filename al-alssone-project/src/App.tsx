import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";


// import Calendar from "./pages/Calendar";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
// import  StudentsSection  from "./components/students/StudentsSection";
// import StudentPage from "./pages/Tables/StudentPage";
// import StudentsSection from "./components/students/StudentsSection";
import StudentPage from "./pages/Tables/StudentPage";
import UserPage from "./pages/users/UserPage";
import FeePage from "./pages/fees/FeePage";
import FamilyPage from './pages/families/FamilyPage';
import PaymentPage from "./pages/payments/PaymentPage";
import PaymentsHistory from "./components/Historique/PaymentsHistory";
import NotificationPage from "./pages/notifications/NotificationPage";
import UserProfile from "./components/UserProfile/UserProfile";
import StudentsList from "./components/students/StudentsList";
import StudentForm from "./components/students/StudentForm";
import CreateStudentPage from "./components/students/StudentForm";
import StudentsListPage from "./components/students/StudentsList";
import AcceuilPage from "./pages/acceuil/AcceuilPage";
import Acceuil from "./components/acceuil/acceuil";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/fees" element={<FeePage />} />

            <Route path="/students" element={<StudentPage />} />
        <Route path="/students/create" element={<CreateStudentPage />} />
        <Route path="/students" element={<StudentsListPage />} />

            <Route path="/families" element={<FamilyPage />} />


            <Route path="/payments" element={<PaymentPage />} />

             <Route path="/Historique" element={<PaymentsHistory />} />





            <Route path="/users" element={<UserPage />} />




            <Route path="/notifications" element={<NotificationPage />} />










           

        
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/acceuil" element={<Acceuil />} />


        </Routes>
      </Router>
    </>
  );
}
