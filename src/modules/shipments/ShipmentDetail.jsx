import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import Panel from '../../components/common/Panel';
import { StatusBadge, ProductBadge, SourceBadge } from '../../components/common/Badge';
import BridgeBanner from '../../components/common/BridgeBanner';
import { formatDate } from '../../utils/helpers';
import { pCfg, ROUTE_OPTIONS } from './shipmentConstants';

export default function ShipmentDetail({ shipment, onBack, onEdit }) {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const pc = pCfg(shipment.product);

  const handleDispatch = () => {
    dispatch({ type: 'DISPATCH_SHIPMENT', payload: shipment.id });
    onBack();
  };

  const handleReportIn = () => {
    dispatch({ type: 'SET_MODULE', payload: 'reportin' });
  };

  const routeLabel = ROUTE_OPTIONS.find(r => r.value === shipment.route)?.label || shipment.routeName || shipment.route;

  // Build customers list from shipment data
  const customers = shipment.customers || (shipment.customerName ? [{
    name: shipment.customerName,
    shipToCode: shipment.shipToCode || '',
    address: shipment.deliveryAddress || shipment.pickupAddress || '',
    volume: shipment.totalQty ? `${shipment.totalQty?.toLocaleString()} ${shipment.unit || 'L'}` : '',
  }] : []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={onBack} className="text-primary hover:text-primary-hover text-sm">&larr; {t('common.back')}</button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{shipment.id || shipment.shipmentNo}</h1>
              {shipment.customerName && (
                <span className="text-sm text-text-sec">— {shipment.customerName}</span>
              )}
            </div>
            <p className="text-xs text-text-sec">{routeLabel} | {pc.icon} {pc.label} | {shipment.bu}</p>
          </div>
          <StatusBadge status={shipment.status} />
          <ProductBadge product={shipment.product} />
          <SourceBadge source={shipment.source} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
            {'🖨️'} {t('common.print') || 'Print'}
          </button>
          {(shipment.status === 'OPEN' || shipment.status === 'DISPATCHED') && (
            <button onClick={onEdit} className="px-3 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover">
              {t('common.edit')}
            </button>
          )}
        </div>
      </div>

      {/* Bridge Banners */}
      {shipment.status === 'OPEN' && (
        <BridgeBanner
          icon="🚀"
          title={t('shipments.detail.readyToDispatch')}
          subtitle={`${shipment.driver1Name || shipment.driver || '—'} — ${shipment.truck || shipment.plate || '—'}`}
          action={t('shipments.detail.dispatchNow')}
          onAction={handleDispatch}
        />
      )}
      {shipment.status === 'DISPATCHED' && (
        <BridgeBanner
          icon="📥"
          title={`${t('shipments.detail.dispatched')} — ${shipment.id}`}
          subtitle={`${t('shipments.detail.dispatchDescription') || 'Driver notified.'} ${t('shipments.detail.fleet')}: ${shipment.vehicleNo || shipment.truck || '—'}`}
          action={t('shipments.detail.reportIn')}
          onAction={handleReportIn}
          gradient="blue"
        />
      )}

      {/* 3-Column Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Shipment Info */}
        <Panel header={t('shipmentDetail.panel.shipmentInfo')}>
          <dl className="space-y-2.5 text-table">
            <DetailRow label={t('shipmentDetail.fields.shipmentNo')} value={shipment.id || shipment.shipmentNo} />
            <DetailRow label={t('common.status.label')} value={<StatusBadge status={shipment.status} />} />
            <DetailRow label={t('shipmentDetail.fields.source')} value={<SourceBadge source={shipment.source} />} />
            <DetailRow label={t('shipmentDetail.fields.product')} value={`${pc.icon} ${pc.label}`} />
            <DetailRow label={t('shipmentDetail.fields.businessUnit')} value={shipment.bu} />
            <DetailRow label={t('shipmentDetail.fields.site')} value={shipment.site} />
            <DetailRow label={t('shipmentDetail.fields.route')} value={routeLabel} />
            <DetailRow label={t('shipmentDetail.fields.shipmentType')} value={shipment.shipmentType || shipment.shippingType || '—'} />
            <DetailRow label={t('shipmentDetail.fields.totalQty')} value={shipment.totalQty?.toLocaleString()} />
            <DetailRow label={t('shipmentDetail.fields.created')} value={formatDate(shipment.created)} />
            {shipment.ocrConfidence != null && (
              <DetailRow label={t('shipmentDetail.fields.ocrConfidence')} value={
                <span className={`font-bold ${shipment.ocrConfidence >= 90 ? 'text-green-600' : shipment.ocrConfidence >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {shipment.ocrConfidence}%
                </span>
              } />
            )}
            <DetailRow label={t('shipmentDetail.fields.fos')} value={shipment.fos?.join(', ') || '—'} />
          </dl>
        </Panel>

        {/* Column 2: Customers / Ship-To */}
        <Panel header={t('shipmentDetail.panel.customersShipTo')}>
          {customers.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {customers.map((cust, i) => (
                <div key={i} className="p-2.5 rounded border border-border-light bg-bg hover:bg-white transition-colors">
                  <div className="font-medium text-table text-text">{cust.name}</div>
                  {cust.shipToCode && (
                    <div className="text-label text-text-sec mt-0.5">{t('shipmentDetail.fields.shipToCode')}: {cust.shipToCode}</div>
                  )}
                  {cust.address && (
                    <div className="text-label text-text-sec mt-0.5">{cust.address}</div>
                  )}
                  {cust.volume && (
                    <div className="text-label font-medium text-primary mt-1">{cust.volume}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-table text-text-sec py-4 text-center">{t('common.noDataFound')}</div>
          )}

          {/* Stages */}
          {shipment.stages && shipment.stages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-text-sec mb-2">{t('shipmentDetail.fields.stagesRoutePlan')}</h4>
              <div className="space-y-1.5">
                {(shipment.stages || []).map((stage, i) => (
                  <div key={i} className="flex items-center gap-2 text-table">
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium text-white ${
                      stage.status === 'completed' ? 'bg-success' : 'bg-gray-300'
                    }`}>
                      {stage.n ?? stage.no ?? i}
                    </span>
                    <span className="text-text">{stage.from || stage.origin || stage.departure} &rarr; {stage.to || stage.dest || stage.destination}</span>
                    <span className="text-text-muted text-xs">({stage.distance || stage.stdDist || 0} km)</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-table">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Total: {(shipment.stages || []).reduce((s, st) => s + (st.distance || st.stdDist || 0), 0)} km
                </span>
              </div>
            </div>
          )}
        </Panel>

        {/* Column 3: Schedule & Fees */}
        <Panel header={t('shipmentDetail.panel.scheduleFees')}>
          <dl className="space-y-2.5 text-table">
            <DetailRow label={t('shipmentDetail.fields.pickupDate')} value={formatDate(shipment.requestedPickupDate) || '—'} />
            <DetailRow label={t('shipmentDetail.fields.deliveryDate')} value={formatDate(shipment.requestedDeliveryDate) || '—'} />
            <DetailRow label={t('shipmentDetail.fields.totalWeight')} value={shipment.totalWeight ? `${shipment.totalWeight.toLocaleString()} kg` : '—'} />
            <DetailRow label={t('shipmentDetail.fields.truckPlate')} value={shipment.truck || shipment.plate} />
            <DetailRow label={t('shipmentDetail.fields.trailer')} value={shipment.trailer || '—'} />
            <DetailRow label={t('shipmentDetail.fields.vehicleNo')} value={shipment.vehicleNo} />
            <DetailRow label={t('shipmentDetail.fields.truckType')} value={shipment.truckType || shipment.vehicleType} />
            <DetailRow label={t('shipmentDetail.fields.driver1')} value={shipment.driver1Name || shipment.driver} />
            <DetailRow label={t('shipmentDetail.fields.driver1Id')} value={shipment.driver1 || shipment.driverId} />
            <DetailRow label={t('shipmentDetail.fields.contractWbs')} value={shipment.wbs || '—'} />
            <DetailRow label={t('shipmentDetail.fields.transportFee')} value={shipment.transportFee || 'เก็บ (Collect)'} />
            <DetailRow label={t('shipmentDetail.fields.tripPay')} value={shipment.tripPay || 'จ่าย (Pay)'} />
            <DetailRow label={t('shipmentDetail.fields.brokenMiles')} value={shipment.brokenMiles ? t('common.yes') : t('common.no')} />
          </dl>

          {/* Type-specific summary */}
          {shipment.product === 'NGV' && (
            <div className="mt-4 p-2.5 bg-green-50 rounded border border-green-200">
              <h4 className="text-xs font-semibold text-green-700 mb-1">{t('shipmentDetail.ngv.title')}</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1">
                <dt className="text-green-600">Quality Station</dt><dd className="text-green-800">{shipment.ngvQualityStation || 'BTC-01'}</dd>
                <dt className="text-green-600">Tube Count</dt><dd className="text-green-800">{shipment.ngvTubeCount || 8}</dd>
                <dt className="text-green-600">Pressure Before</dt><dd className="text-green-800">{shipment.ngvPressureBefore || '180 bar'}</dd>
                <dt className="text-green-600">Pressure After</dt><dd className="text-green-800">{shipment.ngvPressureAfter || '20 bar'}</dd>
              </dl>
            </div>
          )}
          {shipment.product === 'FUEL' && (
            <div className="mt-4 p-2.5 bg-blue-50 rounded border border-blue-200">
              <h4 className="text-xs font-semibold text-blue-700 mb-1">{t('shipmentDetail.fuel.title')}</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1">
                <dt className="text-blue-600">Compartments</dt><dd className="text-blue-800">{shipment.fuelCompartments || 4}</dd>
                <dt className="text-blue-600">Fuel Type</dt><dd className="text-blue-800">{shipment.fuelType || 'DIEB07'}</dd>
                <dt className="text-blue-600">Total Capacity</dt><dd className="text-blue-800">{shipment.fuelCapacity || '36,000 L'}</dd>
                <dt className="text-blue-600">Seal Number</dt><dd className="text-blue-800">{shipment.fuelSealNo || 'SL-2026-001'}</dd>
              </dl>
            </div>
          )}
          {shipment.product === 'CONTAINER' && (
            <div className="mt-4 p-2.5 bg-orange-50 rounded border border-orange-200">
              <h4 className="text-xs font-semibold text-orange-700 mb-1">{t('shipmentDetail.container.title')}</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1">
                <dt className="text-orange-600">Container No.</dt><dd className="text-orange-800">{shipment.containerNo || 'MSKU-1234567'}</dd>
                <dt className="text-orange-600">Size</dt><dd className="text-orange-800">{shipment.containerSize || '40 ft'}</dd>
                <dt className="text-orange-600">VGM (kg)</dt><dd className="text-orange-800">{shipment.vgmWeight || '28,500'}</dd>
                <dt className="text-orange-600">Seal</dt><dd className="text-orange-800">{shipment.containerSeal || 'CS-20260219'}</dd>
              </dl>
            </div>
          )}
          {shipment.product === 'SCA' && (
            <div className="mt-4 p-2.5 bg-amber-50 rounded border border-amber-200">
              <h4 className="text-xs font-semibold text-amber-700 mb-1">{t('shipmentDetail.sca.title')}</h4>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-1">
                <dt className="text-amber-600">Carrier Positions</dt><dd className="text-amber-800">{shipment.scaPositions || 6}</dd>
                <dt className="text-amber-600">Loaded Vehicles</dt><dd className="text-amber-800">{shipment.scaLoaded || 5}</dd>
                <dt className="text-amber-600">Transport Fee</dt><dd className="text-amber-800">{shipment.scaTransportFee || 'Collect'}</dd>
                <dt className="text-amber-600">Trip Pay</dt><dd className="text-amber-800">{shipment.scaTripPay || 'Pay'}</dd>
              </dl>
            </div>
          )}
        </Panel>
      </div>

      {/* Special Instructions */}
      {shipment.specialInstructions && (
        <Panel header={t('shipmentDetail.panel.specialInstructions')}>
          <p className="text-table text-text">{shipment.specialInstructions}</p>
        </Panel>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-text-sec whitespace-nowrap">{label}</dt>
      <dd className="font-medium text-text text-right">{value || '—'}</dd>
    </div>
  );
}
