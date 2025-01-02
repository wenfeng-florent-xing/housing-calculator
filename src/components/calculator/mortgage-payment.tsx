import { useEffect, useState } from "react";
import { CustomizedInput } from "../customized";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

type propsType = {
    watch: (name: string, defaultvalue: string | number) => number | string
};

export default function MortgagePayment({watch}: propsType) {
  const [mortgagePayment, setMortgagePayment] = useState<number>();

  const priceOfProperty = watch("priceOfProperty", 0) as number;
  const downPayment = watch("downPayment", 0) as number;
  const downPaymentMethod = watch("downPaymentMethod", "dollar");

  useEffect(() => {
    setMortgagePayment(
      downPaymentMethod === "dollar"
        ? priceOfProperty - downPayment
        : priceOfProperty * (1 - downPayment / 100)
    );
  }, [downPayment, downPaymentMethod, priceOfProperty]);
  return (
    <FormItem>
      <FormLabel>Mortgage Payment</FormLabel>
      <FormControl>
        <CustomizedInput type="number" disabled defaultValue={mortgagePayment} endAdornment={<>$</>}/>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
