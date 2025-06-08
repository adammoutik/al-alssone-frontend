import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        identifier: emailOrUsername,
        password: password,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Connexion
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre nom d'utilisateur ou email et votre mot de passe pour vous connecter !
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label>
                Nom d'utilisateur ou email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Nom d'utilisateur ou email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Mot de passe <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-gray-900 text-white dark:bg-blue-600 dark:text-white"
                size="sm"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
