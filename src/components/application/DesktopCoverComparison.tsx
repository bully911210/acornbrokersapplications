import { Check, Circle } from "lucide-react";
import { COVER_OPTIONS, type CoverOption } from "@/lib/coverData";

interface DesktopCoverComparisonProps {
  selectedId?: CoverOption["id"];
  onSelect: (id: CoverOption["id"]) => void;
  formatCurrency: (amount: number) => string;
}

const DETAIL_COPY: Record<
  CoverOption["id"],
  {
    legal: string;
    liability: string;
    bail: string;
    support: string;
    family: string;
  }
> = {
  option_a: {
    legal: "per case",
    liability: "p/a",
    bail: "Bail application assistance",
    support: "SAP 13 and CFR support",
    family: "Individual cover",
  },
  option_b: {
    legal: "per case",
    liability: "p/a",
    bail: "Bail application assistance",
    support: "SAP 13 and CFR support",
    family: "Same-household family cover",
  },
  option_c: {
    legal: "per case",
    liability: "p/a",
    bail: "SAPS Delay Assist up to R3,000",
    support: "Full firearms admin support",
    family: "Spouse and dependants included",
  },
};

export const DesktopCoverComparison = ({
  selectedId,
  onSelect,
  formatCurrency,
}: DesktopCoverComparisonProps) => {
  const activeOption =
    COVER_OPTIONS.find((option) => option.id === selectedId) ?? COVER_OPTIONS[1];

  return (
    <div className="hidden lg:block space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {COVER_OPTIONS.map((option, index) => {
          const detailCopy = DETAIL_COPY[option.id];
          const isSelected = option.id === selectedId;
          const isFeatured = option.id === "option_b";

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.id)}
              className={`relative flex min-h-[360px] flex-col rounded-lg border bg-card p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-accent/30 shadow-[var(--shadow-soft)]"
                  : "border-border hover:border-primary/40 hover:bg-accent/10"
              }`}
            >
              {isFeatured && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-destructive-foreground">
                  Most popular
                </div>
              )}

              <div className="mb-5 border-b border-border pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Option {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-bold text-foreground">
                  {option.name}
                </h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-bold leading-none text-foreground">
                    {formatCurrency(option.premium)}
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Firearm owners
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Legal",
                    value: `${formatCurrency(option.legalExpenseLimit)} ${detailCopy.legal}`,
                  },
                  {
                    label: "Liability",
                    value: `${formatCurrency(option.liabilityLimit)} ${detailCopy.liability}`,
                  },
                  { label: "Bail / delays", value: detailCopy.bail },
                  { label: "Support", value: detailCopy.support },
                  { label: "Family", value: detailCopy.family },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[auto_1fr] items-start gap-3 border-b border-border/70 pb-3 last:border-b-0"
                  >
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.label}</p>
                      <p className="text-sm leading-5 text-muted-foreground">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-foreground">
                {isSelected ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                {isSelected ? "Selected" : "Select this cover"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Included details
            </p>
            <h4 className="mt-2 text-lg font-bold text-foreground">
              {activeOption.name}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Full cover wording for the selected plan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h5 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Benefits
            </h5>
            <div className="space-y-3">
              {activeOption.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Exclusions
            </h5>
            <div className="space-y-3">
              {activeOption.exclusions.map((exclusion) => (
                <div key={exclusion} className="flex items-start gap-3 text-sm">
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{exclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};