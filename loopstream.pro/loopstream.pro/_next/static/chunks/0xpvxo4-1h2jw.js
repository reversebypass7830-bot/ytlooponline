(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 61487, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(29315),
        r = e.i(74735),
        o = e.i(65420),
        l = e.i(28918),
        i = e.i(46265),
        s = e.i(67865),
        u = e.i(46376),
        a = e.i(39957),
        c = e.i(28744),
        f = e.i(8445),
        d = e.i(8868),
        g = e.i(33848),
        p = e.i(52535),
        m = e.i(47554),
        h = e.i(96296),
        b = e.i(57940),
        v = e.i(83976),
        E = e.i(58408),
        w = e.i(21082),
        y = e.i(75606),
        R = e.i(56434),
        T = e.i(51321),
        S = e.i(3596);
    let k = {
            inert: new WeakMap,
            "aria-hidden": new WeakMap
        },
        A = "data-base-ui-inert",
        M = {
            inert: new WeakSet,
            "aria-hidden": new WeakSet
        },
        L = new WeakMap,
        x = 0,
        O = (e, t) => t.map(t => {
            if (e.contains(t)) return t;
            let r = function e(t) {
                return t ? (0, n.isShadowRoot)(t) ? t.host : e(t.parentNode) : null
            }(t);
            return e.contains(r) ? r : null
        }).filter(e => null != e),
        C = e => {
            let t = new Set;
            return e.forEach(e => {
                let n = e;
                for (; n && !t.has(n);) t.add(n), n = n.parentNode
            }), t
        },
        W = (e, t, r) => {
            let o = [],
                l = e => {
                    !e || r.has(e) || Array.from(e.children).forEach(e => {
                        "script" !== (0, n.getNodeName)(e) && (t.has(e) ? l(e) : o.push(e))
                    })
                };
            return l(e), o
        };

    function P(e, t = {}) {
        let {
            ariaHidden: n = !1,
            inert: r = !1,
            mark: o = !0
        } = t, l = (0, d.ownerDocument)(e[0]).body;
        return function(e, t, n, r, {
            mark: o = !0
        }) {
            let l = null;
            r ? l = "inert" : n && (l = "aria-hidden");
            let i = null,
                s = null,
                u = O(t, e),
                a = o ? W(t, C(u), new Set(u)) : [],
                c = [],
                f = [];
            if (l) {
                let e = k[l],
                    n = M[l];
                s = n, i = e;
                let r = O(t, Array.from(t.querySelectorAll("[aria-live]"))),
                    o = u.concat(r);
                W(t, C(o), new Set(o)).forEach(t => {
                    let r = t.getAttribute(l),
                        o = null !== r && "false" !== r,
                        i = (e.get(t) || 0) + 1;
                    e.set(t, i), c.push(t), 1 === i && o && n.add(t), o || t.setAttribute(l, "inert" === l ? "" : "true")
                })
            }
            return o && a.forEach(e => {
                let t = (L.get(e) || 0) + 1;
                L.set(e, t), f.push(e), 1 === t && e.setAttribute(A, "")
            }), x += 1, () => {
                i && c.forEach(e => {
                    let t = (i.get(e) || 0) - 1;
                    i.set(e, t), t || (!s ? .has(e) && l && e.removeAttribute(l), s ? .delete(e))
                }), o && f.forEach(e => {
                    let t = (L.get(e) || 0) - 1;
                    L.set(e, t), t || e.removeAttribute(A)
                }), (x -= 1) || (k.inert = new WeakMap, k["aria-hidden"] = new WeakMap, M.inert = new WeakSet, M["aria-hidden"] = new WeakSet, L = new WeakMap)
            }
        }(e, l, n, r, {
            mark: o
        })
    }
    var F = e.i(26674),
        N = e.i(46420),
        I = e.i(38396),
        H = e.i(94603),
        Y = e.i(43476);
    let D = [];

    function B() {
        D = D.filter(e => e.deref() ? .isConnected)
    }

    function _(e) {
        B(), e && "body" !== (0, n.getNodeName)(e) && (D.push(new WeakRef(e)), D.length > 20 && (D = D.slice(-20)))
    }

    function q() {
        return B(), D[D.length - 1] ? .deref()
    }

    function X(e) {
        if (e.hasAttribute("tabindex") && !e.hasAttribute("data-tabindex") || !e.getAttribute("role") ? .includes("dialog")) return;
        let t = (0, v.focusable)(e).filter(e => {
                let t = e.getAttribute("data-tabindex") || "";
                return (0, v.isTabbable)(e) || e.hasAttribute("data-tabindex") && !t.startsWith("-")
            }),
            n = e.getAttribute("tabindex");
        0 === t.length ? "0" !== n && (e.setAttribute("tabindex", "0"), e.setAttribute("data-tabindex", "0")) : ("-1" !== n || e.hasAttribute("data-tabindex") && "-1" !== e.getAttribute("data-tabindex")) && (e.setAttribute("tabindex", "-1"), e.setAttribute("data-tabindex", "-1"))
    }
    e.s(["FloatingFocusManager", 0, function(e) {
        let {
            context: k,
            children: A,
            disabled: M = !1,
            initialFocus: L = !0,
            returnFocus: x = !0,
            restoreFocus: O = !1,
            modal: C = !0,
            closeOnFocusOut: W = !0,
            openInteractionType: D = "",
            nextFocusableElement: K,
            previousFocusableElement: $,
            beforeContentFocusGuardRef: G,
            externalTree: V,
            getInsideElements: j
        } = e, U = "rootStore" in k ? k.rootStore : k, z = U.useState("open"), Z = U.useState("domReferenceElement"), J = U.useState("floatingElement"), {
            events: Q,
            dataRef: ee
        } = U.context, et = (0, s.useStableCallback)(() => ee.current.floatingContext ? .nodeId), en = (0, h.isTypeableCombobox)(Z) && !1 === L, er = (0, i.useValueAsRef)(L), eo = (0, i.useValueAsRef)(x), el = (0, i.useValueAsRef)(D), ei = (0, i.useValueAsRef)(z), es = (0, N.useFloatingTree)(V), eu = (0, F.usePortalContext)(), ea = t.useRef(!1), ec = t.useRef(!1), ef = t.useRef(!1), ed = t.useRef(null), eg = t.useRef(""), ep = t.useRef(""), em = t.useRef(null), eh = t.useRef(null), eb = (0, l.useMergedRefs)(em, G, eu ? .beforeInsideRef), ev = (0, l.useMergedRefs)(eh, eu ? .afterInsideRef), eE = (0, a.useTimeout)(), ew = (0, a.useTimeout)(), ey = (0, f.useAnimationFrame)(), eR = null != eu, eT = (0, h.getFloatingFocusElement)(J), eS = (0, s.useStableCallback)((e = eT) => e ? (0, v.tabbable)(e) : []), ek = (0, s.useStableCallback)(() => j ? .().filter(e => null != e) ? ? []);
        t.useEffect(() => {
            if (M || !C) return;
            let e = (0, d.ownerDocument)(eT);
            return (0, r.addEventListener)(e, "keydown", function(e) {
                "Tab" === e.key && (0, m.contains)(eT, (0, m.activeElement)((0, d.ownerDocument)(eT))) && 0 === eS().length && !en && (0, b.stopEvent)(e)
            })
        }, [M, eT, C, en, eS]), t.useEffect(() => {
            if (M || !z) return;
            let e = (0, d.ownerDocument)(eT);

            function t() {
                ef.current = !1
            }
            return (0, o.mergeCleanups)((0, r.addEventListener)(e, "pointerdown", function(e) {
                let t = (0, m.getTarget)(e),
                    n = ek();
                ef.current = !((0, m.contains)(J, t) || (0, m.contains)(Z, t) || (0, m.contains)(eu ? .portalNode, t) || n.some(e => e === t || (0, m.contains)(e, t))), ep.current = e.pointerType || "keyboard", t ? .closest(`[${I.CLICK_TRIGGER_IDENTIFIER}]`) && (ec.current = !0, ew.start(0, () => {
                    ec.current = !1
                }))
            }, !0), (0, r.addEventListener)(e, "pointerup", t, !0), (0, r.addEventListener)(e, "pointercancel", t, !0), (0, r.addEventListener)(e, "keydown", function() {
                ep.current = "keyboard"
            }, !0), t)
        }, [M, J, Z, eT, z, eu, ew, ek]), t.useEffect(() => {
            if (M || !W) return;
            let e = (0, d.ownerDocument)(eT);

            function t(t) {
                let r = t.relatedTarget,
                    o = t.currentTarget,
                    l = (0, m.getTarget)(t);
                C && null == r && null != l && (0, m.contains)(J, l) && _(l), queueMicrotask(() => {
                    let i = et(),
                        s = U.context.triggerElements,
                        u = ek(),
                        a = r ? .hasAttribute((0, T.createAttribute)("focus-guard")) && [em.current, eh.current, eu ? .beforeInsideRef.current, eu ? .afterInsideRef.current, eu ? .beforeOutsideRef.current, eu ? .afterOutsideRef.current, (0, H.resolveRef)($), (0, H.resolveRef)(K)].includes(r),
                        c = !((0, m.contains)(Z, r) || (0, m.contains)(J, r) || (0, m.contains)(r, J) || (0, m.contains)(eu ? .portalNode, r) || u.some(e => e === r || (0, m.contains)(e, r)) || null != r && s.hasElement(r) || s.hasMatchingElement(e => (0, m.contains)(e, r)) || a || es && ((0, E.getNodeChildren)(es.nodesRef.current, i).find(e => (0, m.contains)(e.context ? .elements.floating, r) || (0, m.contains)(e.context ? .elements.domReference, r)) || (0, E.getNodeAncestors)(es.nodesRef.current, i).find(e => [e.context ? .elements.floating, (0, h.getFloatingFocusElement)(e.context ? .elements.floating)].includes(r) || e.context ? .elements.domReference === r)));
                    if (o === Z && eT && X(eT), O && o !== Z && !(0, w.isElementVisible)(l) && (0, m.activeElement)(e) === e.body) {
                        if ((0, n.isHTMLElement)(eT) && (eT.focus(), "popup" === O)) return void ey.request(() => {
                            eT.focus()
                        });
                        let e = eS(),
                            t = ed.current,
                            r = (t && e.includes(t) ? t : null) || e[e.length - 1] || eT;
                        (0, n.isHTMLElement)(r) && r.focus()
                    }
                    if (ee.current.insideReactTree) {
                        ee.current.insideReactTree = !1;
                        return
                    }(en || !C) && r && c && !ec.current && (en || r !== q()) && (ea.current = !0, U.setOpen(!1, (0, y.createChangeEventDetails)(R.REASONS.focusOut, t)))
                })
            }
            let l = (0, n.isHTMLElement)(Z) ? Z : null;
            if (J || l) return (0, o.mergeCleanups)(l && (0, r.addEventListener)(l, "focusout", t), l && (0, r.addEventListener)(l, "pointerdown", function() {
                ec.current = !0, ew.start(0, () => {
                    ec.current = !1
                })
            }), J && (0, r.addEventListener)(J, "focusin", function(e) {
                let t = (0, m.getTarget)(e);
                (0, v.isTabbable)(t) && (ed.current = t)
            }), J && (0, r.addEventListener)(J, "focusout", t), J && eu && (0, r.addEventListener)(J, "focusout", function() {
                ef.current || (ee.current.insideReactTree = !0, eE.start(0, () => {
                    ee.current.insideReactTree = !1
                }))
            }, !0))
        }, [M, Z, J, eT, C, es, eu, U, W, O, eS, en, et, ee, eE, ew, ey, K, $, ek]), t.useEffect(() => {
            if (M || !J || !z) return;
            let e = Array.from(eu ? .portalNode ? .querySelectorAll(`[${(0,T.createAttribute)("portal")}]`) || []),
                t = es ? (0, E.getNodeAncestors)(es.nodesRef.current, et()) : [],
                n = t.find(e => (0, h.isTypeableCombobox)(e.context ? .elements.domReference || null)) ? .context ? .elements.domReference,
                r = P([J, ...e, em.current, eh.current, eu ? .beforeOutsideRef.current, eu ? .afterOutsideRef.current, ...ek(), n, (0, H.resolveRef)($), (0, H.resolveRef)(K), en ? Z : null].filter(e => null != e), {
                    ariaHidden: C || en,
                    mark: !1
                }),
                o = P([J, ...e].filter(e => null != e));
            return () => {
                o(), r()
            }
        }, [z, M, Z, J, C, eu, en, es, et, K, $, ek]), (0, u.useIsoLayoutEffect)(() => {
            if (!z || M || !(0, n.isHTMLElement)(eT)) return;
            let e = (0, d.ownerDocument)(eT),
                t = (0, m.activeElement)(e);
            queueMicrotask(() => {
                let n, r = er.current,
                    o = "function" == typeof r ? r(el.current || "") : r;
                if (void 0 === o || !1 === o || (0, m.contains)(eT, t)) return;
                let l = null,
                    i = () => (null == l && (l = eS(eT)), l[0] || eT);
                n = (n = !0 === o || null === o ? i() : (0, H.resolveRef)(o)) || i();
                let s = (0, m.contains)(eT, (0, m.activeElement)(e));
                (0, S.enqueueFocus)(n, {
                    preventScroll: n === eT,
                    shouldFocus() {
                        if (!ei.current) return !1;
                        if (s) return !0;
                        let t = (0, m.activeElement)(e);
                        return !(t !== n && (0, m.contains)(eT, t))
                    }
                })
            })
        }, [M, z, eT, eS, er, el, ei]), (0, u.useIsoLayoutEffect)(() => {
            if (M || !eT) return;
            let e = (0, d.ownerDocument)(eT),
                t = (0, m.activeElement)(e),
                r = null == el.current;

            function o(e) {
                var t, n;
                let r;
                if (e.open || (t = e.nativeEvent, n = ep.current, r = (0, g.ownerWindow)((0, m.getTarget)(t)), eg.current = t instanceof r.KeyboardEvent ? "keyboard" : t instanceof r.FocusEvent ? n || "keyboard" : "pointerType" in t ? t.pointerType || "keyboard" : "touches" in t ? "touch" : t instanceof r.MouseEvent ? n || (0 === t.detail ? "keyboard" : "mouse") : ""), e.reason === R.REASONS.triggerHover && "mouseleave" === e.nativeEvent.type && (ea.current = !0), e.reason === R.REASONS.outsidePress)
                    if (e.nested) ea.current = !1;
                    else if ((0, b.isVirtualClick)(e.nativeEvent) || (0, b.isVirtualPointerEvent)(e.nativeEvent)) ea.current = !1;
                else {
                    let e = !1;
                    (0, d.ownerDocument)(eT).createElement("div").focus({
                        get preventScroll() {
                            return e = !0, !1
                        }
                    }), e ? ea.current = !1 : ea.current = !0
                }
            }
            return _(t), Q.on("openchange", o), () => {
                Q.off("openchange", o);
                let l = (0, m.activeElement)(e),
                    i = ek(),
                    s = (0, m.contains)(J, l) || i.some(e => e === l || (0, m.contains)(e, l)) || es && (0, E.getNodeChildren)(es.nodesRef.current, et(), !1).some(e => (0, m.contains)(e.context ? .elements.floating, l)),
                    u = eo.current,
                    a = function() {
                        let e = eo.current,
                            o = "function" == typeof e ? e(eg.current) : e;
                        if (void 0 === o || !1 === o) return null;
                        null === o && (o = !0);
                        let l = Z ? .isConnected ? Z : null,
                            i = t ? .isConnected && "body" !== (0, n.getNodeName)(t) ? t : null,
                            s = r ? i || l : l || i;
                        return (s || (s = q() || null), "boolean" == typeof o) ? s : (0, H.resolveRef)(o) || s || null
                    }();
                queueMicrotask(() => {
                    let t = a ? (0, v.isTabbable)(a) ? a : (0, v.tabbable)(a)[0] || a : null;
                    u && !ea.current && (0, n.isHTMLElement)(t) && ("boolean" != typeof u || t === l || l === e.body || s) && t.focus({
                        preventScroll: !0
                    }), ea.current = !1
                })
            }
        }, [M, J, eT, eo, el, Q, es, Z, et, ek]), (0, u.useIsoLayoutEffect)(() => {
            if (!c.platform.engine.webkit || z || !J) return;
            let e = (0, m.activeElement)((0, d.ownerDocument)(J));
            (0, n.isHTMLElement)(e) && (0, h.isTypeableElement)(e) && (0, m.contains)(J, e) && e.blur()
        }, [z, J]), (0, u.useIsoLayoutEffect)(() => {
            if (!M && eu) return eu.setFocusManagerState({
                modal: C,
                closeOnFocusOut: W,
                open: z,
                onOpenChange: U.setOpen,
                domReference: Z
            }), () => {
                eu.setFocusManagerState(null)
            }
        }, [M, eu, C, z, U, W, Z]), (0, u.useIsoLayoutEffect)(() => {
            if (!M && eT) return X(eT), () => {
                queueMicrotask(B)
            }
        }, [M, eT]);
        let eA = !M && (!C || !en) && (eR || C);
        return (0, Y.jsxs)(t.Fragment, {
            children: [eA && (0, Y.jsx)(p.FocusGuard, {
                "data-type": "inside",
                ref: eb,
                onFocus: e => {
                    if (C) {
                        let e = eS();
                        (0, S.enqueueFocus)(e[e.length - 1])
                    } else if (eu ? .portalNode)
                        if (ea.current = !1, (0, v.isOutsideEvent)(e, eu.portalNode)) {
                            let e = (0, v.getNextTabbable)(Z);
                            e ? .focus()
                        } else(0, H.resolveRef)($ ? ? eu.beforeOutsideRef) ? .focus()
                }
            }), A, eA && (0, Y.jsx)(p.FocusGuard, {
                "data-type": "inside",
                ref: ev,
                onFocus: e => {
                    if (C)(0, S.enqueueFocus)(eS()[0]);
                    else if (eu ? .portalNode)
                        if (W && (ea.current = !0), (0, v.isOutsideEvent)(e, eu.portalNode)) {
                            let e = (0, v.getPreviousTabbable)(Z);
                            e ? .focus()
                        } else(0, H.resolveRef)(K ? ? eu.afterOutsideRef) ? .focus()
                }
            })]
        })
    }], 61487)
}, 85689, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(8445),
        r = e.i(39957),
        o = e.i(56789),
        l = e.i(47554),
        i = e.i(96296),
        s = e.i(57940),
        u = e.i(75606),
        a = e.i(56434);
    e.s(["useClick", 0, function(e, c = {}) {
        let {
            enabled: f = !0,
            event: d = "click",
            toggle: g = !0,
            ignoreMouse: p = !1,
            stickIfOpen: m = !0,
            touchOpenDelay: h = 0,
            reason: b = a.REASONS.triggerPress
        } = c, v = "rootStore" in e ? e.rootStore : e, E = v.context.dataRef, w = t.useRef(void 0), y = (0, n.useAnimationFrame)(), R = (0, r.useTimeout)(), T = t.useMemo(() => {
            function e(e, t, n, r) {
                let o = (0, u.createChangeEventDetails)(b, t, n);
                e && "touch" === r && h > 0 ? R.start(h, () => {
                    v.setOpen(!0, o)
                }) : v.setOpen(e, o)
            }

            function t(e, t, n) {
                let r = E.current.openEvent,
                    o = v.select("domReferenceElement") !== t;
                return !!e && !!o || !e || !g || !!r && !!m && !n(r.type)
            }
            return {
                onPointerDown(e) {
                    w.current = e.pointerType
                },
                onMouseDown(n) {
                    let r = w.current,
                        o = n.nativeEvent,
                        u = v.select("open");
                    if (0 !== n.button || "click" === d || (0, s.isMouseLikePointerType)(r, !0) && p) return;
                    let a = t(u, n.currentTarget, e => "click" === e || "mousedown" === e),
                        c = (0, l.getTarget)(o);
                    if ((0, i.isTypeableElement)(c)) return void e(a, o, c, r);
                    let f = n.currentTarget;
                    y.request(() => {
                        e(a, o, f, r)
                    })
                },
                onClick(n) {
                    if ("mousedown-only" === d) return;
                    let r = w.current;
                    if ("mousedown" === d && r) {
                        w.current = void 0;
                        return
                    }(0, s.isMouseLikePointerType)(r, !0) && p || e(t(v.select("open"), n.currentTarget, e => "click" === e || "mousedown" === e || "keydown" === e || "keyup" === e), n.nativeEvent, n.currentTarget, r)
                },
                onKeyDown() {
                    w.current = void 0
                }
            }
        }, [E, d, p, b, v, m, g, y, R, h]);
        return t.useMemo(() => f ? {
            reference: T
        } : o.EMPTY_OBJECT, [f, T])
    }])
}, 3596, e => {
    "use strict";
    var t = e.i(56789);
    let n = 0;
    e.s(["enqueueFocus", 0, function(e, r = {}) {
        let {
            preventScroll: o = !1,
            sync: l = !1,
            shouldFocus: i
        } = r;

        function s() {
            (!i || i()) && e ? .focus({
                preventScroll: o
            })
        }
        if (cancelAnimationFrame(n), l) return s(), t.NOOP;
        let u = requestAnimationFrame(s);
        return n = u, () => {
            n === u && (cancelAnimationFrame(u), n = 0)
        }
    }])
}, 73327, e => {
    "use strict";
    var t = e.i(29315);
    let n = "ArrowUp",
        r = "ArrowDown",
        o = "ArrowLeft",
        l = "ArrowRight",
        i = "Home",
        s = new Set([o, l]),
        u = new Set([o, l, i, "End"]),
        a = new Set([n, r]),
        c = new Set([n, r, i, "End"]),
        f = new Set([...s, ...a]),
        d = new Set([...f, i, "End"]),
        g = new Set(["Shift", "Control", "Alt", "Meta"]);

    function p(e, t, n) {
        let r = "left" === n ? "offsetLeft" : "offsetTop",
            o = 0;
        for (; t.offsetParent && (o += t[r], t.offsetParent !== e);) t = t.offsetParent;
        return o
    }

    function m(e) {
        let t = getComputedStyle(e);
        return {
            scrollMarginTop: parseFloat(t.scrollMarginTop) || 0,
            scrollMarginRight: parseFloat(t.scrollMarginRight) || 0,
            scrollMarginBottom: parseFloat(t.scrollMarginBottom) || 0,
            scrollMarginLeft: parseFloat(t.scrollMarginLeft) || 0,
            scrollPaddingTop: parseFloat(t.scrollPaddingTop) || 0,
            scrollPaddingRight: parseFloat(t.scrollPaddingRight) || 0,
            scrollPaddingBottom: parseFloat(t.scrollPaddingBottom) || 0,
            scrollPaddingLeft: parseFloat(t.scrollPaddingLeft) || 0
        }
    }
    e.s(["ARROW_DOWN", 0, r, "ARROW_KEYS", 0, f, "ARROW_LEFT", 0, o, "ARROW_RIGHT", 0, l, "ARROW_UP", 0, n, "COMPOSITE_KEYS", 0, d, "END", 0, "End", "HOME", 0, i, "HORIZONTAL_KEYS", 0, s, "HORIZONTAL_KEYS_WITH_EXTRA_KEYS", 0, u, "MODIFIER_KEYS", 0, g, "VERTICAL_KEYS", 0, a, "VERTICAL_KEYS_WITH_EXTRA_KEYS", 0, c, "isNativeInput", 0, function(e) {
        return !!((0, t.isHTMLElement)(e) && "INPUT" === e.tagName && null != e.selectionStart || (0, t.isHTMLElement)(e) && "TEXTAREA" === e.tagName)
    }, "scrollIntoViewIfNeeded", 0, function(e, t, n, r) {
        if (!e || !t || !t.scrollTo) return;
        let o = e.scrollLeft,
            l = e.scrollTop,
            i = e.clientWidth < e.scrollWidth,
            s = e.clientHeight < e.scrollHeight;
        if (i && "vertical" !== r) {
            let r = p(e, t, "left"),
                l = m(e),
                i = m(t);
            "ltr" === n && (r + t.offsetWidth + i.scrollMarginRight > e.scrollLeft + e.clientWidth - l.scrollPaddingRight ? o = r + t.offsetWidth + i.scrollMarginRight - e.clientWidth + l.scrollPaddingRight : r - i.scrollMarginLeft < e.scrollLeft + l.scrollPaddingLeft && (o = r - i.scrollMarginLeft - l.scrollPaddingLeft)), "rtl" === n && (r - i.scrollMarginRight < e.scrollLeft + l.scrollPaddingLeft ? o = r - i.scrollMarginLeft - l.scrollPaddingLeft : r + t.offsetWidth + i.scrollMarginRight > e.scrollLeft + e.clientWidth - l.scrollPaddingRight && (o = r + t.offsetWidth + i.scrollMarginRight - e.clientWidth + l.scrollPaddingRight))
        }
        if (s && "horizontal" !== r) {
            let n = p(e, t, "top"),
                r = m(e),
                o = m(t);
            n - o.scrollMarginTop < e.scrollTop + r.scrollPaddingTop ? l = n - o.scrollMarginTop - r.scrollPaddingTop : n + t.offsetHeight + o.scrollMarginBottom > e.scrollTop + e.clientHeight - r.scrollPaddingBottom && (l = n + t.offsetHeight + o.scrollMarginBottom - e.clientHeight + r.scrollPaddingBottom)
        }
        e.scrollTo({
            left: o,
            top: l,
            behavior: "auto"
        })
    }])
}, 426, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        n = e.i(43476);
    let r = t.forwardRef(function(e, t) {
        let r, {
            cutout: o,
            ...l
        } = e;
        if (o) {
            let e = o.getBoundingClientRect();
            r = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${e.left}px ${e.top}px,${e.left}px ${e.bottom}px,${e.right}px ${e.bottom}px,${e.right}px ${e.top}px,${e.left}px ${e.top}px)`
        }
        return (0, n.jsx)("div", {
            ref: t,
            role: "presentation",
            "data-base-ui-inert": "",
            ...l,
            style: {
                position: "fixed",
                inset: 0,
                userSelect: "none",
                WebkitUserSelect: "none",
                clipPath: r
            }
        })
    });
    e.s(["InternalBackdrop", 0, r])
}, 32199, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(67865),
        r = e.i(28744),
        o = e.i(6039);

    function l(e, o) {
        var l;
        let i, s, {
            onClick: u,
            onPointerDown: a
        } = (l = (0, n.useStableCallback)((t, n) => {
            ("function" == typeof e ? e() : e) || o(n || (r.platform.os.ios ? "touch" : ""))
        }), i = t.useRef(""), s = t.useCallback(e => {
            e.defaultPrevented || (i.current = e.pointerType, l(e, e.pointerType))
        }, [l]), {
            onClick: t.useCallback(e => {
                0 === e.detail ? l(e, "keyboard") : ("pointerType" in e ? l(e, e.pointerType) : l(e, i.current), i.current = "")
            }, [l]),
            onPointerDown: s
        });
        return t.useMemo(() => ({
            onClick: u,
            onPointerDown: a
        }), [u, a])
    }
    e.s(["useOpenInteractionType", 0, function(e) {
        let [n, r] = t.useState(null), i = l(e, r);
        return (0, o.useValueChanged)(e, t => {
            t && !e && r(null)
        }), t.useMemo(() => ({
            openMethod: n,
            triggerProps: i
        }), [n, i])
    }, "useOpenMethodTriggerProps", 0, l], 32199)
}, 45484, e => {
    "use strict";
    var t = e.i(29315),
        n = e.i(74735),
        r = e.i(28744),
        o = e.i(8868),
        l = e.i(33848),
        i = e.i(46376),
        s = e.i(39957),
        u = e.i(8445),
        a = e.i(56789);
    let c = {},
        f = {},
        d = "";
    class g {
        lockCount = 0;
        restore = null;
        timeoutLock = s.Timeout.create();
        timeoutUnlock = s.Timeout.create();
        acquire(e) {
            return this.lockCount += 1, 1 === this.lockCount && null === this.restore && this.timeoutLock.start(0, () => this.lock(e)), this.release
        }
        release = () => {
            this.lockCount -= 1, 0 === this.lockCount && this.restore && this.timeoutUnlock.start(0, this.unlock)
        };
        unlock = () => {
            0 === this.lockCount && this.restore && (this.restore ? .(), this.restore = null)
        };
        lock(e) {
            let i, s, g, p, m;
            if (0 === this.lockCount || null !== this.restore) return;
            let h = (0, o.ownerDocument)(e).documentElement,
                b = (0, l.ownerWindow)(h).getComputedStyle(h).overflowY;
            if ("hidden" === b || "clip" === b) {
                this.restore = a.NOOP;
                return
            }
            let v = r.platform.os.ios || ! function(e) {
                if ("u" < typeof document) return !1;
                let t = (0, o.ownerDocument)(e);
                return (0, l.ownerWindow)(t).innerWidth - t.documentElement.clientWidth > 0
            }(e);
            this.restore = v ? (s = (i = (0, o.ownerDocument)(e)).documentElement, g = i.body, m = {
                overflowY: (p = (0, t.isOverflowElement)(s) ? s : g).style.overflowY,
                overflowX: p.style.overflowX
            }, Object.assign(p.style, {
                overflowY: "hidden",
                overflowX: "hidden"
            }), () => {
                Object.assign(p.style, m)
            }) : function(e) {
                let i = (0, o.ownerDocument)(e),
                    s = i.documentElement,
                    a = i.body,
                    g = (0, l.ownerWindow)(s),
                    p = 0,
                    m = 0,
                    h = !1,
                    b = u.AnimationFrame.create();
                if (r.platform.engine.webkit && (g.visualViewport ? .scale ? ? 1) !== 1) return () => {};

                function v() {
                    let n = g.getComputedStyle(s),
                        r = g.getComputedStyle(a),
                        l = (n.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
                    p = s.scrollTop, m = s.scrollLeft, c = {
                        scrollbarGutter: s.style.scrollbarGutter,
                        overflowY: s.style.overflowY,
                        overflowX: s.style.overflowX
                    }, d = s.style.scrollBehavior, f = {
                        position: a.style.position,
                        height: a.style.height,
                        width: a.style.width,
                        boxSizing: a.style.boxSizing,
                        overflowY: a.style.overflowY,
                        overflowX: a.style.overflowX,
                        scrollBehavior: a.style.scrollBehavior
                    };
                    let i = s.scrollHeight > s.clientHeight,
                        u = s.scrollWidth > s.clientWidth,
                        b = "scroll" === n.overflowY || "scroll" === r.overflowY,
                        v = "scroll" === n.overflowX || "scroll" === r.overflowX,
                        E = Math.max(0, g.innerWidth - a.clientWidth),
                        w = Math.max(0, g.innerHeight - a.clientHeight),
                        y = parseFloat(r.marginTop) + parseFloat(r.marginBottom),
                        R = parseFloat(r.marginLeft) + parseFloat(r.marginRight),
                        T = (0, t.isOverflowElement)(s) ? s : a;
                    if (h = function(e) {
                            if (!("u" > typeof CSS && CSS.supports && CSS.supports("scrollbar-gutter", "stable")) || "u" < typeof document) return !1;
                            let n = (0, o.ownerDocument)(e),
                                r = n.documentElement,
                                l = n.body,
                                i = (0, t.isOverflowElement)(r) ? r : l,
                                s = i.style.overflowY,
                                u = r.style.scrollbarGutter;
                            r.style.scrollbarGutter = "stable", i.style.overflowY = "scroll";
                            let a = i.offsetWidth;
                            i.style.overflowY = "hidden";
                            let c = i.offsetWidth;
                            return i.style.overflowY = s, r.style.scrollbarGutter = u, a === c
                        }(e)) {
                        s.style.scrollbarGutter = l, T.style.overflowY = "hidden", T.style.overflowX = "hidden";
                        return
                    }
                    Object.assign(s.style, {
                        scrollbarGutter: l,
                        overflowY: "hidden",
                        overflowX: "hidden"
                    }), (i || b) && (s.style.overflowY = "scroll"), (u || v) && (s.style.overflowX = "scroll"), Object.assign(a.style, {
                        position: "relative",
                        height: y || w ? `calc(100dvh - ${y+w}px)` : "100dvh",
                        width: R || E ? `calc(100vw - ${R+E}px)` : "100vw",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        scrollBehavior: "unset"
                    }), a.scrollTop = p, a.scrollLeft = m, s.setAttribute("data-base-ui-scroll-locked", ""), s.style.scrollBehavior = "unset"
                }

                function E() {
                    Object.assign(s.style, c), Object.assign(a.style, f), h || (s.scrollTop = p, s.scrollLeft = m, s.removeAttribute("data-base-ui-scroll-locked"), s.style.scrollBehavior = d)
                }
                v();
                let w = (0, n.addEventListener)(g, "resize", function() {
                    E(), b.request(v)
                });
                return () => {
                    b.cancel(), E(), "function" == typeof g.removeEventListener && w()
                }
            }(e)
        }
    }
    let p = new g;
    e.s(["useScrollLock", 0, function(e = !0, t = null) {
        (0, i.useIsoLayoutEffect)(() => {
            if (e) return p.acquire(t)
        }, [e, t])
    }])
}]);