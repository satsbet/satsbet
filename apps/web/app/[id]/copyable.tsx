"use client";
import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export interface CopyableProps {
  /** Text that will prefix the copyable text */
  prefix?: string;
  /** Text that will be copied when User click on the copy button */
  text: string;
  /** Callback function when User click on copy button */
  onCopied?: () => void;
}

/**
 * Component that allows the user to copy a text to the clipboard
 *
 * @param {CopyableProps} props
 * @returns
 */
export function Copyable({ prefix, text, onCopied }: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Copy available only in secure contexts.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) {
        setCopied(false);
        onCopied?.();
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied, onCopied]);

  return (
    <div className="border-input bg-background text-foreground flex h-10 w-full justify-between gap-1.5 rounded-md border px-3 py-2 text-sm">
      {prefix ? (
        <span className="text-muted-foreground font-light uppercase">
          {prefix}
        </span>
      ) : null}
      <span className="w-full truncate" style={{ userSelect: "all" }}>
        {text}
      </span>
      <button
        onClick={handleCopy}
        className="ring-offset-background focus-visible:ring-ring relative -mr-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <span
          className={`${
            copied ? "opacity-100" : ""
          } inset-0 flex items-center justify-center opacity-0 transition-opacity text-success absolute`}
        >
          <Check className="p-1" aria-label="Copied" />
        </span>
        <span
          className={`${
            !copied ? "opacity-100" : ""
          } inset-0 flex items-center justify-center opacity-0 transition-opacity`}
        >
          <Copy className="p-1" aria-label="Copy" />
        </span>
      </button>
    </div>
  );
}
