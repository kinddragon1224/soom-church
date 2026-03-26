import { redirect } from "next/navigation";

export default function LegacyBlogPage({ params }: { params: { churchSlug: string } }) {
  redirect(`/app/${params.churchSlug}/records`);
}
