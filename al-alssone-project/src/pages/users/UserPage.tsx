import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserSection from "../../components/users/UserSection";

export default function UserPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
          <UserSection />
      </div>
    </>
  );
}
