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
    <Button type="submit">Place bet</Button>
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

function Field({ children }) {
  return <div className="flex flex-col gap-1 my-3">{children}</div>;
}

export function PlaceBetForm({ up, down }: { up: number; down: number }) {
  const [state, formAction] = useFormState(createBet, initialState);
  const [target, setTarget] = useState<BetTarget | undefined>();
  const { format } = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
  });

  return (
    <form action={formAction}>
      <div className="flex gap-4 justify-center">
        <input type="hidden" name="target" value={target || ""} />
        <Toggle
          variant="down"
          pressed={target === "DOWN"}
          onPressedChange={() => setTarget("DOWN")}
        >
          <div className="flex items-baseline">
            <span className="md:text-3xl">▼</span>
            <span className="text-5xl md:text-7xl font-extrabold align-bottom">
              {format(down)}
            </span>
            <span className="text-lg md:text-3xl">x</span>
          </div>
        </Toggle>
        <Toggle
          variant="up"
          pressed={target === "UP"}
          onPressedChange={() => setTarget("UP")}
        >
          <div className="flex items-baseline">
            <span className="md:text-3xl">▲</span>
            <span className="text-5xl md:text-7xl font-extrabold align-bottom">
              {format(up)}
            </span>
            <span className="text-lg md:text-3xl">x</span>
          </div>
        </Toggle>
      </div>
      <FormError>{state?.fieldErrors?.target}</FormError>

      {target ? (
        <>
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <Input type="text" id="amount" name="amount" required />
            <FormDescription>10% charged fees</FormDescription>
            <FormError>{state?.fieldErrors?.amount}</FormError>
          </Field>

          <Field>
            <Label htmlFor="lnAddress" placeholder="you@your.domain">
              LN Address
            </Label>
            <Input type="text" id="lnAddress" name="lnAddress" required />
            <FormDescription>
              The lightning address we are going to transfer your reward
            </FormDescription>
            <FormError>{state?.fieldErrors?.lnAddress}</FormError>
          </Field>

          <Field>
            <Label htmlFor="email" placeholder="you@your.domain">
              Email (optional)
            </Label>
            <Input type="text" id="email" name="email" />
            <FormError>{state?.fieldErrors?.email}</FormError>
          </Field>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </>
      ) : null}
    </form>
  );
}
