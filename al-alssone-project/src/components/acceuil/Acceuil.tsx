import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../public/images/logo/logo.png'; // Import du logo

export default function Accueil() {
  const navigate = useNavigate();
  const [studentCode, setStudentCode] = useState('');
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [error, setError] = useState('');

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) {
      setError('Veuillez saisir un code étudiant');
      return;
    }
    navigate(`/public/student/payments/${studentCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-500 via-blue-600 to-blue-900 flex flex-col">
      {/* Header */}
      <header className="bg-white bg-opacity-20 backdrop-blur-md shadow-md py-5 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src={logo} 
              alt="Logo Al Aissens Scolaire Privé" 
              className="h-16 w-auto object-contain"
            />
            <div className="hidden md:block border-l border-[#4299e1] h-12"></div>
          </div>

          {/* Boutons ou saisie invité */}
          <div className="flex items-center space-x-6">
            {!showGuestInput ? (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none text-white font-semibold rounded-lg px-5 py-3 transition duration-300 shadow-md"
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
                  className="flex items-center space-x-2 bg-pink-100 text-blue-600 font-semibold rounded-lg px-5 py-3 hover:bg-pink-200 focus:ring-4 focus:ring-pink-300 focus:outline-none shadow-md transition duration-300"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Accès Invité</span>
                </button>
              </>
            ) : (
              <form
                onSubmit={handleGuestSubmit}
                className="flex items-center space-x-3 bg-white rounded-lg shadow-lg px-4 py-2"
              >
                <input
                  type="text"
                  placeholder="Entrez le code étudiant"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="text-blue-900 font-medium placeholder-blue-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200 w-56"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-3 flex items-center space-x-1 shadow-md transition duration-300"
                >
                  <span>Go</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuestInput(false)}
                  className="text-blue-600 hover:text-blue-800 font-semibold underline focus:outline-none"
                >
                  Annuler
                </button>
              </form>
            )}
          </div>
        </div>
        {error && (
          <p className="max-w-7xl mx-auto mt-2 text-center text-red-400 font-semibold text-sm px-8">
            {error}
          </p>
        )}
      </header>

      {/* Contenu principal */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Bienvenue dans l'application de gestion des paiements de l'école Al Alssone.
        </h2>
        <p className="text-lg text-blue-200 max-w-xl leading-relaxed select-none">
          Application sécurisée pour consulter et gérer facilement les paiements. Accès administrateur pour le personnel et accès invité pour les étudiants via code.
        </p>
      </main>

      {/* Pied de page */}
      <footer className="bg-white bg-opacity-20 backdrop-blur-md py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-blue-600 text-sm select-none">
          <p>© {new Date().getFullYear()} Système de gestion des paiements. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
