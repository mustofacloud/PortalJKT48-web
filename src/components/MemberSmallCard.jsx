export default function MemberSmallCard({ data }) {
  if (!data) return null;

  const { name, img } = data;

  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md transition">
      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-xs font-medium text-gray-700 text-center truncate">
        {name}
      </p>
    </div>
  );
}
