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
      ...defaultValues,
    },
  });

  const onSubmit = (data: EligibilityData) => {
    onNext(data);
  };

  return (
    <div className="animate-fade-in">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firearmLicenceStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold text-foreground">
                  What is your current firearm licence status?
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
