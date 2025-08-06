<template lang="">
    <div
        class="flex-[1] overflow-auto custom-scroll-table border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="relative max-w-full overflow-auto custom-scrollbar h-full">
          <table>
            <slot></slot>
          </table>
        </div>
      </div>
</template>
<script setup lang="ts">

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