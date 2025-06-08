import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserProfile from "../../components/UserProfile/UserProfile";


export default function UserPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
      <UserProfile />
      </div>
    </>
  );
}
