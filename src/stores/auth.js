import { defineStore } from 'pinia';
import { show_alerta } from '../functions';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authToken: localStorage.getItem('authToken') || null, // Obtener el token desde el almacenamiento local
  }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
  },
  actions: {
    async getToken() {
      await axios.get('/sanctum/csrf-cookie');
    },
    async login(form) {
      try {
        await this.getToken();
        const res = await axios.post('/api/auth/login', form);
        this.authToken = res.data.token;
        this.authUser = res.data.data;

        // Almacenar el token en localStorage para persistencia
        localStorage.setItem('authToken', res.data.token);
        
        // Configurar el encabezado de autorización de Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        // Redirigir al usuario
        this.router.push('/carreras');
      } catch (error) {
        let desc = '';
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(e => {
            desc += e + ' ';
          });
        } else {
          desc = 'Login failed. Please check your credentials.';
        }
        show_alerta(desc.trim(), 'error', '');
      }
    },
    async register(form) {
      try {
        await this.getToken();
        const res = await axios.post('/api/auth/register', form);
        show_alerta(res.data.message, 'success', '');
        
        // Redirigir al usuario a la página de inicio de sesión
        setTimeout(() => this.router.push('/login'), 2000);
      } catch (error) {
        let desc = '';
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(e => {
            desc += e + ' ';
          });
        } else {
          desc = 'Registration failed. Please check your input.';
        }
        show_alerta(desc.trim(), 'error', '');
      }
    },
    async logout() {
      try {
        await axios.post('/api/auth/logout');
        this.authToken = null;
        this.authUser = null;

        // Eliminar el token de localStorage
        localStorage.removeItem('authToken');
        
        // Eliminar el encabezado de autorización
        delete axios.defaults.headers.common['Authorization'];

        // Redirigir al usuario
        this.router.push('/login');
      } catch (error) {
        let desc = '';
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(e => {
            desc += e + ' ';
          });
        } else {
          desc = 'Logout failed. Please try again.';
        }
        show_alerta(desc.trim(), 'error', '');
      }
    },
  },
  persist: true // Agregar persistencia
});
