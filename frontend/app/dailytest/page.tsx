import { redirect } from "next/navigation";

export default function LegacyDailyTestPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const qs = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => v != null && qs.append(key, v));
    } else if (value != null) {
      qs.set(key, value);
    }
  });
  const suffix = qs.toString();
  redirect(`/daily/sets${suffix ? `?${suffix}` : ""}`);
}
