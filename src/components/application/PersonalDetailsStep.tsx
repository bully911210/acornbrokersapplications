import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  personalDetailsSchema,
  PersonalDetailsData,
  SA_PROVINCES,
} from "@/lib/validations";
import { parseSAId } from "@/lib/saIdParser";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface PersonalDetailsStepProps {
  defaultValues?: Partial<PersonalDetailsData>;
  onNext: (data: PersonalDetailsData) => void;
  onBack: () => void;
}

export const PersonalDetailsStep = ({
  defaultValues,
  onNext,
  onBack,
}: PersonalDetailsStepProps) => {
  const form = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      saIdNumber: "",
      mobile: "",
      email: "",
      streetAddress: "",
      suburb: "",
      city: "",
      province: undefined,
      ...defaultValues,
    },
  });

  const watchedIdNumber = form.watch("saIdNumber");
  
  const idInfo = useMemo(() => {
    const rawId = watchedIdNumber?.replace(/\s/g, '') || '';
    if (rawId.length === 13) {
      return parseSAId(rawId);
    }
    return null;
  }, [watchedIdNumber]);

  const onSubmit = (data: PersonalDetailsData) => {
    onNext(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="step-content-intro">
        <p className="step-content-kicker">Section 2</p>
        <h2 className="step-content-title">Personal details</h2>
        <p className="step-content-copy">
          Please provide your personal information as it appears on your identification document.
        </p>
      </div>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Identity details</h3>
              <p>Enter your name exactly as it should appear on policy records.</p>
            </div>

            <div className="field-grid-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
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
                  <FormLabel>SA ID Number</FormLabel>
                  <FormControl>
                    <MaskedInput
                      maskType="saId"
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="910210 5009 08 7"
                    />
                  </FormControl>
                  {idInfo?.isValid && (
                    <div className="mt-1.5 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                      <span>
                        Verified: Born {idInfo.formattedDOB} • {idInfo.gender} • {idInfo.citizenship}
                      </span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Contact details</h3>
              <p>Use the number and email address where policy correspondence should be sent.</p>
            </div>

            <div className="field-grid-2">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Residential address</h3>
              <p>Provide your current physical address for compliance and policy administration.</p>
            </div>

            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="field-grid-2">
              <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb</FormLabel>
                    <FormControl>
                      <Input placeholder="Suburb" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SA_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <div className="form-actions">
            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="min-w-[200px]">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
