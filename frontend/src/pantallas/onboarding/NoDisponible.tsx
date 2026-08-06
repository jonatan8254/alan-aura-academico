/**
 * FE-01 de ECU-05 (menor de edad) — `/onboarding/no-disponible`. Fuera de `RequiereSesion` a
 * propósito: el frontend resuelve el bloqueo de <18 llamando `POST /auth/logout` y
 * navegando aquí SIN sesión — nunca llega a construirse el `OnboardingRequest` (su
 * `esAdulto` es el literal `true`, ver contrato-api/src/rutas.ts). Stub de Fase 0b.
 */
export function NoDisponible() {
  return <div className="p-6 text-cuerpo text-texto">Onboarding no disponible — stub</div>;
}
