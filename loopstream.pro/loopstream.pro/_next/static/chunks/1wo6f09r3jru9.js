(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 9023, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        a = e.i(52245),
        i = e.i(3352),
        n = e.i(20100);
    let r = t.forwardRef(function(e, t) {
        let {
            render: r,
            className: s,
            style: o,
            ...l
        } = e, {
            state: d
        } = (0, i.useAccordionItemContext)();
        return (0, a.useRenderElement)("h3", e, {
            state: d,
            ref: t,
            props: l,
            stateAttributesMapping: n.accordionStateAttributesMapping
        })
    });
    e.s(["AccordionHeader", 0, r])
}, 14837, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(67865),
        i = e.i(28918),
        n = e.i(88015),
        r = e.i(51437),
        s = e.i(75606),
        o = e.i(56434),
        l = e.i(23910),
        d = e.i(23397),
        c = e.i(73553),
        u = e.i(73284),
        m = e.i(3352),
        p = e.i(20100),
        x = e.i(52245),
        g = e.i(43476);
    let f = t.forwardRef(function(e, f) {
        let {
            className: h,
            disabled: b = !1,
            onOpenChange: v,
            render: w,
            value: y,
            style: j,
            ...C
        } = e, {
            ref: N,
            index: S
        } = (0, c.useCompositeListItem)(), k = (0, i.useMergedRefs)(f, N), {
            disabled: P,
            handleValueChange: A,
            state: R,
            value: I
        } = (0, u.useAccordionRootContext)(), M = (0, n.useBaseUiId)(), E = y ? ? M, _ = b || P, D = t.useMemo(() => {
            if (!I) return !1;
            for (let e = 0; e < I.length; e += 1)
                if (I[e] === E) return !0;
            return !1
        }, [I, E]), T = (0, a.useStableCallback)((e, t) => {
            v ? .(e, t), t.isCanceled || A(E, e, t)
        }), L = function(e) {
            let {
                open: i,
                defaultOpen: d,
                onOpenChange: c,
                disabled: u
            } = e, [m, p] = (0, r.useControlled)({
                controlled: i,
                default: d,
                name: "Collapsible",
                state: "open"
            }), {
                mounted: x,
                setMounted: g,
                transitionStatus: f
            } = (0, l.useTransitionStatus)(m, !0, !0), h = (0, n.useBaseUiId)(), [b, v] = t.useState(), w = b ? ? h, y = (0, a.useStableCallback)(e => {
                let t = !m,
                    a = (0, s.createChangeEventDetails)(o.REASONS.triggerPress, e.nativeEvent);
                c(t, a), a.isCanceled || p(t)
            });
            return t.useMemo(() => ({
                disabled: u,
                handleTrigger: y,
                mounted: x,
                open: m,
                panelId: w,
                setMounted: g,
                setOpen: p,
                setPanelIdState: v,
                transitionStatus: f
            }), [u, y, x, m, w, g, p, v, f])
        }({
            open: D,
            onOpenChange: T,
            disabled: _
        }), G = t.useMemo(() => ({
            open: L.open,
            disabled: L.disabled,
            transitionStatus: L.transitionStatus
        }), [L.open, L.disabled, L.transitionStatus]), B = t.useMemo(() => ({ ...L,
            onOpenChange: T,
            state: G
        }), [L, G, T]), F = t.useMemo(() => ({ ...R,
            hidden: !D && !L.mounted,
            index: S,
            disabled: _,
            open: D
        }), [L.mounted, _, S, D, R]), O = (0, n.useBaseUiId)(), [$, z] = t.useState(), U = t.useMemo(() => ({
            open: D,
            state: F,
            setTriggerId: z,
            triggerId: $ ? ? O
        }), [O, D, F, z, $]), Y = (0, x.useRenderElement)("div", e, {
            state: F,
            ref: k,
            props: C,
            stateAttributesMapping: p.accordionStateAttributesMapping
        });
        return (0, g.jsx)(d.CollapsibleRootContext.Provider, {
            value: B,
            children: (0, g.jsx)(m.AccordionItemContext.Provider, {
                value: U,
                children: Y
            })
        })
    });
    e.s(["AccordionItem", 0, f], 14837)
}, 20100, e => {
    "use strict";
    var t, a = e.i(18337),
        i = e.i(9407);
    let n = ((t = {}).index = "data-index", t.disabled = "data-disabled", t.open = "data-open", t),
        r = { ...a.collapsibleOpenStateMapping,
            index: e => Number.isInteger(e) ? {
                [n.index]: String(e)
            } : null,
            ...i.transitionStatusMapping,
            value: () => null
        };
    e.s(["accordionStateAttributesMapping", 0, r], 20100)
}, 66930, e => {
    "use strict";
    var t, a = e.i(15504),
        i = e.i(46376),
        n = e.i(77570),
        r = e.i(23397),
        s = e.i(74735),
        o = e.i(28918),
        l = e.i(8445),
        d = e.i(67865),
        c = e.i(46265),
        u = e.i(33848),
        m = e.i(75606),
        p = e.i(56434),
        x = e.i(37584),
        g = e.i(22640),
        f = e.i(21310);
    let h = {
        height: void 0,
        width: void 0
    };

    function b(e) {
        return {
            height: e.scrollHeight,
            width: e.scrollWidth
        }
    }

    function v(e) {
        return e.split(",").map(e => e.trim()).some(e => "" !== e && Number.parseFloat(e) > 0)
    }

    function w(e, t, a) {
        let i = e.style.getPropertyValue(t),
            n = e.style.getPropertyPriority(t);
        return e.style.setProperty(t, a), () => {
            "" === i ? e.style.removeProperty(t) : e.style.setProperty(t, i, n)
        }
    }
    var y = e.i(73284),
        j = e.i(3352),
        C = e.i(20100);
    let N = ((t = {}).accordionPanelHeight = "--accordion-panel-height", t.accordionPanelWidth = "--accordion-panel-width", t);
    var S = e.i(52245);
    let k = a.forwardRef(function(e, t) {
        let {
            className: k,
            hiddenUntilFound: P,
            keepMounted: A,
            id: R,
            render: I,
            style: M,
            ...E
        } = e, {
            hiddenUntilFound: _,
            keepMounted: D
        } = (0, y.useAccordionRootContext)(), {
            mounted: T,
            onOpenChange: L,
            open: G,
            panelId: B,
            setMounted: F,
            setOpen: O,
            setPanelIdState: $,
            transitionStatus: z
        } = (0, r.useCollapsibleRootContext)();
        (0, i.useIsoLayoutEffect)(() => {
            if (R) return $(R), () => {
                $(void 0)
            }
        }, [R, $]);
        let {
            height: U,
            props: Y,
            ref: V,
            shouldPreventOpenAnimation: W,
            shouldRender: H,
            transitionStatus: K,
            width: X
        } = function(e) {
            let {
                externalRef: t,
                hiddenUntilFound: n,
                id: r,
                keepMounted: y,
                mounted: j,
                onOpenChange: C,
                open: N,
                setMounted: S,
                setOpen: k,
                transitionStatus: P
            } = e, A = a.useRef(null), R = a.useRef(null), [I, M] = a.useState(h), E = a.useRef(h), _ = a.useRef(!1), D = a.useRef(N), T = a.useRef(!1), [L, G] = a.useState(!1), B = a.useRef(null), F = (0, o.useMergedRefs)(t, A), O = (0, c.useValueAsRef)({
                mounted: j,
                open: N
            }), $ = (0, g.useAnimationsFinished)(A, !1, !1), z = !N && !j, U = L ? "idle" : P, Y = N && (D.current || T.current), V = !N && j && "css-animation" === R.current && void 0 === I.height && void 0 === I.width ? E.current : I, W = n && z && "css-animation" !== R.current, H = (0, d.useStableCallback)((e, t = !0) => {
                t && (E.current = e), M(e)
            }), K = (0, d.useStableCallback)(() => {
                B.current ? .(), B.current = null
            }), X = (0, d.useStableCallback)(e => {
                K(), B.current = () => {
                    B.current = null, e()
                }
            }), q = (0, d.useStableCallback)(() => {
                N && j && "css-animation" === R.current && (T.current = !0)
            });
            (0, i.useIsoLayoutEffect)(() => {
                L && "starting" !== P && G(!1)
            }, [L, P]), a.useEffect(() => () => {
                q(), K()
            }, [q, K]), (0, i.useIsoLayoutEffect)(() => {
                let e = A.current;
                if (!e) return;
                !N && B.current && K();
                let t = function(e, t = !1) {
                    let a = (0, u.ownerWindow)(e).getComputedStyle(e),
                        i = (a.animationName.split(",").map(e => e.trim()).some(e => "" !== e && "none" !== e) || t) && v(a.animationDuration),
                        n = v(a.transitionDuration);
                    return i && n || n ? "css-transition" : i ? "css-animation" : "none"
                }(e, Y);
                if (R.current = t, N && "idle" === P && D.current && "css-animation" === t) {
                    E.current = b(e);
                    return
                }
                if (N && "starting" === P) {
                    let a = _.current;
                    if (_.current = !1, "none" === t) {
                        H(b(e)), G(!0);
                        return
                    }
                    if ("css-transition" === t) {
                        let t = function(e) {
                            let t = {
                                "justify-content": e.style.justifyContent,
                                "align-items": e.style.alignItems,
                                "align-content": e.style.alignContent,
                                "justify-items": e.style.justifyItems
                            };

                            function a() {
                                Object.entries(t).forEach(([t, a]) => {
                                    "" === a ? e.style.removeProperty(t) : e.style.setProperty(t, a)
                                })
                            }
                            Object.keys(t).forEach(t => {
                                e.style.setProperty(t, "initial", "important")
                            });
                            let i = l.AnimationFrame.request(a);
                            return () => {
                                l.AnimationFrame.cancel(i), a()
                            }
                        }(e);
                        return H(b(e)), a && (X(w(e, "transition-duration", "0s")), G(!0)), t
                    }
                    if ("css-animation" === t) {
                        if (H(b(e)), !a) return void w(e, "animation-name", "none")();
                        let t = w(e, "animation-name", "none"),
                            i = w(e, "animation-duration", "0s");
                        return t(), X(i), G(!0), void 0
                    }
                }
                if (!N && j && ("idle" === P || "starting" === P)) {
                    if (D.current = !1, T.current = !1, "none" === t) {
                        H(h, !1), S(!1);
                        return
                    }
                    H(b(e));
                    return
                }
                if ("ending" !== P) return;
                if ("none" === t) return void S(!1);
                let a = b(e);
                (a.height ? ? 0) > 0 || (a.width ? ? 0) > 0 ? (H(a), "css-animation" === t && w(e, "animation-name", "none")()) : S(!1)
            }, [j, N, K, H, S, X, Y, P]), (0, x.useOpenChangeComplete)({
                enabled: N && j && "idle" === U,
                open: !0,
                ref: A,
                onComplete() {
                    N && H(h, !1)
                }
            }), a.useEffect(() => {
                if (N || !j || "ending" !== U || !A.current) return;
                let e = new AbortController,
                    t = -1;

                function a() {
                    O.current.open || (S(!1), H(h, !1))
                }
                return t = l.AnimationFrame.request(() => {
                    e.signal.aborted || $(a, e.signal)
                }), () => {
                    l.AnimationFrame.cancel(t), e.abort()
                }
            }, [O, j, N, U, $, H, S]), (0, i.useIsoLayoutEffect)(() => {
                let e = A.current;
                e && n && z && e.setAttribute("hidden", "until-found")
            }, [z, n]), a.useEffect(function() {
                let e = A.current;
                if (e) return (0, s.addEventListener)(e, "beforematch", function(e) {
                    let t = (0, m.createChangeEventDetails)(p.REASONS.none, e);
                    C(!0, t), t.isCanceled || (_.current = !0, k(!0))
                })
            }, [C, k]);
            let J = y || n || j || N;
            return {
                height: V.height,
                props: { ...W ? {
                        [f.CollapsiblePanelDataAttributes.startingStyle]: ""
                    } : void 0,
                    hidden: z,
                    id: r
                },
                ref: F,
                shouldPreventOpenAnimation: Y,
                shouldRender: J,
                transitionStatus: U,
                width: V.width
            }
        }({
            externalRef: t,
            hiddenUntilFound: P ? ? _,
            id: R ? ? B,
            keepMounted: A ? ? D,
            mounted: T,
            onOpenChange: L,
            open: G,
            setMounted: F,
            setOpen: O,
            transitionStatus: z
        }), {
            state: q,
            triggerId: J
        } = (0, j.useAccordionItemContext)(), Q = { ...q,
            transitionStatus: K
        }, Z = (0, n.resolveStyle)(M, Q), ee = (0, S.useRenderElement)("div", { ...e,
            style: void 0
        }, {
            state: Q,
            ref: V,
            props: [Y, {
                "aria-labelledby": J,
                role: "region",
                style: {
                    [N.accordionPanelHeight]: void 0 === U ? "auto" : `${U}px`,
                    [N.accordionPanelWidth]: void 0 === X ? "auto" : `${X}px`
                }
            }, E, Z ? {
                style: Z
            } : void 0, W ? {
                style: {
                    animationName: "none"
                }
            } : void 0],
            stateAttributesMapping: C.accordionStateAttributesMapping
        });
        return H ? ee : null
    });
    e.s(["AccordionPanel", 0, k], 66930)
}, 37076, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        a = e.i(51437),
        i = e.i(67865),
        n = e.i(53687),
        r = e.i(72855),
        s = e.i(73284),
        o = e.i(52245),
        l = e.i(43476);
    let d = {
            value: () => null
        },
        c = t.forwardRef(function(e, c) {
            let {
                render: u,
                className: m,
                disabled: p = !1,
                hiddenUntilFound: x,
                keepMounted: g,
                loopFocus: f,
                onValueChange: h,
                multiple: b = !1,
                orientation: v = "vertical",
                value: w,
                defaultValue: y,
                style: j,
                ...C
            } = e, N = (0, r.useDirection)(), S = t.useMemo(() => {
                if (void 0 === w) return y ? ? []
            }, [w, y]), k = t.useRef([]), [P, A] = (0, a.useControlled)({
                controlled: w,
                default: S,
                name: "Accordion",
                state: "value"
            }), R = (0, i.useStableCallback)((e, t, a) => {
                if (b)
                    if (t) {
                        let t = P.slice();
                        if (t.push(e), h ? .(t, a), a.isCanceled) return;
                        A(t)
                    } else {
                        let t = P.filter(t => t !== e);
                        if (h ? .(t, a), a.isCanceled) return;
                        A(t)
                    }
                else {
                    let t = P[0] === e ? [] : [e];
                    h ? .(t, a), a.isCanceled || A(t)
                }
            }), I = t.useMemo(() => ({
                value: P,
                disabled: p,
                orientation: v
            }), [P, p, v]), M = t.useMemo(() => ({
                disabled: p,
                handleValueChange: R,
                hiddenUntilFound: x ? ? !1,
                keepMounted: g ? ? !1,
                state: I,
                value: P
            }), [p, R, x, g, I, P]), E = (0, o.useRenderElement)("div", e, {
                state: I,
                ref: c,
                props: [{
                    dir: N
                }, C],
                stateAttributesMapping: d
            });
            return (0, l.jsx)(s.AccordionRootContext.Provider, {
                value: M,
                children: (0, l.jsx)(n.CompositeList, {
                    elementsRef: k,
                    children: E
                })
            })
        });
    e.s(["AccordionRoot", 0, c])
}, 73284, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        a = e.i(15504);
    let i = a.createContext(void 0);
    e.s(["AccordionRootContext", 0, i, "useAccordionRootContext", 0, function() {
        let e = a.useContext(i);
        if (void 0 === e) throw Error((0, t.default)(10));
        return e
    }])
}, 24648, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        a = e.i(46376),
        i = e.i(18337),
        n = e.i(40886),
        r = e.i(23397),
        s = e.i(3352),
        o = e.i(52245);
    let l = t.forwardRef(function(e, t) {
        let {
            disabled: l,
            className: d,
            id: c,
            render: u,
            nativeButton: m = !0,
            style: p,
            ...x
        } = e, {
            panelId: g,
            open: f,
            handleTrigger: h,
            disabled: b
        } = (0, r.useCollapsibleRootContext)(), {
            getButtonProps: v,
            buttonRef: w
        } = (0, n.useButton)({
            disabled: l || b,
            focusableWhenDisabled: !0,
            native: m
        }), {
            state: y,
            setTriggerId: j,
            triggerId: C
        } = (0, s.useAccordionItemContext)();
        return (0, a.useIsoLayoutEffect)(() => (c && j(c), () => {
            j(void 0)
        }), [c, j]), (0, o.useRenderElement)("button", e, {
            state: y,
            ref: [t, w],
            props: [{
                "aria-controls": f ? g : void 0,
                "aria-expanded": f,
                id: C,
                onClick: h
            }, x, v],
            stateAttributesMapping: i.triggerOpenStateMapping
        })
    });
    e.s(["AccordionTrigger", 0, l])
}, 21310, 3352, 18337, e => {
    "use strict";
    var t, a, i = e.i(9407);
    let n = ((t = {}).open = "data-open", t.closed = "data-closed", t[t.startingStyle = i.TransitionStatusDataAttributes.startingStyle] = "startingStyle", t[t.endingStyle = i.TransitionStatusDataAttributes.endingStyle] = "endingStyle", t);
    e.s(["CollapsiblePanelDataAttributes", 0, n], 21310);
    var r = e.i(33332),
        s = e.i(15504);
    let o = s.createContext(void 0);
    e.s(["AccordionItemContext", 0, o, "useAccordionItemContext", 0, function() {
        let e = s.useContext(o);
        if (void 0 === e) throw Error((0, r.default)(9));
        return e
    }], 3352);
    let l = ((a = {}).panelOpen = "data-panel-open", a),
        d = {
            [n.open]: ""
        },
        c = {
            [n.closed]: ""
        };
    e.s(["collapsibleOpenStateMapping", 0, {
        open: e => e ? d : c
    }, "triggerOpenStateMapping", 0, {
        open: e => e ? {
            [l.panelOpen]: ""
        } : null
    }], 18337)
}, 23397, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        a = e.i(15504);
    let i = a.createContext(void 0);
    e.s(["CollapsibleRootContext", 0, i, "useCollapsibleRootContext", 0, function() {
        let e = a.useContext(i);
        if (void 0 === e) throw Error((0, t.default)(15));
        return e
    }])
}, 10578, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        i = e.i(57688);
    e.s(["ComparisonSlider", 0, function() {
        let [e, n] = (0, a.useState)(50), [r, s] = (0, a.useState)(!1), o = (0, a.useRef)(null), l = (0, a.useCallback)(e => {
            let t = o.current;
            if (!t) return;
            let {
                left: a,
                width: i
            } = t.getBoundingClientRect();
            n(Math.min(Math.max((e - a) / i * 100, 0), 100))
        }, []);
        return (0, a.useEffect)(() => {
            if (!r) return;
            let e = () => s(!1);
            return window.addEventListener("mouseup", e), window.addEventListener("touchend", e), () => {
                window.removeEventListener("mouseup", e), window.removeEventListener("touchend", e)
            }
        }, [r]), (0, t.jsxs)("section", {
            className: "w-full pt-10 text-center",
            children: [(0, t.jsxs)("div", {
                className: "mb-10 space-y-2 px-4",
                children: [(0, t.jsx)("h2", {
                    className: "text-[28px] font-bold text-white sm:text-4xl md:text-[60px]",
                    children: "Regular Live vs Loop Stream Live"
                }), (0, t.jsx)("p", {
                    className: "text-sm sm:text-base md:text-[28px]",
                    children: "Drag the slider to compare"
                })]
            }), (0, t.jsx)("div", {
                className: "mx-auto my-8 w-[90%] max-w-[1100px] rounded-[25px] bg-gradient-to-br from-[#ff4769] via-[#9149d5] to-[#e6375f] p-0.5 shadow-[0_0_28px_rgba(9,37,124,0.7)] md:w-3/4 lg:w-[65%]",
                children: (0, t.jsx)("div", {
                    className: "rounded-[25px] bg-gradient-to-br from-[#0a0014] to-[#10001e] p-[2.5px]",
                    children: (0, t.jsxs)("div", {
                        ref: o,
                        className: "group relative aspect-video w-full cursor-ew-resize overflow-hidden rounded-[25px] select-none",
                        onMouseMove: function(e) {
                            l(e.clientX)
                        },
                        onTouchStart: function(e) {
                            s(!0), l(e.touches[0].clientX)
                        },
                        onTouchMove: function(e) {
                            r && l(e.touches[0].clientX)
                        },
                        children: [(0, t.jsx)(i.default, {
                            src: "/images/appImage/landing-page/after-loop-stream.webp",
                            alt: "Loop Stream 24/7 always-on live overlay",
                            fill: !0,
                            sizes: "(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 90vw",
                            className: "scale-[1.02] object-cover pointer-events-none select-none"
                        }), (0, t.jsx)("div", {
                            className: `absolute right-3 bottom-3 z-10 rounded-[20px] border border-primary bg-background/80 px-2 py-1 text-[10px] font-semibold text-primary backdrop-blur-sm transition-all duration-300 select-none sm:right-4 sm:bottom-4 sm:rounded-[25px] sm:px-3 sm:py-1.5 sm:text-sm ${e>98?"scale-95 opacity-0":"opacity-50 group-hover:opacity-100"}`,
                            children: "Loop Stream Live"
                        }), (0, t.jsxs)("div", {
                            className: "pointer-events-none absolute inset-0 h-full w-full overflow-hidden",
                            style: {
                                clipPath: `inset(0 ${100-e}% 0 0)`
                            },
                            children: [(0, t.jsx)(i.default, {
                                src: "/images/appImage/landing-page/before-loop-stream.webp",
                                alt: "Standard one-time live stream ending after broadcast",
                                fill: !0,
                                sizes: "(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 90vw",
                                className: "object-cover"
                            }), (0, t.jsx)("div", {
                                className: `absolute bottom-3 left-3 z-10 rounded-[20px] bg-white/90 px-2 py-1 text-[10px] font-semibold text-black backdrop-blur-sm transition-all duration-300 select-none sm:bottom-4 sm:left-4 sm:rounded-[25px] sm:px-3 sm:py-1.5 sm:text-sm ${e<2?"scale-95 opacity-0":"opacity-50 group-hover:opacity-100"}`,
                                children: "Regular Live"
                            })]
                        }), (0, t.jsx)("div", {
                            className: "pointer-events-none absolute top-0 bottom-0 z-20 w-[3px] bg-gradient-to-b from-[#7307a5] via-[#d691f3] to-[#7307a5] shadow-[0_0_10px_rgba(0,0,0,0.3)] sm:w-1",
                            style: {
                                left: `${e}%`
                            },
                            children: (0, t.jsx)("div", {
                                className: "absolute top-1/2 left-1/2 flex h-8 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] border-2 border-primary bg-black shadow-2xl transition-transform duration-100 group-active:scale-110 sm:h-10 sm:w-12 sm:rounded-[18px]",
                                children: (0, t.jsxs)("div", {
                                    className: "flex items-center gap-0.5 sm:gap-1",
                                    children: [(0, t.jsx)("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 3,
                                        stroke: "white",
                                        className: "h-3.5 w-3.5 sm:h-4 sm:w-4",
                                        children: (0, t.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M15.75 19.5L8.25 12l7.5-7.5"
                                        })
                                    }), (0, t.jsx)("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        strokeWidth: 3,
                                        stroke: "white",
                                        className: "h-3.5 w-3.5 sm:h-4 sm:w-4",
                                        children: (0, t.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            d: "M8.25 4.5l7.5 7.5-7.5 7.5"
                                        })
                                    })]
                                })
                            })
                        })]
                    })
                })
            })]
        })
    }])
}, 28056, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(57688),
        i = e.i(77572);
    let n = [{
        title: "News",
        icon: "/images/appImage/landing-page/News_1.webp",
        image: "/images/appImage/landing-page/News_2.webp",
        subtitle: "Stream daily updates and replays without a full live crew"
    }, {
        title: "Devotional",
        icon: "/images/appImage/landing-page/Devotional_1.webp",
        image: "/images/appImage/landing-page/Devotional_2.webp",
        subtitle: "Broadcast 24x7 bhajans, kirtans, or poojas seamlessly"
    }, {
        title: "Music",
        icon: "/images/appImage/landing-page/Music_1.webp",
        image: "/images/appImage/landing-page/Music_2.webp",
        subtitle: "Run endless music, mixes, chill streams, or concerts live"
    }, {
        title: "Cartoons",
        icon: "/images/appImage/landing-page/Cartoon_1.webp",
        image: "/images/appImage/landing-page/Cartoon_2.webp",
        subtitle: "Keep kids entertained with round-the-clock live cartoons and shows"
    }, {
        title: "Educators",
        icon: "/images/appImage/landing-page/Education_1.webp",
        image: "/images/appImage/landing-page/Education_2.webp",
        subtitle: "Replay recorded classes & tutorials as live"
    }, {
        title: "Affiliates",
        icon: "/images/appImage/landing-page/Affiliate_1.webp",
        image: "/images/appImage/landing-page/Affiliate_2.webp",
        subtitle: "Promote products live for 2 - 3x higher conversions"
    }];
    e.s(["CreatorTabs", 0, function() {
        return (0, t.jsxs)("section", {
            className: "w-full px-4 py-16 text-center",
            children: [(0, t.jsx)("h2", {
                className: "text-3xl font-bold text-white sm:text-4xl md:text-[60px]",
                children: "Built for Every Type of Creator"
            }), (0, t.jsx)("p", {
                className: "mt-4 mb-8 text-lg font-medium text-white sm:text-xl md:text-[30px]",
                children: "Select your type — we've got you covered."
            }), (0, t.jsxs)(i.Tabs, {
                defaultValue: "News",
                className: "mx-auto max-w-screen-xl",
                children: [(0, t.jsx)(i.TabsList, {
                    variant: "line",
                    "aria-label": "category-tabs",
                    className: "mx-auto mb-5 h-auto flex-wrap justify-center gap-x-6",
                    children: n.map(e => (0, t.jsx)(i.TabsTrigger, {
                        value: e.title,
                        className: "rounded-none px-1 py-2 text-base font-medium text-muted-foreground after:h-[2px] data-active:bg-transparent data-active:text-primary data-active:after:bg-primary",
                        children: e.title
                    }, e.title))
                }), n.map(e => (0, t.jsx)(i.TabsContent, {
                    value: e.title,
                    children: (0, t.jsx)("div", {
                        className: "mx-auto max-w-[1000px] rounded-[18px] bg-gradient-to-br from-[#18c1f6] to-[#d101cb] p-0.5 shadow-[0_0_28px_rgba(9,37,124,0.7)]",
                        children: (0, t.jsx)("div", {
                            className: "min-h-[500px] rounded-[16px] bg-gradient-to-br from-[#0a0014] to-[#10001e] p-6 md:p-8",
                            children: (0, t.jsxs)("div", {
                                className: "flex flex-col items-center gap-8 md:flex-row md:items-center",
                                children: [(0, t.jsxs)("div", {
                                    className: "flex w-full flex-col items-center md:w-1/2",
                                    children: [(0, t.jsx)(a.default, {
                                        src: e.icon,
                                        alt: e.title,
                                        width: 400,
                                        height: 280,
                                        className: "mb-6 h-auto w-full max-w-[400px] rounded-lg"
                                    }), (0, t.jsx)(a.default, {
                                        src: e.image,
                                        alt: `${e.title} preview`,
                                        width: 400,
                                        height: 280,
                                        className: "h-auto w-full max-w-[400px] rounded-lg"
                                    })]
                                }), (0, t.jsxs)("div", {
                                    className: "mt-8 w-full text-left md:mt-0 md:ml-12 md:w-1/2",
                                    children: [(0, t.jsx)("h3", {
                                        className: "mb-4 text-3xl font-bold text-white md:text-[60px]",
                                        children: e.title
                                    }), (0, t.jsx)("ul", {
                                        className: "space-y-3 text-base md:text-lg",
                                        children: (0, t.jsxs)("li", {
                                            className: "flex items-start gap-2 text-white",
                                            style: {
                                                fontSize: 20
                                            },
                                            children: [(0, t.jsx)("span", {
                                                className: "font-bold",
                                                children: "•"
                                            }), " ", e.subtitle]
                                        })
                                    })]
                                })]
                            })
                        })
                    })
                }, e.title))]
            })]
        })
    }])
}, 61171, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        i = e.i(18566),
        n = e.i(19455),
        r = e.i(35872),
        s = e.i(50854),
        o = e.i(52838);
    e.s(["FinalCta", 0, function() {
        let e = (0, i.useRouter)(),
            [l, d] = (0, a.useState)([]);
        (0, a.useEffect)(() => {
            s.default.productService.getProducts().then(e => d(e.items)).catch(() => d([]))
        }, []);
        let c = l.find(e => e.category[1] === o.GlobalConstants.ProductStreamCategory.s_1080f);
        return (0, t.jsxs)("section", {
            className: "mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8",
            children: [(0, t.jsx)("h2", {
                className: "text-3xl leading-tight font-bold text-white sm:text-5xl md:text-[60px]",
                children: "Ready to stream like a pro?"
            }), (0, t.jsxs)("div", {
                className: "mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6",
                children: [(0, t.jsx)(n.Button, {
                    type: "button",
                    size: "lg",
                    className: "px-6 text-base sm:text-lg",
                    onClick: function() {
                        c && (0, r.goToCheckout)(c, 1, 1, e)
                    },
                    children: "Start Free Trial"
                }), (0, t.jsx)(n.Button, {
                    type: "button",
                    size: "lg",
                    className: "border-white px-6 text-base text-white hover:bg-white hover:text-black sm:text-lg",
                    variant: "outline",
                    onClick: function(e) {
                        e.preventDefault();
                        let t = document.getElementById("pricing");
                        t && (t.scrollIntoView({
                            behavior: "smooth"
                        }), window.history.pushState({}, "", "/#pricing"))
                    },
                    children: "Choose Plans"
                })]
            }), (0, t.jsx)("p", {
                className: "mt-4 text-sm text-white sm:text-base md:text-2xl",
                children: "Start your free trial today - no card required"
            })]
        })
    }])
}, 22504, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        i = e.i(57688),
        n = e.i(22016),
        r = e.i(19455),
        s = e.i(75157);
    let o = [{
            icon: "/images/appImage/stream-platform/youtube-200x200.webp",
            alt: "YouTube",
            comingSoon: !1
        }, {
            icon: "/images/appImage/stream-platform/Facebook-icon-200x200.webp",
            alt: "Facebook",
            comingSoon: !1
        }, {
            icon: "/images/appImage/stream-platform/twitch-logo-200x200.webp",
            alt: "Twitch",
            comingSoon: !1
        }, {
            icon: "/images/appImage/stream-platform/kick-logo-200x200.webp",
            alt: "Kick",
            comingSoon: !1
        }, {
            icon: "/images/appImage/stream-platform/instagram-200x200.webp",
            alt: "Instagram",
            comingSoon: !0
        }, {
            icon: "/images/appImage/stream-platform/x-200x200.webp",
            alt: "Twitter",
            comingSoon: !0
        }],
        l = ["Stream", "Loop", "Grow"];
    e.s(["Hero", 0, function() {
        let [e, d] = (0, a.useState)("none");
        return (0, a.useEffect)(() => {
            let e = window.matchMedia("(min-width: 1200px)"),
                t = t => {
                    if (!e.matches) return;
                    let a = (window.innerHeight - 2 * t.clientY) / 100,
                        i = (window.innerWidth - 2 * t.clientX) / 100;
                    d(`perspective(1200px) rotateX(${a<-40?-20:a}deg) rotateY(${i}deg) scale3d(1,1,1)`)
                },
                a = () => {
                    e.matches || d("none")
                };
            return window.addEventListener("mousemove", t), e.addEventListener("change", a), () => {
                window.removeEventListener("mousemove", t), e.removeEventListener("change", a)
            }
        }, []), (0, t.jsxs)("section", {
            className: "relative flex flex-col items-center overflow-hidden px-4 py-10 sm:py-14 md:py-20",
            children: [(0, t.jsx)("div", {
                className: "mb-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10",
                children: o.map(e => (0, t.jsxs)("div", {
                    className: (0, s.cn)("relative h-8 w-8 lg:h-[90px] lg:w-[90px]", e.comingSoon && "pointer-events-none"),
                    children: [(0, t.jsx)(i.default, {
                        src: e.icon,
                        alt: e.alt,
                        fill: !0,
                        sizes: "90px",
                        className: "object-contain"
                    }), e.comingSoon && (0, t.jsxs)(t.Fragment, {
                        children: [(0, t.jsx)("div", {
                            className: "absolute inset-0 scale-110 rounded-full bg-black/50 backdrop-blur-[3px]"
                        }), (0, t.jsx)("div", {
                            className: "absolute inset-0 flex items-center justify-center text-center text-[10px] font-bold text-neutral-300 lg:text-base",
                            children: "Coming Soon"
                        })]
                    })]
                }, e.alt))
            }), (0, t.jsx)("div", {
                className: "mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-10 md:gap-x-16",
                children: l.map((e, a) => (0, t.jsxs)("div", {
                    className: "flex items-center gap-x-4 sm:gap-x-10 md:gap-x-16",
                    children: [(0, t.jsx)("span", {
                        className: "text-3xl leading-tight font-extrabold text-white sm:text-5xl md:text-7xl",
                        children: e
                    }), a < l.length - 1 && (0, t.jsx)("span", {
                        "aria-hidden": !0,
                        className: "h-3 w-3 shrink-0 rounded-full bg-primary sm:h-[18px] sm:w-[18px] md:h-7 md:w-7"
                    })]
                }, e))
            }), (0, t.jsx)("h1", {
                className: "mb-6 max-w-4xl text-center text-base font-extrabold text-white sm:text-2xl md:text-3xl",
                children: "Go live without going live, 24/7 Pre-Recorded Streaming"
            }), (0, t.jsxs)("div", {
                className: "mb-5 flex w-full flex-col items-center justify-center gap-4 px-2 sm:flex-row",
                children: [(0, t.jsx)(r.Button, {
                    className: "px-8 text-xl py-5 font-semibold",
                    render: (0, t.jsx)(n.default, {
                        href: "/register"
                    }),
                    nativeButton: !1,
                    children: "Get Started"
                }), (0, t.jsx)(r.Button, {
                    className: "border-2 border-primary bg-primary/20 px-8 text-xl py-5 font-semibold text-white hover:bg-primary/30",
                    render: (0, t.jsx)(n.default, {
                        href: "#pricing"
                    }),
                    nativeButton: !1,
                    children: "Start Free Loop"
                })]
            }), (0, t.jsx)("div", {
                className: "w-full px-4 text-center transition-transform duration-100 ease-out will-change-transform",
                style: {
                    transform: e
                },
                children: (0, t.jsx)(i.default, {
                    src: "/images/appImage/landing-page/Hero_Two_Screen.webp",
                    alt: "Loop Stream dashboard showing scheduled 24/7 pre-recorded video loops",
                    width: 1200,
                    height: 700,
                    sizes: "(min-width: 896px) 896px, 100vw",
                    className: "mx-auto w-full max-w-4xl",
                    priority: !0
                })
            })]
        })
    }])
}, 40816, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        i = e.i(52838),
        n = e.i(77572),
        r = e.i(75157);
    let s = {
        [i.GlobalConstants.PlanDuration.Day]: {
            min: 1,
            max: 30
        },
        [i.GlobalConstants.PlanDuration.Month]: {
            min: 1,
            max: 12
        },
        [i.GlobalConstants.PlanDuration.Year]: {
            min: 1,
            max: 2
        }
    };

    function o({
        direction: e,
        active: a
    }) {
        return (0, t.jsx)("span", {
            "aria-hidden": !0,
            className: (0, r.cn)("inline-block h-6 w-5 transition-colors", a ? "bg-primary" : "bg-primary/25"),
            style: {
                clipPath: "right" === e ? "polygon(0% 0%, 55% 0%, 100% 50%, 55% 100%, 0% 100%, 45% 50%)" : "polygon(100% 0%, 45% 0%, 0% 50%, 45% 100%, 100% 100%, 55% 50%)"
            }
        })
    }
    let l = "h-9 rounded-full border-transparent px-4 text-sm font-medium text-primary shadow-none data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground";
    e.s(["PlanPeriodSelector", 0, function({
        currency: e,
        onCurrencyChange: d,
        currencyAlign: c = "center",
        onPeriodChange: u
    }) {
        let [m, p] = (0, a.useState)(i.GlobalConstants.PlanDuration.Day), [x, g] = (0, a.useState)(1), f = s[m];

        function h(e) {
            let t = Math.min(f.max, Math.max(f.min, x + e));
            g(t), u(t, m)
        }
        return (0, a.useEffect)(() => {
            g(1), u(1, m)
        }, [m]), (0, t.jsxs)("div", {
            children: [e && d && (0, t.jsx)("div", {
                className: (0, r.cn)("mb-8 flex justify-center px-2", "end" === c && "md:justify-end md:px-0"),
                children: (0, t.jsx)(n.Tabs, {
                    value: e,
                    onValueChange: e => d(e),
                    children: (0, t.jsx)(n.TabsList, {
                        className: "group-data-horizontal/tabs:h-auto rounded-full border border-primary bg-background p-1",
                        children: ["INR", "USD"].map(e => (0, t.jsx)(n.TabsTrigger, {
                            value: e,
                            className: l,
                            children: "INR" === e ? "🇮🇳 ₹ INR" : "🇺🇸 $ USD"
                        }, e))
                    })
                })
            }), (0, t.jsxs)("div", {
                className: "relative mx-auto max-w-[600px]",
                children: [(0, t.jsx)("div", {
                    className: "mb-8 flex justify-center",
                    children: (0, t.jsx)(n.Tabs, {
                        value: m,
                        onValueChange: e => p(e),
                        children: (0, t.jsx)(n.TabsList, {
                            className: "group-data-horizontal/tabs:h-auto rounded-full border border-primary bg-background p-1",
                            children: [i.GlobalConstants.PlanDuration.Day, i.GlobalConstants.PlanDuration.Month, i.GlobalConstants.PlanDuration.Year].map(e => (0, t.jsx)(n.TabsTrigger, {
                                value: e,
                                className: l,
                                children: e
                            }, e))
                        })
                    })
                }), (0, t.jsxs)("div", {
                    className: "relative h-6 w-full",
                    children: [(0, t.jsx)("div", {
                        className: "pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-primary/10"
                    }), (0, t.jsx)("div", {
                        className: "pointer-events-none absolute inset-0 flex items-center",
                        children: Array.from({
                            length: f.max - f.min + 1
                        }, (e, t) => f.min + t).map(e => (0, t.jsx)("span", {
                            className: "absolute h-1 w-1 -translate-x-1/2 rounded-full bg-primary/40",
                            style: {
                                left: `${(e-f.min)/(f.max-f.min)*100}%`
                            }
                        }, e))
                    }), (0, t.jsx)("div", {
                        className: "pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_color-mix(in_srgb,var(--primary)_70%,transparent)]",
                        style: {
                            left: `${(x-f.min)/(f.max-f.min)*100}%`
                        }
                    }), (0, t.jsx)("input", {
                        type: "range",
                        min: f.min,
                        max: f.max,
                        value: x,
                        onChange: e => {
                            let t = Number(e.target.value);
                            g(t), u(t, m)
                        },
                        "aria-label": "Billing period",
                        className: "absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    })]
                }), (0, t.jsxs)("div", {
                    className: "mt-2 grid grid-cols-[2.5rem_1fr_2.5rem] items-center",
                    children: [(0, t.jsx)("button", {
                        type: "button",
                        onClick: () => h(-1),
                        disabled: x <= f.min,
                        "aria-label": "Decrease period",
                        className: "flex justify-start disabled:cursor-not-allowed",
                        children: (0, t.jsx)(o, {
                            direction: "left",
                            active: x > f.min
                        })
                    }), (0, t.jsx)("span", {
                        className: "mx-auto min-w-[140px] rounded-lg border border-primary bg-black px-6 py-2 text-center text-base text-muted-foreground",
                        children: m === i.GlobalConstants.PlanDuration.Year ? 1 === x ? "1 Year" : `${x} Years` : `${x} ${m}${x>1?"s":""}`
                    }), (0, t.jsx)("button", {
                        type: "button",
                        onClick: () => h(1),
                        disabled: x >= f.max,
                        "aria-label": "Increase period",
                        className: "flex justify-end disabled:cursor-not-allowed",
                        children: (0, t.jsx)(o, {
                            direction: "right",
                            active: x < f.max
                        })
                    })]
                })]
            })]
        })
    }])
}, 29216, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        i = e.i(29592),
        n = e.i(64742),
        r = e.i(40816),
        s = e.i(67239),
        o = e.i(50854),
        l = e.i(90838),
        d = e.i(93021),
        c = e.i(52838);
    let u = {
        [c.GlobalConstants.PlanDuration.Day]: c.GlobalConstants.ProductTimeCategory.t_day,
        [c.GlobalConstants.PlanDuration.Month]: c.GlobalConstants.ProductTimeCategory.t_month,
        [c.GlobalConstants.PlanDuration.Year]: c.GlobalConstants.ProductTimeCategory.t_year
    };
    e.s(["PricingSection", 0, function({
        showLoopDropPromo: e = !1
    }) {
        let [m, p] = (0, a.useState)([]), [x, g] = (0, a.useState)("INR"), [f, h] = (0, a.useState)(c.GlobalConstants.PlanDuration.Day), [b, v] = (0, a.useState)(1), [w, y] = (0, a.useState)(!0), [j, C] = (0, a.useState)(!1), N = (0, a.useRef)(null), S = (0, a.useRef)(!1), {
            metadata: k
        } = (0, d.useMetadata)(), P = k ? .freeTrialActive ? ? !0;
        (0, a.useEffect)(() => {
            o.default.productService.getProducts().then(e => p(e.items)).catch(() => p([])).finally(() => y(!1))
        }, []), (0, a.useEffect)(() => {
            if (S.current || w) return;
            let e = N.current;
            if (!e) return;
            let t = new IntersectionObserver(([e]) => {
                e ? .isIntersecting && (l.default.viewPricing(), S.current = !0, t.disconnect())
            }, {
                threshold: .25
            });
            return t.observe(e), () => t.disconnect()
        }, [w]);
        let A = m.filter(e => e.category.includes(u[f])),
            R = e => e.category.includes(c.GlobalConstants.ProductStreamCategory.s_4k),
            I = A.filter(e => !R(e)),
            M = A.find(R);
        return (0, t.jsxs)("section", {
            id: "pricing",
            ref: N,
            className: "px-4 py-16 text-center text-white sm:px-10 md:px-20",
            children: [e && (0, t.jsx)("p", {
                className: "mb-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase",
                children: "Loop Drop Pricing"
            }), (0, t.jsx)("h2", {
                className: "text-3xl font-bold text-white sm:text-5xl md:text-[60px]",
                children: "Choose the Plan That Fits You"
            }), (0, t.jsx)("p", {
                className: "mt-2 mb-4 text-base text-white sm:text-lg md:text-2xl",
                children: "Flexible plans for every stage — from free to pro."
            }), e && (0, t.jsxs)(i.Alert, {
                className: "mx-auto mb-8 w-2xl gap-0 rounded-xl border-chart-4/30 bg-chart-4/10 px-4 py-3 text-sm text-chart-4",
                children: ["🔥 Loop Drop is live — up to ", (0, t.jsx)("strong", {
                    className: "font-bold",
                    children: "45% additional off"
                }), " ", "regular prices. Timer above is counting down. 🔥"]
            }), (0, t.jsx)("div", {
                className: "mt-10 mb-6",
                children: (0, t.jsx)(r.PlanPeriodSelector, {
                    currency: x,
                    onCurrencyChange: g,
                    currencyAlign: "center",
                    onPeriodChange: function(e, t) {
                        h(t), v(e)
                    }
                })
            }), 0 === I.length ? (0, t.jsx)("h3", {
                className: "mt-16 text-lg font-medium text-muted-foreground",
                children: "No plans available for this duration."
            }) : (0, t.jsx)("div", {
                className: "mt-20 flex flex-wrap items-stretch justify-center gap-x-8 gap-y-20 text-left",
                children: I.map(e => (0, t.jsx)("div", {
                    className: "flex w-full max-w-[340px]",
                    children: (0, t.jsx)(n.PlanCard, {
                        product: e,
                        currency: x,
                        periodValue: b,
                        freeTrialActive: P
                    })
                }, e.id))
            }), M && (0, t.jsxs)("div", {
                className: "mx-auto mt-14 flex max-w-[560px] flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-white/10 pt-6 text-sm text-[#8D8D94]",
                children: [(0, t.jsxs)("span", {
                    children: ["Need ", (0, t.jsx)("span", {
                        className: "text-white/70",
                        children: "4K broadcast-grade"
                    }), " streaming? Coming soon."]
                }), (0, t.jsx)("button", {
                    type: "button",
                    onClick: () => C(!0),
                    className: "font-medium text-primary/75 underline decoration-primary/25 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary",
                    children: "Join the 4K waitlist"
                })]
            }), M && (0, t.jsx)(s.WaitlistDialog, {
                open: j,
                onOpenChange: C,
                category: M.category.join(",")
            })]
        })
    }])
}, 29592, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(25913),
        i = e.i(75157);
    let n = (0, a.cva)("group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4", {
        variants: {
            variant: {
                default: "bg-card text-card-foreground",
                destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    });
    e.s(["Alert", 0, function({
        className: e,
        variant: a,
        ...r
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "alert",
            role: "alert",
            className: (0, i.cn)(n({
                variant: a
            }), e),
            ...r
        })
    }, "AlertDescription", 0, function({
        className: e,
        ...a
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "alert-description",
            className: (0, i.cn)("text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", e),
            ...a
        })
    }, "AlertTitle", 0, function({
        className: e,
        ...a
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "alert-title",
            className: (0, i.cn)("font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground", e),
            ...a
        })
    }])
}]);