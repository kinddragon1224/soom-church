import { redirect } from "next/navigation";

export default function LegacyBlogPreviewPage({ params }: { params: { churchSlug: string; id: string } }) {
  redirect(`/app/${params.churchSlug}/records/${params.id}/preview`);
}
