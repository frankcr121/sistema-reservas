"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { CredentialsPayload, LoginResponse } from "@/lib/types";

const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

const isProduction = process.env.NODE_ENV === "production"; 

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  
  
  const [showPassword, setShowPassword] = useState(false); 

  const [form, setForm] = useState<CredentialsPayload>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CredentialsPayload) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await api.login(form);
      setSession(response);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-xl flex-col justify-center px-4 py-12">
      <div className="glass-panel rounded-3xl p-8 shadow-lg"> {}
        <p className="tag mb-4 bg-surface-alt text-primary w-fit px-3 py-1 rounded-full text-xs font-medium">Ingreso seguro</p>
        <h1 className="text-3xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-slate-500">
          Usa las credenciales entregadas por la coordinación académica.
        </p>

        {}
        {!apiConfigured && !isProduction && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Configura la variable <code>NEXT_PUBLIC_API_BASE_URL</code> en tu archivo .env.local.
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              
              autoComplete="username" 
              value={form.username}
              onChange={handleChange("username")}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Ej: coordinacion"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <div className="relative mt-2"> {}
              <input
                id="password"
                name="password"
                
                type={showPassword ? "text" : "password"} 
                required
                
                autoComplete="current-password" 
                value={form.password}
                onChange={handleChange("password")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 pr-12" // pr-12 para dar espacio al icono
                placeholder="********"
              />
              
              {}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                   
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                   
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.68 0 1.356-.06 2-.17"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading && (
        
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Sin cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </section>
  );
}