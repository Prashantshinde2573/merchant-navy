import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_EMAIL, DEMO_OTP } from '../../context/AuthContext';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = sendOtp(email);
      setLoading(false);
      if (res.success) {
        setStep('otp');
        setError('');
      } else {
        setError(res.message);
      }
    }, 250);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = verifyOtp(otp, email);
      setLoading(false);
      if (res.success) {
        navigate('/home', { replace: true });
      } else {
        setError(res.message);
      }
    }, 250);
  };

  return (
    <main className="min-h-screen w-full text-white">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_720px]">
        <section
          className="hidden min-h-screen bg-cover bg-center lg:block"
          aria-hidden="true"
          style={{ backgroundImage: "url('/images/auth_image.webp')" }}
        ></section>

        <section className="bg-blue-25 flex min-h-screen w-full items-center justify-center px-6">
          <div className="flex w-full max-w-105 flex-col items-center gap-6 text-center">
            <img
              alt="Merchant Navy"
              width="180"
              height="48"
              decoding="async"
              className="h-12 w-auto object-contain cursor-pointer"
              src="/images/logo.png"
            />

            {error && (
              <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-left flex items-center gap-2">
                <span className="material-symbols-outlined text-sm shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            {step === 'email' ? (
              <>
                <div className="space-y-2">
                  <h1 className="text-content1-foreground text-2xl leading-8 font-semibold">
                    Sign in to your account
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Demo email: <strong className="text-blue-800 font-mono">shivhare.yuvraj@gmail.com</strong>
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
                  <div className="group flex flex-col relative justify-end w-full" data-slot="base" data-filled="true" data-filled-within="true">
                    <div data-slot="main-wrapper" className="h-full flex flex-col">
                      <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 h-12 min-h-12 border border-cyan-100 shadow-neutral-sm rounded-lg bg-blue-25" style={{ cursor: "text" }}>
                        <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                          <input
                            data-slot="input"
                            data-type="email"
                            className="w-full bg-transparent outline-none border-none text-medium placeholder:text-base placeholder:leading-6 placeholder:font-medium placeholder:text-foreground-400 leading-6 font-medium caret-content1-foreground text-content1-foreground"
                            aria-label="Email"
                            autoComplete="email"
                            placeholder="Email"
                            inputMode="email"
                            tabIndex="0"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    tabIndex="0"
                    disabled={loading}
                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden px-6 min-w-24 h-12 text-medium gap-3 rounded-large bg-primary text-primary-foreground hover:opacity-90 w-full transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Continue"}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(DEMO_EMAIL);
                        setError("");
                      }}
                      className="text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                    >
                      Fill Demo Email
                    </button>
                    <a className="block text-sm text-neutral-400 transition hover:text-neutral-600" href="#forgot">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h1 className="text-content1-foreground text-2xl leading-8 font-semibold">
                    Enter verification code
                  </h1>
                  <p className="text-xs text-neutral-500">
                    Enter the 6-digit OTP code sent to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-blue-800 bg-blue-50 py-1 px-3 rounded-full font-mono font-bold inline-block">
                    Demo OTP: 123456
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="w-full space-y-4">
                  <div className="group flex flex-col relative justify-end w-full" data-slot="base">
                    <div data-slot="main-wrapper" className="h-full flex flex-col">
                      <div data-slot="input-wrapper" className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-xs px-3 gap-3 h-12 min-h-12 border border-cyan-100 shadow-neutral-sm rounded-lg bg-blue-25">
                        <div data-slot="inner-wrapper" className="inline-flex w-full items-center h-full box-border">
                          <input
                            data-slot="input"
                            className="w-full bg-transparent outline-none border-none text-center tracking-widest text-lg font-bold caret-content1-foreground text-content1-foreground placeholder:text-sm placeholder:tracking-normal placeholder:font-normal placeholder:text-foreground-400"
                            aria-label="OTP"
                            placeholder="Enter 6-digit OTP (123456)"
                            maxLength={6}
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "")) }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    tabIndex="0"
                    disabled={loading}
                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal overflow-hidden px-6 min-w-24 h-12 text-medium gap-3 rounded-large bg-primary text-primary-foreground hover:opacity-90 w-full transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setError("");
                      }}
                      className="text-neutral-500 hover:text-neutral-800 cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(DEMO_OTP);
                        setError("");
                      }}
                      className="text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                    >
                      Fill Demo OTP
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
