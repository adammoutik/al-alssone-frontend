import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PaymentsDashboard from "../../components/payments/PaymentSection";
// import PaymentSection from "../../components/payments/PaymentSection";


export default function PaymentPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
      <PaymentsDashboard />
      </div>
    
    </>
  );
}
