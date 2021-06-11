/*
* Crypto module
* Use for encrypt-decrypt data
*
*/

import CryptoJS from 'crypto-js'

class CryptoModule {

    constructor() {
        this.key = CryptoJS.enc.Latin1.parse('hVmYq3t6w9z$C&E)');
        this.iv = CryptoJS.enc.Latin1.parse('hVmYq3t6w9z$C&E)');
        this.padding = CryptoJS.pad.ZeroPadding;
        this.mode = CryptoJS.mode.CBC;
        this.utf8 = CryptoJS.enc.Utf8;
    }

    encrypt(data) {
        try {
            return CryptoJS.AES.encrypt(data, this.key, {
                iv: this.iv,
                mode: this.mode,
                padding: this.padding
            }).toString();
        } catch (e) {
            return e;
        }
    }

    decrypt(data) {
        try {
            return CryptoJS.AES.decrypt(data, this.key, {iv: this.iv, padding: this.padding}).toString(this.utf8);

        } catch (e) {
            return e;
        }
    }
}

export default CryptoModule;