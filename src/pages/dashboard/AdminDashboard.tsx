import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listAgents, setAgentApproval } from '../../services/auth';
import { getInterpreters, createInterpreter, deleteInterpreter } from '../../services/interpreters';
import { getColumns, createColumn, deleteColumn } from '../../services/columns';
import { getRequests } from '../../services/requests';
import { getListingById } from '../../services/listings';
import { Badge } from '../../components/common/Badge';
import type { Lang } from '../../types';

type Tab = 'agents' | 'interpreters' | 'columns' | 'requests';

export function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const [tab, setTab] = useState<Tab>('agents');
  const [tick, setTick] = useState(0);

  const agents = useMemo(() => listAgents(), [tick]);
  const interpreters = useMemo(() => getInterpreters(), [tick]);
  const columns = useMemo(() => getColumns(), [tick]);
  const requests = useMemo(() => getRequests(), [tick]);

  const bump = () => setTick((v) => v + 1);

  return (
    <div className="section">
      <h1>{t('dashboard.adminTitle')}</h1>

      <div className="admin-tabs">
        <button className={tab === 'agents' ? 'active' : ''} onClick={() => setTab('agents')}>
          {t('dashboard.tabAgents')}
        </button>
        <button className={tab === 'interpreters' ? 'active' : ''} onClick={() => setTab('interpreters')}>
          {t('dashboard.tabInterpreters')}
        </button>
        <button className={tab === 'columns' ? 'active' : ''} onClick={() => setTab('columns')}>
          {t('dashboard.tabColumns')}
        </button>
        <button className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>
          {t('dashboard.tabRequests')}
        </button>
      </div>

      {tab === 'agents' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('auth.agencyName')}</th>
                <th>{t('auth.name')}</th>
                <th>{t('auth.licenseNumber')}</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id}>
                  <td>{a.agencyName}</td>
                  <td>{a.name}</td>
                  <td>{a.licenseNumber}</td>
                  <td>
                    <Badge tone={a.approvalStatus === 'approved' ? 'success' : a.approvalStatus === 'rejected' ? 'danger' : 'warning'}>
                      {t(`dashboard.status${a.approvalStatus.charAt(0).toUpperCase()}${a.approvalStatus.slice(1)}`)}
                    </Badge>
                  </td>
                  <td className="admin-table-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setAgentApproval(a.id, 'approved');
                        bump();
                      }}
                    >
                      {t('dashboard.approve')}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setAgentApproval(a.id, 'rejected');
                        bump();
                      }}
                    >
                      {t('dashboard.reject')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'interpreters' && (
        <InterpretersTab
          interpreters={interpreters}
          onCreated={bump}
          onDelete={(id) => {
            deleteInterpreter(id);
            bump();
          }}
        />
      )}

      {tab === 'columns' && (
        <ColumnsTab
          columns={columns}
          lang={lang}
          onCreated={bump}
          onDelete={(id) => {
            deleteColumn(id);
            bump();
          }}
        />
      )}

      {tab === 'requests' && (
        <div className="request-list">
          {requests.length === 0 ? (
            <p className="empty-state">{t('dashboard.noRequests')}</p>
          ) : (
            requests.map((r) => {
              const listing = getListingById(r.listingId);
              return (
                <div key={r.id} className="request-row">
                  <div className="request-row-main">
                    <span className="tag tag-muted">{r.type}</span>
                    <strong>{listing?.title[lang]}</strong>
                  </div>
                  <Badge>{t(`requestStatus.${r.status}`)}</Badge>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function InterpretersTab({
  interpreters,
  onCreated,
  onDelete,
}: {
  interpreters: ReturnType<typeof getInterpreters>;
  onCreated: () => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [languages, setLanguages] = useState('');
  const [rate, setRate] = useState(25000);
  const [years, setYears] = useState(3);
  const [bioKo, setBioKo] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioRu, setBioRu] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createInterpreter({
      name,
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      hourlyRateKrw: Number(rate),
      yearsExperience: Number(years),
      bio: { ko: bioKo, en: bioEn, ru: bioRu },
      photo: '🧑‍💼',
    });
    setShowForm(false);
    setName('');
    setLanguages('');
    setBioKo('');
    setBioEn('');
    setBioRu('');
    onCreated();
  };

  return (
    <div>
      <div className="section-header-row">
        <span />
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
          {t('dashboard.addInterpreter')}
        </button>
      </div>

      {showForm && (
        <form className="listing-form" onSubmit={submit}>
          <div className="form-grid">
            <label>
              {t('dashboard.interpreterName')}
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              {t('dashboard.interpreterLanguages')}
              <input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="러시아어, 한국어" required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              {t('dashboard.interpreterRate')}
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </label>
            <label>
              {t('dashboard.interpreterYears')}
              <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </label>
          </div>
          <div className="form-grid">
            <label>
              {t('dashboard.bioKo')}
              <textarea value={bioKo} onChange={(e) => setBioKo(e.target.value)} rows={2} />
            </label>
            <label>
              {t('dashboard.bioEn')}
              <textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} rows={2} />
            </label>
            <label>
              {t('dashboard.bioRu')}
              <textarea value={bioRu} onChange={(e) => setBioRu(e.target.value)} rows={2} />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              {t('dashboard.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('dashboard.save')}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <tbody>
            {interpreters.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.languages.join(', ')}</td>
                <td>{i.hourlyRateKrw.toLocaleString()}{t('common.won')}</td>
                <td className="admin-table-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onDelete(i.id)}>
                    {t('dashboard.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ColumnsTab({
  columns,
  lang,
  onCreated,
  onDelete,
}: {
  columns: ReturnType<typeof getColumns>;
  lang: Lang;
  onCreated: () => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [contentKo, setContentKo] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentRu, setContentRu] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createColumn({
      author,
      category,
      title: { ko: titleKo, en: titleEn, ru: titleRu },
      content: { ko: contentKo, en: contentEn, ru: contentRu },
    });
    setShowForm(false);
    setTitleKo('');
    setTitleEn('');
    setTitleRu('');
    setContentKo('');
    setContentEn('');
    setContentRu('');
    onCreated();
  };

  return (
    <div>
      <div className="section-header-row">
        <span />
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
          {t('dashboard.addColumn')}
        </button>
      </div>

      {showForm && (
        <form className="listing-form" onSubmit={submit}>
          <div className="form-grid">
            <label>
              {t('dashboard.author')}
              <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </label>
            <label>
              {t('dashboard.category')}
              <input value={category} onChange={(e) => setCategory(e.target.value)} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              {t('dashboard.titleKo')}
              <input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} required />
            </label>
            <label>
              {t('dashboard.titleEn')}
              <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            </label>
            <label>
              {t('dashboard.titleRu')}
              <input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              {t('dashboard.contentKo')}
              <textarea value={contentKo} onChange={(e) => setContentKo(e.target.value)} rows={4} required />
            </label>
            <label>
              {t('dashboard.contentEn')}
              <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={4} required />
            </label>
            <label>
              {t('dashboard.contentRu')}
              <textarea value={contentRu} onChange={(e) => setContentRu(e.target.value)} rows={4} required />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              {t('dashboard.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('dashboard.save')}
            </button>
          </div>
        </form>
      )}

      <div className="column-list">
        {columns.map((c) => (
          <div key={c.id} className="column-card" style={{ cursor: 'default' }}>
            <span className="tag tag-muted">{c.category}</span>
            <h3>{c.title[lang]}</h3>
            <p className="column-meta">{c.author}</p>
            <button className="btn btn-ghost btn-sm" onClick={() => onDelete(c.id)}>
              {t('dashboard.delete')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
