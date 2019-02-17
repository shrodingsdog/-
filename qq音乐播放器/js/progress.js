(function(window) {
	function Progress($progressBar, $progressLine, $progressDot) {
		return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
	}
	Progress.prototype = {
		constructor: Progress,
		init: function($progressBar, $progressLine, $progressDot) {
			this.$progressBar = $progressBar;
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		isMove: false,
		//进度条点击方法
		progressClick: function(callBack) {
			var $this = this; //progress触发的this
			//监听背景的点击
			this.$progressBar.click(function(event) {
				//获取背景距离窗口的位置
				var normalLeft = $(this).offset().left;
				//获取点击的位置距离窗口的位置
				var eventLeft = event.pageX;
				//设置前景的宽度
				$this.$progressLine.css("width", eventLeft - normalLeft);
				$this.$progressDot.css("left", eventLeft - normalLeft);
				//计算进度条的比例
				var value = (eventLeft - normalLeft) / $(this).width();
				callBack(value);
			});
		},
		//进度条移动方法
		progressMove: function(callBack) {
			var $this = this;
			//获取背景距离窗口的位置
			var normalLeft = this.$progressBar.offset().left;
			var eventLeft;
			var value;
			var barWidth = this.$progressBar.width();
			//监听鼠标的按下事件,只有按下移动才有效
			this.$progressBar.mousedown(function(event) {
				$this.isMove = true;
				eventLeft = event.pageX;
				//监听鼠标的移动事件
				$(document).mousemove(function(event) {
					//获取点击的位置距离窗口的位置
					eventLeft = event.pageX;
					var offset = eventLeft - normalLeft;
					if(offset >= 0 && offset <= barWidth) {
						//设置前景的宽度
						$this.$progressLine.css("width", eventLeft - normalLeft);
						$this.$progressDot.css("left", eventLeft - normalLeft);
					}
				});
				//监听鼠标的抬起事件
				$(document).mouseup(function() {
					//改进老师的方法，处理如果点击了抬起之后文档还继续响应以及一次进入响应的bug
					$(document).off("mousemove").off("mouseup").off("mousedown");
					$this.isMove = false;
					//计算进度条的比例
					value = (eventLeft - normalLeft) / $this.$progressBar.width();
					callBack(value);
				});
			});

		},
		setProgress: function(value) {
			if(this.isMove) return;
			if(value < 0 || value > 100) return;
			this.$progressLine.css({
				width: value + "%"
			});
			this.$progressDot.css({
				left: value + "%"
			});
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);