import type {Config} from "tailwindcss";

const colors = {
    primary: '#152637',
    secondary: '#0090CD',
    info: '#3DBBAA',
}

export default <Config>{
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,vue,md}',
    ],
    plugins: [
        require("rippleui"),
    ],
    theme: {
        fontFamily: {
            'display': ['Poppins', 'sans-serif', '"BabelStone Flags"'],
            'body': ['"Open Sans"', 'sans-serif', '"BabelStone Flags"'],
        },
    }
};
