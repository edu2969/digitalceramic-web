// utils/nameUtils.ts

/**
 * Divide un nombre completo en nombre y apellido
 * @param fullName - Nombre completo (ej: "Juan Carlos Pérez González")
 * @returns { nombre: string, apellido: string }
 * 
 * @example
 * splitFullName("Juan Carlos Pérez González")
 * // => { nombre: "Juan Carlos", apellido: "Pérez González" }
 * 
 * @example
 * splitFullName("María José López")
 * // => { nombre: "María José", apellido: "López" }
 * 
 * @example
 * splitFullName("Ana")
 * // => { nombre: "Ana", apellido: "" }
 */
export function splitFullName(fullName: string): { nombre: string; apellido: string } {
  if (!fullName || fullName.trim() === '') {
    return { nombre: '', apellido: '' };
  }

  const parts = fullName.trim().split(/\s+/);

  // Si solo hay una palabra, es solo nombre
  if (parts.length === 1) {
    return { nombre: parts[0], apellido: '' };
  }

  // Si hay 2 palabras: nombre = primera, apellido = segunda
  if (parts.length === 2) {
    return { nombre: parts[0], apellido: parts[1] };
  }

  // Si hay 3 palabras: nombre = primeras 2, apellido = última
  if (parts.length === 3) {
    return { 
      nombre: parts.slice(0, 2).join(' '), 
      apellido: parts[2] 
    };
  }

  // Si hay 4+ palabras: nombre = primeras 2, apellido = últimas 2 (o el resto)
  // Máximo 4 miembros (2 nombres + 2 apellidos)
  const nombreParts = parts.slice(0, 2);
  const apellidoParts = parts.slice(2, 4); // Tomar hasta 2 apellidos
  
  return {
    nombre: nombreParts.join(' '),
    apellido: apellidoParts.join(' '),
  };
}

/**
 * Combina nombre y apellido en un nombre completo
 */
export function combineFullName(nombre: string, apellido: string): string {
  return [nombre, apellido].filter(Boolean).join(' ');
}