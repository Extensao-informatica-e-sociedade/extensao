import { useParams } from "react-router-dom";
import { BarChart3, Megaphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getContentsByCategory } from "@/data/contents";
import { ContentCard } from "@/components/ContentCard";
import { useFavorites } from "@/hooks/useFavorites";

const categoryMeta = {
  gestao: {
    title: "Ferramentas de Gestão",
    description: "Organize finanças, estoque e tarefas do seu negócio",
    icon: BarChart3,
    color: "primary",
  },
  marketing: {
    title: "Marketing Digital",
    description: "Divulgue seu negócio nas redes sociais e no Google",
    icon: Megaphone,
    color: "secondary",
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const meta = categoryMeta[category as keyof typeof categoryMeta];
  const items = getContentsByCategory(category || "");
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <div className="min-h-screen pb-24">
      <header className={`bg-gradient-to-br ${meta.color === "primary" ? "from-primary to-primary/80" : "from-secondary to-secondary/80"} px-5 pb-8 pt-12 text-${meta.color}-foreground`}>
        <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{meta.title}</h1>
            <p className="text-sm opacity-80">{meta.description}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 pt-6">
        <div className="grid gap-3">
          {items.map((c) => (
            <ContentCard key={c.id} content={c} isFavorite={isFavorite(c.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </main>
    </div>
  );
}
