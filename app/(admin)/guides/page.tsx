import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugifyKorean } from "@/lib/slug";
import Link from "next/link";

export const dynamic = "force-dynamic";

function parseImageLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({ imageUrl: line, sortOrder: index }));
}

async function getFirstAdmin() {
  return prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
}

export default async function GuidesAdminPage() {
  const posts = await prisma.guidePost.findMany({
    orderBy: [{ published: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: { author: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  async function createGuidePost(formData: FormData) {
    "use server";

    const title = String(formData.get("title") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();
    const imageUrls = String(formData.get("imageUrls") || "").trim();
    const published = formData.get("published") === "on";

    if (!title || !content) return;

    const author = await getFirstAdmin();
    if (!author) return;

    const baseSlug = slugifyKorean(title) || `guide-${Date.now()}`;
    let slug = baseSlug;
    let count = 1;

    while (await prisma.guidePost.findUnique({ where: { slug } })) {
      count += 1;
      slug = `${baseSlug}-${count}`;
    }

    await prisma.guidePost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImageUrl: coverImageUrl || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: author.id,
        images: {
          create: parseImageLines(imageUrls),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        actorId: author.id,
        action: "GUIDE_POST_CREATED",
        targetType: "GuidePost",
        metadata: JSON.stringify({ title, published }),
      },
    });

    revalidatePath("/ai-guides");
  }

  async function togglePublished(formData: FormData) {
    "use server";

    const postId = String(formData.get("postId") || "");
    if (!postId) return;

    const post = await prisma.guidePost.findUnique({ where: { id: postId } });
    if (!post) return;

    await prisma.guidePost.update({
      where: { id: postId },
      data: {
        published: !post.published,
        publishedAt: !post.published ? new Date() : null,
      },
    });

    revalidatePath("/ai-guides");
    revalidatePath(`/ai-guides/${post.slug}`);
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">AI 안내서 작성</h1>
            <p className="mt-1 text-sm text-muted-foreground">목회자와 사역자를 위한 AI 안내서를 블로그처럼 작성하고 발행해.</p>
          </div>
          <Link href="/ai-guides" className="text-sm font-medium text-primary">
            공개 페이지 보기
          </Link>
        </div>

        <form action={createGuidePost} className="mt-5 space-y-3">
          <input name="title" placeholder="제목" className="w-full rounded border border-border px-3 py-2 text-sm" required />
          <textarea name="excerpt" placeholder="짧은 소개글" className="min-h-24 w-full rounded border border-border px-3 py-2 text-sm" />
          <textarea name="content" placeholder="본문" className="min-h-[280px] w-full rounded border border-border px-3 py-2 text-sm" required />
          <input name="coverImageUrl" placeholder="대표 이미지 URL" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <textarea
            name="imageUrls"
            placeholder={"첨부 이미지 URL\n한 줄에 하나씩 입력"}
            className="min-h-24 w-full rounded border border-border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" /> 바로 발행</label>
          <button className="rounded bg-primary px-3 py-2 text-sm text-white">저장</button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold">안내서 목록</h2>
        <ul className="mt-4 space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-slate-900">{post.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.published ? "발행됨" : "초안"} · 작성자 {post.author.name}
                  </p>
                  {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">/ai-guides/{post.slug}</p>
                </div>
                <form action={togglePublished}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button className="rounded border border-border px-3 py-1.5 text-xs">
                    {post.published ? "비공개" : "발행"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>

        {posts.length === 0 ? (
          <form action={createGuidePost} className="mt-6 rounded-lg border border-dashed border-border bg-slate-50 p-4">
            <input type="hidden" name="title" value="목회자는 AI를 어디까지 사용해도 될까" />
            <input type="hidden" name="excerpt" value="AI가 목회를 대신하는 것이 아니라, 반복 업무를 덜어주고 더 본질적인 준비와 돌봄에 집중하도록 돕는 도구라는 관점에서 정리한 첫 안내서입니다." />
            <input
              type="hidden"
              name="content"
              value={`AI를 처음 접하는 목회자에게 가장 먼저 생기는 질문은 이것입니다. AI를 사용해도 괜찮을까, 그리고 어디까지 사용해야 할까.

이 질문은 단순히 기술을 쓸지 말지의 문제가 아닙니다. 설교와 양육, 심방과 돌봄처럼 사람의 영혼과 삶을 다루는 사역 안에서 AI가 어떤 자리에 있어야 하는지를 묻는 질문입니다.

먼저 분명히 해야 할 것은, AI는 목회를 대신할 수 없다는 점입니다. 말씀을 묵상하고 해석하고 기도하며 공동체를 사랑으로 돌보는 일은 결국 목회자의 몫입니다. AI는 그 중심을 대신하는 존재가 아니라, 그 중심을 더 잘 감당하도록 주변의 반복 업무를 덜어주는 보조 도구에 가깝습니다.

예를 들어 목회자는 AI를 통해 설교 개요를 여러 방식으로 정리해볼 수 있습니다. 같은 본문을 청년부 대상, 장년 대상, 새가족 대상 언어로 다시 풀어보게 할 수도 있습니다. 주보 문구 초안을 만들거나, 행사 안내문 첫 문장을 정리하거나, 심방 기록을 일정한 형식으로 요약하는 데에도 도움을 받을 수 있습니다.

하지만 그대로 복사해 사용하는 것은 조심해야 합니다. 특히 신학적으로 민감한 표현, 본문 해석, 공동체 상황에 직접 연결되는 조언은 반드시 목회자의 검토와 판단을 거쳐야 합니다. AI는 빠르게 문장을 만들 수 있지만, 공동체의 맥락과 영적 책임까지 이해하지는 못합니다.

건강한 기준은 이것입니다. 본질은 직접 붙들고, 반복은 도움받는다. 설교의 중심 메시지와 해석, 성도에 대한 책임 있는 돌봄, 교회의 방향을 세우는 일은 직접 감당해야 합니다. 반면 반복 정리, 초안 작성, 문장 다듬기, 아이디어 확장은 AI의 도움을 받아도 됩니다.

작은 교회일수록 이 기준은 더 유용합니다. 사람이 적고 해야 할 일은 많은 상황에서 AI는 시간을 벌어주는 도구가 될 수 있습니다. 주보 문구, 광고 요약, 교육 자료 초안, 새가족 안내문, 쇼츠 제목 후보 같은 작업을 줄여주면 목회자는 더 중요한 준비에 시간을 쓸 수 있습니다.

결국 중요한 것은 사용 여부보다 사용 방식입니다. AI를 의존의 대상이 아니라 정리 도구로 바라볼 때, 그것은 목회를 가볍게 만드는 기술이 아니라 사역의 부담을 덜어주는 보조 도구가 될 수 있습니다.

목회자가 AI를 사용할 때 가장 좋은 출발점은 거창한 자동화가 아닙니다. 지금 반복해서 쓰는 문서 하나, 자주 작성하는 문구 하나부터 AI로 정리해보는 것입니다. 작은 반복 하나가 줄어들면, 생각보다 더 많은 여유가 생깁니다.`}
            />
            <input type="hidden" name="coverImageUrl" value="" />
            <input type="hidden" name="imageUrls" value="" />
            <input type="hidden" name="published" value="on" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">첫 AI 안내서 초안 바로 만들기</p>
              <p className="text-sm text-muted-foreground">아직 글이 없다면, 첫 글로 바로 쓸 수 있는 실전형 초안을 한 번에 생성할 수 있어.</p>
              <button className="rounded bg-primary px-3 py-2 text-sm text-white">첫 안내서 자동 생성</button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
