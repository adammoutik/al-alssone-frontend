import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FamiliesSection from "../../components/families/FamiliesSection";

export default function FamilyPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
          <FamiliesSection />
      </div>
    </>
  );
}
