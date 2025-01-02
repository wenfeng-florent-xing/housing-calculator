import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";

type props = {
  form: UseFormReturn<{
    priceOfProperty: number;
    downPayment: number;
    interestRate: number;
    amortization: number;
    downPaymentMethod: "dollar" | "percentage";
    // monthlyPayment: number;
  }>;
};

export function DownPaymentMethod({ form }: props) {
  return (
    <FormField
      control={form.control}
      name="downPaymentMethod"
      render={({ field }) => (
        <FormItem >
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="h-full">
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="dollar">$</SelectItem>
              <SelectItem value="percentage">%</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
