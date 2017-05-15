
var Util = require('./Util.jsx');

var HTTP = {
	/**
	 * 原生jsonp方法
	 * @param  {string}   url      请求地址url
	 * @param  {function}   successCallBack 成功回调函数
     * @param  {function}   failCallBack    失败回调函数
	 * @return {void}              无
	 */
    jsonp: function (url, successCallBack, failCallBack) {
        var callbackFunctionName = 'jsonp' +  Date.parse(new Date());
        url = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback' + '=' + callbackFunctionName;
        var s = document.createElement('script');
        window[callbackFunctionName] = function (response) {
            s.parentNode.removeChild(s);
            delete window[callbackFunctionName];
            successCallBack && successCallBack(response);
        };
        s.onerror = function () {
            s.parentNode.removeChild(s);
            delete window[callbackFunctionName];
            failCallBack && failCallBack({
                ret: '-1',
                msg: 'error'
            });
        };
        s.src = url;
        s.type = 'text/javascript';
        document.body.appendChild(s);
    },


    getAjaxOptions: function (options) {
        options = (options) ? options : {};
        var defaultOptions = {
            method: 'get',
            url: '',
            data: {},
            async: true,
            success: function(){},
            error: function(){},
            timeout: 10000
        };
        var newOptions = Util.extend(defaultOptions, options);
        return newOptions;
    },

    /**
     * Ajax请求
     * @param  {object}   options 可选参数
     * {
     *     method: 'get',
     *     url: '',
     *     data: {},
     *     async: true,
     *     success: function(){},
     *     error: function(){},
     *     timeout: 10000
     * }
     * @return {void}            无
     */
    ajax: function (options) {
        var newOptions = this.getAjaxOptions(options);
        var xhr = null;                           // XMLHttpRequest || ActiveXObject请求方式
        var xdr = null;                           // XDomainRequest请求方式
        var timeoutId;                            // 请求超时id
        var url = newOptions.url;                 // 请求url地址
        var async = newOptions.async;             // 请求是否异步请求，默认为true
        var method = newOptions.method;           // 请求方法get||post
        var timeoutTime = newOptions.timeout;     // 请求超时时间
        var data = newOptions.data;               // 请求json数据
        var successFunc = newOptions.success;     // 请求成功回调函数
        var errorFunc = newOptions.error;         // 请求错误回调函数
        var successResult = {                     // 设置默认请求成功返回文案
            ret: '0',
            data: '',
            msg: 'success'
        };
        var errorResult = {                       // 设置默认请求出错返回文案
            ret: '-1',
            msg: '请求出错'
        };

        // 1、创建超时计时器
        timeoutId = setTimeout(function(){
            if (xdr) {
                xdr.abort();
            }else if (xhr) {
                xhr.abort();
            }
            errorResult = {
                ret: '-1',
                msg: '请求超时'
            };
            errorFunc(errorResult);
        }, timeoutTime);

        // 2、处理请求数据
        if (data instanceof Object) {
            var str = "";
            for (var k in data) {
                str += k + "=" + encodeURIComponent(data[k]) + "&";
            }
            data = str;
        }

        // 3、创建HttpRquest请求对象
        if (window.XDomainRequest) {
            xdr = new XDomainRequest();
            if (xdr) {
                // 3.1 设置onerror回调函数
                xdr.onerror = function () {
                    errorResult = {
                        ret: '-2',
                        msg: 'XDomainRequest is on error!!'
                    };
                    errorFunc(errorResult);
                };
                // 3.1 设置onload回调函数
                xdr.onload = function () {
                    if (timeoutId) {
                       clearTimeout(timeoutId);
                    }
                    successResult = {                     // 设置默认请求成功返回文案
                        ret: '0',
                        data: xdr.responseText,
                        msg: 'success'
                    };
                    successFunc(successResult);
                };
                // 3.3 发送请求
                if ("get" === method.toLowerCase()) {
                    if (data === null || data === "") {
                        xdr.open("get", url);
                    } else {
                        xdr.open("get", url + "?" + data);
                    }
                    xdr.send();
                } else if ("post" == method.toLowerCase()) {
                    xdr.open("post", url);
                    xdr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
                    xdr.send(data);
                }
            } else {
                errorResult = {
                    ret: '-3',
                    msg: 'XDomainRequest请求对象创建失败'
                };
                errorFunc(errorResult);
            }
        } else {
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                errorResult = {
                    ret: '-4',
                    msg: '请求对象创建失败-不知如何创建'
                };
                errorFunc(errorResult);
            }
    
            xhr.onreadystatechange = function (e) {
                if (4 === xhr.readyState) {
                    if (200 === xhr.status) {
                        if (timeoutId) {
                           clearTimeout(timeoutId);
                        }
                        successResult = {                     // 设置默认请求成功返回文案
                            ret: '0',
                            data: xhr.responseText,
                            msg: 'success'
                        };
                        successFunc(successResult);
                    } else if (404 == xhr.status) {
                        errorResult = {
                            ret: '-5',
                            msg: '404-找不到页面'
                        };
                        errorFunc(errorResult);
                    } else if (500 == xhr.status) {
                        errorResult = {
                            ret: '-5',
                            msg: '500-服务器内部错误'
                        };
                        errorFunc(errorResult);
                    }
                }
            };
    
            if ("get" === method.toLowerCase()) {
                if (data === null || data === "") {
                    xhr.open("get", url, async);
                } else {
                    xhr.open("get", url + "?" + data, async);
                }
                xhr.send(null);
            } else if ("post" === method.toLowerCase()) {
                xhr.open("post", url, async);
                xhr.setRequestHeader("content-Type", "application/x-www-form-urlencoded");
                xhr.send(data);
            }
        }
    }
};


module.exports = HTTP;