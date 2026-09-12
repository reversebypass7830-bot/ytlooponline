(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 26674, 38396, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(74080),
        r = e.i(29315),
        i = e.i(74735),
        s = e.i(65420),
        o = e.i(83977),
        u = e.i(46376),
        l = e.i(67865),
        a = e.i(56789),
        c = e.i(52535),
        d = e.i(83976),
        f = e.i(75606),
        p = e.i(56434),
        g = e.i(51321),
        h = e.i(52245);
    let m = {
        clipPath: "inset(50%)",
        position: "fixed",
        top: 0,
        left: 0
    };
    e.s(["CLICK_TRIGGER_IDENTIFIER", 0, "data-base-ui-click-trigger", "DISABLED_TRANSITIONS_STYLE", 0, {
        style: {
            transition: "none"
        }
    }, "DROPDOWN_COLLISION_AVOIDANCE", 0, {
        fallbackAxisSide: "none"
    }, "PATIENT_CLICK_THRESHOLD", 0, 500, "POPUP_COLLISION_AVOIDANCE", 0, {
        fallbackAxisSide: "end"
    }, "TYPEAHEAD_RESET_MS", 0, 500, "ownerVisuallyHidden", 0, m], 38396);
    var E = e.i(43476);
    let b = t.createContext(null),
        v = () => t.useContext(b),
        S = (0, g.createAttribute)("portal");

    function y(e = {}) {
        let {
            ref: i,
            container: s,
            componentProps: c = a.EMPTY_OBJECT,
            elementProps: d
        } = e, f = (0, o.useId)(), p = v(), g = p ? .portalNode, [m, E] = t.useState(null), [b, T] = t.useState(null), C = (0, l.useStableCallback)(e => {
            null !== e && T(e)
        }), O = t.useRef(null);
        (0, u.useIsoLayoutEffect)(() => {
            if (null === s) {
                O.current && (O.current = null, T(null), E(null));
                return
            }
            if (null == f) return;
            let e = (s && ((0, r.isNode)(s) ? s : s.current)) ? ? g ? ? document.body;
            if (null == e) {
                O.current && (O.current = null, T(null), E(null));
                return
            }
            O.current !== e && (O.current = e, T(null), E(e))
        }, [s, g, f]);
        let R = (0, h.useRenderElement)("div", c, {
            ref: [i, C],
            props: [{
                id: f,
                [S]: ""
            }, d]
        });
        return {
            portalNode: b,
            portalSubtree: m && R ? n.createPortal(R, m) : null
        }
    }
    let T = t.forwardRef(function(e, r) {
        let {
            render: o,
            className: l,
            style: a,
            children: g,
            container: h,
            renderGuards: v,
            ...S
        } = e, {
            portalNode: T,
            portalSubtree: C
        } = y({
            container: h,
            ref: r,
            componentProps: e,
            elementProps: S
        }), O = t.useRef(null), R = t.useRef(null), x = t.useRef(null), I = t.useRef(null), [P, w] = t.useState(null), A = t.useRef(!1), L = P ? .modal, N = P ? .open, k = "boolean" == typeof v ? v : !!P && !P.modal && P.open && !!T;
        t.useEffect(() => {
            if (T && !L) return (0, s.mergeCleanups)((0, i.addEventListener)(T, "focusin", e, !0), (0, i.addEventListener)(T, "focusout", e, !0));

            function e(e) {
                T && e.relatedTarget && (0, d.isOutsideEvent)(e) && ("focusin" === e.type ? A.current && ((0, d.enableFocusInside)(T), A.current = !1) : ((0, d.disableFocusInside)(T), A.current = !0))
            }
        }, [T, L]), (0, u.useIsoLayoutEffect)(() => {
            T && !0 === N && A.current && ((0, d.enableFocusInside)(T), A.current = !1)
        }, [N, T]);
        let M = t.useMemo(() => ({
            beforeOutsideRef: O,
            afterOutsideRef: R,
            beforeInsideRef: x,
            afterInsideRef: I,
            portalNode: T,
            setFocusManagerState: w
        }), [T]);
        return (0, E.jsxs)(t.Fragment, {
            children: [C, (0, E.jsxs)(b.Provider, {
                value: M,
                children: [k && T && (0, E.jsx)(c.FocusGuard, {
                    "data-type": "outside",
                    ref: O,
                    onFocus: e => {
                        if ((0, d.isOutsideEvent)(e, T)) x.current ? .focus();
                        else {
                            let e = P ? P.domReference : null,
                                t = (0, d.getPreviousTabbable)(e);
                            t ? .focus()
                        }
                    }
                }), k && T && (0, E.jsx)("span", {
                    "aria-owns": T.id,
                    style: m
                }), T && n.createPortal(g, T), k && T && (0, E.jsx)(c.FocusGuard, {
                    "data-type": "outside",
                    ref: R,
                    onFocus: e => {
                        if ((0, d.isOutsideEvent)(e, T)) I.current ? .focus();
                        else {
                            let t = P ? P.domReference : null,
                                n = (0, d.getNextTabbable)(t);
                            n ? .focus(), P ? .closeOnFocusOut && P ? .onOpenChange(!1, (0, f.createChangeEventDetails)(p.REASONS.focusOut, e.nativeEvent))
                        }
                    }
                })]
            })]
        })
    });
    e.s(["FloatingPortal", 0, T, "useFloatingPortalNode", 0, y, "usePortalContext", 0, v], 26674)
}, 46420, 61286, 79248, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(83977),
        r = e.i(46376),
        i = e.i(88940);

    function s() {
        let e = new Map;
        return {
            emit(t, n) {
                e.get(t) ? .forEach(e => e(n))
            },
            on(t, n) {
                e.has(t) || e.set(t, new Set), e.get(t).add(n)
            },
            off(t, n) {
                e.get(t) ? .delete(n)
            }
        }
    }
    e.s(["createEventEmitter", 0, s], 61286);
    class o {
        nodesRef = {
            current: []
        };
        events = s();
        addNode(e) {
            this.nodesRef.current.push(e)
        }
        removeNode(e) {
            let t = this.nodesRef.current.findIndex(t => t === e); - 1 !== t && this.nodesRef.current.splice(t, 1)
        }
    }
    e.s(["FloatingTreeStore", 0, o], 79248);
    var u = e.i(43476);
    let l = t.createContext(null),
        a = t.createContext(null),
        c = () => t.useContext(l) ? .id || null,
        d = e => {
            let n = t.useContext(a);
            return e ? ? n
        };
    e.s(["FloatingNode", 0, function(e) {
        let {
            children: n,
            id: r
        } = e, i = c();
        return (0, u.jsx)(l.Provider, {
            value: t.useMemo(() => ({
                id: r,
                parentId: i
            }), [r, i]),
            children: n
        })
    }, "FloatingTree", 0, function(e) {
        let {
            children: t,
            externalTree: n
        } = e, r = (0, i.useRefWithInit)(() => n ? ? new o).current;
        return (0, u.jsx)(a.Provider, {
            value: r,
            children: t
        })
    }, "useFloatingNodeId", 0, function(e) {
        let t = (0, n.useId)(),
            i = d(e),
            s = c();
        return (0, r.useIsoLayoutEffect)(() => {
            if (!t) return;
            let e = {
                id: t,
                parentId: s
            };
            return i ? .addNode(e), () => {
                i ? .removeNode(e)
            }
        }, [i, t, s]), t
    }, "useFloatingParentNodeId", 0, c, "useFloatingTree", 0, d], 46420)
}, 17989, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(74735),
        r = e.i(65420),
        i = e.i(8868),
        s = e.i(67865),
        o = e.i(39957),
        u = e.i(29315),
        l = e.i(28744),
        a = e.i(46420),
        c = e.i(75606),
        d = e.i(56434),
        f = e.i(51321),
        p = e.i(47554),
        g = e.i(96296),
        h = e.i(57940),
        m = e.i(58408);

    function E() {
        return !1
    }
    e.s(["useDismiss", 0, function(e, b = {}) {
        let {
            enabled: v = !0,
            escapeKey: S = !0,
            outsidePress: y = !0,
            outsidePressEvent: T = "sloppy",
            referencePress: C = E,
            bubbles: O,
            externalTree: R
        } = b, x = "rootStore" in e ? e.rootStore : e, I = x.useState("open"), P = x.useState("floatingElement"), {
            dataRef: w
        } = x.context, A = (0, a.useFloatingTree)(R), L = (0, s.useStableCallback)("function" == typeof y ? y : () => !1), N = "function" == typeof y ? L : y, k = !1 !== N, M = (0, s.useStableCallback)(() => T), {
            escapeKey: D,
            outsidePress: F
        } = {
            escapeKey: "boolean" == typeof O ? O : O ? .escapeKey ? ? !1,
            outsidePress: "boolean" == typeof O ? O : O ? .outsidePress ? ? !0
        }, _ = t.useRef(!1), V = t.useRef(!1), H = t.useRef(!1), j = t.useRef(!1), B = t.useRef(""), W = t.useRef(null), U = (0, o.useTimeout)(), K = (0, o.useTimeout)(), Y = (0, s.useStableCallback)(() => {
            K.clear(), w.current.insideReactTree = !1
        }), z = (0, s.useStableCallback)(e => {
            let t = w.current.floatingContext ? .nodeId;
            return (A ? (0, m.getNodeChildren)(A.nodesRef.current, t) : []).some(t => t.context ? .open && !t.context.dataRef.current[e])
        }), X = (0, s.useStableCallback)(e => (0, g.isEventTargetWithin)(e, x.select("floatingElement")) || (0, g.isEventTargetWithin)(e, x.select("domReferenceElement"))), G = (0, s.useStableCallback)(e => {
            C() && x.setOpen(!1, (0, c.createChangeEventDetails)(d.REASONS.triggerPress, e.nativeEvent))
        }), q = (0, s.useStableCallback)(e => {
            if (!I || !v || !S || "Escape" !== e.key || j.current || !D && z("__escapeKeyBubbles")) return;
            let t = (0, h.isReactEvent)(e) ? e.nativeEvent : e,
                n = (0, c.createChangeEventDetails)(d.REASONS.escapeKey, t);
            x.setOpen(!1, n), n.isCanceled || e.preventDefault(), D || n.isPropagationAllowed || e.stopPropagation()
        }), J = (0, s.useStableCallback)(() => {
            w.current.insideReactTree = !0, K.start(0, Y)
        }), $ = (0, s.useStableCallback)(e => {
            if (!I || !v || 0 !== e.button) return;
            let t = (0, p.getTarget)(e.nativeEvent);
            (0, p.contains)(x.select("floatingElement"), t) && (_.current || (_.current = !0, V.current = !1))
        }), Q = (0, s.useStableCallback)(e => {
            !I || !v || (e.defaultPrevented || e.nativeEvent.defaultPrevented) && _.current && (V.current = !0)
        });
        t.useEffect(() => {
            if (!I || !v) return;
            w.current.__escapeKeyBubbles = D, w.current.__outsidePressBubbles = F;
            let e = new o.Timeout,
                t = new o.Timeout;

            function s() {
                H.current = !0, t.start(0, () => {
                    H.current = !1
                })
            }

            function a() {
                _.current = !1, V.current = !1
            }

            function h() {
                let e = B.current,
                    t = M(),
                    n = "function" == typeof t ? t() : t;
                return "string" == typeof n ? n : n["pen" !== e && e ? e : "mouse"]
            }

            function E(e) {
                let t = w.current.floatingContext ? .nodeId,
                    n = A && (0, m.getNodeChildren)(A.nodesRef.current, t).some(t => (0, g.isEventTargetWithin)(e, t.context ? .elements.floating));
                return X(e) || n
            }

            function b(e) {
                let n;
                if ("intentional" === (n = h()) && "click" !== e.type || "sloppy" === n && "click" === e.type) {
                    "click" === e.type || X(e) || (t.clear(), H.current = !1), Y();
                    return
                }
                if (w.current.insideReactTree) return void Y();
                let r = (0, p.getTarget)(e),
                    s = `[${(0,f.createAttribute)("inert")}]`,
                    o = (0, u.isElement)(r) ? r.getRootNode() : null,
                    l = Array.from(((0, u.isShadowRoot)(o) ? o : (0, i.ownerDocument)(x.select("floatingElement"))).querySelectorAll(s)),
                    a = x.context.triggerElements;
                if (r && (a.hasElement(r) || a.hasMatchingElement(e => (0, p.contains)(e, r)))) return;
                let m = (0, u.isElement)(r) ? r : null;
                for (; m && !(0, u.isLastTraversableNode)(m);) {
                    let e = (0, u.getParentNode)(m);
                    if ((0, u.isLastTraversableNode)(e) || !(0, u.isElement)(e)) break;
                    m = e
                }
                if (!(l.length && (0, u.isElement)(r) && !(0, g.isRootElement)(r) && !(0, p.contains)(r, x.select("floatingElement")) && l.every(e => !(0, p.contains)(m, e)))) {
                    if ((0, u.isHTMLElement)(r) && !("touches" in e)) {
                        let t = (0, u.isLastTraversableNode)(r),
                            n = (0, u.getComputedStyle)(r),
                            i = /auto|scroll/,
                            s = t || i.test(n.overflowX),
                            o = t || i.test(n.overflowY),
                            l = s && r.clientWidth > 0 && r.scrollWidth > r.clientWidth,
                            a = o && r.clientHeight > 0 && r.scrollHeight > r.clientHeight,
                            c = "rtl" === n.direction,
                            d = a && (c ? e.offsetX <= r.offsetWidth - r.clientWidth : e.offsetX > r.clientWidth),
                            f = l && e.offsetY > r.clientHeight;
                        if (d || f) return
                    }
                    if (!E(e)) {
                        if ("intentional" === h() && H.current) {
                            t.clear(), H.current = !1;
                            return
                        }
                        "function" == typeof N && !N(e) || z("__outsidePressBubbles") || (x.setOpen(!1, (0, c.createChangeEventDetails)(d.REASONS.outsidePress, e)), Y())
                    }
                }
            }

            function y(e) {
                if ("sloppy" !== h() || !x.select("open") || !v || X(e)) return;
                let t = e.touches[0];
                t && (W.current = {
                    startTime: Date.now(),
                    startX: t.clientX,
                    startY: t.clientY,
                    dismissOnTouchEnd: !1,
                    dismissOnMouseDown: !0
                }, U.start(1e3, () => {
                    W.current && (W.current.dismissOnTouchEnd = !1, W.current.dismissOnMouseDown = !1)
                }))
            }

            function T(e, t) {
                let r = (0, p.getTarget)(e);
                if (!r) return;
                let i = (0, n.addEventListener)(r, e.type, () => {
                    t(e), i()
                })
            }

            function C(e) {
                U.clear(), "pointerdown" === e.type && (B.current = e.pointerType), ("mousedown" !== e.type || !W.current || W.current.dismissOnMouseDown) && T(e, e => {
                    if ("pointerdown" === e.type) "sloppy" !== h() || "touch" === e.pointerType || !x.select("open") || !v || X(e) || b(e);
                    else b(e)
                })
            }

            function O(e) {
                if (!_.current) return;
                let n = V.current;
                if (a(), "intentional" === h()) {
                    if ("pointercancel" === e.type) {
                        n && s();
                        return
                    }
                    E(e) || (n ? s() : ("function" != typeof N || N(e)) && (t.clear(), H.current = !0, Y()))
                }
            }

            function R(e) {
                if ("sloppy" !== h() || !W.current || X(e)) return;
                let t = e.touches[0];
                if (!t) return;
                let n = Math.abs(t.clientX - W.current.startX),
                    r = Math.abs(t.clientY - W.current.startY),
                    i = Math.sqrt(n * n + r * r);
                i > 5 && (W.current.dismissOnTouchEnd = !0), i > 10 && (b(e), U.clear(), W.current = null)
            }

            function L(e) {
                "sloppy" !== h() || !W.current || X(e) || (W.current.dismissOnTouchEnd && b(e), U.clear(), W.current = null)
            }
            let K = (0, i.ownerDocument)(P),
                G = (0, r.mergeCleanups)(S && (0, r.mergeCleanups)((0, n.addEventListener)(K, "keydown", q), (0, n.addEventListener)(K, "compositionstart", function() {
                    e.clear(), j.current = !0
                }), (0, n.addEventListener)(K, "compositionend", function() {
                    e.start(5 * !!l.platform.engine.webkit, () => {
                        j.current = !1
                    })
                })), k && (0, r.mergeCleanups)((0, n.addEventListener)(K, "click", C, !0), (0, n.addEventListener)(K, "pointerdown", C, !0), (0, n.addEventListener)(K, "pointerup", O, !0), (0, n.addEventListener)(K, "pointercancel", O, !0), (0, n.addEventListener)(K, "mousedown", C, !0), (0, n.addEventListener)(K, "mouseup", O, !0), (0, n.addEventListener)(K, "touchstart", function(e) {
                    B.current = "touch", T(e, y)
                }, !0), (0, n.addEventListener)(K, "touchmove", function(e) {
                    T(e, R)
                }, !0), (0, n.addEventListener)(K, "touchend", function(e) {
                    T(e, L)
                }, !0)));
            return () => {
                G(), e.clear(), t.clear(), a(), H.current = !1
            }
        }, [w, P, S, k, N, I, v, D, F, q, Y, M, z, X, A, x, U]), t.useEffect(Y, [N, Y]);
        let Z = t.useMemo(() => ({
                onKeyDown: q,
                onPointerDown: G,
                onClick: G
            }), [q, G]),
            ee = t.useMemo(() => ({
                onKeyDown: q,
                onPointerDown: Q,
                onMouseDown: Q,
                onClickCapture: J,
                onMouseDownCapture(e) {
                    J(), $(e)
                },
                onPointerDownCapture(e) {
                    J(), $(e)
                },
                onMouseUpCapture: J,
                onTouchEndCapture: J,
                onTouchMoveCapture: J
            }), [q, J, $, Q]);
        return t.useMemo(() => v ? {
            reference: Z,
            floating: ee,
            trigger: Z
        } : {}, [v, Z, ee])
    }])
}, 21082, e => {
    "use strict";
    e.i(47167);
    var t = e.i(29315);

    function n(e, {
        startingIndex: t = -1,
        decrement: i = !1,
        disabledIndices: s,
        amount: o = 1
    } = {}) {
        let u = t;
        do u += i ? -o : o; while (u >= 0 && u <= e.length - 1 && r(e, u, s)) return u
    }

    function r(e, t, n) {
        if ("function" == typeof n ? n(t) : n ? .includes(t) ? ? !1) return !0;
        let r = e[t];
        return !!r && (!i(r) || !n && (r.hasAttribute("disabled") || "true" === r.getAttribute("aria-disabled")))
    }

    function i(e, n = e ? (0, t.getComputedStyle)(e) : null) {
        var r;
        return !!e && !!e.isConnected && !!n && "hidden" !== (r = n).visibility && "collapse" !== r.visibility && ("function" == typeof e.checkVisibility ? e.checkVisibility() : "none" !== n.display && "contents" !== n.display)
    }
    e.s(["findNonDisabledListIndex", 0, n, "getMaxListIndex", 0, function(e, t) {
        return n(e.current, {
            decrement: !0,
            startingIndex: e.current.length,
            disabledIndices: t
        })
    }, "getMinListIndex", 0, function(e, t) {
        return n(e.current, {
            disabledIndices: t
        })
    }, "isElementVisible", 0, i, "isIndexOutOfListBounds", 0, function(e, t) {
        return t < 0 || t >= e.length
    }, "isListIndexDisabled", 0, r])
}, 51321, e => {
    "use strict";
    e.s(["createAttribute", 0, function(e) {
        return `data-base-ui-${e}`
    }])
}, 96296, 49055, e => {
    "use strict";
    var t = e.i(29315),
        n = e.i(28744);
    let r = "data-base-ui-focusable",
        i = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
    e.s(["ARROW_DOWN", 0, "ArrowDown", "ARROW_LEFT", 0, "ArrowLeft", "ARROW_RIGHT", 0, "ArrowRight", "ARROW_UP", 0, "ArrowUp", "FOCUSABLE_ATTRIBUTE", 0, r, "TYPEABLE_SELECTOR", 0, i], 49055);
    var s = e.i(47554);

    function o(e) {
        return (0, t.isHTMLElement)(e) && e.matches(i)
    }
    e.s(["getFloatingFocusElement", 0, function(e) {
        return e ? e.hasAttribute(r) ? e : e.querySelector(`[${r}]`) || e : null
    }, "isEventTargetWithin", 0, function(e, t) {
        return null != t && ("composedPath" in e ? e.composedPath().includes(t) : null != e.target && t.contains(e.target))
    }, "isInteractiveElement", 0, function(e) {
        return e ? .closest(`button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${i}`) != null
    }, "isRootElement", 0, function(e) {
        return e.matches("html,body")
    }, "isTargetInsideEnabledTrigger", 0, function(e, n) {
        if (!(0, t.isElement)(e)) return !1;
        if (n.hasElement(e)) return !e.hasAttribute("data-trigger-disabled");
        for (let [, t] of n.entries())
            if ((0, s.contains)(t, e)) return !t.hasAttribute("data-trigger-disabled");
        return !1
    }, "isTypeableCombobox", 0, function(e) {
        return !!e && "combobox" === e.getAttribute("role") && o(e)
    }, "isTypeableElement", 0, o, "matchesFocusVisible", 0, function(e) {
        if (!e || n.platform.env.jsdom) return !0;
        try {
            return e.matches(":focus-visible")
        } catch (e) {
            return !0
        }
    }], 96296)
}, 57940, e => {
    "use strict";
    var t = e.i(28744);
    e.s(["isClickLikeEvent", 0, function(e) {
        let t = e.type;
        return "click" === t || "mousedown" === t || "keydown" === t || "keyup" === t
    }, "isMouseLikePointerType", 0, function(e, t) {
        let n = ["mouse", "pen"];
        return t || n.push("", void 0), n.includes(e)
    }, "isReactEvent", 0, function(e) {
        return "nativeEvent" in e
    }, "isVirtualClick", 0, function(e) {
        return "" === e.pointerType && !!e.isTrusted || (t.platform.os.android && e.pointerType ? "click" === e.type && 1 === e.buttons : 0 === e.detail && !e.pointerType)
    }, "isVirtualPointerEvent", 0, function(e) {
        return !t.platform.env.jsdom && (!t.platform.os.android && 0 === e.width && 0 === e.height || t.platform.os.android && 1 === e.width && 1 === e.height && 0 === e.pressure && 0 === e.detail && "mouse" === e.pointerType || e.width < 1 && e.height < 1 && 0 === e.pressure && 0 === e.detail && "touch" === e.pointerType)
    }, "stopEvent", 0, function(e) {
        e.preventDefault(), e.stopPropagation()
    }])
}, 58408, e => {
    "use strict";
    e.s(["getNodeAncestors", 0, function(e, t) {
        let n = [],
            r = e.find(e => e.id === t) ? .parentId;
        for (; r;) {
            let t = e.find(e => e.id === r);
            r = t ? .parentId, t && (n = n.concat(t))
        }
        return n
    }, "getNodeChildren", 0, function e(t, n, r = !0) {
        return t.filter(e => e.parentId === n).flatMap(n => [...!r || n.context ? .open ? [n] : [], ...e(t, n.id, r)])
    }])
}, 83976, e => {
    "use strict";
    var t = e.i(29315),
        n = e.i(8868),
        r = e.i(47554),
        i = e.i(21082);

    function s(e) {
        for (let n of Array.from(e.children))
            if ("summary" === (0, t.getNodeName)(n)) return n;
        return null
    }

    function o(e) {
        let n = e ? (0, t.getNodeName)(e) : "";
        return null != e && e.matches('a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]') && ("summary" !== n || null != e.parentElement && "details" === (0, t.getNodeName)(e.parentElement) && s(e.parentElement) === e) && ("details" !== n || null == s(e)) && ("input" !== n || "hidden" !== e.type)
    }

    function u(e) {
        if (!o(e) || !e.isConnected || e.matches(":disabled")) return !1;
        for (let n = e; n; n = function(e) {
                let n = e.assignedSlot;
                if (n) return n;
                if (e.parentElement) return e.parentElement;
                let r = e.getRootNode();
                return (0, t.isShadowRoot)(r) ? r.host : null
            }(n)) {
            let o = n !== e,
                u = "slot" === (0, t.getNodeName)(n);
            if (n.hasAttribute("inert") || o && "details" === (0, t.getNodeName)(n) && !n.open && ! function(e, t) {
                    let n = s(t);
                    return !!n && (e === n || (0, r.contains)(n, e))
                }(e, n) || n.hasAttribute("hidden") || !u && ! function(e, n) {
                    let r = (0, t.getComputedStyle)(e);
                    return n ? "none" !== r.display : (0, i.isElementVisible)(e, r)
                }(n, o)) return !1
        }
        return !0
    }

    function l(e) {
        let n = e.tabIndex;
        if (n < 0) {
            let n = (0, t.getNodeName)(e);
            if ("details" === n || "audio" === n || "video" === n || (0, t.isHTMLElement)(e) && e.isContentEditable) return 0
        }
        return n
    }

    function a(e) {
        return "input" !== (0, t.getNodeName)(e) ? null : "radio" === e.type && "" !== e.name ? e : null
    }

    function c(e) {
        if ((0, t.isHTMLElement)(e) && "slot" === (0, t.getNodeName)(e)) {
            let t = e.assignedElements({
                flatten: !0
            });
            if (t.length > 0) return t
        }
        return (0, t.isHTMLElement)(e) && e.shadowRoot ? Array.from(e.shadowRoot.children) : Array.from(e.children)
    }

    function d(e) {
        let t = [];
        return ! function e(t, n) {
            c(t).forEach(t => {
                o(t) && n.push(t), e(t, n)
            })
        }(e, t), t.filter(u)
    }

    function f(e) {
        let t = d(e);
        return t.filter(e => l(e) >= 0 && function(e, t) {
            let n = a(e);
            if (!n) return !0;
            let r = t.find(e => {
                let t = a(e);
                return t ? .name === n.name && t.form === n.form && t.checked
            });
            return r ? r === n : t.find(e => {
                let t = a(e);
                return t ? .name === n.name && t.form === n.form
            }) === n
        }(e, t))
    }

    function p(e, t) {
        let i = f(e),
            s = i.length;
        if (0 === s) return;
        let o = (0, r.activeElement)((0, n.ownerDocument)(e)),
            u = i.indexOf(o);
        return i[-1 === u ? 1 === t ? 0 : s - 1 : u + t]
    }

    function g(e, t) {
        if (!e) return null;
        let r = f((0, n.ownerDocument)(e).body),
            i = r.length;
        if (0 === i) return null;
        let s = r.indexOf(e);
        return -1 === s ? null : r[(s + t + i) % i]
    }
    e.s(["disableFocusInside", 0, function(e) {
        f(e).forEach(e => {
            e.dataset.tabindex = e.getAttribute("tabindex") || "", e.setAttribute("tabindex", "-1")
        })
    }, "enableFocusInside", 0, function(e) {
        let n = [];
        ! function e(n, r, i) {
            c(n).forEach(n => {
                (0, t.isHTMLElement)(n) && n.matches(r) && i.push(n), e(n, r, i)
            })
        }(e, "[data-tabindex]", n), n.forEach(e => {
            let t = e.dataset.tabindex;
            delete e.dataset.tabindex, t ? e.setAttribute("tabindex", t) : e.removeAttribute("tabindex")
        })
    }, "focusable", 0, d, "getNextTabbable", 0, function(e) {
        return p((0, n.ownerDocument)(e).body, 1) || e
    }, "getPreviousTabbable", 0, function(e) {
        return p((0, n.ownerDocument)(e).body, -1) || e
    }, "getTabbableAfterElement", 0, function(e) {
        return g(e, 1)
    }, "getTabbableBeforeElement", 0, function(e) {
        return g(e, -1)
    }, "isOutsideEvent", 0, function(e, t) {
        let n = t || e.currentTarget,
            i = e.relatedTarget;
        return !i || !(0, r.contains)(n, i)
    }, "isTabbable", 0, function(e) {
        return u(e) && l(e) >= 0
    }, "tabbable", 0, f])
}, 52535, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        n = e.i(46376),
        r = e.i(28744),
        i = e.i(2077),
        s = e.i(43476);
    let o = t.forwardRef(function(e, o) {
        let [u, l] = t.useState();
        return (0, n.useIsoLayoutEffect)(() => {
            r.platform.screenReader.voiceOver && r.platform.engine.webkit && l("button")
        }, []), (0, s.jsx)("span", { ...e,
            ref: o,
            style: i.visuallyHidden,
            "aria-hidden": !u || void 0,
            ...{
                tabIndex: 0,
                role: u
            },
            "data-base-ui-focus-guard": ""
        })
    });
    e.s(["FocusGuard", 0, o])
}, 5005, e => {
    "use strict";
    var t, n, r = e.i(9407);
    let i = ((t = {}).open = "data-open", t.closed = "data-closed", t[t.startingStyle = r.TransitionStatusDataAttributes.startingStyle] = "startingStyle", t[t.endingStyle = r.TransitionStatusDataAttributes.endingStyle] = "endingStyle", t.anchorHidden = "data-anchor-hidden", t.side = "data-side", t.align = "data-align", t),
        s = ((n = {}).popupOpen = "data-popup-open", n.pressed = "data-pressed", n),
        o = {
            [s.popupOpen]: ""
        },
        u = {
            [s.popupOpen]: "",
            [s.pressed]: ""
        },
        l = {
            [i.open]: ""
        },
        a = {
            [i.closed]: ""
        },
        c = {
            [i.anchorHidden]: ""
        };
    e.s(["CommonPopupDataAttributes", 0, i, "CommonTriggerDataAttributes", 0, s, "popupStateMapping", 0, {
        open: e => e ? l : a,
        anchorHidden: e => e ? c : null
    }, "pressableTriggerOpenStateMapping", 0, {
        open: e => e ? u : null
    }, "triggerOpenStateMapping", 0, {
        open: e => e ? o : null
    }])
}, 64111, 1252, 56341, 50527, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(74080),
        r = e.i(56789),
        i = e.i(83977),
        s = e.i(67865),
        o = e.i(46376),
        u = e.i(13203),
        l = e.i(49055),
        a = e.i(46420),
        c = e.i(29315),
        d = e.i(16269),
        f = e.i(14935),
        p = e.i(34346);
    class g extends f.Store {
        constructor(e, t = {}, n) {
            super(e), this.context = t, this.selectors = n
        }
        useSyncedValue(e, n) {
            t.useDebugValue(e);
            let r = this;
            (0, o.useIsoLayoutEffect)(() => {
                r.state[e] !== n && r.set(e, n)
            }, [r, e, n])
        }
        useSyncedValueWithCleanup(e, t) {
            let n = this;
            (0, o.useIsoLayoutEffect)(() => (n.state[e] !== t && n.set(e, t), () => {
                n.set(e, void 0)
            }), [n, e, t])
        }
        useSyncedValues(e) {
            let t = this,
                n = Object.values(e);
            (0, o.useIsoLayoutEffect)(() => {
                t.update(e)
            }, [t, ...n])
        }
        useControlledProp(e, n) {
            t.useDebugValue(e);
            let r = this,
                i = void 0 !== n;
            (0, o.useIsoLayoutEffect)(() => {
                i && !Object.is(r.state[e], n) && r.setState({ ...r.state,
                    [e]: n
                })
            }, [r, e, n, i])
        }
        select(e, t, n, r) {
            return (0, this.selectors[e])(this.state, t, n, r)
        }
        useState(e, n, r, i) {
            return t.useDebugValue(e), (0, p.useStore)(this, this.selectors[e], n, r, i)
        }
        useContextCallback(e, n) {
            t.useDebugValue(e);
            let i = (0, s.useStableCallback)(n ? ? r.NOOP);
            this.context[e] = i
        }
        useStateSetter(e) {
            let n = t.useRef(void 0);
            return void 0 === n.current && (n.current = t => {
                this.set(e, t)
            }), n.current
        }
        observe(e, t) {
            let n, r = (n = "function" == typeof e ? e : this.selectors[e])(this.state);
            return t(r, r, this), this.subscribe(e => {
                let i = n(e);
                if (!Object.is(r, i)) {
                    let e = r;
                    r = i, t(i, e, this)
                }
            })
        }
    }
    e.s(["ReactStore", 0, g], 1252);
    var h = e.i(61286),
        m = e.i(57940);
    let E = {
        open: (0, d.createSelector)(e => e.open),
        transitionStatus: (0, d.createSelector)(e => e.transitionStatus),
        domReferenceElement: (0, d.createSelector)(e => e.domReferenceElement),
        referenceElement: (0, d.createSelector)(e => e.positionReference ? ? e.referenceElement),
        floatingElement: (0, d.createSelector)(e => e.floatingElement),
        floatingId: (0, d.createSelector)(e => e.floatingId)
    };
    class b extends g {
        constructor(e) {
            const {
                syncOnly: t,
                nested: n,
                onOpenChange: r,
                triggerElements: i,
                ...s
            } = e;
            super({ ...s,
                positionReference: s.referenceElement,
                domReferenceElement: s.referenceElement
            }, {
                onOpenChange: r,
                dataRef: {
                    current: {}
                },
                events: (0, h.createEventEmitter)(),
                nested: n,
                triggerElements: i
            }, E), this.syncOnly = t
        }
        syncOpenEvent = (e, t) => {
            (!e || !this.state.open || null != t && (0, m.isClickLikeEvent)(t)) && (this.context.dataRef.current.openEvent = e ? t : void 0)
        };
        dispatchOpenChange = (e, t) => {
            this.syncOpenEvent(e, t.event);
            let n = {
                open: e,
                reason: t.reason,
                nativeEvent: t.event,
                nested: this.context.nested,
                triggerElement: t.trigger
            };
            this.context.events.emit("openchange", n)
        };
        setOpen = (e, t) => {
            this.syncOnly || this.dispatchOpenChange(e, t), this.context.onOpenChange ? .(e, t)
        }
    }

    function v(e) {
        let {
            popupStore: n,
            treatPopupAsFloatingElement: r = !1,
            floatingRootContext: i,
            floatingId: s,
            nested: u,
            onOpenChange: l
        } = e, a = n.useState("open"), d = n.useState("activeTriggerElement"), f = n.useState(r ? "popupElement" : "positionerElement"), p = n.context.triggerElements, g = t.useRef(null);
        void 0 === i && null === g.current && (g.current = new b({
            open: a,
            transitionStatus: void 0,
            referenceElement: d,
            floatingElement: f,
            triggerElements: p,
            onOpenChange: l,
            floatingId: s,
            syncOnly: !0,
            nested: u
        }));
        let h = i ? ? g.current;
        return n.useSyncedValue("floatingId", s), (0, o.useIsoLayoutEffect)(() => {
            let e = {
                open: a,
                floatingId: s,
                referenceElement: d,
                floatingElement: f
            };
            (0, c.isElement)(d) && (e.domReferenceElement = d), h.state.positionReference === h.state.referenceElement && (e.positionReference = d), h.update(e)
        }, [a, s, d, f, h]), h.context.onOpenChange = l, h.context.nested = u, h
    }
    e.s(["FloatingRootStore", 0, b], 56341), e.s(["useSyncedFloatingRootContext", 0, v], 50527);
    var S = e.i(23910),
        y = e.i(37584),
        T = e.i(75606),
        C = e.i(56434);
    let O = {
        tabIndex: -1,
        [l.FOCUSABLE_ATTRIBUTE]: ""
    };

    function R(e, n) {
        let r = t.useRef(null),
            i = t.useRef(null);
        return t.useCallback(t => {
            if (void 0 === e) return;
            let s = !1;
            if (null !== r.current) {
                let e = r.current,
                    t = i.current,
                    o = n.context.triggerElements.getById(e);
                t && o === t && (n.context.triggerElements.delete(e), s = !0), r.current = null, i.current = null
            }
            if (null !== t && (r.current = e, i.current = t, n.context.triggerElements.add(e, t), s = !0), s) {
                let e = n.context.triggerElements.size;
                n.select("open") && n.state.triggerCount !== e && n.set("triggerCount", e)
            }
        }, [n, e])
    }

    function x(e, t, n, r = !1) {
        t ? e.preventUnmountingOnClose = !1 : r && (e.preventUnmountingOnClose = !0);
        let i = n ? .id ? ? null;
        (i || t) && (e.activeTriggerId = i, e.activeTriggerElement = n ? ? null)
    }

    function I(e) {
        let t = !1;
        return e.preventUnmountOnClose = () => {
            t = !0
        }, () => t
    }
    e.s(["FOCUSABLE_POPUP_PROPS", 0, O, "applyPopupOpenChange", 0, function(e, t, r, i = {}) {
        let s = r.reason,
            o = s === C.REASONS.triggerHover,
            u = t && s === C.REASONS.triggerFocus,
            l = !t && (s === C.REASONS.triggerPress || s === C.REASONS.escapeKey),
            a = I(r);
        if (e.context.onOpenChange ? .(t, r), r.isCanceled) return;
        i.onBeforeDispatch ? .(), e.state.floatingRootContext.dispatchOpenChange(t, r);
        let c = () => {
            let n = { ...i.extraState,
                open: t
            };
            u ? n.instantType = "focus" : l ? n.instantType = "dismiss" : o && (n.instantType = void 0), x(n, t, r.trigger, a()), e.update(n)
        };
        o ? n.flushSync(c) : c()
    }, "attachPreventUnmountOnClose", 0, I, "createDefaultInitialFocus", 0, function(e) {
        return t => "touch" !== t || e.current
    }, "setPopupOpenState", 0, x, "useImplicitActiveTrigger", 0, function(e, t = {}) {
        let {
            closeOnActiveTriggerUnmount: n = !1
        } = t, r = e.useState("open"), i = e.useState("triggerCount");
        (0, o.useIsoLayoutEffect)(() => {
            if (!r) {
                0 !== e.state.triggerCount && e.set("triggerCount", 0);
                return
            }
            let t = e.context.triggerElements.size,
                i = {};
            e.state.triggerCount !== t && (i.triggerCount = t);
            let s = e.select("activeTriggerId"),
                o = null;
            if (s) {
                let t = e.context.triggerElements.getById(s);
                t ? t !== e.state.activeTriggerElement && (i.activeTriggerElement = t) : o = s
            }
            if (!o && !s && 1 === t) {
                let t = e.context.triggerElements.entries().next();
                if (!t.done) {
                    let [e, n] = t.value;
                    i.activeTriggerId = e, i.activeTriggerElement = n
                }
            }(void 0 !== i.triggerCount || void 0 !== i.activeTriggerId || void 0 !== i.activeTriggerElement) && e.update(i), o && n && queueMicrotask(() => {
                if (e.select("open") && e.select("activeTriggerId") === o && !e.context.triggerElements.getById(o)) {
                    let t = (0, T.createChangeEventDetails)(C.REASONS.none);
                    e.setOpen(!1, t), t.isCanceled || e.update({
                        activeTriggerId: null,
                        activeTriggerElement: null
                    })
                }
            })
        }, [r, e, i, n])
    }, "useInitialOpenSync", 0, function(e, t, n, r) {
        (0, u.useOnFirstRender)(() => {
            void 0 === t && !1 === e.state.open && n && (e.state = { ...e.state,
                open: !0,
                activeTriggerId: r,
                preventUnmountingOnClose: !1
            })
        })
    }, "useOpenStateTransitions", 0, function(e, t, n) {
        let {
            mounted: r,
            setMounted: i,
            transitionStatus: o
        } = (0, S.useTransitionStatus)(e), u = t.useState("preventUnmountingOnClose"), l = !e && u;
        t.useSyncedValues({
            mounted: r,
            transitionStatus: o,
            preventUnmountingOnClose: l
        });
        let a = (0, s.useStableCallback)(() => {
            i(!1), t.update({
                activeTriggerId: null,
                activeTriggerElement: null,
                mounted: !1,
                preventUnmountingOnClose: !1
            }), n ? .(), t.context.onOpenChangeComplete ? .(!1)
        });
        return (0, y.useOpenChangeComplete)({
            enabled: r && !e && !l,
            open: e,
            ref: t.context.popupRef,
            onComplete() {
                e || a()
            }
        }), {
            forceUnmount: a,
            transitionStatus: o
        }
    }, "usePopupInteractionProps", 0, function(e, t) {
        e.useSyncedValues(t), (0, o.useIsoLayoutEffect)(() => () => {
            e.update({
                activeTriggerProps: r.EMPTY_OBJECT,
                inactiveTriggerProps: r.EMPTY_OBJECT,
                popupProps: r.EMPTY_OBJECT
            })
        }, [e])
    }, "usePopupRootSync", 0, function(e, t) {
        (0, o.useIsoLayoutEffect)(() => {
            t || null === e.state.openMethod || e.set("openMethod", null)
        }, [t, e]), (0, o.useIsoLayoutEffect)(() => () => {
            null !== e.state.openMethod && e.set("openMethod", null)
        }, [e])
    }, "usePopupStore", 0, function(e, n, r = !1) {
        let s = (0, i.useId)(),
            o = null != (0, a.useFloatingParentNodeId)(),
            u = t.useRef(null);
        void 0 === e && null === u.current && (u.current = n(s, o));
        let l = e ? ? u.current;
        return v({
            popupStore: l,
            treatPopupAsFloatingElement: r,
            floatingRootContext: l.state.floatingRootContext,
            floatingId: s,
            nested: o,
            onOpenChange: l.setOpen
        }), {
            store: l,
            internalStore: u.current
        }
    }, "useTriggerDataForwarding", 0, function(e, t, n, r) {
        let i = n.useState("isMountedByTrigger", e),
            u = R(e, n),
            l = (0, s.useStableCallback)(t => {
                if (u(t), !t) return;
                let i = n.select("open"),
                    s = n.select("activeTriggerId");
                s === e ? n.update({
                    activeTriggerElement: t,
                    ...i ? r : null
                }) : null == s && i && n.update({
                    activeTriggerId: e,
                    activeTriggerElement: t,
                    ...r
                })
            });
        return (0, o.useIsoLayoutEffect)(() => {
            i && n.update({
                activeTriggerElement: t.current,
                ...r
            })
        }, [i, n, t, ...Object.values(r)]), {
            registerTrigger: l,
            isMountedByThisTrigger: i
        }
    }, "useTriggerRegistration", 0, R], 64111)
}, 90627, e => {
    "use strict";
    e.i(47167), e.s(["PopupTriggerMap", 0, class {
        constructor() {
            this.elementsSet = new Set, this.idMap = new Map
        }
        add(e, t) {
            let n = this.idMap.get(e);
            n !== t && (void 0 !== n && this.elementsSet.delete(n), this.elementsSet.add(t), this.idMap.set(e, t))
        }
        delete(e) {
            let t = this.idMap.get(e);
            t && (this.elementsSet.delete(t), this.idMap.delete(e))
        }
        hasElement(e) {
            return this.elementsSet.has(e)
        }
        hasMatchingElement(e) {
            for (let t of this.elementsSet)
                if (e(t)) return !0;
            return !1
        }
        getById(e) {
            return this.idMap.get(e)
        }
        entries() {
            return this.idMap.entries()
        }
        elements() {
            return this.elementsSet.values()
        }
        get size() {
            return this.idMap.size
        }
    }])
}, 96499, e => {
    "use strict";
    let t;
    var n = e.i(15504),
        r = e.i(88940);
    let i = [];

    function s(e) {
        let n = (n, s) => {
            let u, l = (0, r.useRefWithInit)(o).current;
            try {
                for (let e of (t = l, i)) e.before(l);
                for (let t of (u = e(n, s), i)) t.after(l);
                l.didInitialize = !0
            } finally {
                t = void 0
            }
            return u
        };
        return n.displayName = e.displayName || e.name, n
    }

    function o() {
        return {
            didInitialize: !1
        }
    }
    e.s(["fastComponent", 0, s, "fastComponentRef", 0, function(e) {
        return n.forwardRef(s(e))
    }, "getInstance", 0, function() {
        return t
    }, "register", 0, function(e) {
        i.push(e)
    }])
}, 44394, e => {
    "use strict";
    var t = e.i(58321);
    e.s(["inertValue", 0, function(e) {
        return (0, t.isReactVersionAtLeast)(19) ? e : e ? "true" : void 0
    }])
}, 65420, e => {
    "use strict";
    e.s(["mergeCleanups", 0, function(...e) {
        return () => {
            for (let t = 0; t < e.length; t += 1) {
                let n = e[t];
                n && n()
            }
        }
    }])
}, 14935, 34346, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(2239),
        r = e.i(30224),
        i = e.i(58321),
        s = e.i(96499);
    let o = (0, i.isReactVersionAtLeast)(19) ? function(e, r, i, o, u) {
        let l, a = (0, s.getInstance)();
        if (!a) {
            let s;
            return s = t.useCallback(() => r(e.getSnapshot(), i, o, u), [e, r, i, o, u]), (0, n.useSyncExternalStore)(e.subscribe, s, s)
        }
        let c = a.syncIndex;
        return a.syncIndex += 1, a.didInitialize ? (l = a.syncHooks[c]).store === e && l.selector === r && Object.is(l.a1, i) && Object.is(l.a2, o) && Object.is(l.a3, u) || (l.store !== e && (a.didChangeStore = !0), l.store = e, l.selector = r, l.a1 = i, l.a2 = o, l.a3 = u, l.value = r(e.getSnapshot(), i, o, u)) : (l = {
            store: e,
            selector: r,
            a1: i,
            a2: o,
            a3: u,
            value: r(e.getSnapshot(), i, o, u)
        }, a.syncHooks.push(l)), l.value
    } : function(e, t, n, i, s) {
        return (0, r.useSyncExternalStoreWithSelector)(e.subscribe, e.getSnapshot, e.getSnapshot, e => t(e, n, i, s))
    };

    function u(e, t, n, r, i) {
        return o(e, t, n, r, i)
    }(0, s.register)({
        before(e) {
            e.syncIndex = 0, e.didInitialize || (e.syncTick = 1, e.syncHooks = [], e.didChangeStore = !0, e.getSnapshot = () => {
                let t = !1;
                for (let n = 0; n < e.syncHooks.length; n += 1) {
                    let r = e.syncHooks[n],
                        i = r.selector(r.store.state, r.a1, r.a2, r.a3);
                    Object.is(r.value, i) || (t = !0, r.value = i)
                }
                return t && (e.syncTick += 1), e.syncTick
            })
        },
        after(e) {
            e.syncHooks.length > 0 && (e.didChangeStore && (e.didChangeStore = !1, e.subscribe = t => {
                let n = new Set;
                for (let t of e.syncHooks) n.add(t.store);
                let r = [];
                for (let e of n) r.push(e.subscribe(t));
                return () => {
                    for (let e of r) e()
                }
            }), (0, n.useSyncExternalStore)(e.subscribe, e.getSnapshot, e.getSnapshot))
        }
    }), e.s(["useStore", 0, u], 34346), e.s(["Store", 0, class {
        constructor(e) {
            this.state = e, this.listeners = new Set, this.updateTick = 0
        }
        subscribe = e => (this.listeners.add(e), () => {
            this.listeners.delete(e)
        });
        getSnapshot = () => this.state;
        setState(e) {
            if (this.state === e) return;
            this.state = e, this.updateTick += 1;
            let t = this.updateTick;
            for (let n of this.listeners) {
                if (t !== this.updateTick) return;
                n(e)
            }
        }
        update(e) {
            for (let t in e)
                if (!Object.is(this.state[t], e[t])) return void this.setState({ ...this.state,
                    ...e
                })
        }
        set(e, t) {
            Object.is(this.state[e], t) || this.setState({ ...this.state,
                [e]: t
            })
        }
        notifyAll() {
            let e = { ...this.state
            };
            this.setState(e)
        }
        use(e, t, n, r) {
            return u(this, e, t, n, r)
        }
    }], 14935)
}, 16269, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332);
    e.s(["createSelector", 0, (e, n, r, i, s, o, ...u) => {
        let l;
        if (u.length > 0) throw Error((0, t.default)(1));
        if (e && n && r && i && s && o) l = (t, u, l, a) => o(e(t, u, l, a), n(t, u, l, a), r(t, u, l, a), i(t, u, l, a), s(t, u, l, a), u, l, a);
        else if (e && n && r && i && s) l = (t, o, u, l) => s(e(t, o, u, l), n(t, o, u, l), r(t, o, u, l), i(t, o, u, l), o, u, l);
        else if (e && n && r && i) l = (t, s, o, u) => i(e(t, s, o, u), n(t, s, o, u), r(t, s, o, u), s, o, u);
        else if (e && n && r) l = (t, i, s, o) => r(e(t, i, s, o), n(t, i, s, o), i, s, o);
        else if (e && n) l = (t, r, i, s) => n(e(t, r, i, s), r, i, s);
        else if (e) l = e;
        else throw Error("Missing arguments");
        return l
    }])
}, 13203, e => {
    "use strict";
    var t = e.i(15504);
    e.s(["useOnFirstRender", 0, function(e) {
        let n = t.useRef(!0);
        n.current && (n.current = !1, e())
    }])
}, 55838, (e, t, n) => {
    "use strict";
    var r = e.r(15504),
        i = "function" == typeof Object.is ? Object.is : function(e, t) {
            return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t
        },
        s = r.useState,
        o = r.useEffect,
        u = r.useLayoutEffect,
        l = r.useDebugValue;

    function a(e) {
        var t = e.getSnapshot;
        e = e.value;
        try {
            var n = t();
            return !i(e, n)
        } catch (e) {
            return !0
        }
    }
    var c = "u" < typeof window || void 0 === window.document || void 0 === window.document.createElement ? function(e, t) {
        return t()
    } : function(e, t) {
        var n = t(),
            r = s({
                inst: {
                    value: n,
                    getSnapshot: t
                }
            }),
            i = r[0].inst,
            c = r[1];
        return u(function() {
            i.value = n, i.getSnapshot = t, a(i) && c({
                inst: i
            })
        }, [e, n, t]), o(function() {
            return a(i) && c({
                inst: i
            }), e(function() {
                a(i) && c({
                    inst: i
                })
            })
        }, [e]), l(n), n
    };
    n.useSyncExternalStore = void 0 !== r.useSyncExternalStore ? r.useSyncExternalStore : c
}, 2239, (e, t, n) => {
    "use strict";
    e.i(47167), t.exports = e.r(55838)
}, 52822, (e, t, n) => {
    "use strict";
    var r = e.r(15504),
        i = e.r(2239),
        s = "function" == typeof Object.is ? Object.is : function(e, t) {
            return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t
        },
        o = i.useSyncExternalStore,
        u = r.useRef,
        l = r.useEffect,
        a = r.useMemo,
        c = r.useDebugValue;
    n.useSyncExternalStoreWithSelector = function(e, t, n, r, i) {
        var d = u(null);
        if (null === d.current) {
            var f = {
                hasValue: !1,
                value: null
            };
            d.current = f
        } else f = d.current;
        var p = o(e, (d = a(function() {
            function e(e) {
                if (!l) {
                    if (l = !0, o = e, e = r(e), void 0 !== i && f.hasValue) {
                        var t = f.value;
                        if (i(t, e)) return u = t
                    }
                    return u = e
                }
                if (t = u, s(o, e)) return t;
                var n = r(e);
                return void 0 !== i && i(t, n) ? (o = e, t) : (o = e, u = n)
            }
            var o, u, l = !1,
                a = void 0 === n ? null : n;
            return [function() {
                return e(t())
            }, null === a ? void 0 : function() {
                return e(a())
            }]
        }, [t, n, r, i]))[0], d[1]);
        return l(function() {
            f.hasValue = !0, f.value = p
        }, [p]), c(p), p
    }
}, 30224, (e, t, n) => {
    "use strict";
    e.i(47167), t.exports = e.r(52822)
}]);