(function(window) {
	function Player($audio) {
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		constructor: Player,
		musicList: [],
		init: function($audio) {
			this.$audio = $audio;
			this.audio = $audio.get(0);
		},
		currentIndex: -1,
		playMusic: function(index, music) {
			//判断是否是同一首音乐
			if(this.currentIndex == index) {
				//同一首音乐
				if(this.audio.paused) {
					this.audio.play();
				} else {
					this.audio.pause();
				}
			} else {
				//不是同一首
				this.$audio.attr("src", music.link_url);
				this.audio.play();
				this.currentIndex = index;
			}
		},
		preIndex: function() {
			var index = this.currentIndex - 1;
			if(index < 0) {
				index = this.musicList.length - 1;
			}
			return index;
		},
		nextIndex: function() {
			var index = this.currentIndex + 1;
			if(index > this.musicList.length - 1) {
				index = 0;
			}
			return index;
		},
		changeMusic: function(index) {
			//删除对应的数据
			this.musicList.splice(index, 1);

			//判断当前删除的音乐是否是正在播放的音乐前面的音乐
			if(index < this.currentIndex) {
				this.currentIndex = this.currentIndex - 1;
			}
		},
		musicTimeUpdate: function(callBack) {
			var $this = this;
			$this.$audio.on("timeupdate", function() {
				var duration = $this.audio.duration;
				var currentTime = $this.audio.currentTime;
				var timeStr = $this.formatDate(currentTime, duration);
				callBack(currentTime,duration,timeStr);
			});
		},
		formatDate: function(currentTime, duration) {
			var endMIn = parseInt(duration / 60);
			var endSec = parseInt(duration % 60);
			if(endMIn < 10) {
				endMIn = "0" + endMIn;
			}
			if(endSec < 10) {
				endSec = "0" + endSec;
			}

			var startMIn = parseInt(currentTime / 60);
			var startSec = parseInt(currentTime % 60);
			if(startMIn < 10) {
				startMIn = "0" + startMIn;
			}
			if(startSec < 10) {
				startSec = "0" + startSec;
			}
			return startMIn + ":" + startSec + " / " + endMIn + ":" + endSec;
		},
		musicSeekTo: function (value){
			//判断如果没有音乐播放或者未导入音乐禁止设置进度
			if(isNaN(this.audio.duration * value)) return;
			this.audio.currentTime = this.audio.duration * value;
		},
		musicVoiceSeekTo: function (value){
			if(isNaN(value)) return;
			if(value < 0 || value > 1) return;
			//0 - 1 ,1声音最大，0最小
			this.audio.volume = value;
		}

	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;
})(window);