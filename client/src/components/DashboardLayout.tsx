import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClipboardCheck, FileClock, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const menuItems = [
  { label: "Tableau de bord", path: "/", icon: LayoutDashboard },
  { label: "Contrôle du mois", path: "/controle", icon: ClipboardCheck },
  { label: "Historique", path: "/historique", icon: FileClock },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[28px] bg-white p-9 shadow-[0_20px_70px_rgba(32,55,45,0.12)] border border-[#e1e9e3] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5f1e8] text-[#227447]"><ShieldCheck size={30} /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b7565]">Notre-Dame de Basse-Wavre</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#19352a]">Contrôle Cour</h1>
          <p className="mt-4 text-sm leading-6 text-[#66786d]">Cette application est réservée au personnel autorisé du collège. Connectez-vous pour accéder aux contrôles de sécurité.</p>
          <Button onClick={() => startLogin()} className="mt-8 h-12 w-full rounded-xl bg-[#227447] text-white hover:bg-[#1b603a]">Accéder à l’application</Button>
        </div>
      </div>
    );
  }

  if (user.accessStatus !== "approved") {
    return <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center px-6"><div className="w-full max-w-md rounded-[28px] bg-white p-9 text-center shadow-[0_20px_70px_rgba(32,55,45,0.12)] border border-[#e1e9e3]"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3dd] text-[#a96916]"><ShieldCheck size={30} /></div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b7565]">Accès en attente</p><h1 className="mt-3 font-serif text-3xl font-semibold text-[#19352a]">Compte à approuver</h1><p className="mt-4 text-sm leading-6 text-[#66786d]">Votre demande d’accès a bien été enregistrée. Un administrateur du collège doit encore valider votre compte.</p><Button onClick={logout} variant="outline" className="mt-8 h-11 w-full rounded-xl">Se déconnecter</Button></div></div>;
  }
  const initials = (user.name || "I").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="min-h-screen bg-[#f5f7f4] text-[#19352a] md:flex">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-[#dfe9e1] bg-[#fbfcfa] p-5 md:flex">
        <div className="flex items-center gap-3 px-2 py-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#227447] text-white"><ShieldCheck size={21} /></div><div><p className="font-serif text-lg font-semibold">Contrôle Cour</p><p className="text-[11px] text-[#7a8e80]">Notre-Dame · Basse-Wavre</p></div></div>
        <nav className="mt-10 space-y-2">{menuItems.map(item => { const Icon = item.icon; const active = location === item.path; return <button key={item.path} onClick={() => setLocation(item.path)} className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors", active ? "bg-[#e4f1e8] font-semibold text-[#227447]" : "text-[#6b7d72] hover:bg-[#f0f5f1] hover:text-[#19352a]")}><Icon size={18} />{item.label}</button>; })}</nav>
        <div className="mt-auto rounded-2xl bg-[#edf4ee] p-4"><p className="text-xs font-semibold text-[#227447]">Rappel qualité</p><p className="mt-2 text-xs leading-5 text-[#63766a]">Un contrôle mensuel documenté contribue à garder la cour sûre et accueillante.</p></div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#e0e9e2] pt-5"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[#d8eadd] text-xs font-semibold text-[#227447]">{initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.name || "Personnel"}</p><p className="text-xs text-[#7a8e80]">{user.role === "admin" ? "Administrateur" : "Inspecteur"}</p></div><button onClick={logout} className="text-[#789084] hover:text-[#b44436]" aria-label="Se déconnecter"><LogOut size={17} /></button></div>
      </aside>
      <div className="min-w-0 flex-1 pb-20 md:pb-0"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2eae3] bg-[#fbfcfa]/95 px-5 backdrop-blur md:px-10"><div><p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7c9081] md:block">Suivi des équipements</p><p className="font-serif text-xl font-semibold md:hidden">Contrôle Cour</p></div><div className="flex items-center gap-3"><span className="hidden rounded-full bg-[#e7f2e9] px-3 py-1.5 text-xs font-medium text-[#227447] sm:inline-flex">Accès sécurisé</span><Avatar className="h-9 w-9 md:hidden"><AvatarFallback className="bg-[#d8eadd] text-xs font-semibold text-[#227447]">{initials}</AvatarFallback></Avatar></div></header><main className="mx-auto w-full max-w-[1500px] px-5 py-7 md:px-10 md:py-10">{children}</main></div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-[#dfe9e1] bg-[#fbfcfa] md:hidden">{menuItems.map(item => { const Icon = item.icon; const active = location === item.path; return <button key={item.path} onClick={() => setLocation(item.path)} className={cn("flex flex-col items-center gap-1 py-3 text-[10px]", active ? "font-semibold text-[#227447]" : "text-[#789084]")}><Icon size={19} />{item.label}</button>; })}</nav>
    </div>
  );
}
