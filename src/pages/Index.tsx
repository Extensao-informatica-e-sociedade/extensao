import { Link } from "react-router-dom";
import { BarChart3, Megaphone, Sparkles } from "lucide-react";
import { getFeaturedContents } from "@/data/contents";
import { ContentCard } from "@/components/ContentCard";
import { useFavorites } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/SearchBar";
import { useState } from "react";
import { searchContents } from "@/data/contents";

const Index = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const featured = getFeaturedContents();
  const [search, setSearch] = useState("");
  const searchResults = search.length >= 2 ? searchContents(search) : [];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary/80 px-5 pb-8 pt-12 text-primary-foreground">
        <p className="text-sm font-medium opacity-80">Olá, empreendedor! 👋</p>
        <h1 className="mt-1 text-2xl font-extrabold leading-tight">
          Tecnologia simples<br />para seu negócio
        </h1>
        <div className="mt-5">
          <SearchBar value={search} onChange={setSearch} placeholder="O que você quer aprender?" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5">
        {/* Search results */}
        {search.length >= 2 ? (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold">
              {searchResults.length > 0 ? `${searchResults.length} resultado(s)` : "Nenhum resultado encontrado"}
            </h2>
            <div className="grid gap-3">
              {searchResults.map((c) => (
                <ContentCard key={c.id} content={c} isFavorite={isFavorite(c.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Categories */}
            <section className="-mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/gestao"
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground">Gestão</p>
                  <p className="text-xs text-muted-foreground">Ferramentas</p>
                </div>
              </Link>
              <Link
                to="/marketing"
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">Redes Sociais</p>
                </div>
              </Link>
            </section>

            {/* Featured */}
            <section className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <h2 className="text-lg font-bold">Destaques</h2>
              </div>
              <div className="grid gap-3">
                {featured.map((c) => (
                  <ContentCard key={c.id} content={c} isFavorite={isFavorite(c.id)} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
