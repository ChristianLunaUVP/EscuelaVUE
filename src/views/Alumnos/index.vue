<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Modal from '@/components/Modal.vue';
import Paginate from 'vuejs-paginate-next';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;

const carreras = ref([]);
const alumnos = ref([]);
const load = ref(false);
const rows = ref(0);
const form = ref({
    nombre: '',
    matricula: '',
    carrera_id: '',
    semestre: '',
    imagen: null // Cambiado a null para manejar el archivo
});

const Title = ref('');
const nameInput = ref('');
const operation = ref(1);
const id = ref('');
const close = ref(null);

const getAlumnos = async (page) => {
    try {
        const response = await axios.get('/api/alumnos?page=' + page);
        alumnos.value = response.data.data;
        rows.value = response.data.last_page;
        load.value = true;
    } catch (error) {
        console.error('Error fetching alumnos:', error);
        load.value = true;
    }
}

const getCarreras = async () => {
    try {
        const response = await axios.get('/api/carreras');
        carreras.value = response.data;
        load.value = true;
    } catch (error) {
        console.error('Error fetching carreras:', error);
        load.value = true;
    }
}

onMounted(() => {
    getCarreras();
    getAlumnos(1);
});

const deleteAlumno = async (id, nombre) => {
    confirmation(nombre, ('/api/alumnos/' + id), '/alumnos');
}

const openModal = (op, nombre, matricula, carrera, semestre, imagen) => {
    clear();
    setTimeout(() => nextTick(() => nameInput.value.focus()), 600);
    operation.value = op;
    id.value = op === 2 ? id : '';
    Title.value = op === 1 ? 'Agregar Alumno' : 'Editar Alumno';
    form.value.nombre = nombre || '';
    form.value.matricula = matricula || '';
    form.value.carrera_id = carrera || '';
    form.value.semestre = semestre || '';
    form.value.imagen = null;
}

const clear = () => {
    form.value.nombre = '';
    form.value.matricula = '';
    form.value.carrera_id = '';
    form.value.semestre = '';
    form.value.imagen = null;
}

const handleFileChange = (event) => {
    form.value.imagen = event.target.files[0];
}

const save = async () => {
    const formData = new FormData();
    formData.append('nombre', form.value.nombre);
    formData.append('matricula', form.value.matricula);
    formData.append('carrera_id', form.value.carrera_id);
    formData.append('semestre', form.value.semestre);
    if (form.value.imagen) {
        formData.append('imagen', form.value.imagen);
    }

    let res;
    if (operation.value === 1) {
        res = await sendRequest('post', formData, '/api/alumnos', '');
        if (res === true) {
            clear();
            nextTick(() => nameInput.value.focus());
            getAlumnos(1);
            closeModal();
        }
    } else {
        res = await sendRequest('put', formData, ('/api/alumnos/' + id.value), '');
        if (res === true) {
            nextTick(() => close.value.click());
            getAlumnos(1);
            closeModal();
        }
    }
}

const closeModal = () => {
    const modalElement = document.getElementById('modal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center mb-4">
      <div class="col-md-6 text-center">
        <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modal" @click="$event => openModal(1)">
          <i class="fas fa-plus-circle"></i> Agregar Alumno
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="card bg-light shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0"><i class="fas fa-users me-2"></i> Lista de Alumnos</h4>
            <div class="text-end">
              <small>Total: {{ alumnos.length }}</small>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive" v-if="load">
              <table class="table table-hover table-bordered mb-0">
                <thead class="bg-light text-dark">
                  <tr>
                    <th style="width: 5%;">#</th>
                    <th style="width: 20%;">Nombre</th>
                    <th style="width: 15%;">Matricula</th>
                    <th style="width: 20%;">Carrera</th>
                    <th style="width: 10%;">Semestre</th>
                    <th style="width: 10%;">Imagen</th>
                    <th style="width: 20%;" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(alum, i) in alumnos" :key="alum.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ alum.nombre }}</td>
                    <td>{{ alum.matricula }}</td>
                    <td>{{ alum.carrera }}</td>
                    <td>{{ alum.semestre }}</td>
                    <td>
                      <img :src="'/storage/' + alum.imagen" class="img-thumbnail" alt="Imagen del alumno" v-if="alum.imagen">
                      <span v-else>No hay imagen</span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-outline-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#modal"
                        @click="$event => openModal(2, alum.nombre, alum.matricula, alum.carrera_id, alum.semestre, alum.imagen, alum.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteAlumno(alum.id, alum.nombre)" class="btn btn-outline-danger btn-sm">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="card-footer text-center bg-light">
                <Paginate :page-count="rows" :click-handler="getAlumnos" :prev-text="'Anterior'" :next-text="'Siguiente'"
                  :container-class="'pagination justify-content-center mt-3'" />
              </div>
            </div>
            <div class="text-center p-4" v-else>
              <img src="/loading.gif" class="img-fluid" alt="Cargando...">
              <p class="mt-2 text-muted">Cargando alumnos...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal :id="'modal'" :title="Title">
      <div class="modal-body">
        <form @submit.prevent="save">
          <div class="input-group mb-3">
            <span class="input-group-text bg-primary text-light border-0">
              <i class="fa-solid fa-user"></i>
            </span>
            <input autofocus type="text" v-model="form.nombre" placeholder="Nombre" class="form-control border-primary" ref="nameInput" required>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text bg-primary text-light border-0">
              <i class="fa-solid fa-id-card"></i>
            </span>
            <input type="text" v-model="form.matricula" placeholder="Matricula" class="form-control border-primary" required>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text bg-primary text-light border-0">
              <i class="fa-solid fa-graduation-cap"></i>
            </span>
            <select v-model="form.carrera_id" class="form-select border-primary" required>
              <option v-for="carrera in carreras" :key="carrera.id" :value="carrera.id">
                {{ carrera.nombre }}
              </option>
            </select>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text bg-primary text-light border-0">
              <i class="fa-solid fa-calendar"></i>
            </span>
            <input type="text" v-model="form.semestre" placeholder="Semestre" class="form-control border-primary" required>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text bg-primary text-light border-0">
              <i class="fa-solid fa-image"></i>
            </span>
            <input type="file" @change="handleFileChange" class="form-control border-primary">
          </div>
          <div class="d-grid col-10 mx-auto">
            <button class="btn btn-outline-success">
              <i class="fas fa-save"></i> Guardar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.card-header {
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.img-thumbnail {
  max-width: 60px;
  max-height: 60px;
}

.btn-outline-primary, .btn-outline-warning, .btn-outline-danger, .btn-outline-success {
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: #fff;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  color: #212529;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: #fff;
}
</style>
