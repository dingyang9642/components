function Carousel(containerId, dotContainerId) {
    this.container = $new('#' + containerId);
    this.dotContainer = $new('#' + dotContainerId);
    this.allImgElements = $new('#' + containerId + ' a');
    this.allDotElements = $new('#' + dotContainerId + ' li');
    this.intervalTimer = null;
    this.interval = 3000;
    this.currentHighLigthIndex = 0;
    this.dotClickControl = 1;
    this.init();
}
Carousel.prototype = {
    init: function() {
        var self = this;
        self.allImgElements.hide();               // 隐藏所有图片元素
        self.allImgElements.eq(0).fadeIn('fast'); // 展示第一张元素
        if (self.allImgElements.length > 1) {
            self.allDotElements.eq(0).addClass('dot-hightlight');
            self.intervalTimer = setInterval(function() {
                self.intervalFun();
            }, self.interval);
            self.hoverFun();
            self.handleDotClickFun();
        } else {
            self.dotContainer.hide();
        }
    },
    intervalFun: function() {
        var self = this;
        var nextHighLigthIndex = self.currentHighLigthIndex + 1;
        if (nextHighLigthIndex > (self.allImgElements.length - 1)){
            nextHighLigthIndex = 0;
        }
        var currentHighLigthElement = self.allImgElements.eq(self.currentHighLigthIndex);
        var nextHighLigthElement = self.allImgElements.eq(nextHighLigthIndex);
        currentHighLigthElement.css('z-index', '2');
        nextHighLigthElement.css('z-index', '1');
        nextHighLigthElement.show();
        currentHighLigthElement.fadeOut('slow');
        self.allDotElements.removeClass('dot-hightlight');
        self.allDotElements.eq(nextHighLigthIndex).addClass('dot-hightlight');
        self.currentHighLigthIndex = nextHighLigthIndex;
    },
    hoverFun: function() {
        var self = this;
        self.dotContainer.hover(
            function() {
                if (self.intervalTimer) {
                    clearInterval(self.intervalTimer);
                }
            },
            function() {
                self.intervalTimer = setInterval(function() {
                    self.intervalFun();
                }, self.interval);
        });
    },
    handleDotClickFun: function() {
        var self = this;
        self.allDotElements.click(function() {
            var clickDotIndex = self.allDotElements.index(this);
            if (clickDotIndex !== self.currentHighLigthIndex && self.dotClickControl === 1) {
                self.dotClickControl = 0;
                self.allImgElements.eq(self.currentHighLigthIndex).css('z-index', '2');
                self.allImgElements.eq(clickDotIndex).css('z-index', '1');
                self.allImgElements.eq(clickDotIndex).show();
                self.allImgElements.eq(self.currentHighLigthIndex).fadeOut('slow', function() {
                    self.dotClickControl = 1;
                });
                self.allDotElements.removeClass('dot-hightlight');
                self.allDotElements.eq(clickDotIndex).addClass('dot-hightlight');
                self.currentHighLigthIndex = clickDotIndex;
            }
        });
    }
};
module.exports = Carousel;
