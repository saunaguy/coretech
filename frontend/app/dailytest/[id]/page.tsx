import { redirect } from "next/navigation";

export default function LegacyDailyDetailPage({ params }: { params: { id: string } }) {
  redirect(`/daily/${params.id}`);
}
