<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useCustomerStore } from '../../stores/customer'
import debounce from 'lodash.debounce'
import CustomerModal from './CustomerModal.vue'
import { confirmAlert, successMessage, errorMessage } from '@/helpers/toast'
import { BoxIcon } from '@/icons/index'
import ScrollTable from '@/components/tables/ScrollTable.vue'

const currentPageTitle = ref('Khách hàng')
const customerStore = useCustomerStore()
const query = reactive({
  pageSize: 25,
  search: '',
  page: 1,
  status: -1,
})
const showModal = ref(false)
const id = ref(null)
const customers = computed(() => {
  return customerStore.$state.customers.data
})
const currenPage = computed(() => {
  return customerStore.$state.customers.meta?.currentPage ?? query.page
})
const pageSize = computed(() => {
  return customerStore.$state.customers.meta?.pageSize ?? query.pageSize
})
const totalPages = computed(() => {
  return customerStore.$state.customers.meta?.totalPages ?? 1
})
const totalCount = computed(() => {
  return customerStore.$state.customers.meta?.totalCount ?? 1
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
    title: 'Xoá khách hàng?',
    text: 'Xác nhận xoá khách hàng!!!',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('deleting...')
      customerStore
        .delete(id)
        .then((res) => {
          successMessage(res.data?.message ?? 'Xoá khách hàng thành công!')
          if (customers.value.length <= 1 && currenPage.value > 1) {
            query.page -= 1
          }
          getListData()
        })
        .catch((err) => errorMessage('Errorr!!'))
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
  () => query.status,
  () => {
    getListData()
  },
)

const getListData = async () => {

  await customerStore.getList({
    page: query.page,
    pageSize: query.pageSize,
    search: query.search,
    status: query.status == -1 ? null : query.status,
  })
}

const statusTag = (status: number) => {
  switch (status) {
    case 0:
      return '<span class="badge bg-label-warning me-1">Chưa kích hoạt</span>'
    case 1:
      return '<span class="badge bg-label-success me-1">Hoạt động</span>'
    case 2:
      return '<span class="badge bg-label-primary me-1">Đã khoá</span>'
    default:
      break
  }
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
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Track your store's progress to boost your sales.
          </p>
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
              placeholder="Tìm kiếm khách hàng..."
              v-model="query.search"
              class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/70"
              wfd-id="id1"
            />
          </div>
          <div class="relative">
            <select-base v-model="query.status">
              <option selected :value="-1">Chọn trạng thái</option>
              <option selected :value="0">Chưa kích hoạt</option>
              <option selected :value="1">Hoạt động</option>
              <option selected :value="2">Đã khoá</option>
            </select-base>
          </div>
          <div class="relative" x-data="{ showFilter: false }">
            <div
              x-show="showFilter"
              class="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              style="display: none"
            >
              <div class="mb-5">
                <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <input
                  type="text"
                  class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  placeholder="Search category..."
                  wfd-id="id2"
                />
              </div>
              <div class="mb-5">
                <label class="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  placeholder="Search company..."
                  wfd-id="id3"
                />
              </div>
              <button
                class="bg-brand-500 hover:bg-brand-600 h-10 w-full rounded-lg px-3 py-2 text-sm font-medium text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      <ScrollTable class="mx-1 my-2" height="calc(100vh - 330px)">
        <thead class="table-light">
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-2 text-left bg-gray-50 w-1/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-bold text-gray-800 dark:text-gray-200">STT</p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Khách hàng
              </p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Điện thoại
              </p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">Email</p>
            </th>
            <th class="px-5 py-2 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">
                Trạng thái
              </p>
            </th>
            <!--
            THAY ĐỔI 3: Thêm `sticky top-0` và `right-0` để cố định cột cuối cùng.
          -->
            <th
              class="sticky top-0 right-0 z-10 px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-900"
            >
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-200">Actions</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, index) in customers"
            :key="index"
            class="border-t border-gray-200 dark:border-gray-600"
          >
            <td
              class="sticky left-0 px-5 py-2 bg-white sm:px-6 dark:bg-white/[0.01] dark:text-gray-200"
            >
              <strong>{{ index + 1 }}</strong>
            </td>
            <td class="px-5 py-2 sm:px-6 max-w-[500px] dark:bg-white/[0.01] dark:text-gray-200">
              <strong>{{ item.name }}</strong>
              <p class="m-0 text-break overflow-hidden truncate" :title="item.address">
                <i class="bx bxs-map bx-xs"></i>{{ item.address }}
              </p>
            </td>
            <td class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200">
              {{ item.phone }}
            </td>
            <td class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200">
              {{ item.email }}
            </td>
            <td
              class="px-5 py-2 sm:px-6 dark:bg-white/[0.01] dark:text-gray-200"
              v-html="statusTag(item.status)"
            ></td>
            <!--
            THAY ĐỔI 5: Cố định cột Actions khi cuộn ngang.
            Thêm `sticky right-0` và background.
          -->
            <td
              class="px-5 py-2 bg-white sm:px-6 dark:bg-white/[0.01]"
            >
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
    <CustomerModal v-if="showModal" :id="id" @close="toggleModal" />
  </admin-layout>
</template>

<style lang="scss" scoped>
.table-scroll {
  height: calc(100vh - 330px);
}
</style>
