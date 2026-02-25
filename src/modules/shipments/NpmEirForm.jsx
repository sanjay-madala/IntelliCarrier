import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import InfoStrip from '../../components/common/InfoStrip';
import {
  NPM_EIR_EVENT_OPTIONS, NPM_CUSTOMER_TYPE_OPTIONS, NPM_FCL_STATUS_OPTIONS, NPM_STUFFING_OPTIONS,
} from './shipmentConstants';

const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

export default function NpmEirForm() {
  const { t } = useLanguage();

  const [eirHeader, setEirHeader] = useState({
    event: 'checkin', gate: 'ประตูเข้า', fiscalYear: '2026',
    eirNo: '', salesOrder: '', shipDelivery: '',
  });

  const [containerDetail, setContainerDetail] = useState({
    inspectDate: new Date().toISOString().slice(0, 10),
    inspectTime: new Date().toISOString().slice(11, 16),
    reference: '',
    customerType: 'IM', containerCode: '', bookingNo: '',
    size: "40'", type: 'GP', shippingLine: '', fclStatus: 'FCL',
    forwarder: '', weight: '', customer: '',
    sealNo: '', vesselVoyage: '', commodity: '',
    stuffingPlace: 'CY', marking: '', srNo: '',
  });

  const [bookingLines, setBookingLines] = useState([
    {
      id: 1, shipper: 'Machinery World Ltd.', fw: '', bookingNo: 'BKG-2026-0006',
      cargo: 'Machinery', line: 'Evergreen', sts: 'IMPORT', size: "40'",
      qty: 5, stuffing: 'CY', marking: 'MWL-006', srNo: 'SR-006', docType: 'F',
    },
  ]);

  const addBooking = () => {
    setBookingLines(prev => [...prev, {
      id: Date.now(), shipper: '', fw: '', bookingNo: '', cargo: '',
      line: '', sts: '', size: "20'", qty: 0, stuffing: 'CY',
      marking: '', srNo: '', docType: '',
    }]);
  };

  const removeBooking = (id) => setBookingLines(prev => prev.filter(b => b.id !== id));

  const updateBooking = (id, field, value) => {
    setBookingLines(prev => prev.map(b => b.id === id ? { ...b, [field]: field === 'qty' ? Number(value) : value } : b));
  };

  const updateHeader = (field, value) => setEirHeader(prev => ({ ...prev, [field]: value }));
  const updateDetail = (field, value) => setContainerDetail(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      {/* EIR Header */}
      <CollapsibleSection title={t('npm.eir.title') || 'EIR Form — ใบ EIR'}>
        <InfoStrip variant="info" icon="ℹ️">
          NPM EIR — Equipment Interchange Receipt. Thai labels match English field names per specification.
        </InfoStrip>

        {/* Row 1: เหตุการณ์, ประตูเข้า, ปีงบประมาณ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.event')}</label>
            <select value={eirHeader.event} onChange={e => updateHeader('event', e.target.value)} className={inputClass}>
              {NPM_EIR_EVENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.gate')}</label>
            <input value={eirHeader.gate} className={inputClass + ' text-blue-600 font-medium'} disabled />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.fiscalYear')}</label>
            <input value={eirHeader.fiscalYear} onChange={e => updateHeader('fiscalYear', e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Row 2: เลขที่ EIR, ใบสั่งขาย, การจัดส่งเรือ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.eirNo')}</label>
            <input value={eirHeader.eirNo} onChange={e => updateHeader('eirNo', e.target.value)} placeholder="e.g. 5846" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.salesOrder')}</label>
            <input value={eirHeader.salesOrder} onChange={e => updateHeader('salesOrder', e.target.value)} placeholder="e.g. 2108123573" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.shipDelivery')}</label>
            <input value={eirHeader.shipDelivery} onChange={e => updateHeader('shipDelivery', e.target.value)} placeholder="e.g. ML-1201.26.000001" className={inputClass} />
          </div>
        </div>
      </CollapsibleSection>

      {/* Container Detail */}
      <CollapsibleSection title={t('npm.eir.containerDetail') || 'รายละเอียดตู้คอนเทนเนอร์'}>
        {/* Row 1: วันที่ตรวจ, เวลาตรวจ, อ้างอิง */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.inspectDate')}</label>
            <input type="date" value={containerDetail.inspectDate} onChange={e => updateDetail('inspectDate', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.inspectTime')}</label>
            <input type="time" value={containerDetail.inspectTime} onChange={e => updateDetail('inspectTime', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.reference')}</label>
            <input value={containerDetail.reference} onChange={e => updateDetail('reference', e.target.value)} placeholder="e.g. CO 2026 716" className={inputClass} />
          </div>
        </div>

        {/* Row 2: ประเภทลูกค้า, รหัสตู้คอนเทนเนอร์, เลขที่การจอง */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.customerType')}</label>
            <select value={containerDetail.customerType} onChange={e => updateDetail('customerType', e.target.value)} className={inputClass}>
              {NPM_CUSTOMER_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.containerCode')}</label>
            <input value={containerDetail.containerCode} onChange={e => updateDetail('containerCode', e.target.value)} placeholder="e.g. CSQU7654321" className={inputClass + ' text-blue-600 font-medium'} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.bookingNo')}</label>
            <input value={containerDetail.bookingNo} onChange={e => updateDetail('bookingNo', e.target.value)} placeholder="e.g. BKG-2026-0001" className={inputClass} />
          </div>
        </div>

        {/* Row 3: ขนาด/ประเภท, สายเรือ/ตัวแทน, สถานะ (FCL/LCL) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.sizeType')}</label>
            <div className="flex gap-1">
              <input value={containerDetail.size} onChange={e => updateDetail('size', e.target.value)} className={inputClass + ' w-20'} />
              <input value={containerDetail.type} onChange={e => updateDetail('type', e.target.value)} className={inputClass + ' w-20'} />
            </div>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.shippingLine')}</label>
            <input value={containerDetail.shippingLine} onChange={e => updateDetail('shippingLine', e.target.value)} placeholder="e.g. Evergreen" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.fclStatus')}</label>
            <select value={containerDetail.fclStatus} onChange={e => updateDetail('fclStatus', e.target.value)} className={inputClass}>
              {NPM_FCL_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Row 4: ผู้ส่งของ, น้ำหนัก, ลูกค้า */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.forwarder')}</label>
            <input value={containerDetail.forwarder} onChange={e => updateDetail('forwarder', e.target.value)} placeholder="e.g. FW001" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.weight')}</label>
            <input type="number" value={containerDetail.weight} onChange={e => updateDetail('weight', e.target.value)} placeholder="e.g. 22.100" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.customer')}</label>
            <input value={containerDetail.customer} onChange={e => updateDetail('customer', e.target.value)} placeholder="e.g. ABC Trading Co." className={inputClass} />
          </div>
        </div>

        {/* Row 5: เลขที่ซีล, เรือ/เที่ยวเรือ S, สินค้า */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.sealNo')}</label>
            <input value={containerDetail.sealNo} onChange={e => updateDetail('sealNo', e.target.value)} placeholder="e.g. SL-002" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.vesselVoyage')}</label>
            <input value={containerDetail.vesselVoyage} onChange={e => updateDetail('vesselVoyage', e.target.value)} placeholder="e.g. 08S.26CF.NPSRT1.S001" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.commodity')}</label>
            <input value={containerDetail.commodity} onChange={e => updateDetail('commodity', e.target.value)} placeholder="e.g. Electronics" className={inputClass} />
          </div>
        </div>

        {/* Row 6: สถานที่บรรจุ, เครื่องหมาย, เลขที่ SR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.stuffingPlace')}</label>
            <select value={containerDetail.stuffingPlace} onChange={e => updateDetail('stuffingPlace', e.target.value)} className={inputClass}>
              {NPM_STUFFING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.marking')}</label>
            <input value={containerDetail.marking} onChange={e => updateDetail('marking', e.target.value)} placeholder="e.g. ABC-001" className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('npm.eir.srNo')}</label>
            <input value={containerDetail.srNo} onChange={e => updateDetail('srNo', e.target.value)} placeholder="e.g. SR-001" className={inputClass} />
          </div>
        </div>
      </CollapsibleSection>

      {/* Booking Lines */}
      <CollapsibleSection title={t('npm.bookingLines.title') || 'Booking Lines'}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-sec">{bookingLines.length} booking line(s)</span>
          <button onClick={addBooking} className="px-3 py-1.5 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover">
            {t('npm.bookingLines.addBooking') || '+ Add Booking'}
          </button>
        </div>

        <div className="overflow-x-auto border border-border-light rounded">
          <table className="w-full text-xs min-w-[1200px]">
            <thead><tr className="bg-gray-50 border-b border-border">
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.shipper') || 'Shipper'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.fw') || 'FW'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.bookingNo') || 'Booking No.'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.cargo') || 'Cargo (Commodity)'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.line') || 'Line'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.sts') || 'STS'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.size') || 'Size'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.qty') || 'QTY'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.stuffing') || 'Stuffing'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.markingCol') || 'Marking'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.srNo') || 'SR No.'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.docType') || 'Doc Type'}</th>
              <th className="px-2 py-2 text-left font-semibold uppercase tracking-wider">{t('npm.bookingLines.actions') || 'Actions'}</th>
            </tr></thead>
            <tbody>
              {bookingLines.map((bl) => (
                <tr key={bl.id} className="border-b border-border-light hover:bg-gray-50/50">
                  <td className="px-2 py-2">
                    <input value={bl.shipper} onChange={e => updateBooking(bl.id, 'shipper', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-32" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.fw} onChange={e => updateBooking(bl.id, 'fw', e.target.value)} placeholder="FW" className="border border-border rounded px-1.5 py-1 text-xs w-16" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.bookingNo} onChange={e => updateBooking(bl.id, 'bookingNo', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-28 font-semibold" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.cargo} onChange={e => updateBooking(bl.id, 'cargo', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-24" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.line} onChange={e => updateBooking(bl.id, 'line', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-20" />
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      bl.sts === 'IMPORT' ? 'bg-orange-100 text-orange-700' :
                      bl.sts === 'EXPORT' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>{bl.sts || '—'}</span>
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.size} onChange={e => updateBooking(bl.id, 'size', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-12" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" value={bl.qty} onChange={e => updateBooking(bl.id, 'qty', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-12" />
                  </td>
                  <td className="px-2 py-2">
                    <select value={bl.stuffing} onChange={e => updateBooking(bl.id, 'stuffing', e.target.value)} className="border border-border rounded px-1 py-1 text-xs">
                      {NPM_STUFFING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.marking} onChange={e => updateBooking(bl.id, 'marking', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-16" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.srNo} onChange={e => updateBooking(bl.id, 'srNo', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-16" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={bl.docType} onChange={e => updateBooking(bl.id, 'docType', e.target.value)} className="border border-border rounded px-1.5 py-1 text-xs w-8 text-center" />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded border border-border text-xs hover:bg-gray-50">
                        {t('npm.bookingLines.edit') || 'Edit'}
                      </button>
                      <button onClick={() => removeBooking(bl.id)} className="px-2 py-1 rounded border border-red-300 text-red-600 text-xs hover:bg-red-50">
                        {t('npm.bookingLines.delete') || 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookingLines.length === 0 && (
                <tr><td colSpan={13} className="text-center py-4 text-text-muted">No booking lines. Click "+ Add Booking" to add one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  );
}
