export function periodPayment(
  principle: number,
  interest: number,
  Amortization: number
) {
  return (
    (principle * (interest * ((1 + interest) ^ Amortization))) /
    (((1 + interest) ^ Amortization) - 1)
  );
}

export function monthlyPayment(
  principle: number,
  interestRate: number,
  amortization: number
) {
  const monthInterest = interestRate / 12;
  const monthAmortization = amortization * 12;
  return periodPayment(principle, monthInterest, monthAmortization);
}

export type PaymentDetail = {
  month: number;
  interest: number;
  capital: number;
  residualBalance: number;
};

export function paymentDetail(
  principle: number,
  interestRate: number,
  amortization: number
) {
  const paymentDetail: PaymentDetail[] = [];

  const monthlyPay = monthlyPayment(principle, interestRate, amortization);
  for (let i = 0; principle > 0; i++) {
    if (principle - monthlyPay > 0) {
      const interestPayment = principle * (interestRate / 100 / 12);
      const capital = monthlyPay - interestPayment;
      principle = principle - monthlyPay;

      paymentDetail.push({
        month: i + 1,
        interest: interestPayment,
        capital: capital,
        residualBalance: principle,
      });
    } else {
      const capital = principle;
      principle = 0;
      const interestPayment = 0;
      paymentDetail.push({
        month: i + 1,
        interest: interestPayment,
        capital: capital,
        residualBalance: principle,
      });
    }
  }
  return paymentDetail;
}
