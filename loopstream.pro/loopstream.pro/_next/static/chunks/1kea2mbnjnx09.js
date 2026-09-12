(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 67489, e => {
    "use strict";
    var t = e.i(43476);
    e.s([], 64623), e.i(64623);
    var r = e.i(15504),
        l = e.i(2077),
        n = e.i(28918),
        o = e.i(88940),
        i = e.i(13203),
        s = e.i(94258),
        a = e.i(90803),
        u = e.i(51437),
        c = e.i(46376),
        d = e.i(67865),
        f = e.i(46265),
        p = e.i(34346),
        m = e.i(14935),
        g = e.i(56789),
        h = e.i(85689),
        S = e.i(17989),
        v = e.i(65858),
        b = e.i(60891),
        y = e.i(36760),
        x = e.i(33332);
    let E = r.createContext(null),
        w = r.createContext(null);

    function R() {
        let e = r.useContext(E);
        if (null === e) throw Error((0, x.default)(60));
        return e
    }

    function C() {
        let e = r.useContext(w);
        if (null === e) throw Error((0, x.default)(61));
        return e
    }
    var A = e.i(69690),
        I = e.i(81104),
        M = e.i(38489),
        T = e.i(23910),
        P = e.i(16269);
    let O = (e, t) => Object.is(e, t);

    function L(e, t, r) {
        return null == e || null == t ? Object.is(e, t) : r(e, t)
    }

    function j(e, t, r) {
        return e && 0 !== e.length ? e.findIndex(e => void 0 !== e && L(e, t, r)) : -1
    }

    function D(e) {
        if (null == e) return "";
        if ("string" == typeof e) return e;
        try {
            return JSON.stringify(e)
        } catch {
            return String(e)
        }
    }

    function V(e) {
        return null != e && e.length > 0 && "object" == typeof e[0] && null != e[0] && "items" in e[0]
    }

    function k(e, t) {
        if (t && null != e) return t(e) ? ? "";
        if (e && "object" == typeof e) {
            if ("label" in e && null != e.label) return String(e.label);
            if ("value" in e) return String(e.value)
        }
        return D(e)
    }

    function _(e, t) {
        return t && null != e ? t(e) ? ? "" : e && "object" == typeof e && "value" in e && "label" in e ? D(e.value) : D(e)
    }

    function N(e, t, r) {
        if (r && null != e) return r(e);
        if (e && "object" == typeof e && "label" in e && null != e.label) return e.label;
        if (t && !Array.isArray(t)) return t[e] ? ? k(e, r);
        if (Array.isArray(t)) {
            let l = V(t) ? t.flatMap(e => e.items) : t;
            if (null == e || "object" != typeof e) {
                let t = l.find(t => t.value === e);
                return t && null != t.label ? t.label : k(e, r)
            }
            if ("value" in e) {
                let t = l.find(t => t && t.value === e.value);
                if (t && null != t.label) return t.label
            }
        }
        return k(e, r)
    }
    let U = {
        id: (0, P.createSelector)(e => e.id),
        labelId: (0, P.createSelector)(e => e.labelId),
        modal: (0, P.createSelector)(e => e.modal),
        multiple: (0, P.createSelector)(e => e.multiple),
        items: (0, P.createSelector)(e => e.items),
        itemToStringLabel: (0, P.createSelector)(e => e.itemToStringLabel),
        itemToStringValue: (0, P.createSelector)(e => e.itemToStringValue),
        isItemEqualToValue: (0, P.createSelector)(e => e.isItemEqualToValue),
        value: (0, P.createSelector)(e => e.value),
        hasSelectedValue: (0, P.createSelector)(e => {
            let {
                value: t,
                multiple: r,
                itemToStringValue: l
            } = e;
            return null != t && (r && Array.isArray(t) ? t.length > 0 : "" !== _(t, l))
        }),
        hasNullItemLabel: (0, P.createSelector)((e, t) => !!t && function(e) {
            if (!Array.isArray(e)) return null != e && "null" in e;
            if (V(e)) {
                for (let t of e)
                    for (let e of t.items)
                        if (e && null == e.value && null != e.label) return !0;
                return !1
            }
            for (let t of e)
                if (t && null == t.value && null != t.label) return !0;
            return !1
        }(e.items)),
        open: (0, P.createSelector)(e => e.open),
        mounted: (0, P.createSelector)(e => e.mounted),
        forceMount: (0, P.createSelector)(e => e.forceMount),
        transitionStatus: (0, P.createSelector)(e => e.transitionStatus),
        openMethod: (0, P.createSelector)(e => e.openMethod),
        activeIndex: (0, P.createSelector)(e => e.activeIndex),
        selectedIndex: (0, P.createSelector)(e => e.selectedIndex),
        isActive: (0, P.createSelector)((e, t) => e.activeIndex === t),
        isSelected: (0, P.createSelector)((e, t) => {
            let r = e.isItemEqualToValue,
                l = e.value;
            return e.multiple ? Array.isArray(l) && l.some(e => L(t, e, r)) : L(t, l, r)
        }),
        isSelectedByFocus: (0, P.createSelector)((e, t) => e.selectedIndex === t),
        popupProps: (0, P.createSelector)(e => e.popupProps),
        triggerProps: (0, P.createSelector)(e => e.triggerProps),
        triggerElement: (0, P.createSelector)(e => e.triggerElement),
        positionerElement: (0, P.createSelector)(e => e.positionerElement),
        listElement: (0, P.createSelector)(e => e.listElement),
        popupSide: (0, P.createSelector)(e => e.popupSide),
        scrollUpArrowVisible: (0, P.createSelector)(e => e.scrollUpArrowVisible),
        scrollDownArrowVisible: (0, P.createSelector)(e => e.scrollDownArrowVisible),
        hasScrollArrows: (0, P.createSelector)(e => e.hasScrollArrows)
    };
    var F = e.i(75606),
        H = e.i(56434),
        z = e.i(37584),
        B = e.i(84708),
        Y = e.i(6039),
        G = e.i(32199),
        X = e.i(50896),
        W = e.i(64111),
        $ = e.i(76782),
        q = e.i(52245),
        K = e.i(75812),
        J = e.i(97886);
    let Q = r.forwardRef(function(e, t) {
        let {
            render: r,
            className: l,
            style: n,
            ...o
        } = e;
        delete o.id;
        let i = (0, A.useFieldRootContext)(),
            {
                store: s
            } = R(),
            a = (0, p.useStore)(s, U.triggerElement),
            u = (0, p.useStore)(s, U.id),
            c = null == u ? void 0 : `${u}-label`,
            d = (0, J.useLabel)({
                id: c,
                fallbackControlId: a ? .id ? ? u,
                setLabelId(e) {
                    s.set("labelId", e)
                }
            });
        return (0, q.useRenderElement)("div", e, {
            ref: t,
            state: i.state,
            props: [d, o],
            stateAttributesMapping: K.fieldValidityMapping
        })
    });
    var Z = e.i(8868),
        ee = e.i(39957),
        et = e.i(47778),
        er = e.i(5005),
        el = e.i(64042),
        en = e.i(47554),
        eo = e.i(96296),
        ei = e.i(40886);
    let es = { ...er.pressableTriggerOpenStateMapping,
            ...K.fieldValidityMapping,
            popupSide: e => e ? {
                "data-popup-side": e
            } : null,
            value: () => null
        },
        ea = r.forwardRef(function(e, t) {
            let {
                render: l,
                className: n,
                id: o,
                disabled: i = !1,
                nativeButton: s = !0,
                style: a,
                ...u
            } = e, {
                setTouched: c,
                setFocused: m,
                validationMode: g,
                state: h,
                disabled: S
            } = (0, A.useFieldRootContext)(), {
                labelId: v
            } = (0, et.useLabelableContext)(), {
                store: b,
                setOpen: y,
                selectionRef: x,
                validation: E,
                readOnly: w,
                required: C,
                alignItemWithTriggerActiveRef: I,
                disabled: T
            } = R(), P = S || T || i, O = (0, p.useStore)(b, U.open), L = (0, p.useStore)(b, U.mounted), j = (0, p.useStore)(b, U.value), D = (0, p.useStore)(b, U.triggerProps), V = (0, p.useStore)(b, U.positionerElement), k = (0, p.useStore)(b, U.listElement), _ = (0, p.useStore)(b, U.popupSide), N = (0, p.useStore)(b, U.id), z = (0, p.useStore)(b, U.labelId), B = (0, p.useStore)(b, U.hasSelectedValue), Y = L && V ? _ : null, G = o ? ? N;
            (0, M.useLabelableId)({
                id: G
            });
            let X = (0, f.useValueAsRef)(V),
                W = r.useRef(null),
                {
                    getButtonProps: K,
                    buttonRef: J
                } = (0, ei.useButton)({
                    disabled: P,
                    native: s
                }),
                Q = (0, d.useStableCallback)(e => {
                    b.set("triggerElement", e)
                }),
                er = (0, ee.useTimeout)(),
                ea = (0, ee.useTimeout)(),
                eu = (0, ee.useTimeout)();
            r.useEffect(() => {
                if (O) return eu.start(400, () => {
                    x.current.allowUnselectedMouseUp = !0, x.current.allowSelectedMouseUp = !0
                }), () => {
                    eu.clear()
                };
                x.current = {
                    allowSelectedMouseUp: !1,
                    allowUnselectedMouseUp: !1,
                    dragY: 0
                }, ea.clear()
            }, [O, x, ea, eu]);
            let ec = (0, $.mergeProps)(D, {
                    id: G,
                    role: "combobox",
                    "aria-expanded": O ? "true" : "false",
                    "aria-haspopup": "listbox",
                    "aria-controls": O ? k ? .id ? ? (0, eo.getFloatingFocusElement)(V) ? .id : void 0,
                    "aria-labelledby": v ? ? z,
                    "aria-readonly": w || void 0,
                    "aria-required": C || void 0,
                    tabIndex: P ? -1 : 0,
                    onFocus(e) {
                        m(!0), O && I.current && y(!1, (0, F.createChangeEventDetails)(H.REASONS.none, e.nativeEvent)), er.start(0, () => {
                            b.set("forceMount", !0)
                        })
                    },
                    onBlur(e) {
                        (0, en.contains)(V, e.relatedTarget) || (c(!0), m(!1), "onBlur" === g && E.commit(j))
                    },
                    onMouseDown(e) {
                        if (O) return;
                        let t = (0, Z.ownerDocument)(e.currentTarget);

                        function r(e) {
                            if (!W.current) return;
                            let t = e.target;
                            if ((0, en.contains)(W.current, t) || (0, en.contains)(X.current, t)) return;
                            let r = (0, el.getPseudoElementBounds)(W.current);
                            e.clientX >= r.left - 2 && e.clientX <= r.right + 2 && e.clientY >= r.top - 2 && e.clientY <= r.bottom + 2 || y(!1, (0, F.createChangeEventDetails)(H.REASONS.cancelOpen, e))
                        }
                        ea.start(0, () => {
                            t.addEventListener("mouseup", r, {
                                once: !0
                            })
                        })
                    }
                }, u, K),
                ed = E.getValidationProps(P, ec);
            ed.role = "combobox";
            let ef = { ...h,
                open: O,
                disabled: P,
                value: j,
                readOnly: w,
                popupSide: Y,
                placeholder: !B
            };
            return (0, q.useRenderElement)("button", e, {
                ref: [t, W, J, Q],
                state: ef,
                stateAttributesMapping: es,
                props: ed
            })
        }),
        eu = {
            value: () => null
        },
        ec = r.forwardRef(function(e, l) {
            let {
                className: n,
                render: o,
                children: i,
                placeholder: s,
                style: a,
                ...u
            } = e, {
                store: c,
                valueRef: d
            } = R(), f = (0, p.useStore)(c, U.value), m = (0, p.useStore)(c, U.items), g = (0, p.useStore)(c, U.itemToStringLabel), h = (0, p.useStore)(c, U.hasSelectedValue), S = (0, p.useStore)(c, U.hasNullItemLabel, !h && null != s && null == i), v = null;
            if ("function" == typeof i) v = i(f);
            else if (null != i) v = i;
            else if (h || null == s || S)
                if (Array.isArray(f)) v = f.reduce((e, l, n) => (n > 0 && e.push(", "), e.push((0, t.jsx)(r.Fragment, {
                    children: N(l, m, g)
                }, n)), e), []);
                else v = N(f, m, g);
            else v = s;
            return (0, q.useRenderElement)("span", e, {
                state: {
                    value: f,
                    placeholder: !h
                },
                ref: [l, d],
                props: [{
                    children: v
                }, u],
                stateAttributesMapping: eu
            })
        }),
        ed = r.forwardRef(function(e, t) {
            let {
                render: r,
                className: l,
                style: n,
                ...o
            } = e, {
                store: i
            } = R(), s = (0, p.useStore)(i, U.open);
            return (0, q.useRenderElement)("span", e, {
                state: {
                    open: s
                },
                ref: t,
                props: [{
                    "aria-hidden": !0,
                    children: "▼"
                }, o],
                stateAttributesMapping: er.triggerOpenStateMapping
            })
        });
    var ef = e.i(26674);
    let ep = r.createContext(void 0),
        em = r.forwardRef(function(e, r) {
            let {
                store: l
            } = R(), n = (0, p.useStore)(l, U.mounted), o = (0, p.useStore)(l, U.forceMount);
            return n || o ? (0, t.jsx)(ep.Provider, {
                value: !0,
                children: (0, t.jsx)(ef.FloatingPortal, {
                    ref: r,
                    ...e
                })
            }) : null
        });
    var eg = e.i(9407);
    let eh = { ...er.popupStateMapping,
            ...eg.transitionStatusMapping
        },
        eS = r.forwardRef(function(e, t) {
            let {
                render: r,
                className: l,
                style: n,
                ...o
            } = e, {
                store: i
            } = R(), s = (0, p.useStore)(i, U.open), a = (0, p.useStore)(i, U.mounted), u = (0, p.useStore)(i, U.transitionStatus);
            return (0, q.useRenderElement)("div", e, {
                state: {
                    open: s,
                    transitionStatus: u
                },
                ref: t,
                props: [{
                    role: "presentation",
                    hidden: !a,
                    style: {
                        userSelect: "none",
                        WebkitUserSelect: "none"
                    }
                }, o],
                stateAttributesMapping: eh
            })
        });
    var ev = e.i(44394),
        eb = e.i(53687),
        ey = e.i(29365);
    let ex = r.createContext(void 0);

    function eE() {
        let e = r.useContext(ex);
        if (!e) throw Error((0, x.default)(59));
        return e
    }
    var ew = e.i(426),
        eR = e.i(38396);

    function eC(e, t) {
        e && Object.assign(e.style, t)
    }
    let eA = {
        position: "relative",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "auto"
    };
    var eI = e.i(89579),
        eM = e.i(33383);
    let eT = {
            position: "fixed"
        },
        eP = r.forwardRef(function(e, l) {
            let {
                anchor: n,
                positionMethod: o = "absolute",
                className: i,
                render: s,
                side: a = "bottom",
                align: u = "center",
                sideOffset: f = 0,
                alignOffset: m = 0,
                collisionBoundary: g = "clipping-ancestors",
                collisionPadding: h,
                arrowPadding: S = 5,
                sticky: v = !1,
                disableAnchorTracking: b,
                alignItemWithTrigger: y = !0,
                collisionAvoidance: x = eR.DROPDOWN_COLLISION_AVOIDANCE,
                style: E,
                ...w
            } = e, {
                store: A,
                listRef: I,
                labelsRef: M,
                alignItemWithTriggerActiveRef: T,
                selectedItemTextRef: P,
                valuesRef: O,
                initialValueRef: D,
                popupRef: V,
                setValue: k
            } = R(), _ = C(), N = (0, p.useStore)(A, U.open), z = (0, p.useStore)(A, U.mounted), B = (0, p.useStore)(A, U.modal), Y = (0, p.useStore)(A, U.value), G = (0, p.useStore)(A, U.openMethod), X = (0, p.useStore)(A, U.positionerElement), W = (0, p.useStore)(A, U.triggerElement), $ = (0, p.useStore)(A, U.isItemEqualToValue), q = (0, p.useStore)(A, U.transitionStatus), K = r.useRef(null), J = r.useRef(null), [Q, Z] = r.useState(y), ee = z && Q && "touch" !== G;
            z || Q === y || Z(y), (0, c.useIsoLayoutEffect)(() => {
                !z && (U.scrollUpArrowVisible(A.state) && A.set("scrollUpArrowVisible", !1), U.scrollDownArrowVisible(A.state) && A.set("scrollDownArrowVisible", !1))
            }, [A, z]), r.useImperativeHandle(T, () => ee), (0, eM.useAnchoredPopupScrollLock)((ee || B) && N, "touch" === G, X, W);
            let et = (0, ey.useAnchorPositioning)({
                    anchor: n,
                    floatingRootContext: _,
                    positionMethod: o,
                    mounted: z,
                    side: a,
                    sideOffset: f,
                    align: u,
                    alignOffset: m,
                    arrowPadding: S,
                    collisionBoundary: g,
                    collisionPadding: h,
                    sticky: v,
                    disableAnchorTracking: b ? ? ee,
                    collisionAvoidance: x,
                    keepMounted: !0
                }),
                er = ee ? "none" : et.side,
                el = ee ? eT : et.positionerStyles,
                en = {
                    open: N,
                    side: er,
                    align: et.align,
                    anchorHidden: et.anchorHidden
                };
            (0, c.useIsoLayoutEffect)(() => {
                A.set("popupSide", et.side)
            }, [A, et.side]);
            let eo = (0, d.useStableCallback)(e => {
                    A.set("positionerElement", e)
                }),
                ei = (0, eI.usePositioner)(e, en, {
                    styles: el,
                    transitionStatus: q,
                    props: w,
                    refs: [l, eo],
                    hidden: !z,
                    inert: !N
                }),
                es = r.useRef(0),
                ea = (0, d.useStableCallback)(e => {
                    if (0 === e.size && 0 === es.current || 0 === O.current.length) return;
                    let t = es.current;
                    if (es.current = e.size, e.size === t) return;
                    let r = (0, F.createChangeEventDetails)(H.REASONS.none);
                    if (0 !== t && !A.state.multiple && null !== Y && -1 === j(O.current, Y, $)) {
                        let e = D.current,
                            t = null != e && -1 !== j(O.current, e, $) ? e : null;
                        k(t, r), null === t && (A.set("selectedIndex", null), P.current = null)
                    }
                    if (0 !== t && A.state.multiple && Array.isArray(Y)) {
                        let e = Y.filter(e => -1 !== j(O.current, e, $));
                        (e.length !== Y.length || e.some(e => !(Y && 0 !== Y.length && Y.some(t => void 0 !== t && L(e, t, $))))) && (k(e, r), 0 === e.length && (A.set("selectedIndex", null), P.current = null))
                    }
                    if (N && ee) {
                        A.update({
                            scrollUpArrowVisible: !1,
                            scrollDownArrowVisible: !1
                        });
                        let e = {
                            height: ""
                        };
                        eC(X, e), eC(V.current, e)
                    }
                }),
                eu = r.useMemo(() => ({ ...et,
                    side: er,
                    alignItemWithTriggerActive: ee,
                    setControlledAlignItemWithTrigger: Z,
                    scrollUpArrowRef: K,
                    scrollDownArrowRef: J
                }), [et, er, ee, Z]);
            return (0, t.jsx)(eb.CompositeList, {
                elementsRef: I,
                labelsRef: M,
                onMapChange: ea,
                children: (0, t.jsxs)(ex.Provider, {
                    value: eu,
                    children: [z && B && (0, t.jsx)(ew.InternalBackdrop, {
                        inert: (0, ev.inertValue)(!N),
                        cutout: W
                    }), ei]
                })
            })
        });
    var eO = e.i(43084),
        eL = e.i(74735),
        ej = e.i(28744),
        eD = e.i(33848),
        eV = e.i(8445),
        ek = e.i(61487),
        e_ = e.i(53760),
        eN = e.i(60837),
        eU = e.i(96533),
        eF = e.i(73327),
        eH = e.i(15982),
        ez = e.i(1675),
        eB = e.i(72410),
        eY = e.i(72855);
    let eG = { ...er.popupStateMapping,
            ...eg.transitionStatusMapping
        },
        eX = r.forwardRef(function(e, l) {
            let {
                render: n,
                className: o,
                style: i,
                finalFocus: s,
                ...a
            } = e, {
                store: u,
                popupRef: f,
                onOpenChangeComplete: m,
                setOpen: g,
                valueRef: h,
                firstItemTextRef: S,
                selectedItemTextRef: v,
                multiple: b,
                handleScrollArrowVisibility: y,
                scrollHandlerRef: x,
                listRef: E,
                highlightItemOnHover: w
            } = R(), {
                side: A,
                align: I,
                alignItemWithTriggerActive: M,
                isPositioned: T,
                setControlledAlignItemWithTrigger: P
            } = eE(), O = null != (0, eU.useToolbarRootContext)(!0), L = C(), j = (0, eY.useDirection)(), {
                nonce: D,
                disableStyleElements: V
            } = (0, eB.useCSPContext)(), k = (0, p.useStore)(u, U.id), _ = (0, p.useStore)(u, U.open), N = (0, p.useStore)(u, U.openMethod), B = (0, p.useStore)(u, U.mounted), Y = (0, p.useStore)(u, U.popupProps), G = (0, p.useStore)(u, U.transitionStatus), W = (0, p.useStore)(u, U.triggerElement), $ = (0, p.useStore)(u, U.positionerElement), K = (0, p.useStore)(u, U.listElement), J = r.useRef(!1), Q = r.useRef(!1), ee = r.useRef({}), et = (0, eV.useAnimationFrame)(), er = (0, d.useStableCallback)(e => {
                var t;
                if (!$ || !f.current || !Q.current) return;
                if (J.current || !M) return void y();
                let r = "0px" === $.style.top,
                    l = "0px" === $.style.bottom;
                if (!r && !l) return void y();
                let n = eq($),
                    o = (t = $.getBoundingClientRect().height, t / n.y),
                    i = (0, Z.ownerDocument)($),
                    s = (0, eD.ownerWindow)($),
                    a = s.getComputedStyle($),
                    u = parseFloat(a.marginTop),
                    c = parseFloat(a.marginBottom),
                    d = eW(s.getComputedStyle(f.current)),
                    p = Math.min(i.documentElement.clientHeight - u - c, d),
                    m = e.scrollTop,
                    g = e$(e),
                    h = 0,
                    S = null,
                    v = !1,
                    b = !1,
                    x = e => {
                        $.style.height = `${e}px`
                    },
                    E = r ? g - m : m,
                    w = Math.min(o + E, p);
                if (h = w, E <= X.SCROLL_EDGE_TOLERANCE_PX) {
                    let t;
                    return void((t = (0, ez.clamp)(E, 0, p - o)) > 0 && x(o + t), e.scrollTop = r ? g : 0, p - (o + t) <= X.SCROLL_EDGE_TOLERANCE_PX && (J.current = !0), y())
                }
                if (p - w > X.SCROLL_EDGE_TOLERANCE_PX) r ? b = !0 : S = 0;
                else if (v = !0, l && m < g) {
                    let e = o + E - p;
                    S = m - (E - e)
                }
                if (0 !== (h = Math.ceil(h)) && x(h), b || null != S) {
                    let t = e$(e),
                        r = b ? t : (0, ez.clamp)(S, 0, t);
                    Math.abs(e.scrollTop - r) > X.SCROLL_EDGE_TOLERANCE_PX && (e.scrollTop = r)
                }(v || h >= p - X.SCROLL_EDGE_TOLERANCE_PX) && (J.current = !0), y()
            });
            r.useImperativeHandle(x, () => er, [er]), (0, z.useOpenChangeComplete)({
                open: _,
                ref: f,
                onComplete() {
                    _ && m ? .(!0)
                }
            }), (0, c.useIsoLayoutEffect)(() => {
                $ && f.current && !Object.keys(ee.current).length && (ee.current = {
                    top: $.style.top || "0",
                    left: $.style.left || "0",
                    right: $.style.right,
                    height: $.style.height,
                    bottom: $.style.bottom,
                    minHeight: $.style.minHeight,
                    maxHeight: $.style.maxHeight,
                    marginTop: $.style.marginTop,
                    marginBottom: $.style.marginBottom
                })
            }, [f, $]), (0, c.useIsoLayoutEffect)(() => {
                _ || M || (Q.current = !1, J.current = !1, eC($, ee.current))
            }, [_, M, $, f]), (0, c.useIsoLayoutEffect)(() => {
                let e = f.current;
                if (!_ || !W || !$ || !e || M && !T || "ending" === u.state.transitionStatus) return;
                if (!M) {
                    Q.current = !0, et.request(y), e.style.removeProperty("--transform-origin");
                    return
                }
                let t = function(e) {
                    let {
                        style: t
                    } = e, r = {};
                    for (let [e, l] of eJ) r[e] = t.getPropertyValue(e), t.setProperty(e, l, "important");
                    return () => {
                        for (let [e] of eJ) {
                            let l = r[e];
                            l ? t.setProperty(e, l) : t.removeProperty(e)
                        }
                    }
                }(e);
                e.style.removeProperty("--transform-origin");
                try {
                    let t, r = v.current;
                    r ? .isConnected || (r = !U.hasSelectedValue(u.state) && S.current ? .isConnected ? S.current : null);
                    let l = h.current,
                        n = (0, eD.ownerWindow)($),
                        o = n.getComputedStyle($),
                        i = n.getComputedStyle(e),
                        s = (0, Z.ownerDocument)(W),
                        a = eq(W),
                        c = eK(W.getBoundingClientRect(), a),
                        d = eK($.getBoundingClientRect(), a),
                        f = c.height,
                        p = K || e,
                        m = p.scrollHeight,
                        g = parseFloat(i.borderBottomWidth),
                        b = parseFloat(o.marginTop) || 10,
                        x = parseFloat(o.marginBottom) || 10,
                        R = parseFloat(o.minHeight) || 100,
                        C = eW(i),
                        A = s.documentElement.clientHeight - b - x,
                        I = s.documentElement.clientWidth,
                        M = A - c.bottom + f,
                        T = "rtl" === j ? c.right - d.width : c.left,
                        O = 0;
                    if (r && l) {
                        let e = eK(l.getBoundingClientRect(), a);
                        t = eK(r.getBoundingClientRect(), a), T = d.left + ("rtl" === j ? e.right - t.right : e.left - t.left);
                        let n = e.top - c.top + e.height / 2;
                        O = t.top - d.top + t.height / 2 - n
                    }
                    let L = M + O + x + g,
                        D = Math.min(A, L),
                        V = A - b - x,
                        k = L - D;
                    $.style.left = `${(0,ez.clamp)(T,5,I-5-d.width)}px`, $.style.height = `${D}px`, $.style.maxHeight = "none", $.style.marginTop = `${b}px`, $.style.marginBottom = `${x}px`, e.style.height = "100%";
                    let _ = e$(p),
                        N = k >= _ - X.SCROLL_EDGE_TOLERANCE_PX;
                    N && (D = Math.min(A, d.height) - (k - _));
                    let F = c.top < 20 || c.bottom > A - 20 || Math.ceil(D) + X.SCROLL_EDGE_TOLERANCE_PX < Math.min(m, R),
                        H = (n.visualViewport ? .scale ? ? 1) !== 1 && ej.platform.engine.webkit;
                    if (F || H) {
                        Q.current = !0, eC($, ee.current), P(!1);
                        return
                    }
                    let z = Math.max(R, D);
                    if (N) {
                        let e = Math.max(0, A - L);
                        $.style.top = d.height >= V ? "0" : `${e}px`, $.style.height = `${D}px`, p.scrollTop = e$(p)
                    } else $.style.bottom = "0", p.scrollTop = k;
                    if (t) {
                        let r = d.top,
                            l = d.height,
                            n = t.top + t.height / 2,
                            o = (0, ez.clamp)(l > 0 ? (n - r) / l * 100 : 50, 0, 100);
                        e.style.setProperty("--transform-origin", `50% ${o}%`)
                    }(z === A || D >= C) && (J.current = !0), y(), w && null === u.state.selectedIndex && null === u.state.activeIndex && null != E.current[0] && u.set("activeIndex", 0), Q.current = !0
                } finally {
                    t()
                }
            }, [u, _, $, W, h, S, v, f, y, M, P, et, K, E, w, j, T]), r.useEffect(() => {
                if (!M || !$ || !_) return;
                let e = (0, eD.ownerWindow)($);
                return (0, eL.addEventListener)(e, "resize", function(e) {
                    g(!1, (0, F.createChangeEventDetails)(H.REASONS.windowResize, e))
                })
            }, [g, M, $, _]);
            let el = { ...K ? {
                        role: "presentation",
                        "aria-orientation": void 0
                    } : {
                        role: "listbox",
                        "aria-multiselectable": b || void 0,
                        id: `${k}-list`
                    },
                    onKeyDown(e) {
                        O && eF.COMPOSITE_KEYS.has(e.key) && e.stopPropagation()
                    },
                    onScroll(e) {
                        K || er(e.currentTarget)
                    },
                    ...M && {
                        style: K ? {
                            height: "100%"
                        } : eA
                    }
                },
                en = (0, q.useRenderElement)("div", e, {
                    ref: [l, f],
                    state: {
                        open: _,
                        transitionStatus: G,
                        side: A,
                        align: I
                    },
                    stateAttributesMapping: eG,
                    props: [Y, el, (0, eH.getDisabledMountTransitionStyles)(G), {
                        className: !K && M ? eN.styleDisableScrollbar.className : void 0
                    }, a]
                });
            return (0, t.jsxs)(r.Fragment, {
                children: [!V && eN.styleDisableScrollbar.getElement(D), (0, t.jsx)(ek.FloatingFocusManager, {
                    context: L,
                    modal: !1,
                    disabled: !B,
                    openInteractionType: N,
                    returnFocus: s,
                    restoreFocus: !0,
                    children: en
                })]
            })
        });

    function eW(e) {
        let t = e.maxHeight || "";
        return t.endsWith("px") && parseFloat(t) || 1 / 0
    }

    function e$(e) {
        return (0, X.getMaxScrollOffset)(e.scrollHeight, e.clientHeight)
    }

    function eq(e) {
        return e_.platform.getScale(e)
    }

    function eK(e, t) {
        return (0, eO.rectToClientRect)({
            x: e.x / t.x,
            y: e.y / t.y,
            width: e.width / t.x,
            height: e.height / t.y
        })
    }
    let eJ = [
            ["transform", "none"],
            ["scale", "1"],
            ["translate", "0 0"]
        ],
        eQ = r.forwardRef(function(e, t) {
            let {
                render: r,
                className: l,
                style: n,
                ...o
            } = e, {
                store: i,
                scrollHandlerRef: s
            } = R(), {
                alignItemWithTriggerActive: a
            } = eE(), u = (0, p.useStore)(i, U.hasScrollArrows), c = (0, p.useStore)(i, U.openMethod), f = (0, p.useStore)(i, U.multiple), m = (0, p.useStore)(i, U.id), g = {
                id: `${m}-list`,
                role: "listbox",
                "aria-multiselectable": f || void 0,
                onScroll(e) {
                    s.current ? .(e.currentTarget)
                },
                ...a && {
                    style: eA
                },
                className: u && "touch" !== c ? eN.styleDisableScrollbar.className : void 0
            }, h = (0, d.useStableCallback)(e => {
                i.set("listElement", e)
            });
            return (0, q.useRenderElement)("div", e, {
                ref: [t, h],
                props: [g, o]
            })
        });
    var eZ = e.i(73553);
    let e0 = r.createContext(void 0);

    function e1() {
        let e = r.useContext(e0);
        if (!e) throw Error((0, x.default)(57));
        return e
    }
    var e5 = e.i(57940);
    let e4 = r.memo(r.forwardRef(function(e, l) {
            let {
                render: n,
                className: o,
                style: i,
                value: s = null,
                label: a,
                disabled: u = !1,
                nativeButton: d = !1,
                ...f
            } = e, m = r.useRef(null), g = (0, eZ.useCompositeListItem)({
                label: a,
                textRef: m,
                indexGuessBehavior: eZ.IndexGuessBehavior.GuessFromOrder
            }), {
                store: h,
                itemProps: S,
                setOpen: v,
                setValue: b,
                selectionRef: y,
                typingRef: x,
                valuesRef: E,
                multiple: w,
                selectedItemTextRef: C,
                disabled: A,
                readOnly: I
            } = R(), M = (0, p.useStore)(h, U.isActive, g.index), T = (0, p.useStore)(h, U.open), P = (0, p.useStore)(h, U.isSelected, s), O = (0, p.useStore)(h, U.isSelectedByFocus, g.index), j = (0, p.useStore)(h, U.isItemEqualToValue), D = g.index, V = -1 !== D, k = r.useRef(null);
            (0, c.useIsoLayoutEffect)(() => {
                if (!V) return;
                let e = E.current;
                return e[D] = s, () => {
                    delete e[D]
                }
            }, [V, D, s, E]), (0, c.useIsoLayoutEffect)(() => {
                if (!V) return;
                let e = h.state.value,
                    t = e;
                w && Array.isArray(e) && (t = e.length > 0 ? e[e.length - 1] : void 0), void 0 !== t && L(s, t, j) && (h.set("selectedIndex", D), m.current && (C.current = m.current))
            }, [V, D, w, j, h, s, C]);
            let _ = r.useRef(null),
                N = r.useRef("mouse"),
                z = r.useRef(!1),
                {
                    getButtonProps: B,
                    buttonRef: Y
                } = (0, ei.useButton)({
                    disabled: u,
                    focusableWhenDisabled: !0,
                    native: d,
                    composite: !0
                });

            function G() {
                y.current.dragY = 0
            }
            let X = (0, q.useRenderElement)("div", e, {
                    ref: [Y, l, g.ref, k],
                    state: {
                        disabled: u,
                        selected: P,
                        highlighted: M
                    },
                    props: [S, {
                        role: "option",
                        "aria-selected": P,
                        tabIndex: T && M ? 0 : -1,
                        onKeyDown(e) {
                            _.current = e.key, h.set("activeIndex", D), " " === e.key && x.current && e.preventDefault()
                        },
                        onClick(e) {
                            let t = "click" === e.type && "touch" !== N.current,
                                r = e.nativeEvent.pointerType,
                                l = t && (0, e5.isVirtualClick)(e.nativeEvent) && (void 0 !== r || M),
                                n = t && !l && !z.current;
                            z.current = !1, "keydown" === e.type && null === _.current || u || "keydown" === e.type && " " === _.current && x.current || n || (_.current = null, function(e) {
                                if (A || I) return;
                                let t = h.state.value;
                                if (w) {
                                    let r = Array.isArray(t) ? t : [];
                                    b(P ? r.filter(e => !L(s, e, j)) : [...r, s], (0, F.createChangeEventDetails)(H.REASONS.itemPress, e))
                                } else b(s, (0, F.createChangeEventDetails)(H.REASONS.itemPress, e)), v(!1, (0, F.createChangeEventDetails)(H.REASONS.itemPress, e))
                            }(e.nativeEvent))
                        },
                        onPointerEnter(e) {
                            N.current = e.pointerType
                        },
                        onPointerMove(e) {
                            if ("mouse" === e.pointerType && 1 === e.buttons) {
                                let t = y.current;
                                t.dragY += e.movementY, t.dragY ** 2 >= 64 && (t.allowUnselectedMouseUp = !0)
                            }
                        },
                        onPointerDown(e) {
                            N.current = e.pointerType, z.current = !0, G()
                        },
                        onMouseUp() {
                            if (G(), u || "touch" === N.current || z.current) return;
                            let e = !y.current.allowSelectedMouseUp && P,
                                t = !y.current.allowUnselectedMouseUp && !P;
                            e || t || (z.current = !0, k.current ? .click(), z.current = !1)
                        }
                    }, f, B]
                }),
                W = r.useMemo(() => ({
                    selected: P,
                    index: D,
                    textRef: m,
                    selectedByFocus: O,
                    hasRegistered: V
                }), [P, D, m, O, V]);
            return (0, t.jsx)(e0.Provider, {
                value: W,
                children: X
            })
        })),
        e6 = r.forwardRef(function(e, r) {
            let l = e.keepMounted ? ? !1,
                {
                    selected: n
                } = e1();
            return l || n ? (0, t.jsx)(e2, { ...e,
                ref: r
            }) : null
        }),
        e2 = r.memo(r.forwardRef((e, t) => {
            let {
                render: l,
                className: n,
                style: o,
                keepMounted: i,
                ...s
            } = e, {
                selected: a
            } = e1(), u = r.useRef(null), {
                transitionStatus: c,
                setMounted: d
            } = (0, T.useTransitionStatus)(a), f = (0, q.useRenderElement)("span", e, {
                ref: [t, u],
                state: {
                    selected: a,
                    transitionStatus: c
                },
                props: [{
                    "aria-hidden": !0,
                    children: "✔️"
                }, s],
                stateAttributesMapping: eg.transitionStatusMapping
            });
            return (0, z.useOpenChangeComplete)({
                open: a,
                ref: u,
                onComplete() {
                    a || d(!1)
                }
            }), f
        })),
        e8 = r.memo(r.forwardRef(function(e, t) {
            let {
                index: l,
                textRef: n,
                selectedByFocus: o,
                hasRegistered: i
            } = e1(), {
                firstItemTextRef: s,
                selectedItemTextRef: a
            } = R(), {
                render: u,
                className: c,
                style: d,
                ...f
            } = e, p = r.useCallback(e => {
                e && (i && 0 === l && (s.current = e), i && o && (a.current = e))
            }, [s, a, l, o, i]);
            return (0, q.useRenderElement)("div", e, {
                ref: [p, t, n],
                props: f
            })
        })),
        e3 = { ...er.popupStateMapping,
            ...eg.transitionStatusMapping
        },
        e7 = r.forwardRef(function(e, t) {
            let {
                render: r,
                className: l,
                style: n,
                ...o
            } = e, {
                store: i
            } = R(), {
                side: s,
                align: a,
                arrowRef: u,
                arrowStyles: c,
                arrowUncentered: d,
                alignItemWithTriggerActive: f
            } = eE(), m = (0, p.useStore)(i, U.open), g = (0, q.useRenderElement)("div", e, {
                state: {
                    open: m,
                    side: s,
                    align: a,
                    uncentered: d
                },
                ref: [u, t],
                props: [{
                    style: c,
                    "aria-hidden": !0
                }, o],
                stateAttributesMapping: e3
            });
            return f ? null : g
        }),
        e9 = r.forwardRef(function(e, t) {
            let {
                render: r,
                className: l,
                style: n,
                direction: o,
                keepMounted: i = !1,
                ...s
            } = e, a = "up" === o, {
                store: u,
                popupRef: d,
                listRef: f,
                handleScrollArrowVisibility: m,
                scrollArrowsMountedCountRef: g
            } = R(), {
                side: h,
                scrollDownArrowRef: S,
                scrollUpArrowRef: v
            } = eE(), b = a ? U.scrollUpArrowVisible : U.scrollDownArrowVisible, y = (0, p.useStore)(u, b), x = (0, p.useStore)(u, U.openMethod), E = y && "touch" !== x, w = (0, ee.useTimeout)(), C = a ? v : S, {
                mounted: A,
                transitionStatus: I,
                setMounted: M
            } = (0, T.useTransitionStatus)(E);
            (0, c.useIsoLayoutEffect)(() => (g.current += 1, u.state.hasScrollArrows || u.set("hasScrollArrows", !0), () => {
                g.current = Math.max(0, g.current - 1), 0 === g.current && u.state.hasScrollArrows && u.set("hasScrollArrows", !1)
            }), [u, g]), (0, z.useOpenChangeComplete)({
                open: E,
                ref: C,
                onComplete() {
                    E || M(!1)
                }
            });
            let P = (0, q.useRenderElement)("div", e, {
                ref: [t, C],
                state: {
                    direction: o,
                    visible: E,
                    side: h,
                    transitionStatus: I
                },
                props: [{
                    "aria-hidden": !0,
                    children: a ? "▲" : "▼",
                    style: {
                        position: "absolute"
                    },
                    onMouseMove(e) {
                        0 === e.movementX && 0 === e.movementY || w.isStarted() || (u.set("activeIndex", null), w.start(40, function e() {
                            let t = u.state.listElement ? ? d.current;
                            if (!t) return;
                            u.set("activeIndex", null), m();
                            let r = (0, X.getMaxScrollOffset)(t.scrollHeight, t.clientHeight),
                                l = (0, X.normalizeScrollOffset)(t.scrollTop, r),
                                n = l === (a ? 0 : r),
                                o = f.current;
                            if (l !== t.scrollTop && (t.scrollTop = l), 0 === o.length && u.set(a ? "scrollUpArrowVisible" : "scrollDownArrowVisible", !n), n) return void w.clear();
                            if (o.length > 0) {
                                let e = C.current ? .offsetHeight || 0;
                                t.scrollTop = function(e, t, r, l, n, o) {
                                    if (t) {
                                        let t = 0,
                                            l = r + n - X.SCROLL_EDGE_TOLERANCE_PX;
                                        for (let r = 0; r < e.length; r += 1) {
                                            let n = e[r];
                                            if (n && n.offsetTop >= l) {
                                                t = r;
                                                break
                                            }
                                        }
                                        let i = Math.max(0, t - 1),
                                            s = e[i];
                                        return i < t && s ? (0, X.normalizeScrollOffset)(s.offsetTop - n, o) : 0
                                    }
                                    let i = e.length - 1,
                                        s = r + l - n + X.SCROLL_EDGE_TOLERANCE_PX;
                                    for (let t = 0; t < e.length; t += 1) {
                                        let r = e[t];
                                        if (r && r.offsetTop + r.offsetHeight > s) {
                                            i = Math.max(0, t - 1);
                                            break
                                        }
                                    }
                                    let a = Math.min(e.length - 1, i + 1),
                                        u = e[a];
                                    return a > i && u ? (0, X.normalizeScrollOffset)(u.offsetTop + u.offsetHeight - l + n, o) : o
                                }(o, a, l, t.clientHeight, e, r)
                            }
                            w.start(40, e)
                        }))
                    },
                    onMouseLeave() {
                        w.clear()
                    }
                }, s],
                stateAttributesMapping: eg.transitionStatusMapping
            });
            return A || i ? P : null
        }),
        te = r.forwardRef(function(e, r) {
            return (0, t.jsx)(e9, { ...e,
                ref: r,
                direction: "down"
            })
        }),
        tt = r.forwardRef(function(e, r) {
            return (0, t.jsx)(e9, { ...e,
                ref: r,
                direction: "up"
            })
        }),
        tr = r.createContext(void 0),
        tl = r.forwardRef(function(e, l) {
            let {
                render: n,
                className: o,
                style: i,
                ...s
            } = e, [a, u] = r.useState(), c = r.useMemo(() => ({
                labelId: a,
                setLabelId: u
            }), [a, u]), d = (0, q.useRenderElement)("div", e, {
                ref: l,
                props: [{
                    role: "group",
                    "aria-labelledby": a
                }, s]
            });
            return (0, t.jsx)(tr.Provider, {
                value: c,
                children: d
            })
        });
    var tn = e.i(88015);
    let to = r.forwardRef(function(e, t) {
        let {
            render: l,
            className: n,
            style: o,
            id: i,
            ...s
        } = e, {
            setLabelId: a
        } = function() {
            let e = r.useContext(tr);
            if (void 0 === e) throw Error((0, x.default)(56));
            return e
        }(), u = (0, tn.useBaseUiId)(i);
        return (0, c.useIsoLayoutEffect)(() => {
            a(u)
        }, [u, a]), (0, q.useRenderElement)("div", e, {
            ref: t,
            props: [{
                id: u
            }, s]
        })
    });
    var ti = e.i(52225);
    e.s(["Arrow", 0, e7, "Backdrop", 0, eS, "Group", 0, tl, "GroupLabel", 0, to, "Icon", 0, ed, "Item", 0, e4, "ItemIndicator", 0, e6, "ItemText", 0, e8, "Label", 0, Q, "List", 0, eQ, "Popup", 0, eX, "Portal", 0, em, "Positioner", 0, eP, "Root", 0, function(e) {
        let {
            id: x,
            value: R,
            defaultValue: C = null,
            onValueChange: P,
            open: D,
            defaultOpen: V = !1,
            onOpenChange: N,
            name: q,
            form: K,
            autoComplete: J,
            disabled: Q = !1,
            readOnly: Z = !1,
            required: ee = !1,
            modal: et = !0,
            actionsRef: er,
            inputRef: el,
            onOpenChangeComplete: en,
            items: eo,
            multiple: ei = !1,
            itemToStringLabel: es,
            itemToStringValue: ea,
            isItemEqualToValue: eu = O,
            highlightItemOnHover: ec = !0,
            children: ed
        } = e, {
            clearErrors: ef
        } = (0, B.useFormContext)(), {
            setDirty: ep,
            setTouched: em,
            setFocused: eg,
            validityData: eh,
            setFilled: eS,
            name: ev,
            disabled: eb,
            validation: ey,
            validationMode: ex
        } = (0, A.useFieldRootContext)(), eE = (0, M.useLabelableId)({
            id: x
        }), ew = eb || Q, eR = ev ? ? q, [eC, eA] = (0, u.useControlled)({
            controlled: R,
            default: ei ? C ? ? g.EMPTY_ARRAY : C,
            name: "Select",
            state: "value"
        }), [eI, eM] = (0, u.useControlled)({
            controlled: D,
            default: V,
            name: "Select",
            state: "open"
        }), eT = r.useRef([]), eP = r.useRef([]), eO = r.useRef(null), eL = r.useRef(null), ej = r.useRef(0), eD = r.useRef(null), eV = r.useRef([]), ek = r.useRef(!1), e_ = r.useRef(null), eN = r.useRef(null), eU = r.useRef({
            allowSelectedMouseUp: !1,
            allowUnselectedMouseUp: !1,
            dragY: 0
        }), eF = r.useRef(!1), {
            mounted: eH,
            setMounted: ez,
            transitionStatus: eB
        } = (0, T.useTransitionStatus)(eI), {
            openMethod: eY,
            triggerProps: eG
        } = (0, G.useOpenInteractionType)(eI), eX = (0, o.useRefWithInit)(() => new m.Store({
            id: eE,
            labelId: void 0,
            modal: et,
            multiple: ei,
            itemToStringLabel: es,
            itemToStringValue: ea,
            isItemEqualToValue: eu,
            value: eC,
            open: eI,
            mounted: eH,
            transitionStatus: eB,
            items: eo,
            forceMount: !1,
            openMethod: null,
            activeIndex: null,
            selectedIndex: null,
            popupProps: {},
            triggerProps: {},
            triggerElement: null,
            positionerElement: null,
            listElement: null,
            popupSide: null,
            scrollUpArrowVisible: !1,
            scrollDownArrowVisible: !1,
            hasScrollArrows: !1
        })).current, eW = (0, p.useStore)(eX, U.activeIndex), e$ = (0, p.useStore)(eX, U.selectedIndex), eq = (0, p.useStore)(eX, U.triggerElement), eK = (0, p.useStore)(eX, U.positionerElement), eJ = (0, s.usePreviousValue)(eY), eQ = eY ? ? eJ ? ? null, eZ = r.useMemo(() => ei ? "" : _(eC, ea), [ei, eC, ea]), e0 = r.useMemo(() => ei && Array.isArray(eC) ? eC.map(e => _(e, ea)) : _(eC, ea), [ei, eC, ea]), e1 = (0, f.useValueAsRef)(eX.state.triggerElement), e5 = (0, d.useStableCallback)(() => e0);
        (0, I.useRegisterFieldControl)(e1, eE, eC, e5, !ew, q);
        let e4 = r.useRef(eC),
            e6 = ei ? Array.isArray(eC) && eC.length > 0 : null != eC && "" !== _(eC, ea);
        (0, c.useIsoLayoutEffect)(() => {
            eC !== e4.current && eX.set("forceMount", !0)
        }, [eX, eC]), (0, c.useIsoLayoutEffect)(() => {
            eS(e6)
        }, [e6, eS]), (0, c.useIsoLayoutEffect)(function() {
            let e, t = eV.current;
            if (ei) {
                let r = Array.isArray(eC) ? eC : [];
                if (0 === r.length) e = null;
                else {
                    let l = j(t, r[r.length - 1], eu);
                    e = -1 === l ? null : l
                }
            } else {
                let r = j(t, eC, eu);
                e = -1 === r ? null : r
            }
            null === e && (eN.current = null), eI || eX.set("selectedIndex", e)
        }, [e6, ei, eI, eC, eV, eu, eX, eN]), (0, Y.useValueChanged)(eC, () => {
            let e;
            ef(eR), ep((e = eh.initialValue, Array.isArray(eC) && Array.isArray(e) ? ! function(e, t, r = (e, t) => e === t) {
                return e.length === t.length && e.every((e, l) => r(e, t[l]))
            }(eC, e, (e, t) => L(e, t, eu)) : eC !== e)), ey.change(eC)
        });
        let e2 = (0, d.useStableCallback)((e, t) => {
                N ? .(e, t), !t.isCanceled && (eM(e), e || t.reason !== H.REASONS.focusOut && t.reason !== H.REASONS.outsidePress || (em(!0), eg(!1), "onBlur" === ex && ey.commit(eC)))
            }),
            e8 = (0, d.useStableCallback)(() => {
                ez(!1), eX.update({
                    activeIndex: null,
                    openMethod: null
                }), en ? .(!1)
            });
        (0, z.useOpenChangeComplete)({
            enabled: !er,
            open: eI,
            ref: eO,
            onComplete() {
                eI || e8()
            }
        }), r.useImperativeHandle(er, () => ({
            unmount: e8
        }), [e8]);
        let e3 = (0, d.useStableCallback)((e, t) => {
                P ? .(e, t), t.isCanceled || eA(e)
            }),
            e7 = (0, d.useStableCallback)(() => {
                let e = eX.state.listElement || eO.current;
                if (!e) return;
                let t = (0, X.getMaxScrollOffset)(e.scrollHeight, e.clientHeight),
                    r = (0, X.normalizeScrollOffset)(e.scrollTop, t),
                    l = r > 0,
                    n = r < t;
                eX.state.scrollUpArrowVisible !== l && eX.set("scrollUpArrowVisible", l), eX.state.scrollDownArrowVisible !== n && eX.set("scrollDownArrowVisible", n)
            }),
            e9 = (0, v.useFloatingRootContext)({
                open: eI,
                onOpenChange: e2,
                elements: {
                    reference: eq,
                    floating: eK
                }
            }),
            te = (0, h.useClick)(e9, {
                enabled: !Z && !ew,
                event: "mousedown"
            }),
            tt = (0, S.useDismiss)(e9),
            tr = (0, b.useListNavigation)(e9, {
                enabled: !Z && !ew,
                listRef: eT,
                activeIndex: eW,
                selectedIndex: e$,
                disabledIndices: g.EMPTY_ARRAY,
                onNavigate(e) {
                    (null !== e || eI) && eX.set("activeIndex", e)
                },
                focusItemOnHover: ec
            }),
            tl = (0, y.useTypeahead)(e9, {
                enabled: !Z && !ew && (eI || !ei),
                listRef: eP,
                activeIndex: eW,
                selectedIndex: e$,
                disabledIndices: e => (0, a.isElementDisabled)(eT.current[e]),
                onMatch(e) {
                    eI ? eX.set("activeIndex", e) : e3(eV.current[e], (0, F.createChangeEventDetails)("none"))
                },
                onTyping(e) {
                    ek.current = e
                }
            }),
            tn = r.useMemo(() => {
                let e = (0, $.mergeProps)(tl.reference, tr.reference, tt.reference, te.reference, eG);
                return eE && (e.id = eE), e
            }, [te.reference, tl.reference, tr.reference, tt.reference, eG, eE]),
            to = r.useMemo(() => (0, $.mergeProps)(W.FOCUSABLE_POPUP_PROPS, tl.floating, tr.floating, tt.floating), [tl.floating, tr.floating, tt.floating]),
            ti = tr.item ? ? g.EMPTY_OBJECT;
        (0, i.useOnFirstRender)(() => {
            eX.update({
                popupProps: to,
                triggerProps: tn
            })
        }), (0, c.useIsoLayoutEffect)(() => {
            eX.update({
                id: eE,
                modal: et,
                multiple: ei,
                value: eC,
                open: eI,
                mounted: eH,
                transitionStatus: eB,
                popupProps: to,
                triggerProps: tn,
                items: eo,
                itemToStringLabel: es,
                itemToStringValue: ea,
                isItemEqualToValue: eu,
                openMethod: eQ
            })
        }, [eX, eE, et, ei, eC, eI, eH, eB, to, tn, eo, es, ea, eu, eQ]);
        let ts = r.useMemo(() => ({
                store: eX,
                name: eR,
                required: ee,
                disabled: ew,
                readOnly: Z,
                multiple: ei,
                highlightItemOnHover: ec,
                setValue: e3,
                setOpen: e2,
                listRef: eT,
                popupRef: eO,
                scrollHandlerRef: eL,
                handleScrollArrowVisibility: e7,
                scrollArrowsMountedCountRef: ej,
                itemProps: ti,
                valueRef: eD,
                valuesRef: eV,
                labelsRef: eP,
                typingRef: ek,
                selectionRef: eU,
                firstItemTextRef: e_,
                selectedItemTextRef: eN,
                validation: ey,
                onOpenChangeComplete: en,
                alignItemWithTriggerActiveRef: eF,
                initialValueRef: e4
            }), [eX, eR, ee, ew, Z, ei, ec, e3, e2, ti, ey, en, e7]),
            ta = (0, n.useMergedRefs)(el, ey.inputRef),
            tu = ei && Array.isArray(eC) && eC.length > 0,
            tc = ei ? void 0 : eR,
            td = r.useMemo(() => ei && Array.isArray(eC) && eR ? eC.map(e => {
                let r = _(e, ea);
                return (0, t.jsx)("input", {
                    type: "hidden",
                    form: K,
                    name: eR,
                    value: r,
                    disabled: ew
                }, r)
            }) : null, [ei, eC, K, eR, ea, ew]);
        return (0, t.jsx)(E.Provider, {
            value: ts,
            children: (0, t.jsxs)(w.Provider, {
                value: e9,
                children: [ed, (0, t.jsx)("input", { ...ey.getValidationProps(ew, {
                        onFocus() {
                            eX.state.triggerElement ? .focus({
                                focusVisible: !0
                            })
                        },
                        onChange(e) {
                            if (e.nativeEvent.defaultPrevented || ew || Z) return;
                            let t = e.currentTarget.value,
                                r = (0, F.createChangeEventDetails)(H.REASONS.none, e.nativeEvent);
                            eX.set("forceMount", !0), queueMicrotask(function() {
                                if (ei) return;
                                let e = t.toLowerCase(),
                                    l = eV.current.findIndex(t => _(t, ea).toLowerCase() === e || k(t, es).toLowerCase() === e); - 1 === l && (l = eV.current.findIndex((t, r) => {
                                    let l = eP.current[r];
                                    return null != l && l.toLowerCase() === e
                                }));
                                let n = -1 === l ? void 0 : eV.current[l];
                                null != n && e3(n, r)
                            })
                        }
                    }),
                    id: eE && null == tc ? `${eE}-hidden-input` : void 0,
                    form: K,
                    name: tc,
                    autoComplete: J,
                    value: eZ,
                    disabled: ew,
                    required: ee && !tu,
                    readOnly: Z,
                    ref: ta,
                    style: eR ? l.visuallyHiddenInput : l.visuallyHidden,
                    tabIndex: -1,
                    "aria-hidden": !0,
                    suppressHydrationWarning: !0
                }), td]
            })
        })
    }, "ScrollDownArrow", 0, te, "ScrollUpArrow", 0, tt, "Separator", () => ti.Separator, "Trigger", 0, ea, "Value", 0, ec], 74786);
    var ts = e.i(74786),
        ts = ts,
        ta = e.i(75157),
        tu = e.i(26495),
        tu = tu,
        tc = e.i(93698);
    let td = (0, e.i(56420).default)("chevron-up", [
            ["path", {
                d: "m18 15-6-6-6 6",
                key: "153udz"
            }]
        ]),
        tf = ts.Root;

    function tp({
        className: e,
        ...r
    }) {
        return (0, t.jsx)(ts.ScrollUpArrow, {
            "data-slot": "select-scroll-up-button",
            className: (0, ta.cn)("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", e),
            ...r,
            children: (0, t.jsx)(td, {})
        })
    }

    function tm({
        className: e,
        ...r
    }) {
        return (0, t.jsx)(ts.ScrollDownArrow, {
            "data-slot": "select-scroll-down-button",
            className: (0, ta.cn)("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", e),
            ...r,
            children: (0, t.jsx)(tu.default, {})
        })
    }
    e.s(["Select", 0, tf, "SelectContent", 0, function({
        className: e,
        children: r,
        side: l = "bottom",
        sideOffset: n = 4,
        align: o = "center",
        alignOffset: i = 0,
        alignItemWithTrigger: s = !0,
        ...a
    }) {
        return (0, t.jsx)(ts.Portal, {
            children: (0, t.jsx)(ts.Positioner, {
                side: l,
                sideOffset: n,
                align: o,
                alignOffset: i,
                alignItemWithTrigger: s,
                className: "isolate z-50",
                children: (0, t.jsxs)(ts.Popup, {
                    "data-slot": "select-content",
                    "data-align-trigger": s,
                    className: (0, ta.cn)("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", e),
                    ...a,
                    children: [(0, t.jsx)(tp, {}), (0, t.jsx)(ts.List, {
                        children: r
                    }), (0, t.jsx)(tm, {})]
                })
            })
        })
    }, "SelectItem", 0, function({
        className: e,
        children: r,
        ...l
    }) {
        return (0, t.jsxs)(ts.Item, {
            "data-slot": "select-item",
            className: (0, ta.cn)("relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", e),
            ...l,
            children: [(0, t.jsx)(ts.ItemText, {
                className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
                children: r
            }), (0, t.jsx)(ts.ItemIndicator, {
                render: (0, t.jsx)("span", {
                    className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center"
                }),
                children: (0, t.jsx)(tc.CheckIcon, {
                    className: "pointer-events-none"
                })
            })]
        })
    }, "SelectTrigger", 0, function({
        className: e,
        size: r = "default",
        children: l,
        ...n
    }) {
        return (0, t.jsxs)(ts.Trigger, {
            "data-slot": "select-trigger",
            "data-size": r,
            className: (0, ta.cn)("flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e),
            ...n,
            children: [l, (0, t.jsx)(ts.Icon, {
                render: (0, t.jsx)(tu.default, {
                    className: "pointer-events-none size-4 text-muted-foreground"
                })
            })]
        })
    }, "SelectValue", 0, function({
        className: e,
        ...r
    }) {
        return (0, t.jsx)(ts.Value, {
            "data-slot": "select-value",
            className: (0, ta.cn)("flex flex-1 text-left", e),
            ...r
        })
    }], 67489)
}]);