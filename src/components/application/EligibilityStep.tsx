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
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">
          Let's Get Started
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          First, we need to confirm your eligibility for firearm legal cover.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
          <FormField
            control={form.control}
            name="firearmLicenceStatus"
            render={({ field }) => (
              <FormItem className="space-y-2 md:space-y-4 stagger-1 animate-fade-in opacity-0">
                <FormLabel className="text-sm md:text-base font-semibold">
                  What is your firearm licence status?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
                  >
                    <label
                      className={`cover-card ${
                        field.value === "valid"
                          ? "cover-card-selected"
                          : "cover-card-unselected"
                      }`}
                    >
                      <RadioGroupItem value="valid" className="sr-only" />
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-success-light">
                          <Shield className="w-5 h-5 md:w-6 md:h-6 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Valid Licence
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            I have a current, valid firearm licence
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cover-card ${
                        field.value === "in_progress"
                          ? "cover-card-selected"
                          : "cover-card-unselected"
                      }`}
                    >
                      <RadioGroupItem value="in_progress" className="sr-only" />
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="p-2 md:p-3 rounded-lg bg-warning-light">
                          <Shield className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Application In Progress
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            My licence application is being processed
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

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem className="space-y-2 md:space-y-4 stagger-2 animate-fade-in opacity-0">
                <FormLabel className="text-sm md:text-base font-semibold">
                  How did you hear about us?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3"
                  >
                    {[
                      { value: "online", label: "Online", icon: Globe },
                      { value: "agent", label: "Agent", icon: UserPlus },
                      { value: "referral", label: "Referral", icon: Users },
                      { value: "other", label: "Other", icon: Shield },
                    ].map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        className={`cover-card text-center py-2 md:py-4 ${
                          field.value === value
                            ? "cover-card-selected"
                            : "cover-card-unselected"
                        }`}
                      >
                        <RadioGroupItem value={value} className="sr-only" />
                        <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{label}</p>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2 md:pt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto md:min-w-[200px]">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
