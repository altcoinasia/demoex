! function(t) {
    function i(i, s) {
        this.container = t(i), this.settings = s, this.timer = 0, this.before = {
            v: 0,
            h: 0
        }, this.touch = {}, this.pressed = 0, this.vslider = t("<div/>", {
            "class": "scrollbar-handle"
        }), this.vpath = t("<div/>", {
            "class": "scrollbar-path-vertical"
        }), this.hslider = t("<div/>", {
            "class": "scrollbar-handle"
        }), this.hpath = t("<div/>", {
            "class": "scrollbar-path-horizontal"
        }), this.sliders = this.vslider.add(this.hslider), this.container.css({
            overflow: "hidden",
            position: "relative"
        }).contents().filter(this.settings.contentFilter).wrapAll('<div class="scrollbar-content"></div>'), this.content = this.container.children(".scrollbar-content").css({
            top: 0,
            left: 0,
            position: "relative",
            "float": "left"
        }), "horizontal" == this.settings.scroll ? this.container.prepend(this.hpath.append(this.hslider)) : "vertical" == this.settings.scroll ? this.container.prepend(this.vpath.append(this.vslider)) : this.container.prepend(this.vpath.append(this.vslider), this.hpath.append(this.hslider)), this.vpath.add(this.hpath).css({
            "z-index": this.settings.zIndex,
            display: "none"
        }), this.vslider.css({
            height: this.settings.sliderSize,
            opacity: this.settings.sliderOpacity
        }), this.hslider.css({
            width: this.settings.sliderSize,
            opacity: this.settings.sliderOpacity
        }), this.settings.sliderOpacity && this.sliders.hover(this.fixFn(function() {
            this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, 1)
        }), this.fixFn(function() {
            this.pressed || this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity)
        })), this.init(), this.pathSize(), this.bindEvent(t(window), "load", function() {
            setTimeout(this.fixFn(this.checkScroll), 10)
        }), this.settings.lazyCheckScroll > 0 && setInterval(this.fixFn(this.checkScroll), this.settings.lazyCheckScroll)
    }
    i.prototype.checkScroll = function() {
        this.vtrack = this.vpath.height() - this.vslider.height(), this.htrack = this.hpath.width() - this.hslider.width(), this.vdiff = this.content.height() - this.container.height(), this.hdiff = this.content.width() - this.container.width(), this.settings.autoHide && (this.vdiff > 0 ? this.vpath.fadeIn(this.settings.autoHideTime) : this.vpath.fadeOut(this.settings.autoHideTime), this.hdiff > 0 ? this.hpath.fadeIn(this.settings.autoHideTime) : this.hpath.fadeOut(this.settings.autoHideTime))
    }, i.prototype.pathSize = function() {
        var t = parseInt(this.settings.pathPadding, 10);
        this.vpath.css({
            top: t + "px",
            height: this.container.height() - 2 * t + "px"
        }), this.hpath.css({
            left: t + "px",
            width: this.container.width() - 2 * t + "px"
        })
    }, i.prototype.scroll = function(t, i, s) {
        var e = 0,
            h = 0;
        0 > t && (t = 0), t > this.vtrack && (t = this.vtrack), this.vslider.css("top", t + "px"), 0 > i && (i = 0), i > this.htrack && (i = this.htrack), this.hslider.css("left", i + "px"), this.vdiff > 0 && (h = t / this.vtrack, this.content.css("top", Math.round(-this.vdiff * h)), s && t && t != this.vtrack && (s.stopPropagation(), s.preventDefault())), this.hdiff > 0 && (e = i / this.htrack, this.content.css("left", Math.round(-this.hdiff * e)), s && i && i != this.htrack && (s.stopPropagation(), s.preventDefault())), (this.before.v != h || this.before.h != e) && ("function" == typeof this.settings.onscroll && this.settings.onscroll.call(this.container.get(0), h, e), this.before.v = h, this.before.h = e)
    }, i.prototype.easeScroll = function(i, s) {
        var e = 0,
            h = Math.floor(this.settings.scrollTime / this.settings.scrollInterval),
            n = this.vslider.position().top,
            o = this.hslider.position().left,
            r = t.easing[this.settings.scrollEasing] || t.easing.linear;
        this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, 1), window.clearInterval(this.timer), this.timer = window.setInterval(this.fixFn(function() {
            this.scroll(n + r(e / h, e, 0, 1, h) * i, o + r(e / h, e, 0, 1, h) * s), ++e > h && (window.clearInterval(this.timer), this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity))
        }), this.settings.scrollInterval)
    }, i.prototype.fixFn = function(t, i) {
        var s = this;
        return function() {
            t.apply(i || s, Array.prototype.slice.call(arguments))
        }
    }, i.prototype.bindEvent = function(t, i, s, e) {
        return t.bind(i, this.fixFn(s, e))
    }, i.prototype.init = function() {
        var i = t(window.document);
        this.bindEvent(this.sliders, "mousedown", function(t) {
            this.pressed = t.target === this.vslider.get(0) ? 1 : 2;
            var s = t.pageX,
                e = t.pageY,
                h = this.vslider.position().top,
                n = this.hslider.position().left;
            this.bindEvent(i, "mousemove", function(t) {
                1 == this.pressed ? this.scroll(h + (t.pageY - e), n) : this.scroll(h, n + (t.pageX - s))
            }), this.bindEvent(i, "selectstart", function(t) {
                t.preventDefault()
            })
        }), this.bindEvent(i, "mouseup", function(t) {
            1 == this.pressed && t.target !== this.vslider.get(0) ? this.vslider.fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity) : 2 == this.pressed && t.target !== this.hslider.get(0) && this.hslider.fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity), this.pressed = 0, i.unbind("mousemove"), i.unbind("selectstart")
        }), this.bindEvent(this.container, "touchstart", function(t) {
            var i = t.originalEvent,
                s = i.changedTouches[0];
            this.touch.sx = s.pageX, this.touch.sy = s.pageY, this.touch.sv = this.vslider.position().top, this.touch.sh = this.hslider.position().left, this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, 1), i.stopPropagation()
        }), this.bindEvent(this.container, "touchmove", function(t) {
            var i = t.originalEvent,
                s = i.targetTouches[0];
            this.scroll(this.touch.sv + (this.touch.sy - s.pageY) * this.settings.touchSpeed, this.touch.sh + (this.touch.sx - s.pageX) * this.settings.touchSpeed), i.preventDefault(), i.stopPropagation()
        }), this.bindEvent(this.container, "touchend touchcancel", function(t) {
            var i = t.originalEvent;
            i.changedTouches[0];
            this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity), i.stopPropagation()
        });
        var s = this.vpath.height(),
            e = this.hpath.width();
        this.bindEvent(t(window), "resize", function() {
            this.pathSize(), this.checkScroll(), this.vdiff <= 0 && this.content.css("top", 0), this.hdiff <= 0 && this.content.css("left", 0), this.scroll(Math.round(parseInt(this.vslider.css("top"), 10) * this.vpath.height() / s), Math.round(parseInt(this.hslider.css("left"), 10) * this.hpath.width() / e)), s = this.vpath.height(), e = this.hpath.width()
        }), this.bindEvent(this.container, "mousewheel", function(t, i, s, e) {
            this.scroll(this.vslider.position().top - this.settings.wheelSpeed * e, this.hslider.position().left + this.settings.wheelSpeed * s, t), this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, 1), window.clearTimeout(this.timer), this.timer = window.setTimeout(this.fixFn(function() {
                this.sliders.stop().fadeTo(this.settings.sliderOpacityTime, this.settings.sliderOpacity)
            }), this.settings.sliderOpacityDelay), this.settings.blockGlobalScroll && (this.vdiff || this.hdiff) && (t.preventDefault(), t.stopPropagation())
        }), this.bindEvent(i, "keydown", function(t) {
            var i = 0,
                s = 0;
            s = 38 == t.keyCode ? -this.settings.keyScroll : s, s = 40 == t.keyCode ? this.settings.keyScroll : s, i = 37 == t.keyCode ? -this.settings.keyScroll : i, i = 39 == t.keyCode ? this.settings.keyScroll : i, (s || i) && this.easeScroll(s, i)
        }), this.bindEvent(this.container, "uscrollbar", function(t, i, s, e) {
            return "reset" === i ? void this.container.find(".scrollbar-content, .scrollbar-handle").stop().css({
                top: 0,
                left: 0
            }) : (i = i || 0, s = s || 0, t.stopPropagation(), /^[-\d\.]+$/.test(i) && (i = parseFloat(i), Math.abs(i) <= 1 && !e ? i *= this.vtrack : i += i * (this.vtrack / this.vdiff - 1)), /^[-\d\.]+$/.test(s) && (s = parseFloat(s), Math.abs(s) <= 1 && !e ? s *= this.htrack : s += s * (this.htrack / this.hdiff - 1)), void this.easeScroll(i, s))
        })
    }, t.fn.ClassyScroll = function(s) {
        var e = {
            scroll: "both",
            autoHide: !0,
            autoHideTime: "fast",
            lazyCheckScroll: 1e3,
            blockGlobalScroll: !1,
            contentFilter: "*",
            sliderSize: "30%",
            sliderOpacity: .5,
            sliderOpacityTime: 200,
            sliderOpacityDelay: 1e3,
            wheelSpeed: 20,
            touchSpeed: .3,
            pathPadding: "20px",
            keyScroll: 100,
            scrollTime: 500,
            scrollInterval:20,
            scrollEasing: "swing",
            zIndex: 100,
            onscroll: function() {}
        };
        return t.extend(e, s), this.each(function() {
            new i(this, e)
        })
    }
}(jQuery),
function(t) {
    function i(i) {
        var s = i || window.event,
            e = [].slice.call(arguments, 1),
            h = 0,
            n = 0,
            o = 0;
        return i = t.event.fix(s), i.type = "mousewheel", s.wheelDelta && (h = s.wheelDelta / 120), s.detail && (h = -s.detail / 3), o = h, void 0 !== s.axis && s.axis === s.HORIZONTAL_AXIS && (o = 0, n = -1 * h), void 0 !== s.wheelDeltaY && (o = s.wheelDeltaY / 120), void 0 !== s.wheelDeltaX && (n = -1 * s.wheelDeltaX / 120), e.unshift(i, h, n, o), (t.event.dispatch || t.event.handle).apply(this, e)
    }
    var s = ["DOMMouseScroll", "mousewheel"];
    if (t.event.fixHooks)
        for (var e = s.length; e;) t.event.fixHooks[s[--e]] = t.event.mouseHooks;
    t.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var t = s.length; t;) this.addEventListener(s[--t], i, !1);
            else this.onmousewheel = i
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var t = s.length; t;) this.removeEventListener(s[--t], i, !1);
            else this.onmousewheel = null
        }
    }, t.fn.extend({
        mousewheel: function(t) {
            return t ? this.bind("mousewheel", t) : this.trigger("mousewheel")
        },
        unmousewheel: function(t) {
            return this.unbind("mousewheel", t)
        }
    })
}(jQuery);

