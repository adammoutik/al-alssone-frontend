import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Fee {
  type: string;
  amount: number;
  description: string;
  frequency: string;
}

interface Payment {
  amount: number;
  date: string;
  status: string;
  period: string;
  fees: Fee[];
}

interface StudentPaymentData {
  _id: string;
  firstName: string;
  lastName: string;
  category: string;
  niveau: string;
  payments: Payment[];
}

export default function StudentPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = (location.state as { studentData: StudentPaymentData })?.studentData;

  const exportToPDF = () => {
    if (!studentData) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Paiements de ${studentData.firstName} ${studentData.lastName}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Niveau: ${studentData.niveau} — Catégorie: ${studentData.category}`, 14, 30);

    let currentY = 40;
    studentData.payments.forEach((payment, index) => {
      doc.setFontSize(14);
      doc.text(`Paiement #${index + 1}`, 14, currentY);
      currentY += 6;

      doc.setFontSize(12);
      doc.text(`Période : ${payment.period}`, 14, currentY);
      currentY += 6;
      doc.text(`Date : ${new Date(payment.date).toLocaleDateString()}`, 14, currentY);
      currentY += 6;
      doc.text(`Montant total : ${payment.amount} MAD`, 14, currentY);
      currentY += 6;
      doc.text(`Statut : ${payment.status}`, 14, currentY);
      currentY += 8;

      const feeRows = payment.fees.map((fee) => [
        fee.type,
        fee.frequency,
        `${fee.amount} MAD`,
        fee.description,
      ]);

      doc.autoTable({
        head: [["Type", "Fréquence", "Montant", "Description"]],
        body: feeRows,
        startY: currentY,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
        theme: "grid",
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save(`Paiements_${studentData.firstName}_${studentData.lastName}.pdf`);
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-xl font-medium">Aucune donnée étudiant disponible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with student info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {studentData.firstName} {studentData.lastName}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm md:text-base">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                  Niveau: {studentData.niveau}
                </span>
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                  Catégorie: {studentData.category}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exporter PDF
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {studentData.payments.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-700">Aucun paiement enregistré</h3>
              <p className="mt-1 text-gray-500">Cet étudiant n'a aucun historique de paiement.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Historique des paiements</h2>
              
              {studentData.payments.map((payment, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Payment header */}
                  <div className={`flex flex-wrap justify-between items-center p-4 ${payment.status === "paid" ? "bg-green-50" : payment.status === "late" ? "bg-red-50" : "bg-yellow-50"}`}>
                    <div>
                      <h3 className="font-medium text-gray-800">Paiement #{idx + 1}</h3>
                      <p className="text-sm text-gray-600">{payment.period}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === "paid" ? "bg-green-100 text-green-800" : payment.status === "late" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {payment.status}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {payment.amount} MAD
                      </span>
                    </div>
                  </div>

                  {/* Payment details */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">{payment.amount} MAD</p>
                      </div>
                    </div>

                    {/* Fees table */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Détails des frais</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fréquence</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {payment.fees.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                                  Aucun frais détaillé
                                </td>
                              </tr>
                            ) : (
                              payment.fees.map((fee, idxFee) => (
                                <tr key={idxFee}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{fee.type}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{fee.frequency}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">{fee.amount} MAD</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{fee.description}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}