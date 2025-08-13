<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useBrandStore } from '../../stores/product'
import debounce from 'lodash.debounce'
import BrandModal from './BrandModal.vue'
import { confirmAlert, successMessage, errorMessage } from '@/helpers/toast'
import ScrollTable from '@/components/tables/ScrollTable.vue'

const brandStore = useBrandStore()
const query = reactive({
  pageSize: 25,
  search: '',
  page: 1,
  notUse: null,
})
const currentPageTitle = ref('Thương hiệu')
const showModal = ref(false)
const id = ref(null)
const brands = computed<any>(() => {
  return brandStore.$state.entries.data
})
const currenPage = computed(() => {
  return brandStore.$state.entries.meta?.currentPage ?? query.page
})
const pageSize = computed(() => {
  return brandStore.$state.entries.meta?.pageSize ?? query.pageSize
})
const totalPages = computed(() => {
  return brandStore.$state.entries.meta?.totalPages ?? 1
})
const totalCount = computed(() => {
  return brandStore.$state.entries.meta?.totalCount ?? 1
})
const changePage = async (value: any) => {
  console.log(value)

  query.pageSize = value.pageSize
  query.page = value.currentPage
  await getListData()
}
const toggleModal = (refresh = false) => {
  showModal.value = !showModal.value
  if (refresh) getListData()
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
    title: 'Xoá bản ghi?',
    text: 'Xác nhận xoá bản ghi này!!!',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('deleting...')
      brandStore
        .delete(id)
        .then((res) => {
          successMessage(res.data?.message ?? 'Xoá bản ghi thành công!')
          if (brands.value.length <= 1 && currenPage.value > 1) {
            query.page -= 1
          }
          getListData()
        })
        .catch((err) => errorMessage(err.response.data.title))
    }
  })
}

watch(
  () => query.search,
  debounce(() => {
    query.page = 1
    getListData()
  }, 500),
)

watch(
  () => query.notUse,
  () => {
    getListData()
  },
)

const getListData = async () => {
  await brandStore.getList(query)
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
            Danh sách thương hiệu
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
        <div class="flex gap-3 justify-start">
          <div class="relative">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              v-model="query.search"
              class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/70"
              wfd-id="id1"
            />
          </div>
          <div class="relative">
            <select-base v-model="query.notUse">
              <option :value="null">Chọn trạng thái</option>
              <option :value="true">Ngưng sử dụng</option>
              <option :value="false">Sử dụng</option>
            </select-base>
          </div>
        </div>
      </div>
      <ScrollTable class="mx-1 my-2">
        <thead class="table-light">
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th
              class="sticky left-0 px-5 py-2 text-left bg-gray-50 w-1/24 sm:px-6 dark:bg-gray-900"
            >
              <p class="text-theme-medium font-bold text-gray-800 dark:text-gray-200">STT</p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Mã thương hiệu
              </p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Tên thương hiệu
              </p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">Hình ảnh</p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Trạng thái
              </p>
            </th>
            <!--
            THAY ĐỔI 3: Thêm `sticky top-0` và `right-0` để cố định cột cuối cùng.
          -->
            <th class="px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">Actions</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, index) in brands"
            :key="index"
            class="border-t border-gray-200 dark:border-gray-600"
          >
            <td
              class="sticky left-0 px-5 py-2 bg-white sm:px-6 dark:bg-white/[0.01] dark:text-gray-200"
            >
              <strong class="text-align">{{ index + 1 }}</strong>
            </td>
            <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
              
              <p class="m-0 text-break overflow-hidden truncate" :title="item.address">
                {{ item.code }}
              </p>
            </td>
            <td class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200">
              {{ item.name }}
            </td>
            <td class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200">
              <img class="h-11 w-11 object-contain" :src="item.image" />
            </td>
            <td class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200">
              {{ item.status }}
            </td>
            <!--
            THAY ĐỔI 5: Cố định cột Actions khi cuộn ngang.
            Thêm `sticky right-0` và background.
          -->
            <td class="px-5 py-2 bg-white sm:px-6 dark:bg-white/[0.01]">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-lg bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-gray-300 transition hover:bg-gray-50 hover:scale-105 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                  @click="toggleEdit(item.id)"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  class="inline-flex items-center gap-2 rounded-lg bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-gray-300 transition hover:bg-gray-50 hover:scale-105 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </ScrollTable>
      <Pagination
        :current-page="currenPage"
        :page-size="pageSize"
        :total-pages="totalPages"
        :total-count="totalCount"
        @change-page="changePage"
      />
    </div>
    <BrandModal v-if="showModal" :id="id" @close="toggleModal" />
  </admin-layout>
</template>

<style lang="scss" scoped>

</style>
