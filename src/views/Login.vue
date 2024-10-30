<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const form = ref({
  email: '',
  password: ''
})
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg border-0 bg-dark text-light">
          <div class="card-header text-center border-0 bg-dark text-light fs-4 fw-bold">
            <i class="fas fa-user-lock"></i> Login
          </div>
          <div class="card-body">
            <form @submit.prevent="authStore.login(form)">
              <div class="mb-3">
                <label for="email" class="form-label">Correo Electrónico</label>
                <div class="input-group">
                  <span class="input-group-text bg-secondary text-light border-0">
                    <i class="fa-solid fa-at"></i>
                  </span>
                  <input id="email" autofocus type="email" v-model="form.email" placeholder="Email" class="form-control bg-dark text-light border-secondary" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text bg-secondary text-light border-0">
                    <i class="fa-solid fa-lock"></i>
                  </span>
                  <input id="password" type="password" v-model="form.password" placeholder="Password" class="form-control bg-dark text-light border-secondary" required>
                </div>
              </div>
              <div class="d-grid mb-3">
                <button class="btn btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                </button>
              </div>
              <div class="text-center">
                <router-link to="/register" class="text-decoration-none text-info">
                  ¿No tienes cuenta? Regístrate
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
