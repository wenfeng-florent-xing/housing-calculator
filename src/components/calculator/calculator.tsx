"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { monthlyPayment } from "@/lib/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { CustomizedInput } from "../customized";
import { DownPaymentMethod } from "./down-payment-method";
import MortgagePayment from "./mortgage-payment";
import PaymentDetails from "./payment-details";

const formSchema = z.object({
  priceOfProperty: z.coerce.number().nonnegative({
    message: "The price must be greater than 0",
  }),
  downPayment: z.coerce.number().nonnegative({
    message: "The down payment must be greater or equal than 0",
  }),
  interestRate: z.coerce.number().nonnegative({
    message: "The Interest rate must be greater than 0",
  }),
  amortization: z.coerce.number().nonnegative({
    message: "The Amortization years must be greater than 0",
  }),
  // monthlyPayment: z.string().regex(/^\d*(\.\d{0,2})?$/, "monthly payment should be a number"),
  downPaymentMethod: z.enum(["dollar", "percentage"]),
});

export default function Calculator() {
  const [monthPayment, setMonthPayment] = useState<number>();
  const [mortgageDetail, setMortgageDetail] = useState<{
    principal: number;
    interestRate: number;
    amortization: number;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceOfProperty: 0,
      downPayment: 0,
      interestRate: 0,
      amortization: 25,
      downPaymentMethod: "dollar",
      // monthlyPayment: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data, event) => {
    event?.preventDefault();

    console.log("form state", form.formState);
    const result = monthlyPayment(
      data.downPaymentMethod === "dollar"
        ? data.priceOfProperty - data.downPayment
        : data.priceOfProperty * (1 - data.downPayment / 100),
      data.interestRate / 100,
      data.amortization
    );

    console.log("form result", result);
    if (result > 0) {
      setMortgageDetail({
        principal:
          data.downPaymentMethod === "dollar"
            ? data.priceOfProperty - data.downPayment
            : data.priceOfProperty * (1 - data.downPayment / 100),
        interestRate: data.interestRate / 100,
        amortization: data.amortization,
      });

      setMonthPayment(result);
    }
  };
  const handleClearAll = () => {
    form.reset();
    form.clearErrors();
    setMonthPayment(undefined);
    setMortgageDetail(undefined);
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <h2 className="text-xl font-bold">House Valuation Tool</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="priceOfProperty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Price</FormLabel>
                  <FormControl>
                    <CustomizedInput
                      type="number"
                      {...field}
                      endAdornment={<>$</>}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <FormLabel>Down Payment</FormLabel>
              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomizedInput
                          type="number"
                          {...field}
                          onBlur={() => {
                            const {
                              downPayment,
                              priceOfProperty,
                              downPaymentMethod,
                            } = form.getValues();
                            if (
                              parseInt(downPayment as unknown as string) >
                              parseInt(priceOfProperty as unknown as string)
                            ) {
                              form.setError("downPayment", {
                                message:
                                  "The down payment should be less than property price.",
                              });
                            }
                            if (downPaymentMethod === "percentage") {
                              if (
                                parseInt(downPayment as unknown as string) > 100
                              ) {
                                form.setError("downPayment", {
                                  message:
                                    "The down payment should be between 0 to 100 percent.",
                                });
                              }
                            }
                          }}
                          endAdornment={
                            <>
                              {form.getValues().downPaymentMethod === "dollar"
                                ? "$"
                                : "%"}
                            </>
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DownPaymentMethod form={form} />
              </div>
              <FormField
                control={form.control}
                name="downPayment"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <MortgagePayment watch={form.watch} />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate</FormLabel>
                  <FormControl>
                    <CustomizedInput
                      type="number"
                      {...field}
                      endAdornment={<>%</>}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amortization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amortization</FormLabel>
                  <FormControl>
                    <CustomizedInput
                      type="number"
                      {...field}
                      endAdornment={<>$</>}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-2">
              <Button type="submit" className="flex-1">
                Calculate
              </Button>
              <Button className="flex-1" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </form>
        </Form>
        {monthPayment && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="number">Month Payment</Label>
            <Input
              type="number"
              id="month_payment"
              readOnly
              value={monthPayment?.toFixed(2)}
            />
          </div>
        )}
        {mortgageDetail && <PaymentDetails {...mortgageDetail} />}
      </CardContent>
    </Card>
  );
}
