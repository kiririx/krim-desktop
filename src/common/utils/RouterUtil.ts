export default class RouterUtil {

    public static push = (url: string, params?: { [key: string]: any }) => {
        let ownerHref = window.location.origin
        if (ownerHref.endsWith("/")) {
            ownerHref = ownerHref.substring(0, ownerHref.length - 1)
        }
        if (params) {

        }
        window.open(ownerHref + url, '_self');

    }

    public static replace = (url: string) => {
    }

    public static getPath = () => {
        // const pathName = window.document.location.hash;
        // return pathName.substring(1, pathName.length);
        return document.location.href.replaceAll(document.location.origin, "")
    }

    public static getParam = (url: string, key: string) : string => {
        url = url.substring(url.indexOf('?') + 1, url.length);
        let val = '';
        url.split("&").forEach(param => {
            if (param.indexOf('=') > -1) {
                const paramGroup: Array<string> = param.split("=");
                if (paramGroup.length == 2) {
                    const _key = paramGroup[0];
                    if (_key == key) {
                        val = paramGroup[1];
                        return val;
                    }
                }
            }
        });
        return val;
    }

}