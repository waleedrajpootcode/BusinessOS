function StatsCard({ title, value }) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-5
        min-w-0
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        hover:border-slate-300
      "
    >

      {/* Accent Line */}
      <div
        className="
          absolute
          top-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          from-slate-900
          via-blue-600
          to-cyan-400
          opacity-90
        "
      />

      {/* Card Content */}
      <div className="relative">

        <p
          className="
            text-xs
            sm:text-sm
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
            truncate
          "
        >
          {title}
        </p>

        <p
          className="
            mt-3
            text-2xl
            sm:text-3xl
            font-bold
            tracking-tight
            text-slate-900
            break-words
          "
        >
          {value}
        </p>

      </div>

      {/* Subtle Hover Glow */}
      <div
        className="
          absolute
          -right-10
          -bottom-10
          w-24
          h-24
          rounded-full
          bg-blue-500/5
          blur-2xl
          transition-opacity
          duration-300
          group-hover:bg-blue-500/10
        "
      />

    </div>
  );
}

export default StatsCard;