import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const { t } = useTranslation();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
