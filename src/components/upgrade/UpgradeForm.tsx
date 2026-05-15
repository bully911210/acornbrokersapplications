import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  upgradeRequestSchema,
  UpgradeRequestData,
  normalizePhone,
} from "@/lib/validations";
import { submitUpgradeRequest } from "@/lib/apiClient";
import { extractAgentAttribution } from "@/lib/sessionManager";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export const UpgradeForm = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<UpgradeRequestData>({
    resolver: zodResolver(upgradeRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      saIdNumber: "",
      mobile: "",
      email: "",
      currentCoverOption: undefined,
      requestedCoverOption: undefined,
      effectiveDatePreference: undefined,
      notes: "",
      signatureName: "",
      signatureConsent: false as unknown as true,
      popiaConsent: false as unknown as true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UpgradeRequestData) =>
      submitUpgradeRequest({
        ...data,
        mobile: normalizePhone(data.mobile),
        agentId: extractAgentAttribution(),
      }),
    onSuccess: () => setSubmitted(true),
    onError: (err: Error) => {
      toast({
        title: "Submission failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Upgrade request received
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you. An Acorn Brokers consultant will be in touch within one business day to confirm your upgrade and amend your debit order accordingly.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
        className="space-y-6"
      >
        <section className="fieldset-section">
          <div className="fieldset-title">
            <h3>Your details</h3>
            <p>Confirm the policyholder's identity for verification.</p>
          </div>
          <div className="field-grid-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="saIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SA ID number</FormLabel>
                <FormControl>
                  <MaskedInput
                    maskType="saId"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="910210 5009 08 7"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="field-grid-2">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <MaskedInput
                      maskType="mobile"
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="082 123 4567"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="fieldset-section">
          <div className="fieldset-title">
            <h3>Current policy</h3>
            <p>Tell us which policy you'd like to upgrade.</p>
          </div>
          <FormField
            control={form.control}
            name="currentPolicyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Existing policy number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. FG-00012345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentCoverOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current cover</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current cover" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="option_a">Essential (R135/pm)</SelectItem>
                    <SelectItem value="option_b">Comprehensive (R245/pm)</SelectItem>
                    <SelectItem value="unsure">I'm not sure</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="fieldset-section">
          <div className="fieldset-title">
            <h3>Requested change</h3>
            <p>Choose the cover tier you would like to move to.</p>
          </div>
          <FormField
            control={form.control}
            name="requestedCoverOption"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="grid grid-cols-1 gap-3 md:grid-cols-2"
                  >
                    {[
                      {
                        value: "option_a",
                        title: "Essential",
                        price: "R135 / month",
                        copy: "R100,000 legal expense and liability cover.",
                      },
                      {
                        value: "option_b",
                        title: "Comprehensive",
                        price: "R245 / month",
                        copy: "R300,000 legal expense and liability cover.",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`option-tile-compact ${
                          field.value === opt.value
                            ? "option-tile-compact-selected"
                            : "option-tile-compact-muted"
                        }`}
                      >
                        <RadioGroupItem value={opt.value} className="sr-only" />
                        <div>
                          <p className="font-semibold text-foreground">{opt.title}</p>
                          <p className="text-sm font-medium text-primary">{opt.price}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{opt.copy}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveDatePreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When should the change take effect?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="next_debit">From my next debit order</SelectItem>
                    <SelectItem value="next_month">From the 1st of next month</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Anything else we should know?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="fieldset-section">
          <div className="fieldset-title">
            <h3>Authorisation &amp; signature</h3>
            <p>Confirm and sign to authorise the upgrade.</p>
          </div>

          <FormField
            control={form.control}
            name="signatureName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type your full name as electronic signature</FormLabel>
                <FormControl>
                  <Input placeholder="Full legal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="bg-muted/20 px-5 py-4">
              <FormField
                control={form.control}
                name="signatureConsent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <label
                        className="cursor-pointer text-sm text-foreground"
                        onClick={() => field.onChange(!field.value)}
                      >
                        I authorise Acorn Brokers (Pty) Ltd, Firearms Guardian (Pty) Ltd, and GENRIC Insurance Company Ltd to amend my existing policy and adjust my monthly debit order amount on the existing mandate to reflect the requested cover tier.
                      </label>
                    </div>
                    <FormMessage className="ml-7 mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/20 px-5 py-4">
              <FormField
                control={form.control}
                name="popiaConsent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <label
                        className="cursor-pointer text-sm text-foreground"
                        onClick={() => field.onChange(!field.value)}
                      >
                        I consent to my personal information being processed in accordance with POPIA for the purpose of administering this upgrade request.
                      </label>
                    </div>
                    <FormMessage className="ml-7 mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-primary" />
            Acorn Brokers (FSP 47433) will confirm the change in writing before any debit order amount is adjusted.
          </p>
        </section>

        <div className="form-actions md:justify-end">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto md:min-w-[220px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
            ) : (
              "Submit upgrade request"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
