import axios from 'axios';
import {
  DEMO_MOVIES,
  DEMO_THEATRES,
  DEMO_CITIES,
  DEMO_GENRES,
  DEMO_LANGUAGES,
  generateDemoShows,
  generateDemoSeats,
} from './mockData';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')}/api` : '/api');

const realApi = axios.create({ baseURL: API_BASE });

realApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('imovies_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Helper for local mock storage
const getSavedBookings = () => {
  try {
    return JSON.parse(localStorage.getItem('imovies_mock_bookings') || '[]');
  } catch {
    return [];
  }
};

const saveBookings = (list) => {
  try {
    localStorage.setItem('imovies_mock_bookings', JSON.stringify(list));
  } catch {}
};

// Mock handler when server is unavailable
async function mockHandler(method, url, data = {}, params = {}) {
  // Artificial slight delay for realistic feel
  await new Promise((r) => setTimeout(r, 60));

  // Filters
  if (url === '/movies/filters') {
    return {
      data: {
        genres: DEMO_GENRES,
        languages: DEMO_LANGUAGES,
        cities: DEMO_CITIES,
      },
    };
  }

  // Movies list
  if (url === '/movies' && method === 'get') {
    let list = [...DEMO_MOVIES];
    const { status, genre, language, search, sort } = params;

    if (status) {
      list = list.filter((m) => m.status === status);
    }
    if (genre) {
      list = list.filter((m) => m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()));
    }
    if (language) {
      list = list.filter((m) => m.language.toLowerCase() === language.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast?.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (sort === 'rating') {
      list.sort((a, b) => b.score - a.score);
    } else if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return {
      data: {
        items: list,
        total: list.length,
        pages: 1,
        page: 1,
      },
    };
  }

  // Movie detail: /movies/:id
  const movieMatch = url.match(/^\/movies\/([^/?]+)/);
  if (movieMatch && method === 'get') {
    const id = movieMatch[1];
    const found = DEMO_MOVIES.find((m) => m._id === id) || DEMO_MOVIES[0];
    return { data: found };
  }

  // Shows: /shows
  if (url === '/shows' && method === 'get') {
    const { movie, date, city } = params;
    const shows = generateDemoShows(movie, date, city);
    return { data: shows };
  }

  // Show detail with seats: /shows/:id
  const showMatch = url.match(/^\/shows\/([^/?]+)/);
  if (showMatch && method === 'get') {
    const showId = showMatch[1];
    const movieId = showId.split('-')[1] || DEMO_MOVIES[0]._id;
    const movie = DEMO_MOVIES.find((m) => m._id === movieId) || DEMO_MOVIES[0];
    const theatre = DEMO_THEATRES[0];
    const seats = generateDemoSeats(showId);

    // Retrieve held seats if any in session
    const held = JSON.parse(sessionStorage.getItem(`held_${showId}`) || '[]');
    seats.forEach((s) => {
      if (held.includes(s._id)) {
        s.mine = true;
        s.status = 'locked';
        s.lockedUntil = new Date(Date.now() + 8 * 60000).toISOString();
      }
    });

    return {
      data: {
        show: {
          _id: showId,
          movie,
          theatre,
          screenName: 'Audi 1 (IMAX Laser)',
          format: 'IMAX 3D',
          language: movie.language,
          startTime: new Date(Date.now() + 3600000 * 3).toISOString(),
        },
        seats,
        maxSeats: 8,
      },
    };
  }

  // Lock seats: /shows/:id/lock
  const lockMatch = url.match(/^\/shows\/([^/?]+)\/lock/);
  if (lockMatch && method === 'post') {
    const showId = lockMatch[1];
    const { seatIds } = data;
    sessionStorage.setItem(`held_${showId}`, JSON.stringify(seatIds || []));
    return { data: { success: true, count: seatIds?.length || 0 } };
  }

  // Bookings list: /bookings or /bookings/mine
  if ((url === '/bookings' || url === '/bookings/mine') && method === 'get') {
    const list = getSavedBookings();
    if (list.length === 0) {
      // Default demo booking so user sees a realistic booking right away
      const defaultBooking = {
        _id: 'bk-demo-1',
        code: 'IM-A9X2K4',
        status: 'confirmed',
        movie: DEMO_MOVIES[0],
        theatre: DEMO_THEATRES[0],
        show: {
          _id: 'sh-demo',
          format: 'IMAX 3D',
          language: DEMO_MOVIES[0].language,
          screenName: 'Audi 1 (IMAX Laser)',
          startTime: new Date(Date.now() + 86400000).toISOString(),
        },
        seats: [
          { _id: 's1', label: 'E5', tier: 'premium', price: 380 },
          { _id: 's2', label: 'E6', tier: 'premium', price: 380 },
        ],
        subtotal: 760,
        convenienceFee: 38,
        total: 798,
        createdAt: new Date().toISOString(),
        canCancel: true,
        payment: {
          method: 'UPI',
          transactionId: 'TXN-9842103',
        },
      };
      saveBookings([defaultBooking]);
      return { data: { items: [defaultBooking], total: 1, pages: 1 } };
    }
    return { data: { items: list, total: list.length, pages: 1 } };
  }

  // Create booking: /bookings
  if (url === '/bookings' && method === 'post') {
    const { showId, seatIds, method: payMethod, cardNumber, upiId } = data;
    const movieId = showId?.split('-')[1] || DEMO_MOVIES[0]._id;
    const movie = DEMO_MOVIES.find((m) => m._id === movieId) || DEMO_MOVIES[0];
    const theatre = DEMO_THEATRES[0];
    const seats = seatIds.map((id, idx) => ({
      _id: id,
      row: id.slice(-2, -1) || 'E',
      number: id.slice(-1) || String(idx + 1),
      label: id.slice(-2) || `E${idx + 1}`,
      tier: 'premium',
      price: 380,
    }));
    const subtotal = seats.reduce((acc, s) => acc + s.price, 0);
    const fee = Math.round(subtotal * 0.05);
    const code = 'IM-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newBooking = {
      _id: 'bk-' + Date.now(),
      code,
      status: 'confirmed',
      movie,
      theatre,
      show: {
        _id: showId,
        format: 'IMAX 3D',
        language: movie.language,
        screenName: 'Audi 1 (IMAX Laser)',
        startTime: new Date(Date.now() + 86400000).toISOString(),
      },
      seats,
      subtotal,
      convenienceFee: fee,
      total: subtotal + fee,
      createdAt: new Date().toISOString(),
      canCancel: true,
      payment: {
        method: payMethod || 'UPI',
        last4: cardNumber ? cardNumber.slice(-4) : undefined,
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
    };

    const current = getSavedBookings();
    saveBookings([newBooking, ...current]);
    return { data: newBooking };
  }

  // Booking detail: /bookings/:id
  const bkDetail = url.match(/^\/bookings\/([^/?]+)$/);
  if (bkDetail && method === 'get') {
    const id = bkDetail[1];
    const list = getSavedBookings();
    const found = list.find((b) => b._id === id);
    if (found) return { data: found };

    // Fallback generated sample booking
    const movie = DEMO_MOVIES[0];
    return {
      data: {
        _id: id,
        code: 'IM-A9X2K4',
        status: 'confirmed',
        movie,
        theatre: DEMO_THEATRES[0],
        show: {
          _id: 'sh-demo',
          format: 'IMAX 3D',
          language: movie.language,
          screenName: 'Audi 1 (IMAX Laser)',
          startTime: new Date(Date.now() + 86400000).toISOString(),
        },
        seats: [
          { _id: 's1', label: 'E5', tier: 'premium', price: 380 },
          { _id: 's2', label: 'E6', tier: 'premium', price: 380 },
        ],
        subtotal: 760,
        convenienceFee: 38,
        total: 798,
        createdAt: new Date().toISOString(),
        canCancel: true,
        payment: {
          method: 'UPI',
          transactionId: 'TXN-9842103',
        },
      },
    };
  }

  // Cancel booking: /bookings/:id/cancel
  const bkCancel = url.match(/^\/bookings\/([^/?]+)\/cancel/);
  if (bkCancel && method === 'put') {
    const id = bkCancel[1];
    const list = getSavedBookings();
    const updated = list.map((b) => (b._id === id ? { ...b, status: 'cancelled', canCancel: false } : b));
    saveBookings(updated);
    return { data: { status: 'cancelled', canCancel: false } };
  }

  // Auth: /auth/login
  if (url === '/auth/login' && method === 'post') {
    const user = {
      id: 'usr-1',
      name: data.email?.includes('admin') ? 'Administrator' : 'Bhumika Kushwah',
      email: data.email,
      role: data.email?.includes('admin') ? 'admin' : 'user',
    };
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user,
      },
    };
  }

  // Auth: /auth/register
  if (url === '/auth/register' && method === 'post') {
    const user = {
      id: 'usr-' + Date.now(),
      name: data.name || 'Bhumika Kushwah',
      email: data.email,
      role: 'user',
    };
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user,
      },
    };
  }

  // Auth: /auth/me
  if (url === '/auth/me' && method === 'get') {
    const saved = JSON.parse(localStorage.getItem('imovies_user') || 'null');
    return {
      data: {
        user: saved || {
          id: 'usr-1',
          name: 'Bhumika Kushwah',
          email: 'bhumika@imovies.com',
          role: 'user',
        },
      },
    };
  }

  // Notifications: /notifications
  if (url === '/notifications') {
    return {
      data: {
        items: [
          {
            _id: 'n1',
            title: 'Welcome to IMovies VIP',
            message: 'Enjoy ₹100 off on your first IMAX booking! Use code FIRSTIMAX.',
            createdAt: new Date().toISOString(),
            read: false,
          },
          {
            _id: 'n2',
            title: 'Dune: Part Two in IMAX',
            message: 'Tickets for Dune: Part Two are now open in your city.',
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            read: true,
          },
        ],
        unread: 1,
      },
    };
  }

  if (url === '/notifications/read') {
    return { data: { success: true } };
  }

  // Fallback
  return { data: {} };
}

