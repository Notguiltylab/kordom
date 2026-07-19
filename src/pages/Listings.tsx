import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { filterListings } from '../services/listings';
import type { ListingFilters } from '../services/listings';
import { ListingFilterBar } from '../components/listing/ListingFilterBar';
import { ListingCard } from '../components/listing/ListingCard';
import { MapView } from '../components/map/MapView';
import type { Lang } from '../types';

const DEFAULT_CENTER: [number, number] = [37.15, 126.95];

export function Listings() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListingFilters>({});
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  const listings = useMemo(() => filterListings(filters), [filters]);

  return (
    <div className="listings-page">
      <div className="listings-header">
        <h1>{t('listings.title')}</h1>
        <ListingFilterBar filters={filters} onChange={setFilters} />
        <p className="results-count">{t('listings.resultsCount', { count: listings.length })}</p>
      </div>

      <div className="mobile-tabs">
        <button className={mobileTab === 'list' ? 'active' : ''} onClick={() => setMobileTab('list')}>
          {t('listings.listView')}
        </button>
        <button className={mobileTab === 'map' ? 'active' : ''} onClick={() => setMobileTab('map')}>
          {t('listings.mapView')}
        </button>
      </div>

      <div className="listings-split">
        <div className={`listings-list-col ${mobileTab === 'list' ? '' : 'hide-on-mobile'}`}>
          {listings.length === 0 ? (
            <p className="empty-state">{t('listings.noResults')}</p>
          ) : (
            <div className="listing-grid listing-grid-1col">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
        <div className={`listings-map-col ${mobileTab === 'map' ? '' : 'hide-on-mobile'}`}>
          <MapView
            center={DEFAULT_CENTER}
            zoom={10}
            height="100%"
            markers={listings.map((l) => ({
              id: l.id,
              lat: l.lat,
              lng: l.lng,
              popup: (
                <div className="map-popup" onClick={() => navigate(`/listings/${l.id}`)}>
                  <strong>{l.title[lang]}</strong>
                  <div>{l.region}</div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
