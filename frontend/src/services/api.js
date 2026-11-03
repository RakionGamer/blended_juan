const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1` 
  : '/api/v1';

let authToken = localStorage.getItem('token') || '';

export function setToken(token) {
  authToken = token || '';
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getToken() {
  return authToken || localStorage.getItem('token') || '';
}

async function request(endpoint, options = {}) {
  const currentToken = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
      if (endpoint !== '/auth/login') {
        setToken('');
        localStorage.removeItem('user');
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'No autorizado. Inicia sesión para continuar.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export async function login(email, password) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (res?.token) {
    setToken(res.token);
  }
  return res;
}

export async function fetchDashboardData() {
  return request('/analytics/dashboard');
}

export async function fetchModelPerformance() {
  return request('/analytics/model-performance');
}

export async function fetchStudents(params = {}) {
  const query = new URLSearchParams();
  if (params.riesgo) query.append('riesgo', params.riesgo);
  if (params.facultad) query.append('facultad', params.facultad);
  if (params.search) query.append('search', params.search);

  const endpoint = `/students${query.toString() ? `?${query.toString()}` : ''}`;
  return request(endpoint);
}

export async function fetchStudentById(id) {
  return request(`/students/${id}`);
}

export async function reevaluateStudent(id) {
  return request(`/analytics/evaluate/${id}`, { method: 'POST' });
}

/**
 * Carga de archivos por lotes (CSV o Excel)
 */
export async function uploadMetricsFile(file, periodo = '2026-1') {
  const currentToken = getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('periodo', periodo);

  const response = await fetch(`${API_BASE}/metrics/import-file`, {
    method: 'POST',
    headers: {
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
    },
    body: formData
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Error ${response.status} al procesar el archivo`);
  }

  const json = await response.json();
  return json.data;
}

/**
 * Descarga de plantillas CSV / Excel oficiales
 * @param {string} type - 'consolidado' | 'academico' | 'lms'
 * @param {string} format - 'xlsx' | 'csv'
 * @param {string} mode - 'empty' (limpia para rellenar) | 'example' (con datos de ejemplo)
 */
export async function downloadImportTemplate(type = 'consolidado', format = 'xlsx', mode = 'empty') {
  const currentToken = getToken();
  const response = await fetch(`${API_BASE}/metrics/template?type=${type}&format=${format}&mode=${mode}`, {
    headers: {
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error('Error al generar la plantilla');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const prefix = mode === 'example' ? 'ejemplo_con_datos' : 'plantilla_para_rellenar';
  a.download = `${prefix}_${type}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
