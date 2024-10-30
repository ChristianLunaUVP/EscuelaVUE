<script setup>
import { ref, onMounted } from 'vue'

// Definir las propiedades que recibirá el componente
const props = defineProps({
  modelValue: String,
  options: Array,
})

// Definir los eventos que emitirá el componente
const emit = defineEmits(['update:modelValue'])

// Referencia para el input
const input = ref(null);

// Enfocar el elemento si tiene el atributo 'autofocus'
onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
    input.value.focus();
  }
});

// Exponer el método de enfoque para poder ser utilizado desde el padre si es necesario
defineExpose({
  focus() {
    input.value.focus();
  }
});
</script>

<template>
  <select
    class="form-select"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    ref="input"
  >
    <option v-for="op in options" :key="op.id" :value="op.id">
      {{ op.name }}
    </option>
  </select>
</template>
