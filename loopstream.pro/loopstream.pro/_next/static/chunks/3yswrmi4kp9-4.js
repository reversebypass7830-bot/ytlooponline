(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 50316, 44681, 13082, 73752, 72135, 31157, 18390, e => {
    "use strict";
    var t = e.i(29315),
        n = e.i(39957),
        r = e.i(47554),
        o = e.i(58408);
    let i = .1 * .1;

    function s(e, t, n, r, o, i) {
        return r >= t != i >= t && e <= (o - n) * (t - r) / (i - r) + n
    }

    function a(e, t, n, r, o, i, a, l, u, c) {
        let p = !1;
        return s(e, t, n, r, o, i) && (p = !p), s(e, t, o, i, a, l) && (p = !p), s(e, t, a, l, u, c) && (p = !p), s(e, t, u, c, n, r) && (p = !p), p
    }

    function l(e, t, n, r, o, i) {
        let s = Math.min(n, o),
            a = Math.max(n, o),
            l = Math.min(r, i),
            u = Math.max(r, i);
        return e >= s && e <= a && t >= l && t <= u
    }
    e.s(["safePolygon", 0, function(e = {}) {
        let {
            blockPointerEvents: s = !1
        } = e, u = new n.Timeout, c = ({
            x: e,
            y: n,
            placement: s,
            elements: c,
            onClose: p,
            nodeId: d,
            tree: f
        }) => {
            let g = s ? .split("-")[0],
                m = !1,
                h = null,
                v = null,
                E = "u" > typeof performance ? performance.now() : 0;
            return function(s) {
                u.clear();
                let S = c.domReference,
                    y = c.floating;
                if (!S || !y || null == g || null == e || null == n) return;
                let {
                    clientX: C,
                    clientY: b
                } = s, R = (0, r.getTarget)(s), P = "mouseleave" === s.type, T = (0, r.contains)(y, R), x = (0, r.contains)(S, R);
                if (T && (m = !0, !P)) return;
                if (x && (m = !1, !P)) {
                    m = !0;
                    return
                }
                if (P && (0, t.isElement)(s.relatedTarget) && (0, r.contains)(y, s.relatedTarget)) return;

                function O() {
                    return !!(f && (0, o.getNodeChildren)(f.nodesRef.current, d).length > 0)
                }

                function w() {
                    O() || (u.clear(), p())
                }
                if (O()) return;
                let I = S.getBoundingClientRect(),
                    A = y.getBoundingClientRect(),
                    M = e > A.right - A.width / 2,
                    k = n > A.bottom - A.height / 2,
                    D = A.width > I.width,
                    L = A.height > I.height,
                    N = (D ? I : A).left,
                    H = (D ? I : A).right,
                    F = (L ? I : A).top,
                    V = (L ? I : A).bottom;
                if ("top" === g && n >= I.bottom - 1 || "bottom" === g && n <= I.top + 1 || "left" === g && e >= I.right - 1 || "right" === g && e <= I.left + 1) return void w();
                let j = !1;
                switch (g) {
                    case "top":
                        j = l(C, b, N, I.top + 1, H, A.bottom - 1);
                        break;
                    case "bottom":
                        j = l(C, b, N, A.top + 1, H, I.bottom - 1);
                        break;
                    case "left":
                        j = l(C, b, A.right - 1, V, I.left + 1, F);
                        break;
                    case "right":
                        j = l(C, b, I.right - 1, V, A.left + 1, F)
                }
                if (j) return;
                if (m && (!(C >= I.x) || !(C <= I.x + I.width) || !(b >= I.y) || !(b <= I.y + I.height)) || !P && function(e, t) {
                        let n = performance.now(),
                            r = n - E;
                        if (null === h || null === v || 0 === r) return h = e, v = t, E = n, !1;
                        let o = e - h,
                            s = t - v;
                        return h = e, v = t, E = n, o * o + s * s < r * r * i
                    }(C, b)) return void w();
                let B = !1;
                switch (g) {
                    case "top":
                        {
                            let t = D ? .25 : 2,
                                r = n + .5 + 1,
                                o = M || D ? A.bottom - .5 : A.top,
                                i = M ? D ? A.bottom - .5 : A.top : A.bottom - .5;B = a(C, b, D || M ? e + t : e - t, r, D ? e - t : M ? e + t : e - t, r, A.left, o, A.right, i);
                            break
                        }
                    case "bottom":
                        {
                            let t = D ? .25 : 2,
                                r = n - .5,
                                o = M || D ? A.top + .5 : A.bottom,
                                i = M ? D ? A.top + .5 : A.bottom : A.top + .5;B = a(C, b, D || M ? e + t : e - t, r, D ? e - t : M ? e + t : e - t, r, A.left, o, A.right, i);
                            break
                        }
                    case "left":
                        {
                            let t = L ? .25 : 2,
                                r = e + .5 + 1,
                                o = k || L ? A.right - .5 : A.left,
                                i = k ? L ? A.right - .5 : A.left : A.right - .5;B = a(C, b, o, A.top, i, A.bottom, r, L || k ? n + t : n - t, r, L ? n - t : k ? n + t : n - t);
                            break
                        }
                    case "right":
                        {
                            let t = L ? .25 : 2,
                                r = e - .5,
                                o = k || L ? A.left + .5 : A.right,
                                i = k ? L ? A.left + .5 : A.right : A.left + .5;B = a(C, b, r, L || k ? n + t : n - t, r, L ? n - t : k ? n + t : n - t, o, A.top, i, A.bottom)
                        }
                }
                B ? m || u.start(40, w) : w()
            }
        };
        return c.__options = { ...e,
            blockPointerEvents: s
        }, c
    }], 50316);
    var u = e.i(57940);

    function c(e, t, n) {
        let r = null == n || (0, u.isMouseLikePointerType)(n) ? "function" == typeof e ? e() : e : 0;
        return "number" == typeof r ? r : r ? .[t]
    }

    function p(e) {
        return "function" == typeof e ? e() : e
    }

    function d(e, t) {
        return t || "click" === e || "mousedown" === e
    }

    function f(e) {
        return e ? .includes("mouse") && "mousedown" !== e
    }
    e.s(["getDelay", 0, c, "getRestMs", 0, p, "isClickLikeOpenEvent", 0, d, "isHoverOpenEvent", 0, f], 44681);
    var g = e.i(15504),
        m = e.i(74735),
        h = e.i(28744),
        v = e.i(65420),
        E = e.i(8868),
        S = e.i(51321),
        y = e.i(96296),
        C = e.i(75606),
        b = e.i(56434);
    let R = h.platform.os.mac && h.platform.engine.webkit;
    e.s(["useFocus", 0, function(e, o = {}) {
        let {
            enabled: i = !0,
            delay: s
        } = o, a = "rootStore" in e ? e.rootStore : e, {
            events: l,
            dataRef: u
        } = a.context, c = g.useRef(!1), p = g.useRef(null), d = g.useRef(!0), f = (0, n.useTimeout)();
        g.useEffect(() => {
            let e = a.select("domReferenceElement");
            if (!i) return;
            let n = (0, t.getWindow)(e);
            return (0, v.mergeCleanups)((0, m.addEventListener)(n, "blur", function() {
                let e = a.select("domReferenceElement");
                !a.select("open") && (0, t.isHTMLElement)(e) && e === (0, r.activeElement)((0, E.ownerDocument)(e)) && (c.current = !0)
            }), R && (0, m.addEventListener)(n, "keydown", function() {
                d.current = !0
            }, !0), R && (0, m.addEventListener)(n, "pointerdown", function() {
                d.current = !1
            }, !0))
        }, [a, i]), g.useEffect(() => {
            if (i) return l.on("openchange", e), () => {
                l.off("openchange", e)
            };

            function e(e) {
                if (e.reason === b.REASONS.triggerPress || e.reason === b.REASONS.escapeKey) {
                    let e = a.select("domReferenceElement");
                    (0, t.isElement)(e) && (p.current = e, c.current = !0)
                }
            }
        }, [l, i, a]);
        let h = g.useMemo(() => {
            function e() {
                c.current = !1, p.current = null
            }
            return {
                onMouseLeave() {
                    e()
                },
                onFocus(n) {
                    let o = n.currentTarget;
                    if (c.current) {
                        if (p.current === o) return;
                        e()
                    }
                    let i = (0, r.getTarget)(n.nativeEvent);
                    if ((0, t.isElement)(i)) {
                        if (R && !n.relatedTarget) {
                            if (!d.current && !(0, y.isTypeableElement)(i)) return
                        } else if (!(0, y.matchesFocusVisible)(i)) return
                    }
                    let l = (0, y.isTargetInsideEnabledTrigger)(n.relatedTarget, a.context.triggerElements),
                        {
                            nativeEvent: u,
                            currentTarget: g
                        } = n,
                        m = "function" == typeof s ? s() : s;
                    a.select("open") && l || 0 === m || void 0 === m ? a.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerFocus, u, g)) : f.start(m, () => {
                        c.current || a.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerFocus, u, g))
                    })
                },
                onBlur(n) {
                    e();
                    let o = n.relatedTarget,
                        i = n.nativeEvent,
                        s = (0, t.isElement)(o) && o.hasAttribute((0, S.createAttribute)("focus-guard")) && "outside" === o.getAttribute("data-type");
                    f.start(0, () => {
                        let e = a.select("domReferenceElement"),
                            t = (0, r.activeElement)((0, E.ownerDocument)(e));
                        if (!o && t === e || (0, r.contains)(u.current.floatingContext ? .refs.floating.current, t) || (0, r.contains)(e, t) || s) return;
                        let n = o ? ? t;
                        (0, y.isTargetInsideEnabledTrigger)(n, a.context.triggerElements) || a.setOpen(!1, (0, C.createChangeEventDetails)(b.REASONS.triggerFocus, i))
                    })
                }
            }
        }, [u, s, a, f]);
        return g.useMemo(() => i ? {
            reference: h,
            trigger: h
        } : {}, [i, h])
    }], 13082);
    var P = e.i(74080),
        T = e.i(67865),
        x = e.i(46265),
        O = e.i(46420),
        w = e.i(26300),
        I = e.i(88940);
    class A {
        constructor() {
            this.pointerType = void 0, this.interactedInside = !1, this.handler = void 0, this.blockMouseMove = !0, this.performedPointerEventsMutation = !1, this.pointerEventsScopeElement = null, this.pointerEventsReferenceElement = null, this.pointerEventsFloatingElement = null, this.restTimeoutPending = !1, this.openChangeTimeout = new n.Timeout, this.restTimeout = new n.Timeout, this.handleCloseOptions = void 0
        }
        static create() {
            return new A
        }
        dispose = () => {
            this.openChangeTimeout.clear(), this.restTimeout.clear()
        };
        disposeEffect = () => this.dispose
    }
    let M = new WeakMap;

    function k(e) {
        if (!e.performedPointerEventsMutation) return;
        let t = e.pointerEventsScopeElement;
        t && M.get(t) === e && (e.pointerEventsScopeElement ? .style.removeProperty("pointer-events"), e.pointerEventsReferenceElement ? .style.removeProperty("pointer-events"), e.pointerEventsFloatingElement ? .style.removeProperty("pointer-events"), M.delete(t)), e.performedPointerEventsMutation = !1, e.pointerEventsScopeElement = null, e.pointerEventsReferenceElement = null, e.pointerEventsFloatingElement = null
    }

    function D(e, t) {
        let {
            scopeElement: n,
            referenceElement: r,
            floatingElement: o
        } = t, i = M.get(n);
        i && i !== e && k(i), k(e), e.performedPointerEventsMutation = !0, e.pointerEventsScopeElement = n, e.pointerEventsReferenceElement = r, e.pointerEventsFloatingElement = o, M.set(n, e), n.style.pointerEvents = "none", r.style.pointerEvents = "auto", o.style.pointerEvents = "auto"
    }

    function L(e) {
        let t = e.context.dataRef.current,
            n = (0, I.useRefWithInit)(() => t.hoverInteractionState ? ? A.create()).current;
        return t.hoverInteractionState || (t.hoverInteractionState = n), (0, w.useOnMount)(t.hoverInteractionState.disposeEffect), t.hoverInteractionState
    }
    e.s(["applySafePolygonPointerEventsMutation", 0, D, "clearSafePolygonPointerEventsMutation", 0, k, "useHoverInteractionSharedState", 0, L], 73752);
    var N = y;
    let H = {
        current: null
    };
    e.s(["useHoverReferenceInteraction", 0, function(e, n = {}) {
        let {
            enabled: o = !0,
            delay: i = 0,
            handleClose: s = null,
            mouseOnly: a = !1,
            restMs: l = 0,
            move: f = !0,
            triggerElementRef: h = H,
            externalTree: S,
            isActiveTrigger: y = !0,
            getHandleCloseContext: R,
            isClosing: w,
            shouldOpen: I
        } = n, A = "rootStore" in e ? e.rootStore : e, {
            dataRef: M,
            events: F
        } = A.context, V = (0, O.useFloatingTree)(S), j = L(A), B = g.useRef(!1), z = (0, x.useValueAsRef)(s), $ = (0, x.useValueAsRef)(i), _ = (0, x.useValueAsRef)(l), U = (0, x.useValueAsRef)(o), W = (0, x.useValueAsRef)(I), X = (0, x.useValueAsRef)(w), Y = (0, T.useStableCallback)(() => d(M.current.openEvent ? .type, j.interactedInside)), K = (0, T.useStableCallback)(() => W.current ? .() !== !1), q = (0, T.useStableCallback)((e, n, o) => {
            let i = A.context.triggerElements;
            return i.hasElement(n) ? !e || !(0, r.contains)(e, n) : !!(0, t.isElement)(o) && i.hasMatchingElement(e => (0, r.contains)(e, o)) && (!e || !(0, r.contains)(e, o))
        }), J = (0, T.useStableCallback)(() => {
            j.handler && ((0, E.ownerDocument)(A.select("domReferenceElement")).removeEventListener("mousemove", j.handler), j.handler = void 0)
        }), G = (0, T.useStableCallback)(() => {
            k(j)
        });
        return y && (j.handleCloseOptions = z.current ? .__options), g.useEffect(() => J, [J]), g.useEffect(() => {
            if (o) return F.on("openchange", e), () => {
                F.off("openchange", e)
            };

            function e(e) {
                e.open ? B.current = !1 : (B.current = e.reason === b.REASONS.triggerHover, J(), j.openChangeTimeout.clear(), j.restTimeout.clear(), j.blockMouseMove = !0, j.restTimeoutPending = !1)
            }
        }, [o, F, j, J]), g.useEffect(() => {
            if (!o) return;

            function e(t, n = !0) {
                let r = c($.current, "close", j.pointerType);
                r ? j.openChangeTimeout.start(r, () => {
                    A.setOpen(!1, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, t)), V ? .events.emit("floating.closed", t)
                }) : n && (j.openChangeTimeout.clear(), A.setOpen(!1, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, t)), V ? .events.emit("floating.closed", t))
            }
            let n = h.current ? ? (y ? A.select("domReferenceElement") : null);
            if ((0, t.isElement)(n)) return f ? (0, v.mergeCleanups)((0, m.addEventListener)(n, "mousemove", i, {
                once: !0
            }), (0, m.addEventListener)(n, "mouseenter", i), (0, m.addEventListener)(n, "mouseleave", s)) : (0, v.mergeCleanups)((0, m.addEventListener)(n, "mouseenter", i), (0, m.addEventListener)(n, "mouseleave", s));

            function i(e) {
                if (j.openChangeTimeout.clear(), j.blockMouseMove = !1, a && !(0, u.isMouseLikePointerType)(j.pointerType)) return;
                let n = p(_.current),
                    o = c($.current, "open", j.pointerType),
                    i = (0, r.getTarget)(e),
                    s = e.currentTarget ? ? null,
                    l = A.select("domReferenceElement"),
                    d = s;
                if ((0, t.isElement)(i) && !A.context.triggerElements.hasElement(i)) {
                    for (let e of A.context.triggerElements.elements())
                        if ((0, r.contains)(e, i)) {
                            d = e;
                            break
                        }
                }(0, t.isElement)(s) && (0, t.isElement)(l) && !A.context.triggerElements.hasElement(s) && (0, r.contains)(s, l) && (d = l);
                let f = null != d && q(l, d, i),
                    g = A.select("open"),
                    m = X.current ? .() ? ? "ending" === A.select("transitionStatus"),
                    h = !g && m && B.current,
                    v = !f && (0, t.isElement)(d) && (0, t.isElement)(l) && (0, r.contains)(l, d) && h,
                    E = n > 0 && !o,
                    S = !g || f;
                if (f && (g || h) || v) {
                    K() && A.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, e, d));
                    return
                }!E && (o ? j.openChangeTimeout.start(o, () => {
                    S && K() && A.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, e, d))
                }) : S && K() && A.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, e, d)))
            }

            function s(t) {
                if (Y()) return void G();
                J();
                let n = A.select("domReferenceElement"),
                    o = (0, E.ownerDocument)(n);
                j.restTimeout.clear(), j.restTimeoutPending = !1;
                let i = M.current.floatingContext ? ? R ? .();
                if (!(0, N.isTargetInsideEnabledTrigger)(t.relatedTarget, A.context.triggerElements)) {
                    if (z.current && i) {
                        A.select("open") || j.openChangeTimeout.clear();
                        let n = h.current;
                        j.handler = z.current({ ...i,
                            tree: V,
                            x: t.clientX,
                            y: t.clientY,
                            onClose() {
                                G(), J(), U.current && !Y() && n === A.select("domReferenceElement") && e(t, !0)
                            }
                        }), o.addEventListener("mousemove", j.handler), j.handler(t);
                        return
                    }
                    "touch" === j.pointerType && (0, r.contains)(A.select("floatingElement"), t.relatedTarget) || e(t)
                }
            }
        }, [J, G, M, $, A, o, z, j, y, q, Y, a, f, _, h, V, U, R, X, K]), g.useMemo(() => {
            if (o) return {
                onPointerDown: e,
                onPointerEnter: e,
                onMouseMove(e) {
                    let {
                        nativeEvent: t
                    } = e, n = e.currentTarget, r = A.select("domReferenceElement"), o = A.select("open"), i = q(r, n, e.target);
                    if (a && !(0, u.isMouseLikePointerType)(j.pointerType)) return;
                    if (o && i && j.handleCloseOptions ? .blockPointerEvents) {
                        let e = A.select("floatingElement");
                        if (e) {
                            let t = j.handleCloseOptions ? .getScope ? .() ? ? n.ownerDocument.body;
                            D(j, {
                                scopeElement: t,
                                referenceElement: n,
                                floatingElement: e
                            })
                        }
                    }
                    let s = p(_.current);

                    function l() {
                        if (j.restTimeoutPending = !1, Y()) return;
                        let e = A.select("open");
                        !j.blockMouseMove && (!e || i) && K() && A.setOpen(!0, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, t, n))
                    }(!o || i) && 0 !== s && (!i && j.restTimeoutPending && e.movementX ** 2 + e.movementY ** 2 < 2 || (j.restTimeout.clear(), "touch" === j.pointerType ? P.flushSync(() => {
                        l()
                    }) : i && o ? l() : (j.restTimeoutPending = !0, j.restTimeout.start(s, l))))
                }
            };

            function e(e) {
                j.pointerType = e.pointerType
            }
        }, [o, j, Y, q, a, A, _, K])
    }], 72135);
    var F = e.i(46376),
        N = y;
    e.s(["useHoverFloatingInteraction", 0, function(e, i = {}) {
        let {
            enabled: s = !0,
            closeDelay: a = 0,
            nodeId: l
        } = i, u = "rootStore" in e ? e.rootStore : e, p = u.useState("open"), h = u.useState("floatingElement"), S = u.useState("domReferenceElement"), {
            dataRef: R
        } = u.context, P = (0, O.useFloatingTree)(), x = (0, O.useFloatingParentNodeId)(), w = L(u), I = (0, n.useTimeout)(), A = (0, T.useStableCallback)(() => d(R.current.openEvent ? .type, w.interactedInside)), M = (0, T.useStableCallback)(() => f(R.current.openEvent ? .type)), H = (0, T.useStableCallback)(() => {
            k(w)
        });
        (0, F.useIsoLayoutEffect)(() => {
            p || (w.pointerType = void 0, w.restTimeoutPending = !1, w.interactedInside = !1, H())
        }, [p, w, H]), g.useEffect(() => H, [H]), (0, F.useIsoLayoutEffect)(() => {
            if (s && p && w.handleCloseOptions ? .blockPointerEvents && M() && (0, t.isElement)(S) && h) {
                let e = (0, E.ownerDocument)(h),
                    t = P ? .nodesRef.current.find(e => e.id === x) ? .context ? .elements.floating;
                t && (t.style.pointerEvents = "");
                let n = w.pointerEventsScopeElement !== h ? w.pointerEventsScopeElement : null,
                    r = t !== h ? t : null,
                    o = w.handleCloseOptions ? .getScope ? .() ? ? n ? ? r ? ? S.closest("[data-rootownerid]") ? ? e.body;
                return D(w, {
                    scopeElement: o,
                    referenceElement: S,
                    floatingElement: h
                }), () => {
                    H()
                }
            }
        }, [s, p, S, h, w, M, P, x, H]), g.useEffect(() => {
            if (s) return (0, v.mergeCleanups)(h && (0, m.addEventListener)(h, "mouseenter", function() {
                w.openChangeTimeout.clear(), I.clear(), P ? .events.off("floating.closed", n), H()
            }), h && (0, m.addEventListener)(h, "mouseleave", function(i) {
                if (e() && P) return void P.events.on("floating.closed", n);
                if ((0, N.isTargetInsideEnabledTrigger)(i.relatedTarget, u.context.triggerElements)) return;
                let s = R.current.floatingContext ? .nodeId ? ? l,
                    p = i.relatedTarget;
                if (!(P && s && (0, t.isElement)(p) && (0, o.getNodeChildren)(P.nodesRef.current, s, !1).some(e => (0, r.contains)(e.context ? .elements.floating, p)))) {
                    let e, t;
                    if (w.handler) return void w.handler(i);
                    H(), M() && !A() && (e = c(a, "close", w.pointerType), t = () => {
                        u.setOpen(!1, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, i)), P ? .events.emit("floating.closed", i)
                    }, e ? w.openChangeTimeout.start(e, t) : (w.openChangeTimeout.clear(), t()))
                }
            }), h && (0, m.addEventListener)(h, "pointerdown", function(e) {
                let t = (0, r.getTarget)(e);
                if (!(0, y.isInteractiveElement)(t)) {
                    w.interactedInside = !1;
                    return
                }
                w.interactedInside = t ? .closest("[aria-haspopup]") != null
            }, !0), () => {
                P ? .events.off("floating.closed", n)
            });

            function e() {
                return !!(P && x && (0, o.getNodeChildren)(P.nodesRef.current, x).length > 0)
            }

            function n(t) {
                !P || !x || e() || I.start(0, () => {
                    P.events.off("floating.closed", n), u.setOpen(!1, (0, C.createChangeEventDetails)(b.REASONS.triggerHover, t)), P.events.emit("floating.closed", t)
                })
            }
        }, [s, h, u, R, a, l, M, A, H, w, P, x, I])
    }], 31157);
    var V = e.i(44394),
        j = e.i(8445),
        B = e.i(94258),
        z = e.i(22640),
        $ = e.i(56789),
        _ = e.i(73364);

    function U(e, t, n) {
        let r = e.style.getPropertyValue(t);
        return e.style.setProperty(t, n), () => {
            e.style.setProperty(t, r)
        }
    }

    function W(e, t) {
        let n = [];
        for (let [r, o] of Object.entries(t)) n.push(U(e, r, o));
        return n.length ? () => {
            n.forEach(e => e())
        } : $.NOOP
    }

    function X(e, t) {
        let n = "auto" === t ? "auto" : `${t.width}px`,
            r = "auto" === t ? "auto" : `${t.height}px`;
        e.style.setProperty("--popup-width", n), e.style.setProperty("--popup-height", r)
    }

    function Y(e, t) {
        let n = "max-content" === t ? "max-content" : `${t.width}px`,
            r = "max-content" === t ? "max-content" : `${t.height}px`;
        e.style.setProperty("--positioner-width", n), e.style.setProperty("--positioner-height", r)
    }
    var K = e.i(72855),
        q = e.i(43476);
    e.s(["usePopupViewport", 0, function(e) {
        let t, {
                store: n,
                side: r,
                cssVars: o,
                children: i
            } = e,
            s = (0, K.useDirection)(),
            a = n.useState("activeTriggerElement"),
            l = n.useState("activeTriggerId"),
            u = n.useState("open"),
            c = n.useState("payload"),
            p = n.useState("mounted"),
            d = n.useState("popupElement"),
            f = n.useState("positionerElement"),
            m = (0, B.usePreviousValue)(u ? a : null),
            h = function(e, t) {
                let [n, r] = g.useState(0), o = g.useRef(e), i = g.useRef(t), s = g.useRef(!1);
                return (0, F.useIsoLayoutEffect)(() => {
                    let n = o.current,
                        a = t !== i.current;
                    e !== n ? (r(e => e + 1), s.current = !a) : s.current && a && (r(e => e + 1), s.current = !1), o.current = e, i.current = t
                }, [e, t]), `${e??"current"}-${n}`
            }(l, c),
            v = g.useRef(null),
            [S, y] = g.useState(null),
            [C, b] = g.useState(null),
            R = g.useRef(null),
            x = g.useRef(null),
            O = (0, z.useAnimationsFinished)(R, !0, !1),
            w = (0, j.useAnimationFrame)(),
            [I, A] = g.useState(null),
            [M, k] = g.useState(!1);
        (0, F.useIsoLayoutEffect)(() => (n.set("hasViewport", !0), () => {
            n.set("hasViewport", !1)
        }), [n]);
        let D = (0, T.useStableCallback)(() => {
                R.current ? .style.setProperty("animation", "none"), R.current ? .style.setProperty("transition", "none"), x.current ? .style.setProperty("display", "none")
            }),
            L = (0, T.useStableCallback)(e => {
                R.current ? .style.removeProperty("animation"), R.current ? .style.removeProperty("transition"), x.current ? .style.removeProperty("display"), e && A(e)
            }),
            N = g.useRef(null);
        (0, F.useIsoLayoutEffect)(() => {
            u && p || (N.current = null)
        }, [u, p]), (0, F.useIsoLayoutEffect)(() => {
            var e, t;
            let n, r, o, i;
            a && m && a !== m && N.current !== a && v.current && (y(v.current), k(!0), b((e = m, t = a, n = e.getBoundingClientRect(), r = t.getBoundingClientRect(), o = {
                x: n.left + n.width / 2,
                y: n.top + n.height / 2
            }, {
                horizontal: (i = {
                    x: r.left + r.width / 2,
                    y: r.top + r.height / 2
                }).x - o.x,
                vertical: i.y - o.y
            })), w.request(() => {
                P.flushSync(() => {
                    k(!1)
                }), O(() => {
                    y(null), A(null), v.current = null
                })
            }), N.current = a)
        }, [a, m, S, O, w]), (0, F.useIsoLayoutEffect)(() => {
            let e = R.current;
            if (!e) return;
            let t = (0, E.ownerDocument)(e).createElement("div");
            for (let n of Array.from(e.childNodes)) t.appendChild(n.cloneNode(!0));
            v.current = t
        });
        let H = null != S;
        return t = H ? (0, q.jsxs)(g.Fragment, {
            children: [(0, q.jsx)("div", {
                "data-previous": !0,
                inert: (0, V.inertValue)(!0),
                ref: x,
                style: { ...I ? {
                        [o.popupWidth]: `${I.width}px`,
                        [o.popupHeight]: `${I.height}px`
                    } : null,
                    position: "absolute"
                },
                "data-ending-style": M ? void 0 : ""
            }, "previous"), (0, q.jsx)("div", {
                "data-current": !0,
                ref: R,
                "data-starting-style": M ? "" : void 0,
                children: i
            }, h)]
        }) : (0, q.jsx)("div", {
            "data-current": !0,
            ref: R,
            children: i
        }, h), (0, F.useIsoLayoutEffect)(() => {
            let e = x.current;
            e && S && e.replaceChildren(...Array.from(S.childNodes))
        }, [S]), ! function(e) {
            let {
                popupElement: t,
                positionerElement: n,
                content: r,
                mounted: o,
                onMeasureLayout: i,
                onMeasureLayoutComplete: s,
                side: a,
                direction: l
            } = e, u = (0, z.useAnimationsFinished)(t, !0, !1), c = (0, j.useAnimationFrame)(), p = g.useRef(null), d = g.useRef(!0), f = g.useRef($.NOOP), m = (0, T.useStableCallback)(i), h = (0, T.useStableCallback)(s), v = g.useMemo(() => {
                let e = "top" === a,
                    t = "left" === a;
                return "rtl" === l ? (e = e || "inline-end" === a, t = t || "inline-end" === a) : (e = e || "inline-start" === a, t = t || "inline-start" === a), e ? {
                    position: "absolute",
                    ["top" === a ? "bottom" : "top"]: "0",
                    [t ? "right" : "left"]: "0"
                } : $.EMPTY_OBJECT
            }, [a, l]);
            (0, F.useIsoLayoutEffect)(() => {
                if (!o) {
                    f.current = $.NOOP, d.current = !0, p.current = null;
                    return
                }
                if (!t || !n) return;
                f.current = W(t, v), X(t, "auto");
                let e = U(t, "position", "static"),
                    r = U(t, "transform", "none"),
                    i = U(t, "scale", "1"),
                    s = W(n, {
                        "--available-width": "max-content",
                        "--available-height": "max-content"
                    });

                function a() {
                    e(), r(), s(), i()
                }
                if (m ? .(), d.current || null === p.current) {
                    Y(n, "max-content");
                    let e = (0, _.getCssDimensions)(t);
                    return p.current = e, Y(n, e), a(), h ? .(null, e), d.current = !1, () => {
                        f.current(), f.current = $.NOOP
                    }
                }
                Y(n, "max-content");
                let l = p.current,
                    g = (0, _.getCssDimensions)(t);
                p.current = g, X(t, l), a(), h ? .(l, g), Y(n, g);
                let E = new AbortController;
                return c.request(() => {
                    X(t, g), u(() => {
                        t.style.setProperty("--popup-width", "auto"), t.style.setProperty("--popup-height", "auto")
                    }, E.signal)
                }), () => {
                    E.abort(), c.cancel(), f.current(), f.current = $.NOOP
                }
            }, [r, t, n, u, c, o, m, h, v])
        }({
            popupElement: d,
            positionerElement: f,
            mounted: p,
            content: c,
            onMeasureLayout: D,
            onMeasureLayoutComplete: L,
            side: r,
            direction: s
        }), {
            children: t,
            state: {
                activationDirection: function(e) {
                    if (e) {
                        var t, n;
                        return `${(t=e.horizontal)>5?"right":t<-5?"left":""} ${(n=e.vertical)>5?"down":n<-5?"up":""}`
                    }
                }(C),
                transitioning: H
            }
        }
    }], 18390)
}, 46798, e => {
    "use strict";
    var t, n, r = e.i(43476);
    e.s([], 51047), e.i(51047);
    var o = e.i(15504),
        i = e.i(96499),
        s = e.i(46376),
        a = e.i(33332);
    let l = o.createContext(void 0);

    function u(e) {
        let t = o.useContext(l);
        if (void 0 === t && !e) throw Error((0, a.default)(72));
        return t
    }
    var c = e.i(74735),
        p = e.i(67865),
        d = e.i(29315),
        f = e.i(47554),
        g = e.i(57940);

    function m(e) {
        return null != e && null != e.clientX
    }
    var h = e.i(17989),
        v = e.i(75606),
        E = e.i(64111),
        S = e.i(76782),
        y = e.i(16269),
        C = e.i(1252),
        b = e.i(56434),
        R = e.i(16786),
        P = e.i(90627);
    let T = { ...R.popupStoreSelectors,
        disabled: (0, y.createSelector)(e => e.disabled),
        instantType: (0, y.createSelector)(e => e.instantType),
        isInstantPhase: (0, y.createSelector)(e => e.isInstantPhase),
        trackCursorAxis: (0, y.createSelector)(e => e.trackCursorAxis),
        disableHoverablePopup: (0, y.createSelector)(e => e.disableHoverablePopup),
        lastOpenChangeReason: (0, y.createSelector)(e => e.openChangeReason),
        closeOnClick: (0, y.createSelector)(e => e.closeOnClick),
        closeDelay: (0, y.createSelector)(e => e.closeDelay),
        hasViewport: (0, y.createSelector)(e => e.hasViewport)
    };
    class x extends C.ReactStore {
        constructor(e, t, n = !1) {
            const r = new P.PopupTriggerMap,
                i = { ...{ ...(0, R.createInitialPopupStoreState)(),
                        disabled: !1,
                        instantType: void 0,
                        isInstantPhase: !1,
                        trackCursorAxis: "none",
                        disableHoverablePopup: !1,
                        openChangeReason: null,
                        closeOnClick: !0,
                        closeDelay: 0,
                        hasViewport: !1
                    },
                    ...e
                };
            i.floatingRootContext = (0, R.createPopupFloatingRootContext)(r, t, n), super(i, {
                popupRef: o.createRef(),
                onOpenChange: void 0,
                onOpenChangeComplete: void 0,
                triggerElements: r
            }, T)
        }
        setOpen = (e, t) => {
            (0, E.applyPopupOpenChange)(this, e, t, {
                extraState: {
                    openChangeReason: t.reason
                }
            })
        };
        cancelPendingOpen(e) {
            this.state.floatingRootContext.dispatchOpenChange(!1, (0, v.createChangeEventDetails)(b.REASONS.triggerPress, e))
        }
        static useStore(e, t) {
            return (0, E.usePopupStore)(e, (e, n) => new x(t, e, n)).store
        }
    }
    let O = (0, i.fastComponent)(function(e) {
        let {
            disabled: t = !1,
            defaultOpen: n = !1,
            open: i,
            disableHoverablePopup: a = !1,
            trackCursorAxis: u = "none",
            actionsRef: c,
            onOpenChange: p,
            onOpenChangeComplete: d,
            handle: f,
            triggerId: g,
            defaultTriggerId: m = null,
            children: h
        } = e, S = x.useStore(f ? .store, {
            open: n,
            openProp: i,
            activeTriggerId: m,
            triggerIdProp: g
        });
        (0, E.useInitialOpenSync)(S, i, n, m), S.useControlledProp("openProp", i), S.useControlledProp("triggerIdProp", g), S.useContextCallback("onOpenChange", p), S.useContextCallback("onOpenChangeComplete", d);
        let y = S.useState("open"),
            C = !t && y,
            R = S.useState("activeTriggerId"),
            P = S.useState("mounted"),
            T = S.useState("payload");
        S.useSyncedValues({
            trackCursorAxis: u,
            disableHoverablePopup: a
        }), S.useSyncedValue("disabled", t), (0, E.useImplicitActiveTrigger)(S, {
            closeOnActiveTriggerUnmount: !0
        });
        let {
            forceUnmount: O,
            transitionStatus: I
        } = (0, E.useOpenStateTransitions)(C, S), A = S.useState("isInstantPhase"), M = S.useState("instantType"), k = S.useState("lastOpenChangeReason"), D = o.useRef(null);
        (0, s.useIsoLayoutEffect)(() => {
            y && t && S.setOpen(!1, (0, v.createChangeEventDetails)(b.REASONS.disabled))
        }, [y, t, S]), (0, s.useIsoLayoutEffect)(() => {
            "ending" === I && k === b.REASONS.none || "ending" !== I && A ? ("delay" !== M && (D.current = M), S.set("instantType", "delay")) : null !== D.current && (S.set("instantType", D.current), D.current = null)
        }, [I, A, k, M, S]), (0, s.useIsoLayoutEffect)(() => {
            C && null == R && S.set("payload", void 0)
        }, [S, R, C]);
        let L = o.useCallback(() => {
            S.setOpen(!1, (0, v.createChangeEventDetails)(b.REASONS.imperativeAction))
        }, [S]);
        o.useImperativeHandle(c, () => ({
            unmount: O,
            close: L
        }), [O, L]);
        let N = C || P || !t && "none" !== u;
        return (0, r.jsxs)(l.Provider, {
            value: S,
            children: [N && (0, r.jsx)(w, {
                store: S,
                disabled: t,
                trackCursorAxis: u
            }), "function" == typeof h ? h({
                payload: T
            }) : h]
        })
    });

    function w({
        store: e,
        disabled: t,
        trackCursorAxis: n
    }) {
        let r = e.useState("floatingRootContext"),
            i = (0, h.useDismiss)(r, {
                enabled: !t,
                referencePress: () => e.select("closeOnClick")
            }),
            s = function(e, t = {}) {
                let {
                    enabled: n = !0,
                    axis: r = "both"
                } = t, i = "rootStore" in e ? e.rootStore : e, s = i.useState("open"), a = i.useState("floatingElement"), l = i.useState("domReferenceElement"), u = i.context.dataRef, h = o.useRef(!1), v = o.useRef(null), [E, S] = o.useState(), [y, C] = o.useState([]), b = (0, p.useStableCallback)(e => {
                    i.set("positionReference", e)
                }), R = (0, p.useStableCallback)((e, t, n) => {
                    if (!h.current && (!u.current.openEvent || m(u.current.openEvent))) {
                        var o, s;
                        let a, c, p;
                        i.set("positionReference", (o = n ? ? l, s = {
                            x: e,
                            y: t,
                            axis: r,
                            dataRef: u,
                            pointerType: E
                        }, a = null, c = null, p = !1, {
                            contextElement: o || void 0,
                            getBoundingClientRect() {
                                let e = o ? .getBoundingClientRect() || {
                                        width: 0,
                                        height: 0,
                                        x: 0,
                                        y: 0
                                    },
                                    t = "x" === s.axis || "both" === s.axis,
                                    n = "y" === s.axis || "both" === s.axis,
                                    r = ["mouseenter", "mousemove"].includes(s.dataRef.current.openEvent ? .type || "") && "touch" !== s.pointerType,
                                    i = e.width,
                                    l = e.height,
                                    u = e.x,
                                    d = e.y;
                                return null == a && s.x && t && (a = e.x - s.x), null == c && s.y && n && (c = e.y - s.y), u -= a || 0, d -= c || 0, i = 0, l = 0, !p || r ? (i = "y" === s.axis ? e.width : 0, l = "x" === s.axis ? e.height : 0, u = t && null != s.x ? s.x : u, d = n && null != s.y ? s.y : d) : p && !r && (l = "x" === s.axis ? e.height : l, i = "y" === s.axis ? e.width : i), p = !0, {
                                    width: i,
                                    height: l,
                                    x: u,
                                    y: d,
                                    top: d,
                                    right: u + i,
                                    bottom: d + l,
                                    left: u
                                }
                            }
                        }))
                    }
                }), P = (0, p.useStableCallback)(e => {
                    s ? v.current || (R(e.clientX, e.clientY, e.currentTarget), C([])) : R(e.clientX, e.clientY, e.currentTarget)
                }), T = (0, g.isMouseLikePointerType)(E) ? a : s;
                o.useEffect(() => {
                    if (!n) return void b(l);
                    if (!T) return;

                    function e() {
                        v.current ? .(), v.current = null
                    }
                    let t = (0, d.getWindow)(a);
                    return !u.current.openEvent || m(u.current.openEvent) ? v.current = (0, c.addEventListener)(t, "mousemove", function(t) {
                        let n = (0, f.getTarget)(t);
                        (0, f.contains)(a, n) ? e(): R(t.clientX, t.clientY)
                    }) : b(l), e
                }, [T, n, a, u, l, i, R, b, y]), o.useEffect(() => () => {
                    i.set("positionReference", null)
                }, [i]), o.useEffect(() => {
                    n && !a && (h.current = !1)
                }, [n, a]), o.useEffect(() => {
                    !n && s && (h.current = !0)
                }, [n, s]);
                let x = o.useMemo(() => {
                    function e(e) {
                        S(e.pointerType)
                    }
                    return {
                        onPointerDown: e,
                        onPointerEnter: e,
                        onMouseMove: P,
                        onMouseEnter: P
                    }
                }, [P]);
                return o.useMemo(() => n ? {
                    reference: x,
                    trigger: x
                } : {}, [n, x])
            }(r, {
                enabled: !t && "none" !== n,
                axis: "none" === n ? void 0 : n
            }),
            a = o.useMemo(() => (0, S.mergeProps)(s.reference, i.reference), [s.reference, i.reference]),
            l = o.useMemo(() => (0, S.mergeProps)(s.trigger, i.trigger), [s.trigger, i.trigger]),
            u = o.useMemo(() => (0, S.mergeProps)(E.FOCUSABLE_POPUP_PROPS, s.floating, i.floating), [s.floating, i.floating]);
        return (0, E.usePopupInteractionProps)(e, {
            activeTriggerProps: a,
            inactiveTriggerProps: l,
            popupProps: u
        }), null
    }
    var I = e.i(39957),
        A = e.i(46265),
        M = e.i(5005),
        k = e.i(52245),
        D = e.i(88015);
    let L = o.createContext(void 0);
    var N = e.i(50316),
        H = e.i(44681);
    let F = o.createContext({
        hasProvider: !1,
        timeoutMs: 0,
        delayRef: {
            current: 0
        },
        initialDelayRef: {
            current: 0
        },
        timeout: new I.Timeout,
        currentIdRef: {
            current: null
        },
        currentContextRef: {
            current: null
        }
    });

    function V(e) {
        let {
            children: t,
            delay: n,
            timeoutMs: i = 0
        } = e, a = o.useRef(n), l = o.useRef(n), u = o.useRef(null), c = o.useRef(null), p = (0, I.useTimeout)();
        return (0, s.useIsoLayoutEffect)(() => {
            if (l.current = n, !u.current) {
                a.current = n;
                return
            }
            a.current = {
                open: (0, H.getDelay)(a.current, "open"),
                close: (0, H.getDelay)(n, "close")
            }
        }, [n, u, a, l]), (0, r.jsx)(F.Provider, {
            value: o.useMemo(() => ({
                hasProvider: !0,
                delayRef: a,
                initialDelayRef: l,
                currentIdRef: u,
                timeoutMs: i,
                currentContextRef: c,
                timeout: p
            }), [i, p]),
            children: t
        })
    }
    var j = e.i(13082),
        B = e.i(72135);
    let z = ((t = {})[t.popupOpen = M.CommonTriggerDataAttributes.popupOpen] = "popupOpen", t.triggerDisabled = "data-trigger-disabled", t);
    var $ = e.i(73752);
    let _ = "data-base-ui-tooltip-trigger";

    function U(e) {
        if ("composedPath" in e) {
            let t = e.composedPath();
            for (let e = 0; e < t.length; e += 1) {
                let n = t[e];
                if ((0, d.isElement)(n)) return n
            }
        }
        let t = e.target;
        return (0, d.isElement)(t) ? t : null
    }
    let W = (0, i.fastComponentRef)(function(e, t) {
            let {
                render: n,
                className: r,
                style: i,
                handle: l,
                payload: c,
                disabled: p,
                delay: m,
                closeOnClick: h = !0,
                closeDelay: S,
                id: y,
                ...C
            } = e, R = u(!0), P = l ? .store ? ? R;
            if (!P) throw Error((0, a.default)(82));
            let T = (0, D.useBaseUiId)(y),
                x = P.useState("isTriggerActive", T),
                O = P.useState("isOpenedByTrigger", T),
                w = P.useState("floatingRootContext"),
                V = o.useRef(null),
                W = m ? ? 600,
                X = S ? ? 0,
                {
                    registerTrigger: Y,
                    isMountedByThisTrigger: K
                } = (0, E.useTriggerDataForwarding)(T, V, P, {
                    payload: c,
                    closeOnClick: h,
                    closeDelay: X
                }),
                q = o.useContext(L),
                {
                    delayRef: J,
                    isInstantPhase: G,
                    hasProvider: Q
                } = function(e, t = {
                    open: !1
                }) {
                    let {
                        open: n
                    } = t, r = "rootStore" in e ? e.rootStore : e, i = r.useState("floatingId"), {
                        currentIdRef: a,
                        delayRef: l,
                        timeoutMs: u,
                        initialDelayRef: c,
                        currentContextRef: p,
                        hasProvider: d,
                        timeout: f
                    } = o.useContext(F), [g, m] = o.useState(!1), h = o.useRef(n), E = o.useRef(!1);
                    return (0, s.useIsoLayoutEffect)(() => {
                        h.current = n
                    }, [n]), (0, s.useIsoLayoutEffect)(() => () => {
                        E.current = !0
                    }, []), (0, s.useIsoLayoutEffect)(() => {
                        function e() {
                            E.current || m(!1), p.current ? .setIsInstantPhase(!1), a.current = null, p.current = null, l.current = c.current, f.clear()
                        }
                        if (a.current && !n && a.current === i) {
                            if (m(!1), u) return f.start(u, () => {
                                r.select("open") || a.current && a.current !== i || e()
                            }), () => {
                                (h.current || a.current !== i) && f.clear()
                            };
                            e()
                        }
                    }, [n, i, a, l, u, c, p, f, r]), (0, s.useIsoLayoutEffect)(() => {
                        if (!n) return;
                        let e = p.current,
                            t = a.current;
                        f.clear(), p.current = {
                            onOpenChange: r.setOpen,
                            setIsInstantPhase: m
                        }, a.current = i, l.current = {
                            open: 0,
                            close: (0, H.getDelay)(c.current, "close")
                        }, null !== t && t !== i ? (m(!0), e ? .setIsInstantPhase(!0), e ? .onOpenChange(!1, (0, v.createChangeEventDetails)(b.REASONS.none))) : (m(!1), e ? .setIsInstantPhase(!1))
                    }, [n, i, r, a, l, c, p, f]), (0, s.useIsoLayoutEffect)(() => () => {
                        a.current === i && (p.current = null, h.current) && (a.current = null, l.current = c.current, f.clear())
                    }, [p, a, l, i, c, f]), o.useMemo(() => ({
                        hasProvider: d,
                        delayRef: l,
                        isInstantPhase: g
                    }), [d, l, g])
                }(w, {
                    open: O
                }),
                Z = (0, $.useHoverInteractionSharedState)(w);
            P.useSyncedValue("isInstantPhase", G);
            let ee = P.useState("disabled"),
                et = p ? ? ee,
                en = (0, A.useValueAsRef)(et),
                er = P.useState("trackCursorAxis"),
                eo = P.useState("disableHoverablePopup"),
                ei = o.useRef(!1),
                es = (0, I.useTimeout)(),
                ea = o.useRef(void 0);

            function el() {
                let e = q ? .delay,
                    t = "object" == typeof J.current ? J.current.open : void 0,
                    n = W;
                return Q && (n = 0 !== t ? m ? ? e ? ? W : 0), n
            }

            function eu(e) {
                let t = V.current;
                if (!t || !e) return !1;
                let n = function(e) {
                    let t = e;
                    for (; t;) {
                        if (t.hasAttribute(_)) return t;
                        let e = t.parentElement;
                        if (e) {
                            t = e;
                            continue
                        }
                        let n = t.getRootNode();
                        t = "host" in n && (0, d.isElement)(n.host) ? n.host : null
                    }
                    return null
                }(e);
                return null !== n && n !== t && (0, f.contains)(t, n)
            }
            let ec = (0, B.useHoverReferenceInteraction)(w, {
                    enabled: !et,
                    mouseOnly: !0,
                    move: !1,
                    handleClose: eo || "both" === er ? null : (0, N.safePolygon)(),
                    restMs: el,
                    delay() {
                        let e = "object" == typeof J.current ? J.current.close : void 0,
                            t = X;
                        return null == S && Q && (t = e), {
                            close: t
                        }
                    },
                    triggerElementRef: V,
                    isActiveTrigger: x,
                    isClosing: () => "ending" === P.select("transitionStatus"),
                    shouldOpen: () => !ei.current
                }),
                ep = (0, j.useFocus)(w, {
                    enabled: !et
                }).reference,
                ed = P.useState("triggerProps", K),
                ef = K || "none" !== er;
            return (0, k.useRenderElement)("button", e, {
                state: {
                    open: O
                },
                ref: [t, Y, V],
                props: [ec, ep, ef ? ed : void 0, {
                    onMouseOver(e) {
                        (e => {
                            let t, n = ei.current,
                                r = U(e),
                                o = (ei.current = t = eu(r), t && (Z.openChangeTimeout.clear(), Z.restTimeout.clear(), Z.restTimeoutPending = !1, es.clear()), t),
                                i = V.current,
                                s = i && r && (0, f.contains)(i, r);
                            if (o && P.select("open") && P.select("lastOpenChangeReason") === b.REASONS.triggerHover) return P.setOpen(!1, (0, v.createChangeEventDetails)(b.REASONS.triggerHover, e));
                            if (n && !o && s && !en.current && !P.select("open") && i && (0, g.isMouseLikePointerType)(ea.current)) {
                                let t = () => {
                                        ei.current || en.current || P.select("open") || P.setOpen(!0, (0, v.createChangeEventDetails)(b.REASONS.triggerHover, e, i))
                                    },
                                    n = el();
                                0 === n ? (es.clear(), t()) : es.start(n, t)
                            }
                        })(e.nativeEvent)
                    },
                    onFocus(e) {
                        eu(U(e.nativeEvent)) && e.preventBaseUIHandler()
                    },
                    onMouseLeave() {
                        ei.current = !1, es.clear(), ea.current = void 0
                    },
                    onPointerEnter(e) {
                        ea.current = e.pointerType
                    },
                    onPointerDown(e) {
                        ea.current = e.pointerType, P.set("closeOnClick", h), h && !P.select("open") && P.cancelPendingOpen(e.nativeEvent)
                    },
                    onClick(e) {
                        h && !P.select("open") && P.cancelPendingOpen(e.nativeEvent)
                    },
                    id: T,
                    [z.triggerDisabled]: et ? "" : void 0,
                    [_]: et ? void 0 : ""
                }, C],
                stateAttributesMapping: M.triggerOpenStateMapping
            })
        }),
        X = o.createContext(void 0);
    var Y = e.i(74080),
        K = e.i(26674);
    let q = o.forwardRef(function(e, t) {
            let {
                children: n,
                container: i,
                className: s,
                render: a,
                style: l,
                ...u
            } = e, {
                portalNode: c,
                portalSubtree: p
            } = (0, K.useFloatingPortalNode)({
                container: i,
                ref: t,
                componentProps: e,
                elementProps: u
            });
            return p || c ? (0, r.jsxs)(o.Fragment, {
                children: [p, c && Y.createPortal(n, c)]
            }) : null
        }),
        J = o.forwardRef(function(e, t) {
            let {
                keepMounted: n = !1,
                ...o
            } = e;
            return u().useState("mounted") || n ? (0, r.jsx)(X.Provider, {
                value: n,
                children: (0, r.jsx)(q, {
                    ref: t,
                    ...o
                })
            }) : null
        }),
        G = o.createContext(void 0);

    function Q() {
        let e = o.useContext(G);
        if (void 0 === e) throw Error((0, a.default)(71));
        return e
    }
    var Z = e.i(29365),
        ee = e.i(38396),
        et = e.i(60495),
        en = e.i(89579);
    let er = o.forwardRef(function(e, t) {
        let {
            render: n,
            className: i,
            anchor: s,
            positionMethod: l = "absolute",
            side: c = "top",
            align: p = "center",
            sideOffset: d = 0,
            alignOffset: f = 0,
            collisionBoundary: g = "clipping-ancestors",
            collisionPadding: m = 5,
            arrowPadding: h = 5,
            sticky: v = !1,
            disableAnchorTracking: E = !1,
            collisionAvoidance: S = ee.POPUP_COLLISION_AVOIDANCE,
            style: y,
            ...C
        } = e, b = u(), R = function() {
            let e = o.useContext(X);
            if (void 0 === e) throw Error((0, a.default)(70));
            return e
        }(), P = b.useState("open"), T = b.useState("mounted"), x = b.useState("trackCursorAxis"), O = b.useState("disableHoverablePopup"), w = b.useState("floatingRootContext"), I = b.useState("instantType"), A = b.useState("transitionStatus"), M = b.useState("hasViewport"), k = (0, Z.useAnchorPositioning)({
            anchor: s,
            positionMethod: l,
            floatingRootContext: w,
            mounted: T,
            side: c,
            sideOffset: d,
            align: p,
            alignOffset: f,
            collisionBoundary: g,
            collisionPadding: m,
            sticky: v,
            arrowPadding: h,
            disableAnchorTracking: E,
            keepMounted: R,
            collisionAvoidance: S,
            adaptiveOrigin: M ? et.adaptiveOrigin : void 0
        }), D = o.useMemo(() => ({
            open: P,
            side: k.side,
            align: k.align,
            anchorHidden: k.anchorHidden,
            instant: "none" !== x ? "tracking-cursor" : I
        }), [P, k.side, k.align, k.anchorHidden, x, I]), L = (0, en.usePositioner)(e, D, {
            styles: k.positionerStyles,
            transitionStatus: A,
            props: C,
            refs: [t, b.useStateSetter("positionerElement")],
            hidden: !T,
            inert: !P || "both" === x || O
        });
        return (0, r.jsx)(G.Provider, {
            value: k,
            children: L
        })
    });
    var eo = e.i(9407),
        ei = e.i(37584),
        es = e.i(15982),
        ea = e.i(31157);
    let el = { ...M.popupStateMapping,
            ...eo.transitionStatusMapping
        },
        eu = o.forwardRef(function(e, t) {
            let {
                render: n,
                className: r,
                style: o,
                ...i
            } = e, s = u(), {
                side: a,
                align: l
            } = Q(), c = s.useState("open"), p = s.useState("instantType"), d = s.useState("transitionStatus"), f = s.useState("popupProps"), g = s.useState("floatingRootContext"), m = s.useState("disabled"), h = s.useState("closeDelay");
            (0, ei.useOpenChangeComplete)({
                open: c,
                ref: s.context.popupRef,
                onComplete() {
                    c && s.context.onOpenChangeComplete ? .(!0)
                }
            }), (0, ea.useHoverFloatingInteraction)(g, {
                enabled: !m,
                closeDelay: h
            });
            let v = s.useStateSetter("popupElement");
            return (0, k.useRenderElement)("div", e, {
                state: {
                    open: c,
                    side: a,
                    align: l,
                    instant: p,
                    transitionStatus: d
                },
                ref: [t, s.context.popupRef, v],
                props: [f, (0, es.getDisabledMountTransitionStyles)(d), i],
                stateAttributesMapping: el
            })
        }),
        ec = o.forwardRef(function(e, t) {
            let {
                render: n,
                className: r,
                style: o,
                ...i
            } = e, s = u(), {
                arrowRef: a,
                side: l,
                align: c,
                arrowUncentered: p,
                arrowStyles: d
            } = Q(), f = s.useState("open"), g = s.useState("instantType");
            return (0, k.useRenderElement)("div", e, {
                state: {
                    open: f,
                    side: l,
                    align: c,
                    uncentered: p,
                    instant: g
                },
                ref: [t, a],
                props: [{
                    style: d,
                    "aria-hidden": !0
                }, i],
                stateAttributesMapping: M.popupStateMapping
            })
        }),
        ep = ((n = {}).popupWidth = "--popup-width", n.popupHeight = "--popup-height", n);
    var ed = e.i(18390);
    let ef = {
            activationDirection: e => e ? {
                "data-activation-direction": e
            } : null
        },
        eg = o.forwardRef(function(e, t) {
            let {
                render: n,
                className: r,
                style: o,
                children: i,
                ...s
            } = e, a = u(), l = Q(), c = a.useState("instantType"), {
                children: p,
                state: d
            } = (0, ed.usePopupViewport)({
                store: a,
                side: l.side,
                cssVars: ep,
                children: i
            }), f = {
                activationDirection: d.activationDirection,
                transitioning: d.transitioning,
                instant: c
            };
            return (0, k.useRenderElement)("div", e, {
                state: f,
                ref: t,
                props: [s, {
                    children: p
                }],
                stateAttributesMapping: ef
            })
        });
    class em {
        constructor() {
            this.store = new x
        }
        open(e) {
            let t = e ? this.store.context.triggerElements.getById(e) : void 0;
            if (e && !t) throw Error((0, a.default)(81, e));
            this.store.setOpen(!0, (0, v.createChangeEventDetails)(b.REASONS.imperativeAction, void 0, t))
        }
        close() {
            this.store.setOpen(!1, (0, v.createChangeEventDetails)(b.REASONS.imperativeAction, void 0, void 0))
        }
        get isOpen() {
            return this.store.select("open")
        }
    }
    e.s(["Arrow", 0, ec, "Handle", 0, em, "Popup", 0, eu, "Portal", 0, J, "Positioner", 0, er, "Provider", 0, function(e) {
        let {
            delay: t,
            closeDelay: n,
            timeout: i = 400
        } = e, s = o.useMemo(() => ({
            delay: t,
            closeDelay: n
        }), [t, n]), a = o.useMemo(() => ({
            open: t,
            close: n
        }), [t, n]);
        return (0, r.jsx)(L.Provider, {
            value: s,
            children: (0, r.jsx)(V, {
                delay: a,
                timeoutMs: i,
                children: e.children
            })
        })
    }, "Root", 0, O, "Trigger", 0, W, "Viewport", 0, eg, "createHandle", 0, function() {
        return new em
    }], 99643);
    var eh = e.i(99643),
        eh = eh,
        ev = e.i(75157);
    e.s(["Tooltip", 0, function({ ...e
    }) {
        return (0, r.jsx)(eh.Root, {
            "data-slot": "tooltip",
            ...e
        })
    }, "TooltipContent", 0, function({
        className: e,
        side: t = "top",
        sideOffset: n = 4,
        align: o = "center",
        alignOffset: i = 0,
        children: s,
        ...a
    }) {
        return (0, r.jsx)(eh.Portal, {
            children: (0, r.jsx)(eh.Positioner, {
                align: o,
                alignOffset: i,
                side: t,
                sideOffset: n,
                className: "isolate z-50",
                children: (0, r.jsxs)(eh.Popup, {
                    "data-slot": "tooltip-content",
                    className: (0, ev.cn)("z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
                    ...a,
                    children: [s, (0, r.jsx)(eh.Arrow, {
                        className: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5"
                    })]
                })
            })
        })
    }, "TooltipProvider", 0, function({
        delay: e = 0,
        ...t
    }) {
        return (0, r.jsx)(eh.Provider, {
            "data-slot": "tooltip-provider",
            delay: e,
            ...t
        })
    }, "TooltipTrigger", 0, function({ ...e
    }) {
        return (0, r.jsx)(eh.Trigger, {
            "data-slot": "tooltip-trigger",
            ...e
        })
    }], 46798)
}]);