function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/50
        flex
        items-end
        sm:items-center
        justify-center
        p-0
        sm:p-4
      "
    >
      <div
        className="
          bg-white
          rounded-t-2xl
          sm:rounded-xl
          shadow-xl
          w-full
          max-w-3xl
          max-h-[95dvh]
          sm:max-h-[90dvh]
          flex
          flex-col
          overflow-hidden
        "
      >

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            p-4
            sm:p-6
            border-b
            shrink-0
          "
        >
          <h2 className="text-xl sm:text-2xl font-bold min-w-0 break-words">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              shrink-0
              min-h-11
              min-w-11
              flex
              items-center
              justify-center
              rounded-lg
              text-gray-500
              hover:text-red-600
              hover:bg-gray-100
              text-2xl
              transition
            "
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          className="
            p-4
            sm:p-6
            overflow-y-auto
            overflow-x-hidden
            flex-1
            min-h-0
          "
        >
          {children}
        </div>

      </div>
    </div>
  );
}

export default Modal;