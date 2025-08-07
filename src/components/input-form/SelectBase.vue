<template lang="">
  <div class="relative z-20 bg-transparent">
    <select
      ref="selectElement"
      class="dark:bg-dark-900 pr-10 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      @change="selectOptions"
      :value="modelValue"
      @click="toggleSelect"
      @blur="toggleSelect"
    >
      <slot></slot>
    </select>
    <span
      class="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400"
      @click="showPicker"
    >
      <svg
        class="stroke-current"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
          stroke=""
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const selectElement = ref<HTMLSelectElement | null>(null)
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
})
const isOpen = ref(false)
const emits = defineEmits(['update:modelValue'])
const showPicker = () => {
  if (selectElement.value && !isOpen.value) {
    selectElement.value.showPicker()
    toggleSelect()
  }
}
const toggleSelect = () => {
  isOpen.value = !isOpen.value
}
const selectOptions = ($event: any) => {
  emits('update:modelValue', $event.target.value)
  toggleSelect()
}
</script>
<style lang=""></style>
