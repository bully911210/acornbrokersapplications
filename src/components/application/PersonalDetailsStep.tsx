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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Personal Details
        </h2>
        <p className="text-muted-foreground">
          Please provide your personal information as it appears on your ID document.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="stagger-1 animate-fade-in opacity-0">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="stagger-2 animate-fade-in opacity-0">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ID Number with Verification */}
          <FormField
            control={form.control}
            name="saIdNumber"
            render={({ field }) => (
              <FormItem className="stagger-3 animate-fade-in opacity-0">
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
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-500 mt-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span>
                      Verified: Born {idInfo.formattedDOB} • {idInfo.gender} • {idInfo.citizenship}
                    </span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="stagger-4 animate-fade-in opacity-0">
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
                <FormItem className="stagger-5 animate-fade-in opacity-0">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Fields */}
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem className="stagger-6 animate-fade-in opacity-0">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="suburb"
              render={({ field }) => (
                <FormItem className="stagger-7 animate-fade-in opacity-0">
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
                <FormItem className="stagger-8 animate-fade-in opacity-0">
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
              <FormItem className="animate-fade-in opacity-0" style={{ animationDelay: "0.45s" }}>
                <FormLabel>Province</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
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
