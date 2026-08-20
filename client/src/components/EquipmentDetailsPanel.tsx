import { useState } from "react";
import { ClipboardCheck, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

type Props = { equipment: Array<{ id: number; name: string; category: string; description?: string | null }>; };

export default function EquipmentDetailsPanel({ equipment }: Props) {
  const [equipmentId, setEquipmentId] = useState(equipment[0]?.id || 0);
  const { data: findings } = trpc.findings.list.useQuery({});
  const selected = equipment.find(item => item.id === equipmentId);
  const related = (findings || []).filter(finding => finding.equipmentId === equipmentId);
  return <Card className="mt-6 border-[#e1e9e3] shadow-none"><CardHeader><div className="flex items-center gap-3"><div className="rounded-xl bg-[#e7f4e9] p-2 text-[#227447]"><Info size={18} /></div><div><CardTitle className="font-serif text-2xl">Fiche équipement</CardTitle><p className="mt-1 text-sm text-[#819388]">Retrouvez les informations essentielles et les actions encore ouvertes.</p></div></div></CardHeader><CardContent><select value={equipmentId} onChange={event => setEquipmentId(Number(event.target.value))} className="h-11 w-full rounded-xl border border-[#dbe8de] bg-white px-3 text-sm md:max-w-sm"><option value={0}>Sélectionner un équipement</option>{equipment.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>{selected && <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]"><div className="rounded-2xl bg-[#f5faf6] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#227447]">{selected.category}</p><h3 className="mt-2 font-serif text-2xl font-semibold text-[#19352a]">{selected.name}</h3><p className="mt-2 text-sm leading-6 text-[#718579]">{selected.description || "Aucune description enregistrée."}</p><div className="mt-5 flex items-center gap-2 text-sm text-[#227447]"><ClipboardCheck size={16} /> {related.filter(finding => finding.status !== "resolved").length} anomalie(s) ouverte(s)</div></div><div className="space-y-2">{related.length ? related.slice(0, 5).map(finding => <div key={finding.id} className="rounded-2xl border border-[#e8eee9] bg-white p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{finding.criterion}</p><span className="text-xs text-[#718579]">{finding.status === "resolved" ? "Résolue" : finding.status === "in_progress" ? "En cours" : "Ouverte"}</span></div><p className="mt-1 text-xs leading-5 text-[#819388]">{finding.description}</p></div>) : <div className="rounded-2xl border border-dashed border-[#e2e9e3] p-6 text-center text-sm text-[#819388]">Aucune anomalie pour cet équipement.</div>}</div></div>}</CardContent></Card>;
}
