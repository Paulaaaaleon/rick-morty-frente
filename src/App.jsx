import { useState, useEffect } from "react";

// ===== Traducciones visibles (solo UI) =====
const ES = {
  status: { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" },
  gender: { Male: "Masculino", Female: "Femenino", Genderless: "Sin género", unknown: "Desconocido" },
  species: {
    Human: "Humano",
    Alien: "Alien",
    Humanoid: "Humanoide",
    Robot: "Robot",
    "Mythological Creature": "Criatura Mitológica",
    Animal: "Animal",
  },
};
const t = (group, value) => ES[group]?.[value] ?? value;

// Pastilla de color por estado
const statusPill = (s) =>
  s === "Alive" ? "bg-emerald-400" : s === "Dead" ? "bg-rose-400" : "bg-gray-400";

// ====== Iconos corazón (relleno / contorno) ======
const HeartFill = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-6.716-4.35-9.293-7.18C.8 11.68.6 8.66 2.55 6.73c1.86-1.84 4.86-1.67 6.66.21L12 7.8l2.79-2.86c1.8-1.88 4.8-2.05 6.66-.21 1.95 1.93 1.75 4.95-.157 7.09C18.72 16.65 12 21 12 21z"/>
  </svg>
);
const HeartOutline = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-6.716-4.35-9.293-7.18C.8 11.68.6 8.66 2.55 6.73c1.86-1.84 4.86-1.67 6.66.21L12 7.8l2.79-2.86c1.8-1.88 4.8-2.05 6.66-.21 1.95 1.93 1.75 4.95-.157 7.09C18.72 16.65 12 21 12 21z"/>
  </svg>
);

