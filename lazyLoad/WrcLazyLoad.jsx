(function() {
    var Util = {
        /**
         * 验证是否为有效字符串
         * @param  {string} string 需要判断的数据类型
         * @return {boolean} 如果为有效字符串返回true;否则返回false;
         */
        isvalidString: function (string) {
            if (typeof string !== 'string' && string !== '') {
                return false;
            }
            return true;
        },
        
        /**
         * 文案调试输出
         * @param  {object} param 输出参数
         * @return {void} 无
         */
        consoleSth: function (param) {
            console.log(param);
        },

        /**
         * 获取页面滚动距离
         * @return {int} 距离页面顶部距离
         */
        getBodyScrollTop: function () {
            var scrollTop;
            // pageYOffset指的是滚动条顶部到网页顶部的距离
            if (typeof window.pageYOffset != 'undefined') {
                scrollTop = window.pageYOffset;
            }else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') { 
                scrollTop = document.documentElement.scrollTop;
            }else if (typeof document.body != 'undefined') {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        /**
         * 获取元素距离页面顶部距离
         * @param  {object} obj html元素
         * @return {int} 距离页面顶部距离
         */
        getElementTop: function (obj) {
            var iTop = obj.offsetTop;
            while (obj = obj.offsetParent) {
                iTop += obj.offsetTop;
            }
            return iTop;
        }
    };

    function LazyLoad(className, imgAttribute) {
        // 异常处理
        if (!(Util.isvalidString(className) || Util.isvalidString(imgAttribute))) {
            Util.consoleSth('params error : 参数非法');
            return;
        }
        var self = this;
        // 初始化相关对象属性
        self.init(className, imgAttribute);
        // 添加事件监听
        window.addEventListener('scroll', function(){self.handleScroll();});
    }
    LazyLoad.prototype = {
        init: function (className, imgAttribute) {
            var self = this;
            self.scrollImgs = document.getElementsByClassName(className);
            self.scrollImgAttr = imgAttribute;
            self.setImgStatus(self.scrollImgs, 'loading');
            self.timer = undefined;
            window.setTimeout(function(){self.loadImgs();}, 500);
        },
         
        handleScroll: function () {
            var self = this;
            if (self.timer) {
                window.clearTimeout(self.timer);
            }
            self.timer = window.setTimeout(function(){self.loadImgs();}, 500);
        },

        /**
         * 改变图片加载状态
         * @param {object} ele[s] 支持单一元素或者元素数组状态修改 
         * @param {string} status 状态['loading', 'loaded']
         */
        setImgStatus: function (eles, status) {
            if (eles.length) {
                // 说明传入元素为数组形式
                var elementsLength = eles.length;
                for (var i = 0; i < elementsLength; i++) {
                    eles[i].setAttribute('status', status);
                }
            } else {
                eles.setAttribute('status', status);
            }
        },

        /**
         * 加载图片
         * @return {void} 无
         */
        loadImgs: function () {
            var that = this;
            var bodyHeight = document.documentElement.clientHeight;
	        var bodyScrollTop = Util.getBodyScrollTop();
	        var lazyImgs =  this.scrollImgs;
	        var len = lazyImgs.length;
	        for (var i = 0; i < len; i++) {
                var currentImg = lazyImgs[i];
                // 首先该元素是否已经替换过图片
                var imgStatus = currentImg.getAttribute('status');
                if(imgStatus === 'loaded') {
                    continue;
                }
                // 其次判断是否到达当前可视区域范围内
                var imgTop = Util.getElementTop(lazyImgs[i]) - bodyScrollTop;
                if((imgTop >= 0) && (imgTop <= bodyHeight)) {
                    var newSrc = currentImg.getAttribute(that.scrollImgAttr);
                    currentImg.setAttribute('src', newSrc);
                    that.setImgStatus(currentImg, 'loaded');
               }
	        }
        }
    };

	if (typeof module != 'undefined' && module.exports) {
		module.exports = LazyLoad;
	} else if (typeof define == 'function' && define.amd) {
		define(function() {
			return LazyLoad;
		});
	} else {
		window.LazyLoad = LazyLoad;
	}
})();