"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function RiskyComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("Error intencional desde un Client Component!");
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        Este componente funciona normalmente... hasta que presionas el botón.
      </p>
      <Button
        variant="destructive"
        onClick={() => setShouldError(true)}
      >
        <AlertTriangle className="size-3.5" />
        Lanzar error
      </Button>
    </div>
  );
}
