import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StudentsSection from "../../components/students/StudentsSection";

export default function StudentPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
          <StudentsSection />
      </div>
    </>
  );
}
