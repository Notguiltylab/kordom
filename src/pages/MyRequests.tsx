import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getRequestsBySeeker } from '../services/requests';
import { getListingById } from '../services/listings';
import { getInterpreterById } from '../services/interpreters';
import { Badge } from '../components/common/Badge';
import type { Lang } from '../types';

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning'> = {
  requested: 'warning',
  in_review: 'default',
  completed: 'success',
  cancelled: 'default',
};

export function MyRequests() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const { user } = useAuth();
  if (!user) return null;

  const requests = getRequestsBySeeker(user.id);

  return (
    <div className="section">
      <h1>{t('myRequestsPage.title')}</h1>
      {requests.length === 0 ? (
        <p className="empty-state">{t('myRequestsPage.noRequests')}</p>
      ) : (
        <div className="request-list">
          {requests.map((r) => {
            const listing = getListingById(r.listingId);
            return (
              <div key={r.id} className="request-row">
                <div className="request-row-main">
                  <span className="tag tag-muted">
                    {r.type === 'contact' && t('myRequestsPage.typeContact')}
                    {r.type === 'visit' && t('myRequestsPage.typeVisit')}
                    {r.type === 'rights_report' && t('myRequestsPage.typeRights')}
                  </span>
                  <strong>{listing?.title[lang] ?? r.listingId}</strong>
                  {r.type === 'visit' && (
                    <span className="request-detail">
                      {r.visitDate} {r.visitTime}
                      {r.needsInterpreter && r.interpreterId && ` · ${getInterpreterById(r.interpreterId)?.name}`}
                    </span>
                  )}
                  {r.type === 'contact' && <span className="request-detail">{r.message}</span>}
                  {r.type === 'rights_report' && (
                    <span className="request-detail">
                      {(r.feeKrw * 10000).toLocaleString()}{t('common.won')}
                    </span>
                  )}
                </div>
                <div className="request-row-side">
                  <Badge tone={STATUS_TONE[r.status]}>{t(`requestStatus.${r.status}`)}</Badge>
                  {listing && (
                    <Link to={`/listings/${listing.id}`} className="link-more">
                      {t('myRequestsPage.viewListing')}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
