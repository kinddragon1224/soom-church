import { redirect } from "next/navigation";

export default function LegacyBlogNewPage({ params }: { params: { churchSlug: string } }) {
  redirect(`/app/${params.churchSlug}/records/new`);
}
