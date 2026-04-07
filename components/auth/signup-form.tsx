type SignupFormProps = {
  error?: string;
};

const fieldClass =
  "h-12 rounded-[16px] border border-[#e8dece] bg-[#faf7f2] px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#aa9b8a] focus:border-[#111827] focus:bg-white";

const errorMessage: Record<string, string> = {
  required: "이름, 이메일, 비밀번호, 교회 이름을 모두 입력해 줘.",
  exists: "이미 가입된 이메일이야. 로그인하거나 다른 이메일을 써 줘.",
  weak_password: "비밀번호는 8자 이상으로 입력해 줘.",
};

export default function SignupForm({ error }: SignupFormProps) {
  return (
    <form action="/api/signup" method="post" className="grid gap-4">
      {error && errorMessage[error] ? (
        <div className="rounded-[14px] border border-[#f0d7d7] bg-[#fff7f7] px-3.5 py-3 text-center text-xs text-[#9a4a4a]">
          {errorMessage[error]}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 sm:col-span-1">
          <span className="text-[12px] font-medium text-[#6d6359]">이름</span>
          <input name="name" required placeholder="이름" className={fieldClass} />
        </label>

        <label className="grid gap-2 sm:col-span-1">
          <span className="text-[12px] font-medium text-[#6d6359]">이메일</span>
          <input name="email" type="email" required placeholder="이메일 주소" className={fieldClass} />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[12px] font-medium text-[#6d6359]">교회 이름</span>
          <input name="churchName" required placeholder="교회 또는 공동체 이름" className={fieldClass} />
        </label>

        <label className="grid gap-2 sm:col-span-1">
          <span className="text-[12px] font-medium text-[#6d6359]">직분 / 역할</span>
          <select name="role" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              역할 선택
            </option>
            <option value="PASTOR">목회자</option>
            <option value="ADMIN">행정 / 사무국</option>
            <option value="LEADER">리더 / 사역자</option>
            <option value="VIEWER">기타</option>
          </select>
        </label>

        <label className="grid gap-2 sm:col-span-1">
          <span className="text-[12px] font-medium text-[#6d6359]">부서 / 팀</span>
          <input name="ministry" placeholder="선택 입력" className={fieldClass} />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[12px] font-medium text-[#6d6359]">비밀번호</span>
          <input name="password" type="password" required placeholder="8자 이상" className={fieldClass} />
        </label>
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex h-11 items-center justify-center rounded-[14px] bg-[#222222] px-5 text-sm font-semibold text-white transition hover:bg-black"
      >
        무료로 시작하기
      </button>
    </form>
  );
}
