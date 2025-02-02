const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  GET_USER: `${API_BASE_URL}/api/users/me`,
  // Agrega aquí otras rutas de API según sea necesario
}

