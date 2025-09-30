<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="32"
          height="32"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <ul class="flex flex-col gap-4">
            <!-- Lặp qua các menu item cấp cao nhất -->
            <MenuItem
              v-for="(menuItem, index) in menus"
              :key="index"
              :item="menuItem"
              :is-expanded="isExpanded"
              :is-hovered="isHovered"
              :is-mobile-open="isMobileOpen"
              @toggle-submenu="handleToggleSubmenu"
            />
          </ul>
        </div>
      </nav>
      <!-- <SidebarWidget v-if="isExpanded || isHovered || isMobileOpen" /> -->
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onBeforeMount, provide } from "vue";
import { useRoute } from "vue-router";

import MenuItem from "./MenuItem.vue"; // Import component đệ quy
import { useSidebar } from "@/composables/useSidebar";
import { useMenuStore } from "@/stores/menu";

const route = useRoute();
const menuStore = useMenuStore();

const { isExpanded, isMobileOpen, isHovered } = useSidebar();

// openSubmenu giờ đây sẽ lưu trữ ID của menu item đang mở
const openSubmenu = ref(null);

const menus = computed(() => menuStore.adminMenus.data ?? []);


const isActive = (path) => route.path === path;

const handleToggleSubmenu = (itemId) => {
  openSubmenu.value = openSubmenu.value === itemId ? null : itemId;
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};

onBeforeMount(async () => {
  await menuStore.getAdminMenu();
  // Khi component mount, kiểm tra xem có submenu nào của route hiện tại cần được mở không
  // Đây là logic phức tạp hơn một chút cho menu đa cấp
  openActiveSubmenus(menus.value, route.path);
});

// Hàm này sẽ đệ quy để tìm và mở các submenu cha của route hiện tại
const openActiveSubmenus = (menuItems, currentPath) => {
  for (const item of menuItems) {
    if (item.path === currentPath) {
      // Nếu là item cấp cao nhất, mở nó
      openSubmenu.value = item.id;
      return true;
    }
    if (item.children && item.children.length) {
      if (openActiveSubmenus(item.children, currentPath)) {
        // Nếu một con đang active, mở menu cha hiện tại
        openSubmenu.value = item.id;
        return true;
      }
    }
  }
  return false;
};


// Cung cấp các hàm và state cho các component con (MenuItem.vue)
provide("sidebarFunctions", {
  openSubmenu,
  toggleSubmenu: handleToggleSubmenu, // Sử dụng hàm toggle từ component cha
  isActive,
  startTransition,
  endTransition,
});
</script>

<style scoped>

</style>