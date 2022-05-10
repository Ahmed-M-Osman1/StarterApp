import {Platform} from 'react-native';
import {mngmtHttp} from './http/Http';

export async function uploadFile(file, type, id, postUpload) {
  try {
    const formBody = new FormData();
    formBody.append('image', {
      name: file.name,
      type: file.type,
      uri:
        Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
    });
    formBody.append('model_type', type);
    formBody.append('model_id', parseInt(id));
    await mngmtHttp.post('/images', formBody).then(() => {
      postUpload();
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  }
}
