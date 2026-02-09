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
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { bankingDetailsSchema, BankingDetailsData, SA_BANKS } from "@/lib/validations";
import { ArrowLeft, Building2, CreditCard, Calendar } from "lucide-react";

interface BankingDetailsStepProps {
  defaultValues?: Partial<BankingDetailsData>;
  onNext: (data: BankingDetailsData) => void;
  onBack: () => void;
}

export const BankingDetailsStep = ({
  defaultValues,
  onNext,
  onBack,
}: BankingDetailsStepProps) => {
  const form = useForm<BankingDetailsData>({
    resolver: zodResolver(bankingDetailsSchema),
    defaultValues: {
      accountHolder: "",
      bankName: undefined,
      accountType: undefined,
      accountNumber: "",
      preferredDebitDate: undefined,
      ...defaultValues,
    },
  });

  const onSubmit = (data: BankingDetailsData) => {
    onNext(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Banking Details
        </h2>
        <p className="text-muted-foreground">
          Provide your banking information for the monthly debit order.
        </p>
      </div>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name as it appears on your bank account" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select your bank" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SA_BANKS.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "cheque", label: "Cheque" },
                      { value: "savings", label: "Savings" },
                      { value: "transmission", label: "Transmission" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className={`cover-card text-center py-3 ${
                          field.value === value
                            ? "cover-card-selected"
                            : "cover-card-unselected"
                        }`}
                      >
                        <RadioGroupItem value={value} className="sr-only" />
                        <CreditCard className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                        <p className="text-sm font-medium">{label}</p>
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
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <MaskedInput
                    maskType="accountNumber"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="1234 5678 90"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredDebitDate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Preferred Debit Date</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "1", label: "1st" },
                      { value: "15", label: "15th" },
                      { value: "25", label: "25th" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className={`cover-card text-center py-3 ${
                          field.value === value
                            ? "cover-card-selected"
                            : "cover-card-unselected"
                        }`}
                      >
                        <RadioGroupItem value={value} className="sr-only" />
                        <Calendar className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">of month</p>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
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
