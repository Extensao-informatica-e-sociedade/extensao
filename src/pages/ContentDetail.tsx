import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, FileText, Video, CheckSquare, Download } from "lucide-react";
import * as Icons from "lucide-react";
import { getContentById } from "@/data/contents";
import { useFavorites } from "@/hooks/useFavorites";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const formatIcons = { article: FileText, video: Video, checklist: CheckSquare };
const formatLabels = { article: "Artigo", video: "Vídeo", checklist: "Checklist" };

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const content = getContentById(id || "");
  const { isFavorite, toggleFavorite } = useFavorites();

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (content?.checklist) {
      try {
        const stored = localStorage.getItem(`checklist-${content.id}`);
        if (stored) setChecked(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, [content?.id]);

  const toggleCheck = (itemId: string) => {
    const next = { ...checked, [itemId]: !checked[itemId] };
    setChecked(next);
    if (content) localStorage.setItem(`checklist-${content.id}`, JSON.stringify(next));
  };

  const handleShare = async () => {
    if (content && navigator.share) {
      try {
        await navigator.share({ title: content.title, text: content.description, url: window.location.href });
      } catch { /* cancelled */ }
    }
  };

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <p className="text-muted-foreground">Conteúdo não encontrado.</p>
      </div>
    );
  }

  const IconComponent = (Icons as any)[content.icon] || FileText;
  const FormatIcon = formatIcons[content.format];
  const fav = isFavorite(content.id);

  // Simple markdown-like rendering
  const renderBody = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="mb-2 mt-6 text-lg font-bold text-foreground">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="mb-1 mt-4 text-base font-bold text-foreground">{line.slice(4)}</h3>;
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
        if (match) return <li key={i} className="ml-4 mb-1 text-sm text-muted-foreground list-disc"><strong className="text-foreground">{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ""}</li>;
      }
      if (line.startsWith("- ")) return <li key={i} className="ml-4 mb-1 text-sm text-muted-foreground list-disc">{line.slice(2)}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 mb-1 text-sm text-muted-foreground list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      // Handle inline bold
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <p key={i} className="mb-1 text-sm leading-relaxed text-muted-foreground">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className={cn(
        "px-5 pb-6 pt-12",
        content.category === "gestao"
          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
          : "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
      )}>
        <div className="mb-4 flex items-center justify-between">
          <Link to={`/${content.category}`} className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="flex gap-2">
            <button onClick={() => toggleFavorite(content.id)} className="rounded-full p-2 hover:bg-white/10">
              <Heart className={cn("h-5 w-5", fav && "fill-current")} />
            </button>
            <button onClick={handleShare} className="rounded-full p-2 hover:bg-white/10">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
            <FormatIcon className="h-3 w-3" />
            {formatLabels[content.format]}
          </div>
        </div>
        <h1 className="text-xl font-extrabold leading-tight">{content.title}</h1>
        <p className="mt-1 text-sm opacity-80">{content.description}</p>
      </header>

      <main className="mx-auto max-w-lg px-5 pt-6">
        {/* Illustration image */}
        {content.imageUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border shadow-sm">
            <img
              src={content.imageUrl}
              alt={`Ilustração: ${content.title}`}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Template download */}
        {content.templateUrl && (
          <a
            href={content.templateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-muted"
          >
            <Download className="h-5 w-5 shrink-0" />
            {content.templateLabel || "📥 Baixar Template"}
          </a>
        )}

        {/* Video */}
        {content.videoUrl && (
          <div className="mb-6 overflow-hidden rounded-2xl border shadow-sm">
            <div className="relative aspect-video">
              <iframe
                src={content.videoUrl}
                title={content.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Body */}
        <article className="prose-sm">{renderBody(content.body)}</article>

        {/* Checklist */}
        {content.checklist && content.checklist.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-bold">✅ Checklist</h2>
            <div className="space-y-2 rounded-2xl border bg-card p-4">
              {content.checklist.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted">
                  <Checkbox
                    checked={!!checked[item.id]}
                    onCheckedChange={() => toggleCheck(item.id)}
                    className="mt-0.5"
                  />
                  <span className={cn("text-sm", checked[item.id] && "line-through text-muted-foreground")}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
