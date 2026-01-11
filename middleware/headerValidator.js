import CryptoJS from 'crypto-js';
import localizify from 'localizify';
import Validator from 'Validator';
import GLOBALS from '../app_config/constants.js';
import CODES from '../app_config/status_code.js';
import jwt from "jsonwebtoken";
// import adminDeviceinfo from '../models/admindevice.js';
import en from '../languages/en.js';
import gu from '../languages/gu.js';

const { t } = localizify;

const local = localizify;

const middleware = {};

const ENC_KEY = process.env.API_ENC_KEY;
const ENC_IV = process.env.API_ENC_IV;

const key = CryptoJS.enc.Utf8.parse(ENC_KEY);
const iv = CryptoJS.enc.Utf8.parse(ENC_IV);

const bypassMethod = [
    'signup',
    'otp-verify',
    'verify-email',
    'login',
    'admin_login',
    'contact-us',
    'categories',
    'products',
    'products-by-category',
    'product-detail',
    'products',
    'upload-static-files',
    'list-static-files'
];

const bypassApiKey = [
    'login',
    'upload-static-files'
];


const extractHeaderLanguage = async (req, res, next) => {
    try {
        const language = req.headers["accept-language"] || "en";
        if (language === 'gu') {
            req.language = gu;
        } else {
            req.language = en;
        }
        next();
    } catch (error) {
        console.error('Language extraction error:', error);
        req.language = en;
        next();
    }
}

const validateHeaderApiKey = async (req, res, next) => {
    try {
        const pathData = req.path.split('/');
        if (bypassApiKey.indexOf(pathData[4]) === -1) {
            const apiKey = req.headers['api-key'] || '';
            const API_KEY = GLOBALS.API_KEY;
            const lang = req.language || en;

            if (apiKey) {
                const decryptedApiKey = decData(apiKey);
                if (decryptedApiKey === API_KEY) {
                    return next();
                } else {
                    return middleware.sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_invalid_api_key'), null);
                }
            } else {
                return sendApiResponse(res, CODES.UNAUTHORIZED, lang['rest_keywords_apikey_not_found'], null);
            }
        } else {
            return next();
        }
    } catch (error) {
        console.error(error.message);
        return sendApiResponse(res, CODES.UNAUTHORIZED, error.message, null);
    }
};

const validateHeaderToken = async (req, res, next) => {
    try {
        const pathData = req.path.split('/');
        const lang = req.language || en;

        if (bypassMethod.includes(pathData[pathData.length - 1])) {
            return next();
        }

        const token = req.headers["token"]?.replace("Bearer ", "");
        if (!token) {
            return middleware.sendApiResponse(res, CODES.UNAUTHORIZED, t('rest_keywords_token_not_found'), null);
        }
        const decoded = jwt.verify(token, GLOBALS.JWT_SECRET);
        if (decoded.type == "admin") {
            req.user = { adminId: decoded.adminId, type: 'admin' };
            console.log('Set req.user:', req.user);
            return next();
        }
        console.log('Set req.user:', req.user);
        next();
    } catch (error) {
        console.log('JWT verification error:', error.message);
        return middleware.sendApiResponse(
            res,
            CODES.UNAUTHORIZED,
            t('rest_keywords_tokeninvalid'),
            null
        );
    }
};


const checkValidationRules = (request, rules) => {
    try {
        const v = Validator.make(request, rules);
        const validator = {
            status: true,
        };
        if (v.fails()) {
            const ValidatorErrors = v.getErrors();
            validator.status = false;
            for (const key in ValidatorErrors) {
                validator.error = ValidatorErrors[key][0];
                break;
            }
        }
        return validator;
    } catch (error) {
        console.log(error.message);
    }
    return false;
};

const sendApiResponse = async (res, resCode, msgKey, resData) => {
    local.add('en', en).add('gu', gu).setLocale(res.req?.language === 'gu' ? 'gu' : 'en');
    const message = t(msgKey) || msgKey;
    const responsejson = {
        code: resCode,
        message: message,
    };
    if (resData != null) {
        responsejson.data = resData;
    }
    const statusCode = resCode === CODES.UNAUTHORIZED ? 401 : 200;
    const response = await encryptionAsync(responsejson);
    res.status(statusCode).json(response);
};

const getMessage = async (requestLanguage, keywords, components) => {
    local.add('en', en).setLocale('en');
    return t(keywords, components);
};

// common decryption
const decryption = async (req, res, next) => {
    if (req.body && Object.keys(req.body).length != 0) {
        console.log(req.body);
        try {
            const decrypted = CryptoJS.AES.decrypt(req.body, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
            req.body = JSON.parse(decryptedData);
        } catch (error) {
            console.log("Error parsing decrypted data:", error);
        }
        next();
    } else {
        next();
    }
};

// common encryption
const encryption = (req, callback) => {
    try {
        if (typeof req === "object") {
            req = JSON.stringify(req);
        }
        const encrypted = CryptoJS.AES.encrypt(req, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        callback(encrypted);
    } catch (error) {
        console.log("Encryption error:- ", error.message);
        callback({ req });
    }
};

// async encryption
const encryptionAsync = async (data) => {
    try {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        return CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
    } catch (error) {
        console.log("Encryption error:- ", error.message);
        return data;
    }
};


// decryption
const decData = (encryptedData) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        console.error("Error during decryption:", error);
        throw new Error('Failed to decrypt the API key');
    }
};

// encryption
const encData = (data) => {
    try {
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }

        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        return encrypted;
    } catch (error) {
        console.log("Encryption error:- ", error.message);
        return {};
    }
};

const sendResponse = (req, res, statuscode, responsecode, responsemessage, response_data) => {
    getMessage(req.lang, responsemessage.keyword, responsemessage.components, function (formedmsg) {
        if (response_data != null) {
            response_data = { code: responsecode, message: formedmsg, data: response_data };
            encryption(response_data, function (response) {
                res.status(statuscode);
                res.json(response);
            });
        } else {
            response_data = { code: responsecode, message: formedmsg };
            encryption(response_data, function (response) {
                res.status(statuscode);
                res.json(response);
            });
        }
    });
};


middleware.sendApiResponse = sendApiResponse;

export default {
    validateHeaderApiKey,
    validateHeaderToken,
    checkValidationRules,
    sendResponse,
    decryption,
    encryption,
    getMessage,
    sendApiResponse,
    extractHeaderLanguage,
    encData
};
