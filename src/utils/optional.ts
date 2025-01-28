import {ref} from "vue";

export type Optional<T> = T | null | undefined;

export function optional<T>(valueInitializer: T, defaultValue: T | null | undefined = undefined) {
    const toggle = ref(hasValue(defaultValue));
    const value = ref<T | null | undefined>();
    value.value = hasValue(defaultValue) ? defaultValue : valueInitializer;

    return {toggle, value};
}

export function fromOptional<T>(toggle: boolean, value: T): Optional<T> {
    return toggle ? value : undefined;
}

export function hasValue<T>(possibleValue: Optional<T>): possibleValue is T {
    return possibleValue !== undefined && possibleValue !== null;
}
