import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapView } from '../map/MapView';
import { REGIONS } from '../../services/listings';
import type { Listing, DealType, RoomType } from '../../types';

export type ListingFormValues = Omit<Listing, 'id' | 'createdAt' | 'agentId'>;

const DEFAULT_CENTER: [number, number] = [37.05, 127.0];

interface Props {
  initial?: Partial<ListingFormValues>;
  onSubmit: (values: ListingFormValues) => void;
  onCancel: () => void;
}

export function ListingForm({ initial, onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const [titleKo, setTitleKo] = useState(initial?.title?.ko ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title?.en ?? '');
  const [titleRu, setTitleRu] = useState(initial?.title?.ru ?? '');
  const [descKo, setDescKo] = useState(initial?.description?.ko ?? '');
  const [descEn, setDescEn] = useState(initial?.description?.en ?? '');
  const [descRu, setDescRu] = useState(initial?.description?.ru ?? '');
  const [dealType, setDealType] = useState<DealType>(initial?.dealType ?? 'monthly');
  const [roomType, setRoomType] = useState<RoomType>(initial?.roomType ?? 'oneroom');
  const [deposit, setDeposit] = useState(initial?.deposit ?? 500);
  const [monthlyRent, setMonthlyRent] = useState(initial?.monthlyRent ?? 40);
  const [areaM2, setAreaM2] = useState(initial?.areaM2 ?? 20);
  const [rooms, setRooms] = useState(initial?.rooms ?? 1);
  const [floor, setFloor] = useState(initial?.floor ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [region, setRegion] = useState(initial?.region ?? REGIONS[0]);
  const [lat, setLat] = useState(initial?.lat ?? DEFAULT_CENTER[0]);
  const [lng, setLng] = useState(initial?.lng ?? DEFAULT_CENTER[1]);
  const [options, setOptions] = useState((initial?.options ?? []).join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: { ko: titleKo, en: titleEn, ru: titleRu },
      description: { ko: descKo, en: descEn, ru: descRu },
      dealType,
      roomType,
      deposit: Number(deposit),
      monthlyRent: dealType === 'monthly' ? Number(monthlyRent) : 0,
      areaM2: Number(areaM2),
      rooms: Number(rooms),
      floor,
      address,
      region,
      lat,
      lng,
      photos: initial?.photos ?? ['🏠'],
      options: options
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),
    });
  };

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
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
          <textarea value={descKo} onChange={(e) => setDescKo(e.target.value)} rows={2} />
        </label>
        <label>
          {t('dashboard.contentEn')}
          <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} />
        </label>
        <label>
          {t('dashboard.contentRu')}
          <textarea value={descRu} onChange={(e) => setDescRu(e.target.value)} rows={2} />
        </label>
      </div>

      <div className="form-grid">
        <label>
          {t('listings.filterDealType')}
          <select value={dealType} onChange={(e) => setDealType(e.target.value as DealType)}>
            <option value="monthly">{t('dealType.monthly')}</option>
            <option value="jeonse">{t('dealType.jeonse')}</option>
            <option value="sale">{t('dealType.sale')}</option>
          </select>
        </label>
        <label>
          {t('listings.filterRoomType')}
          <select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)}>
            <option value="oneroom">{t('roomType.oneroom')}</option>
            <option value="officetel">{t('roomType.officetel')}</option>
            <option value="apartment">{t('roomType.apartment')}</option>
            <option value="villa">{t('roomType.villa')}</option>
            <option value="share">{t('roomType.share')}</option>
          </select>
        </label>
        <label>
          {t('listings.filterRegion')}
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-grid">
        <label>
          {t('listingDetail.deposit')} ({t('listingDetail.manwon')})
          <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} />
        </label>
        {dealType === 'monthly' && (
          <label>
            {t('listingDetail.monthlyRent')} ({t('listingDetail.manwon')})
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} />
          </label>
        )}
        <label>
          {t('listingDetail.area')} (m²)
          <input type="number" value={areaM2} onChange={(e) => setAreaM2(Number(e.target.value))} />
        </label>
        <label>
          {t('listingDetail.rooms')}
          <input type="number" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
        </label>
        <label>
          {t('listingDetail.floor')}
          <input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="3/5" />
        </label>
      </div>

      <label>
        {t('listingDetail.address')}
        <input value={address} onChange={(e) => setAddress(e.target.value)} required />
      </label>

      <label>
        {t('listingDetail.options')}
        <input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="에어컨, 세탁기, 냉장고" />
      </label>

      <div>
        <p className="field-label">{t('dashboard.pickOnMap')}</p>
        <MapView
          center={[lat, lng]}
          zoom={11}
          height={280}
          markers={[{ id: 'pick', lat, lng }]}
          onMapClick={(clat, clng) => {
            setLat(clat);
            setLng(clng);
          }}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          {t('dashboard.cancel')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('dashboard.save')}
        </button>
      </div>
    </form>
  );
}
