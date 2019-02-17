(function(window) {
	function Lyric(path) {
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype = {
		constructor: Lyric,
		musicList: [],
		init: function(path) {
			this.path = path;
		},
		times: [],
		lyrics:[],
		index: -1,
		loadLyric: function (callback){
			var $this = this;
			$.ajax({
			url: $this.path,
			dataType: "text",
			success: function(data) {
				$this.parseLyric(data);
				callback();
			},
			error: function(e) {
				
			}
		});
		},
		parseLyric: function (data){
			var $this = this;
			//清空上一首歌词
			$this.times = [];
			$this.lyrics = [];
			var array = data.split("\n");
			//console.log(array);
			//遍历取出歌词
			//[00:00.10]
			var timeReg = /\[(\d*:\d*\.\d*)\]/;
			//遍历取出歌词
			$.each(array,function(index, ele){
				//处理歌词
				var lrc = ele.split("]")[1];
//				console.log(lrc.length);
				//排除空字符串
				if(lrc.length == 1) return true;
				$this.lyrics.push(lrc);
				var res = timeReg.exec(ele);
				if(res == null) return true;
//				console.log(res);
				var timeStr = res[1];//00:00.10
				var res2 = timeStr.split(":");
				var min = parseInt(res2[0]) * 60;
				var sec = parseFloat(res2[1]);
				var time = parseFloat(Number(min+sec).toFixed(2));
				//console.log(time)
				$this.times.push(time);
			});
//			console.log($this.times);
//			console.log($this.lyrics);
		},
		currentIndex: function (currentTime){
			//console.log(currentTime);
			if(currentTime >= this.times[0]){
				this.index++;
				this.times.shift();//删除数组最前面的一个元素
			}
			return this.index;
		}
	}
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);