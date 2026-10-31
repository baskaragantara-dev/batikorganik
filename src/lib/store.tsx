'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { ADS, APPROVALS, CAMPAIGNS, CONTENT, LEADS } from '@/lib/mock/data';
import type { SimulatedDraft } from '@/lib/domain/simulate';
import type { AdPlan, ApprovalItem, Campaign, ContentItem, Lead, LeadStatus } from '@/lib/types';

// In-browser state for the review prototype. Decisions made while clicking around (approve, reject, new campaign,
// lead status) are kept in localStorage so a reviewer can reload the page; "Reset data demo" restores the seed.

interface State {
  campaigns: Campaign[];
  ads: AdPlan[];
  content: ContentItem[];
  approvals: ApprovalItem[];
  leads: Lead[];
  seq: number;
}

const SEED: State = { campaigns: CAMPAIGNS, ads: ADS, content: CONTENT, approvals: APPROVALS, leads: LEADS, seq: 1 };
const STORAGE_KEY = 'bo-growth-demo-v1';

type Action =
  | { type: 'decide'; ids: string[]; decision: 'disetujui' | 'ditolak'; reason?: string }
  | { type: 'addDraft'; draft: SimulatedDraft }
  | { type: 'leadStatus'; id: string; status: LeadStatus }
  | { type: 'hydrate'; state: State }
  | { type: 'reset' };

function applyDecision(state: State, ids: string[], decision: 'disetujui' | 'ditolak', reason?: string): State {
  const chosen = new Set(ids);
  const decided = state.approvals.filter((a) => chosen.has(a.id) && a.status === 'menunggu');
  const approvedCampaigns = new Set(decided.filter((a) => a.kind === 'campaign' && decision === 'disetujui').map((a) => a.campaignId));
  const approvedAdTitles = new Set(decided.filter((a) => a.kind === 'ads' && decision === 'disetujui').map((a) => a.title.replace(/^Ads: /, '')));
  return {
    ...state,
    approvals: state.approvals.map((a) => (chosen.has(a.id) && a.status === 'menunggu' ? { ...a, status: decision, reason } : a)),
    campaigns: state.campaigns.map((c) => (approvedCampaigns.has(c.id) ? { ...c, status: 'aktif' } : c)),
    ads: state.ads.map((ad) => (approvedAdTitles.has(ad.name) && ad.status === 'menunggu' ? { ...ad, status: 'disetujui' } : ad)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'decide':
      return applyDecision(state, action.ids, action.decision, action.reason);
    case 'addDraft':
      return {
        ...state,
        seq: state.seq + 1,
        campaigns: [action.draft.campaign, ...state.campaigns],
        ads: [...action.draft.ads, ...state.ads],
        content: [...action.draft.content, ...state.content],
        approvals: [action.draft.approval, ...state.approvals],
      };
    case 'leadStatus':
      return { ...state, leads: state.leads.map((l) => (l.id === action.id ? { ...l, status: action.status } : l)) };
    case 'hydrate':
      return action.state;
    case 'reset':
      return SEED;
  }
}

function readStored(): State | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!Array.isArray(parsed.campaigns) || !Array.isArray(parsed.approvals) || typeof parsed.seq !== 'number') return null;
    return { ...SEED, ...parsed } as State;
  } catch {
    return null; // private window or blocked storage: the seed is fine
  }
}

interface Store extends State {
  decide: (ids: string[], decision: 'disetujui' | 'ditolak', reason?: string) => void;
  addDraft: (draft: SimulatedDraft) => void;
  setLeadStatus: (id: string, status: LeadStatus) => void;
  reset: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) dispatch({ type: 'hydrate', state: stored });
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: the demo keeps working in memory.
    }
  }, [state]);

  const decide = useCallback((ids: string[], decision: 'disetujui' | 'ditolak', reason?: string) => dispatch({ type: 'decide', ids, decision, reason }), []);
  const addDraft = useCallback((draft: SimulatedDraft) => dispatch({ type: 'addDraft', draft }), []);
  const setLeadStatus = useCallback((id: string, status: LeadStatus) => dispatch({ type: 'leadStatus', id, status }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const value = useMemo<Store>(() => ({ ...state, decide, addDraft, setLeadStatus, reset }), [state, decide, addDraft, setLeadStatus, reset]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
