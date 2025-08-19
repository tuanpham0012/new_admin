<template>
    <tr class="border-t border-gray-200 dark:border-gray-600">
        <td class="sticky left-0 px-5 py-2 bg-white sm:px-6 dark:bg-white/[0.01] dark:text-gray-200" >
            <div class="d-flex align-content-center" :style="{ paddingLeft: `${props.depth * 1.125}rem` }">
                <!-- <i class="fa-solid fa-l -translate-y-1.5" v-if="props.depth != 0"></i> <i class="fa-solid fa-window-minimize -translate-y-1" v-else></i>   -->
                <i class="fa-solid fa-chevron-down translate-y-0.5 me-2" v-if="menu.children.length > 0"></i>
                <i class="fa-solid fa-chevron-right translate-y-0.5 me-2" v-else></i> {{ menu.title }}
            </div>
            
        </td>
        <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200"><div v-html="menu.icon"></div></td>
        <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">{{ menu.url }}</td>
        <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">{{ menu.hidden ? "Đã ẩn" : "Hiển thị" }}</td>
        <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
            <div class="flex gap-2">
            <Button
                variant="secondary"
                size="icon"
                @click="() => $emit('toggleEdit', menu.id)"
            >
                <i class="fa-solid fa-pen-to-square"></i>
            </Button>
            <Button
                variant="secondary"
                size="icon"
            >
                <i class="fa-solid fa-trash"></i>
            </Button>
            </div>
        </td>
    </tr>
    <TableMenuRow v-for="(item, index) in menu.children" :key="index" :menu="item" :depth="props.depth + 1" @toggle-edit="(id) => $emit('toggleEdit', id)"/>
</template>
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
const props = defineProps({
    menu: {
        type: Object,
        default: () => null
    },
    depth: {
        type: Number,
        default: 0
    }
});

defineEmits(['toggleEdit']);
</script>
<style lang=""></style>
