import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PaymentsHistory from "../../components/Historique/PaymentsHistory";


export default function PaymentPage() {
  return (
    <>
      
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
      <PaymentsHistory />
      </div>
    
    </>
  );
}
