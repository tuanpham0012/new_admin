<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch, type ComputedRef } from 'vue'
import { useCategoryStore } from '../../stores/product'
import debounce from 'lodash.debounce'
import CategoryModal from './CategoryModal.vue'
import { confirmAlert, successMessage, errorMessage } from '@/helpers/toast'
import TableCategoryRow from './TableCategoryRow.vue'
import ScrollTable from '@/components/tables/ScrollTable.vue'

const categoryStore = useCategoryStore()
const query = reactive({
  notUse: null,
})
const showModal = ref(false)
const id = ref(null)
const currentPageTitle = ref('Danh mục')
const categories: ComputedRef<any> = computed(() => {
  return categoryStore.$state.listTree.data
})
const toggleModal = (refresh = false) => {
  showModal.value = !showModal.value
  getListData()
}
const toggleEdit = (value: any) => {
  id.value = value
  toggleModal()
}

const toggleCreate = () => {
  id.value = null
  toggleModal()
}

const toggleDelete = (id: any) => {
  confirmAlert({
    title: 'Xoá dữ  liệu?',
    text: 'Xác nhận xoá dữ  liệu!!!',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('deleting...')
      categoryStore
        .delete(id)
        .then((res) => {
          successMessage(res.data?.message ?? 'Xoá dữ  liệu thành công!')
          getListData()
        })
        .catch((err) => errorMessage(err.response.data.title))
    }
  })
}

const getListData = async () => {
  await categoryStore.getListTree(query)
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
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách khách hàng
          </h3>
        </div>
        <div class="flex gap-3">
          <button
            class="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Export
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.667 13.3333V15.4166C16.667 16.1069 16.1074 16.6666 15.417 16.6666H4.58295C3.89259 16.6666 3.33295 16.1069 3.33295 15.4166V13.3333M10.0013 13.3333L10.0013 3.33325M6.14547 9.47942L9.99951 13.331L13.8538 9.47942"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
          <button
            @click="toggleCreate()"
            class="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          >
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
          </button>
        </div>
      </div>
      <div class="border-b border-gray-200 px-5 py-2 dark:border-gray-800">
        <div class="flex gap-3 justify-start"></div>
      </div>
      <ScrollTable class="mx-1 my-2">
        <thead class="table-light">
          <tr>
            <th class="px-5 py-2 text-left bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900">Hình ảnh</th>
            <th class="px-5 py-2 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-900">Tên</th>
            <th class="px-5 py-2 bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900 text-right">SL sản phẩm</th>
            <th class="px-5 py-2 bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900 text-center">Trạng thái</th>
            <th class="px-5 py-2 text-center bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900">Danh mục phổ biến</th>
            <th class="px-5 py-2 text-left bg-gray-50 w-3/24 sm:px-6 dark:bg-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody class="table-border-bottom-0">
          <TableCategoryRow
            v-for="(item, index) in categories"
            :key="index"
            :entry="item"
            @toggle-edit="toggleEdit"
            @toggle-delete="toggleDelete"
          />
        </tbody>
      </ScrollTable>
      <!-- <Pagination
      :current-page="currenPage"
      :page-size="pageSize"
      :total-pages="totalPages"
      :total-count="totalCount"
      @change-page="changePage"
    /> -->
    </div>
    <CategoryModal v-if="showModal" :id="id" @close="toggleModal" />
  </admin-layout>
</template>

<style lang="scss" scoped>
.table-scroll {
  height: calc(100vh - 330px);
}
</style>
