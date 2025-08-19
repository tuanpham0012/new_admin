<template>
  <modal
    :title="!id ? 'Thêm mới danh  mục sản phẩm' : 'Cập nhật danh  mục sản phẩm'"
    modal-size="modal-lg"
    @close="
      () => {
        emits('close')
      }
    "
  >
    <template #body>
      <div class="col-sm-12 p-3">
        <div class="row">
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="name" class="form-label required">Mã danh mục</label>
            </div>
            <InputText
              v-model="category.code"
              placeholder="Nhập mã danh mục"
              :errorMessage="errors?.Code"
            >
            </InputText>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="name" class="form-label required">Tên danh mục</label>
            </div>
            <InputText
              v-model="category.name"
              placeholder="Nhập tên danh mục"
              :errorMessage="errors?.Name"
            >
            </InputText>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="parentId" class="form-label required">Danh mục cha</label>
            </div>
            <div class="input-group">
              <select-base class="form-select" id="parentId" v-model="category.parentId">
                <option :value="-1">Chọn danh mục cha</option>
                <SelectTree v-for="(item, index) in categories" :entry="item" />
              </select-base>
            </div>
            <Feedback :errors="errors?.parentId" />
          </div>
          <div class="grid grid-cols-12 gap-3 justify-between items-center mb-3">
            <div class="col-span-8">
              <label for="formFile" class="form-label">Hình ảnh</label>
              <FileInput v-model="category.image" />
            </div>
            <div class="col-span-4">
              <img
                :src="category.image"
                class="w-auto h-[100%] max-h-[85px] object-contain"
                loading="lazy"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 justify-between items-center mb-3">
            <div>
              <input class="me-2" type="checkbox" id="notUse" v-model="category.notUse" />
              <label for="notUse" class="">Ngưng sử dụng</label>
            </div>
            <div>
              <input
                class="form-check-input me-2"
                type="checkbox"
                id="hidenMenu"
                v-model="category.hidenMenu"
              />
              <label for="hidenMenu" class="">Ẩn khỏi menu</label>
            </div>
            <div>
              <input
                class="form-check-input me-2"
                type="checkbox"
                id="popular"
                v-model="category.isPopular"
              />
              <label for="popular" class="">Danh mục phổ biến</label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>  
        <Button variant="outline" @click="emits('close')"> Đóng </Button>
        <Button variant="primary" @click="save()">Lưu lại</Button>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch, onBeforeMount, type ComputedRef } from 'vue'
import { useCategoryStore } from '@/stores/product'
import { successMessage } from '@/helpers/toast'
import { textCode } from '@/helpers/helpers'
import InputText from '@/components/input-form/InputText.vue'
import FileInput from '@/components/input-form/FileInput.vue'
import Button from '@/components/ui/Button.vue'
const props = defineProps({
  id: {
    type: [Number, String as () => string | null],
    required: false,
    default: null,
  },
})

const emits = defineEmits(['close'])

const categoryStore = useCategoryStore()

const newCategory = reactive({
  id: null,
  name: '',
  code: '',
  lft: 0,
  parentId: -1,
  image: '',
  isPopular: false,
  hidenMenu: false,
  notUse: false,
})

const category = computed(() =>
  props.id && categoryStore.$state.entry ? categoryStore.$state.entry : newCategory,
)

const categories: ComputedRef<any> = computed(() => {
  return categoryStore.$state.listTree.data
})

const errors = ref<any>(null)

const uploadImage = (event: any) => {
  // Reference to the DOM input element
  const { files } = event.target
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const img: any = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx: any = canvas.getContext('2d')

          const maxSize = 450
          let width = img.width
          let height = img.height

          if (img.height > img.width) {
            height = maxSize
            width = (img.width / img.height) * height
          } else {
            width = maxSize
            height = (img.height / img.width) * width
          }
          // Set kích thước mong muốn
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          console.log(typeof canvas.toDataURL(file.type))

          category.value.image = canvas.toDataURL(file.type)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  const fileInput = document.getElementById('formFile') as HTMLInputElement
  fileInput.value = ''
}

watch(
  () => category.value.code,
  async (value) => {
    if (value) {
      category.value.code = textCode(value)
    }
  },
)

const save = async () => {
  if (category.value.id == null) {
    await categoryStore
      .create(category.value)
      .then((res) => {
        console.log(res)
        successMessage(res.data?.message ?? 'Thêm mới thành công!')
        emits('close', res.data.data)
      })
      .catch((err) => {
        console.log(err)
        errors.value = err.response.data.errors
      })
  } else {
    await categoryStore
      .update(props.id, category.value)
      .then((res) => {
        successMessage(res.data?.message ?? 'Cập nhật thành công!')
        emits('close', true)
      })
      .catch((err) => {
        console.log(err)
        errors.value = err.response.data.errors
      })
  }
}
onBeforeMount(async () => {
  if (props.id) {
    await categoryStore.show(props.id)
  }
  await categoryStore.getListTree({ notUse: false })
})
</script>
<style lang=""></style>
