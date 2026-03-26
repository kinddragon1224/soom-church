import { redirect } from "next/navigation";

export default function LegacyAiGuideDetailPage({ params }: { params: { slug: string } }) {
  redirect(`/blog/${params.slug}`);
}
