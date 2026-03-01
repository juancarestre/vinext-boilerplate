"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export default function RiskyComponent({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error(
      isEs
        ? "Error intencional desde un Client Component!"
        : "Intentional error thrown from a Client Component!"
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        {isEs
          ? "Este componente funciona normalmente... hasta que presionas el botón."
          : "This component works normally... until you click the button."}
      </p>
      <Button
        variant="destructive"
        onClick={() => setShouldError(true)}
      >
        <AlertTriangle className="size-3.5" />
        {isEs ? "Lanzar error" : "Throw error"}
      </Button>
    </div>
  );
}
