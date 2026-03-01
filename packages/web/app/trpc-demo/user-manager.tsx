"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, Trash2, X } from "lucide-react";
import type { CreateUser } from "@vinext-boilerplate/shared";
import type { Locale } from "@/lib/i18n";

export default function UserManager({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const [showForm, setShowForm] = useState(false);

  const users = trpc.users.list.useQuery();
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      users.refetch();
      setShowForm(false);
    },
  });
  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => users.refetch(),
  });

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateUser = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      role: (fd.get("role") as "admin" | "user" | "viewer") ?? "user",
    };
    createUser.mutate(data);
  }

  const roleColors: Record<string, string> = {
    admin: "text-amber bg-amber/10",
    user: "text-sky bg-sky/10",
    viewer: "text-violet bg-violet/10",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{isEs ? "Usuarios" : "Users"}</CardTitle>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => users.refetch()}
              className="h-7 px-2 text-xs"
            >
              <RefreshCw
                className={`size-3 ${users.isFetching ? "animate-spin" : ""}`}
              />
              {isEs ? "Recargar" : "Refetch"}
            </Button>
            <Button
              variant={showForm ? "outline" : "default"}
              size="sm"
              onClick={() => setShowForm(!showForm)}
              className="h-7 px-2.5 text-xs"
            >
              {showForm ? (
                <>
                  <X className="size-3" /> {isEs ? "Cancelar" : "Cancel"}
                </>
              ) : (
                <>
                  <Plus className="size-3" /> {isEs ? "Crear" : "Create"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-2 mb-4 p-3 rounded-md bg-muted/50 border border-border"
          >
            <Input name="name" placeholder={isEs ? "Nombre" : "Name"} required minLength={2} />
            <Input name="email" type="email" placeholder="Email" required />
            <select
              name="role"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button type="submit" size="sm" disabled={createUser.isPending} className="self-start">
              {createUser.isPending ? (isEs ? "Creando..." : "Creating...") : isEs ? "Crear usuario" : "Create user"}
            </Button>
          </form>
        )}

        {users.isLoading ? (
          <p className="text-sm text-muted-foreground py-4">{isEs ? "Cargando..." : "Loading..."}</p>
        ) : users.error ? (
          <p className="text-sm text-destructive py-4">Error: {users.error.message}</p>
        ) : (
          <div className="divide-y divide-border">
            {users.data?.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2.5 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] uppercase tracking-wider ${roleColors[user.role] ?? ""}`}
                  >
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                  onClick={() => deleteUser.mutate(user.id)}
                  disabled={deleteUser.isPending}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
