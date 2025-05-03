import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CreateFee from "../../components/fees/CreateFee";

export default function UserPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
          <CreateFee />
      </div>
    </>
  );
}
