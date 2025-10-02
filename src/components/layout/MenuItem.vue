<!-- components/MenuItem.vue -->
<template>
  <li v-if="item">
    <!-- Nếu là một liên kết trực tiếp (không có children) -->
    <div v-if="item.groupMenu">
      <h2
        :class="[
          'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
        ]"
      >
        <template v-if="isExpanded || isHovered || isMobileOpen">
          {{ item.name }}
        </template>
        <HorizontalDots v-else />
      </h2>
    </div>

    <router-link
      v-else-if="!item.children.length"
      :to="item.path"
      :class="[
        'menu-item group w-full',
        {
          'menu-item-active': parentIsActive(item.path),
          'menu-item-inactive': !parentIsActive(item.path),
        },
        !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
      ]"
    >
      <span
        :class="[parentIsActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']"
        v-if="item.icon"
      >
        <div v-html="item.icon"></div>
      </span>
      <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
        item.name
      }}</span>
    </router-link>

    <!-- Nếu là một menu cha có children -->
    <button
      v-else-if="item.children.length"
      @click="toggleSubmenu(item.id)"
      :class="[
        'menu-item group w-full',
        {
          'menu-item-active': isSubmenuOpen(item.id),
          'menu-item-inactive': !isSubmenuOpen(item.id),
        },
        !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
      ]"
    >
      <span
        :class="[isSubmenuOpen(item.id) ? 'menu-item-icon-active' : 'menu-item-icon-inactive']"
        v-if="item.icon"
      >
        <div v-html="item.icon"></div>
      </span>
      <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
        item.name
      }}</span>
      <ChevronRightIcon
        v-if="isExpanded || isHovered || isMobileOpen"
        :class="[
          'ml-auto w-5 h-5 transition-transform duration-100',
          {
            'rotate-[90deg] text-brand-500': isSubmenuOpen(item.id),
          },
        ]"
      />
    </button>

    <!-- Submenu (children) -->
    <transition
      @enter="startTransition"
      @after-enter="endTransition"
      @before-leave="startTransition"
      @after-leave="endTransition"
    >
      <div v-show="item.groupMenu || (isSubmenuOpen(item.id) && (isExpanded || isHovered || isMobileOpen))">
        <ul
          :class="[
            'mt-1 space-y-2',
            item.groupMenu ? 'pl-0' : '[&>li]:pl-8',
            //{ 'ml-4': !isNested }, // Chỉ thêm padding bên trái nếu không phải là cấp con lồng nhau
            //{ 'ml-4': isNested }, // Ít padding hơn cho các cấp sâu hơn
          ]"
        >
          <!-- Tự gọi component MenuItem này cho mỗi children -->
          <MenuItem
            v-for="subItem in item.children"
            :key="subItem.id"
            :item="subItem"
            :is-nested="true"
            :is-expanded="isExpanded"
            :is-hovered="isHovered"
            :is-mobile-open="isMobileOpen"
            :active-path="activePath"
            @toggle-submenu="toggleSubmenu"
          />
        </ul>
      </div>
    </transition>
    <hr class="mt-3" v-if="item.groupMenu" />
  </li>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDownIcon, HorizontalDots, ChevronRightIcon } from '@/icons/index.ts' // Đảm bảo import icon này

// Đặt tên component để có thể tự gọi đệ quy
defineOptions({
  name: 'MenuItem',
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNested: {
    type: Boolean,
    default: false,
  },
  isExpanded: Boolean,
  isHovered: Boolean,
  isMobileOpen: Boolean,
  activePath: String, // Prop để truyền đường dẫn active hiện tại
})

const emit = defineEmits(['toggleSubmenu'])

const route = useRoute()

// Inject các hàm và state từ component cha (Sidebar.vue)
const {
  openSubmenu,
  toggleSubmenu: parentToggleSubmenu,
  isActive: parentIsActive,
  resolveIcon: parentResolveIcon,
  startTransition: parentStartTransition,
  endTransition: parentEndTransition,
} = inject('sidebarFunctions')

// Sử dụng các hàm được inject, hoặc định nghĩa lại nếu muốn độc lập hơn
const isActive = (item) => (route.path === item.path || openSubmenu.value === item.id)

const toggleSubmenu = (itemId) => {
  emit('toggleSubmenu', itemId)
}

const isSubmenuOpen = (itemId) => {
  // Kiểm tra xem submenu này có đang mở không

  return (
    openSubmenu.value === itemId ||
    (props.item.children && props.item.children.length > 0 &&
      props.item.children.some((child) =>
        child.path ? isActive(child) : isSubmenuOpen(child.id),
      ))
  )
}

const startTransition = parentStartTransition
const endTransition = parentEndTransition

onMounted(() => {
  // if (
  //   props.item &&
  //   props.item.children &&
  //   props.item.children.length > 0 &&
  //   props.item.groupMenu == true
  // ) {
  //   // Mở submenu nếu có con và con đó đang active
  //   toggleSubmenu(props.item.id)
  // }
})
</script>

<style scoped>
/* Define your existing menu item styles here.
   Bạn có thể cần điều chỉnh để xử lý các cấp sâu hơn */
</style>
