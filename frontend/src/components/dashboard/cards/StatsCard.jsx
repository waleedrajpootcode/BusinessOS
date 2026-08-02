function StatsCard({ title, value }) {
  return (

    <div className="
    bg-white
    rounded-xl
    shadow-sm
    border
    border-gray-200
    p-5
    min-w-0
    ">

      <h3 className="
      text-gray-500
      text-sm
      truncate
      ">

        {title}

      </h3>

      <p
      className="
      mt-2
      text-2xl
      sm:text-3xl
      font-bold
      break-words
      "
      >

        {value}

      </p>

    </div>

  );
}

export default StatsCard;