<template>
  <div
    class="w-100 d-flex col-lg-12 m-1 pe-4 flex-wrap justify-content-center justify-content-sm-between"
  >
    <div class="d-none d-lg-flex align-items-center min-w-[500px] justify-start">
      <div class="d-flex w-[150px]">
        <label for="currenPage" class="col-form-label w-[75px]">SL hiển thị</label>
        <div class="">
          <select
            class="form-select form-select-sm"
            data-placeholder="Select an option"
            v-model="pageSize"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <!-- <option :value="100">100</option>
            <option :value="150">150</option> -->
          </select>
        </div>
      </div>
      <div class="d-flex w-[250px]">
        <label for="currenPage" class="col-form-label"
          >Hiển thị
          {{ (currentPage - 1) * pageSize + 1 }}
          -
          {{
            (currentPage - 1) * pageSize + pageSize > props.totalCount
              ? props.totalCount
              : (currentPage - 1) * pageSize + pageSize
          }}
          / {{ props.totalCount }} bản ghi.</label
        >
      </div>
    </div>
    <div class="d-flex gap-2 flex-wrap">
      <div>
        <ul class="pagination pagination-outline align-items-center pt-3 me-5">
          <li
            class="page-item previous"
            v-if="props.currentPage > 1"
            @click.prevent="changePage((currentPage -= 1))"
          >
            <a href="#" class="page-link"
              ><i class="bx bxs-chevrons-left bx-fade-left-hover"></i
            ></a>
          </li>
          <li
            class="page-item"
            v-for="(page, index) in pageView(props.totalPages)"
            :key="index"
            :class="{
              active: page == props.currentPage,
              disabled: typeof page == 'string',
            }"
            @click.prevent="changePage(page)"
          >
            <a href="#" class="page-link">{{ page }}</a>
          </li>
          <li
            class="page-item next"
            v-if="props.currentPage < props.totalPages"
            @click.prevent="changePage((currentPage += 1))"
          >
            <a href="#" class="page-link"
              ><i class="bx bxs-chevrons-right bx-fade-right-hover"></i
            ></a>
          </li>
        </ul>
      </div>
      <div class="d-flex g-3 align-items-center max-w-[175px]">
        <div class="max-w-[100px] pe-2">
          <label for="toPage" class="col-form-label">Tới trang</label>
        </div>
        <div class="p-0 max-w-[50px]">
          <input type="text" class="form-control" @keypress="filter($event)" :value="currentPage" />
        </div>
      </div>
    </div>
  </div>

  <div class="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <button
        @click.prevent="changePage((currentPage -= 1))"
        class="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        :class="{'disabled' : props.currentPage <= 1}"
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
        <li
          v-for="(page, index) in pageView(props.totalPages)"
          :key="index"
          :class="{
            'active bg-brand-500/[0.08] text-brand-500': page == props.currentPage,
            disabled: typeof page == 'string',
          }"
          @click.prevent="changePage(page)"
        >
          <a
            href="#"
            class="text-theme-sm hover:bg-brand-500/[0.08] hover:text-brand-500 dark:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium"
          >
            {{ page }}
          </a>
        </li>
      </ul>

      <button
        @click.prevent="changePage((currentPage += 1))"
        class="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        :class="{'disabled bg-gray-600' : props.currentPage < props.totalPages}"
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
</template>

<script setup>
import { watch, ref } from 'vue'
import debounce from 'lodash.debounce'

const props = defineProps({
  // pagination: {
  //     type: Object,
  //     default: { current_page: 1, total_pages: 1, per_page: 30, total: 0 },
  // },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: [Number],
    default: 30,
  },
  totalCount: {
    type: Number,
    default: 1,
  },
})

const pageSize = ref(props.pageSize)
const currentPage = ref(props.currentPage)

const emits = defineEmits(['change-page'])

const changePage = (page) => {
  console.log('changePage')

  if (page < 1) {
    return
  }
  if (page > props.totalPages) {
    return
  }
  // currentPage.value = page;
  emits('change-page', {
    currentPage: page,
    totalPages: props.totalPages,
    pageSize: pageSize.value,
    totalCount: props.totalCount,
  })
}

watch(
  () => pageSize.value,
  (newValue, oldValue) => {
    changePage(1)
  },
)

watch(
  () => props.currentPage,
  (newValue, oldValue) => {
    currentPage.value = newValue
  },
)

watch(
  () => currentPage.value,
  debounce((newValue, oldValue) => {
    if (newValue >= props.totalPages) {
      currentPage.value = props.totalPages
    }
    // if(oldValue != newValue)
    //   changePage(currentPage.value);
  }, 400),
)

const pageView = (totalPages, delta = 1) => {
  const truncate = true
  const curPage = parseInt(props.currentPage)

  const range = delta + 4 // use for handle visible number of links left side

  let render = []
  let renderTwoSide = []
  let dot = '...'
  let countTruncate = 0 // use for ellipsis - truncate left side or right side

  // use for truncate two side
  const numberTruncateLeft = curPage - delta
  const numberTruncateRight = curPage + delta

  for (let pos = 1; pos <= totalPages; pos++) {
    // truncate
    if (totalPages >= 2 * range - 1 && truncate) {
      if (numberTruncateLeft > 3 && numberTruncateRight < totalPages - 3 + 1) {
        // truncate 2 side
        if (pos >= numberTruncateLeft && pos <= numberTruncateRight) {
          renderTwoSide.push(pos)
        }
      } else {
        // truncate left side or right side
        if (
          (curPage < range && pos <= range) ||
          (curPage > totalPages - range && pos >= totalPages - range + 1) ||
          pos === totalPages ||
          pos === 1
        ) {
          render.push(pos)
        } else {
          countTruncate++
          if (countTruncate === 1) render.push(dot)
        }
      }
    } else {
      // not truncate
      render.push(pos)
    }
  }
  if (renderTwoSide.length > 0) {
    return [1, dot, ...renderTwoSide, dot, totalPages]
  } else {
    return render
  }
}

const filter = (evt) => {
  evt = evt ? evt : window.event
  var charCode = evt.which ? evt.which : evt.keyCode
  if (charCode == 13 && currentPage.value != props.pagination.current_page) {
    changePage(currentPage.value)
  }
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault()
  } else {
    return true
  }
}
</script>
<style lang="scss" scoped>
.active,
.disabled {
  pointer-events: none;
}

label {
  &.col-form-label {
    font-size: 12px;
  }
}

input {
  &.form-control {
    font-size: 12px;
  }
}

li {
  &.page-item {
    padding: 0 !important;
    a {
      &.page-link {
        font-size: 12px;
        // width: 2rem !important;
        min-width: 2rem !important;
        height: 2rem !important;
      }
    }
  }
}
</style>
