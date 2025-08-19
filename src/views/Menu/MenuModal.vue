<template>
  <modal
    :title="!id ? 'Thêm mới danh mục' : 'Cập nhật danh mục'"
    modal-size="modal-lg"
    @close="
      () => {
        emits('close')
      }
    "
  >
    <template #body>
      <div class="col-sm-12">
        <div>
          <div class="mb-3">
            <label for="name" class="required">Danh mục cha</label>
            <select-base v-model="menu.parentId">
              <TreeSelect v-for="(menu, index) in menus" :menu="menu" :depth="0" />
            </select-base>
          </div>

          <div class="mb-3">
            <label for="title" class="required">Tên danh mục</label>
            <InputText
              type="text"
              id="title"
              v-model="menu.title"
              placeholder="Nhập tên danh mục"
            />
          </div>
          <div class="mb-3">
            <div class="col-sm-12">
              <label for="icon" class="me-2">Icon</label>
              <a
                href="https://fontawesome.com/v6/search?o=r&m=free"
                class="text-cyan-500 fs-6"
                target="_blank"
                >Tra cứu</a
              >
            </div>
            <div class="grid grid-cols-12 gap-3 items-center">
              <div class="col-span-10">
                <InputText type="text" id="icon" v-model="menu.icon" />
              </div>
              <div class="col-span-2 text-center text-3xl" v-html="menu.icon"></div>
            </div>
          </div>

          <div class="col-sm-6 mb-3">
            <div class="col-sm-12">
              <label for="url" class="form-label">Đường dẫn</label>
            </div>
            <div class="input-group">
              <InputText
                type="text"
                :disabled="menu.groupMenu"
                id="url"
                v-model="menu.url"
                placeholder="Nhập đường dẫn"
              />
            </div>
            <Feedback :errors="errors?.url" />
          </div>

          <div class="grid grid-cols-2 my-5">
            <div>
              <input class="me-1" type="checkbox" v-model="menu.hidden" id="defaultCheck1" />
              <label class="form-check-label" for="defaultCheck1"> Không hiển thị </label>
            </div>
            <div>
              <input class="me-1" type="checkbox" v-model="menu.groupMenu" id="groupMenu" />
              <label class="form-check-label" for="groupMenu"> Nhóm Danh Mục </label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <Button variant="primary" @click="save()">Lưu lại</Button>
      <Button variant="outline" @click="emits('close')"> Đóng </Button>
    </template>
  </modal>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { successMessage } from '@/helpers/toast'
import TreeSelect from './TreeSelect.vue'
import Button from '@/components/ui/Button.vue'
const props = defineProps({
  id: {
    type: [Number, String as () => string | null],
    required: false,
    default: null,
  },
})

const emits = defineEmits(['close'])

const menuStore = useMenuStore()

const newMenu = reactive({
  id: null,
  title: '',
  url: '',
  icon: '',
  parentId: 2,
  position: 1,
  hidden: false,
  groupMenu: false,
})

const menu = computed(() => (props.id && menuStore.$state.menu ? menuStore.$state.menu : newMenu))

const menus = computed(() => menuStore.$state.entries.data)

const errors = ref<any>(null)

watch(
  () => menu.value.groupMenu,
  (newValue) => {
    if (newValue) {
      menu.value.url = ''
      menu.value.position = 0
    }
  },
)

const save = async () => {
  if (menu.value.id == null) {
    await menuStore
      .create(menu.value)
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
    await menuStore
      .update(props.id, menu.value)
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
onBeforeMount(() => {
  if (props.id) {
    menuStore.show(props.id)
  }
})
</script>
<style lang=""></style>
