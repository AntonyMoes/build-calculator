export interface Preset {
    name: string,
    location: string
}

export const presets: Preset[] = [
    {
        name: "HSR",
        location: "/src/assets/hsr/config.json"
    }
]