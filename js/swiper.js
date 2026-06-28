(function (t, e) {
	"use strict";
	if (t) {
		void 0 === t.__proto__ ? (t.SimSwiper = e, SimSwiper) : "undefined" != typeof module ? module.exports = e :
			t.__proto__.SimSwiper = e
	} else {
		JSwiper = e;
	}
})(this, function (el, conf) {
	var ID_VERSION = "ID.VERSION." + new Date().getMilliseconds() + "" + parseInt(Math.random() * 10000);
	var object_contains = function (obj, key) {
		if (!obj || !key) {
			return false;
		} else {
			if (is_object(obj)) {
				return obj[key] !== undefined;
			} else {
				return false;
			}
		}
	}
	var is_document = function (el) {
		return el && (el instanceof Element || el instanceof Document || el instanceof DocumentFragment);
	}
	var set_props = function (el, props, call) {
		if (!el) {
			return;
		} else if (call && typeof call === "function") {
			for (var key in props) {
				if (Object.prototype.hasOwnProperty.call(props, key)) {
					var element = props[key];
					call(el, key, element);
				}
			}
		}
	}

	String.prototype.toNumber = function () {
		if (!this) {
			return null;
		}
		var arr = this.trim().split("");
		var i = 0;
		var len = arr.length;
		var numStr = "";
		var first_tag = true;
		while (i < len) {
			var content = arr[i];
			var isNumber = isNaN(content);
			if (content === "." && first_tag) {
				numStr = numStr + content;
				first_tag = false;
			} else if (!isNumber) {
				numStr = numStr + content;
			}
			i++;
		}
		if (numStr) {
			return Number(numStr)
		}
	}
	var is_json = function (o) {
		try {
			JSON.stringify(o);
			return true;
		} catch (err) {
			return false;
		}
	}
	var is_object = function (obj, check_blank) {
		if (undefined === check_blank) {
			check_blank = false
		}
		try {
			return obj && is_json(obj) && typeof obj === "object" && Reflect.ownKeys(obj).length >= (
				check_blank ? 1 : 0);
		} catch (err) {
			if (err.number === -2146823279) {
				var t = false;
				for (var o in obj) {
					t = true;
					break;
				}
				return t;
			} else {
				return false;
			}
		}
	}
	var str_is_empty = function (str) {
		if (!str || typeof str !== "string") {
			return true;
		}
		return str.trim().length === 0;
	}
	var array_not_empty = function (arr) {
		return (arr && arr.length > 0);
	}
	var is_array = function (arr, check_blank) {
		if (undefined === check_blank) {
			check_blank = false
		}
		return arr && typeof arr === "object" && (check_blank ? array_not_empty(arr) : arr.length !== undefined)
	}
	var is_function = function (f) {
		return f && typeof f === "function";
	}
	var is_str = function (str) {
		if (str_is_empty(str)) {
			return false;
		} else {
			return Object.prototype.toString.call(str) === '[object String]'
		}
	}
	var get_style = function (el, prop) {
		var _el = undefined;
		if (!el) {
			return prop;
		} else if (is_document(el)) {
			_el = el;
		} else {
			_el = el.$el;
		}
		if (!prop) {
			return _el.getBoundingClientRect();
		} else if (prop && typeof prop === "string") {
			_el.getBoundingClientRect()[prop];
		}
	}
	var has_class = function (el, class_name) {
		return el.classList.contains(class_name);
	}
	var is_window = function (e) {
		return e && e === window;
	}

	/**声明响应式 */
	var to_ref = function (target, key, callback) {
		if (!target && !key && typeof key !== "string" && !target[key]) {
			return;
		}
		Object.defineProperty(target, key, {
			set: function (newValue) {
				if (is_function(callback)) {
					callback.call(target, [newValue])
				}
			}
		})
	}
	var $ = function (o, parent) {
		if (parent) {
			root = parent;
			ctx = root.text();
		}
		var _el = undefined;
		if (o === undefined) {
			_el = document.createDocumentFragment();
		} else if (is_document(o)) {
			_el = o;
		} else if (!str_is_empty(o)) {
			var CLASS = /^[.]/g.test(o);
			var ID = /^[#]/g.test(o);
			if (CLASS || ID) {
				var els = document.querySelectorAll(o),
					len = els.length;
				_el = len === 1 ? els[0] : els;
			} else if (/<[a-z]+[1-6]?\b[^>]*>(.*?)|<\/[a-z]+[1-6]?>/g.test(o)) {
				try {
					var parse = new DOMParser().parseFromString(o, "text/html");
					_el = parse.body.firstChild;
				} catch (err) {
					console.error("dom 解析失败", err);
				}
			} else {
				var els = document.querySelectorAll(o);
				if (els) {
					var len = els.length;
					_el = len === 1 ? els[0] : els;
				}
			}
		} else {
			_el = o.$el;
		}
		var g = {
			enableReactModel: false,
			$el: _el,
			events: [],
			id: null,
			setId: function (id) {
				if (id) {
					this.id = id;
				}
			},
			getId: function () {
				return this.id;
			},
			ready: function (call) {
				if (is_function(call)) {
					if (is_window(this.$el)) {
						this.$el.onload = function () {
							call(this.$el);
						}
					} else if (is_document(this.$el)) {
						try {
							this.$el.addEventListener("DOMContentLoaded", function () {
								call(this.$el);
							});
						} catch (err) {
							void (err);
						}
					}
				}
				return undefined;
			},
			has: function (func1, func2) {
				// 判断当前元素是否存在
				if (is_function(func1)) {
					if (is_array(this.$el)) {
						if (this.$el.length > 0) {
							func1.call(this.$el, []);
						} else {
							if (func2 && is_function(func2)) {
								func2.call(this, []);
							}
						}
					} else {
						if (this.$el) {
							func1.call(this.$el, []);
						} else {
							if (func2 && is_function(func2)) {
								func2.call(this, []);
							}
						}
					}
				}
				return this;
			},
			add_attr: function (node, k, v, is_class, id) {
				if (is_class === undefined) {
					is_class = false;
				}
				if (id !== ID_VERSION) {
					throw new Error();
				}
				if (is_document(node)) {
					if (is_class) {
						node.classList.add(v);
					} else {
						node.setAttribute(k, v);
					}
				}
				return undefined;
			},
			eq: function (index) {
				if (!index || index < 0) {
					return this;
				} else {
					this.$el = this.$el[index];
				}
				return this;
			},
			siblings: function (name) {
				var t = this;
				if (str_is_empty(name)) {
					return t;
				}
				var _el = t.$el;
				var CLASS = /^[.]/g.test(name);
				var ID = /^[#]/g.test(name);

				function find_sib(el) {
					var children = el.parentElement.children,
						res = [];
					if (children && children.length) {
						var i = 0,
							len = children.length;
						while (i < len) {
							var element = children[i];
							if (element !== _el) {
								if (name) {
									var type = CLASS ? 0 : (ID ? 1 : -1);
									if (type === -1 && element.tageName.toLocaleLowerCase() === name) {
										res.push(element);
									} else {
										res.push(element);
									}
								} else {
									res.push(element);
								}
							}
							i++;
						}
					}
					return res;
				}
				if (!is_array(_el) && is_document(_el)) {
					t.$el = find_sib(_el);
				}
				return t;
			},
			attr: function (prop) {
				var t = this;
				if (is_object(prop, true)) {
					set_props(this.$el, prop, function (e, k, v) {
						var is_class = k === "class";
						if (is_array(e, true)) {
							e.forEach(function (item) {
								t.add_attr(item, k, v, is_class, ID_VERSION);
							});
						} else {
							t.add_attr(e, k, v, is_class, ID_VERSION)
						}
					});
				}
				return this;
			},
			className: function (id, name, add) {
				if (ID_VERSION !== id) {
					throw new Error("禁止访问");
				}
				if (!name || typeof name !== "string" || name === "") {
					return;
				}
				if (is_array(this.$el, true)) {
					this.$el.forEach(function (item) {
						if (add) {
							this.$el.classList.add(name);
						} else {
							item.classList.remove(name);
						}
					})
				} else if (is_document(this.$el)) {
					if (add) {
						this.$el.classList.add(name);
					} else {
						this.$el.classList.remove(name);
					}
				}
			},
			removeClass: function (name) {
				this.className(ID_VERSION, name, false);
				return this;
			},
			addClass: function (name) {
				this.className(ID_VERSION, name, true);
				return this;
			},
			delay: function (call, time) {
				if (time < 0) {
					call();
					return this;
				}
				var _t = this.$el;
				var node_list = [];
				if (is_document(_t)) {
					node_list.push(_t);
				} else if (is_array(_t)) {
					node_list = _t;
				}
				if (is_function(call)) {
					var t = setTimeout(function () {
						clearTimeout(t);
						node_list.forEach(function (item) {
							call.call(item);
						});
						t = null;
					}, time);
				}
				return this;
			},
			css: function (prop) {
				if (is_object(prop, true)) {
					set_props(this.$el, prop, function (e, k, v) {
						if (is_array(e, true)) {
							e.forEach(function (item) {
								item.style[k] = v;
							});
						} else if (is_document(e)) {
							e.style[k] = v;
						}
					});
					return this;
				} else {
					if (is_str(prop)) {
						return get_style(this.$el)[prop];
					} else {
						console.error('invaild param');
						void (0);
					}
				}
			},
			add: function (node) {
				var _el = this.$el;
				var tag = is_array(_el, true);
				function _push(element, insert_content) {
					if (!insert_content) {
						return;
					}
					if (tag) {
						var i = 0,
							len = element.length;
						for (; i < len; i++) {
							element[i].appendChild(insert_content);
						}
					} else if (is_document(_el)) {
						element.appendChild(insert_content);
					}
				}
				if (is_array(node, true)) {
					var vm = $();
					node.forEach(function (e) {
						vm.add(e);
					});
					_push(this.$el, vm.$el);
				} else if (is_document(node)) {
					_push(this.$el, node);
				} else if (is_object(node) && node.$el !== undefined) {
					_push(this.$el, node.$el);
				} else {
					void (0);
				}
				return this;
			},
			remove: function () {
				var this_el = this.$el;
				if (is_array(this_el, false)) {
					if (this_el.length > 0) {
						var parent = this_el[0].parentNode;
						this_el.forEach(function (item) {
							if (item) {
								parent.removeChild(item);
							}
						});
					}
				} else {
					this_el.parentNode.removeChild(this_el);
				}
				return this;
			},
			clone: function (copy_child) {
				if (undefined === copy_child) {
					copy_child = true;
				}
				if (is_array(this.$el, true)) {
					var arr = [];
					this.$el.forEach(function (e) {
						arr.push(e.cloneNode(copy_child));
					});
					return arr;
				} else if (is_document(this.$el)) {
					return this.$el.cloneNode(copy_child);
				} else {
					return this.$el;
				}
			},
			size: function () {
				if (!this.$el) {
					return 0;
				} else if (is_array(this.$el)) {
					return this.$el.length;
				} else {
					return 1;
				}
			},
			children: function (name) {
				var list = [];
				var first_floor_child = this.$el.children;
				if (!name) {
					this.$el = first_floor_child;
					return this;
				}
				var _find = function (node) {
					if (!node) {
						return this;
					}
					var len = node.length;
					var i = 0;
					for (; i < len; ++i) {
						var every_node = node[i];
						try {
							if (array_not_empty(every_node.children, true)) {
								_find(every_node.children);
							}
							var _pirex = name.replace(".", "");
							if (every_node.classList.contains(_pirex)) {
								list.push(every_node);
							}
						} catch (err) {
							console.error(err);
							void (err);
						}
					}
				}
				_find(first_floor_child);
				this.$el = list;
				return this;
			},
			each: function (call) {
				if (is_function(call) && this.$el) {
					if (this.$el.length > 0) {
						for (var key in this.$el) {
							var item = this.$el[key];
							if (is_document(item)) {
								call.call(key, item);
							}
						}
					} else {
						console.error("当前集合不可迭代", this.$el);
					}
				}
				return this;
			},
			toggleClass: function (name) {
				var t = this;
				var temp_list = [];
				if (is_array(t.$el, true)) {
					t.$el.forEach(function (item) {
						temp_list.push(item);
					});
				} else if (is_document(t.$el)) {
					temp_list.push(t.$el);
				} else {
					temp_list = null;
				}
				if (temp_list && temp_list.length > 0) {
					temp_list.forEach(function (item) {
						if (has_class(item, name)) {
							t.removeClass(name);
						} else {
							t.addClass(name);
						}
					})
				}
				return this;
			},
			text: function (val) {
				var str_empty = str_is_empty(val);
				if (is_document(this.$el)) {
					if (str_empty) {
						return this.$el.innerText;
					} else {
						this.$el.innerText = val;
						return this;
					}
				} else if (is_array(this.$el, true)) {
					var contentText = "";
					this.$el.forEach(function (item) {
						if (str_empty) {
							contentText = contentText + item.innerText;
						} else {
							item.innerText = val;
						}
					});
					if (str_empty) {
						return contentText;
					} else {
						return this;
					}
				}
			},
			get: function (idx) {
				if (undefined === idx) {
					idx = 0;
				}
				if (this.$el && this.$el.length) {
					this.$el = this.$el[idx];
				}
				return this;
			},
			on: function (event, func, opt) {
				if (!event || !func || typeof func !== "function") {
					console.error("params error");
					return;
				}
				var t = this;
				var el = t.$el;
				t.bind_event(ID_VERSION, el, function (e) {
					if (!e) {
						console.warn("无法为对象", e, "绑定事件");
						return;
					}
					var _opt = opt || {
						passive: false,
						capture: true
					};
					e.addEventListener(event, function (e) {
						func.call(el, e);
					}, _opt);
					t.events.push(func);
				});
				return this;
			},
			bind_event: function (number, el, call) {
				if (number !== ID_VERSION) {
					throw new Error("禁止访问");
				} else if (is_function(call) && (is_document(el) || is_window(call))) {
					call(el);
				} else if (is_array(el, true)) {
					for (var ev in el) {
						var _el = el[ev];
						if (is_document(_el) && is_function(call)) {
							call(el[ev]);
						}
					}
				}
			},
			off: function (event, fun) {
				var _events = this.events;
				if (_events.length === 0) {
					return;
				}
				this.bind_event(ID_VERSION, this.$el, function (el) { // 需要解决一下解绑后的句柄
					_events.forEach(function (func, index) {
						el.removeEventListener(event, fun, {
							passive: false,
							capture: true
						});
						_events.splice(index, 1);
					})
				});
				return this;
			},
			hover: function (func, func2) {
				if (is_function(func)) {
					this.on("mouseenter", func, {
						passive: false,
						capture: false
					});
				}
				if (is_function(func2)) {
					this.on("mouseleave", func2, {
						passive: false,
						capture: false
					});
				}
				return this;
			},
			press: function (func, func2) {
				if (is_function(func)) {
					this.on("mousedown", func);
				}
				if (is_function(func2)) {
					this.on("mouseup", func2);
				}
			},
			hasAttr: function (attr) {
				if (!attr || typeof attr !== "string") {
					return false;
				} else if (is_document(this.$el)) {
					return this.$el.hasAttribute(attr);
				} else if (is_array(this.$el, true)) {
					var has_attr = false;
					this.$el.forEach(function (item) {
						if (item.hasAttribute(attr)) {
							has_attr = true;
						}
					});
					return has_attr;
				} else {
					return false;
				}
			}
		};
		return g;
	}
	if (!(el)) {
		console.error("找不到父容器", el);
	} else {
		var root = $(el),
			def_config = {
				accelerate: false, //禁用硬件加速
				direction: "horizontal", // 播放方向
				ease: "ease", // 过渡动画
				disabvarouch: false, // 关闭触摸
				autoplay: true, // 自动播放
				lazy: undefined, // 懒加载 {prop:xx,enable:boolean}
				loop: true, // 无限循环
				pagination: undefined, // 指示点
				gap: 0, // 间隔
				slide: null, // 滑块
				num: 0, // 子滑块数量 包含复制的
				realNum: 0, // 视觉滑块数量，不包含循环复制的
				width: 0, // 父容器宽度
				height: 0, // 父容器高度
				duration: 300, // 过渡时间
				parent: root, // 父容器
				defaultIndex: 0, // 默认滑块显示下标
				on: null,
				realIndex: 0,
			};
		var base = {
			rootEl: root.$el
		};
		var swiper_items;
		Object.freeze(base);
		if (conf && typeof conf === "object" && Object.keys(conf).length > 0) {
			if (undefined === Object.assign) {
				var result = {};
				Object.keys(def_config).forEach(function (key) {
					result[key] = def_config[key];
				});
				Object.keys(conf).forEach(function (key) {
					result[key] = conf[key];
				});
				def_config = result;
			} else {
				Object.assign(def_config, conf);
			}
		}
		conf = null;
		def_config.is_mobile = (function () {
			return (/Android|iPhone|iPad|X11|Mac OS X/i.test(navigator.userAgent));
		})();
		var TOUCH_EVENT = {
			"down": def_config.is_mobile ? "touchstart" : "pointerdown",
			"move": def_config.is_mobile ? "touchmove" : "pointermove",
			"up": def_config.is_mobile ? "touchend" : "pointerup"
		};

		var j = (function () {
			var slider = $('<div class="swiper-slider"></div>');
			var laout_style = def_config.direction === "horizontal" ? 0 : 1;
			def_config.slide = slider;
			swiper_items = root.children(".swiper-items");
			if (swiper_items.size() === 0) {
				throw new Error("找不到滑块元素，请确保父容器下存在 class 为 swiper-items 的子元素");
			}
			swiper_items.remove();
			var clone_swipers = swiper_items.clone(); // 最终复制的节点
			if (def_config.loop) {
				var last = swiper_items.get(0).clone();
				clone_swipers.push(last);
			}
			var root_size = get_style($(el));
			var size = clone_swipers.length;
			var style_config = {
				height: undefined,
				width: undefined
			}
			$(el).children(".swiper-wrapper").add(slider); // 删除原来的
			function set_children_layout() {
				root_size = get_style($(el));
				if (laout_style === 1) { // 判断方向
					style_config.width = root_size.width + "px";
					style_config.height = (root_size.height * size) + "px";
					$(el).addClass(def_config.direction || "vertical");
				} else if (laout_style === 0) {
					style_config.height = root_size.height + "px";
					style_config.width = (root_size.width * size) + "px";
					$(el).addClass(def_config.direction || 'horizontal');
				}
				swiper_items = $(el).children(".swiper-items").css({
					width: root_size.width + "px",
					height: root_size.height + "px"
				});
				def_config.width = root_size.width;
				def_config.height = root_size.height;
				slider.css(style_config);
			}
			slider.add(clone_swipers);
			set_children_layout();
			if (def_config.loop) {
				def_config.num = size - 1;
			} else {
				def_config.num = size;
			}
			/** 空间 */
			return {
				set_children_layout: set_children_layout
			}
		});
		def_config.slide = null;
		var _j = new j();
		function refresh_layout() {
			get_style(def_config.slide.get(0));
		}
		var isVertical = def_config.direction === "vertical";
		var distance = -1;
		function setDistance() {
			distance = isVertical ? def_config.height : def_config.width
		}
		setDistance();
		// 更新数据
		function update_data() {
			let _el = $(el);
			let width = _el.css("width");
			let height = _el.css("height");
			def_config.height = height;
			def_config.width = width;
			setDistance();

		}
		function init_swiper() {
			var _target = {
				index: 0,
				translate: 0
			}
			var index = def_config.defaultIndex > def_config.num ? def_config.num - 1 : def_config.defaultIndex;
			function prev(e) {
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
				index--;
				if (index < 0) {
					index = def_config.num;
					animate(index * distance, 0);
					refresh_layout();
					index = def_config.num - 1;
					animate(index * distance, def_config.duration);
				} else {
					animate(index * distance, def_config.duration);
				}
				set_postion();
			}
			// 设置页码
			function set_page() {
				var b = def_config.pagination;
				var _el = undefined;
				var clickable = true;
				if (b && is_str(b)) {
					_el = b;
				} else if (object_contains(b, "el")) {
					_el = b.el;
					clickable = b.click;
				}
				if (_el) {
					$(_el).has(function () {
						var idx = 0,
							len = def_config.num,
							_vm = $(),
							_this = $(this),
							active = "pagination-items-active";
						var click_item;
						function click_event(e, el) {
							$(el).addClass(active).siblings().removeClass(active);
							index = e;
							animate(e * distance, def_config.duration, def_config.ease,
								set_postion);
						}
						while (idx < len) {
							if (idx === index) {
								click_item = $("<span index = " + idx + " class='pagination-items " +
									active + "'></span>");
							} else {
								click_item = $("<span index=" + idx + " class='pagination-items'></span>");
							}
							if (clickable) {
								click_item.on("click", function () {
									click_event(this.getAttribute("index").toNumber(), this);
								});
							}
							_vm.add(click_item);
							idx += 1;
						}
						_this.add(_vm);
						var children = _this.children();
						var count = 0;
						if (children.$el) {
							// 监听索引变化
							to_ref(_target, "index", function (e) {
								var _ridx = e[0] === def_config.num ? 0 : e[0];
								def_config.realIndex = _ridx;
								var sel_item = swiper_items.$el[_ridx];
								var isLast = _ridx === 0;
								var i = 0;
								for (; i < len; i++) {
									if (i === _ridx) {
										children.$el[_ridx].classList.add(active);
									} else {
										children.$el[i].classList.remove(active);
									}
								}
								if (def_config.lazy && def_config.lazy.enable) {
									if (count < def_config.num) {
										load_image(sel_item, isLast);
									}
									count++;
								}
							});
						}
					});
				}
			}
			// 下一页
			function next(e) {
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
				index += 1;
				if (index > def_config.num) {
					index = 0;
					animate(index * distance, 0);
					refresh_layout();
					index = 1;
					animate(index * distance, def_config.duration);
				} else {
					animate(index * distance, def_config.duration);
				}
				set_postion();
			}
			/** 初始化布局 */
			function __init__layout() {
				animate(index * distance, 0);
				if (object_contains(def_config.on, "init")) {
					def_config.on.init(this);
				}
				set_page();
			}

			function set_postion() {
				endx = index * distance;
				_target.index = index;
				_target.translate = -endx;
				return;
			}
			if (object_contains(def_config.on, "change") && is_function(def_config.on.change)) {
				to_ref(def_config, "realIndex", function (e) {
					def_config.on.change.call(this, def_config, e[0]);
				})
			}
			/** 初始化前后切换按钮 */
			function init_nav() {
				if (object_contains(def_config, "navigator")) {
					if (object_contains(def_config.navigator, "next")) {
						$(def_config.navigator.next).on("click", next);
					}
					if (object_contains(def_config.navigator, "prev")) {
						$(def_config.navigator.prev).on("click", prev);
					}
					// 按键导航
					if (object_contains(def_config.navigator, "key") && def_config.navigator['key'] === true) {
						$(document).on("keydown", function (e) {
							if (!e.repeat) {
								if (e.keyCode === 39) {
									next(e);
								} else if (e.keyCode === 37) {
									prev(e);
								}
							}

						})
					}
				}
			}
			/** 自动播放 */
			var timer=null;
			var isIe = navigator.appVersion.indexOf("Trident") !== -1;
			function auto_play() {
				if (isIe) {
					
					return;
				}
				if (def_config.autoplay === false) {
					return;
				}
				var delay_time = 2000;
				if (object_contains(def_config, "autoplay")) {
					if (typeof def_config.autoplay === "number") {
						delay_time = def_config.autoplay;
					}
					if (timer === null) {
						timer = setInterval(function () {
							next();
						}, delay_time);
					}
				}
			}
			var isHover=false;
			auto_play();
			function play_slide(play) {
				if (!play) {
					stop_play();
				} else {
					auto_play();
				}
			}
			if (object_contains(def_config, "autoplay") && !isIe) {
				$(el).hover(function (e) {
					e.stopPropagation();
					isHover=true;
					play_slide(false);
				}, function (e) {
					e.stopPropagation();
					isHover=false;
					play_slide(true);
				});
			}
			function stop_play() {
				clearInterval(timer);
				timer = null;
			}
			/** 触摸 - 已修复多点触控问题 */
			
			var is_press = false;
			var startx = 0;
			var endx = 0;
			var is_left = false;
			var movex = 0;
			var is_click = false;
			function animate(dis, duration, ease, call) {
				if (undefined === ease) {
					ease = "ease";
				}
				var transform = isVertical ? "translate3d(0," + -(dis) + "px,0)" : "translate3d(" + -(dis) + "px,0,0)";
				def_config.slide.css({
					transition: "transform " + duration + "ms " + def_config.ease,
					transform: transform,
					backfaceVisibility: "hidden"
				});
				if (is_function(call)) {
					call();
				}
			}
			if (object_contains(def_config.on, "transition") && is_function(def_config.on.transition)) {
				to_ref(_target, "translate", function (e) {
					var t = e[0];
					def_config.on.transition.call(_target, t)
				});
			}
			function compute_index(dis) {
				var thold = is_left ? 0.34 : -0.34;
				var val = Math.abs(dis) / distance;
				var i = Math.round(val + thold);
				return i;
			}
			function pre_defalut(e) {
				if ((!def_config.is_mobile && e) || isVertical) {
					e.preventDefault();
				}
			}
			// 获取滑块里面的a标签
			var all_links = [];
			function get_links() {
				swiper_items.each(function (e) {
					var t_link = e;
					var links = t_link.children;
					all_links.push(links);
				});
			}

			function load_image(item, last) {
				var images = new Array();
				images.push(item.getElementsByTagName("img"));
				if (last) {
					images.push(swiper_items.$el[def_config.num].getElementsByTagName("img"));
				}
				if (images && images.length > 0) {
					var prop = def_config.lazy && def_config.lazy.prop ? def_config.lazy.prop : "data-src";
					for (var j = 0; j < images.length; j++) {
						var img_list = images[j];
						for (var i = 0; i < img_list.length; i++) {
							var img = img_list[i];
							var data_src = img.getAttribute(prop);
							if (data_src) {
								img.setAttribute("src", data_src);
								img.removeAttribute(prop);
							}
						}
					}
				}
			}
			// 阻止a标签跳转
			function prevent_link(prevent) {
				if (all_links && all_links.length > 0) {
					for (var i = 0; i < all_links.length; i++) {
						var link = all_links[i];
						if (link) {
							for (var j = 0; j < link.length; j++) {
								var _link = link[j];
								if (_link && is_document(_link)) {
									if (prevent) {
										$(_link).$el.addEventListener("click", pre_defalut, {
											passive: false,
											capture: true
										});
									} else {
										$(_link).$el.removeEventListener("click", pre_defalut, {
											passive: false,
											capture: true
										});
									}
								}
							}
						}
					}
				}
			}

			// 触摸开始
			function touch_start(e) {
				if (e.type !== TOUCH_EVENT['down']) {
					return;
				} else if (e.button && e.button !== 0) {
					return;
				}
				play_slide(false);
				pre_defalut(e);
				e.stopPropagation();
				startTime = new Date().getTime();
				var touch = def_config.is_mobile ? e.targetTouches[0] : e;
				startx = touch[isVertical ? "clientY" : "clientX"];
				_activeTouchId = touch.identifier !== undefined ? touch.identifier : null;
				is_press = true;
				var b_el = def_config.is_mobile ? this[0] : document;
				$(b_el).on(TOUCH_EVENT["move"], function (e) {
					touch_move(e);
				});
				is_click = false;
			}

			function touch_move(e) {
				e.stopPropagation();
				pre_defalut(e);
				if (!is_press) {
					return;
				}
				// 多点触控：找到与初始触点匹配的触点，如果找不到则忽略
				var x = def_config.is_mobile ? e.changedTouches[0][isVertical ? "clientY" : "clientX"] : e[isVertical ? "clientY" : "clientX"];
				movex = x - startx - endx;
				_target.translate = movex;
				is_left = (x - startx) < 0;
				var max_translate = distance * (def_config.num);
				is_click = Math.abs(x - startx) >= 20;
				var bound = Math.abs(movex) > max_translate;// 边界判定
				if (bound) {
					var v = 0;
					index = v;
					endx = v;
					animate(v, 0);
				} else if (movex > 0) {
					index = def_config.num;
					endx = max_translate;
					animate(-movex, 0);
				} else {
					animate(-movex, 0);
					index = compute_index(movex);
				}
			}

			function touch_end(e) {
				prevent_link(is_click);
				pre_defalut(e);
				e.stopPropagation();
				if(!isHover){
					play_slide(true);
				}
				if (!is_press) {
					return;
				}
				is_press = false;
				set_postion();
				animate(index * distance, def_config.duration, def_config.ease);
			}
			function __init__touch() {
				if (true === def_config.disabvarouch) {
					return;
				} else {
					var slider_el = $(el).children(".swiper-slider");
					slider_el.on(TOUCH_EVENT['down'], touch_start);
					def_config.is_mobile ? slider_el.on(TOUCH_EVENT["up"], touch_end) : $(document).on(TOUCH_EVENT["up"], touch_end);
				}
				set_postion();
			}
			__init__layout();
			get_links();
			init_nav();
			auto_play();
			if (false === def_config.disabvarouch) {
				__init__touch();
			}
			return {
				to: function () {
					animate(index * distance, 0);
				}
			}
		}
		var inits = new init_swiper(def_config);
		var __time = null;
		window.addEventListener("resize", function () {
			clearTimeout(__time);
			__time = setTimeout(function () {
				_j.set_children_layout();
				update_data();
				inits.to();
			}, 240)
		})
	}
	return {
		$: $,
		ID_VERSION: ID_VERSION
	};
});