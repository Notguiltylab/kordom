import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Listing, Lang } from '../../types';

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;

  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card-photo">{listing.photos[0] ?? '🏠'}</div>
      <div className="listing-card-body">
        <div className="listing-card-tags">
          <span className="tag">{t(`dealType.${listing.dealType}`)}</span>
          <span className="tag tag-muted">{t(`roomType.${listing.roomType}`)}</span>
        </div>
        <h3 className="listing-card-title">{listing.title[lang]}</h3>
        <p className="listing-card-region">{listing.region} · {listing.address}</p>
        <div className="listing-card-price">
          {listing.dealType === 'monthly'
            ? `${listing.deposit}/${listing.monthlyRent} ${t('listingDetail.manwon')}`
            : `${listing.deposit} ${t('listingDetail.manwon')}`}
        </div>
        <div className="listing-card-meta">
          {listing.areaM2}m² · {listing.rooms}{t('listingDetail.roomsUnit')} · {listing.floor}
        </div>
      </div>
    </Link>
  );
}
