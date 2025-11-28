interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'alert',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 뒷배경 - 하얀색 블러 처리 */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        onClick={type === 'alert' ? handleConfirm : undefined}
      />

      {/* 모달 창 */}
      <div className="relative bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4 sm:mx-6 border border-gray-200">
        {/* 제목 */}
        {title && (
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            {title}
          </h3>
        )}

        {/* 메시지 */}
        <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6">{message}</p>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