// ============== CARD (con corazón y latido) ==============
function CharacterCard({ character, onClick, isFavorite, onToggleFavorite }) {
  // agrega/remueve clase de latido por 600ms
  const pulseOnce = (e) => {
    const btn = e.currentTarget;
    btn.classList.add("animate-heart");
    setTimeout(() => btn.classList.remove("animate-heart"), 600);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 relative">
      {/* Botón corazón (favorito) — z-20 para estar SIEMPRE encima */}
      <button
        onClick={(e) => {
          e.stopPropagation();           // no abre el modal
          onToggleFavorite(character.id);
          pulseOnce(e);                  // animación latido
        }}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        className="absolute z-20 top-2 right-2 bg-white/95 rounded-full p-2 shadow ring-1 ring-pink-200 hover:scale-110 transition text-pink-500"
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? <HeartFill className="w-5 h-5" /> : <HeartOutline className="w-5 h-5" />}
      </button>

      {/* Clic en el cuerpo abre el modal */}
      <div onClick={() => onClick(character)} className="cursor-pointer relative">
        <div className="relative h-48">
          <img src={character.image} alt={character.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute bottom-2 left-2">
            <span className={`${statusPill(character.status)} text-white px-2.5 py-1 rounded-full text-[11px] font-semibold shadow`}>
              {t("status", character.status)}
            </span>
          </div>
        </div>

        <div className="p-3.5">
          <h3 className="text-lg font-extrabold text-fuchsia-900 mb-1 truncate">{character.name}</h3>
          <div className="text-[13px] space-y-1">
            <p className="text-gray-700">
              <span className="font-semibold text-rose-500">Especie:</span> {t("species", character.species)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-fuchsia-500">Género:</span> {t("gender", character.gender)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== MODAL (con corazón y latido) ==============
function CharacterModal({ character, onClose, isFavorite, onToggleFavorite }) {
  if (!character) return null;

  const pulseOnce = (e) => {
    const btn = e.currentTarget;
    btn.classList.add("animate-heart");
    setTimeout(() => btn.classList.remove("animate-heart"), 600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-60">
          <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Cerrar */}
          <button onClick={onClose} aria-label="Cerrar"
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Favorito (corazón) */}
          <button
            onClick={(e) => { onToggleFavorite(character.id); pulseOnce(e); }}
            aria-label="Favorito"
            className="absolute top-3 left-3 bg-white/90 rounded-full p-2 shadow ring-1 ring-pink-200 hover:scale-110 transition text-pink-500"
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFavorite ? <HeartFill /> : <HeartOutline />}
          </button>

          <h2 className="absolute bottom-3 left-4 right-4 text-2xl font-extrabold text-white drop-shadow">
            {character.name}
          </h2>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-[11px] text-emerald-600 font-semibold">Estado</p>
              <p className="font-bold text-emerald-700 text-sm">{t("status", character.status)}</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-3">
              <p className="text-[11px] text-sky-600 font-semibold">Especie</p>
              <p className="font-bold text-sky-700 text-sm">{t("species", character.species)}</p>
            </div>
            <div className="rounded-xl bg-fuchsia-50 p-3">
              <p className="text-[11px] text-fuchsia-600 font-semibold">Género</p>
              <p className="font-bold text-fuchsia-700 text-sm">{t("gender", character.gender)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-[11px] text-amber-600 font-semibold">Tipo</p>
              <p className="font-bold text-amber-700 text-sm">{character.type || "N/A"}</p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 mb-3">
            <p className="text-[11px] text-gray-500 font-semibold">Origen</p>
            <p className="font-bold text-sm text-gray-800">{character.origin.name}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 mb-3">
            <p className="text-[11px] text-gray-500 font-semibold">Ubicación actual</p>
            <p className="font-bold text-sm text-gray-800">{character.location.name}</p>
          </div>

          <div className="rounded-xl bg-rose-50 p-3">
            <p className="text-[11px] text-rose-600 font-semibold">Episodios</p>
            <p className="font-bold text-sm text-rose-700">Aparece en {character.episode.length} episodios</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== TOOLBAR (ordenada) ==============
function Toolbar({ searchTerm, setSearchTerm, filters, onFilterChange, setPage }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Buscar */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Buscar</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 border-pink-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 bg-white"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-pink-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            {searchTerm && (
              <button onClick={() => { setSearchTerm(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => { onFilterChange("status", e.target.value); setPage(1); }}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-300 text-sm"
          >
            <option value="">Todos</option>
            <option value="alive">Vivo</option>
            <option value="dead">Muerto</option>
            <option value="unknown">Desconocido</option>
          </select>
        </div>

        {/* Especie */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Especie</label>
          <select
            value={filters.species}
            onChange={(e) => { onFilterChange("species", e.target.value); setPage(1); }}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-200 focus:border-fuchsia-300 text-sm"
          >
            <option value="">Todas</option>
            <option value="Human">Humano</option>
            <option value="Alien">Alien</option>
            <option value="Humanoid">Humanoide</option>
            <option value="Robot">Robot</option>
            <option value="Mythological Creature">Criatura Mitológica</option>
            <option value="Animal">Animal</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ================== APP ==================
function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);     // IDs
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState({ status: "", species: "" });

  useEffect(() => setFavorites([]), []);

  // Fetch cuando NO estamos en favoritos
  useEffect(() => { if (!showFavorites) fetchCharacters(); }, [page, searchTerm, filters, showFavorites]);

  const fetchCharacters = async () => {
    try {
      setLoading(true); setError(null);
      let url = `https://rickandmortyapi.com/api/character?page=${page}`;
      if (searchTerm.trim()) url += `&name=${encodeURIComponent(searchTerm.trim())}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.species) url += `&species=${encodeURIComponent(filters.species)}`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) { setCharacters([]); setTotalPages(0); return; }
        throw new Error("Error al cargar los personajes");
      }
      const data = await res.json();
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (e) {
      setError(e.message); setCharacters([]);
    } finally { setLoading(false); }
  };

  const getFavoriteCharacters = async () => {
    if (favorites.length === 0) return [];
    try {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${favorites.join(",")}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [data];
    } catch { return []; }
  };

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleFilterChange = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  // ENTRAR/SALIR de favoritos
  const handleToggleShowFavorites = async () => {
    if (!showFavorites && favorites.length > 0) {
      setLoading(true);
      setCharacters(await getFavoriteCharacters());
      setLoading(false);
      setTotalPages(1);
      setPage(1);
    }
    setShowFavorites((s) => !s);
  };

  // 🔙 Volver a la vista general (sin favoritos) y recargar la primera página
  const goBackToAll = async () => {
    setShowFavorites(false);
    setPage(1);
    await fetchCharacters();
  };

  const clearAll = () => { setSearchTerm(""); setFilters({ status: "", species: "" }); setShowFavorites(false); setPage(1); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100">
      {/* Fuentes: Poppins base + Luckiest Guy solo para el título */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Luckiest+Guy&display=swap" rel="stylesheet" />
      <style>{`
        *{font-family:'Poppins',system-ui,Segoe UI,Arial,sans-serif}
        /* Latido del corazón */
        @keyframes heartBeat {
          0%{transform:scale(1)}
          14%{transform:scale(1.25)}
          28%{transform:scale(1)}
          42%{transform:scale(1.18)}
          70%{transform:scale(1)}
        }
        .animate-heart { animation: heartBeat .6s ease-in-out; }
      `}</style>

      {/* HEADER con título “cartoon” y botón Favoritos arriba */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-pink-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Título con Luckiest Guy */}
          <div>
            <h1 className="text-4xl md:text-5xl text-fuchsia-800 tracking-wide"
                style={{ fontFamily: "'Luckiest Guy', cursive", lineHeight: 1 }}>
              Rick & Morty
            </h1>
            <p className="text-sm text-fuchsia-700/80 font-semibold">Explora el multiverso con estilo</p>
          </div>

          {/* Botón Favoritos (toggle entrar/salir) */}
          <button
            onClick={() => {
              if (showFavorites) { goBackToAll(); }
              else { handleToggleShowFavorites(); }
            }}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-extrabold shadow
              ${showFavorites ? "bg-pink-500 text-white" : "bg-white text-pink-600 border border-pink-200 hover:bg-pink-50"}`}
            title={showFavorites ? "Salir de favoritos" : "Ver favoritos"}
          >
            <span className="text-pink-500">
              {showFavorites ? <HeartFill className="w-4 h-4" /> : <HeartOutline className="w-4 h-4" />}
            </span>
            {showFavorites ? "Salir de Favoritos" : `Ver Favoritos (${favorites.length})`}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Toolbar ordenada */}
        <Toolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          setPage={setPage}
        />

        {/* Barra para volver cuando estás en favoritos */}
        {showFavorites && (
          <div className="bg-white rounded-2xl shadow p-3 mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-extrabold text-fuchsia-700">{characters.length}</span> favoritos
            </p>
            <button
              onClick={goBackToAll}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              ← Ver todos los personajes
            </button>
          </div>
        )}

        {/* Resumen + limpiar (solo cuando no estás en favoritos) */}
        {!showFavorites && (
          <div className="bg-white rounded-2xl shadow p-3 mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              {characters.length > 0 ? (
                <>Mostrando <span className="font-extrabold text-fuchsia-700">{characters.length}</span> personajes • Página {page} de {totalPages}</>
              ) : "No hay resultados"}
            </p>
            {(searchTerm || filters.status || filters.species) && (
              <button onClick={clearAll} className="text-xs font-bold text-pink-600 hover:text-pink-700">Limpiar filtros</button>
            )}
          </div>
        )}

        {/* Estados / vacíos */}
        {loading && characters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="mx-auto w-10 h-10 rounded-full border-4 border-pink-300 border-t-transparent animate-spin mb-3" />
            <p className="text-sm text-gray-600 font-semibold">Cargando…</p>
          </div>
        ) : error && characters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="font-extrabold text-gray-800 mb-1">¡Oops!</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm font-bold hover:bg-pink-600">
              Reintentar
            </button>
          </div>
        ) : showFavorites && favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-2 text-pink-500"><HeartOutline className="w-10 h-10" /></div>
            <p className="text-base font-extrabold text-fuchsia-900 mb-1">Aún no tienes favoritos</p>
            <p className="text-sm text-gray-600">Toca el corazón en una tarjeta para guardarlo</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-2">🔍</div>
            <p className="text-base font-extrabold text-fuchsia-900 mb-1">Sin coincidencias</p>
            <p className="text-sm text-gray-600 mb-3">Prueba con otros términos o filtros</p>
            <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm font-bold hover:bg-pink-600">
              Limpiar
            </button>
          </div>
        ) : (
          <>
            {/* Grid de cards (compactas) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {characters.map((c) => (
                <CharacterCard
                  key={c.id}
                  character={c}
                  onClick={setSelectedCharacter}
                  isFavorite={favorites.includes(c.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* Paginación (solo fuera de favoritos) */}
            {!showFavorites && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white shadow text-sm font-bold disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <span className="px-4 py-2 rounded-xl bg-white shadow text-sm font-extrabold">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white shadow text-sm font-bold disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedCharacter && (
          <CharacterModal
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
            isFavorite={favorites.includes(selectedCharacter.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>
    </div>
  );
}

export default App;
