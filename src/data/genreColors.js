// Genre-to-color mapping for visual theming
const genreColors = {
  // Rock & derivatives
  "Indie Rock": "#e06b5e",
  "Post-Punk": "#a855f7",
  "Shoegaze": "#ec4899",
  "Garage Rock": "#ef4444",
  "Grunge": "#78716c",
  "Psych Rock": "#f59e0b",
  "Rock": "#dc2626",
  "Punk": "#f43f5e",
  "Prog": "#7c3aed",
  "Indie": "#e06b5e",
  "K-Indie": "#fb7185",

  // Electronic
  "Electronic": "#06b6d4",
  "House": "#8b5cf6",
  "Techno": "#6366f1",
  "Ambient": "#64748b",
  "Disco": "#f472b6",
  "Dubstep": "#4f46e5",
  "Experimental": "#a3a3a3",

  // Jazz & Soul
  "Jazz": "#f59e0b",
  "Free Jazz": "#d97706",
  "Latin Jazz": "#fbbf24",
  "Soul": "#c084fc",
  "Neo-Soul": "#a78bfa",
  "Funk": "#fb923c",

  // Hip-Hop & Beats
  "Hip-Hop": "#facc15",
  "Beats": "#eab308",

  // World & Regional
  "World": "#10b981",
  "Afrobeat": "#22c55e",
  "Highlife": "#4ade80",
  "Afro-Funk": "#16a34a",
  "Reggae": "#22c55e",
  "Dub": "#059669",
  "Ska": "#34d399",
  "Dancehall": "#10b981",
  "Tropicalia": "#14b8a6",
  "MPB": "#2dd4bf",
  "Bossa Nova": "#5eead4",
  "Samba": "#0d9488",
  "Son Cubano": "#f97316",
  "Salsa": "#ef4444",
  "Rumba": "#fb923c",
  "City Pop": "#f9a8d4",
  "J-Pop": "#f472b6",
  "K-Pop": "#ec4899",

  // Country & Folk & Americana
  "Country": "#a3e635",
  "Folk": "#84cc16",
  "Americana": "#65a30d",
  "Blues": "#3b82f6",
  "Gospel": "#a78bfa",

  // R&B & Brass
  "R&B": "#d946ef",
  "Brass Band": "#f59e0b",
  "Zydeco": "#06b6d4",
  "Cajun": "#0891b2",

  // Classical & Other
  "Classical": "#e2e8f0",
  "Krautrock": "#fb923c",
  "Avant-Garde": "#94a3b8",
  "Noise": "#6b7280",
  "Industrial": "#525252",
  "Garage": "#ef4444",
  "Latin Rock": "#f97316",
  "Roots": "#15803d",
}

export function getGenreColor(genre) {
  return genreColors[genre] || "#94a3b8"
}

export default genreColors
