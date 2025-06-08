import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StudentsList from "../../components/students/StudentsList";

export default function StudentPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
          <StudentsList />
      </div>
    </>
  );
}
