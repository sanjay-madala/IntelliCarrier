import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import KPITile from '../../components/common/KPITile';
import DataTable from '../../components/common/DataTable';
import { StatusBadge, SourceBadge, ProductBadge } from '../../components/common/Badge';
import { formatDate, generateId } from '../../utils/helpers';
import ShipmentDetail from './ShipmentDetail';
import ShipmentForm from './ShipmentForm';
// FO creation modals
import ChannelModal from '../freightorder/ChannelModal';
import UploadModal from '../freightorder/UploadModal';
import ManualEntryModal from '../freightorder/ManualEntryModal';
import EditDraftModal from '../freightorder/EditDraftModal';
import TMSModal from '../freightorder/TMSModal';

export default function ShipmentList() {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const [view, setView] = useState('list'); // list | detail | form
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedFO, setSelectedFO] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBU, setFilterBU] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [search, setSearch] = useState('');
  const [channelChoice, setChannelChoice] = useState(null);

  // FO flow modal states
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTMSModal, setShowTMSModal] = useState(false);
  const [showEditDraftModal, setShowEditDraftModal] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [uploadType, setUploadType] = useState('excel');
  const [channelBU, setChannelBU] = useState('');
  const [channelProduct, setChannelProduct] = useState('');

  const shipments = state.shipments;

  const kpis = useMemo(() => ({
    total: shipments.length,
    pendingReview: shipments.filter(s => s.status === 'PENDING_REVIEW').length,
    open: shipments.filter(s => s.status === 'OPEN').length,
    shipmentCreated: shipments.filter(s => s.status === 'SHIPMENT_CREATED').length,
    dispatched: shipments.filter(s => s.status === 'DISPATCHED').length,
    reportIn: shipments.filter(s => s.status === 'REPORT_IN').length,
    completed: shipments.filter(s => s.status === 'COMPLETED').length,
  }), [shipments]);

  const filtered = useMemo(() => {
    let list = shipments;
    if (filterStatus) list = list.filter(s => s.status === filterStatus);
    if (filterBU) list = list.filter(s => s.bu === filterBU);
    if (filterSource) list = list.filter(s => s.source === filterSource);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.shipmentNo.toLowerCase().includes(q) ||
        s.customer?.toLowerCase().includes(q) ||
        s.driver?.toLowerCase().includes(q) ||
        s.routeName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, filterStatus, filterBU, filterSource, search]);

  const columns = [
    { key: 'shipmentNo', label: t('shipments.table.shipmentNo') },
    { key: 'source', label: t('shipments.table.source'), render: (v) => <SourceBadge source={v} /> },
    { key: 'product', label: t('shipments.table.product'), render: (v) => <ProductBadge product={v} /> },
    { key: 'bu', label: t('shipments.table.bu') },
    { key: 'routeName', label: t('shipments.table.route') },
    { key: 'customer', label: t('shipments.table.customer'), render: (v) => <span className="max-w-[150px] truncate block">{v}</span> },
    { key: 'plate', label: t('shipments.table.truck') },
    { key: 'driver', label: t('shipments.table.driver') },
    { key: 'consolidatedFOs', label: 'FOs', render: (v) => v?.length || 1 },
    { key: 'totalQty', label: t('shipments.table.qty'), render: (v) => v?.toLocaleString() },
    { key: 'created', label: t('shipments.table.created'), render: (v) => formatDate(v) },
    { key: 'status', label: t('shipments.table.status'), render: (v) => <StatusBadge status={v} /> },
    {
      key: 'actions', label: t('shipments.table.actions'), sortable: false,
      render: (_, row) => (
        <div className="flex gap-1.5">
          {row.status === 'OPEN' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {t('shipments.actions.edit')}
              </button>
              <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DISPATCH_SHIPMENT', payload: row.id }); }}
                className="text-xs px-2.5 py-1 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors">
                {t('shipments.actions.dispatch')}
              </button>
            </>
          )}
          {row.status === 'DISPATCHED' && (
            <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_MODULE', payload: 'reportin' }); }}
              className="text-xs px-2.5 py-1 rounded-md bg-warning/10 text-warning hover:bg-warning/20 transition-colors">
              {t('shipments.actions.reportIn')}
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleView(row); }}
            className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-text-sec hover:bg-gray-200 transition-colors">
            {t('shipments.actions.view')}
          </button>
        </div>
      ),
    },
  ];

  const handleView = (row) => { setSelectedShipment(row); setView('form'); };
  const handleEdit = (row) => { setSelectedShipment(row); setView('form'); };

  // ========== FO Channel Modal Handlers ==========

  const handleChannelAction = (action, bu, product) => {
    setShowChannelModal(false);
    setChannelBU(bu);
    setChannelProduct(product);
    if (action === 'upload') {
      setUploadType('excel');
      setShowUploadModal(true);
    } else if (action === 'tms') {
      setShowTMSModal(true);
    } else if (action === 'form' || action === 'manual') {
      setShowManualModal(true);
    }
  };

  // Transform FO data into a shipment object and navigate to ShipmentForm
  const foToShipment = (fo, source) => {
    const id = generateId('SHP');
    const qty = fo.products?.[0]?.quantity || (typeof fo.quantity === 'string' ? parseInt(fo.quantity.replace(/[^0-9]/g, '')) : fo.quantity) || 0;
    const newShipment = {
      id,
      shipmentNo: id,
      status: 'OPEN',
      source: source,
      bu: fo.bu || channelBU,
      product: fo.productType || channelProduct,
      routeName: fo.route || '',
      customer: fo.customerName || fo.customer || '',
      driver: '',
      plate: '',
      totalQty: qty,
      created: new Date().toISOString().split('T')[0],
      stages: [],
      consolidatedFOs: [],
    };
    dispatch({ type: 'ADD_SHIPMENT', payload: newShipment });

    // Build selectedFO object for ShipmentForm pre-population
    const foData = {
      id: fo.id || id,
      product: fo.productType || channelProduct,
      bu: fo.bu || channelBU,
      site: '060C',
      route: fo.route || '',
      customer: fo.customerName || fo.customer || '',
      qty: qty ? qty.toLocaleString() : '0',
      date: fo.requestedDeliveryDate || fo.deliveryDate || '',
      wbs: fo.wbs || '',
      shipTo: fo.deliveryAddress || '',
    };
    setSelectedFO(foData);
    setSelectedShipment(newShipment);
    setChannelChoice({ bu: fo.bu || channelBU, product: fo.productType || channelProduct });
    setView('form');
  };

  // Handle confirmed drafts from UploadModal
  const handleConfirmDrafts = (drafts) => {
    setShowUploadModal(false);
    if (drafts.length === 0) return;
    if (drafts.length === 1) {
      // Single draft: open ShipmentForm for detailed editing
      foToShipment(drafts[0], 'Excel Upload');
    } else {
      // Bulk: create all drafts as OPEN shipments directly
      drafts.forEach(fo => {
        const id = generateId('SHP');
        const qty = fo.products?.[0]?.quantity || (typeof fo.quantity === 'string' ? parseInt(fo.quantity.replace(/[^0-9]/g, '')) : fo.quantity) || 0;
        dispatch({ type: 'ADD_SHIPMENT', payload: {
          id, shipmentNo: id, status: 'OPEN', source: 'Excel Upload',
          bu: fo.bu || channelBU, product: fo.productType || channelProduct,
          routeName: fo.route || '', customer: fo.customerName || fo.customer || '',
          driver: '', plate: '', totalQty: qty,
          created: new Date().toISOString().split('T')[0],
          stages: [], consolidatedFOs: [],
        }});
      });
      window.alert(`${drafts.length} shipments created in OPEN status. Edit each from the list.`);
    }
  };

  // Handle single draft edit/confirm from EditDraftModal
  const handleEditDraftConfirm = (fo) => {
    setShowEditDraftModal(false);
    setEditDraft(null);
    foToShipment(fo, 'Excel Upload');
  };

  // Handle manual entry creation
  const handleManualCreate = (order) => {
    setShowManualModal(false);
    foToShipment(order, 'Manual Entry');
  };

  // Handle TMS import
  const handleTMSImport = (orders) => {
    setShowTMSModal(false);
    if (orders.length === 0) return;
    if (orders.length === 1) {
      foToShipment(orders[0], 'TMS API');
    } else {
      orders.forEach(fo => {
        const id = generateId('SHP');
        dispatch({ type: 'ADD_SHIPMENT', payload: {
          id, shipmentNo: id, status: 'OPEN', source: 'TMS API',
          bu: fo.bu || channelBU, product: fo.productType || channelProduct,
          routeName: fo.route || '', customer: fo.customerName || fo.customer || '',
          driver: '', plate: '', totalQty: fo.quantity || 0,
          created: new Date().toISOString().split('T')[0],
          stages: [], consolidatedFOs: [],
        }});
      });
      window.alert(`${orders.length} shipments imported from TMS in OPEN status.`);
    }
  };

  // ========== View Routing ==========

  if (view === 'detail' && selectedShipment) {
    return (
      <ShipmentDetail
        shipment={selectedShipment}
        onBack={() => { setView('list'); setSelectedShipment(null); }}
        onEdit={() => setView('form')}
      />
    );
  }

  if (view === 'form') {
    return (
      <ShipmentForm
        shipment={selectedShipment}
        selectedFO={selectedFO}
        channel={channelChoice}
        isEditMode={!!selectedShipment && !selectedFO}
        onBack={() => { setView('list'); setSelectedShipment(null); setSelectedFO(null); setChannelChoice(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">{t('shipments.pageTitle')}</h1>
          <p className="text-sm text-text-sec mt-1">{t('shipments.pageSubtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const csv = ['ShipmentNo,Status,Product,BU,Route,Customer,Truck,Driver,Qty,Created'].concat(
                filtered.map(s => `${s.shipmentNo},${s.status},${s.product || ''},${s.bu || ''},${s.routeName || ''},${s.customer || ''},${s.plate || ''},${s.driver || ''},${s.totalQty || ''},${s.created || ''}`)
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `shipments_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-lg border border-border text-sm text-text-sec hover:bg-bg transition-colors"
          >
            {t('shipments.export')}
          </button>
          <button
            onClick={() => setShowChannelModal(true)}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            {t('shipments.newShipment')}
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        <KPITile label={t('shipments.kpi.total')} count={kpis.total} active={!filterStatus} onClick={() => setFilterStatus(null)} />
        <KPITile icon="⏳" label={t('shipments.kpi.pendingReview')} count={kpis.pendingReview} color="text-purple-600" active={filterStatus === 'PENDING_REVIEW'} onClick={() => setFilterStatus('PENDING_REVIEW')} />
        <KPITile icon="🟡" label={t('shipments.kpi.open')} count={kpis.open} color="text-yellow-600" active={filterStatus === 'OPEN'} onClick={() => setFilterStatus('OPEN')} />
        <KPITile icon="📋" label={t('shipments.kpi.shipmentCreated')} count={kpis.shipmentCreated} color="text-indigo-600" active={filterStatus === 'SHIPMENT_CREATED'} onClick={() => setFilterStatus('SHIPMENT_CREATED')} />
        <KPITile icon="🚀" label={t('shipments.kpi.dispatched')} count={kpis.dispatched} color="text-blue-600" active={filterStatus === 'DISPATCHED'} onClick={() => setFilterStatus('DISPATCHED')} />
        <KPITile icon="📥" label={t('shipments.kpi.reportIn')} count={kpis.reportIn} color="text-orange-600" active={filterStatus === 'REPORT_IN'} onClick={() => setFilterStatus('REPORT_IN')} />
        <KPITile icon="✅" label={t('shipments.kpi.completed')} count={kpis.completed} color="text-green-600" active={filterStatus === 'COMPLETED'} onClick={() => setFilterStatus('COMPLETED')} />
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder={`${t('common.search')}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 max-w-md border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <select value={filterBU} onChange={e => setFilterBU(e.target.value)}
          className="border border-border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <option value="">{t('shipments.table.bu')} — All</option>
          <option value="SCC">SCC</option>
          <option value="SCA">SCA</option>
          <option value="SPL">SPL</option>
          <option value="SCM">SCM</option>
        </select>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
          className="border border-border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <option value="">Source — All</option>
          <option value="Excel Upload">Excel Upload</option>
          <option value="PDF Upload">PDF / OCR</option>
          <option value="TMS API">TMS API</option>
          <option value="Email RPA">Email RPA</option>
          <option value="Manual Entry">Manual Entry</option>
          <option value="Forecast">Forecast</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={handleView}
          emptyMessage={t('common.noDataFound')}
        />
      </div>

      {/* FO Channel Selection Modal */}
      {showChannelModal && (
        <ChannelModal
          onClose={() => setShowChannelModal(false)}
          onSelect={handleChannelAction}
        />
      )}

      {/* Upload Modal (Excel/PDF/Email/LINE) */}
      {showUploadModal && (
        <UploadModal
          type={uploadType}
          preSelectedBU={channelBU}
          preSelectedProduct={channelProduct}
          onClose={() => setShowUploadModal(false)}
          onEditDraft={(draft) => {
            setEditDraft(draft);
            setShowEditDraftModal(true);
          }}
          onConfirmDrafts={handleConfirmDrafts}
        />
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <ManualEntryModal
          onClose={() => setShowManualModal(false)}
          onCreate={handleManualCreate}
        />
      )}

      {/* TMS Import Modal */}
      {showTMSModal && (
        <TMSModal
          onClose={() => setShowTMSModal(false)}
          onImport={handleTMSImport}
        />
      )}

      {/* Edit Draft Modal */}
      {showEditDraftModal && editDraft && (
        <EditDraftModal
          draft={editDraft}
          onClose={() => { setShowEditDraftModal(false); setEditDraft(null); }}
          onSave={(updated) => { setEditDraft(updated); }}
          onConfirm={handleEditDraftConfirm}
        />
      )}
    </div>
  );
}
