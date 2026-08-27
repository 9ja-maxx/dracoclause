"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/providers/wallet-provider";
import { useMandateWrite } from "@/hooks/use-mandate-write";
import { readClient } from "@/lib/genlayer/client";
import { DRACO_CLAUSE_ADDRESS } from "@/lib/contract/config";
import { truncateAddress } from "@/lib/utils";
import { PlusCircle, Send, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, Layers, ShieldCheck, Clock, Ban } from "lucide-react";
import { toast } from "sonner";

export function MandateWorkspace() {
  const { address, isConnected } = useWallet();
  const { submitMandateWrite } = useMandateWrite();

  // Active view: "REGISTRY" | "CREATE"
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

  // Pre-fill fields once wallet connects
  useEffect(() => {
    if (address) {
      setCreateForm(prev => ({
        ...prev,
        delegate: address,
        guardian: address
      }));
    }
  }, [address]);

  // Fetch Mandate details from the contract
  const fetchMandateDetails = async (idToSearch = searchId) => {
    if (!idToSearch.strip()) return;
    setLoading(true);
    try {
      // 1. Get mandate metadata
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

      // 2. Fetch active version details
      const activeVerRes = await (readClient as any).readContract({
        address: DRACO_CLAUSE_ADDRESS,
        functionName: "get_version",
        args: [idToSearch, metaRes.active_version]
      });
      setActiveVersionData(activeVerRes);

      // 3. Fetch open/proposed version details if it exists
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
      toast.error("Failed to fetch mandate from GenLayer StudioNet");
    } finally {
      setLoading(false);
    }
  };

  // Submit Create Mandate
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

  // Submit Propose Version
  const handleProposeVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeText.strip()) return;
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

  // Submit Review Mandate
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

  // Submit Consent to Mandate
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

  // Submit Veto
  const handleVetoMandate = async () => {
    if (!mandateData) return;
    try {
      await submitMandateWrite({
        // Vetoes open version
        functionName: "veto_mandate",
        args: [searchId, mandateData.open_version, "Guardian Security Veto: Parameters override safety charter"],
        title: "Guardian Veto on Mandate v" + mandateData.open_version,
        mandateId: searchId,
        version: mandateData.open_version
      });
    } catch {}
  };

  // Submit Reject
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

  // Submit Expiry Recovery
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

  return (
    <div className="space-y-8">
      {/* Workspace Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
        <button
          onClick={() => setActiveTab("REGISTRY")}
          className={"flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition " +
            (activeTab === "REGISTRY"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "text-zinc-400 hover:text-white")}
        >
          <Layers className="size-4" />
          <span>Active Mandate Registry</span>
        </button>
        <button
          onClick={() => setActiveTab("CREATE")}
          className={"flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition " +
            (activeTab === "CREATE"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "text-zinc-400 hover:text-white")}
        >
          <PlusCircle className="size-4" />
          <span>Register New Mandate</span>
        </button>
      </div>

      {activeTab === "CREATE" && (
        <form onSubmit={handleCreateMandate} className="draco-card rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-white text-base">Register Agent Capability Mandate</h3>
          <p className="text-xs text-zinc-400 font-light">Establish a new semantic control plane for an autonomous delegate.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Unique Mandate ID</label>
              <input
                type="text"
                required
                value={createForm.mandateId}
                onChange={e => setCreateForm({...createForm, mandateId: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Delegate (Agent Address)</label>
              <input
                type="text"
                required
                value={createForm.delegate}
                onChange={e => setCreateForm({...createForm, delegate: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Guardian (Safety Sentinel Address)</label>
              <input
                type="text"
                required
                value={createForm.guardian}
                onChange={e => setCreateForm({...createForm, guardian: e.target.value})}
                className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                placeholder="0x..."
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 mb-2">Review TTL (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.reviewTtl}
                  onChange={e => setCreateForm({...createForm, reviewTtl: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 mb-2">Consent TTL (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.consentTtl}
                  onChange={e => setCreateForm({...createForm, consentTtl: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 mb-2">Guardian Window (s)</label>
                <input
                  type="number"
                  required
                  value={createForm.guardianWindow}
                  onChange={e => setCreateForm({...createForm, guardianWindow: parseInt(e.target.value)})}
                  className="w-full rounded-xl border border-zinc-800 bg-black/60 px-3 py-2 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Initial Mandate Text (Natural Language Rules)</label>
            <textarea
              required
              rows={4}
              value={createForm.initialText}
              onChange={e => setCreateForm({...createForm, initialText: e.target.value})}
              className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
              placeholder="e.g., The sentinel agent may rebalance USDC and DAI pools with daily drawdown limit of 500 GEN..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Governing Charter Rules</label>
            <textarea
              required
              rows={3}
              value={createForm.charterRules}
              onChange={e => setCreateForm({...createForm, charterRules: e.target.value})}
              className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
              placeholder="e.g., Drawdown ceiling increases require re-consent. Disabling circuit breakers is high risk..."
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
          >
            <PlusCircle className="size-4" />
            <span>Submit Registration Transaction to StudioNet</span>
          </button>
        </form>
      )}

      {activeTab === "REGISTRY" && (
        <div className="space-y-6">
          {/* Lookup Panel */}
          <div className="draco-card rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase mb-2">Lookup Active Mandate ID</label>
              <input
                type="text"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full rounded-xl border border-zinc-850 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                placeholder="Enter mandate ID..."
              />
            </div>
            <button
              onClick={() => fetchMandateDetails()}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-3 text-xs font-semibold text-white transition hover:bg-zinc-850 disabled:opacity-50 self-end"
            >
              <RefreshCw className={"size-4 " + (loading ? "animate-spin" : "")} />
              <span>Query StudioNet</span>
            </button>
          </div>

          {/* Stored Mandate Record */}
          {mandateData ? (
            <div className="space-y-6">
              {/* Dossier Meta */}
              <div className="draco-card rounded-2xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
                  <div>
                    <h3 className="font-bold text-white text-base tracking-tight">On-Chain Capability Dossier</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Principal Address: {truncateAddress(mandateData.principal)}</p>
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    v{mandateData.active_version} Authorized
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs font-mono">
                  <div className="rounded-xl bg-black/40 p-4 border border-zinc-900/50">
                    <div className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Delegate (Agent)</div>
                    <span className="text-zinc-300">{truncateAddress(mandateData.delegate)}</span>
                  </div>
                  <div className="rounded-xl bg-black/40 p-4 border border-zinc-900/50">
                    <div className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Guardian (Sentinel)</div>
                    <span className="text-zinc-300">{truncateAddress(mandateData.guardian)}</span>
                  </div>
                  <div className="rounded-xl bg-black/40 p-4 border border-zinc-900/50">
                    <div className="text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Consent Window</div>
                    <span className="text-zinc-300">{mandateData.guardian_window_seconds} seconds</span>
                  </div>
                </div>

                {activeVersionData && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase">Active Mandate Rules</label>
                    <div className="rounded-xl bg-black/60 p-4 border border-zinc-900/60 font-mono text-xs text-zinc-300 leading-relaxed">
                      {activeVersionData.mandate_text}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase">Charter Rubric Rules</label>
                  <div className="rounded-xl bg-black/20 p-4 border border-zinc-900/40 text-xs text-zinc-400 font-light italic">
                    "{mandateData.charter_rules}"
                  </div>
                </div>
              </div>

              {/* Proposed Candidate Section */}
              <div className="draco-card rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base tracking-tight">Proposed Candidate Version</h3>
                    <p className="text-xs text-zinc-400 font-light">Semantic Audit consensus tracker</p>
                  </div>
                  {proposedVersionData ? (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono animate-pulse">
                      v{proposedVersionData.version} {proposedVersionData.status.replace(/_/g, " ")}
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs font-mono">No candidate currently proposed</span>
                  )}
                </div>

                {proposedVersionData ? (
                  <div className="space-y-5">
                    {/* Diff/Text Block */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase mb-2">v{activeVersionData?.version} Active Mandate</span>
                        <div className="rounded-xl bg-black/50 p-4 border border-zinc-900/60 text-xs text-zinc-400 font-mono min-h-[100px]">
                          {activeVersionData?.mandate_text}
                        </div>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase mb-2">v{proposedVersionData.version} Candidate</span>
                        <div className="rounded-xl bg-rose-950/10 p-4 border border-rose-500/10 text-xs text-amber-200/90 font-mono min-h-[100px]">
                          {proposedVersionData.mandate_text}
                        </div>
                      </div>
                    </div>

                    {/* Metadata indicators */}
                    <div className="grid gap-3 sm:grid-cols-4 font-mono text-[10px]">
                      <div className="rounded-xl bg-black/30 p-3 border border-zinc-900">
                        <span className="text-zinc-500 block">Requires Consent</span>
                        <span className="font-bold text-zinc-300">{proposedVersionData.requires_consent ? "YES" : "NO"}</span>
                      </div>
                      <div className="rounded-xl bg-black/30 p-3 border border-zinc-900">
                        <span className="text-zinc-500 block">Guardian Window</span>
                        <span className="font-bold text-zinc-300">{proposedVersionData.requires_guardian_window ? "YES" : "NO"}</span>
                      </div>
                      <div className="rounded-xl bg-black/30 p-3 border border-zinc-900">
                        <span className="text-zinc-500 block">Semantic Class</span>
                        <span className="font-bold text-rose-400">{proposedVersionData.semantic_class.replace(/_/g, " ")}</span>
                      </div>
                      <div className="rounded-xl bg-black/30 p-3 border border-zinc-900">
                        <span className="text-zinc-500 block">Risk Score</span>
                        <span className="font-bold text-amber-400">{proposedVersionData.risk_score}/100</span>
                      </div>
                    </div>

                    {/* On-Chain Interactive State Actions */}
                    <div className="border-t border-zinc-900 pt-4 flex flex-wrap gap-2.5">
                      {proposedVersionData.status === "PROPOSED" && (
                        <button
                          onClick={handleReviewMandate}
                          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-850"
                        >
                          <Sparkles className="size-4 text-rose-500 animate-pulse" />
                          <span>Run Multi-Validator Review</span>
                        </button>
                      )}

                      {proposedVersionData.status === "AWAITING_CONSENT" && (
                        <>
                          <button
                            onClick={handleConsentMandate}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                          >
                            <CheckCircle className="size-4" />
                            <span>Consent to Mandate (Principal)</span>
                          </button>
                          <button
                            onClick={handleRejectMandate}
                            className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                          >
                            <Ban className="size-4" />
                            <span>Reject (Principal)</span>
                          </button>
                        </>
                      )}

                      {(proposedVersionData.status === "AWAITING_CONSENT" || proposedVersionData.status === "IN_GUARDIAN_CHALLENGE") && (
                        <button
                          onClick={handleVetoMandate}
                          className="flex items-center gap-1.5 rounded-lg bg-red-950/20 border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-950/40"
                        >
                          <ShieldAlert className="size-4 text-red-400" />
                          <span>Execute Guardian Veto</span>
                        </button>
                      )}

                      <button
                        onClick={handleRecoverMandate}
                        className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:text-white"
                      >
                        <Clock className="size-4" />
                        <span>Recover Stale Expiry</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-500 font-light border border-dashed border-zinc-900 rounded-xl">
                    No candidate revision currently locked in. Propose a new text below.
                  </div>
                )}

                {/* Propose Revision Input Form */}
                <form onSubmit={handleProposeVersion} className="border-t border-zinc-900 pt-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 mb-2">Propose Mandate Revision (Candidate Text)</label>
                    <textarea
                      required
                      rows={3}
                      value={proposeText}
                      onChange={e => setProposeText(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-rose-500/40 focus:outline-none"
                      placeholder="Enter candidate mandate revision..."
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
            <div className="py-20 text-center draco-card rounded-2xl border border-dashed border-zinc-800/80 p-8 text-zinc-500 font-light text-xs">
              Enter a mandate ID above or select "Register New Mandate" to initialize one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
