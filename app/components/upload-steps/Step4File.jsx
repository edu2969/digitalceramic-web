const VALID_3D_EXTENSIONS = ["stl", "obj", "step", "stp"]

export default function Step4File({ uploadedFile, onFileUpload, fileError }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-[#1C4880] mb-6">
        Carga tu archivo 3D
      </h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
        <label className="cursor-pointer flex flex-col items-center gap-4">
          <span className="text-[#1C4880] text-5xl">⤓</span>
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              Arrastra tu archivo aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Formatos válidos: {VALID_3D_EXTENSIONS.join(", ")}
            </p>
          </div>
          <input
            type="file"
            onChange={onFileUpload}
            accept=".stl,.obj,.step,.stp"
            className="hidden"
          />
        </label>
      </div>

      {fileError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <span className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">!</span>
          <p className="text-red-700">{fileError}</p>
        </div>
      )}

      {uploadedFile && !fileError && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">
            ✓ Archivo cargado: {uploadedFile.name}
          </p>
          <p className="text-green-600 text-sm">
            Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
    </div>
  )
}
