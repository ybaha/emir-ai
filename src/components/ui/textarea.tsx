import * as React from "react";

import { cn } from "@/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { default?: boolean };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={
          !props.default
            ? cn(
                "flex h-20 w-full overflow-hidden rounded-md  bg-transparent py-2 px-3 text-sm text-gray-200 placeholder:text-slate-400 focus:outline-none  focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 ",
                className
              )
            : cn(
                "border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )
        }
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
