"use client";

import {
  CardElement,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import React from "react";

export default function PaymentForm({
  amountInUSDCents,
}: {
  amountInUSDCents: number;
}) {
  const stripe = useStripe();
  const elements = stripe?.elements();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement("card");

    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post("/api/create-payment-intent", {
        data: { amount: amountInUSDCents },
      });
      const clientSecret = data;

      await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    } catch (error) {
      console.log("got some stripe error");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <CardElement />
      <button type="submit">Submit</button>
    </form>
  );
}
