
function RandomNumBoth(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}

var a = function () {
	setInterval(function () {
		$(".gif img").each(function (index, value) {
			$(this).css({
				transform: "scale(1." + RandomNumBoth(0, 3) + RandomNumBoth(0, 9) + ")",
			});
		});
	}, 100);
};
var b = function () {
	$("audio")
		.get(0)
		.addEventListener(
			"play",
			function () {
				$("body").addClass("play");
			},
			false
		);
	$("audio")
		.get(0)
		.addEventListener(
			"pause",
			function () {
				$("body").removeClass("play");
			},
			false
		);
};
var c = function () {
	$(".background, .lingtang, body").click(function () {
		document.getElementById('fileInput').click();
		$("audio").get(0).play();
	});
};
var d = function () {
	if ($("html").width() < 1600 || $("html").height() < 900) {

	}
};


var e = function () {
	function snow() {
		//1、定义一片雪花模板
		var flake = $("<div>")
			.css({
				position: "fixed",
				color: "#fff",
			})
			.html("😆");

		//获取页面的宽度，利用这个数来算出，雪花开始时left的值
		var documentWidth = $(document).width();

		//获取页面的高度 相当于雪花下落结束时Y轴的位置
		var documentHieght = $(document).height();

		//定义生成一片雪花的毫秒数
		var millisec = 100;
		//2、设置第一个定时器，周期性定时器，每隔一段时间（millisec）生成一片雪花；
		setInterval(function () {
			//随机生成雪花下落 开始 时left的值，相当于开始时X轴的位置
			var startLeft = Math.random() * documentWidth;

			//随机生成雪花下落 结束 时left的值，相当于结束时X轴的位置
			var endLeft = Math.random() * documentWidth;

			//随机生成雪花大小
			var flakeSize = 5 + 30 * Math.random();

			//随机生成雪花下落持续时间
			var durationTime = 4000 + 7000 * Math.random();

			//随机生成雪花下落 开始 时的透明度
			var startOpacity = 1;

			//随机生成雪花下落 结束 时的透明度
			var endOpacity = 0.2 + 0.2 * Math.random();

			//3、克隆一个雪花模板,定义雪花的初始样式，拼接到页面中
			flake
				.clone()
				.appendTo($("body"))
				.css({
					left: startLeft,
					opacity: startOpacity,
					"font-size": flakeSize,
					top: "-50px",
				})
				.animate(
					{
						//执行动画
						left: endLeft,
						opacity: endOpacity,
						top: documentHieght,
					},
					durationTime,
					function () {
						//4、当雪花落下后，删除雪花。
						$(this).remove();
					}
				);
		}, millisec);
	}
	snow();
};

a();
b();
c();
d();
e();

window.resizeTo(100, 230);
