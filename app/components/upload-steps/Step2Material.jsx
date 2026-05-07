const VITA_COLORS = {
  "1M": ["1M1", "1M2", "1M3"],
  "2M": ["2M1", "2M2", "2M3"],
  "3M": ["3M1", "3M2", "3M3"],
  "4M": ["4M1", "4M2", "4M3"],
  "A": ["A1", "A2", "A3", "A3.5", "A4"],
  "B": ["B1", "B2", "B3", "B4"],
  "C": ["C1", "C2", "C3", "C4"],
  "D": ["D2", "D3", "D4"],
}

export default function Step2Material({
  shades,
  onShadesChange,
  vitaPalette,
  onVitaPaletteChange,
  selectedColors,
  onColorChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold text-[#1C4880] mb-3">
          ¿Cuántas tonalidades necesitas?
        </label>
        <div className="flex gap-3">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => onShadesChange(num)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                shades === num
                  ? "bg-[#1C4880] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold text-[#1C4880] mb-3">
          Selecciona la paleta VITA
        </label>
        <select
          value={vitaPalette}
          onChange={(e) => onVitaPaletteChange(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
        >
          {Object.keys(VITA_COLORS).map((palette) => (
            <option key={palette} value={palette}>
              Paleta {palette}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold text-[#1C4880] mb-3">
          Selecciona los colores
        </label>
        <div className="space-y-3">
          {Array.from({ length: shades }, (_, i) => (
            <div key={i}>
              <label className="block text-sm text-gray-600 mb-2">
                Tonalidad {i + 1}
              </label>
              <select
                value={selectedColors[i] || ""}
                onChange={(e) => onColorChange(i, e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none"
              >
                <option value="">-- Selecciona un color --</option>
                {VITA_COLORS[vitaPalette].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
