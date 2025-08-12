<template>
  <modal
    :title="!id ? 'Thêm mới khách hàng' : 'Cập nhật khách hàng'"
    modal-size="modal-lg"
    @close="emits('close')"
  >
    <template #body>
      <div class="col-sm-12">
        <div class="row">
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="email" class="form-label required">Họ tên</label>
            </div>
            <InputText
              v-model="customer.name"
              placeholder="Nhập họ tên"
              :errorMessage="errors?.Name"
            >
              <i class="fa-solid fa-user"></i>
            </InputText>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="email" class="form-label required">Email</label>
            </div>
            <InputText
              type="email"
              v-model="customer.email"
              placeholder="Nhập email"
              :errorMessage="errors?.Email"
            >
              <i class="fa-solid fa-envelope"></i>
            </InputText>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="phone" class="form-label">Điện thoại</label>
            </div>
            <InputText
              v-model="customer.phone"
              placeholder="Nhập điện thoại"
              :errorMessage="errors?.Phone"
            >
              <i class="fa-solid fa-phone"></i>
            </InputText>
          </div>

          <div class="col-sm-6 mb-3" v-if="!props.id">
            <div class="col-sm-12">
              <label for="password" class="form-label required">Password</label>
            </div>
            <InputText
              :type="showPassword ? 'text' : 'password'"
              v-model="customer.password"
              placeholder="Nhập mật khẩu"
              :errorMessage="errors?.Password"
            >
              <i class="fa-solid fa-lock"></i>
            </InputText>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="gender" class="form-label">Giới tính</label>
            </div>
            <select-base v-model="customer.gender" :errorMessage="errors?.gender">
              <option :value="0">Khác</option>
              <option :value="1">Nam</option>
              <option :value="2">Nữ</option>
            </select-base>
          </div>
          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="gender" class="form-label">Trạng thái</label>
            </div>
            <select-base v-model="customer.status" :errorMessage="errors?.status">
              <option :value="0">Chưa kích hoạt</option>
              <option :value="1">Hoạt động</option>
              <option :value="2">Đã khoá</option>
            </select-base>
          </div>

          <div class="col-sm-12 mb-3">
            <div class="col-sm-2">
              <label for="note" class="form-label">Địa chỉ</label>
            </div>

            <input-group
              v-model="customer.address"
              placeholder="Địa chỉ chi tiết"
              :errorMessage="errors?.Address"
            >
              <i class="fa-solid fa-location-dot"></i>
            </input-group>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" @click="emits('close')"> Đóng </Button>
          <Button size="sm" variant="primary" :onClick="save"> Lưu lại </Button>
        </div>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { errorMessage, successMessage } from '@/helpers/toast'
import InputText from '@/components/input-form/InputText.vue'
import Button from '@/components/ui/Button.vue'
import { removeVietnameseTones} from '@/services/utils'
const props = defineProps({
  id: {
    type: [Number, String as () => string | null],
    required: false,
    default: null,
  },
})

const emits = defineEmits(['close'])

const customerStore = useCustomerStore()

const newCustomer = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  status: 0,
  gender: 0,
})

const customer = computed(() =>
  props.id && customerStore.$state.customer ? customerStore.$state.customer : newCustomer,
)

const errors = ref<any>(null)

const showPassword = ref<Boolean>(false)

const save = async () => {
  console.log('customer', customer.value)
  if (customer.value.id == null) {
    await customerStore
      .create(customer.value)
      .then((res) => {
        console.log(res)
        successMessage(res.data?.message ?? 'Thêm mới thành công!')
        emits('close', true)
      })
      .catch((err) => {
        console.log(err)
        errors.value = err.response.data.errors
      })
  } else {
    await customerStore
      .update(props.id, customer.value)
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
  () => customer.value.password,
  (newValue) => {
    customer.value.password = removeVietnameseTones(newValue)
  },
)
onBeforeMount(() => {
  if (props.id) {
    customerStore.show(props.id)
  }
})
</script>
<style lang=""></style>
