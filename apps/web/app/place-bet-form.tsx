"use client";

import { useFormState as useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { createBet } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { BetTarget } from "@prisma/client";

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return pending ? (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ) : (
    <Button type="submit">Pay</Button>
  );
}

function FormDescription({ children }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
}

function FormError({ children }) {
  return (
    children && (
      <div
        aria-live="polite"
        role="status"
        className="text-[0.8rem] font-medium text-destructive"
      >
        {children}
      </div>
    )
  );
}

export function PlaceBetForm() {
  const [state, formAction] = useFormState(createBet, initialState);
  const [target, setTarget] = useState<BetTarget | undefined>();

  return (
    <form action={formAction}>
      <Label htmlFor="target">Target</Label>
      <div className="flex gap-2">
        <input type="hidden" name="target" value={target || ""} />
        <Toggle
          variant="outline"
          className="w-28"
          pressed={target === "DOWN"}
          onPressedChange={() => setTarget("DOWN")}
        >
          DOWN <TrendingDown className="ml-2" />
        </Toggle>
        <Toggle
          variant="outline"
          className="w-28"
          pressed={target === "UP"}
          onPressedChange={() => setTarget("UP")}
        >
          <TrendingUp className="mr-2" />
          UP
        </Toggle>
      </div>
      <FormError>{state?.fieldErrors?.target}</FormError>

      {target ? (
        <>
          <Label htmlFor="amount">Amount</Label>
          <Input type="text" id="amount" name="amount" required />
          <FormError>{state?.fieldErrors?.amount}</FormError>

          <Label htmlFor="lnAddress" placeholder="you@your.domain">
            LN Address
          </Label>
          <Input type="text" id="lnAddress" name="lnAddress" required />
          <FormDescription>
            The lightning address we are going to transfer your reward
          </FormDescription>
          <FormError>{state?.fieldErrors?.lnAddress}</FormError>

          <Label htmlFor="email" placeholder="you@your.domain">
            Email (optional)
          </Label>
          <Input type="text" id="email" name="email" />
          <FormError>{state?.fieldErrors?.email}</FormError>

          <SubmitButton />
        </>
      ) : null}
    </form>
  );
}
