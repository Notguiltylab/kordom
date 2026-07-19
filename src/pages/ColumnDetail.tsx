import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getColumnById } from '../services/columns';
import type { Lang } from '../types';

export function ColumnDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const column = id ? getColumnById(id) : undefined;

  if (!column) {
    return (
      <div className="section">
        <p>Column not found.</p>
        <Link to="/columns">{t('columnsPage.back')}</Link>
      </div>
    );
  }

  return (
    <div className="section section-narrow">
      <Link to="/columns" className="back-link">
        ← {t('columnsPage.back')}
      </Link>
      <span className="tag tag-muted">{column.category}</span>
      <h1>{column.title[lang]}</h1>
      <p className="column-meta">
        {t('columnsPage.by')} {column.author} · {new Date(column.publishedAt).toLocaleDateString()}
      </p>
      <div className="column-content">
        {column.content[lang].split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}
