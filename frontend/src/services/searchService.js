import api from './api';

export const searchService = {
  async search(query, category = 'all', filters = {}, page = 1, pageSize = 12, sort = 'relevance') {
    const payload = {
      query,
      category,
      filters,
      page,
      page_size: pageSize,
      sort,
    };
    const response = await api.post('/search', payload);
    return response.data;
  },

  async getSuggestions(query) {
    const response = await api.get('/search/suggestions', { params: { q: query } });
    return response.data;
  },

  getExportUrl(query, category = 'all') {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    return `${baseUrl}/export/csv?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
  },

  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  async getProvidersStatus() {
    const response = await api.get('/providers/status');
    return response.data;
  },
};
