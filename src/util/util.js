
/**
 * @desc 防抖
 * @param {Function} func 	节流执行方法
 * @param {Number} [wait=200] 	节流时间
 * @return 
 */
const debounce = (func, wait = 200) => {
	let timeout;
	return function (event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.call(this, event);
		}, wait);
	};
}


/**
 * @desc 节流
 * @param {Function} cb 	回调函数
 * @param {Number} [wait] 	执行时间
 * @return 当日期
 */
const throttle = (cb, wait = 1000 / 60) => {
	let last = 0;
	return function () {
		var now = new Date().getTime();;
		if (now - last > wait) {
			cb.call(this);
			last = new Date().getTime();;
		}
	}
}




/**
 * @desc 当日期 (Y-m-d H:i:s)
 * @param {String} [type] 	时间类型
 * @return 当日期
 */
const currentDate = (type = 'ymd') => {
	const date = new Date();
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	let h = date.getHours();
	let i = date.getMinutes();
	let s = date.getSeconds();

	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	i = i < 10 ? '0' + i : i;
	s = s < 10 ? '0' + s : s;

	if (type === 'ymd') {
		return `${y}-${m}-${d}`;
	} else {
		return `${y}-${m}-${d} ${h}:${i}:${s}`;
	}
}


/**
 * @desc 根据菜单名称获取菜单
 * @param {Array} menus 	菜单列表
 * @param {String} name 	菜单名称
 * @return String menu 菜单对象
 */
const getMenuByName = (menus, name, menu = null) => {
	for (let item of menus) {
		if (item.name === name) {
			menu = item
			return menu
		}

		if (item.children) {
			menu = getMenuByName(item.children, name, menu)
		}
	}

	return menu
}


/**
 * @desc 序列化拖拽排序参数
 * @param {Array} list 	排序后列表
 * @param {String} sortKey=id 	排序key值
 * @return Array 排序参数
 */
const formatSortParams = (list, sortKey = 'id') => {
	let sortParams = [];

	for (let [key, val] of Object.entries(list)) {
		sortParams.push({ [sortKey]: val[sortKey], sort: Number(key) + 1 });
	}

	return sortParams
}




/**
 * @desc 多长时间
 * @param {Date} datatime 	时间
 * @return {String} 多长时间
 */
export const dateDiff = (datatime, type = null) => {
	if (!datatime) return '未知';


	let dateTimeStamp = new Date(datatime).getTime()

	let minute = 1000 * 60;
	let hour = minute * 60;
	let day = hour * 24;

	let month = day * 30;
	let year = month * 12;
	let now = new Date().getTime();
	let diffValue = now - dateTimeStamp;
	let result = ""

	let sign = diffValue > 0 ? true : false;

	diffValue = Math.abs(diffValue);

	let monthC = diffValue / month;
	let weekC = diffValue / (7 * day);
	let dayC = diffValue / day;
	let hourC = diffValue / hour;
	let minC = diffValue / minute;
	let yearC = diffValue / year;

	if (type === 'day') {
		if (dayC >= 1) {
			result = "" + parseInt(dayC) + "天";
		} else if (hourC >= 1) {
			result = "" + parseInt(hourC) + "小时";
		} else if (minC >= 1) {
			result = "" + parseInt(minC) + "分钟";
		} else {
			return "刚刚";
		}
	} else {
		if (yearC >= 1) {
			result = "" + parseInt(yearC) + "年";
		} else if (monthC >= 1) {
			result = "" + parseInt(monthC) + "月";
		} else if (weekC >= 1) {
			result = "" + parseInt(weekC) + "周";
		} else if (dayC >= 1) {
			result = "" + parseInt(dayC) + "天";
		} else if (hourC >= 1) {
			result = "" + parseInt(hourC) + "小时";
		} else if (minC >= 1) {
			result = "" + parseInt(minC) + "分钟";
		} else {
			return "刚刚";
		}
	}

	return result + (sign ? "前" : "后");
}


/**
 * @desc 多少天前
 * @param {Date} datatime 	时间
 * @return {String} 多少天前
 */
export const dayDiff = (datatime) => {
	return dateDiff(datatime, 'day');
}

export default { currentDate, getMenuByName, formatSortParams, dateDiff, dayDiff, debounce, throttle }
