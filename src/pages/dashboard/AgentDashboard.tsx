import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getListingsByAgent, createListing, updateListing, deleteListing } from '../../services/listings';
import { getRequestsForAgentListings } from '../../services/requests';
import { getInterpreterById } from '../../services/interpreters';
import { ListingForm } from '../../components/listing/ListingForm';
import type { ListingFormValues } from '../../components/listing/ListingForm';
import { Badge } from '../../components/common/Badge';
import type { AgentUser, Lang, Listing } from '../../types';

export function AgentDashboard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const { user } = useAuth();
  const agent = user as AgentUser;
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState<Listing | 'new' | null>(null);

  const myListings = useMemo(() => getListingsByAgent(agent.id), [agent.id, tick]);
  const requests = useMemo(() => getRequestsForAgentListings(myListings.map((l) => l.id)), [myListings, tick]);

  if (agent.approvalStatus !== 'approved') {
    return (
      <div className="section">
        <h1>{t('dashboard.pendingApprovalTitle')}</h1>
        <p>{agent.approvalStatus === 'rejected' ? t('dashboard.rejectedBody') : t('dashboard.pendingApprovalBody')}</p>
      </div>
    );
  }

  const handleSubmit = (values: ListingFormValues) => {
    if (editing && editing !== 'new') {
      updateListing(editing.id, values);
    } else {
      createListing({ ...values, agentId: agent.id });
    }
    setEditing(null);
    setTick((v) => v + 1);
  };

  return (
    <div className="section">
      <h1>{t('dashboard.agentTitle')}</h1>

      {editing ? (
        <ListingForm
          initial={editing !== 'new' ? editing : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <>
          <div className="section-header-row">
            <h2 className="section-title">{t('dashboard.myListings')}</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
              {t('dashboard.addListing')}
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <tbody>
                {myListings.map((l) => (
                  <tr key={l.id}>
                    <td>{l.title[lang]}</td>
                    <td>{l.region}</td>
                    <td>{t(`dealType.${l.dealType}`)}</td>
                    <td className="admin-table-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(l)}>
                        {t('dashboard.edit')}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          deleteListing(l.id);
                          setTick((v) => v + 1);
                        }}
                      >
                        {t('dashboard.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="section-title" style={{ marginTop: 32 }}>
            {t('dashboard.requestsForMyListings')}
          </h2>
          {requests.length === 0 ? (
            <p className="empty-state">{t('dashboard.noRequests')}</p>
          ) : (
            <div className="request-list">
              {requests.map((r) => {
                const listing = myListings.find((l) => l.id === r.listingId);
                return (
                  <div key={r.id} className="request-row">
                    <div className="request-row-main">
                      <span className="tag tag-muted">{r.type}</span>
                      <strong>{listing?.title[lang]}</strong>
                      {r.type === 'visit' && (
                        <span className="request-detail">
                          {r.visitDate} {r.visitTime}
                          {r.needsInterpreter && r.interpreterId && ` · ${getInterpreterById(r.interpreterId)?.name}`}
                        </span>
                      )}
                      {r.type === 'contact' && <span className="request-detail">{r.message}</span>}
                    </div>
                    <Badge>{t(`requestStatus.${r.status}`)}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
