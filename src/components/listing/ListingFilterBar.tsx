import { useTranslation } from 'react-i18next';
import { REGIONS } from '../../services/listings';
import type { ListingFilters } from '../../services/listings';

interface Props {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
}

export function ListingFilterBar({ filters, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="filter-bar">
      <label className="filter-field">
        <span>{t('listings.filterRegion')}</span>
        <select
          value={filters.region ?? ''}
          onChange={(e) => onChange({ ...filters, region: e.target.value || undefined })}
        >
          <option value="">{t('listings.allRegions')}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>{t('listings.filterDealType')}</span>
        <select
          value={filters.dealType ?? ''}
          onChange={(e) => onChange({ ...filters, dealType: e.target.value || undefined })}
        >
          <option value="">{t('listings.allDealTypes')}</option>
          <option value="monthly">{t('dealType.monthly')}</option>
          <option value="jeonse">{t('dealType.jeonse')}</option>
          <option value="sale">{t('dealType.sale')}</option>
        </select>
      </label>

      <label className="filter-field">
        <span>{t('listings.filterRoomType')}</span>
        <select
          value={filters.roomType ?? ''}
          onChange={(e) => onChange({ ...filters, roomType: e.target.value || undefined })}
        >
          <option value="">{t('listings.allRoomTypes')}</option>
          <option value="oneroom">{t('roomType.oneroom')}</option>
          <option value="officetel">{t('roomType.officetel')}</option>
          <option value="apartment">{t('roomType.apartment')}</option>
          <option value="villa">{t('roomType.villa')}</option>
          <option value="share">{t('roomType.share')}</option>
        </select>
      </label>
    </div>
  );
}
