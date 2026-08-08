function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-2xl font-bold">

            {title}

          </h2>

          <button

            onClick={onClose}

            className="text-gray-500 hover:text-red-600 text-2xl"

          >

            ✕

          </button>

        </div>

        {/* Body */}

        <div className="p-6 overflow-y-auto flex-1">

          {children}

        </div>

      </div>

    </div>

  );

}

export default Modal;