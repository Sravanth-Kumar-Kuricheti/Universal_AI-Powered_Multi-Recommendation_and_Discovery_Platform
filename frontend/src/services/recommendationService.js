import api from './api';

export const recommendationService = {
  async getSimilar(itemId, query, category = 'all') {
    const response = await api.get(`/recommendations/${encodeURIComponent(itemId)}/similar`, {
      params: { query, category },
    });
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async searchVideos(query, limit = 12) {
    const response = await api.get('/videos/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  async compareItems(items) {
    const response = await api.post('/compare', { items });
    return response.data;
  },

  async chatAssistant(messages, currentQuery = '', category = '') {
    const response = await api.post('/assistant/chat', {
      messages,
      current_query: currentQuery,
      category,
    });
    return response.data;
  },
};
