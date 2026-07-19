import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getListingById } from '../services/listings';
import { getInterpreters } from '../services/interpreters';
import { findUserById } from '../services/auth';
import { createContactRequest, createVisitRequest, createRightsReportRequest } from '../services/requests';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';
import { PaymentStub } from '../components/common/PaymentStub';
import { MapView } from '../components/map/MapView';
import type { Lang } from '../types';

const RIGHTS_REPORT_FEE = 5; // 만원 (demo figure)

type ActiveModal = 'contact' | 'visit' | 'rights' | null;

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const listing = id ? getListingById(id) : undefined;
  if (!listing) {
    return (
      <div className="section">
        <p>Listing not found.</p>
        <Link to="/listings">{t('listingDetail.backToList')}</Link>
      </div>
    );
  }

  const agent = findUserById(listing.agentId);
  const interpreters = getInterpreters();

  const requireLogin = (open: ActiveModal) => {
    if (!user) {
      showToast(t('listingDetail.loginRequired'));
      navigate('/login');
      return;
    }
    setActiveModal(open);
  };

  return (
    <div className="listing-detail">
      <Link to="/listings" className="back-link">
        ← {t('listingDetail.backToList')}
      </Link>

      <div className="listing-detail-grid">
        <div>
          <div className="listing-detail-photo">{listing.photos[0] ?? '🏠'}</div>
          <div className="listing-detail-tags">
            <span className="tag">{t(`dealType.${listing.dealType}`)}</span>
            <span className="tag tag-muted">{t(`roomType.${listing.roomType}`)}</span>
          </div>
          <h1>{listing.title[lang]}</h1>
          <p className="listing-detail-desc">{listing.description[lang]}</p>

          <div className="detail-facts">
            <div>
              <span>{t('listingDetail.deposit')}</span>
              <strong>{listing.deposit} {t('listingDetail.manwon')}</strong>
            </div>
            {listing.dealType === 'monthly' && (
              <div>
                <span>{t('listingDetail.monthlyRent')}</span>
                <strong>{listing.monthlyRent} {t('listingDetail.manwon')}</strong>
              </div>
            )}
            <div>
              <span>{t('listingDetail.area')}</span>
              <strong>{listing.areaM2}m²</strong>
            </div>
            <div>
              <span>{t('listingDetail.rooms')}</span>
              <strong>{listing.rooms}</strong>
            </div>
            <div>
              <span>{t('listingDetail.floor')}</span>
              <strong>{listing.floor}</strong>
            </div>
            <div>
              <span>{t('listingDetail.address')}</span>
              <strong>{listing.address}</strong>
            </div>
          </div>

          {listing.options.length > 0 && (
            <div className="detail-options">
              <span>{t('listingDetail.options')}</span>
              <div className="option-chips">
                {listing.options.map((o) => (
                  <span key={o} className="chip">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          {agent && (
            <p className="agency-line">
              {t('listingDetail.agencyLabel')}: {'agencyName' in agent ? agent.agencyName : agent.name}
            </p>
          )}

          <MapView center={[listing.lat, listing.lng]} zoom={14} height={260} markers={[{ id: listing.id, lat: listing.lat, lng: listing.lng }]} />
        </div>

        <aside className="listing-detail-actions">
          <button className="btn btn-primary btn-block" onClick={() => requireLogin('contact')}>
            {t('listingDetail.contactBtn')}
          </button>
          <button className="btn btn-outline btn-block" onClick={() => requireLogin('visit')}>
            {t('listingDetail.visitBtn')}
          </button>
          <button className="btn btn-outline btn-block" onClick={() => requireLogin('rights')}>
            {t('listingDetail.rightsReportBtn')}
          </button>
        </aside>
      </div>

      {activeModal === 'contact' && user && (
        <ContactModal
          onClose={() => setActiveModal(null)}
          onSubmit={(message) => {
            createContactRequest({ listingId: listing.id, seekerId: user.id, message });
            showToast(t('listingDetail.sentToast'));
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'visit' && user && (
        <VisitModal
          interpreters={interpreters}
          lang={lang}
          onClose={() => setActiveModal(null)}
          onSubmit={(payload) => {
            createVisitRequest({ listingId: listing.id, seekerId: user.id, ...payload });
            showToast(t('listingDetail.visitSentToast'));
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'rights' && user && (
        <RightsReportModal
          onClose={() => setActiveModal(null)}
          onSubmit={(note) => {
            createRightsReportRequest({ listingId: listing.id, seekerId: user.id, note, feeKrw: RIGHTS_REPORT_FEE });
            showToast(t('listingDetail.rightsReportSentToast'));
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}

function ContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (message: string) => void }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  return (
    <Modal title={t('listingDetail.contactModalTitle')} onClose={onClose}>
      <p className="modal-desc">{t('listingDetail.contactModalDesc')}</p>
      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('listingDetail.messagePlaceholder')}
      />
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          {t('common.cancel')}
        </button>
        <button className="btn btn-primary" disabled={!message.trim()} onClick={() => onSubmit(message)}>
          {t('listingDetail.send')}
        </button>
      </div>
    </Modal>
  );
}

function VisitModal({
  interpreters,
  lang,
  onClose,
  onSubmit,
}: {
  interpreters: ReturnType<typeof getInterpreters>;
  lang: Lang;
  onClose: () => void;
  onSubmit: (payload: { visitDate: string; visitTime: string; needsInterpreter: boolean; interpreterId?: string }) => void;
}) {
  const { t } = useTranslation();
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [needsInterpreter, setNeedsInterpreter] = useState<boolean | null>(null);
  const [interpreterId, setInterpreterId] = useState<string>('');

  const chosen = interpreters.find((i) => i.id === interpreterId);
  const canSubmit = visitDate && visitTime && needsInterpreter !== null && (!needsInterpreter || interpreterId);

  return (
    <Modal title={t('listingDetail.visitModalTitle')} onClose={onClose}>
      <label className="field-label">
        {t('listingDetail.visitDate')}
        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
      </label>
      <label className="field-label">
        {t('listingDetail.visitTime')}
        <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} />
      </label>

      <p className="field-label">{t('listingDetail.interpreterQuestion')}</p>
      <div className="radio-row">
        <label>
          <input type="radio" checked={needsInterpreter === true} onChange={() => setNeedsInterpreter(true)} />
          {t('listingDetail.interpreterYes')}
        </label>
        <label>
          <input type="radio" checked={needsInterpreter === false} onChange={() => setNeedsInterpreter(false)} />
          {t('listingDetail.interpreterNo')}
        </label>
      </div>

      {needsInterpreter && (
        <div className="interpreter-pick-list">
          <p className="field-label">{t('listingDetail.chooseInterpreter')}</p>
          {interpreters.map((i) => (
            <label key={i.id} className={`interpreter-pick-row ${interpreterId === i.id ? 'selected' : ''}`}>
              <input type="radio" name="interpreter" checked={interpreterId === i.id} onChange={() => setInterpreterId(i.id)} />
              <span className="interpreter-avatar">{i.photo}</span>
              <span className="interpreter-pick-info">
                <strong>{i.name}</strong>
                <span>{i.languages.join(', ')}</span>
              </span>
              <span className="interpreter-rate">
                {i.hourlyRateKrw.toLocaleString()} {t('common.won')} / {t('listingDetail.perHour')}
              </span>
            </label>
          ))}
        </div>
      )}

      {needsInterpreter && chosen && <PaymentStub label={`${chosen.name} · ${t('listingDetail.perHour')} ${chosen.hourlyRateKrw.toLocaleString()}${t('common.won')}`} />}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          {t('common.cancel')}
        </button>
        <button
          className="btn btn-primary"
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              visitDate,
              visitTime,
              needsInterpreter: !!needsInterpreter,
              interpreterId: needsInterpreter ? interpreterId : undefined,
            })
          }
        >
          {t('listingDetail.confirmVisit')}
        </button>
      </div>
    </Modal>
  );
}

function RightsReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (note: string) => void }) {
  const { t } = useTranslation();
  const [note, setNote] = useState('');

  return (
    <Modal title={t('listingDetail.rightsReportModalTitle')} onClose={onClose}>
      <p className="modal-desc">{t('listingDetail.rightsReportDesc')}</p>
      <p className="fee-line">{t('listingDetail.rightsReportFee', { fee: RIGHTS_REPORT_FEE })}</p>
      <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('listingDetail.notePlaceholder')} />
      <PaymentStub label={`${RIGHTS_REPORT_FEE * 10000} ${t('common.won')}`} />
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          {t('common.cancel')}
        </button>
        <button className="btn btn-primary" onClick={() => onSubmit(note)}>
          {t('listingDetail.submitRequest')}
        </button>
      </div>
    </Modal>
  );
}
