export default function Step3Notes({ notes, onNotesChange }) {
  return (
    <div>
      <label className="block text-lg font-semibold text-[#1C4880] mb-3">
        Notas y Observaciones (Opcional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Ingresa cualquier observación o nota importante sobre tu caso..."
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1C4880] focus:outline-none resize-none"
        rows={6}
      />
    </div>
  )
}