// Wrapper that tries the real backend first, but seamlessly falls back to mockHandler
const api = {
  get: async (url, config = {}) => {
    try {
      return await realApi.get(url, config);
    } catch (err) {
      // If server unreachable or error, use mock
      if (!err.response || err.response.status >= 500 || err.response.status === 404) {
        return await mockHandler('get', url, null, config.params || {});
      }
      throw err;
    }
  },
  post: async (url, body, config = {}) => {
    try {
      return await realApi.post(url, body, config);
    } catch (err) {
      if (!err.response || err.response.status >= 500 || err.response.status === 404) {
        return await mockHandler('post', url, body, config.params || {});
      }
      throw err;
    }
  },
  put: async (url, body, config = {}) => {
    try {
      return await realApi.put(url, body, config);
    } catch (err) {
      if (!err.response || err.response.status >= 500 || err.response.status === 404) {
        return await mockHandler('put', url, body, config.params || {});
      }
      throw err;
    }
  },
  delete: async (url, config = {}) => {
    try {
      return await realApi.delete(url, config);
    } catch (err) {
      if (!err.response || err.response.status >= 500 || err.response.status === 404) {
        return await mockHandler('delete', url, null, config.params || {});
      }
      throw err;
    }
  },
};

export const errMsg = (e) => e?.response?.data?.message || e?.friendly || e?.message || 'Something went wrong.';
export default api;
