import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getColumns } from '../services/columns';
import type { Lang } from '../types';

export function Columns() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const columns = getColumns();

  return (
    <div className="section">
      <h1>{t('columnsPage.title')}</h1>
      <p className="page-subtitle">{t('columnsPage.subtitle')}</p>

      <div className="column-list">
        {columns.map((c) => (
          <Link key={c.id} to={`/columns/${c.id}`} className="column-card">
            <span className="tag tag-muted">{c.category}</span>
            <h3>{c.title[lang]}</h3>
            <p className="column-meta">
              {t('columnsPage.by')} {c.author} · {new Date(c.publishedAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
