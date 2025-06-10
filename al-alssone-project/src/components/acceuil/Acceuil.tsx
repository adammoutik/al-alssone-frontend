import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLock, faUser, faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../public/images/logo/logo.png';
import api from '../../services/axios';
import { toast } from 'react-toastify';

interface StudentPaymentData {
  firstName: string;
  lastName: string;
  niveau: string;
  category: string;
  payments: {
    amount: number;
    date: Date;
    status: string;
    period: string;
    fees: {
      name: string;
      type: string;
      amount: number;
      description: string;
      frequency: string;
    }[];
  }[];
}

export default function Accueil() {
  const navigate = useNavigate();
  const [studentCode, setStudentCode] = useState('');
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentCode.trim()) {
      setError('Veuillez saisir un code étudiant');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/public/student/payments/${studentCode}`);

      if (response.data && response.data.length > 0) {
        const studentData: StudentPaymentData = response.data[0];
        navigate(`/public/student/payments/${studentCode}`, {
          state: { studentData },
        });
      } else {
        setError('Aucun paiement trouvé pour ce code étudiant');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      if (err.response?.status === 429) {
        setError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else if (err.response?.status === 404) {
        setError('Code étudiant invalide');
      } else {
        setError(err.response?.data?.message || 'Erreur de vérification');
      }
      toast.error(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 via-white-700 to-blue-600 flex flex-col">
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-lg shadow-lg py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo Al Aissens Scolaire Privé"
              className="h-14 w-auto object-contain"
            />
            <div className="hidden md:block border-l border-blue-300 h-10"></div>
          </div>

          {/* Buttons or guest input */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {!showGuestInput ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center md:justify-end">
                <button
                  onClick={() => navigate('/signin')}
                  className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white font-medium rounded-lg px-5 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  <FontAwesomeIcon icon={faLock} />
                  <span>Connexion Admin</span>
                </button>

                <button
                  onClick={() => {
                    setShowGuestInput(true);
                    setError('');
                    setStudentCode('');
                  }}
                  className="flex items-center justify-center space-x-2 bg-white/90 hover:bg-white text-blue-700 font-medium rounded-lg px-5 py-2.5 hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-md transition-all duration-300 w-full sm:w-auto"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Accès élève</span>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-lg">
                <form
                  onSubmit={handleGuestSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4"
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Entrez le code étudiant"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      className="text-blue-900 font-medium placeholder-blue-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full border border-blue-200"
                      autoFocus
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-3.5 text-blue-400">
                      <FontAwesomeIcon icon={faInfoCircle} title="Votre code étudiant vous a été fourni par l'administration" />
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-5 py-3 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                          <span>Vérification...</span>
                        </>
                      ) : (
                        <>
                          <span>Voir</span>
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGuestInput(false)}
                      className="text-blue-700 hover:text-blue-900 font-medium rounded-lg px-4 py-3 hover:bg-blue-50 focus:outline-none transition-all duration-200 w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
                {error && (
                  <p className="mt-2 text-center text-red-300 font-medium text-sm px-4 animate-fade-in">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
     <main
  className="flex-grow w-full bg-cover bg-center flex items-center justify-center px-24 text-center"
  style={{ backgroundImage: "url('/images/logo/background.jpg')" }}
>
<div className="bg-pink-100 bg-opacity-90 p-10 rounded-xl mr-auto">
    <h2 className="text-5xl font-extrabold text-blue-900 mb-6 leading-tight drop-shadow-lg">
         Bienvenue dans l'application de gestion
             </h2>
           <h2 className="text-5xl font-extrabold text-blue-900 mb-6 leading-tight drop-shadow-lg">
         
          des paiements de l'école Al Alssone.    </h2>
   
  </div>
</main>


      {/* Footer */}
      <footer className="bg-white/20 backdrop-blur-lg py-5 px-6">
        <div className="max-w-7xl mx-auto text-center text-blue-100 text-sm">
          <p>© {new Date().getFullYear()} Établissement Al Alssone Scolaire Privé. Tous droits réservés.</p>
          <p className="mt-1 text-xs opacity-80">Version 1.0.0</p>
        </div>
      </footer>
    </div>
  );
}