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
            <h3>Upgrade selection</h3>
            <p>Choose your current cover and the cover you'd like to move to.</p>
          </div>
          <div className="field-grid-2">
            <FormField
              control={form.control}
              name="currentCoverOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current cover" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="option_a">R135 / month — Essential</SelectItem>
                      <SelectItem value="option_b">R245 / month — Comprehensive</SelectItem>
                      <SelectItem value="option_c">R325 / month — Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestedCoverOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new cover" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="option_a">R135 / month — Essential</SelectItem>
                      <SelectItem value="option_b">R245 / month — Comprehensive</SelectItem>
                      <SelectItem value="option_c">R325 / month — Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
