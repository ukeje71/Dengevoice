// Drop-in placeholder for real photography. Swap these out by replacing the
// <ImagePlaceholder> usage with a real <Image> (next/image) once you have
// photos   the `label` prop tells you what each spot expects.

export default function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center  rounded-sm border-2 border-dashed border-indigo/20 bg-indigo/[0.04] text-center ${className}`}
    >
      <div className="px-4 py-6">
        <svg
          className="mx-auto mb-2 h-7 w-7 text-indigo/30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="text-xs font-medium text-indigo/50">{label}</p>
      </div>
    </div>
  );
}
