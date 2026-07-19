import { useTranslation } from 'react-i18next';

/**
 * Placeholder for the future payment step. Intentionally disabled — see
 * src/services/payment.ts for the integration point a real PG SDK will replace.
 */
export function PaymentStub({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <button type="button" className="btn btn-disabled" disabled title={t('listingDetail.paymentComingSoon')}>
      {label} · {t('listingDetail.paymentComingSoon')}
    </button>
  );
}