! function(e) {
    function t(t) {
        var n = t || window.event,
            i = [].slice.call(arguments, 1),
            l = 0,
            s = 0,
            o = 0;
        return t = e.event.fix(n), t.type = "mousewheel", n.wheelDelta && (l = n.wheelDelta / 120), n.detail && (l = -n.detail / 3), o = l, void 0 !== n.axis && n.axis === n.HORIZONTAL_AXIS && (o = 0, s = -1 * l), void 0 !== n.wheelDeltaY && (o = n.wheelDeltaY / 120), void 0 !== n.wheelDeltaX && (s = -1 * n.wheelDeltaX / 120), i.unshift(t, l, s, o), (e.event.dispatch || e.event.handle).apply(this, i)
    }
    var n = ["DOMMouseScroll", "mousewheel"];
    if (e.event.fixHooks)
        for (var i = n.length; i;) e.event.fixHooks[n[--i]] = e.event.mouseHooks;
    e.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var e = n.length; e;) this.addEventListener(n[--e], t, !1);
            else this.onmousewheel = t
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var e = n.length; e;) this.removeEventListener(n[--e], t, !1);
            else this.onmousewheel = null
        }
    }, e.fn.extend({
        mousewheel: function(e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function(e) {
            return this.unbind("mousewheel", e)
        }
    })
}(jQuery);