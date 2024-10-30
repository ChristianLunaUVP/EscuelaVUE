<script setup>
const props = defineProps({
    modal: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="modal fade" :id="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div> <!-- Cerrando el div correctamente -->
            </div>
        </div>
    </div>
</template>