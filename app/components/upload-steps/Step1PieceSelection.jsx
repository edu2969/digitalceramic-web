export default function Step1PieceSelection({ selectedPiece, onSelectPiece }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-[#1C4880] mb-6">
        Selecciona la pieza que deseas
      </h3>
      <div className="grid grid-cols-8 md:grid-cols-[repeat(16,minmax(0,1fr))] gap-3">
        {Array.from({ length: 32 }, (_, index) => {
          const row = index < 16 ? 1 : 2
          const col = (index % 16) + 1
          const pieceId = index + 1
          const imagePath = `/dental_layout/row-${row}-column-${col}.png`
          const isSelected = selectedPiece === pieceId

          return (
            <button
              key={pieceId}
              onClick={() => onSelectPiece(pieceId)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-[#1C4880] shadow-lg"
                  : "border-gray-200 hover:border-[#1C4880]"
              }`}
              style={{ aspectRatio: "1 / 2" }}
            >
              <img
                src={imagePath}
                alt={`Pieza ${pieceId}`}
                className={`w-full h-full object-cover transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-70 hover:opacity-85"
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
