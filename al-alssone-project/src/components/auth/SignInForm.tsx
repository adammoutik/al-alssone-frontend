import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
//   autoComplete?: string;
// }

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Autofocus on username/email input on mount
    const input = document.getElementById("emailOrUsername");
    input?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic client-side validation
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        identifier: emailOrUsername,
        password: password,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error: any) {
      setErrorMessage("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen px-4">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="mb-3 font-semibold text-gray-900 dark:text-white text-2xl sm:text-3xl">
            Connexion
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Entrez votre nom d'utilisateur ou email et votre mot de passe pour vous connecter !
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <div>
              <Label htmlFor="emailOrUsername">
                Nom d'utilisateur ou email <span className="text-error-500">*</span>
              </Label>
              <Input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                placeholder="Nom d'utilisateur ou email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                autoComplete="username"
                required
                aria-invalid={!!errorMessage}
                aria-describedby="emailOrUsername-error"
              />
            </div>

            <div>
              <Label htmlFor="password">
                Mot de passe <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  aria-invalid={!!errorMessage}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-600 dark:fill-gray-400 w-5 h-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-600 dark:fill-gray-400 w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p
                id="form-error"
                role="alert"
                className="text-error-500 text-sm mt-1"
              >
                {errorMessage}
              </p>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                size="sm"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex justify-between items-center text-sm">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 dark:text-gray-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            ← Retour
          </button>
        
        </div>
      </div>
    </div>
  );
}
