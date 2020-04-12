import jsforce from 'jsforce';

const CLIENT_ID =
    '3MVG9n_HvETGhr3Bp2TP0lUhBaOTAOuCH9OKmjFKsspVG.z8WOx0Vb94skZ8d4wHTVuMf5DArbdwCb05yIAT5';
const PROXY_URL = 'https://lwc-soql-builder-proxy.herokuapp.com/';
const ACCESS_TOKEN_KEY = 'lsb.accessToken';
const INSTANCE_URL_KEY = 'lsb.instanceUrl';

class Salseforce {
    constructor() {
        this.locationOrigin = window.location.origin;
    }

    init() {
        jsforce.browser.init({
            clientId: CLIENT_ID,
            redirectUri: `${this.locationOrigin}/`,
            proxyUrl: `${PROXY_URL}proxy/`
        });
        jsforce.browser.on('connect', connection => {
            localStorage.setItem(ACCESS_TOKEN_KEY, connection.accessToken);
            localStorage.setItem(INSTANCE_URL_KEY, connection.instanceUrl);
            this.connection = connection;
        });
        jsforce.browser.on('disconnect', () => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(INSTANCE_URL_KEY);
        });

        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const instanceUrl = localStorage.getItem(INSTANCE_URL_KEY);

        if (accessToken && instanceUrl) {
            this.connection = new jsforce.Connection({
                accessToken,
                instanceUrl,
                version: '48.0',
                proxyUrl: `${PROXY_URL}proxy/`
            });
        }
    }

    logout() {
        this.connection = null;
        jsforce.browser.logout();
    }

    login(loginUrl) {
        jsforce.browser.login({ loginUrl }, () => {
            window.location.reload();
        });
    }

    isLoggedIn() {
        return !!(this.connection && this.connection.accessToken);
    }
}

export default new Salseforce();
