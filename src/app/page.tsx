"use client";

import { useEffect, useState, useCallback } from "react";
import { SiKakaotalk, SiYoutube, SiThreads, SiX } from "react-icons/si";
import { HiOutlineEnvelope } from "react-icons/hi2";

// 폼 검증: 순수 함수 (입력 → 유효 여부 + 필드별 에러)
function validateForm(payload: {
  name: string;
  email: string;
  message: string;
  consentAgreed: boolean;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const message = (payload.message || "").trim();

  if (!name || name.length < 1) errors.name = "이름을 입력해 주세요.";
  else if (name.length > 50) errors.name = "이름은 50자 이내로 입력해 주세요.";

  if (!email) errors.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "올바른 이메일 형식이 아닙니다.";

  if (message.length > 1000)
    errors.message = "문의 내용은 1000자 이내로 입력해 주세요.";

  if (!payload.consentAgreed)
    errors.consent = "개인정보 수집 및 마케팅 활용에 동의해 주세요.";

  return { valid: Object.keys(errors).length === 0, errors };
}

/* 로고(왼쪽) + 세로 구분선 + 텍스트(중앙) */
const LINK_LEFT_WIDTH = "w-[4.5rem]";
const LINK_BUTTON_CLASS =
  "flex w-full items-center rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-lg font-medium text-zinc-800 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-blue-900 dark:hover:bg-blue-950/30";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<"success" | "error" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // 테마: 마운트 시 localStorage + 시스템 선호 반영, html에 .dark 적용
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const preferDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && preferDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (_) {}
  }, []);

  // 모달 열림 시: 배경 스크롤 방지 + Escape 키로 닫기
  useEffect(() => {
    if (!modalOpen) return;
    document.body.style.overflow = "hidden";
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [modalOpen]);

  const showToastMessage = useCallback((type: "success" | "error") => {
    setToast(type);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-white">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col p-6">
        {/* 상단 테마 토글 */}
        <button
          type="button"
          aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
          onClick={() => setTheme(!isDark)}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-2xl shadow-sm transition-transform hover:scale-105 dark:bg-zinc-800 dark:shadow-none"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* 프로필 영역 - Connectra 스타일 어두운 카드 */}
        <div className="mt-10 rounded-3xl bg-zinc-700 px-6 pb-6 pt-6 dark:bg-zinc-800">
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/id/1005/300/300"
              alt="피스웍스 프로필"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-white/20"
            />
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
              피스웍스
            </h1>
            <p className="mt-1 text-center text-sm text-zinc-300">
              평화를 위한 사명
            </p>
          </div>
        </div>

        {/* 링크 영역 - 로고 + 세로 구분선 + 텍스트(중앙) */}
        <div className="mt-6 flex-1 space-y-3">
          <a href="#" className={LINK_BUTTON_CLASS} aria-label="오픈 카톡방">
            <div className={`flex shrink-0 items-center gap-3 ${LINK_LEFT_WIDTH}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-700">
                <SiKakaotalk className="h-5 w-5" aria-hidden />
              </span>
              <span className="h-8 w-px shrink-0 bg-zinc-300 dark:bg-zinc-600" aria-hidden />
            </div>
            <span className="flex-1 text-center">오픈 카톡방</span>
            <div className={`shrink-0 ${LINK_LEFT_WIDTH}`} aria-hidden />
          </a>
          <a href="#" className={LINK_BUTTON_CLASS} aria-label="Youtube">
            <div className={`flex shrink-0 items-center gap-3 ${LINK_LEFT_WIDTH}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-700">
                <SiYoutube className="h-5 w-5" aria-hidden />
              </span>
              <span className="h-8 w-px shrink-0 bg-zinc-300 dark:bg-zinc-600" aria-hidden />
            </div>
            <span className="flex-1 text-center">Youtube</span>
            <div className={`shrink-0 ${LINK_LEFT_WIDTH}`} aria-hidden />
          </a>
          <a href="#" className={LINK_BUTTON_CLASS} aria-label="Threads">
            <div className={`flex shrink-0 items-center gap-3 ${LINK_LEFT_WIDTH}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-700">
                <SiThreads className="h-5 w-5" aria-hidden />
              </span>
              <span className="h-8 w-px shrink-0 bg-zinc-300 dark:bg-zinc-600" aria-hidden />
            </div>
            <span className="flex-1 text-center">Threads</span>
            <div className={`shrink-0 ${LINK_LEFT_WIDTH}`} aria-hidden />
          </a>
          <a href="#" className={LINK_BUTTON_CLASS} aria-label="X">
            <div className={`flex shrink-0 items-center gap-3 ${LINK_LEFT_WIDTH}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-700">
                <SiX className="h-5 w-5" aria-hidden />
              </span>
              <span className="h-8 w-px shrink-0 bg-zinc-300 dark:bg-zinc-600" aria-hidden />
            </div>
            <span className="flex-1 text-center">X</span>
            <div className={`shrink-0 ${LINK_LEFT_WIDTH}`} aria-hidden />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-500 py-4 text-lg font-medium text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-[0.98]"
        >
          <HiOutlineEnvelope className="h-6 w-6 shrink-0" aria-hidden />
          문의하기
        </button>

        <p className="mt-12 pb-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © 피스웍스 • Peace Works
        </p>
      </div>

      {/* 문의하기 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal mx-4 mb-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900 md:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="modal-title" className="text-2xl font-semibold text-zinc-900 dark:text-white">
                문의하기
              </h2>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-2xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                ×
              </button>
            </div>

            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const payload = {
                  name: (form.name.value as string).trim(),
                  email: (form.email.value as string).trim(),
                  message: (form.message.value as string).trim(),
                  consentAgreed: (form.querySelector('input[name="consent"]') as HTMLInputElement)?.checked ?? false,
                };
                const result = validateForm(payload);
                if (!result.valid) {
                  setErrors(result.errors);
                  return;
                }
                setErrors({});
                setSubmitting(true);
                try {
                  const res = await fetch("/api/inquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: payload.name,
                      email: payload.email,
                      message: payload.message,
                    }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    showToastMessage("error");
                    setSubmitting(false);
                    return;
                  }
                  setModalOpen(false);
                  form.reset();
                  showToastMessage("success");
                } catch {
                  showToastMessage("error");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={50}
                  placeholder="이름을 입력하세요"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="example@email.com"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium"
                >
                  문의 내용
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="문의 내용을 입력하세요 (선택)"
                  className="resize-none rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
                  aria-invalid={!!errors.consent}
                />
                <label htmlFor="consent" className="text-sm text-zinc-600 dark:text-zinc-400">
                  개인정보 수집 및 마케팅 활용에 동의합니다. (필수)
                </label>
              </div>
              {errors.consent && (
                <p className="mt-1 text-sm text-red-500">{errors.consent}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-500 py-4 text-lg font-medium text-white transition-all hover:bg-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "전송 중..." : "보내기"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 성공 토스트 */}
      {toast === "success" && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-blue-500 px-8 py-4 text-white shadow-lg">
          <span className="font-medium">문의가 성공적으로 전송되었습니다!</span>
        </div>
      )}

      {/* 에러 토스트 */}
      {toast === "error" && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-red-500 px-8 py-4 text-white shadow-lg">
          <span className="font-medium">
            전송에 실패했습니다. 잠시 후 다시 시도해 주세요.
          </span>
        </div>
      )}
    </div>
  );
}
