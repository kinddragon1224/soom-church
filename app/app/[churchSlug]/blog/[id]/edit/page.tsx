import { notFound } from "next/navigation";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getChurchBlogPost } from "@/lib/blog-data";
import { updateBlogPost } from "../../actions";

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string; id: string };
  searchParams?: { saved?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const post = await getChurchBlogPost(membership.church.id, params.id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-4 text-[#111111]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">EDIT POST</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{post.title}</h1>
        </div>
        {searchParams?.saved === "1" ? <span className="rounded-full bg-[#eefbf3] px-3 py-1 text-xs font-semibold text-[#2d7a46]">저장 완료</span> : null}
      </div>
      <BlogEditorForm action={updateBlogPost.bind(null, params.churchSlug, post.id)} value={post} />
    </div>
  );
}
