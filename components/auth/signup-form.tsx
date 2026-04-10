type SignupFormProps = {
  error?: string;
};

const fieldClass =
  "h-12 rounded-[16px] border border-[#E7E0D4] bg-white px-4 text-sm text-[#121212] outline-none placeholder:text-[#9A8C7C]";

export function SignupForm({ error }: SignupFormProps) {
  return (
    <form action="/api/signup" method="post" className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="identifier" className="text-sm font-medium text-[#3F372D]">
          아이디
        </label>
        <input id="identifier" name="identifier" autoComplete="username" className={fieldClass} placeholder="예: sunyong" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-[#3F372D]">
          이름
        </label>
        <input id="name" name="name" className={fieldClass} placeholder="이름을 입력해 주세요" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-[#3F372D]">
          비밀번호
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" className={fieldClass} placeholder="4자 이상" required minLength={4} />
      </div>

      {error ? <p className="rounded-[14px] bg-[#FFF3F3] px-4 py-3 text-sm text-[#9A4D4D]">{error}</p> : null}

      <button className="h-12 rounded-[16px] bg-[#111827] text-sm font-semibold text-white transition hover:bg-[#1f2937]">
        beta 계정 만들기
      </button>
    </form>
  );
}
