import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";

import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Payments Managment Application |"
        description="This is an application of payments managments"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

        </div>

     

   
      </div>
    </>
  );
}
