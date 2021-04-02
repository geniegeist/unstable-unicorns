import BACK from './UU-Back-Main.png';

const ImageLoader = {
    count: () => {
        return require.context('./square', true).keys().length;
    },
    load: (key: string) => {
        if (key === "back") {
            return BACK;
        }
        return require(`./square/${key}.png`).default;
    }
};

export default ImageLoader;