import { createContext, useContext, useReducer } from 'react';
import {
  freightOrders as mockFreightOrders,
  shipments as mockShipments,
  employees,
  trucks,
  routes,
  awaitingRows as mockAwaitingRows,
  settlementReports as mockSettlementReports,
  salesOrders as mockSalesOrders,
} from '../data/mockData';

const AppContext = createContext();

const initialState = {
  activeModule: 'shipments',
  freightOrders: mockFreightOrders,
  drafts: [],
  shipments: mockShipments,
  awaitingRows: mockAwaitingRows,
  awaitingSettlement: mockAwaitingRows, // backward-compat alias
  settlementReports: mockSettlementReports,
  salesOrders: mockSalesOrders,
  notifications: [
    { id: 1, text: 'FO-2026-0003 ready for review', time: '2m ago', icon: '⏳', read: false },
    { id: 2, text: 'SHP-2026-002 dispatched', time: '15m ago', icon: '🚀', read: false },
    { id: 3, text: 'Miles violation on Stage 2', time: '1h ago', icon: '⚠️', read: false },
  ],
  currentUser: { name: 'Somchai K.', role: 'Dispatcher', bu: 'LPG' },
  // Read-only config references kept in state for convenience
  employees,
  trucks,
  routes,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_MODULE':
      return { ...state, activeModule: action.payload };

    // --- Freight Orders ---
    case 'ADD_FO':
      return { ...state, freightOrders: [...state.freightOrders, action.payload] };
    case 'UPDATE_FO':
      return { ...state, freightOrders: state.freightOrders.map(fo => fo.id === action.payload.id ? { ...fo, ...action.payload } : fo) };

    // --- Drafts ---
    case 'SET_DRAFTS':
      return { ...state, drafts: action.payload };
    case 'CLEAR_DRAFTS':
      return { ...state, drafts: [] };

    // --- Shipments ---
    case 'ADD_SHIPMENT':
      return { ...state, shipments: [...state.shipments, action.payload] };
    case 'UPDATE_SHIPMENT':
      return { ...state, shipments: state.shipments.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case 'DELETE_SHIPMENT':
      return { ...state, shipments: state.shipments.filter(s => s.id !== action.payload) };
    case 'DISPATCH_SHIPMENT':
      return { ...state, shipments: state.shipments.map(s => s.id === action.payload ? { ...s, status: 'DISPATCHED' } : s) };
    case 'UPDATE_STAGE':
      return {
        ...state,
        shipments: state.shipments.map(s => {
          if (s.id !== action.payload.shipmentId) return s;
          return {
            ...s,
            stages: s.stages.map((st, i) =>
              i === action.payload.stageIndex ? { ...st, ...action.payload.data } : st
            ),
          };
        }),
      };
    case 'SUBMIT_FOR_REVIEW':
      return {
        ...state,
        shipments: state.shipments.map(s =>
          s.id === action.payload ? { ...s, riStatus: 'pending_review' } : s
        ),
      };
    case 'REJECT_REPORT_IN':
      return {
        ...state,
        shipments: state.shipments.map(s =>
          s.id === action.payload ? { ...s, riStatus: 'rejected' } : s
        ),
      };
    case 'SAVE_REPORT_IN_DRAFT':
      return {
        ...state,
        shipments: state.shipments.map(s =>
          s.id === action.payload ? { ...s, riStatus: 'in_progress' } : s
        ),
      };
    case 'COMPLETE_REPORT_IN':
      return {
        ...state,
        shipments: state.shipments.map(s =>
          s.id === action.payload ? { ...s, status: 'COMPLETED', riStatus: 'completed' } : s
        ),
      };

    // --- Settlement ---
    case 'ADD_AWAITING_ROWS': {
      const newRows = [...state.awaitingRows, ...action.payload];
      return { ...state, awaitingRows: newRows, awaitingSettlement: newRows };
    }
    case 'UPDATE_AWAITING_ROW': {
      const newRows = state.awaitingRows.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r);
      return { ...state, awaitingRows: newRows, awaitingSettlement: newRows };
    }
    case 'REMOVE_AWAITING': {
      const newRows = state.awaitingRows.filter(a => !action.payload.includes(a.id));
      return { ...state, awaitingRows: newRows, awaitingSettlement: newRows };
    }
    case 'ADD_REPORT':
      return { ...state, settlementReports: [...state.settlementReports, action.payload] };
    case 'UPDATE_REPORT':
      return { ...state, settlementReports: state.settlementReports.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    case 'ADD_SALES_ORDERS':
      return { ...state, salesOrders: [...state.salesOrders, ...action.payload] };

    // Legacy aliases for backward compatibility
    case 'ADD_SETTLEMENT_REPORT':
      return { ...state, settlementReports: [...state.settlementReports, action.payload] };
    case 'UPDATE_SETTLEMENT_REPORT':
      return { ...state, settlementReports: state.settlementReports.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    case 'ADD_SALES_ORDER':
      return { ...state, salesOrders: [...state.salesOrders, action.payload] };
    case 'UPDATE_SALES_ORDER':
      return { ...state, salesOrders: state.salesOrders.map(so => so.id === action.payload.id ? { ...so, ...action.payload } : so) };
    case 'UPDATE_AWAITING': {
      const newRows2 = state.awaitingRows.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a);
      return { ...state, awaitingRows: newRows2, awaitingSettlement: newRows2 };
    }

    // --- Notifications ---
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
