import { requireUser } from "@/lib/session";
import { ROLES_THAT_CAN_MANAGE_SETTINGS } from "@/lib/types";
import { SettingsForm } from "@/components/forms/SettingsForm";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Manage visual language preferences, theme engines, and reconciliation
          rules.
        </p>
      </div>
      <SettingsForm
        initialTolerance={user.environment.toleranceThreshold}
        canEdit={ROLES_THAT_CAN_MANAGE_SETTINGS.includes(user.role as any)}
      />
    </div>
  );
}
