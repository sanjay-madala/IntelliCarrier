import { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import InfoStrip from '../../components/common/InfoStrip';

// Mock refill data — replace with real data from FuelTab or API
const mockRefills = [
  { id: 1, miles: 45380, liters: 120, date: '2026-02-15', time: '08:30:00', fuelType: 'DIEB07', billNo: '309700023698', fleetcard: '600005136180615', fleetCompany: 'PTT', sLoc: '1000', personalId1: '10045', personalId2: '10046' },
  { id: 2, miles: 45620, liters: 80, date: '2026-02-15', time: '14:15:00', fuelType: 'DIEB07', billNo: '309700023699', fleetcard: '600005136180615', fleetCompany: 'PTT', sLoc: '1000', personalId1: '10045', personalId2: '10046' },
];

/**
 * Fuel Allocation Algorithm (from Fuel_Allocation_Logic.rtf):
 * Step 1: rate = refill_amount / (current_refill_miles - prev_refill_miles)
 * Step 2: If stage crosses a refill boundary, split into sub-stages
 * Step 3: fuel = distance × rate (using prev stage end as actual start)
 */
function computeAllocation(shipment, refills) {
  const stages = shipment.stages || [];
  if (refills.length === 0 || stages.length === 0) return { rows: [], refillSummary: [], totalAllocated: 0, totalRefilled: 0 };

  // Sort refills by miles
  const sorted = [...refills].sort((a, b) => a.miles - b.miles);

  // Compute refill periods with rates
  const shipmentStartMiles = shipment.lastTruckMiles || (sorted[0].miles - 200);
  const refillSummary = sorted.map((r, i) => {
    const prevMiles = i === 0 ? shipmentStartMiles : sorted[i - 1].miles;
    const distance = r.miles - prevMiles;
    const rate = distance > 0 ? r.liters / distance : 0;
    return { ...r, prevMiles, distance, rate, rangeLabel: `${prevMiles.toLocaleString()} — ${r.miles.toLocaleString()}` };
  });

  const totalRefilled = sorted.reduce((s, r) => s + r.liters, 0);

  // Build allocation rows
  const rows = [];
  let runningNo = 1;
  let prevEndMiles = shipmentStartMiles;

  for (let si = 0; si < stages.length; si++) {
    const stage = stages[si];
    const stageNo = stage.n ?? stage.no ?? si + 1;
    const actualStartMiles = prevEndMiles; // per RTF: use prev stage end
    const stageEndMiles = stage.milesEnd || (actualStartMiles + (stage.stdDistance || stage.stdDist || stage.distance || 50));

    // Find which refill periods this stage overlaps
    const subStages = [];
    let cursor = actualStartMiles;

    for (const rp of refillSummary) {
      if (cursor >= stageEndMiles) break;
      if (rp.miles <= cursor) continue; // refill boundary already passed

      if (rp.miles < stageEndMiles) {
        // Stage crosses this refill boundary — split
        const dist = rp.miles - cursor;
        subStages.push({ start: cursor, end: rp.miles, dist, rate: rp.rate, refillId: rp.id });
        cursor = rp.miles;
      }
    }

    // Remaining portion after last crossed refill (or whole stage if no crossing)
    if (cursor < stageEndMiles) {
      // Find applicable rate: the refill period that covers this range
      const applicableRefill = refillSummary.find(rp => rp.miles > cursor) || refillSummary[refillSummary.length - 1];
      const dist = stageEndMiles - cursor;
      subStages.push({ start: cursor, end: stageEndMiles, dist, rate: applicableRefill.rate, refillId: applicableRefill.id });
    }

    // Generate rows
    for (let ssi = 0; ssi < subStages.length; ssi++) {
      const sub = subStages[ssi];
      const fuelUsage = sub.dist * sub.rate;
      const stageDate = stage.date || shipment.dispatchDate || '2026-02-15';
      const formattedDate = formatDDMMYYYY(stageDate);

      rows.push({
        cl: '900',
        runningNo: String(runningNo).padStart(6, '0'),
        shipment: shipment.shipmentNo || shipment.id,
        stNo: subStages.length > 1 ? `${stageNo}.${ssi + 1}` : String(stageNo),
        primeMover: shipment.vehicleNo || shipment.plate || '',
        tppt: shipment.tppt || 'T100',
        plInt: shipment.plInt || '01',
        recordType: subStages.length > 1 ? 'SPLIT' : 'STAGE',
        date: formattedDate,
        recordTime: stage.time || '00:00:00',
        sLoc: sorted[0]?.sLoc || '1000',
        personalId1: sorted[0]?.personalId1 || '',
        personalId2: sorted[0]?.personalId2 || '',
        fuelType: sorted[0]?.fuelType || 'DIEB07',
        billNo: sorted.find(r => r.id === sub.refillId)?.billNo || '',
        fleetcardNo: sorted[0]?.fleetcard || '',
        fleetCompany: sorted[0]?.fleetCompany || '',
        mileage: sub.end,
        fuelUsage: Math.round(fuelUsage * 100) / 100,
        isSplit: subStages.length > 1,
        subRange: `${sub.start.toLocaleString()} — ${sub.end.toLocaleString()}`,
      });
      runningNo++;
    }

    prevEndMiles = stageEndMiles;
  }

  const totalAllocated = rows.reduce((s, r) => s + r.fuelUsage, 0);
  return { rows, refillSummary, totalAllocated: Math.round(totalAllocated * 100) / 100, totalRefilled };
}

function formatDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

export default function FuelAllocationTab({ shipment }) {
  const { t } = useLanguage();

  const { rows, refillSummary, totalAllocated, totalRefilled } = useMemo(
    () => computeAllocation(shipment, mockRefills),
    [shipment],
  );

  const variance = Math.round((totalRefilled - totalAllocated) * 100) / 100;

  const thClass = 'px-2 py-2 text-left text-label font-semibold text-text-sec uppercase tracking-wider whitespace-nowrap border-b border-border';
  const tdClass = 'px-2 py-1.5 text-table text-text whitespace-nowrap border-b border-border-light';

  return (
    <div className="space-y-5">
      {/* Info Strip */}
      <InfoStrip variant="info" icon={'📊'}>
        <span className="font-medium">{t('fuelAllocation.title')}</span>{' '}
        {t('fuelAllocation.infoBody')}
      </InfoStrip>

      {/* Refill Summary Panel */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-2 flex items-center gap-1.5">
          {'⛽'} {t('fuelAllocation.refillSummary')}
        </h3>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className={thClass}>{t('fuelAllocation.refillNo')}</th>
                <th className={thClass}>{t('fuelAllocation.milesRange')}</th>
                <th className={thClass}>{t('fuelAllocation.liters')}</th>
                <th className={thClass}>{t('fuelAllocation.rate')}</th>
              </tr>
            </thead>
            <tbody>
              {refillSummary.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/30">
                  <td className={tdClass}>{i + 1}</td>
                  <td className={tdClass}>{r.rangeLabel}</td>
                  <td className={tdClass}>{r.liters}</td>
                  <td className={tdClass}>{r.rate.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ZLSDE11_T001 Main Data Table */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-2 flex items-center gap-1.5">
          {'📋'} {t('fuelAllocation.allocationTable')}
        </h3>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-table">
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th className={thClass}>{t('fuelAllocation.cl')}</th>
                <th className={thClass}>{t('fuelAllocation.runningNo')}</th>
                <th className={thClass}>{t('shipments.table.shipmentNo')}</th>
                <th className={thClass}>{t('fuelAllocation.stNo')}</th>
                <th className={thClass}>{t('fuelAllocation.primeMover')}</th>
                <th className={thClass}>{t('fuelAllocation.tppt')}</th>
                <th className={thClass}>{t('fuelAllocation.plInt')}</th>
                <th className={thClass}>{t('fuelAllocation.recordType')}</th>
                <th className={thClass}>{t('fuelAllocation.date')}</th>
                <th className={thClass}>{t('fuelAllocation.recordTime')}</th>
                <th className={thClass}>{t('fuelAllocation.sLoc')}</th>
                <th className={thClass}>{t('fuelAllocation.personalId1')}</th>
                <th className={thClass}>{t('fuelAllocation.personalId2')}</th>
                <th className={thClass}>{t('fuelAllocation.fuelType')}</th>
                <th className={thClass}>{t('fuelAllocation.billNo')}</th>
                <th className={thClass}>{t('fuelAllocation.fleetcardNo')}</th>
                <th className={thClass}>{t('fuelAllocation.fleetCompany')}</th>
                <th className={thClass}>{t('fuelAllocation.mileage')}</th>
                <th className={thClass + ' font-bold'}>{t('fuelAllocation.fuelUsage')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={19} className="px-4 py-6 text-center text-text-sec text-table">
                    No allocation data — add stages and fuel records first.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className={`hover:bg-blue-50/30 ${row.isSplit ? 'bg-amber-50/40' : ''}`}>
                    <td className={tdClass}>{row.cl}</td>
                    <td className={tdClass + ' font-mono'}>{row.runningNo}</td>
                    <td className={tdClass}>{row.shipment}</td>
                    <td className={tdClass + ' font-semibold'}>{row.stNo}</td>
                    <td className={tdClass}>{row.primeMover}</td>
                    <td className={tdClass}>{row.tppt}</td>
                    <td className={tdClass}>{row.plInt}</td>
                    <td className={tdClass}>
                      {row.isSplit ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">{row.recordType}</span>
                      ) : (
                        row.recordType
                      )}
                    </td>
                    <td className={tdClass}>{row.date}</td>
                    <td className={tdClass}>{row.recordTime}</td>
                    <td className={tdClass}>{row.sLoc}</td>
                    <td className={tdClass}>{row.personalId1}</td>
                    <td className={tdClass}>{row.personalId2}</td>
                    <td className={tdClass}>{row.fuelType}</td>
                    <td className={tdClass}>{row.billNo}</td>
                    <td className={tdClass + ' font-mono text-xs'}>{row.fleetcardNo}</td>
                    <td className={tdClass}>{row.fleetCompany}</td>
                    <td className={tdClass + ' text-right'}>{row.mileage.toLocaleString()}</td>
                    <td className={tdClass + ' text-right font-bold'} style={{ color: '#0369a1' }}>{row.fuelUsage.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Summary */}
      <div
        className="rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' }}
      >
        <div className="flex gap-6">
          <div>
            <span className="text-xs text-text-sec uppercase tracking-wider">{t('fuelAllocation.totalAllocated')}</span>
            <div className="text-lg font-bold" style={{ color: '#0369a1' }}>{totalAllocated.toFixed(2)} L</div>
          </div>
          <div>
            <span className="text-xs text-text-sec uppercase tracking-wider">{t('fuelAllocation.totalRefilled')}</span>
            <div className="text-lg font-bold text-text">{totalRefilled.toFixed(2)} L</div>
          </div>
          <div>
            <span className="text-xs text-text-sec uppercase tracking-wider">{t('fuelAllocation.variance')}</span>
            <div className={`text-lg font-bold ${Math.abs(variance) < 0.01 ? 'text-green-600' : 'text-amber-600'}`}>
              {variance >= 0 ? '+' : ''}{variance.toFixed(2)} L
            </div>
          </div>
        </div>
        {Math.abs(variance) < 0.01 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            {'✓'} Balanced
          </span>
        )}
      </div>
    </div>
  );
}
