(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 65858, e => {
    "use strict";
    e.i(47167);
    var t = e.i(29315),
        n = e.i(83977),
        i = e.i(46376),
        r = e.i(88940),
        o = e.i(90627),
        l = e.i(46420),
        a = e.i(56341);
    e.s(["useFloatingRootContext", 0, function(e) {
        let {
            open: s = !1,
            onOpenChange: f,
            elements: u = {}
        } = e, c = (0, n.useId)(), g = null != (0, l.useFloatingParentNodeId)(), d = (0, r.useRefWithInit)(() => new a.FloatingRootStore({
            open: s,
            transitionStatus: void 0,
            onOpenChange: f,
            referenceElement: u.reference ? ? null,
            floatingElement: u.floating ? ? null,
            triggerElements: new o.PopupTriggerMap,
            floatingId: c,
            syncOnly: !1,
            nested: g
        })).current;
        return (0, i.useIsoLayoutEffect)(() => {
            let e = {
                open: s,
                floatingId: c
            };
            void 0 !== u.reference && (e.referenceElement = u.reference, e.domReferenceElement = (0, t.isElement)(u.reference) ? u.reference : null), void 0 !== u.floating && (e.floatingElement = u.floating), d.update(e)
        }, [s, c, u.reference, u.floating, d]), d.context.onOpenChange = f, d.context.nested = g, d
    }])
}, 29365, 60495, 15982, 89579, e => {
    "use strict";
    var t = e.i(15504),
        n = e.i(43084),
        i = e.i(8868),
        r = e.i(33848),
        o = e.i(46376),
        l = e.i(46265),
        a = e.i(67865),
        s = e.i(53760),
        f = e.i(58950),
        u = e.i(29315),
        c = e.i(46420),
        g = e.i(65858),
        d = e.i(72855);
    let m = (0, f.hide)().fn,
        p = {
            name: "hide",
            async fn(e) {
                let {
                    width: t,
                    height: n,
                    x: i,
                    y: r
                } = e.rects.reference, o = await m(e);
                return {
                    data: {
                        referenceHidden: o.data ? .referenceHidden || 0 === t && 0 === n && 0 === i && 0 === r
                    }
                }
            }
        },
        h = {
            sideX: "left",
            sideY: "top"
        };

    function x(e, t, n) {
        let i = "inline-start" === e || "inline-end" === e;
        return ({
            top: "top",
            right: i ? n ? "inline-start" : "inline-end" : "right",
            bottom: "bottom",
            left: i ? n ? "inline-end" : "inline-start" : "left"
        })[t]
    }

    function y(e, t, i) {
        let {
            rects: r,
            placement: o
        } = e;
        return {
            side: x(t, (0, n.getSide)(o), i),
            align: (0, n.getAlignment)(o) || "center",
            anchor: {
                width: r.reference.width,
                height: r.reference.height
            },
            positioner: {
                width: r.floating.width,
                height: r.floating.height
            }
        }
    }

    function w(e) {
        return null != e && "current" in e
    }
    e.s(["DEFAULT_SIDES", 0, h, "adaptiveOrigin", 0, {
        name: "adaptiveOrigin",
        async fn(e) {
            let {
                x: t,
                y: o,
                rects: {
                    floating: l
                },
                elements: {
                    floating: a
                },
                platform: s,
                strategy: f,
                placement: u
            } = e, c = (0, r.ownerWindow)(a), g = c.getComputedStyle(a);
            if ("0s" === g.transitionDuration || "" === g.transitionDuration) return {
                x: t,
                y: o,
                data: h
            };
            let d = await s.getOffsetParent ? .(a),
                m = {
                    width: 0,
                    height: 0
                };
            if ("fixed" === f && c ? .visualViewport) m = {
                width: c.visualViewport.width,
                height: c.visualViewport.height
            };
            else if (d === c) {
                let e = (0, i.ownerDocument)(a);
                m = {
                    width: e.documentElement.clientWidth,
                    height: e.documentElement.clientHeight
                }
            } else await s.isElement ? .(d) && (m = await s.getDimensions(d));
            let p = (0, n.getSide)(u),
                x = t,
                y = o;
            return "left" === p && (x = m.width - (t + l.width)), "top" === p && (y = m.height - (o + l.height)), {
                x,
                y,
                data: {
                    sideX: "left" === p ? "right" : h.sideX,
                    sideY: "top" === p ? "bottom" : h.sideY
                }
            }
        }
    }], 60495), e.s(["useAnchorPositioning", 0, function(e) {
        var m, v;
        let {
            anchor: b,
            positionMethod: A = "absolute",
            side: E = "bottom",
            sideOffset: S = 0,
            align: R = "center",
            alignOffset: C = 0,
            collisionBoundary: O,
            collisionPadding: T = 5,
            sticky: P = !1,
            arrowPadding: L = 5,
            disableAnchorTracking: M = !1,
            inline: D,
            keepMounted: W = !1,
            floatingRootContext: H,
            mounted: F,
            collisionAvoidance: N,
            shiftCrossAxis: k = !1,
            nodeId: B,
            adaptiveOrigin: V,
            lazyFlip: $ = !1,
            externalTree: I
        } = e, [j, z] = t.useState(null);
        F || null === j || z(null);
        let _ = N.side || "flip",
            U = N.align || "flip",
            Y = N.fallbackAxisSide || "end",
            K = "function" == typeof b ? b : void 0,
            X = (0, a.useStableCallback)(K),
            q = K ? X : b,
            J = (0, l.useValueAsRef)(b),
            G = (0, l.useValueAsRef)(F),
            Q = "rtl" === (0, d.useDirection)(),
            Z = j || ({
                top: "top",
                right: "right",
                bottom: "bottom",
                left: "left",
                "inline-end": Q ? "left" : "right",
                "inline-start": Q ? "right" : "left"
            })[E],
            ee = "center" === R ? Z : `${Z}-${R}`,
            et = T,
            en = +("bottom" === E),
            ei = +("top" === E),
            er = +("right" === E),
            eo = +("left" === E);
        "number" == typeof et ? et = {
            top: et + en,
            right: et + eo,
            bottom: et + ei,
            left: et + er
        } : et && (et = {
            top: (et.top || 0) + en,
            right: (et.right || 0) + eo,
            bottom: (et.bottom || 0) + ei,
            left: (et.left || 0) + er
        });
        let el = {
                boundary: "clipping-ancestors" === O ? "clippingAncestors" : O,
                padding: et
            },
            ea = t.useRef(null),
            es = (0, l.useValueAsRef)(S),
            ef = (0, l.useValueAsRef)(C),
            eu = "function" != typeof S ? S : 0,
            ec = "function" != typeof C ? C : 0,
            eg = [];
        D && eg.push(D), eg.push((0, f.offset)(e => {
            let t = y(e, E, Q),
                n = "function" == typeof es.current ? es.current(t) : es.current,
                i = "function" == typeof ef.current ? ef.current(t) : ef.current;
            return {
                mainAxis: n,
                crossAxis: i,
                alignmentAxis: i
            }
        }, [eu, ec, Q, E]));
        let ed = "none" === U && "shift" !== _,
            em = !ed && (P || k || "shift" === _),
            ep = "none" === _ ? null : (0, f.flip)({ ...el,
                padding: {
                    top: et.top + 1,
                    right: et.right + 1,
                    bottom: et.bottom + 1,
                    left: et.left + 1
                },
                mainAxis: !k && "flip" === _,
                crossAxis: "flip" === U && "alignment",
                fallbackAxisSideDirection: Y
            }),
            eh = ed ? null : (0, f.shift)(e => {
                let t = (0, i.ownerDocument)(e.elements.floating).documentElement;
                return { ...el,
                    rootBoundary: k ? {
                        x: 0,
                        y: 0,
                        width: t.clientWidth,
                        height: t.clientHeight
                    } : void 0,
                    mainAxis: "none" !== U,
                    crossAxis: em,
                    limiter: P || k ? void 0 : (0, f.limitShift)(e => {
                        if (!ea.current) return {};
                        let {
                            width: t,
                            height: i
                        } = ea.current.getBoundingClientRect(), r = (0, n.getSideAxis)((0, n.getSide)(e.placement)), o = "y" === r ? et.left + et.right : et.top + et.bottom;
                        return {
                            offset: ("y" === r ? t : i) / 2 + o / 2
                        }
                    })
                }
            }, [el, P, k, et, U]);
        "shift" === _ || "shift" === U || "center" === R ? eg.push(eh, ep) : eg.push(ep, eh), eg.push((0, f.size)({ ...el,
            apply({
                elements: {
                    floating: e
                },
                availableWidth: t,
                availableHeight: n,
                rects: i
            }) {
                if (!G.current) return;
                let o = e.style;
                o.setProperty("--available-width", `${t}px`), o.setProperty("--available-height", `${n}px`);
                let l = (0, r.ownerWindow)(e).devicePixelRatio || 1,
                    {
                        x: a,
                        y: s,
                        width: f,
                        height: u
                    } = i.reference,
                    c = (Math.round((a + f) * l) - Math.round(a * l)) / l,
                    g = (Math.round((s + u) * l) - Math.round(s * l)) / l;
                o.setProperty("--anchor-width", `${c}px`), o.setProperty("--anchor-height", `${g}px`)
            }
        }), (m = e => ({
            element: ea.current || (0, i.ownerDocument)(e.elements.floating).createElement("div"),
            padding: L,
            offsetParent: "floating"
        }), v = [L], { ...{
                name: "arrow",
                options: m,
                async fn(e) {
                    let {
                        x: t,
                        y: i,
                        placement: r,
                        rects: o,
                        platform: l,
                        elements: a,
                        middlewareData: s
                    } = e, {
                        element: f,
                        padding: u = 0,
                        offsetParent: c = "real"
                    } = (0, n.evaluate)(m, e) || {};
                    if (null == f) return {};
                    let g = (0, n.getPaddingObject)(u),
                        d = {
                            x: t,
                            y: i
                        },
                        p = (0, n.getAlignmentAxis)(r),
                        h = (0, n.getAxisLength)(p),
                        x = await l.getDimensions(f),
                        y = "y" === p,
                        w = y ? "clientHeight" : "clientWidth",
                        v = o.reference[h] + o.reference[p] - d[p] - o.floating[h],
                        b = d[p] - o.reference[p],
                        A = "real" === c ? await l.getOffsetParent ? .(f) : a.floating,
                        E = a.floating[w] || o.floating[h];
                    E && await l.isElement ? .(A) || (E = a.floating[w] || o.floating[h]);
                    let S = E / 2 - x[h] / 2 - 1,
                        R = Math.min(g[y ? "top" : "left"], S),
                        C = Math.min(g[y ? "bottom" : "right"], S),
                        O = E - x[h] - C,
                        T = E / 2 - x[h] / 2 + (v / 2 - b / 2),
                        P = (0, n.clamp)(R, T, O),
                        L = !s.arrow && null != (0, n.getAlignment)(r) && T !== P && o.reference[h] / 2 - (T < R ? R : C) - x[h] / 2 < 0,
                        M = L ? T < R ? T - R : T - O : 0;
                    return {
                        [p]: d[p] + M,
                        data: {
                            [p]: P,
                            centerOffset: T - P - M,
                            ...L && {
                                alignmentOffset: M
                            }
                        },
                        reset: L
                    }
                }
            },
            options: [m, v]
        }), {
            name: "transformOrigin",
            fn(e) {
                let {
                    elements: t,
                    middlewareData: i,
                    placement: r,
                    rects: o,
                    y: l
                } = e, a = (0, n.getSide)(r), s = (0, n.getSideAxis)(a), f = ea.current, u = i.arrow ? .x || 0, c = i.arrow ? .y || 0, g = f ? .clientWidth || 0, d = f ? .clientHeight || 0, m = u + g / 2, p = c + d / 2, h = Math.abs(i.shift ? .y || 0), x = o.reference.height / 2, w = "function" == typeof S ? S(y(e, E, Q)) : S, v = h > w, b = {
                    top: `${m}px calc(100% + ${w}px)`,
                    bottom: `${m}px ${-w}px`,
                    left: `calc(100% + ${w}px) ${p}px`,
                    right: `${-w}px ${p}px`
                }[a], A = `${m}px ${o.reference.y+x-l}px`;
                return t.floating.style.setProperty("--transform-origin", em && "y" === s && v ? A : b), {}
            }
        }, p, V), (0, o.useIsoLayoutEffect)(() => {
            !F && H && H.update({
                referenceElement: null,
                floatingElement: null,
                domReferenceElement: null,
                positionReference: null
            })
        }, [F, H]);
        let ex = t.useMemo(() => ({
                elementResize: !M && "u" > typeof ResizeObserver,
                layoutShift: !M && "u" > typeof IntersectionObserver
            }), [M]),
            {
                refs: ey,
                elements: ew,
                x: ev,
                y: eb,
                middlewareData: eA,
                update: eE,
                placement: eS,
                context: eR,
                isPositioned: eC,
                floatingStyles: eO
            } = function(e = {}) {
                let {
                    nodeId: n,
                    externalTree: i
                } = e, r = (0, g.useFloatingRootContext)(e), l = e.rootContext || r, a = l.useState("referenceElement"), s = l.useState("floatingElement"), d = l.useState("domReferenceElement"), m = l.useState("open"), p = l.useState("floatingId"), [h, x] = t.useState(null), [y, w] = t.useState(void 0), [v, b] = t.useState(void 0), A = t.useRef(null), E = (0, c.useFloatingTree)(i), S = t.useMemo(() => ({
                    reference: a,
                    floating: s,
                    domReference: d
                }), [a, s, d]), R = (0, f.useFloating)({ ...e,
                    elements: { ...S,
                        ...h && {
                            reference: h
                        }
                    }
                }), C = (0, u.isElement)(y) ? y : null, O = void 0 === v ? l.state.floatingElement : v;
                l.useSyncedValue("referenceElement", y ? ? null), l.useSyncedValue("domReferenceElement", void 0 === y ? d : C), l.useSyncedValue("floatingElement", O);
                let T = t.useCallback(e => {
                        let t = (0, u.isElement)(e) ? {
                            getBoundingClientRect: () => e.getBoundingClientRect(),
                            getClientRects: () => e.getClientRects(),
                            contextElement: e
                        } : e;
                        x(t), R.refs.setReference(t)
                    }, [R.refs]),
                    P = t.useCallback(e => {
                        ((0, u.isElement)(e) || null === e) && (A.current = e, w(e)), ((0, u.isElement)(R.refs.reference.current) || null === R.refs.reference.current || null !== e && !(0, u.isElement)(e)) && R.refs.setReference(e)
                    }, [R.refs, w]),
                    L = t.useCallback(e => {
                        b(e), R.refs.setFloating(e)
                    }, [R.refs]),
                    M = t.useMemo(() => ({ ...R.refs,
                        setReference: P,
                        setFloating: L,
                        setPositionReference: T,
                        domReference: A
                    }), [R.refs, P, L, T]),
                    D = t.useMemo(() => ({ ...R.elements,
                        domReference: d
                    }), [R.elements, d]),
                    W = t.useMemo(() => ({ ...R,
                        dataRef: l.context.dataRef,
                        open: m,
                        onOpenChange: l.setOpen,
                        events: l.context.events,
                        floatingId: p,
                        refs: M,
                        elements: D,
                        nodeId: n,
                        rootStore: l
                    }), [R, M, D, n, l, m, p]);
                return (0, o.useIsoLayoutEffect)(() => {
                    d && (A.current = d)
                }, [d]), (0, o.useIsoLayoutEffect)(() => {
                    l.context.dataRef.current.floatingContext = W;
                    let e = E ? .nodesRef.current.find(e => e.id === n);
                    e && (e.context = W)
                }), t.useMemo(() => ({ ...R,
                    context: W,
                    refs: M,
                    elements: D,
                    rootStore: l
                }), [R, M, D, W, l])
            }({
                rootContext: H,
                open: W ? F : void 0,
                placement: ee,
                middleware: eg,
                strategy: A,
                whileElementsMounted: W ? void 0 : (...e) => (0, s.autoUpdate)(...e, ex),
                nodeId: B,
                externalTree: I
            }),
            {
                sideX: eT,
                sideY: eP
            } = eA.adaptiveOrigin || h,
            eL = eC ? A : "fixed",
            eM = t.useMemo(() => {
                let e = V ? {
                    position: eL,
                    [eT]: ev,
                    [eP]: eb
                } : {
                    position: eL,
                    ...eO
                };
                return eC || (e.opacity = 0), e
            }, [V, eL, eT, ev, eP, eb, eO, eC]),
            eD = t.useRef(null);
        (0, o.useIsoLayoutEffect)(() => {
            if (!F) return;
            let e = J.current,
                t = "function" == typeof e ? e() : e,
                n = (w(t) ? t.current : t) || null;
            n !== eD.current && (ey.setPositionReference(n), eD.current = n)
        }, [F, ey, q, J]), t.useEffect(() => {
            if (!F) return;
            let e = J.current;
            "function" != typeof e && w(e) && e.current !== eD.current && (ey.setPositionReference(e.current), eD.current = e.current)
        }, [F, ey, q, J]), t.useEffect(() => {
            if (W && F && ew.reference && ew.floating) return (0, s.autoUpdate)(ew.reference, ew.floating, eE, ex)
        }, [W, F, ew, eE, ex]);
        let eW = (0, n.getSide)(eS),
            eH = x(E, eW, Q),
            eF = (0, n.getAlignment)(eS) || "center",
            eN = !!eA.hide ? .referenceHidden;
        (0, o.useIsoLayoutEffect)(() => {
            $ && F && eC && z(eW)
        }, [$, F, eC, eW]);
        let ek = t.useMemo(() => ({
                position: "absolute",
                top: eA.arrow ? .y,
                left: eA.arrow ? .x
            }), [eA.arrow]),
            eB = eA.arrow ? .centerOffset !== 0;
        return t.useMemo(() => ({
            positionerStyles: eM,
            arrowStyles: ek,
            arrowRef: ea,
            arrowUncentered: eB,
            side: eH,
            align: eF,
            physicalSide: eW,
            anchorHidden: eN,
            refs: ey,
            context: eR,
            isPositioned: eC,
            update: eE
        }), [eM, ek, ea, eB, eH, eF, eW, eN, ey, eR, eC, eE])
    }], 29365);
    var v = e.i(5005),
        b = e.i(52245),
        A = e.i(56789),
        E = e.i(38396);

    function S(e) {
        return "starting" === e ? E.DISABLED_TRANSITIONS_STYLE : A.EMPTY_OBJECT
    }
    e.s(["getDisabledMountTransitionStyles", 0, S], 15982), e.s(["usePositioner", 0, function(e, t, {
        styles: n,
        transitionStatus: i,
        props: r,
        refs: o,
        hidden: l,
        inert: a = !1
    }) {
        let s = { ...n
        };
        return a && (s.pointerEvents = "none"), (0, b.useRenderElement)("div", e, {
            state: t,
            ref: o,
            props: [{
                role: "presentation",
                hidden: l,
                style: s
            }, S(i), r],
            stateAttributesMapping: v.popupStateMapping
        })
    }], 89579)
}, 94258, e => {
    "use strict";
    var t = e.i(15504);
    e.s(["usePreviousValue", 0, function(e) {
        let [n, i] = t.useState({
            current: e,
            previous: null
        });
        return e !== n.current && i({
            current: e,
            previous: n.current
        }), n.previous
    }])
}, 53760, 58950, e => {
    "use strict";
    var t = e.i(43084);

    function n(e, n, i) {
        let r, {
                reference: o,
                floating: l
            } = e,
            a = (0, t.getSideAxis)(n),
            s = (0, t.getAlignmentAxis)(n),
            f = (0, t.getAxisLength)(s),
            u = (0, t.getSide)(n),
            c = "y" === a,
            g = o.x + o.width / 2 - l.width / 2,
            d = o.y + o.height / 2 - l.height / 2,
            m = o[f] / 2 - l[f] / 2;
        switch (u) {
            case "top":
                r = {
                    x: g,
                    y: o.y - l.height
                };
                break;
            case "bottom":
                r = {
                    x: g,
                    y: o.y + o.height
                };
                break;
            case "right":
                r = {
                    x: o.x + o.width,
                    y: d
                };
                break;
            case "left":
                r = {
                    x: o.x - l.width,
                    y: d
                };
                break;
            default:
                r = {
                    x: o.x,
                    y: o.y
                }
        }
        switch ((0, t.getAlignment)(n)) {
            case "start":
                r[s] -= m * (i && c ? -1 : 1);
                break;
            case "end":
                r[s] += m * (i && c ? -1 : 1)
        }
        return r
    }
    async function i(e, n) {
        var i;
        void 0 === n && (n = {});
        let {
            x: r,
            y: o,
            platform: l,
            rects: a,
            elements: s,
            strategy: f
        } = e, {
            boundary: u = "clippingAncestors",
            rootBoundary: c = "viewport",
            elementContext: g = "floating",
            altBoundary: d = !1,
            padding: m = 0
        } = (0, t.evaluate)(n, e), p = (0, t.getPaddingObject)(m), h = s[d ? "floating" === g ? "reference" : "floating" : g], x = (0, t.rectToClientRect)(await l.getClippingRect({
            element: null == (i = await (null == l.isElement ? void 0 : l.isElement(h))) || i ? h : h.contextElement || await (null == l.getDocumentElement ? void 0 : l.getDocumentElement(s.floating)),
            boundary: u,
            rootBoundary: c,
            strategy: f
        })), y = "floating" === g ? {
            x: r,
            y: o,
            width: a.floating.width,
            height: a.floating.height
        } : a.reference, w = await (null == l.getOffsetParent ? void 0 : l.getOffsetParent(s.floating)), v = await (null == l.isElement ? void 0 : l.isElement(w)) && await (null == l.getScale ? void 0 : l.getScale(w)) || {
            x: 1,
            y: 1
        }, b = (0, t.rectToClientRect)(l.convertOffsetParentRelativeRectToViewportRelativeRect ? await l.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: s,
            rect: y,
            offsetParent: w,
            strategy: f
        }) : y);
        return {
            top: (x.top - b.top + p.top) / v.y,
            bottom: (b.bottom - x.bottom + p.bottom) / v.y,
            left: (x.left - b.left + p.left) / v.x,
            right: (b.right - x.right + p.right) / v.x
        }
    }
    let r = async (e, t, r) => {
        let {
            placement: o = "bottom",
            strategy: l = "absolute",
            middleware: a = [],
            platform: s
        } = r, f = s.detectOverflow ? s : { ...s,
            detectOverflow: i
        }, u = await (null == s.isRTL ? void 0 : s.isRTL(t)), c = await s.getElementRects({
            reference: e,
            floating: t,
            strategy: l
        }), {
            x: g,
            y: d
        } = n(c, o, u), m = o, p = 0, h = {};
        for (let i = 0; i < a.length; i++) {
            let r = a[i];
            if (!r) continue;
            let {
                name: x,
                fn: y
            } = r, {
                x: w,
                y: v,
                data: b,
                reset: A
            } = await y({
                x: g,
                y: d,
                initialPlacement: o,
                placement: m,
                strategy: l,
                middlewareData: h,
                rects: c,
                platform: f,
                elements: {
                    reference: e,
                    floating: t
                }
            });
            g = null != w ? w : g, d = null != v ? v : d, h[x] = { ...h[x],
                ...b
            }, A && p < 50 && (p++, "object" == typeof A && (A.placement && (m = A.placement), A.rects && (c = !0 === A.rects ? await s.getElementRects({
                reference: e,
                floating: t,
                strategy: l
            }) : A.rects), {
                x: g,
                y: d
            } = n(c, m, u)), i = -1)
        }
        return {
            x: g,
            y: d,
            placement: m,
            strategy: l,
            middlewareData: h
        }
    };

    function o(e, t) {
        return {
            top: e.top - t.height,
            right: e.right - t.width,
            bottom: e.bottom - t.height,
            left: e.left - t.width
        }
    }

    function l(e) {
        return t.sides.some(t => e[t] >= 0)
    }

    function a(e) {
        let n = (0, t.min)(...e.map(e => e.left)),
            i = (0, t.min)(...e.map(e => e.top));
        return {
            x: n,
            y: i,
            width: (0, t.max)(...e.map(e => e.right)) - n,
            height: (0, t.max)(...e.map(e => e.bottom)) - i
        }
    }
    let s = new Set(["left", "top"]);
    async function f(e, n) {
        let {
            placement: i,
            platform: r,
            elements: o
        } = e, l = await (null == r.isRTL ? void 0 : r.isRTL(o.floating)), a = (0, t.getSide)(i), f = (0, t.getAlignment)(i), u = "y" === (0, t.getSideAxis)(i), c = s.has(a) ? -1 : 1, g = l && u ? -1 : 1, d = (0, t.evaluate)(n, e), {
            mainAxis: m,
            crossAxis: p,
            alignmentAxis: h
        } = "number" == typeof d ? {
            mainAxis: d,
            crossAxis: 0,
            alignmentAxis: null
        } : {
            mainAxis: d.mainAxis || 0,
            crossAxis: d.crossAxis || 0,
            alignmentAxis: d.alignmentAxis
        };
        return f && "number" == typeof h && (p = "end" === f ? -1 * h : h), u ? {
            x: p * g,
            y: m * c
        } : {
            x: m * c,
            y: p * g
        }
    }
    var u = e.i(29315);

    function c(e) {
        let n = (0, u.getComputedStyle)(e),
            i = parseFloat(n.width) || 0,
            r = parseFloat(n.height) || 0,
            o = (0, u.isHTMLElement)(e),
            l = o ? e.offsetWidth : i,
            a = o ? e.offsetHeight : r,
            s = (0, t.round)(i) !== l || (0, t.round)(r) !== a;
        return s && (i = l, r = a), {
            width: i,
            height: r,
            $: s
        }
    }

    function g(e) {
        return (0, u.isElement)(e) ? e : e.contextElement
    }

    function d(e) {
        let n = g(e);
        if (!(0, u.isHTMLElement)(n)) return (0, t.createCoords)(1);
        let i = n.getBoundingClientRect(),
            {
                width: r,
                height: o,
                $: l
            } = c(n),
            a = (l ? (0, t.round)(i.width) : i.width) / r,
            s = (l ? (0, t.round)(i.height) : i.height) / o;
        return a && Number.isFinite(a) || (a = 1), s && Number.isFinite(s) || (s = 1), {
            x: a,
            y: s
        }
    }
    let m = (0, t.createCoords)(0);

    function p(e) {
        let t = (0, u.getWindow)(e);
        return (0, u.isWebKit)() && t.visualViewport ? {
            x: t.visualViewport.offsetLeft,
            y: t.visualViewport.offsetTop
        } : m
    }

    function h(e, n, i, r) {
        var o;
        void 0 === n && (n = !1), void 0 === i && (i = !1);
        let l = e.getBoundingClientRect(),
            a = g(e),
            s = (0, t.createCoords)(1);
        n && (r ? (0, u.isElement)(r) && (s = d(r)) : s = d(e));
        let f = (void 0 === (o = i) && (o = !1), r && (!o || r === (0, u.getWindow)(a)) && o) ? p(a) : (0, t.createCoords)(0),
            c = (l.left + f.x) / s.x,
            m = (l.top + f.y) / s.y,
            h = l.width / s.x,
            x = l.height / s.y;
        if (a) {
            let e = (0, u.getWindow)(a),
                t = r && (0, u.isElement)(r) ? (0, u.getWindow)(r) : r,
                n = e,
                i = (0, u.getFrameElement)(n);
            for (; i && r && t !== n;) {
                let e = d(i),
                    t = i.getBoundingClientRect(),
                    r = (0, u.getComputedStyle)(i),
                    o = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x,
                    l = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
                c *= e.x, m *= e.y, h *= e.x, x *= e.y, c += o, m += l, n = (0, u.getWindow)(i), i = (0, u.getFrameElement)(n)
            }
        }
        return (0, t.rectToClientRect)({
            width: h,
            height: x,
            x: c,
            y: m
        })
    }

    function x(e, t) {
        let n = (0, u.getNodeScroll)(e).scrollLeft;
        return t ? t.left + n : h((0, u.getDocumentElement)(e)).left + n
    }

    function y(e, t) {
        let n = e.getBoundingClientRect();
        return {
            x: n.left + t.scrollLeft - x(e, n),
            y: n.top + t.scrollTop
        }
    }

    function w(e, n, i) {
        var r;
        let o;
        if ("viewport" === n) o = function(e, t) {
            let n = (0, u.getWindow)(e),
                i = (0, u.getDocumentElement)(e),
                r = n.visualViewport,
                o = i.clientWidth,
                l = i.clientHeight,
                a = 0,
                s = 0;
            if (r) {
                o = r.width, l = r.height;
                let e = (0, u.isWebKit)();
                (!e || e && "fixed" === t) && (a = r.offsetLeft, s = r.offsetTop)
            }
            let f = x(i);
            if (f <= 0) {
                let e = i.ownerDocument,
                    t = e.body,
                    n = getComputedStyle(t),
                    r = "CSS1Compat" === e.compatMode && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0,
                    l = Math.abs(i.clientWidth - t.clientWidth - r);
                l <= 25 && (o -= l)
            } else f <= 25 && (o += f);
            return {
                width: o,
                height: l,
                x: a,
                y: s
            }
        }(e, i);
        else if ("document" === n) {
            let n, i, l, a, s, f, c;
            r = (0, u.getDocumentElement)(e), n = (0, u.getDocumentElement)(r), i = (0, u.getNodeScroll)(r), l = r.ownerDocument.body, a = (0, t.max)(n.scrollWidth, n.clientWidth, l.scrollWidth, l.clientWidth), s = (0, t.max)(n.scrollHeight, n.clientHeight, l.scrollHeight, l.clientHeight), f = -i.scrollLeft + x(r), c = -i.scrollTop, "rtl" === (0, u.getComputedStyle)(l).direction && (f += (0, t.max)(n.clientWidth, l.clientWidth) - a), o = {
                width: a,
                height: s,
                x: f,
                y: c
            }
        } else if ((0, u.isElement)(n)) {
            let e, r, l, a, s, f;
            r = (e = h(n, !0, "fixed" === i)).top + n.clientTop, l = e.left + n.clientLeft, a = (0, u.isHTMLElement)(n) ? d(n) : (0, t.createCoords)(1), s = n.clientWidth * a.x, f = n.clientHeight * a.y, o = {
                width: s,
                height: f,
                x: l * a.x,
                y: r * a.y
            }
        } else {
            let t = p(e);
            o = {
                x: n.x - t.x,
                y: n.y - t.y,
                width: n.width,
                height: n.height
            }
        }
        return (0, t.rectToClientRect)(o)
    }

    function v(e) {
        return "static" === (0, u.getComputedStyle)(e).position
    }

    function b(e, t) {
        if (!(0, u.isHTMLElement)(e) || "fixed" === (0, u.getComputedStyle)(e).position) return null;
        if (t) return t(e);
        let n = e.offsetParent;
        return (0, u.getDocumentElement)(e) === n && (n = n.ownerDocument.body), n
    }

    function A(e, t) {
        let n = (0, u.getWindow)(e);
        if ((0, u.isTopLayer)(e)) return n;
        if (!(0, u.isHTMLElement)(e)) {
            let t = (0, u.getParentNode)(e);
            for (; t && !(0, u.isLastTraversableNode)(t);) {
                if ((0, u.isElement)(t) && !v(t)) return t;
                t = (0, u.getParentNode)(t)
            }
            return n
        }
        let i = b(e, t);
        for (; i && (0, u.isTableElement)(i) && v(i);) i = b(i, t);
        return i && (0, u.isLastTraversableNode)(i) && v(i) && !(0, u.isContainingBlock)(i) ? n : i || (0, u.getContainingBlock)(e) || n
    }
    let E = async function(e) {
            let n = this.getOffsetParent || A,
                i = this.getDimensions,
                r = await i(e.floating);
            return {
                reference: function(e, n, i) {
                    let r = (0, u.isHTMLElement)(n),
                        o = (0, u.getDocumentElement)(n),
                        l = "fixed" === i,
                        a = h(e, !0, l, n),
                        s = {
                            scrollLeft: 0,
                            scrollTop: 0
                        },
                        f = (0, t.createCoords)(0);
                    if (r || !r && !l)
                        if (("body" !== (0, u.getNodeName)(n) || (0, u.isOverflowElement)(o)) && (s = (0, u.getNodeScroll)(n)), r) {
                            let e = h(n, !0, l, n);
                            f.x = e.x + n.clientLeft, f.y = e.y + n.clientTop
                        } else o && (f.x = x(o));
                    l && !r && o && (f.x = x(o));
                    let c = !o || r || l ? (0, t.createCoords)(0) : y(o, s);
                    return {
                        x: a.left + s.scrollLeft - f.x - c.x,
                        y: a.top + s.scrollTop - f.y - c.y,
                        width: a.width,
                        height: a.height
                    }
                }(e.reference, await n(e.floating), e.strategy),
                floating: {
                    x: 0,
                    y: 0,
                    width: r.width,
                    height: r.height
                }
            }
        },
        S = {
            convertOffsetParentRelativeRectToViewportRelativeRect: function(e) {
                let {
                    elements: n,
                    rect: i,
                    offsetParent: r,
                    strategy: o
                } = e, l = "fixed" === o, a = (0, u.getDocumentElement)(r), s = !!n && (0, u.isTopLayer)(n.floating);
                if (r === a || s && l) return i;
                let f = {
                        scrollLeft: 0,
                        scrollTop: 0
                    },
                    c = (0, t.createCoords)(1),
                    g = (0, t.createCoords)(0),
                    m = (0, u.isHTMLElement)(r);
                if ((m || !m && !l) && (("body" !== (0, u.getNodeName)(r) || (0, u.isOverflowElement)(a)) && (f = (0, u.getNodeScroll)(r)), m)) {
                    let e = h(r);
                    c = d(r), g.x = e.x + r.clientLeft, g.y = e.y + r.clientTop
                }
                let p = !a || m || l ? (0, t.createCoords)(0) : y(a, f);
                return {
                    width: i.width * c.x,
                    height: i.height * c.y,
                    x: i.x * c.x - f.scrollLeft * c.x + g.x + p.x,
                    y: i.y * c.y - f.scrollTop * c.y + g.y + p.y
                }
            },
            getDocumentElement: u.getDocumentElement,
            getClippingRect: function(e) {
                let {
                    element: n,
                    boundary: i,
                    rootBoundary: r,
                    strategy: o
                } = e, l = [..."clippingAncestors" === i ? (0, u.isTopLayer)(n) ? [] : function(e, t) {
                    let n = t.get(e);
                    if (n) return n;
                    let i = (0, u.getOverflowAncestors)(e, [], !1).filter(e => (0, u.isElement)(e) && "body" !== (0, u.getNodeName)(e)),
                        r = null,
                        o = "fixed" === (0, u.getComputedStyle)(e).position,
                        l = o ? (0, u.getParentNode)(e) : e;
                    for (;
                        (0, u.isElement)(l) && !(0, u.isLastTraversableNode)(l);) {
                        let t = (0, u.getComputedStyle)(l),
                            n = (0, u.isContainingBlock)(l);
                        n || "fixed" !== t.position || (r = null), (o ? n || r : !(!n && "static" === t.position && r && ("absolute" === r.position || "fixed" === r.position) || (0, u.isOverflowElement)(l) && !n && function e(t, n) {
                            let i = (0, u.getParentNode)(t);
                            return !(i === n || !(0, u.isElement)(i) || (0, u.isLastTraversableNode)(i)) && ("fixed" === (0, u.getComputedStyle)(i).position || e(i, n))
                        }(e, l))) ? r = t : i = i.filter(e => e !== l), l = (0, u.getParentNode)(l)
                    }
                    return t.set(e, i), i
                }(n, this._c) : [].concat(i), r], a = w(n, l[0], o), s = a.top, f = a.right, c = a.bottom, g = a.left;
                for (let e = 1; e < l.length; e++) {
                    let i = w(n, l[e], o);
                    s = (0, t.max)(i.top, s), f = (0, t.min)(i.right, f), c = (0, t.min)(i.bottom, c), g = (0, t.max)(i.left, g)
                }
                return {
                    width: f - g,
                    height: c - s,
                    x: g,
                    y: s
                }
            },
            getOffsetParent: A,
            getElementRects: E,
            getClientRects: function(e) {
                return Array.from(e.getClientRects())
            },
            getDimensions: function(e) {
                let {
                    width: t,
                    height: n
                } = c(e);
                return {
                    width: t,
                    height: n
                }
            },
            getScale: d,
            isElement: u.isElement,
            isRTL: function(e) {
                return "rtl" === (0, u.getComputedStyle)(e).direction
            }
        };

    function R(e, t) {
        return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
    }
    let C = function(e) {
            return void 0 === e && (e = 0), {
                name: "offset",
                options: e,
                async fn(t) {
                    var n, i;
                    let {
                        x: r,
                        y: o,
                        placement: l,
                        middlewareData: a
                    } = t, s = await f(t, e);
                    return l === (null == (n = a.offset) ? void 0 : n.placement) && null != (i = a.arrow) && i.alignmentOffset ? {} : {
                        x: r + s.x,
                        y: o + s.y,
                        data: { ...s,
                            placement: l
                        }
                    }
                }
            }
        },
        O = function(e) {
            return void 0 === e && (e = {}), {
                name: "shift",
                options: e,
                async fn(n) {
                    let {
                        x: i,
                        y: r,
                        placement: o,
                        platform: l
                    } = n, {
                        mainAxis: a = !0,
                        crossAxis: s = !1,
                        limiter: f = {
                            fn: e => {
                                let {
                                    x: t,
                                    y: n
                                } = e;
                                return {
                                    x: t,
                                    y: n
                                }
                            }
                        },
                        ...u
                    } = (0, t.evaluate)(e, n), c = {
                        x: i,
                        y: r
                    }, g = await l.detectOverflow(n, u), d = (0, t.getSideAxis)((0, t.getSide)(o)), m = (0, t.getOppositeAxis)(d), p = c[m], h = c[d];
                    if (a) {
                        let e = "y" === m ? "top" : "left",
                            n = "y" === m ? "bottom" : "right",
                            i = p + g[e],
                            r = p - g[n];
                        p = (0, t.clamp)(i, p, r)
                    }
                    if (s) {
                        let e = "y" === d ? "top" : "left",
                            n = "y" === d ? "bottom" : "right",
                            i = h + g[e],
                            r = h - g[n];
                        h = (0, t.clamp)(i, h, r)
                    }
                    let x = f.fn({ ...n,
                        [m]: p,
                        [d]: h
                    });
                    return { ...x,
                        data: {
                            x: x.x - i,
                            y: x.y - r,
                            enabled: {
                                [m]: a,
                                [d]: s
                            }
                        }
                    }
                }
            }
        },
        T = function(e) {
            return void 0 === e && (e = {}), {
                name: "flip",
                options: e,
                async fn(n) {
                    var i, r, o, l, a;
                    let {
                        placement: s,
                        middlewareData: f,
                        rects: u,
                        initialPlacement: c,
                        platform: g,
                        elements: d
                    } = n, {
                        mainAxis: m = !0,
                        crossAxis: p = !0,
                        fallbackPlacements: h,
                        fallbackStrategy: x = "bestFit",
                        fallbackAxisSideDirection: y = "none",
                        flipAlignment: w = !0,
                        ...v
                    } = (0, t.evaluate)(e, n);
                    if (null != (i = f.arrow) && i.alignmentOffset) return {};
                    let b = (0, t.getSide)(s),
                        A = (0, t.getSideAxis)(c),
                        E = (0, t.getSide)(c) === c,
                        S = await (null == g.isRTL ? void 0 : g.isRTL(d.floating)),
                        R = h || (E || !w ? [(0, t.getOppositePlacement)(c)] : (0, t.getExpandedPlacements)(c)),
                        C = "none" !== y;
                    !h && C && R.push(...(0, t.getOppositeAxisPlacements)(c, w, y, S));
                    let O = [c, ...R],
                        T = await g.detectOverflow(n, v),
                        P = [],
                        L = (null == (r = f.flip) ? void 0 : r.overflows) || [];
                    if (m && P.push(T[b]), p) {
                        let e = (0, t.getAlignmentSides)(s, u, S);
                        P.push(T[e[0]], T[e[1]])
                    }
                    if (L = [...L, {
                            placement: s,
                            overflows: P
                        }], !P.every(e => e <= 0)) {
                        let e = ((null == (o = f.flip) ? void 0 : o.index) || 0) + 1,
                            n = O[e];
                        if (n && ("alignment" !== p || A === (0, t.getSideAxis)(n) || L.every(e => (0, t.getSideAxis)(e.placement) !== A || e.overflows[0] > 0))) return {
                            data: {
                                index: e,
                                overflows: L
                            },
                            reset: {
                                placement: n
                            }
                        };
                        let i = null == (l = L.filter(e => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]) ? void 0 : l.placement;
                        if (!i) switch (x) {
                            case "bestFit":
                                {
                                    let e = null == (a = L.filter(e => {
                                        if (C) {
                                            let n = (0, t.getSideAxis)(e.placement);
                                            return n === A || "y" === n
                                        }
                                        return !0
                                    }).map(e => [e.placement, e.overflows.filter(e => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]) ? void 0 : a[0];e && (i = e);
                                    break
                                }
                            case "initialPlacement":
                                i = c
                        }
                        if (s !== i) return {
                            reset: {
                                placement: i
                            }
                        }
                    }
                    return {}
                }
            }
        },
        P = function(e) {
            return void 0 === e && (e = {}), {
                name: "size",
                options: e,
                async fn(n) {
                    var i, r;
                    let o, l, {
                            placement: a,
                            rects: s,
                            platform: f,
                            elements: u
                        } = n,
                        {
                            apply: c = () => {},
                            ...g
                        } = (0, t.evaluate)(e, n),
                        d = await f.detectOverflow(n, g),
                        m = (0, t.getSide)(a),
                        p = (0, t.getAlignment)(a),
                        h = "y" === (0, t.getSideAxis)(a),
                        {
                            width: x,
                            height: y
                        } = s.floating;
                    "top" === m || "bottom" === m ? (o = m, l = p === (await (null == f.isRTL ? void 0 : f.isRTL(u.floating)) ? "start" : "end") ? "left" : "right") : (l = m, o = "end" === p ? "top" : "bottom");
                    let w = y - d.top - d.bottom,
                        v = x - d.left - d.right,
                        b = (0, t.min)(y - d[o], w),
                        A = (0, t.min)(x - d[l], v),
                        E = !n.middlewareData.shift,
                        S = b,
                        R = A;
                    if (null != (i = n.middlewareData.shift) && i.enabled.x && (R = v), null != (r = n.middlewareData.shift) && r.enabled.y && (S = w), E && !p) {
                        let e = (0, t.max)(d.left, 0),
                            n = (0, t.max)(d.right, 0),
                            i = (0, t.max)(d.top, 0),
                            r = (0, t.max)(d.bottom, 0);
                        h ? R = x - 2 * (0 !== e || 0 !== n ? e + n : (0, t.max)(d.left, d.right)) : S = y - 2 * (0 !== i || 0 !== r ? i + r : (0, t.max)(d.top, d.bottom))
                    }
                    await c({ ...n,
                        availableWidth: R,
                        availableHeight: S
                    });
                    let C = await f.getDimensions(u.floating);
                    return x !== C.width || y !== C.height ? {
                        reset: {
                            rects: !0
                        }
                    } : {}
                }
            }
        },
        L = function(e) {
            return void 0 === e && (e = {}), {
                name: "hide",
                options: e,
                async fn(n) {
                    let {
                        rects: i,
                        platform: r
                    } = n, {
                        strategy: a = "referenceHidden",
                        ...s
                    } = (0, t.evaluate)(e, n);
                    switch (a) {
                        case "referenceHidden":
                            {
                                let e = o(await r.detectOverflow(n, { ...s,
                                    elementContext: "reference"
                                }), i.reference);
                                return {
                                    data: {
                                        referenceHiddenOffsets: e,
                                        referenceHidden: l(e)
                                    }
                                }
                            }
                        case "escaped":
                            {
                                let e = o(await r.detectOverflow(n, { ...s,
                                    altBoundary: !0
                                }), i.floating);
                                return {
                                    data: {
                                        escapedOffsets: e,
                                        escaped: l(e)
                                    }
                                }
                            }
                        default:
                            return {}
                    }
                }
            }
        },
        M = function(e) {
            return void 0 === e && (e = {}), {
                options: e,
                fn(n) {
                    let {
                        x: i,
                        y: r,
                        placement: o,
                        rects: l,
                        middlewareData: a
                    } = n, {
                        offset: f = 0,
                        mainAxis: u = !0,
                        crossAxis: c = !0
                    } = (0, t.evaluate)(e, n), g = {
                        x: i,
                        y: r
                    }, d = (0, t.getSideAxis)(o), m = (0, t.getOppositeAxis)(d), p = g[m], h = g[d], x = (0, t.evaluate)(f, n), y = "number" == typeof x ? {
                        mainAxis: x,
                        crossAxis: 0
                    } : {
                        mainAxis: 0,
                        crossAxis: 0,
                        ...x
                    };
                    if (u) {
                        let e = "y" === m ? "height" : "width",
                            t = l.reference[m] - l.floating[e] + y.mainAxis,
                            n = l.reference[m] + l.reference[e] - y.mainAxis;
                        p < t ? p = t : p > n && (p = n)
                    }
                    if (c) {
                        var w, v;
                        let e = "y" === m ? "width" : "height",
                            n = s.has((0, t.getSide)(o)),
                            i = l.reference[d] - l.floating[e] + (n && (null == (w = a.offset) ? void 0 : w[d]) || 0) + (n ? 0 : y.crossAxis),
                            r = l.reference[d] + l.reference[e] + (n ? 0 : (null == (v = a.offset) ? void 0 : v[d]) || 0) - (n ? y.crossAxis : 0);
                        h < i ? h = i : h > r && (h = r)
                    }
                    return {
                        [m]: p,
                        [d]: h
                    }
                }
            }
        },
        D = (e, t, n) => {
            let i = new Map,
                o = {
                    platform: S,
                    ...n
                },
                l = { ...o.platform,
                    _c: i
                };
            return r(e, t, { ...o,
                platform: l
            })
        };
    e.s(["arrow", 0, e => ({
        name: "arrow",
        options: e,
        async fn(n) {
            let {
                x: i,
                y: r,
                placement: o,
                rects: l,
                platform: a,
                elements: s,
                middlewareData: f
            } = n, {
                element: u,
                padding: c = 0
            } = (0, t.evaluate)(e, n) || {};
            if (null == u) return {};
            let g = (0, t.getPaddingObject)(c),
                d = {
                    x: i,
                    y: r
                },
                m = (0, t.getAlignmentAxis)(o),
                p = (0, t.getAxisLength)(m),
                h = await a.getDimensions(u),
                x = "y" === m,
                y = x ? "clientHeight" : "clientWidth",
                w = l.reference[p] + l.reference[m] - d[m] - l.floating[p],
                v = d[m] - l.reference[m],
                b = await (null == a.getOffsetParent ? void 0 : a.getOffsetParent(u)),
                A = b ? b[y] : 0;
            A && await (null == a.isElement ? void 0 : a.isElement(b)) || (A = s.floating[y] || l.floating[p]);
            let E = A / 2 - h[p] / 2 - 1,
                S = (0, t.min)(g[x ? "top" : "left"], E),
                R = (0, t.min)(g[x ? "bottom" : "right"], E),
                C = A - h[p] - R,
                O = A / 2 - h[p] / 2 + (w / 2 - v / 2),
                T = (0, t.clamp)(S, O, C),
                P = !f.arrow && null != (0, t.getAlignment)(o) && O !== T && l.reference[p] / 2 - (O < S ? S : R) - h[p] / 2 < 0,
                L = P ? O < S ? O - S : O - C : 0;
            return {
                [m]: d[m] + L,
                data: {
                    [m]: T,
                    centerOffset: O - T - L,
                    ...P && {
                        alignmentOffset: L
                    }
                },
                reset: P
            }
        }
    }), "autoPlacement", 0, function(e) {
        return void 0 === e && (e = {}), {
            name: "autoPlacement",
            options: e,
            async fn(n) {
                var i, r, o, l;
                let {
                    rects: a,
                    middlewareData: s,
                    placement: f,
                    platform: u,
                    elements: c
                } = n, {
                    crossAxis: g = !1,
                    alignment: d,
                    allowedPlacements: m = t.placements,
                    autoAlignment: p = !0,
                    ...h
                } = (0, t.evaluate)(e, n), x = void 0 !== d || m === t.placements ? ((l = d || null) ? [...m.filter(e => (0, t.getAlignment)(e) === l), ...m.filter(e => (0, t.getAlignment)(e) !== l)] : m.filter(e => (0, t.getSide)(e) === e)).filter(e => !l || (0, t.getAlignment)(e) === l || !!p && (0, t.getOppositeAlignmentPlacement)(e) !== e) : m, y = await u.detectOverflow(n, h), w = (null == (i = s.autoPlacement) ? void 0 : i.index) || 0, v = x[w];
                if (null == v) return {};
                let b = (0, t.getAlignmentSides)(v, a, await (null == u.isRTL ? void 0 : u.isRTL(c.floating)));
                if (f !== v) return {
                    reset: {
                        placement: x[0]
                    }
                };
                let A = [y[(0, t.getSide)(v)], y[b[0]], y[b[1]]],
                    E = [...(null == (r = s.autoPlacement) ? void 0 : r.overflows) || [], {
                        placement: v,
                        overflows: A
                    }],
                    S = x[w + 1];
                if (S) return {
                    data: {
                        index: w + 1,
                        overflows: E
                    },
                    reset: {
                        placement: S
                    }
                };
                let R = E.map(e => {
                        let n = (0, t.getAlignment)(e.placement);
                        return [e.placement, n && g ? e.overflows.slice(0, 2).reduce((e, t) => e + t, 0) : e.overflows[0], e.overflows]
                    }).sort((e, t) => e[1] - t[1]),
                    C = (null == (o = R.filter(e => e[2].slice(0, (0, t.getAlignment)(e[0]) ? 2 : 3).every(e => e <= 0))[0]) ? void 0 : o[0]) || R[0][0];
                return C !== f ? {
                    data: {
                        index: w + 1,
                        overflows: E
                    },
                    reset: {
                        placement: C
                    }
                } : {}
            }
        }
    }, "autoUpdate", 0, function(e, n, i, r) {
        let o;
        void 0 === r && (r = {});
        let {
            ancestorScroll: l = !0,
            ancestorResize: a = !0,
            elementResize: s = "function" == typeof ResizeObserver,
            layoutShift: f = "function" == typeof IntersectionObserver,
            animationFrame: c = !1
        } = r, d = g(e), m = l || a ? [...d ? (0, u.getOverflowAncestors)(d) : [], ...n ? (0, u.getOverflowAncestors)(n) : []] : [];
        m.forEach(e => {
            l && e.addEventListener("scroll", i, {
                passive: !0
            }), a && e.addEventListener("resize", i)
        });
        let p = d && f ? function(e, n) {
                let i, r = null,
                    o = (0, u.getDocumentElement)(e);

                function l() {
                    var e;
                    clearTimeout(i), null == (e = r) || e.disconnect(), r = null
                }
                return ! function a(s, f) {
                    void 0 === s && (s = !1), void 0 === f && (f = 1), l();
                    let u = e.getBoundingClientRect(),
                        {
                            left: c,
                            top: g,
                            width: d,
                            height: m
                        } = u;
                    if (s || n(), !d || !m) return;
                    let p = {
                            rootMargin: -(0, t.floor)(g) + "px " + -(0, t.floor)(o.clientWidth - (c + d)) + "px " + -(0, t.floor)(o.clientHeight - (g + m)) + "px " + -(0, t.floor)(c) + "px",
                            threshold: (0, t.max)(0, (0, t.min)(1, f)) || 1
                        },
                        h = !0;

                    function x(t) {
                        let n = t[0].intersectionRatio;
                        if (n !== f) {
                            if (!h) return a();
                            n ? a(!1, n) : i = setTimeout(() => {
                                a(!1, 1e-7)
                            }, 1e3)
                        }
                        1 !== n || R(u, e.getBoundingClientRect()) || a(), h = !1
                    }
                    try {
                        r = new IntersectionObserver(x, { ...p,
                            root: o.ownerDocument
                        })
                    } catch (e) {
                        r = new IntersectionObserver(x, p)
                    }
                    r.observe(e)
                }(!0), l
            }(d, i) : null,
            x = -1,
            y = null;
        s && (y = new ResizeObserver(e => {
            let [t] = e;
            t && t.target === d && y && n && (y.unobserve(n), cancelAnimationFrame(x), x = requestAnimationFrame(() => {
                var e;
                null == (e = y) || e.observe(n)
            })), i()
        }), d && !c && y.observe(d), n && y.observe(n));
        let w = c ? h(e) : null;
        return c && function t() {
            let n = h(e);
            w && !R(w, n) && i(), w = n, o = requestAnimationFrame(t)
        }(), i(), () => {
            var e;
            m.forEach(e => {
                l && e.removeEventListener("scroll", i), a && e.removeEventListener("resize", i)
            }), null == p || p(), null == (e = y) || e.disconnect(), y = null, c && cancelAnimationFrame(o)
        }
    }, "computePosition", 0, D, "flip", 0, T, "hide", 0, L, "inline", 0, function(e) {
        return void 0 === e && (e = {}), {
            name: "inline",
            options: e,
            async fn(n) {
                let {
                    placement: i,
                    elements: r,
                    rects: o,
                    platform: l,
                    strategy: s
                } = n, {
                    padding: f = 2,
                    x: u,
                    y: c
                } = (0, t.evaluate)(e, n), g = Array.from(await (null == l.getClientRects ? void 0 : l.getClientRects(r.reference)) || []), d = function(e) {
                    let n = e.slice().sort((e, t) => e.y - t.y),
                        i = [],
                        r = null;
                    for (let e = 0; e < n.length; e++) {
                        let t = n[e];
                        !r || t.y - r.y > r.height / 2 ? i.push([t]) : i[i.length - 1].push(t), r = t
                    }
                    return i.map(e => (0, t.rectToClientRect)(a(e)))
                }(g), m = (0, t.rectToClientRect)(a(g)), p = (0, t.getPaddingObject)(f), h = await l.getElementRects({
                    reference: {
                        getBoundingClientRect: function() {
                            if (2 === d.length && d[0].left > d[1].right && null != u && null != c) return d.find(e => u > e.left - p.left && u < e.right + p.right && c > e.top - p.top && c < e.bottom + p.bottom) || m;
                            if (d.length >= 2) {
                                if ("y" === (0, t.getSideAxis)(i)) {
                                    let e = d[0],
                                        n = d[d.length - 1],
                                        r = "top" === (0, t.getSide)(i),
                                        o = e.top,
                                        l = n.bottom,
                                        a = r ? e.left : n.left,
                                        s = r ? e.right : n.right;
                                    return {
                                        top: o,
                                        bottom: l,
                                        left: a,
                                        right: s,
                                        width: s - a,
                                        height: l - o,
                                        x: a,
                                        y: o
                                    }
                                }
                                let e = "left" === (0, t.getSide)(i),
                                    n = (0, t.max)(...d.map(e => e.right)),
                                    r = (0, t.min)(...d.map(e => e.left)),
                                    o = d.filter(t => e ? t.left === r : t.right === n),
                                    l = o[0].top,
                                    a = o[o.length - 1].bottom;
                                return {
                                    top: l,
                                    bottom: a,
                                    left: r,
                                    right: n,
                                    width: n - r,
                                    height: a - l,
                                    x: r,
                                    y: l
                                }
                            }
                            return m
                        }
                    },
                    floating: r.floating,
                    strategy: s
                });
                return o.reference.x !== h.reference.x || o.reference.y !== h.reference.y || o.reference.width !== h.reference.width || o.reference.height !== h.reference.height ? {
                    reset: {
                        rects: h
                    }
                } : {}
            }
        }
    }, "limitShift", 0, M, "offset", 0, C, "platform", 0, S, "shift", 0, O, "size", 0, P], 53760);
    var W = e.i(15504),
        H = e.i(74080),
        F = "u" > typeof document ? W.useLayoutEffect : function() {};

    function N(e, t) {
        let n, i, r;
        if (e === t) return !0;
        if (typeof e != typeof t) return !1;
        if ("function" == typeof e && e.toString() === t.toString()) return !0;
        if (e && t && "object" == typeof e) {
            if (Array.isArray(e)) {
                if ((n = e.length) !== t.length) return !1;
                for (i = n; 0 != i--;)
                    if (!N(e[i], t[i])) return !1;
                return !0
            }
            if ((n = (r = Object.keys(e)).length) !== Object.keys(t).length) return !1;
            for (i = n; 0 != i--;)
                if (!({}).hasOwnProperty.call(t, r[i])) return !1;
            for (i = n; 0 != i--;) {
                let n = r[i];
                if (("_owner" !== n || !e.$$typeof) && !N(e[n], t[n])) return !1
            }
            return !0
        }
        return e != e && t != t
    }

    function k(e) {
        return "u" < typeof window ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
    }

    function B(e, t) {
        let n = k(e);
        return Math.round(t * n) / n
    }

    function V(e) {
        let t = W.useRef(e);
        return F(() => {
            t.current = e
        }), t
    }
    e.s(["flip", 0, (e, t) => {
        let n = T(e);
        return {
            name: n.name,
            fn: n.fn,
            options: [e, t]
        }
    }, "hide", 0, (e, t) => {
        let n = L(e);
        return {
            name: n.name,
            fn: n.fn,
            options: [e, t]
        }
    }, "limitShift", 0, (e, t) => ({
        fn: M(e).fn,
        options: [e, t]
    }), "offset", 0, (e, t) => {
        let n = C(e);
        return {
            name: n.name,
            fn: n.fn,
            options: [e, t]
        }
    }, "shift", 0, (e, t) => {
        let n = O(e);
        return {
            name: n.name,
            fn: n.fn,
            options: [e, t]
        }
    }, "size", 0, (e, t) => {
        let n = P(e);
        return {
            name: n.name,
            fn: n.fn,
            options: [e, t]
        }
    }, "useFloating", 0, function(e) {
        void 0 === e && (e = {});
        let {
            placement: t = "bottom",
            strategy: n = "absolute",
            middleware: i = [],
            platform: r,
            elements: {
                reference: o,
                floating: l
            } = {},
            transform: a = !0,
            whileElementsMounted: s,
            open: f
        } = e, [u, c] = W.useState({
            x: 0,
            y: 0,
            strategy: n,
            placement: t,
            middlewareData: {},
            isPositioned: !1
        }), [g, d] = W.useState(i);
        N(g, i) || d(i);
        let [m, p] = W.useState(null), [h, x] = W.useState(null), y = W.useCallback(e => {
            e !== A.current && (A.current = e, p(e))
        }, []), w = W.useCallback(e => {
            e !== E.current && (E.current = e, x(e))
        }, []), v = o || m, b = l || h, A = W.useRef(null), E = W.useRef(null), S = W.useRef(u), R = null != s, C = V(s), O = V(r), T = V(f), P = W.useCallback(() => {
            if (!A.current || !E.current) return;
            let e = {
                placement: t,
                strategy: n,
                middleware: g
            };
            O.current && (e.platform = O.current), D(A.current, E.current, e).then(e => {
                let t = { ...e,
                    isPositioned: !1 !== T.current
                };
                L.current && !N(S.current, t) && (S.current = t, H.flushSync(() => {
                    c(t)
                }))
            })
        }, [g, t, n, O, T]);
        F(() => {
            !1 === f && S.current.isPositioned && (S.current.isPositioned = !1, c(e => ({ ...e,
                isPositioned: !1
            })))
        }, [f]);
        let L = W.useRef(!1);
        F(() => (L.current = !0, () => {
            L.current = !1
        }), []), F(() => {
            if (v && (A.current = v), b && (E.current = b), v && b) {
                if (C.current) return C.current(v, b, P);
                P()
            }
        }, [v, b, P, C, R]);
        let M = W.useMemo(() => ({
                reference: A,
                floating: E,
                setReference: y,
                setFloating: w
            }), [y, w]),
            $ = W.useMemo(() => ({
                reference: v,
                floating: b
            }), [v, b]),
            I = W.useMemo(() => {
                let e = {
                    position: n,
                    left: 0,
                    top: 0
                };
                if (!$.floating) return e;
                let t = B($.floating, u.x),
                    i = B($.floating, u.y);
                return a ? { ...e,
                    transform: "translate(" + t + "px, " + i + "px)",
                    ...k($.floating) >= 1.5 && {
                        willChange: "transform"
                    }
                } : {
                    position: n,
                    left: t,
                    top: i
                }
            }, [n, a, $.floating, u.x, u.y]);
        return W.useMemo(() => ({ ...u,
            update: P,
            refs: M,
            elements: $,
            floatingStyles: I
        }), [u, P, M, $, I])
    }], 58950)
}, 43084, e => {
    "use strict";
    let t = ["top", "right", "bottom", "left"],
        n = t.reduce((e, t) => e.concat(t, t + "-start", t + "-end"), []),
        i = Math.min,
        r = Math.max,
        o = Math.round,
        l = Math.floor,
        a = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };

    function s(e) {
        return e.split("-")[0]
    }

    function f(e) {
        return e.split("-")[1]
    }

    function u(e) {
        return "x" === e ? "y" : "x"
    }

    function c(e) {
        return "y" === e ? "height" : "width"
    }

    function g(e) {
        let t = e[0];
        return "t" === t || "b" === t ? "y" : "x"
    }

    function d(e) {
        return u(g(e))
    }

    function m(e) {
        return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start")
    }
    let p = ["left", "right"],
        h = ["right", "left"],
        x = ["top", "bottom"],
        y = ["bottom", "top"];

    function w(e) {
        let t = s(e);
        return a[t] + e.slice(t.length)
    }
    e.s(["clamp", 0, function(e, t, n) {
        return r(e, i(t, n))
    }, "createCoords", 0, e => ({
        x: e,
        y: e
    }), "evaluate", 0, function(e, t) {
        return "function" == typeof e ? e(t) : e
    }, "floor", 0, l, "getAlignment", 0, f, "getAlignmentAxis", 0, d, "getAlignmentSides", 0, function(e, t, n) {
        void 0 === n && (n = !1);
        let i = f(e),
            r = d(e),
            o = c(r),
            l = "x" === r ? i === (n ? "end" : "start") ? "right" : "left" : "start" === i ? "bottom" : "top";
        return t.reference[o] > t.floating[o] && (l = w(l)), [l, w(l)]
    }, "getAxisLength", 0, c, "getExpandedPlacements", 0, function(e) {
        let t = w(e);
        return [m(e), t, m(t)]
    }, "getOppositeAlignmentPlacement", 0, m, "getOppositeAxis", 0, u, "getOppositeAxisPlacements", 0, function(e, t, n, i) {
        let r = f(e),
            o = function(e, t, n) {
                switch (e) {
                    case "top":
                    case "bottom":
                        if (n) return t ? h : p;
                        return t ? p : h;
                    case "left":
                    case "right":
                        return t ? x : y;
                    default:
                        return []
                }
            }(s(e), "start" === n, i);
        return r && (o = o.map(e => e + "-" + r), t && (o = o.concat(o.map(m)))), o
    }, "getOppositePlacement", 0, w, "getPaddingObject", 0, function(e) {
        return "number" != typeof e ? {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...e
        } : {
            top: e,
            right: e,
            bottom: e,
            left: e
        }
    }, "getSide", 0, s, "getSideAxis", 0, g, "max", 0, r, "min", 0, i, "placements", 0, n, "rectToClientRect", 0, function(e) {
        let {
            x: t,
            y: n,
            width: i,
            height: r
        } = e;
        return {
            width: i,
            height: r,
            top: n,
            left: t,
            right: t + i,
            bottom: n + r,
            x: t,
            y: n
        }
    }, "round", 0, o, "sides", 0, t])
}]);