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

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/users" element={<UserPage />} />

           

        
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

        </Routes>
      </Router>
    </>
  );
}
