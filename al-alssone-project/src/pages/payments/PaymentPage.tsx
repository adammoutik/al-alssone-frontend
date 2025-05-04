import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PaymentSection from "../../components/payments/PaymentSection";


export default function PaymentPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
      <PaymentSection />
      </div>
    </>
  );
}
