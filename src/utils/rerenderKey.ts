import {ref} from "vue";

export function getRerenderKey() {
    const key = ref(0);
    const rerender = () => {
        key.value++;
    }

    return { key, rerender}
}