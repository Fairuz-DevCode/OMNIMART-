export const API_BASE_URL = 'http://192.168.100.10:8000/api';

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();
  let data: any = null;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (err) {
    console.error('Failed to parse JSON response from API:', responseText);
    throw new Error('Server error: Format respons tidak valid.');
  }

  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }

  return data;
};
