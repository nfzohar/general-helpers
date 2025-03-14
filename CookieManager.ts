const envStorageKey = import.meta.env.VITE_API_BASE_URL || 'main_store';

export default class CookieManager {
    constructor(storageKey: string = '') {
        this._localStorageKey = storageKey || envStorageKey;
        this._localStorageObject = this.getLocalStorageByKey();
    }

    getLocalStorageByKey(storageKey = '') {
        let dataFromStore = localStorage.getItem(
            storageKey || this._localStorageKey,
        );

        if (dataFromStore) {
            return JSON.parse(dataFromStore);
        }

        this._localStorageObject = {};
        this.setLocalStorageByKey();
        return this._localStorageObject;
    }

    setLocalStorageByKey(storageKey = '') {
        localStorage.setItem(
            storageKey || this._localStorageKey,
            JSON.stringify(this._localStorageObject),
        );
    }

    get(key: string) {
        return this._localStorageObject[key] ?? null;
    }

    set(key: string, value: any) {
        this._localStorageObject[key] = value;
        this.setLocalStorageByKey();
    }

    clear() {
        localStorage.removeItem(this._localStorageKey);
        this._localStorageObject = {};
    }
}
