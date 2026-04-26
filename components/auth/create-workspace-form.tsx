"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "h-12 w-full rounded-[16px] border border-[#e7dfd3] bg-white px-4 text-sm text-[#1f1a16] outline-none transition focus:border-[#cdb89f] focus:ring-2 focus:ring-[#efe3d3]";

export function CreateWorkspaceForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboarding/create-church", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "목장월드 공간을 만드는 중 오류가 발생했습니다.");
      }

      router.push(data.redirectTo || "/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "목장월드 공간을 만드는 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="workspace-name" className="text-sm font-medium text-[#3f372d]">
          목장월드 이름
        </label>
        <input
          id="workspace-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="예: 우리 목장, 기쁨교회 청년목장"
          className={inputClass}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#2e2419] px-5 text-sm font-medium text-white transition hover:bg-[#473425] disabled:opacity-60"
      >
        {isSubmitting ? "만드는 중..." : "내 목장월드 만들기"}
      </button>

      {error ? <p className="text-sm text-[#b24b3f]">{error}</p> : null}
    </form>
  );
}
