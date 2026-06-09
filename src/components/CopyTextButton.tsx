import { useState } from 'react';

interface CopyTextButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyTextButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  className = '',
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`text-[10px] text-sky-700 dark:text-sky-400 hover:underline transition focus:outline-none focus:underline ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
