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
  status: null,
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
  await customerStore.getList(query)
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
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800"
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
          <a
            href="add-product.html"
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
            Add Product
          </a>
        </div>
      </div>
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div class="flex gap-3 sm:justify-between">
          <div class="relative flex-1 sm:flex-auto">
            <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                ></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              v-model="query.search"
              class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden sm:w-[300px] sm:min-w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              wfd-id="id1"
            />
          </div>
          <div class="relative flex-1 sm:flex-auto">
            <select
              class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              v-model="query.status"
            >
              <option selected :value="null">Chọn trạng thái</option>
              <option selected :value="0">Chưa kích hoạt</option>
              <option selected :value="1">Hoạt động</option>
              <option selected :value="2">Đã khoá</option>
            </select>
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
      <ScrollTable>
        <thead class="table-light">
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left bg-gray-50 w-1/24 sm:px-6 dark:bg-gray-800">
              <p class="text-theme-medium font-bold text-gray-800 dark:text-gray-400">STT</p>
            </th>
            <th class="px-5 py-3 text-left bg-gray-50 w-7/24 sm:px-6 dark:bg-gray-800">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-400">
                Khách hàng
              </p>
            </th>
            <th class="px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-800">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-400">
                Điện thoại
              </p>
            </th>
            <th class="px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-800">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-400">Email</p>
            </th>
            <th class="px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-800">
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-400">
                Trạng thái
              </p>
            </th>
            <!--
            THAY ĐỔI 3: Thêm `sticky top-0` và `right-0` để cố định cột cuối cùng.
          -->
            <th
              class="sticky top-0 right-0 z-10 px-5 py-3 text-left bg-gray-50 w-4/24 sm:px-6 dark:bg-gray-800"
            >
              <p class="text-theme-medium font-medium text-gray-800 dark:text-gray-400">Actions</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(item, index) in customers"
            :key="index"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <!--
            THAY ĐỔI 4: Cố định cột STT khi cuộn ngang.
            Thêm `sticky left-0` và background để không bị trong suốt.
          -->
            <td class="sticky left-0 px-5 py-4 bg-white sm:px-6 dark:bg-white/[0.03]">
              <strong>{{ index + 1 }}</strong>
            </td>
            <td class="px-5 py-4 sm:px-6 max-w-[500px]">
              <strong>{{ item.name }}</strong>
              <p class="m-0 text-break overflow-hidden truncate" :title="item.address">
                <i class="bx bxs-map bx-xs"></i>{{ item.address }}
              </p>
            </td>
            <td class="px-5 py-4 sm:px-6">{{ item.phone }}</td>
            <td class="px-5 py-4 sm:px-6">{{ item.email }}</td>
            <td v-html="statusTag(item.status)"></td>
            <!--
            THAY ĐỔI 5: Cố định cột Actions khi cuộn ngang.
            Thêm `sticky right-0` và background.
          -->
            <td class="sticky right-0 px-5 py-4 bg-white sm:px-6 dark:bg-white/[0.03]">
              <button
                type="button"
                class="btn btn-sm btn-icon btn-outline-primary me-1"
                @click="toggleEdit(item.id)"
              >
                <span class="tf-icons bx bx-edit-alt bx-xs"></span>
              </button>
              <button
                type="button"
                class="btn btn-sm btn-icon btn-outline-secondary me-1"
                @click="toggleDelete(item.id)"
              >
                <span class="tf-icons bx bx-trash-alt bx-xs"></span>
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-lg bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs ring-1 ring-gray-300 transition hover:bg-gray-50 hover:scale-105 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
              >
                <span class="tf-icons bx bx-trash-alt bx-xs"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </ScrollTable>
      <div class="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <button
            class="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                fill=""
              ></path>
            </svg>

            <span class="hidden sm:inline"> Previous </span>
          </button>

          <span class="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
            Page 1 of 10
          </span>

          <ul class="hidden items-center gap-0.5 sm:flex">
            <li>
              <a
                href="#"
                class="bg-brand-500/[0.08] text-theme-sm text-brand-500 hover:bg-brand-500/[0.08] hover:text-brand-500 dark:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium"
              >
                1
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                2
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                3
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                ...
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                8
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                9
              </a>
            </li>

            <li>
              <a
                href="#"
                class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium text-gray-700 dark:text-gray-400"
              >
                10
              </a>
            </li>
          </ul>

          <button
            class="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <span class="hidden sm:inline"> Next </span>

            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                fill=""
              ></path>
            </svg>
          </button>
        </div>
      </div>
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
