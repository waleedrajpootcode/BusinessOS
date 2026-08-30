function NotificationPanel({ notifications }) {
  return (
    <div
      className="
        group
        relative
        w-full
        min-w-0
        overflow-hidden
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-4
        sm:p-6
        mt-6
        transition-all
        duration-300
        hover:shadow-lg
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
          from-blue-700
          via-blue-500
          to-cyan-400
        "
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">

        <div className="min-w-0">

          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Notifications
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Important updates and business alerts.
          </p>

        </div>

        {notifications.length > 0 && (
          <span
            className="
              shrink-0
              min-w-7
              h-7
              px-2
              rounded-full
              bg-blue-50
              text-blue-600
              text-xs
              font-bold
              flex
              items-center
              justify-center
            "
          >
            {notifications.length}
          </span>
        )}

      </div>

      {/* Notifications */}
      <div className="space-y-2">

        {notifications.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-200
              bg-slate-50
              px-4
              py-8
              text-center
            "
          >

            <div className="text-2xl mb-2">
              ✓
            </div>

            <p className="text-sm font-semibold text-slate-600">
              All caught up
            </p>

            <p className="text-xs text-slate-400 mt-1">
              You don't have any new notifications.
            </p>

          </div>

        ) : (

          notifications.map((n, index) => (

            <div
              key={index}
              className={`
                flex
                items-start
                gap-3
                p-4
                rounded-xl
                border
                transition
                duration-200
                ${
                  n.type === "warning"
                    ? "bg-amber-50 border-amber-100 hover:bg-amber-100/70"
                    : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/70"
                }
              `}
            >

              {/* Status Indicator */}
              <div
                className={`
                  w-2
                  h-2
                  mt-2
                  rounded-full
                  shrink-0
                  ${
                    n.type === "warning"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }
                `}
              />

              {/* Message */}
              <p
                className={`
                  text-sm
                  font-medium
                  leading-6
                  break-words
                  ${
                    n.type === "warning"
                      ? "text-amber-900"
                      : "text-emerald-900"
                  }
                `}
              >
                {n.message}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default NotificationPanel;