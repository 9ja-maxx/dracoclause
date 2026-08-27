"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet-provider";
import { useMandateWrite } from "@/hooks/use-mandate-write";
import { readClient } from "@/lib/genlayer/client";
import { DRACO_CLAUSE_ADDRESS } from "@/lib/contract/config";
import { truncateAddress } from "@/lib/utils";
import { PlusCircle, Send, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, Layers, ShieldCheck, Clock, Ban, HelpCircle, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

export function MandateWorkspace() {
  const { address, isConnected } = useWallet();
  const { submitMandateWrite } = useMandateWrite();

  const [activeTab, setActiveTab] = useState<"REGISTRY" | "CREATE">("REGISTRY");

  // Create Mandate State
  const [createForm, setCreateForm] = useState({
    mandateId: "yield-sentinel-agent",
    delegate: "",
    guardian: "",
    initialText: "",
    charterRules: "",
    reviewTtl: 3600,
    consentTtl: 3600,
    guardianWindow: 300
  });

  // Propose Revision State
  const [proposeText, setProposeText] = useState("");

  // Registry / Details State
  const [searchId, setSearchId] = useState("yield-sentinel-agent");
  const [loading, setLoading] = useState(false);
  const [mandateData, setMandateData] = useState<any | null>(null);
  const [activeVersionData, setActiveVersionData] = useState<any | null>(null);
  const [proposedVersionData, setProposedVersionData] = useState<any | null>(null);

  useEffect(() => {
    if (address) {
      setCreateForm(prev => ({
        ...prev,
        delegate: address,
        guardian: address
      }));
    }
  }, [address]);

  const handleLoadTemplate = () => {
    if (!address) {
      toast.warning("Please connect your Web3 wallet first");
      return;
    }
    setCreateForm({
      mandateId: "sentinel-" + Math.floor(Math.random() * 1000),
      delegate: address,
      guardian: address,
      initialText: "The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3 with a maximum 24h drawdown limit of 500 GEN and maximum slippage of 0.5%. Emergency pause remains active.",
      charterRules: "Re-consent is strictly required whenever the agent increases maximum slippage, expands the 24-hour spending/drawdown envelope, or removes emergency pause capabilities.",
      reviewTtl: 3600,
      consentTtl: 3600,
      guardianWindow: 300
    });
    toast.info("Pre-filled template rules into form");
  };

  const fetchMandateDetails = async (idToSearch = searchId) => {
    if (!idToSearch.trim()) {
      toast.error("Please enter a mandate ID");
      return;
    }
    setLoading(true);
    try {
      const metaRes: any = await (readClient as any).readContract({
        address: DRACO_CLAUSE_ADDRESS,
        functionName: "get_mandate",
        args: [idToSearch]
      });

      if (!metaRes || metaRes.exists === false || metaRes.principal === "0x0000000000000000000000000000000000000000") {
        setMandateData(null);
        setActiveVersionData(null);
        setProposedVersionData(null);
        toast.error("Mandate ID not found on-chain");
        return;
      }

      setMandateData(metaRes);

      const activeVerRes = await (readClient as any).readContract({
        address: DRACO_CLAUSE_ADDRESS,
        functionName: "get_version",
        args: [idToSearch, metaRes.active_version]
      });
      setActiveVersionData(activeVerRes);

      if (metaRes.open_version > 0) {
        const proposedVerRes = await (readClient as any).readContract({
          address: DRACO_CLAUSE_ADDRESS,
          functionName: "get_version",
          args: [idToSearch, metaRes.open_version]
        });
        setProposedVersionData(proposedVerRes);
      } else {
        setProposedVersionData(null);
      }

      toast.success("Loaded mandate details");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch mandate details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMandate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMandateWrite({
        functionName: "create_mandate",
        args: [
          createForm.mandateId,
          createForm.delegate,
          createForm.guardian,
          createForm.initialText,
          createForm.charterRules,
          BigInt(createForm.reviewTtl),
          BigInt(createForm.consentTtl),
          BigInt(createForm.guardianWindow)
        ],
        title: "Create Mandate: " + createForm.mandateId,
        mandateId: createForm.mandateId
      });
      toast.success("Create Mandate transaction submitted to StudioNet");
      setActiveTab("REGISTRY");
      setSearchId(createForm.mandateId);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create mandate");
    }
  };

  const handleProposeVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeText.trim()) return;
    try {
      await submitMandateWrite({
        functionName: "propose_mandate_version",
        args: [searchId, proposeText],
        title: "Propose Revision on " + searchId,
        mandateId: searchId
      });
      toast.success("Propose revision transaction submitted");
      setProposeText("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to propose revision");
    }
  };

  const handleReviewMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "review_mandate_version",
        args: [searchId, mandateData.open_version],
        title: "Execute Validator Semantic Audit on v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const handleConsentMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "consent_to_mandate",
        args: [searchId, mandateData.open_version],
        title: "Approve & Consent to Mandate v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const handleVetoMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "veto_mandate",
        args: [searchId, mandateData.open_version, "Guardian Veto: Parameter drift violates active charter"],
        title: "Guardian Veto on Mandate v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const handleFinalizeChallenge = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "finalize_guardian_challenge",
        args: [searchId, mandateData.open_version],
        title: "Finalize Guardian Challenge for v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const handleRejectMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "reject_mandate",
        args: [searchId, mandateData.open_version],
        title: "Reject Mandate v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const handleRecoverMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        functionName: "recover_expired_mandate",
        args: [searchId, mandateData.open_version],
        title: "Recover Expired Mandate v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  const getConnectedRoleName = () => {
    if (!address || !mandateData) return "Guest";
    const userAddr = address.toLowerCase();
    if (userAddr === mandateData.principal.toLowerCase()) return "Principal (Owner)";
    if (userAddr === mandateData.delegate.toLowerCase()) return "Delegate (AI Agent)";
    if (userAddr === mandateData.guardian.toLowerCase()) return "Guardian (Sentinel)";
    return "Observer";
  };

  return (
    <div className="space-y-8">
      {/* Visual Onboarding Stepper Guide */}
      <section className="draco-card rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm">
        <h4 className="font-bold text-zinc-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
          <HelpCircle className="size-4 text-rose-500" />
          <span>Interactive Quick Start Path</span>
        </h4>
        <div className="grid gap-4 md:grid-cols-4 text-xs font-light leading-relaxed text-zinc-500">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-zinc-800">
              <span className="flex size-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 text-[10px]">1</span>
              <span>Connect Wallet</span>
            </div>
            <p>Connect your browser wallet to GenLayer StudioNet (Chain 61999).</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-zinc-800">
              <span className="flex size-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 text-[10px]">2</span>
              <span>Register Mandate</span>
            </div>
            <p>Go to the Register tab, load a prefilled template, and deploy to StudioNet.</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-zinc-800">
              <span className="flex size-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 text-[10px]">3</span>
              <span>Query Mandate</span>
            </div>
            <p>Under the Registry tab, type your Mandate ID and query active state.</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-zinc-800">
              <span className="flex size-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 border border-rose-200 text-[10px]">4</span>
              <span>Propose & Audit</span>
            </div>
            <p>Submit candidate revisions, run validator review, and track taxonomy consensus.</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <button
          onClick={() => setActiveTab("REGISTRY")}
          className={"flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition " +
            (activeTab === "REGISTRY"
              ? "bg-rose-100 text-rose-600 border border-rose-200"
              : "text-zinc-500 hover:text-zinc-900")}
        >
          <Layers className="size-4" />
          <span>Active Mandate Registry</span>
        </button>
        <button
          onClick={() => setActiveTab("CREATE")}
          className={"flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition " +
            (activeTab === "CREATE"
              ? "bg-rose-100 text-rose-600 border border-rose-200"
              : "text-zinc-500 hover:text-zinc-900")}
        >
          <PlusCircle className="size-4" />
          <span>Register New Mandate</span>
        </button>
      </div>

      {/* Tab: Create Mandate */}
      {activeTab === "CREATE" && (
        <form onSubmit={handleCreateMandate} className="draco-card rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Register Capability Mandate</h3>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Register agent parameters, rules, and governance roles.</p>
            </div>
            <button
              type="button"
              onClick={handleLoadTemplate}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Sparkles className="size-3.5 text-amber-600" />
              <span>Load Template Example</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Mandate Unique ID</label>
              <input
                type="text"
                required
                value={createForm.mandateId}
                onChange={e => setCreateForm({...createForm, mandateId: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Delegate (Agent Wallet Address)</label>
              <input
                type="text"
                required
                value={createForm.delegate}
                onChange={e => setCreateForm({...createForm, delegate: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Guardian (Sentinel Wallet Address)</label>
              <input
                type="text"
                required
                value={createForm.guardian}
                onChange={e => setCreateForm({...createForm, guardian: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                placeholder="0x..."
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2">Review TTL (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.reviewTtl}
                  onChange={e => setCreateForm({...createForm, reviewTtl: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2">Consent TTL (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.consentTtl}
                  onChange={e => setCreateForm({...createForm, consentTtl: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-2">Guardian Veto (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.guardianWindow}
                  onChange={e => setCreateForm({...createForm, guardianWindow: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Initial Capability Text (Natural Language Rules)</label>
            <textarea
              required
              rows={3}
              value={createForm.initialText}
              onChange={e => setCreateForm({...createForm, initialText: e.target.value})}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
              placeholder="e.g. Daily drawdown limit of 500 GEN on Aave v3..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Governing Charter Rules</label>
            <textarea
              required
              rows={3}
              value={createForm.charterRules}
              onChange={e => setCreateForm({...createForm, charterRules: e.target.value})}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
              placeholder="e.g. Drawdown limit increases require principal consent..."
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-50"
          >
            <PlusCircle className="size-4" />
            <span>Send Register Transaction</span>
          </button>
        </form>
      )}

      {/* Tab: Registry */}
      {activeTab === "REGISTRY" && (
        <div className="space-y-6">
          {/* Query Lookup */}
          <div className="draco-card rounded-2xl p-5 bg-white border border-zinc-205 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase mb-2">Lookup Active Mandate ID</label>
              <input
                type="text"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-850 focus:border-rose-500/40 focus:outline-none"
                placeholder="e.g. yield-sentinel-alpha"
              />
            </div>
            <button
              onClick={() => fetchMandateDetails()}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-55 self-end"
            >
              <RefreshCw className={"size-4 " + (loading ? "animate-spin" : "")} />
              <span>Query Contract State</span>
            </button>
          </div>

          {/* Stored Mandate Record */}
          {mandateData ? (
            <div className="space-y-6">
              <div className="draco-card rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-base tracking-tight">On-Chain Capability Dossier</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Principal Address: {truncateAddress(mandateData.principal)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-[10px] font-bold font-mono text-zinc-650">
                      Connected as: {getConnectedRoleName()}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                      v{mandateData.active_version} Authorized
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs font-mono">
                  <div className="rounded-xl bg-zinc-50/80 p-4 border border-zinc-200/60">
                    <div className="text-zinc-400 block text-[9px] uppercase tracking-wider mb-1">Delegate (Agent)</div>
                    <span className="text-zinc-700">{truncateAddress(mandateData.delegate)}</span>
                  </div>
                  <div className="rounded-xl bg-zinc-50/80 p-4 border border-zinc-200/60">
                    <div className="text-zinc-400 block text-[9px] uppercase tracking-wider mb-1">Guardian (Sentinel)</div>
                    <span className="text-zinc-700">{truncateAddress(mandateData.guardian)}</span>
                  </div>
                  <div className="rounded-xl bg-zinc-50/80 p-4 border border-zinc-200/60">
                    <div className="text-zinc-400 block text-[9px] uppercase tracking-wider mb-1">Guardian window</div>
                    <span className="text-zinc-700">{mandateData.guardian_window_seconds}s</span>
                  </div>
                </div>

                {activeVersionData && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase">Active Rules & Parameters</label>
                    <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-900 font-mono text-xs text-zinc-200 leading-relaxed">
                      {activeVersionData.mandate_text}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase">Charter Rubric Rules</label>
                  <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-250/60 text-xs text-zinc-650 font-light italic">
                    "{mandateData.charter_rules}"
                  </div>
                </div>
              </div>

              {/* Proposed Candidate */}
              <div className="draco-card rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-base tracking-tight">Proposed Candidate Version</h3>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">Revision comparison and validator consensus telemetry</p>
                  </div>
                  {proposedVersionData ? (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 font-mono">
                      v{proposedVersionData.version} {proposedVersionData.status.replace(/_/g, " ")}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-xs font-mono">No candidate currently proposed</span>
                  )}
                </div>

                {proposedVersionData ? (
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-550 uppercase mb-2">v{activeVersionData?.version} Active Mandate</span>
                        <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-900 text-xs text-zinc-300 font-mono min-h-[100px]">
                          {activeVersionData?.mandate_text}
                        </div>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-550 uppercase mb-2">v{proposedVersionData.version} Candidate</span>
                        <div className="rounded-xl bg-rose-950/90 p-4 border border-rose-900 text-xs text-rose-100 font-mono min-h-[100px]">
                          {proposedVersionData.mandate_text}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4 font-mono text-[10px]">
                      <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200">
                        <span className="text-zinc-400 block">Requires Consent</span>
                        <span className="font-bold text-zinc-700">{proposedVersionData.requires_consent ? "YES" : "NO"}</span>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200">
                        <span className="text-zinc-400 block">Guardian Window</span>
                        <span className="font-bold text-zinc-700">{proposedVersionData.requires_guardian_window ? "YES" : "NO"}</span>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200">
                        <span className="text-zinc-400 block">Semantic Class</span>
                        <span className="font-bold text-rose-600">{proposedVersionData.semantic_class.replace(/_/g, " ")}</span>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200">
                        <span className="text-zinc-400 block">Risk Score</span>
                        <span className="font-bold text-amber-600">{proposedVersionData.risk_score}/100</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-150 pt-4 flex flex-wrap gap-2.5">
                      {proposedVersionData.status === "PROPOSED" && (
                        <button
                          onClick={handleReviewMandate}
                          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800"
                        >
                          <Sparkles className="size-4 text-rose-500 animate-pulse" />
                          <span>Run Multi-Validator Review</span>
                        </button>
                      )}

                      {proposedVersionData.status === "AWAITING_CONSENT" && (
                        <>
                          <button
                            onClick={handleConsentMandate}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/20"
                          >
                            <CheckCircle className="size-4" />
                            <span>Consent to Mandate (Principal)</span>
                          </button>
                          <button
                            onClick={handleRejectMandate}
                            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-500/20"
                          >
                            <Ban className="size-4" />
                            <span>Reject (Principal)</span>
                          </button>
                        </>
                      )}

                      {(proposedVersionData.status === "AWAITING_CONSENT" || proposedVersionData.status === "IN_GUARDIAN_CHALLENGE") && (
                        <button
                          onClick={handleVetoMandate}
                          className="flex items-center gap-1.5 rounded-lg bg-red-950/20 border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-950/30"
                        >
                          <ShieldAlert className="size-4 text-red-500" />
                          <span>Execute Guardian Veto</span>
                        </button>
                      )}

                      {proposedVersionData.status === "IN_GUARDIAN_CHALLENGE" && (
                        <button
                          onClick={handleFinalizeChallenge}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/20"
                        >
                          <CheckCircle className="size-4" />
                          <span>Finalize Challenge Window</span>
                        </button>
                      )}

                      <button
                        onClick={handleRecoverMandate}
                        className="flex items-center gap-1.5 rounded-lg bg-zinc-100 border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-550 transition hover:text-zinc-900"
                      >
                        <Clock className="size-4" />
                        <span>Recover Stale Expiry</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-400 font-light border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                    No proposed candidate rules currently locked in. Enter a revision text below to start.
                  </div>
                )}

                {/* Propose Revision Input Form */}
                <form onSubmit={handleProposeVersion} className="border-t border-zinc-150 pt-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-2">Propose Mandate Revision (New Rules)</label>
                    <textarea
                      required
                      rows={3}
                      value={proposeText}
                      onChange={e => setProposeText(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-800 focus:border-rose-500/40 focus:outline-none"
                      placeholder="e.g. Expand daily drawdown limit to 2500 GEN..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-500"
                  >
                    <Send className="size-3.5" />
                    <span>Submit Candidate Proposal</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center draco-card rounded-2xl border border-dashed border-zinc-200 p-8 text-zinc-400 font-light text-xs bg-white/50 shadow-sm">
              Enter a mandate ID above (e.g. <span className="font-mono text-zinc-600">yield-sentinel-alpha</span>) or select "Register New Mandate" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
