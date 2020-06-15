import {UPLOAD_PRESET_DEV, CLOUD_NAME_DEV, BASE_URL_DEV} from'./dev';
import {UPLOAD_PRESET_PROD, CLOUD_NAME_PROD, BASE_URL_PROD} from './prod';
var preset;
var cloudName;
var baseUrl;
if (process.env.NODE_ENV !== 'production') {
    preset = UPLOAD_PRESET_DEV;
    cloudName = CLOUD_NAME_DEV;
    baseUrl = BASE_URL_DEV;
}else{
    preset = UPLOAD_PRESET_PROD;
    cloudName = CLOUD_NAME_PROD;
    baseUrl = BASE_URL_PROD;
}
export const UPLOAD_PRESET = preset;
export const CLOUD_NAME = cloudName;
export const BASE_URL = baseUrl;