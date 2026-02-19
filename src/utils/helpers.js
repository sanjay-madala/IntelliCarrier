import { productConfig } from '../data/mockData';

let counter = 100;

export function generateId(prefix = 'SHP') {
  counter += 1;
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(counter).padStart(3, '0')}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrency(amount) {
  if (amount == null) return '—';
  return `฿${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function pCfg(productCode) {
  return productConfig[productCode] || productConfig.LPG;
}

export function buildAwaitingRows(shipment) {
  if (!shipment || shipment.status !== 'COMPLETED') return [];
  return shipment.stages
    .filter(s => s.type === 'delivery' && s.status === 'completed')
    .map((stage, idx) => ({
      id: `AW-${shipment.id}-${idx}`,
      shipmentNo: shipment.shipmentNo,
      product: shipment.product,
      soldTo: '',
      soldToName: shipment.customer,
      shipTo: '',
      shipToName: stage.to,
      docDate: shipment.created,
      ticketQty: shipment.totalQty,
      actualQty: shipment.totalQty,
      billingQty: shipment.totalQty,
      billingDate: shipment.created,
      vehicleType: shipment.vehicleType,
      vehicleAge: shipment.vehicleAge,
      billingDist: stage.distance,
      actualDist: stage.milesEnd && stage.milesStart ? stage.milesEnd - stage.milesStart : stage.distance,
      status: 'awaiting',
    }));
}
