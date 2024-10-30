<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.token;

const carreras = ref([]);
const alumnos = ref([]);
const chartData = ref([]);
const chartOptions = ref([]);
const colors = ref([]);
const loaded = ref(false);

const random = () => {
    return Math.floor(Math.random() * 255);
};

onMounted(async () => {
    const info = await axios.get('/api/alumnosporcarrera');
    info.data.map((row) => {
        carreras.value.push(row.nombre);
        alumnos.value.push(row.count);
        colors.value.push(`rgba(${random()}, ${random()}, ${random()}, 0.6)`);
    });
    chartOptions.value = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Carreras',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Número de Alumnos',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
                beginAtZero: true,
            },
        },
    };
    chartData.value = {
        labels: carreras.value,
        datasets: [{
            label: 'Número de Alumnos por Carrera',
            data: alumnos.value,
            backgroundColor: colors.value,
            borderColor: colors.value.map(color => color.replace('0.6', '1')),
            borderWidth: 1,
        }],
    };
    loaded.value = true;
});
</script>

<template>
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">
                            <i class="fas fa-chart-bar me-2"></i>Alumnos por Carrera
                        </h4>
                    </div>
                    <div class="card-body">
                        <Pie :data="chartData" :options="chartOptions" v-if="loaded"></Pie>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-header h4 {
    margin: 0;
}

.me-2 {
    margin-right: 0.5rem;
}
</style>
