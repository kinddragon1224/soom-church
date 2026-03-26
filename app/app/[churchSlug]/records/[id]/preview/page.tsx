import { notFound } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getChurchBlogPost } from "@/lib/blog-data";

function parseContent(contentJson: string) {
  try {
    return JSON.parse(contentJson) as {
      hero?: string;
      sections?: { heading?: string; body?: string; imageUrl?: string; imageCaption?: string }[];
    };
  } catch {
    return { hero: "", sections: [] };
  }
}

export default async function BlogPreviewPage({ params }: { params: { churchSlug: string; id: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const post = await getChurchBlogPost(membership.church.id, params.id);
  if (!post) notFound();

  const content = parseContent(post.contentJson);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 text-[#111111]">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">BLOG PREVIEW</p>
        <h1 className="mt-3 text-[2.3rem] font-semibold tracking-[-0.06em] text-[#111111]">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-base leading-7 text-[#5f564b]">{post.excerpt}</p> : null}
        {post.coverImageUrl ? <img src={post.coverImageUrl} alt={post.title} className="mt-6 w-full rounded-[22px] border border-[#ece6dc] object-cover" /> : null}
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        {content.hero ? <p className="text-lg leading-8 text-[#2b241c]">{content.hero}</p> : null}
        <div className="mt-6 grid gap-8">
          {(content.sections ?? []).map((section, index) => (
            <article key={index} className="grid gap-4">
              {section.heading ? <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{section.heading}</h2> : null}
              {section.imageUrl ? (
                <div className="grid gap-2">
                  <img src={section.imageUrl} alt={section.imageCaption || section.heading || `section-${index + 1}`} className="w-full rounded-[20px] border border-[#ece6dc] object-cover" />
                  {section.imageCaption ? <p className="text-sm text-[#8C7A5B]">{section.imageCaption}</p> : null}
                </div>
              ) : null}
              {section.body ? <p className="whitespace-pre-wrap text-base leading-8 text-[#3f3528]">{section.body}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
