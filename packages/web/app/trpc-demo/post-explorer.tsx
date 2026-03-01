"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PostExplorer() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const posts = trpc.posts.list.useQuery();
  const postDetail = trpc.posts.getBySlug.useQuery(selectedSlug!, {
    enabled: !!selectedSlug,
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Posts</CardTitle>
      </CardHeader>

      <CardContent>
        {posts.isLoading ? (
          <p className="text-sm text-muted-foreground py-4">Cargando...</p>
        ) : posts.error ? (
          <p className="text-sm text-destructive py-4">
            Error: {posts.error.message}
          </p>
        ) : (
          <div className="space-y-2">
            {posts.data?.map((post) => {
              const isSelected = selectedSlug === post.slug;
              return (
                <button
                  key={post.id}
                  onClick={() =>
                    setSelectedSlug(isSelected ? null : post.slug)
                  }
                  className={`w-full text-left rounded-md border p-3 transition-all cursor-pointer ${
                    isSelected
                      ? "border-sky/30 bg-sky/[0.06]"
                      : "border-border bg-muted/30 hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            post.published
                              ? "text-emerald bg-emerald/10"
                              : "text-amber bg-amber/10"
                          }`}
                        >
                          {post.published ? "Publicado" : "Borrador"}
                        </Badge>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {isSelected ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedSlug && (
          <div className="mt-3 rounded-md border border-sky/20 bg-sky/[0.04] p-4">
            {postDetail.isLoading ? (
              <p className="text-sm text-sky animate-pulse">
                Cargando detalle via{" "}
                <code className="font-mono text-xs">
                  trpc.posts.getBySlug.useQuery(&quot;{selectedSlug}&quot;)
                </code>
                ...
              </p>
            ) : postDetail.error ? (
              <p className="text-sm text-destructive">
                Error: {postDetail.error.message}
              </p>
            ) : postDetail.data ? (
              <>
                <h4 className="font-semibold text-sky mb-2">
                  {postDetail.data.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {postDetail.data.content}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground font-mono">
                  <span>
                    slug:{" "}
                    <code className="text-sky/80">{postDetail.data.slug}</code>
                  </span>
                  <span>author: {postDetail.data.authorId}</span>
                </div>
              </>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
