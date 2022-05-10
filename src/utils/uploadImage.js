import {AlertHelper} from './AlertHelper';
import {mngmtHttp} from './http/Http';

export async function uploadImage(media, type, id, postUpload) {
  try {
    const formBody = new FormData();
    media.forEach(image => {
      formBody.append('image[]', {
        name: image.filename || 'image.jpg',
        type: image.mime || 'image/jpeg',
        uri: image.path,
      });
    });
    formBody.append('model_type', type);
    formBody.append('model_id', parseInt(id));
    await mngmtHttp.post('/images/multiple', formBody).then(() => {
      postUpload();
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      AlertHelper.showMessage('error', error.response.data.message);
    }
  }
}
