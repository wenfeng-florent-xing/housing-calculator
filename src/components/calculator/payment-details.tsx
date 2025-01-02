import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentDetail, paymentDetail } from "@/lib/calculations";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

type propsPaymentDetailsType = {
  principal: number;
  interestRate: number;
  amortization: number;
};

export default function PaymentDetails({
  principal,
  interestRate,
  amortization,
}: propsPaymentDetailsType) {
  const [details, setDetails] = useState<PaymentDetail[]>();
  const tableTopRef = useRef<HTMLButtonElement>(null);

  const handleDetails = useCallback(() => {
    setDetails(paymentDetail(principal, interestRate, amortization));
  }, [amortization, interestRate, principal]);

  const handleClearAll = () => {
    setDetails(undefined);
  };

  const handleToTop = () => {
    tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  }
  return (
    <>
      <div className="flex gap-2">
        <Button ref={tableTopRef} className="flex-1" onClick={handleDetails}>
          Payment Details
        </Button>
        <Button className="flex-1" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>
      {details && (
        <Table>
          <TableCaption onClick={handleToTop}>To the top</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Month</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead className="text-right">Residual Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.month}>
                <TableCell className="font-medium">{detail.month}</TableCell>
                <TableCell>{detail.interest.toFixed(2)}</TableCell>
                <TableCell>{detail.capital.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {detail.residualBalance.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
