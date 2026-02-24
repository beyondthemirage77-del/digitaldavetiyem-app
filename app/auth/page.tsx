"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/lib/auth";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

const registerSchema = loginSchema
  .extend({
    fullName: z.string().min(2, "Ad en az 2 karakter olmalı"),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleEmailSubmit = async (data: LoginFormData | RegisterFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmail(data.email, data.password);
      } else {
        await signUpWithEmail(
          data.email,
          data.password,
          (data as RegisterFormData).fullName
        );
      }
      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Bir hata oluştu. Tekrar deneyin.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitError(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google ile giriş başarısız.";
      setSubmitError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setSubmitError(null);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(180deg, #fdfbf7 0%, #fafaf8 50%, #ffffff 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-[#f0f0f0]/80 p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-2xl font-semibold text-[#171717]">
                  Giriş Yap
                </h1>
                <form
                  onSubmit={loginForm.handleSubmit(handleEmailSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="E-posta"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...loginForm.register("password")}
                      type="password"
                      placeholder="Şifre"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  {submitError && (
                    <p className="text-sm text-red-600/90">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-[12px] bg-[#171717] text-white font-medium transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Giriş Yap"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-2xl font-semibold text-[#171717]">
                  Kayıt Ol
                </h1>
                <form
                  onSubmit={registerForm.handleSubmit(handleEmailSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      {...registerForm.register("fullName")}
                      type="text"
                      placeholder="Ad Soyad"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {registerForm.formState.errors.fullName && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="E-posta"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...registerForm.register("password")}
                      type="password"
                      placeholder="Şifre"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...registerForm.register("confirmPassword")}
                      type="password"
                      placeholder="Şifre Tekrar"
                      className="w-full px-4 py-3 rounded-[12px] bg-[#f5f5f5] border border-transparent focus:border-[#171717]/20 focus:bg-white focus:outline-none transition-all duration-300 text-[#171717] placeholder:text-[#a3a3a3]"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-600/90">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  {submitError && (
                    <p className="text-sm text-red-600/90">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-[12px] bg-[#171717] text-white font-medium transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Kayıt Ol"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e5e5]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#737373]">veya</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 rounded-[12px] bg-white border border-[#e5e5e5] text-[#171717] font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] hover:border-[#d4d4d4] disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Google ile Giriş
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-[#737373]">
            {mode === "login" ? (
              <>
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[#171717] font-medium hover:underline"
                >
                  Kayıt Olun
                </button>
              </>
            ) : (
              <>
                Zaten hesabınız var mı?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-[#171717] font-medium hover:underline"
                >
                  Giriş Yapın
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
