import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { eligibilitySchema, EligibilityData } from "@/lib/validations";
import { Shield, Users, Globe, UserPlus } from "lucide-react";

interface EligibilityStepProps {
  defaultValues?: Partial<EligibilityData>;
  onNext: (data: EligibilityData) => void;
}

export const EligibilityStep = ({ defaultValues, onNext }: EligibilityStepProps) => {
  const form = useForm<EligibilityData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      firearmLicenceStatus: undefined,
      source: undefined,
      ...defaultValues,
    },
  });

  const onSubmit = (data: EligibilityData) => {
    onNext(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="step-content-intro">
        <p className="step-content-kicker">Section 1</p>
        <h2 className="step-content-title">
          Confirm eligibility
        </h2>
        <p className="step-content-copy">
          First, we need to confirm your eligibility for firearm legal cover.
        </p>
      </div>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Licence position</h3>
              <p>Select the option that best reflects your current status.</p>
            </div>

            <FormField
              control={form.control}
              name="firearmLicenceStatus"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-sm md:text-base font-semibold">
                    What is your firearm licence status?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      className="grid grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      <label
                        className={`option-tile-compact ${
                          field.value === "valid"
                            ? "option-tile-compact-selected"
                            : "option-tile-compact-muted"
                        }`}
                      >
                        <RadioGroupItem value="valid" className="sr-only" />
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-success-light p-2">
                            <Shield className="h-5 w-5 text-success" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">Valid licence</p>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                              I have a current, valid firearm licence.
                            </p>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`option-tile-compact ${
                          field.value === "in_progress"
                            ? "option-tile-compact-selected"
                            : "option-tile-compact-muted"
                        }`}
                      >
                        <RadioGroupItem value="in_progress" className="sr-only" />
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-warning-light p-2">
                            <Shield className="h-5 w-5 text-warning" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">Application in progress</p>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                              My firearm licence application is still being processed.
                            </p>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Referral source</h3>
              <p>This helps Acorn Brokers track how applicants find the product.</p>
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-sm md:text-base font-semibold">
                    How did you hear about us?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      className="grid grid-cols-2 gap-3 md:grid-cols-4"
                    >
                      {[
                        { value: "online", label: "Online", icon: Globe },
                        { value: "agent", label: "Agent", icon: UserPlus },
                        { value: "referral", label: "Referral", icon: Users },
                        { value: "other", label: "Other", icon: Shield },
                      ].map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className={`option-tile-compact flex min-h-[88px] flex-col items-start justify-between ${
                            field.value === value
                              ? "option-tile-compact-selected"
                              : "option-tile-compact-muted"
                          }`}
                        >
                          <RadioGroupItem value={value} className="sr-only" />
                          <Icon className="h-5 w-5 text-primary" />
                          <p className="text-sm font-medium text-foreground">{label}</p>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <div className="form-actions md:justify-end">
            <Button type="submit" size="lg" className="w-full md:w-auto md:min-w-[200px]">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
