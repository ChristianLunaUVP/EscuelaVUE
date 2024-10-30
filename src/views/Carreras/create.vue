<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { show_alerta, sendRequest } from '../../functions'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`

const form = ref({
  nombre: ''
})
const nameInput = ref('')

const save = async () => {
  await sendRequest('post', form.value, '/api/carreras', '')
  form.value.nombre = ''
  nextTick(() => {
    nameInput.value.focus()
  })
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white text-center fs-5">
            <i class="fas fa-plus-circle"></i> Agregar Carrera
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
                    placeholder="Carrera" class="form-control" ref="nameInput" required>
                </div>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary">
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
