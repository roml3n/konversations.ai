"use client";

import React from "react";
import { createPortal } from "react-dom";

type Props = {
  onRequestClose: () => void;
};

type SubmitState = "idle" | "submitting" | "submitted" | "success";

const sr = (text: string) => (
  <span className="sr-only" aria-live="polite" aria-atomic="true">
    {text}
  </span>
);

export default function ContactModal({ onRequestClose }: Props) {
  const [mounted, setMounted] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const [submitState, setSubmitState] = React.useState<SubmitState>("idle");

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    email: "",
    about: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    // focus management
    const el = closeBtnRef.current;
    if (el) el.focus();
  }, []);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) onRequestClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.company.trim()) next.company = "Required";
    if (!form.email.trim()) next.email = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState("submitting");
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitState("submitted");
    await new Promise((r) => setTimeout(r, 450));
    setSubmitState("success");
    setTimeout(onRequestClose, 3000);
  };

  const inputBase =
    "w-full rounded-xl bg-black/5 text-neutral-900 placeholder:text-neutral-500 px-5 py-3 md:py-3.5 outline outline-1 outline-black/5 focus:outline-none focus:ring-2 focus:ring-[#0227F2]/40 font-sans tracking-tight";

  if (!mounted) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onMouseDown={handleBackdrop}
      className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 md:p-6 bg-black/50 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-black/10">
        {/* Close */}
        <button
          ref={closeBtnRef}
          onClick={onRequestClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#0227F2]/40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Body */}
        <div className="px-6 md:px-8 pt-12 md:pt-12 pb-8 md:pb-8">
          {submitState !== "success" ? (
            <>
              <div className="text-center mb-8 md:mb-10">
                <h2
                  id="contact-modal-title"
                  className="font-gotham text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-neutral-900"
                >
                  Discover Konversations in action
                </h2>
                <p className="font-sans text-base md:text-lg tracking-tight text-neutral-600 mt-4">
                  We’ll reach out to schedule a personalised demo.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4 font-sans tracking-tight"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative block" htmlFor="firstName">
                    <input
                      id="firstName"
                      name="firstName"
                      placeholder=" "
                      className={[
                        inputBase,
                        "peer placeholder-transparent",
                        errors.firstName ? "ring-2 ring-red-500/50" : "",
                      ].join(" ")}
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                      top-1/2 -translate-y-1/2 text-base
                      peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#0227F2]
                      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      First Name *
                    </span>
                  </label>
                  <label className="relative block" htmlFor="lastName">
                    <input
                      id="lastName"
                      name="lastName"
                      placeholder=" "
                      className={[
                        inputBase,
                        "peer placeholder-transparent",
                        errors.lastName ? "ring-2 ring-red-500/50" : "",
                      ].join(" ")}
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                      top-1/2 -translate-y-1/2 text-base
                      peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#0227F2]
                      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Last Name *
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative block" htmlFor="company">
                    <input
                      id="company"
                      name="company"
                      placeholder=" "
                      className={[
                        inputBase,
                        "peer placeholder-transparent",
                        errors.company ? "ring-2 ring-red-500/50" : "",
                      ].join(" ")}
                      value={form.company}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                      top-1/2 -translate-y-1/2 text-base
                      peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#0227F2]
                      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Company *
                    </span>
                  </label>
                  <label className="relative block" htmlFor="jobTitle">
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      placeholder=" "
                      className={[
                        inputBase,
                        "peer placeholder-transparent",
                      ].join(" ")}
                      value={form.jobTitle}
                      onChange={handleChange}
                    />
                    <span
                      className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                      top-1/2 -translate-y-1/2 text-base
                      peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#0227F2]
                      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Job Title
                    </span>
                  </label>
                </div>

                <label className="relative block" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    placeholder=" "
                    type="email"
                    className={[
                      inputBase,
                      "peer placeholder-transparent",
                      errors.email ? "ring-2 ring-red-500/50" : "",
                    ].join(" ")}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                    top-1/2 -translate-y-1/2 text-base
                    peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-[#0227F2]
                    peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Your Business Email *
                  </span>
                </label>

                <label className="relative block" htmlFor="about">
                  <textarea
                    id="about"
                    name="about"
                    placeholder=" "
                    rows={4}
                    className={[
                      inputBase,
                      "peer placeholder-transparent pt-6",
                    ].join(" ")}
                    value={form.about}
                    onChange={handleChange}
                  />
                  <span
                    className="pointer-events-none absolute left-5 text-neutral-500 transition-all duration-150 ease-out font-sans tracking-tight
                    top-5 text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0227F2]
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Tell us more about your company
                  </span>
                </label>

                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="bg-[#1600FF] hover:brightness-110 disabled:opacity-70 text-white font-sans font-medium rounded-full px-6 py-3 md:px-8 md:py-4 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0227F2]/40"
                  >
                    {submitState === "idle" && "Submit"}
                    {submitState === "submitting" && (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    )}
                    {submitState === "submitted" && (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Submitted
                      </>
                    )}
                    {sr(submitState)}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="h-14 w-14 rounded-full bg-[#1600FF] text-white flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-gotham text-2xl md:text-3xl text-neutral-900">
                Thanks for submitting
              </h3>
              <p className="font-sans text-neutral-600 mt-2 max-w-md">
                We’ll send a confirmation email shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
