import RecordScreen from "@/app/screens/RecordScreen";

export default async function RecordPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const initialMode = params.mode === "text" ? "text" : "voice";
  return <RecordScreen initialMode={initialMode} />;
}
