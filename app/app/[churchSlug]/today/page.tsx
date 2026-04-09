import { redirect } from "next/navigation";

export default function ChurchTodayPage({ params }: { params: { churchSlug: string } }) {
  redirect(`/app/${params.churchSlug}/chat`);
}
