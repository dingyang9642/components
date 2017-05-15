(function(){
        function ShowItem(options) {
        	this.$app = $new(options.itemId);
        	this.tpl = ['<div class="display-item-default title-square-group">',
        					'<div class="item-title item-default-title"></div>',
        					'<div class="item-square item-default-square"></div>',
        				'</div>',
                        '<div class="item-slide-mask"></div>',
        				'<div class="display-item-slide">',
        					'<div class="item-slide-body">',
            					'<div class="item-slide-switch title-square-group">',
                					'<div class="item-title item-slide-title"></div>',
                    				'<div class="item-square item-slide-square"></div>',
                        		'</div>',
                        		'<p class="item-des"></p>',
                    		'</div>',
                    	'</div>'].join('')
        	this.$app.append(this.tpl);
            this.$app.find('.item-title').text(options.title);
            this.$app.find('.item-slide-title').text(options.title);
            this.$app.find('.item-des').text(options.des);
            this.itemHeight = this.$app.height();//项目高度
            this.time = 500;//slide时间
            this.showMask(options.itemId);
            //通过jq设置样式避免使用c3特性;
            this.$app.find('.display-item-default').css('marginTop',-this.$app.find('.display-item-default').height()/2); 
            this.$app.find('.item-slide-body').css('marginTop',-this.$app.find('.item-slide-body').height()/2); 
            this.$app.find('.display-item-slide,.item-slide-mask').css('bottom',-this.itemHeight);
        }
        ShowItem.prototype.showMask = function(id) {
            var _self = this;
            $new(id).mouseenter(function() {
                _self.$app.find('.item-slide-switch').css('visibility','visible').end()
                          .find('.display-item-default').css('visibility','hidden')
                $new(this).find('.display-item-slide,.item-slide-mask').stop(true).animate({bottom: 0},_self.time,'linear')
            }).mouseleave(function(){
                _self.$app.find('.item-slide-switch').css('visibility','hidden').end()
                          .find('.display-item-default').css('visibility','visible')
            	$new(this).find('.display-item-slide,.item-slide-mask').stop(true).animate({bottom: -_self.itemHeight},_self.time,'linear')
            })
        }
        module.exports = ShowItem;
})();