<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useMenuStore } from '../../stores/menu'
import debounce from 'lodash.debounce'
import MenuModal from './MenuModal.vue'
import TableMenuRow from './TableMenuRow.vue'
import { confirmAlert, successMessage, errorMessage } from '@/helpers/toast'
import ScrollTable from '@/components/tables/ScrollTable.vue'
import Button from '@/components/ui/Button.vue'
const menuStore = useMenuStore()
const query = reactive({
  type: 0,
})
const currentPageTitle = ref('Danh sách menu')
const showModal = ref(false)
const id = ref(null)
interface MenuItem {
  id: number
  title: string
  icon: string
  url: string
  hidden: boolean
}

const menus = computed<MenuItem[]>(() => menuStore.$state.entries.data)

const toggleModal = (refresh = false) => {
  showModal.value = !showModal.value
  if (refresh) getListData()
}
const toggleEdit = (value: any) => {
  console.log(value)

  id.value = value
  toggleModal()
}

const toggleCreate = () => {
  id.value = null
  toggleModal()
}

watch(
  () => query.type,
  () => {
    getListData()
  },
)

const getListData = async () => {
  await menuStore.getList(query)
}

onBeforeMount(async () => {
  await getListData()
})
</script>
<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div
      class="flex flex-col h-[calc(100vh-164px)] rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-2 sm:flex-row sm:items-center dark:border-gray-800"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách menu</h3>
        </div>

        <div class="flex items-center content-center gap-3">
          <select-base v-model="query.type">
            <option :value="0">Admin</option>
            <option :value="1">Người dùng</option>
          </select-base>

          <Button size="sm" variant="primary" @click="toggleCreate()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 10.0002H15.0006M10.0002 5V15.0006"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Thêm mới
          </Button>
        </div>
      </div>

      <ScrollTable class="mx-1 my-2">
        <thead class="table-light">
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th
              class="sticky left-0 px-5 py-2 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-900"
            >
              <p class="text-theme-medium font-bold text-gray-800 dark:text-gray-200">Tên</p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">Icon</th>
            <th class="px-5 py-2 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-900">Path</th>
            <th class="px-5 py-2 text-left bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900">
              Trạng thái
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <TableMenuRow
            v-for="(item, index) in menus"
            :key="index"
            :menu="item"
            :depth="0"
            @toggle-edit="toggleEdit"
          />
        </tbody>
      </ScrollTable>
    </div>
    <MenuModal v-if="showModal" :id="id" :type="query.type" @close="toggleModal" />
  </admin-layout>
</template>

<style lang="scss" scoped>
.table-scroll {
  height: calc(100vh - 330px);
}
</style>
