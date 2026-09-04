import TrackScreen from "@/app/screens/TrackScreen";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; justSubmitted?: string }>;
}) {
  const params = await searchParams;
  return (
    <TrackScreen
      initialId={params.id}
      justSubmitted={params.justSubmitted === "true"}
    />
  );
}
