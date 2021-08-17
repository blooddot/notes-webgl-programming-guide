var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getWebGLContext, initShaders } from '../libs/cuon-utils.js';
export const loadFile = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield fetch(url).then(response => response.text());
    return content;
});
export const loadJson = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield fetch(url).then(response => response.json());
    return obj;
});
export const loadGLSL = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [
        loadFile(`${name}.vs`),
        loadFile(`${name}.fs`),
    ];
    const [vertex, fragment] = yield Promise.all(promises);
    return { vertex, fragment };
});
export const initWebGL = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const { vertex, fragment } = yield loadGLSL(name);
    const canvas = document.getElementById("webgl");
    canvas.setAttribute("width", document.body.clientWidth.toString());
    canvas.setAttribute("height", document.body.clientHeight.toString());
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return null;
    }
    const program = initShaders(gl, vertex, fragment);
    if (!program) {
        console.error('Failed to initialize shaders.');
        return null;
    }
    return { gl, program, canvas };
});