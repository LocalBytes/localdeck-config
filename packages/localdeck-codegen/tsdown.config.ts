import {defineConfig} from "tsdown/config";

export default defineConfig({
    dts: true,
    entry: ["./src/**/*.ts"],
    exports: true,
    sourcemap: true,
});
