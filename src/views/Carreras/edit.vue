<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { show_alerta, sendRequest } from '../../functions'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`

const form = ref({
  id: '',
  nombre: ''
})
const id = ref(route.params.id)

const getCarrera = async () => {
  try {
    const response = await axios.get(`/api/carreras/${id.value}`)
    form.value.nombre = response.data.data.nombre
  } catch (error) {
    console.error('Error fetching carrera:', error)
    if (error.response && error.response.status === 401) {
      show_alerta('Unauthorized. Redirecting to login...', 'error', '')
      router.push('/login')
    } else {
      show_alerta('Error fetching carrera', 'error', '')
    }
  }
}

const save = async () => {
  try {
    await sendRequest('put', form.value, `/api/carreras/${id.value}`, '/carreras')
  } catch (error) {
    console.error('Error saving carrera:', error)
    if (error.response && error.response.status === 401) {
      show_alerta('Unauthorized. Redirecting to login...', 'error', '')
      router.push('/login')
    } else {
      show_alerta('Error saving carrera', 'error', '')
    }
  }
}

onMounted(() => {
  getCarrera()
})
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-warning text-dark text-center fs-5">
            <i class="fas fa-edit"></i> Editar Carrera
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <div class="mb-3">
                <label for="carrera" class="form-label fw-bold">Nombre de la Carrera</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-graduation-cap"></i>
                  </span>
                  <input autofocus id="carrera" type="text" v-model="form.nombre" 
                    placeholder="Carrera" class="form-control" required>
                </div>
              </div>
              <div class="d-grid">
                <button class="btn btn-warning text-white">
                  <i class="fas fa-save"></i> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
