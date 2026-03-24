import { requireWorkspaceMembership } from "@/lib/church-context";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { createBlogPost } from "../actions";

export default async function NewBlogPostPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  return (
    <div className="flex flex-col gap-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NEW POST</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">새 글 작성</h1>
      </div>
      <BlogEditorForm churchSlug={params.churchSlug} action={createBlogPost.bind(null, params.churchSlug)} />
    </div>
  );
}
