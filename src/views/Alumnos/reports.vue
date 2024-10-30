<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import SelectInput from '../../components/SelectInput.vue';
import DataTable from 'datatables.net-vue3';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';

// Importar plugins de DataTables
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

window.JSZip = JSZip;
DataTable.use(ButtonsHtml5);

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const alumnos = ref([]);
const carreras = ref([]);
const columns1 = ref([]);
const columns2 = ref([]);
const buttons1 = ref([]);
const buttons2 = ref([]);
const report = ref('1');
const type = ref([
  { id: '1', name: 'Alumnos' },
  { id: '2', name: 'Carreras' }
]);

onMounted(async () => {
  try {
    const carrerasResponse = await axios.get('/api/carreras');
    console.log("Carreras obtenidas:", carrerasResponse.data);
    carreras.value = carrerasResponse.data;

    const alumnosResponse = await axios.get('/api/alumnosall');
    console.log("Alumnos obtenidos:", alumnosResponse.data);
    alumnos.value = alumnosResponse.data.map(alumno => ({
      id: alumno.id,
      nombre: alumno.nombre,
      matricula: alumno.matricula,
      carrera: alumno.carrera_id,
      semestre: alumno.semestre,
      imagen: alumno.imagen
    }));
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
  }
});

columns1.value = [
  { data: null, render: (data, type, row, meta) => (meta.row + 1) },
  { data: 'nombre' },
  { data: 'matricula' },
  { data: 'carrera' },
  { data: 'semestre' },
  { data: 'imagen' }
];

columns2.value = [
  { data: null, render: (data, type, row, meta) => (meta.row + 1) },
  { data: 'nombre' }
];

buttons1.value = [
  {
    title: 'Alumnos',
    extend: 'excelHtml5',
    text: '<i class="fa-solid fa-file-excel"></i> Excel',
    className: 'btn btn-outline-success btn-sm'
  },
  {
    title: 'Alumnos',
    extend: 'pdfHtml5',
    text: '<i class="fa-solid fa-file-pdf"></i> PDF',
    className: 'btn btn-outline-danger btn-sm'
  },
  {
    title: 'Alumnos',
    extend: 'print',
    text: '<i class="fa-solid fa-print"></i> Imprimir',
    className: 'btn btn-outline-dark btn-sm'
  },
  {
    title: 'Alumnos',
    extend: 'copy',
    text: '<i class="fa-solid fa-copy"></i> Copiar',
    className: 'btn btn-outline-secondary btn-sm'
  }
];

buttons2.value = [
  {
    title: 'Carreras',
    extend: 'excelHtml5',
    text: '<i class="fa-solid fa-file-excel"></i> Excel',
    className: 'btn btn-outline-success btn-sm'
  },
  {
    title: 'Carreras',
    extend: 'pdfHtml5',
    text: '<i class="fa-solid fa-file-pdf"></i> PDF',
    className: 'btn btn-outline-danger btn-sm'
  },
  {
    title: 'Carreras',
    extend: 'print',
    text: '<i class="fa-solid fa-print"></i> Imprimir',
    className: 'btn btn-outline-dark btn-sm'
  },
  {
    title: 'Carreras',
    extend: 'copy',
    text: '<i class="fa-solid fa-copy"></i> Copiar',
    className: 'btn btn-outline-secondary btn-sm'
  }
];
</script>

<template>
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h2 class="text-center mb-4">Reporte de Alumnos y Carreras</h2>
        <div class="mb-4">
          <SelectInput id="rep" class="form-select form-select-sm" v-model="report" :options="type" />
        </div>

        <div class="table-responsive" v-if="report === '1'">
          <DataTable
            :data="alumnos"
            :columns="columns1"
            class="table table-hover"
            :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons1 }"
          >
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Matricula</th>
                <th>Carrera</th>
                <th>Semestre</th>
                <th>Imagen</th>
              </tr>
            </thead>
          </DataTable>
        </div>

        <div class="table-responsive" v-if="report === '2'">
          <DataTable
            :data="carreras"
            :columns="columns2"
            class="table table-hover"
            :options="{ responsive: true, autoWidth: false, dom: 'Bfrtip', buttons: buttons2 }"
          >
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Nombre</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.container {
  max-width: 900px;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Título */
h2 {
  font-weight: 600;
  color: #2c3e50;
}

/* Tabla general */
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-hover tbody tr:hover {
  background-color: #f1f3f6;
}

.table thead th {
  background-color: #e9ecef;
  color: #34495e;
  font-weight: 600;
  border: none;
  text-align: center;
  padding: 12px;
}

/* Filas y celdas */
th, td {
  padding: 14px;
  text-align: center;
  font-size: 0.95rem;
  border-bottom: 1px solid #ddd;
}

/* Input de búsqueda */
.dataTables_filter input {
  border-radius: 6px;
  border: 1px solid #ced4da;
  padding: 8px 14px;
  font-size: 0.9rem;
  margin-left: 10px;
  outline: none;
  transition: border-color 0.3s;
}

.dataTables_filter input:focus {
  border-color: #007bff;
}

/* Paginación */
.dataTables_paginate {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.dataTables_paginate .paginate_button {
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  background-color: #e2e6ea;
  color: #495057;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out, transform 0.2s;
}

.dataTables_paginate .paginate_button:hover {
  background-color: #d6dae0;
  transform: translateY(-1px);
}

.dataTables_paginate .paginate_button.current {
  background-color: #007bff;
  color: #fff !important;
}

/* Mensaje de sin datos */
.dataTables_empty {
  font-size: 1rem;
  color: #666;
  text-align: center;
  padding: 20px 0;
}

/* Estilo de los botones de exportación */
.dt-button {
  margin-right: 10px;
  border: none;
  background: #f1f3f6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 20px;
  transition: background 0.3s ease, color 0.3s;
}

.dt-button:hover {
  background: #d9e1e8;
  color: #333;
}

.dt-button.active {
  background: #007bff;
  color: #fff;
}

/* Estilo para los botones específicos de DataTable */
.btn {
  border-radius: 30px;
  padding: 6px 14px;
}

.btn-outline-success {
  color: #28a745;
  border-color: #28a745;
}

.btn-outline-success:hover {
  background-color: #28a745;
  color: #fff;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.btn-outline-dark {
  color: #343a40;
  border-color: #343a40;
}

.btn-outline-dark:hover {
  background-color: #343a40;
  color: #fff;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: #fff;
}

/* Input select */
.form-select-sm {
  padding: 8px 15px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  font-size: 0.9rem;
}

.form-select-sm:focus {
  border-color: #007bff;
}

thead {
  background-color: #f8f9fa;
}

/* Fondo y estilo para botones de exportación */
.dt-button {
  margin-right: 10px;
  border: none;
  background: #f0f2f5;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 25px;
  transition: background 0.3s ease;
}

.dt-button:hover {
  background: #d9e1e8;
  color: #1a1a1a;
}

.dt-button.active {
  background: #007bff;
  color: #fff;
}

</style>
