(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 60891, 36760, 64042, e => {
    "use strict";
    var t = e.i(15504),
        r = e.i(8445),
        a = e.i(46376),
        n = e.i(8868),
        l = e.i(67865),
        i = e.i(46265),
        s = e.i(29315),
        u = e.i(75606),
        o = e.i(56434),
        c = e.i(46420),
        d = e.i(21082),
        m = e.i(49055),
        f = e.i(47554),
        g = e.i(96296),
        b = e.i(3596),
        p = e.i(57940);

    function h(e, t, r) {
        switch (e) {
            case "vertical":
                return t;
            case "horizontal":
                return r;
            default:
                return t || r
        }
    }

    function y(e, t) {
        return h(t, e === m.ARROW_UP || e === m.ARROW_DOWN, e === m.ARROW_LEFT || e === m.ARROW_RIGHT)
    }

    function x(e, t, r) {
        return h(t, e === m.ARROW_DOWN, r ? e === m.ARROW_LEFT : e === m.ARROW_RIGHT) || "Enter" === e || " " === e || "" === e
    }
    e.s(["useListNavigation", 0, function(e, v) {
        let {
            listRef: k,
            activeIndex: N,
            onNavigate: C = () => {},
            enabled: E = !0,
            selectedIndex: M = null,
            allowEscape: R = !1,
            loopFocus: w = !1,
            nested: L = !1,
            rtl: O = !1,
            virtual: S = !1,
            focusItemOnOpen: I = "auto",
            focusItemOnHover: A = !0,
            openOnArrowKeyDown: T = !0,
            disabledIndices: D,
            orientation: P = "vertical",
            parentOrientation: j,
            id: _,
            resetOnPointerLeave: F = !0,
            externalTree: z,
            grid: W
        } = v, V = null != W, q = "rootStore" in e ? e.rootStore : e, U = q.useState("open"), B = q.useState("floatingElement"), G = q.useState("domReferenceElement"), H = q.context.dataRef, K = (0, g.getFloatingFocusElement)(B), X = (0, g.isTypeableCombobox)(G), Y = (0, i.useValueAsRef)(K), $ = (0, c.useFloatingParentNodeId)(), Z = (0, c.useFloatingTree)(z), J = t.useRef(I), Q = t.useRef(M ? ? -1), ee = t.useRef(null), et = t.useRef(!0), er = (0, l.useStableCallback)(e => {
            C(-1 === Q.current ? null : Q.current, e)
        }), ea = t.useRef(!!B), en = t.useRef(U), el = t.useRef(!1), ei = t.useRef(!1), es = t.useRef(null), eu = (0, i.useValueAsRef)(D), eo = (0, i.useValueAsRef)(U), ec = (0, i.useValueAsRef)(M), ed = (0, i.useValueAsRef)(F), em = (0, r.useAnimationFrame)(), ef = (0, r.useAnimationFrame)(), eg = (0, l.useStableCallback)(() => {
            function e(e) {
                S ? Z ? .events.emit("virtualfocus", e) : es.current = (0, b.enqueueFocus)(e, {
                    sync: el.current,
                    preventScroll: !0
                })
            }
            let t = k.current[Q.current],
                r = ei.current;
            t && e(t), (el.current ? e => e() : e => em.request(e))(() => {
                let a = k.current[Q.current] || t;
                !a || (t || e(a), ev && (r || !et.current) && a.scrollIntoView ? .({
                    block: "nearest",
                    inline: "nearest"
                }))
            })
        });
        (0, a.useIsoLayoutEffect)(() => {
            H.current.orientation = P
        }, [H, P]), (0, a.useIsoLayoutEffect)(() => {
            E && (U && B ? (Q.current = M ? ? -1, J.current && null != M && (ei.current = !0, er())) : ea.current && (Q.current = -1, er()))
        }, [E, U, B, M, er]), (0, a.useIsoLayoutEffect)(() => {
            if (E) {
                if (!U) {
                    el.current = !1;
                    return
                }
                if (B)
                    if (null == N) {
                        if (el.current = !1, null != ec.current) return;
                        if (ea.current && (Q.current = -1, eg()), (!en.current || !ea.current) && J.current && (null != ee.current || !0 === J.current && null == ee.current)) {
                            let e = 0,
                                t = () => {
                                    null == k.current[0] ? (e < 2 && (e ? e => ef.request(e) : queueMicrotask)(t), e += 1) : (Q.current = null == ee.current || x(ee.current, P, O) || L ? (0, d.getMinListIndex)(k) : (0, d.getMaxListIndex)(k), ee.current = null, er())
                                };
                            t()
                        }
                    } else(0, d.isIndexOutOfListBounds)(k.current, N) || (Q.current = N, eg(), ei.current = !1)
            }
        }, [E, U, B, N, ec, L, k, P, O, er, eg, ef]), (0, a.useIsoLayoutEffect)(() => {
            if (!E || B || !Z || S || !ea.current) return;
            let e = Z.nodesRef.current,
                t = e.find(e => e.id === $) ? .context ? .elements.floating,
                r = (0, f.activeElement)((0, n.ownerDocument)(G ? ? t ? ? null)),
                a = e.some(e => e.context && (0, f.contains)(e.context.elements.floating, r));
            t && !a && et.current && t.focus({
                preventScroll: !0
            })
        }, [E, B, G, Z, $, S]), (0, a.useIsoLayoutEffect)(() => {
            en.current = U, ea.current = !!B
        }), (0, a.useIsoLayoutEffect)(() => {
            U || (ee.current = null, J.current = I)
        }, [U, I]);
        let eb = null != N,
            ep = (0, l.useStableCallback)(e => {
                if (!eo.current) return;
                let t = k.current.indexOf(e.currentTarget); - 1 !== t && (Q.current !== t || N !== t) && (Q.current = t, er(e))
            }),
            eh = (0, l.useStableCallback)(() => j ? ? Z ? .nodesRef.current.find(e => e.id === $) ? .context ? .dataRef ? .current.orientation),
            ey = (0, l.useStableCallback)(() => (0, d.getMinListIndex)(k, eu.current)),
            ex = (0, l.useStableCallback)(e => {
                var t;
                let r, a;
                if (et.current = !1, el.current = !0, 229 === e.which || !eo.current && e.currentTarget === Y.current) return;
                if (L && (t = e.key, r = O ? t === m.ARROW_RIGHT : t === m.ARROW_LEFT, a = t === m.ARROW_UP, "both" === P || "horizontal" === P && V ? "Escape" === t : h(P, r, a))) {
                    y(e.key, eh()) || (0, p.stopEvent)(e), q.setOpen(!1, (0, u.createChangeEventDetails)(o.REASONS.listNavigation, e.nativeEvent)), (0, s.isHTMLElement)(G) && (S ? Z ? .events.emit("virtualfocus", G) : G.focus());
                    return
                }
                let n = Q.current,
                    l = (0, d.getMinListIndex)(k, D),
                    i = (0, d.getMaxListIndex)(k, D);
                if (X || ("Home" === e.key && ((0, p.stopEvent)(e), Q.current = l, er(e)), "End" === e.key && ((0, p.stopEvent)(e), Q.current = i, er(e))), null != W) {
                    let t = W(e, Q.current, k, P, w, O, D, l, i);
                    if (null != t && (Q.current = t, er(e)), "both" === P) return
                }
                if (y(e.key, P)) {
                    if ((0, p.stopEvent)(e), U && !S && (0, f.activeElement)(e.currentTarget.ownerDocument) === e.currentTarget) {
                        Q.current = x(e.key, P, O) ? l : i, er(e);
                        return
                    }
                    x(e.key, P, O) ? w ? n >= i ? R && n !== k.current.length ? Q.current = -1 : (el.current = !1, Q.current = l) : Q.current = (0, d.findNonDisabledListIndex)(k.current, {
                        startingIndex: n,
                        disabledIndices: D
                    }) : Q.current = Math.min(i, (0, d.findNonDisabledListIndex)(k.current, {
                        startingIndex: n,
                        disabledIndices: D
                    })) : w ? n <= l ? R && -1 !== n ? Q.current = k.current.length : (el.current = !1, Q.current = i) : Q.current = (0, d.findNonDisabledListIndex)(k.current, {
                        startingIndex: n,
                        decrement: !0,
                        disabledIndices: D
                    }) : Q.current = Math.max(l, (0, d.findNonDisabledListIndex)(k.current, {
                        startingIndex: n,
                        decrement: !0,
                        disabledIndices: D
                    })), (0, d.isIndexOutOfListBounds)(k.current, Q.current) && (Q.current = -1), er(e)
                }
            }),
            ev = t.useMemo(() => ({
                onFocus(e) {
                    el.current = !0, ep(e)
                },
                onClick: ({
                    currentTarget: e
                }) => e.focus({
                    preventScroll: !0
                }),
                onMouseMove(e) {
                    el.current = !0, ei.current = !1, A && ep(e)
                },
                onPointerLeave(e) {
                    if (!eo.current || !et.current || "touch" === e.pointerType) return;
                    el.current = !0;
                    let t = e.relatedTarget;
                    if (!(!A || k.current.includes(t)) && ed.current && (es.current ? .(), es.current = null, Q.current = -1, er(e), !S)) {
                        let e = Y.current,
                            t = (0, f.activeElement)((0, n.ownerDocument)(e));
                        e && (0, f.contains)(e, t) && e.focus({
                            preventScroll: !0
                        })
                    }
                }
            }), [ep, eo, Y, A, k, er, ed, S]),
            ek = t.useMemo(() => S && U && eb && {
                "aria-activedescendant": `${_}-${N}`
            }, [S, U, eb, _, N]),
            eN = t.useMemo(() => ({
                "aria-orientation": "both" === P ? void 0 : P,
                ...!X ? ek : {},
                onKeyDown(e) {
                    if ("Tab" === e.key && e.shiftKey && U && !S) {
                        let t = (0, f.getTarget)(e.nativeEvent);
                        if (t && !(0, f.contains)(Y.current, t)) return;
                        (0, p.stopEvent)(e), q.setOpen(!1, (0, u.createChangeEventDetails)(o.REASONS.focusOut, e.nativeEvent)), (0, s.isHTMLElement)(G) && G.focus();
                        return
                    }
                    ex(e)
                },
                onPointerMove() {
                    et.current = !0
                }
            }), [ek, ex, Y, P, X, q, U, S, G]),
            eC = t.useMemo(() => {
                function e(e) {
                    q.setOpen(!0, (0, u.createChangeEventDetails)(o.REASONS.listNavigation, e.nativeEvent, e.currentTarget))
                }

                function t(e) {
                    "auto" === I && (0, p.isVirtualClick)(e.nativeEvent) && (J.current = !S)
                }

                function r(e) {
                    J.current = I, "auto" === I && (0, p.isVirtualPointerEvent)(e.nativeEvent) && (J.current = !0)
                }
                return {
                    onKeyDown(t) {
                        var r, a;
                        let n = q.select("open");
                        et.current = !1;
                        let l = t.key.startsWith("Arrow"),
                            i = (r = t.key, a = eh(), h(a, O ? r === m.ARROW_LEFT : r === m.ARROW_RIGHT, r === m.ARROW_DOWN)),
                            s = y(t.key, P),
                            u = (L ? i : s) || "Enter" === t.key || "" === t.key.trim();
                        if (S && n) return ex(t);
                        if (n || T || !l) {
                            if (u) {
                                let e = y(t.key, eh());
                                ee.current = L && e ? null : t.key
                            }
                            if (L) {
                                i && ((0, p.stopEvent)(t), n ? (Q.current = ey(), er(t)) : e(t));
                                return
                            }
                            s && (null != ec.current && (Q.current = ec.current), (0, p.stopEvent)(t), !n && T ? e(t) : ex(t), n && er(t))
                        }
                    },
                    onFocus(e) {
                        q.select("open") && !S && (Q.current = -1, er(e))
                    },
                    onPointerDown: r,
                    onPointerEnter: r,
                    onMouseDown: t,
                    onClick: t
                }
            }, [ex, I, ey, L, er, q, T, P, eh, O, ec, S]),
            eE = t.useMemo(() => ({ ...ek,
                ...eC
            }), [ek, eC]);
        return t.useMemo(() => E ? {
            reference: eE,
            floating: eN,
            item: ev,
            trigger: eC
        } : {}, [E, eE, eN, eC, ev])
    }], 60891);
    var v = e.i(39957),
        k = e.i(56789);
    e.s(["useTypeahead", 0, function(e, r) {
        let {
            listRef: n,
            elementsRef: i,
            activeIndex: s,
            onMatch: u,
            disabledIndices: o,
            onTyping: c,
            enabled: m = !0,
            resetMs: g = 750,
            selectedIndex: b = null
        } = r, h = "rootStore" in e ? e.rootStore : e, y = h.useState("open"), x = (0, v.useTimeout)(), N = t.useRef(""), C = t.useRef(b ? ? s ? ? -1), E = t.useRef(null), M = (0, l.useStableCallback)(e => {
            function t(e) {
                let t;
                return !!(!(t = i ? .current[e]) || (0, d.isElementVisible)(t)) && (null == o || !(0, d.isListIndexDisabled)(k.EMPTY_ARRAY, e, o))
            }

            function r(e, a, n = 0) {
                if (0 === e.length) return -1;
                let l = (n % e.length + e.length) % e.length,
                    i = a.toLowerCase();
                for (let r = 0; r < e.length; r += 1) {
                    let a = (l + r) % e.length,
                        n = e[a];
                    if (n ? .toLowerCase().startsWith(i) && t(a)) return a
                }
                return -1
            }
            let a = n.current;
            if (N.current.length > 0 && " " === e.key && ((0, p.stopEvent)(e), c ? .(!0)), N.current.length > 0 && " " !== N.current[0] && -1 === r(a, N.current) && " " !== e.key && c ? .(!1), null == a || 1 !== e.key.length || e.ctrlKey || e.metaKey || e.altKey) return;
            y && " " !== e.key && ((0, p.stopEvent)(e), c ? .(!0));
            let l = "" === N.current;
            l && (C.current = b ? ? s ? ? -1), a.every((e, r) => !(e && t(r)) || e[0] ? .toLowerCase() !== e[1] ? .toLowerCase()) && N.current === e.key && (N.current = "", C.current = E.current), N.current += e.key, x.start(g, () => {
                N.current = "", C.current = E.current, c ? .(!1)
            });
            let m = l ? b ? ? s ? ? -1 : C.current,
                f = r(a, N.current, (m ? ? 0) + 1); - 1 !== f ? (u ? .(f), E.current = f) : " " !== e.key && (N.current = "", c ? .(!1))
        }), R = (0, l.useStableCallback)(e => {
            let t = e.relatedTarget,
                r = h.select("domReferenceElement"),
                a = h.select("floatingElement");
            (0, f.contains)(r, t) || (0, f.contains)(a, t) || (x.clear(), N.current = "", C.current = E.current, c ? .(!1))
        });
        (0, a.useIsoLayoutEffect)(() => {
            (y || null === b) && (x.clear(), E.current = null, "" !== N.current && (N.current = ""))
        }, [y, b, x]), (0, a.useIsoLayoutEffect)(() => {
            y && "" === N.current && (C.current = b ? ? s ? ? -1)
        }, [y, b, s]);
        let w = t.useMemo(() => ({
            onKeyDown: M,
            onBlur: R
        }), [M, R]);
        return t.useMemo(() => m ? {
            reference: w,
            floating: w
        } : {}, [m, w])
    }], 36760);
    var N = e.i(33848),
        C = e.i(28744);
    e.s(["getPseudoElementBounds", 0, function(e) {
        let t = e.getBoundingClientRect(),
            r = (0, N.ownerWindow)(e);
        if (C.platform.env.jsdom) return t;
        let a = r.getComputedStyle(e, "::before"),
            n = r.getComputedStyle(e, "::after");
        if ("none" === a.content && "none" === n.content) return t;
        let l = parseFloat(a.width) || 0,
            i = parseFloat(a.height) || 0,
            s = parseFloat(n.width) || 0,
            u = parseFloat(n.height) || 0,
            o = Math.max(t.width, l, s),
            c = Math.max(t.height, i, u),
            d = o - t.width,
            m = c - t.height;
        return {
            left: t.left - d / 2,
            right: t.right + d / 2,
            top: t.top - m / 2,
            bottom: t.bottom + m / 2
        }
    }], 64042)
}, 53687, e => {
    "use strict";
    var t = e.i(15504),
        r = e.i(88940),
        a = e.i(67865),
        n = e.i(46376),
        l = e.i(45356),
        i = e.i(43476);

    function s() {
        return new Map
    }

    function u() {
        return new Set
    }

    function o(e, t) {
        let r = e.compareDocumentPosition(t);
        return r & Node.DOCUMENT_POSITION_FOLLOWING || r & Node.DOCUMENT_POSITION_CONTAINED_BY ? -1 : r & Node.DOCUMENT_POSITION_PRECEDING || r & Node.DOCUMENT_POSITION_CONTAINS ? 1 : 0
    }
    e.s(["CompositeList", 0, function(e) {
        let {
            children: c,
            elementsRef: d,
            labelsRef: m,
            onMapChange: f
        } = e, g = (0, a.useStableCallback)(f), b = t.useRef(0), p = (0, r.useRefWithInit)(u).current, h = (0, r.useRefWithInit)(s).current, [y, x] = t.useState(0), v = t.useRef(y), k = (0, a.useStableCallback)((e, t) => {
            h.set(e, t ? ? null), v.current += 1, x(v.current)
        }), N = (0, a.useStableCallback)(e => {
            h.delete(e), v.current += 1, x(v.current)
        }), C = t.useMemo(() => {
            let e = new Map;
            return Array.from(h.keys()).filter(e => e.isConnected).sort(o).forEach((t, r) => {
                let a = h.get(t) ? ? {};
                e.set(t, { ...a,
                    index: r
                })
            }), e
        }, [h, y]);
        (0, n.useIsoLayoutEffect)(() => {
            if ("function" != typeof MutationObserver || 0 === C.size) return;
            let e = new MutationObserver(e => {
                let t = new Set,
                    r = e => t.has(e) ? t.delete(e) : t.add(e);
                e.forEach(e => {
                    e.removedNodes.forEach(r), e.addedNodes.forEach(r)
                }), 0 === t.size && (v.current += 1, x(v.current))
            });
            return C.forEach((t, r) => {
                r.parentElement && e.observe(r.parentElement, {
                    childList: !0
                })
            }), () => {
                e.disconnect()
            }
        }, [C]), (0, n.useIsoLayoutEffect)(() => {
            v.current === y && (d.current.length !== C.size && (d.current.length = C.size), m && m.current.length !== C.size && (m.current.length = C.size), b.current = C.size), g(C)
        }, [g, C, d, m, y]), (0, n.useIsoLayoutEffect)(() => () => {
            d.current = []
        }, [d]), (0, n.useIsoLayoutEffect)(() => () => {
            m && (m.current = [])
        }, [m]);
        let E = (0, a.useStableCallback)(e => (p.add(e), () => {
            p.delete(e)
        }));
        (0, n.useIsoLayoutEffect)(() => {
            p.forEach(e => e(C))
        }, [p, C]);
        let M = t.useMemo(() => ({
            register: k,
            unregister: N,
            subscribeMapChange: E,
            elementsRef: d,
            labelsRef: m,
            nextIndexRef: b
        }), [k, N, E, d, m, b]);
        return (0, i.jsx)(l.CompositeListContext.Provider, {
            value: M,
            children: c
        })
    }])
}, 45356, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504);
    let r = t.createContext({
        register: () => {},
        unregister: () => {},
        subscribeMapChange: () => () => {},
        elementsRef: {
            current: []
        },
        nextIndexRef: {
            current: 0
        }
    });
    e.s(["CompositeListContext", 0, r, "useCompositeListContext", 0, function() {
        return t.useContext(r)
    }])
}, 73553, e => {
    "use strict";
    var t, r = e.i(15504),
        a = e.i(46376),
        n = e.i(45356);
    let l = ((t = {})[t.None = 0] = "None", t[t.GuessFromOrder = 1] = "GuessFromOrder", t);
    e.s(["IndexGuessBehavior", 0, l, "useCompositeListItem", 0, function(e = {}) {
        let {
            label: t,
            metadata: i,
            textRef: s,
            indexGuessBehavior: u,
            index: o
        } = e, {
            register: c,
            unregister: d,
            subscribeMapChange: m,
            elementsRef: f,
            labelsRef: g,
            nextIndexRef: b
        } = (0, n.useCompositeListContext)(), p = r.useRef(-1), [h, y] = r.useState(o ? ? (u === l.GuessFromOrder ? () => {
            if (-1 === p.current) {
                let e = b.current;
                b.current += 1, p.current = e
            }
            return p.current
        } : -1)), x = r.useRef(null), v = r.useCallback(e => {
            if (x.current = e, -1 !== h && null !== e && (f.current[h] = e, g)) {
                let r = void 0 !== t;
                g.current[h] = r ? t : s ? .current ? .textContent ? ? e.textContent
            }
        }, [h, f, g, t, s]);
        return (0, a.useIsoLayoutEffect)(() => {
            if (null != o) return;
            let e = x.current;
            if (e) return c(e, i), () => {
                d(e)
            }
        }, [o, c, d, i]), (0, a.useIsoLayoutEffect)(() => {
            if (null == o) return m(e => {
                let t = x.current ? e.get(x.current) ? .index : null;
                null != t && y(t)
            })
        }, [o, m, y]), {
            ref: v,
            index: h
        }
    }])
}, 72410, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504);
    let r = t.createContext(void 0),
        a = {
            disableStyleElements: !1
        };
    e.s(["useCSPContext", 0, function() {
        return t.useContext(r) ? ? a
    }])
}, 96533, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        r = e.i(15504);
    let a = r.createContext(void 0);
    e.s(["useToolbarRootContext", 0, function(e) {
        let n = r.useContext(a);
        if (void 0 === n && !e) throw Error((0, t.default)(69));
        return n
    }])
}, 50896, 1675, e => {
    "use strict";

    function t(e, r = Number.MIN_SAFE_INTEGER, a = Number.MAX_SAFE_INTEGER) {
        return Math.max(r, Math.min(e, a))
    }
    e.s(["clamp", 0, t], 1675), e.s(["SCROLL_EDGE_TOLERANCE_PX", 0, 1, "getMaxScrollOffset", 0, function(e, t) {
        return Math.max(0, e - t)
    }, "normalizeScrollOffset", 0, function(e, r) {
        if (r <= 0) return 0;
        let a = t(e, 0, r),
            n = r - a,
            l = a <= 1,
            i = n <= 1;
        return l && i ? a <= n ? 0 : r : l ? 0 : i ? r : a
    }], 50896)
}, 60837, e => {
    "use strict";
    e.i(47167);
    var t = e.i(43476);
    let r = "base-ui-disable-scrollbar";
    e.s(["styleDisableScrollbar", 0, {
        className: r,
        getElement: e => (0, t.jsx)("style", {
            nonce: e,
            href: r,
            precedence: "base-ui:low",
            children: `.${r}{scrollbar-width:none}.${r}::-webkit-scrollbar{display:none}`
        })
    }])
}, 33383, e => {
    "use strict";
    var t = e.i(15504),
        r = e.i(8868),
        a = e.i(45484),
        n = e.i(46376);
    e.s(["useAnchoredPopupScrollLock", 0, function(e, l, i, s) {
        let [u, o] = t.useState(!1);
        (0, n.useIsoLayoutEffect)(() => {
            if (!e || !l || null == i) return void o(!1);
            let t = (0, r.ownerDocument)(i).documentElement.clientWidth,
                a = i.offsetWidth;
            o(t > 0 && a > 0 && a >= t - 20)
        }, [e, l, i]), (0, a.useScrollLock)(e && (!l || u), s)
    }])
}, 90803, e => {
    "use strict";
    e.s(["isElementDisabled", 0, function(e) {
        return null == e || e.hasAttribute("disabled") || "true" === e.getAttribute("aria-disabled")
    }])
}, 47211, e => {
    "use strict";
    let t = (0, e.i(56420).default)("ban", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M4.929 4.929 19.07 19.071",
            key: "196cmz"
        }]
    ]);
    e.s(["Ban", 0, t], 47211)
}, 26495, e => {
    "use strict";
    let t = (0, e.i(56420).default)("chevron-down", [
        ["path", {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }]
    ]);
    e.s(["default", 0, t])
}, 51757, 19647, 13281, 74544, 66764, 62822, 82625, 12796, 44808, 41206, 44944, 95925, e => {
    "use strict";
    var t = e.i(16933);
    e.s(["CheckCircle2", () => t.default], 51757);
    var r = e.i(56420);
    let a = (0, r.default)("circle-minus", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M8 12h8",
            key: "1wcyev"
        }]
    ]);
    e.s(["CircleMinus", 0, a], 19647);
    let n = (0, r.default)("clock", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "M12 6v6l4 2",
            key: "mmk7yg"
        }]
    ]);
    e.s(["default", 0, n], 13281), e.s(["Clock", 0, n], 74544);
    let l = (0, r.default)("file-pen", [
        ["path", {
            d: "M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34",
            key: "o6klzx"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z",
            key: "zhnas1"
        }]
    ]);
    e.s(["FileEdit", 0, l], 66764);
    let i = (0, r.default)("file-plus", [
        ["path", {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6"
        }],
        ["path", {
            d: "M14 2v5a1 1 0 0 0 1 1h5",
            key: "wfsgrz"
        }],
        ["path", {
            d: "M9 15h6",
            key: "cctwl0"
        }],
        ["path", {
            d: "M12 18v-6",
            key: "17g6i2"
        }]
    ]);
    e.s(["FilePlus", 0, i], 62822);
    let s = (0, r.default)("gift", [
        ["path", {
            d: "M12 7v14",
            key: "1akyts"
        }],
        ["path", {
            d: "M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",
            key: "1sqzm4"
        }],
        ["path", {
            d: "M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",
            key: "kc0143"
        }],
        ["rect", {
            x: "3",
            y: "7",
            width: "18",
            height: "4",
            rx: "1",
            key: "1hberx"
        }]
    ]);
    e.s(["Gift", 0, s], 82625);
    let u = (0, r.default)("loader", [
        ["path", {
            d: "M12 2v4",
            key: "3427ic"
        }],
        ["path", {
            d: "m16.2 7.8 2.9-2.9",
            key: "r700ao"
        }],
        ["path", {
            d: "M18 12h4",
            key: "wj9ykh"
        }],
        ["path", {
            d: "m16.2 16.2 2.9 2.9",
            key: "1bxg5t"
        }],
        ["path", {
            d: "M12 18v4",
            key: "jadmvz"
        }],
        ["path", {
            d: "m4.9 19.1 2.9-2.9",
            key: "bwix9q"
        }],
        ["path", {
            d: "M2 12h4",
            key: "j09sii"
        }],
        ["path", {
            d: "m4.9 4.9 2.9 2.9",
            key: "giyufr"
        }]
    ]);
    e.s(["Loader", 0, u], 12796);
    let o = (0, r.default)("mail-open", [
        ["path", {
            d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
            key: "1jhwl8"
        }],
        ["path", {
            d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",
            key: "1qfld7"
        }]
    ]);
    e.s(["MailOpen", 0, o], 44808);
    let c = (0, r.default)("mail-warning", [
        ["path", {
            d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",
            key: "e61zoh"
        }],
        ["path", {
            d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
            key: "1ocrg3"
        }],
        ["path", {
            d: "M20 14v4",
            key: "1hm744"
        }],
        ["path", {
            d: "M20 22v.01",
            key: "12bgn6"
        }]
    ]);
    e.s(["MailWarning", 0, c], 41206);
    let d = (0, r.default)("power", [
        ["path", {
            d: "M12 2v10",
            key: "mnfbl"
        }],
        ["path", {
            d: "M18.4 6.6a9 9 0 1 1-12.77.04",
            key: "obofu9"
        }]
    ]);
    e.s(["Power", 0, d], 44944);
    let m = (0, r.default)("rotate-ccw", [
        ["path", {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }],
        ["path", {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }]
    ]);
    e.s(["RotateCcw", 0, m], 95925)
}, 55958, e => {
    "use strict";
    let t = (0, e.i(56420).default)("circle-pause", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["line", {
            x1: "10",
            x2: "10",
            y1: "15",
            y2: "9",
            key: "c1nkhi"
        }],
        ["line", {
            x1: "14",
            x2: "14",
            y1: "15",
            y2: "9",
            key: "h65svq"
        }]
    ]);
    e.s(["PauseCircle", 0, t], 55958)
}, 32781, e => {
    "use strict";
    var t = e.i(58379);
    e.s(["Loader2", () => t.default])
}, 96315, e => {
    "use strict";
    let t = (0, e.i(56420).default)("mail", [
        ["path", {
            d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
            key: "132q7q"
        }],
        ["rect", {
            x: "2",
            y: "4",
            width: "20",
            height: "16",
            rx: "2",
            key: "izxlao"
        }]
    ]);
    e.s(["Mail", 0, t], 96315)
}, 15331, e => {
    "use strict";
    let t = (0, e.i(56420).default)("radio", [
        ["path", {
            d: "M16.247 7.761a6 6 0 0 1 0 8.478",
            key: "1fwjs5"
        }],
        ["path", {
            d: "M19.075 4.933a10 10 0 0 1 0 14.134",
            key: "ehdyv1"
        }],
        ["path", {
            d: "M4.925 19.067a10 10 0 0 1 0-14.134",
            key: "1q22gi"
        }],
        ["path", {
            d: "M7.753 16.239a6 6 0 0 1 0-8.478",
            key: "r2q7qm"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "2",
            key: "1c9p78"
        }]
    ]);
    e.s(["Radio", 0, t], 15331)
}, 73474, e => {
    "use strict";
    let t = (0, e.i(56420).default)("trash-2", [
        ["path", {
            d: "M10 11v6",
            key: "nco0om"
        }],
        ["path", {
            d: "M14 11v6",
            key: "outv1u"
        }],
        ["path", {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }],
        ["path", {
            d: "M3 6h18",
            key: "d0wm0j"
        }],
        ["path", {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }]
    ]);
    e.s(["Trash2", 0, t], 73474)
}, 25981, e => {
    "use strict";
    let t = (0, e.i(56420).default)("upload", [
        ["path", {
            d: "M12 3v12",
            key: "1x0j5s"
        }],
        ["path", {
            d: "m17 8-5-5-5 5",
            key: "7q97r8"
        }],
        ["path", {
            d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
            key: "ih7n3h"
        }]
    ]);
    e.s(["Upload", 0, t], 25981)
}, 87486, 83967, e => {
    "use strict";
    var t = e.i(43476),
        r = e.i(25913),
        a = e.i(75157),
        n = e.i(47211),
        l = e.i(51757),
        i = e.i(19647),
        s = e.i(74544),
        u = e.i(66764),
        o = e.i(62822),
        c = e.i(82625),
        d = e.i(12796),
        m = e.i(32781),
        f = e.i(96315),
        g = e.i(44808),
        b = e.i(41206),
        p = e.i(55958),
        h = e.i(44944),
        y = e.i(15331),
        x = e.i(95925),
        v = e.i(73474),
        k = e.i(25981);
    let N = (0, e.i(56420).default)("circle-x", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["path", {
            d: "m15 9-6 6",
            key: "1uzhvr"
        }],
        ["path", {
            d: "m9 9 6 6",
            key: "z0biqf"
        }]
    ]);
    e.s(["XCircle", 0, N], 83967);
    let C = {
        boolean: {},
        "media-status": {
            ready: {
                label: "Ready",
                className: "bg-green-500 text-green-50",
                icon: l.CheckCircle2,
                iconOnlyClassName: "bg-green-400/15 text-green-500"
            },
            processing: {
                label: "Processing",
                className: "bg-amber-500 text-amber-50",
                icon: d.Loader,
                spin: !0,
                iconOnlyClassName: "bg-amber-400/15 text-amber-500"
            },
            uploading: {
                label: "Uploading",
                className: "bg-orange-500 text-orange-50",
                icon: k.Upload,
                iconOnlyClassName: "bg-orange-400/15 text-orange-500"
            }
        },
        "playlist-status": {
            ready: {
                label: "Ready",
                className: "bg-green-500 text-green-50",
                icon: l.CheckCircle2,
                iconOnlyClassName: "bg-green-400/15 text-green-500"
            },
            created: {
                label: "Created",
                className: "bg-blue-500 text-blue-50",
                icon: o.FilePlus,
                iconOnlyClassName: "bg-blue-400/15 text-blue-500"
            },
            processing: {
                label: "Processing",
                className: "bg-amber-500 text-amber-50",
                icon: d.Loader,
                spin: !0,
                iconOnlyClassName: "bg-amber-400/15 text-amber-500"
            },
            uploading: {
                label: "Uploading",
                className: "bg-orange-500 text-orange-50",
                icon: k.Upload,
                iconOnlyClassName: "bg-orange-400/15 text-orange-500"
            }
        },
        "stream-status": {
            off: {
                label: "Off",
                className: "bg-red-400/15 text-red-500",
                icon: h.Power
            },
            on: {
                label: "On",
                className: "bg-green-400/15 text-green-500",
                icon: y.Radio
            },
            starting: {
                label: "Starting",
                className: "bg-yellow-400/15 text-yellow-500",
                icon: m.Loader2,
                spin: !0
            },
            stopping: {
                label: "Stopping",
                className: "bg-yellow-400/15 text-yellow-500",
                icon: p.PauseCircle
            },
            scheduled: {
                label: "Scheduled",
                className: "bg-blue-400/15 text-blue-500",
                icon: s.Clock
            }
        },
        "stream-category": {
            "1080p-standard": {
                label: "1080p Standard*",
                className: "bg-indigo-400/15 text-indigo-400"
            },
            "1080p-premium": {
                label: "1080p Premium*",
                className: "bg-fuchsia-400/15 text-fuchsia-400"
            },
            "4k": {
                label: "4K*",
                className: "bg-indigo-500/15 text-indigo-200"
            }
        },
        "media-category": {
            "1080p-standard": {
                label: "1080p Standard*",
                className: "bg-indigo-400/15 text-indigo-400"
            },
            "1080p-premium": {
                label: "1080p Premium*",
                className: "bg-fuchsia-400/15 text-fuchsia-400"
            },
            "4k": {
                label: "4K*",
                className: "bg-indigo-500/15 text-indigo-200"
            }
        },
        "playlist-category": {
            "1080p-standard": {
                label: "1080p Standard*",
                className: "bg-indigo-400/15 text-indigo-400"
            },
            "1080p-premium": {
                label: "1080p Premium*",
                className: "bg-fuchsia-400/15 text-fuchsia-400"
            },
            "4k": {
                label: "4K*",
                className: "bg-indigo-500/15 text-indigo-200"
            }
        },
        "plan-name": {
            "1080p-standard": {
                label: "1080p Standard*",
                className: "bg-amber-600/50 text-amber-200"
            },
            "1080p-premium": {
                label: "1080p Premium*",
                className: "bg-purple-600/50 text-purple-200"
            },
            "4k": {
                label: "4K*",
                className: "bg-indigo-500/15 text-indigo-200"
            }
        },
        "user-status": {
            active: {
                label: "Active",
                className: "bg-emerald-500/15 text-emerald-200",
                icon: l.CheckCircle2
            },
            inactive: {
                label: "Inactive",
                className: "bg-muted text-muted-foreground",
                icon: i.CircleMinus
            },
            deleted: {
                label: "Deleted",
                className: "bg-rose-500/15 text-rose-200",
                icon: v.Trash2
            },
            email_not_verified: {
                label: "Email Not Verified",
                className: "bg-amber-500/15 text-amber-200",
                icon: b.MailWarning
            },
            disabled: {
                label: "Disabled",
                className: "bg-muted text-muted-foreground",
                icon: n.Ban
            }
        },
        "user-role": {
            admin: {
                label: "Admin",
                className: "bg-indigo-500/15 text-indigo-200"
            },
            user: {
                label: "User",
                className: "bg-muted text-muted-foreground"
            }
        },
        "order-status": {
            pending: {
                label: "Pending",
                className: "bg-amber-500/50 text-amber-200",
                icon: s.Clock
            },
            completed: {
                label: "Completed",
                className: "bg-green-500/50 text-green-200",
                icon: l.CheckCircle2
            },
            failed: {
                label: "Failed",
                className: "bg-red-500/50 text-red-200",
                icon: N
            },
            refunded: {
                label: "Refunded",
                className: "bg-purple-500/50 text-purple-200",
                icon: x.RotateCcw
            },
            created: {
                label: "Created",
                className: "bg-blue-500/50 text-blue-200",
                icon: o.FilePlus
            }
        },
        "free-trial-status": {
            pending: {
                label: "Pending",
                className: "bg-amber-500 text-amber-200",
                icon: s.Clock
            },
            approved: {
                label: "Approved",
                className: "bg-green-500 text-green-200",
                icon: l.CheckCircle2
            },
            rejected: {
                label: "Rejected",
                className: "bg-rose-500 text-rose-200",
                icon: N
            },
            claimed: {
                label: "Claimed",
                className: "bg-sky-500 text-sky-200",
                icon: c.Gift
            }
        },
        "notification-read": {
            read: {
                label: "Read",
                className: "bg-emerald-500/15 text-emerald-200",
                icon: g.MailOpen
            },
            unread: {
                label: "Unread",
                className: "bg-amber-500/15 text-amber-200",
                icon: f.Mail
            }
        },
        "coupon-apply-mode": {
            auto: {
                label: "Auto",
                className: "bg-emerald-500/15 text-emerald-200"
            },
            manual: {
                label: "Manual",
                className: "bg-muted text-muted-foreground"
            }
        },
        "waitlist-approval": {
            approved: {
                label: "Approved",
                className: "bg-emerald-500/15 text-emerald-200",
                icon: l.CheckCircle2
            },
            pending: {
                label: "Pending",
                className: "bg-amber-500/15 text-amber-200",
                icon: s.Clock
            }
        },
        "product-status": {
            active: {
                label: "Active",
                className: "bg-emerald-500/15 text-emerald-200",
                icon: l.CheckCircle2
            },
            inactive: {
                label: "Inactive",
                className: "bg-muted text-muted-foreground",
                icon: i.CircleMinus
            },
            draft: {
                label: "Draft",
                className: "bg-amber-500/15 text-amber-200",
                icon: u.FileEdit
            }
        }
    };
    var E = e.i(93021);
    let M = {
            "stream-status": "streamStatus",
            "stream-category": "streamResolutions",
            "media-category": "mediaResolutions",
            "playlist-category": "playlistCategory",
            "plan-name": "streamResolutions"
        },
        R = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap",
        w = (0, r.cva)(R, {
            variants: {
                variant: {
                    default: "bg-primary/15 text-primary",
                    success: "bg-emerald-500/15 text-emerald-200",
                    warning: "bg-amber-500/15 text-amber-200",
                    danger: "bg-rose-500/15 text-rose-200",
                    info: "bg-sky-500/15 text-sky-200",
                    special: "bg-indigo-500/15 text-indigo-200",
                    neutral: "bg-muted text-muted-foreground",
                    outline: "border border-border bg-transparent text-foreground",
                    secondary: "bg-secondary text-secondary-foreground"
                }
            },
            defaultVariants: {
                variant: "neutral"
            }
        });

    function L(e) {
        return e.replace(/[_-]+/g, " ").trim().split(" ").map(e => e ? e[0].toUpperCase() + e.slice(1) : e).join(" ")
    }
    e.s(["Badge", 0, function({
        className: e,
        variant: r,
        domain: n,
        value: l,
        trueLabel: i,
        falseLabel: s,
        trueVariant: u,
        falseVariant: o,
        iconOnly: c,
        children: d,
        ...m
    }) {
        let f, g, b = d,
            p = r ? ? void 0,
            h = !1,
            y = n ? M[n] : void 0,
            {
                metadata: x
            } = (0, E.useMetadata)(!!y),
            v = y && null != l ? x ? .[y].find(e => e.value === String(l).toLowerCase().trim()) ? .label : void 0;
        if (n) {
            let e = function(e, t, r = "Yes", a = "No", n = "success", l = "neutral", i = !1, s) {
                if ("boolean" === e) {
                    let e = !!t;
                    return {
                        label: e ? r : a,
                        kind: "variant",
                        variant: e ? n : l
                    }
                }
                let u = null == t ? "" : String(t),
                    o = u.toLowerCase().trim(),
                    c = C[e] ? .[o];
                if (c) {
                    let e = i && c.iconOnlyClassName || c.className;
                    return {
                        label: s ? ? c.label,
                        kind: "class",
                        className: e,
                        icon: c.icon,
                        spin: c.spin
                    }
                }
                return u ? {
                    label: s ? ? L(u),
                    kind: "variant",
                    variant: "neutral"
                } : {
                    label: "—",
                    kind: "variant",
                    variant: "neutral"
                }
            }(n, l, i, s, u, o, c, v);
            b = e.label, r || ("class" === e.kind ? (f = e.className, g = e.icon, h = !!e.spin) : p = e.variant)
        }
        return f ? (0, t.jsxs)("span", {
            "data-slot": "badge",
            className: (0, a.cn)(R, "gap-1 font-bold", f, e),
            ...m,
            children: [g && (0, t.jsx)(g, {
                className: (0, a.cn)("size-3 shrink-0", h && "animate-spin")
            }), !c && b]
        }) : (0, t.jsx)("span", {
            "data-slot": "badge",
            "data-variant": p,
            className: (0, a.cn)(w({
                variant: p,
                className: e
            })),
            ...m,
            children: b
        })
    }, "badgeVariants", 0, w, "getBadgeLabel", 0, function(e, t) {
        let r = t.toLowerCase().trim();
        return C[e] ? .[r] ? .label ? ? L(t)
    }], 87486)
}, 76639, e => {
    "use strict";
    var t = e.i(43476),
        r = e.i(53753),
        a = e.i(75157),
        n = e.i(19455),
        l = e.i(60964);

    function i({ ...e
    }) {
        return (0, t.jsx)(r.Dialog.Portal, {
            "data-slot": "dialog-portal",
            ...e
        })
    }

    function s({
        className: e,
        ...n
    }) {
        return (0, t.jsx)(r.Dialog.Backdrop, {
            "data-slot": "dialog-overlay",
            className: (0, a.cn)("fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0", e),
            ...n
        })
    }
    e.s(["Dialog", 0, function({ ...e
    }) {
        return (0, t.jsx)(r.Dialog.Root, {
            "data-slot": "dialog",
            ...e
        })
    }, "DialogContent", 0, function({
        className: e,
        children: u,
        showCloseButton: o = !0,
        ...c
    }) {
        return (0, t.jsxs)(i, {
            children: [(0, t.jsx)(s, {}), (0, t.jsxs)(r.Dialog.Popup, {
                "data-slot": "dialog-content",
                className: (0, a.cn)("fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
                ...c,
                children: [u, o && (0, t.jsxs)(r.Dialog.Close, {
                    "data-slot": "dialog-close",
                    render: (0, t.jsx)(n.Button, {
                        variant: "ghost",
                        className: "absolute top-4 right-4",
                        size: "icon-sm"
                    }),
                    children: [(0, t.jsx)(l.XIcon, {}), (0, t.jsx)("span", {
                        className: "sr-only",
                        children: "Close"
                    })]
                })]
            })]
        })
    }, "DialogFooter", 0, function({
        className: e,
        showCloseButton: l = !1,
        children: i,
        ...s
    }) {
        return (0, t.jsxs)("div", {
            "data-slot": "dialog-footer",
            className: (0, a.cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
            ...s,
            children: [i, l && (0, t.jsx)(r.Dialog.Close, {
                render: (0, t.jsx)(n.Button, {
                    variant: "outline"
                }),
                children: "Close"
            })]
        })
    }, "DialogHeader", 0, function({
        className: e,
        ...r
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "dialog-header",
            className: (0, a.cn)("flex flex-col gap-2", e),
            ...r
        })
    }, "DialogTitle", 0, function({
        className: e,
        ...n
    }) {
        return (0, t.jsx)(r.Dialog.Title, {
            "data-slot": "dialog-title",
            className: (0, a.cn)("font-heading leading-none font-medium", e),
            ...n
        })
    }])
}, 93021, e => {
    "use strict";
    var t = e.i(15504),
        r = e.i(46696),
        a = e.i(65114);
    let n = new class {
            async getMetadata() {
                return (await a.default.get("/v1/metadata")).data
            }
        },
        l = null;
    e.s(["useMetadata", 0, function(e = !0) {
        let [a, i] = (0, t.useState)(), [s, u] = (0, t.useState)(e);
        return (0, t.useEffect)(() => {
            if (!e) return;
            let t = !1;
            return u(!0), l || (l = n.getMetadata()), l.then(e => {
                t || i(e)
            }).catch(() => {
                l = null, t || r.toast.error("Error fetching metadata")
            }).finally(() => {
                t || u(!1)
            }), () => {
                t = !0
            }
        }, [e]), {
            metadata: a,
            loading: s
        }
    }], 93021)
}]);