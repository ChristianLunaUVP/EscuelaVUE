<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <i class="fas fa-school me-2"></i> Escuela
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="authStore.user">
          <li class="nav-item">
            <router-link to="#" class="nav-link active text-info">
              {{ authStore.user.name }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/carreras" class="nav-link">
              <i class="fas fa-graduation-cap me-1"></i> Carreras
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/alumnos" class="nav-link">
              <i class="fas fa-user-graduate me-1"></i> Alumnos
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/graphic" class="nav-link">
              <i class="fas fa-chart-bar me-1"></i> Gráfica
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reports" class="nav-link">
              <i class="fas fa-file-alt me-1"></i> Reportes
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <button @click="authStore.logout" class="btn btn-outline-danger d-flex align-items-center">
              <i class="fas fa-sign-out-alt me-1"></i> Salir
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-brand {
  font-weight: bold;
  color: #f8f9fa !important;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s;
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link.active {
  color: #f8f9fa;
}

.navbar-dark .navbar-nav .nav-link i {
  margin-right: 4px;
}

.btn-outline-danger {
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: #dc3545;
  transition: background-color 0.3s, color 0.3s;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.btn-outline-danger i {
  margin-right: 4px;
}
</style>
