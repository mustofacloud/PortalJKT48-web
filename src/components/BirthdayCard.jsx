import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function BirthdayCard({ data }) {
  if (!data) return null;

  const { name, birthdate, img } = data;
  const formattedDate = dayjs(birthdate).format("DD MMMM");

  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-gray-700 to-gray-200 rounded-xl p-3 shadow-sm">
      <img
        src={img}
        alt={name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold text-white">{name}</h4>
        <p className="text-sm text-red-600">🎂 {formattedDate}</p>
      </div>
    </div>
  );
}
