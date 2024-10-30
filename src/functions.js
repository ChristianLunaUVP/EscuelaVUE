import Swal from 'sweetalert2';
import { nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

export function show_alerta(msj, icon, focus) {
    if (focus !== "") {
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true,
    });
}

export function confirmation(name, url, redirect) {
    const alert = Swal.mixin({ buttonsStyling: true });
    alert.fire({
        title: `¿Estás seguro de eliminar ${name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i>Sí, eliminar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i>Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest('DELETE', {}, url, redirect);
        }
    });
}

export async function sendRequest(method, params, url, redirect = '') {
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;

    try {
        const response = await axios({ method: method, url: url, data: params });
        const res = response.data.status;
        show_alerta(response.data.message, 'success', '');

        if (redirect !== '') {
            setTimeout(() => {
                window.location.href = redirect;
            }, 2000);
        }

        return res;
    } catch (errors) {
        let desc = '';
        if (errors.response && errors.response.data && errors.response.data.errors) {
            errors.response.data.errors.forEach(e => {
                desc += e + ' ';
            });
        } else {
            desc = 'An error occurred. Please try again.';
        }
        show_alerta(desc.trim(), 'error', '');
        return null;
    }
}