/**
 * client components
 */
import Pagination from "@/components/pagination/Pagination.vue";
import Modal from "@/components/modals/BaseModal.vue";
import SelectSearch from "@/components/input-form/SelectSearch.vue";
import SelectTree from "@/components/input-form/SelectTree.vue";
import SelectSearchUser from "@/components/input-form/SelectSearchUser.vue";
import InputSearch from "@/components/input-form/InputSearch.vue";
import SelectSearchApi from "@/components/input-form/SelectSearchApi.vue";
import Feedback from "@/components/input-form/Feedback.vue";
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import Button from '@/components/ui/Button.vue'
import InputText from '@/components/input-form/InputText.vue';
import InputGroup from '@/components/input-form/InputGroup.vue';
import SelectBase from '@/components/input-form/SelectBase.vue';

/** end register component */

/** end register component */

const globalComponent: Record<string, any> = {
    Pagination,
    Modal,
    Feedback,
    SelectSearch,
    SelectTree,
    SelectSearchUser,
    InputSearch,
    SelectSearchApi,
    AdminLayout,
    PageBreadcrumb,
    Button,
    InputText,
    InputGroup,
    SelectBase
};
export default globalComponent;
