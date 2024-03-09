import { save } from './node_modules/@tauri-apps/api/dialog.js';
import { invoke } from './node_modules/@tauri-apps/api/tauri.js';


let imageType = "image/png";
let quality = 1.0; //image quality (if imageType supports this)

export async function exportCanvasImage() {

    const filePath = await save({
        filters: [{
            name: 'Image',
            extensions: ['png'] //TODO: anpassen (z.B. zu ['png', 'jpeg'] oder ['jpeg'])
        }]
    });

    if(filePath != null) {
        writeCanvasImageAsBinaryData(filePath);
    }

}

function writeCanvasImageAsBinaryData(filePath) {

    document.getElementById("canvas").toBlob((blob) => {
 
        const reader = new FileReader();

        reader.addEventListener("loadend", async function() {  
            const byteArray = new Uint8Array(reader.result);

            invoke("save_image", { path: filePath, img: Array.from(byteArray) }).catch(err => console.error(err));
        });
        
        reader.readAsArrayBuffer(blob);
      
    }, imageType, quality);

}

document.getElementById("export-button").addEventListener('click', () => exportCanvasImage());