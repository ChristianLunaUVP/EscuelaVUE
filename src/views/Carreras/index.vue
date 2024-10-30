<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;

const carreras = ref([]);
const load = ref(false);

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
});

const deleteCarrera = async (id, nombre) => {
    confirmation(nombre, ('/api/carreras/' + id), '/carreras');
}
</script>

<template>
    <div class="container-fluid py-4">
        <div class="row justify-content-center">
            <div class="col-md-11">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="text-primary mb-0">
                        <i class="fas fa-graduation-cap"></i> Lista de Carreras
                    </h2>
                    <router-link :to="{ path: 'create' }" class="btn btn-sm btn-outline-primary d-flex align-items-center">
                        <i class="fas fa-plus-circle me-1"></i> Agregar
                    </router-link>
                </div>
                
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <div v-if="!load" class="text-center">
                            <img src="/loading.gif" class="img-fluid" alt="Cargando...">
                            <p class="mt-2 text-muted">Cargando carreras...</p>
                        </div>

                        <div v-else>
                            <div class="table-responsive">
                                <table class="table table-hover table-bordered align-middle">
                                    <thead class="bg-light text-dark">
                                        <tr>
                                            <th style="width: 5%;">#</th>
                                            <th style="width: 75%;">Carrera</th>
                                            <th class="text-center" style="width: 20%;">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(carr, i) in carreras" :key="carr.id">
                                            <td>{{ i + 1 }}</td>
                                            <td>{{ carr.nombre }}</td>
                                            <td class="text-center">
                                                <router-link :to="{ path: 'edit/' + carr.id }" class="btn btn-sm btn-outline-warning me-2">
                                                    <i class="fas fa-edit"></i>
                                                </router-link>
                                                <button @click="deleteCarrera(carr.id, carr.nombre)" class="btn btn-sm btn-outline-danger">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-fluid {
    max-width: 95%;
}

.card-body {
    padding: 20px;
}

.card-header,
.table thead th {
    font-size: 1.1rem;
    font-weight: 500;
}

.btn-sm {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 123, 255, 0.1);
}

.table th, .table td {
    vertical-align: middle;
}

</style>
