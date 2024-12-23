import {ref} from "vue";

export function optional<T>(valueInitializer: T, defaultValue: T | undefined = undefined) {
    const toggle = ref(defaultValue !== undefined);
    const value = ref<T>();
    value.value = defaultValue !== undefined ? defaultValue : valueInitializer;

    return {toggle, value};
}

export function fromOptional<T>(toggle: boolean, value: T): T | undefined {
    return toggle ? value : undefined;
}
