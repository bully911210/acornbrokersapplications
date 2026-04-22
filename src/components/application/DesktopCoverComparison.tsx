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

  const comparisonRows = [
    {
      label: "Legal",
      value: `${formatCurrency(activeOption.legalExpenseLimit)} ${DETAIL_COPY[activeOption.id].legal}`,
    },
    {
      label: "Liability",
      value: `${formatCurrency(activeOption.liabilityLimit)} ${DETAIL_COPY[activeOption.id].liability}`,
    },
    { label: "Bail / delays", value: DETAIL_COPY[activeOption.id].bail },
    { label: "Support", value: DETAIL_COPY[activeOption.id].support },
    { label: "Family", value: DETAIL_COPY[activeOption.id].family },
  ];

  return (
    <div className="hidden lg:block space-y-6">
      <div className="grid grid-cols-3 gap-5">
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
              className={`relative flex min-h-[390px] flex-col rounded-lg border bg-card p-6 text-left transition-all duration-200 ${
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

              <div className="space-y-1.5">
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
                    className="grid grid-cols-[auto_1fr] items-start gap-3 border-b border-border/70 py-3 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold leading-5 text-foreground">{row.label}</p>
                      <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{row.value}</p>
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

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 rounded-lg border border-border/80 bg-muted/10 p-5">
            <h5 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              At a glance
            </h5>
            <div className="overflow-hidden rounded-md border border-border/70 bg-card">
              {comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border/70 px-4 py-3 last:border-b-0"
                >
                  <span className="text-sm font-semibold text-foreground">{row.label}</span>
                  <span className="text-sm leading-6 text-muted-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 rounded-lg border border-border/80 bg-muted/10 p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Benefits
                </h5>
                <div className="space-y-3">
                  {activeOption.benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3 border-b border-border/70 pb-3 text-sm last:border-b-0 last:pb-0"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-6 text-foreground/85">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Exclusions
                </h5>
                <div className="space-y-3">
                  {activeOption.exclusions.map((exclusion) => (
                    <div
                      key={exclusion}
                      className="flex items-start gap-3 border-b border-border/70 pb-3 text-sm last:border-b-0 last:pb-0"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                        <Circle className="h-3 w-3 fill-current" />
                      </span>
                      <span className="leading-6 text-foreground/75">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};