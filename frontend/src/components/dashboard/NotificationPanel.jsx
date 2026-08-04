function NotificationPanel({ notifications }) {

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">

        Notifications

      </h2>

      <div className="space-y-3">

        {notifications.length === 0 ? (

          <p className="text-gray-500">

            No notifications

          </p>

        ) : (

          notifications.map((n, index) => (

            <div
              key={index}
              className={`p-3 rounded-lg ${
                n.type === "warning"
                  ? "bg-yellow-100"
                  : "bg-green-100"
              }`}
            >

              {n.message}

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default NotificationPanel;