<template>
  <modal
    :title="!id ? 'Thêm mới thương hiệu sản phẩm' : 'Cập nhật thương hiệu sản phẩm'"
    @close="emits('close')"
  >
    <template #body>
      <div class="col-sm-12 p-3">
        <div class="row">
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label
                for="name"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 required"
                >Tiêu đề
              </label>
            </div>
            <InputText
              v-model="brand.name"
              placeholder="Nhập tiêu đề"
              :errorMessage="errors?.name"
            />
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="code" class="form-label required">Mã </label>
            </div>
            <InputText
              v-model="brand.code"
              placeholder="Nhập mã"
              :disabled="true"
              :errorMessage="errors?.code"
            />
          </div>
          <div class="col-sm-12 row mb-3">
            <div class="col-sm-8 mb-3">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >Hình ảnh</label
              >
              <FileInput v-model="brand.image" />
            </div>
            <div class="col-sm-4 d-flex py-1 justify-center">
              <img :src="brand.image" loading="lazy" class="h-[75px] rounded-sm" />
            </div>
          </div>
          <div class="col-sm-6 mb-3">
            <input
              class="form-check-input me-2"
              type="checkbox"
              id="not_use"
              v-model="brand.notUse"
            />
            <label for="not_use" class="">Ngưng sử dụng</label>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-end w-full gap-3 mt-6">
        <Button class="btn btn-secondary" @click="emits('close')" variant="outline"> Đóng </Button>
        <Button @click="save()">Lưu lại</Button>
      </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useBrandStore } from '@/stores/product'
import { errorMessage, successMessage } from '@/helpers/toast'
import { removeVietnameseTones, textCode } from '@/services/utils'
import { resizeImage, createSlug } from '@/helpers/helpers'
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

const brandStore = useBrandStore()

const newBrand = reactive({
  id: null,
  name: '',
  code: '',
  image: '',
  notUse: false,
})

const brand = computed<any>(() =>
  props.id && brandStore.$state.entry ? brandStore.$state.entry : newBrand,
)

const errors = ref<any>(null)

const productImage = (event: any) => {
  // Reference to the DOM input element
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e: any) => {
      brand.value.image = await resizeImage(e.target.result, file.type, null, null, 250)
    }
    reader.readAsDataURL(file)
  }
  const fileInput = document.getElementById('formFile') as HTMLInputElement
  fileInput.value = ''
}

const save = async () => {
  if (brand.value.id == null) {
    await brandStore
      .create(brand.value)
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
    await brandStore
      .update(props.id, brand.value)
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

watch(
  () => brand.value.name,
  (value) => {
    brand.value.code = value ? createSlug(value) : ''
  },
)
onBeforeMount(() => {
  if (props.id) {
    brandStore.show(props.id)
  }
})
</script>
<style lang="scss"></style>
