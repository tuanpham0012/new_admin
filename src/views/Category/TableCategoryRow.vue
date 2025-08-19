<template>
  <tr v-if="entry" @click="showChildren = !showChildren" class="table-row border-b">
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
      <img :src="entry.image" class="w-[45px] h-[45px] object-fill" />
    </td>
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
      <div class="flex content-center" :style="{ paddingLeft: `${props.depth * 1.5}rem` }">
        <!-- <i class="fa-solid fa-l -translate-y-1.5" v-if="props.depth != 0"></i> <i class="fa-solid fa-window-minimize -translate-y-1" v-else></i>   -->
        <div v-if="entry.children && entry.children.length">
          <i class="fa-solid fa-chevron-down translate-y-0.5 me-2" v-if="showChildren"></i>
          <i class="fa-solid fa-chevron-right translate-y-0.5 me-2" v-else></i>
        </div>
        <div v-else>
          <i class="fa-solid fa-minus translate-y-0.5 me-2"></i>
        </div>
        {{ entry.name }}
      </div>
    </td>
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200 text-right">
      {{ entry.productCount }}
    </td>
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200 text-center">
      {{ entry.notUse ? 'Ngưng sử dụng' : 'Hiển thị' }}
    </td>
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200 text-center">
      <i class="fa-regular fa-square" v-if="!entry.isPopular"></i>
      <i class="fa-regular fa-square-check" v-else></i>
    </td>
    <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
      <div class="flex gap-2">
        <Button size="icon" variant="secondary" @click="() => $emit('toggleEdit', entry.id)">
          <i class="fa-solid fa-pen-to-square"></i>
        </Button>
        <Button size="icon" variant="secondary" @click="() => $emit('toggleDelete', entry.id)">
          <i class="fa-solid fa-trash"></i>
        </Button>
      </div>
    </td>
  </tr>
  <TableCategoryRow
    v-if="entry && showChildren"
    v-for="(item, index) in entry.children"
    :key="index"
    :entry="item"
    :depth="props.depth + 1"
    @toggle-edit="(id) => $emit('toggleEdit', id)"
  />
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { viewFile } from '@/helpers/helpers'
import Button from '@/components/ui/Button.vue'
const props = defineProps({
  entry: {
    type: Object,
    default: () => null,
  },
  depth: {
    type: Number,
    default: 0,
  },
})

defineEmits(['toggleEdit', 'toggleDelete'])

const showChildren = ref(true)
</script>
<style lang="scss" scoped>
.table-row {
  animation-duration: 0.2s;
  animation-name: slidein;
}
@keyframes slidein {
  from {
    max-height: 0px;
    transform: scale(0);
    opacity: 0;
  }

  to {
    max-height: 100%;
    transform: scale(1);
    opacity: 1;
  }
}
</style>
