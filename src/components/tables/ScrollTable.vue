<template lang="">
    <div
        class="custom-scroll-table overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="relative max-w-full overflow-auto custom-scrollbar" :class="`h-[${height}]`">
          <table>
            <slot></slot>
          </table>
        </div>
      </div>
</template>
<script setup lang="ts">

const props = defineProps({
  height: {
    type: String,
    default: '600px',
  }
});
</script>
<style lang="scss" scoped>
.custom-scroll-table :deep(table) {
    min-width: 100%;
  th {
    position: sticky !important;
    top: 0 !important;
    z-index: 10 !important;
    will-change: transform;
  }
  td {
    position: relative;
  }
}
    
</style>