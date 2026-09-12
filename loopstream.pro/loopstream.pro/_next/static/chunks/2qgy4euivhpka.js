(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 2820, 56736, 9793, 25834, 84324, 64951, e => {
    "use strict";
    var t, a, o = e.i(15504),
        n = e.i(8821),
        i = e.i(52245),
        r = e.i(5005),
        s = e.i(9407);
    let l = { ...r.popupStateMapping,
            ...s.transitionStatusMapping
        },
        d = o.forwardRef(function(e, t) {
            let {
                render: a,
                className: o,
                style: r,
                forceRender: s = !1,
                ...d
            } = e, {
                store: u
            } = (0, n.useDialogRootContext)(), p = u.useState("open"), c = u.useState("nested"), g = u.useState("mounted"), h = u.useState("transitionStatus");
            return (0, i.useRenderElement)("div", e, {
                state: {
                    open: p,
                    transitionStatus: h
                },
                ref: [u.context.backdropRef, t],
                stateAttributesMapping: l,
                props: [{
                    role: "presentation",
                    hidden: !g,
                    style: {
                        userSelect: "none",
                        WebkitUserSelect: "none"
                    }
                }, d],
                enabled: s || !c
            })
        });
    e.s(["DialogBackdrop", 0, d], 2820);
    var u = e.i(40886),
        p = e.i(75606),
        c = e.i(56434);
    let g = o.forwardRef(function(e, t) {
        let {
            render: a,
            className: o,
            style: r,
            disabled: s = !1,
            nativeButton: l = !0,
            ...d
        } = e, {
            store: g
        } = (0, n.useDialogRootContext)(), h = g.useState("open"), {
            getButtonProps: f,
            buttonRef: m
        } = (0, u.useButton)({
            disabled: s,
            native: l
        });
        return (0, i.useRenderElement)("button", e, {
            state: {
                disabled: s
            },
            ref: [t, m],
            props: [{
                onClick: function(e) {
                    h && g.setOpen(!1, (0, p.createChangeEventDetails)(c.REASONS.closePress, e.nativeEvent))
                }
            }, d, f]
        })
    });
    e.s(["DialogClose", 0, g], 56736);
    var h = e.i(88015);
    let f = o.forwardRef(function(e, t) {
        let {
            render: a,
            className: o,
            style: r,
            id: s,
            ...l
        } = e, {
            store: d
        } = (0, n.useDialogRootContext)(), u = (0, h.useBaseUiId)(s);
        return d.useSyncedValueWithCleanup("descriptionElementId", u), (0, i.useRenderElement)("p", e, {
            ref: t,
            props: [{
                id: u
            }, l]
        })
    });
    e.s(["DialogDescription", 0, f], 9793);
    var m = e.i(61487);
    let x = ((t = {}).nestedDialogs = "--nested-dialogs", t),
        S = ((a = {})[a.open = r.CommonPopupDataAttributes.open] = "open", a[a.closed = r.CommonPopupDataAttributes.closed] = "closed", a[a.startingStyle = r.CommonPopupDataAttributes.startingStyle] = "startingStyle", a[a.endingStyle = r.CommonPopupDataAttributes.endingStyle] = "endingStyle", a.nested = "data-nested", a.nestedDialogOpen = "data-nested-dialog-open", a);
    var D = e.i(33332);
    let C = o.createContext(void 0);

    function v() {
        let e = o.useContext(C);
        if (void 0 === e) throw Error((0, D.default)(26));
        return e
    }
    e.s(["DialogPortalContext", 0, C, "useDialogPortalContext", 0, v], 25834);
    var b = e.i(37584),
        y = e.i(73327),
        R = e.i(64111),
        P = e.i(43476);
    let O = { ...r.popupStateMapping,
            ...s.transitionStatusMapping,
            nestedDialogOpen: e => e ? {
                [S.nestedDialogOpen]: ""
            } : null
        },
        E = o.forwardRef(function(e, t) {
            let {
                render: a,
                className: o,
                style: r,
                finalFocus: s,
                initialFocus: l,
                ...d
            } = e, {
                store: u
            } = (0, n.useDialogRootContext)(), p = u.useState("descriptionElementId"), c = u.useState("disablePointerDismissal"), g = u.useState("floatingRootContext"), h = u.useState("popupProps"), f = u.useState("modal"), S = u.useState("mounted"), D = u.useState("nested"), C = u.useState("nestedOpenDialogCount"), E = u.useState("open"), w = u.useState("openMethod"), j = u.useState("titleElementId"), I = u.useState("transitionStatus"), k = u.useState("role"), T = g.useState("floatingId"), N = d.id ? ? T;
            v(), (0, b.useOpenChangeComplete)({
                open: E,
                ref: u.context.popupRef,
                onComplete() {
                    E && u.context.onOpenChangeComplete ? .(!0)
                }
            });
            let B = void 0 === l ? (0, R.createDefaultInitialFocus)(u.context.popupRef) : l,
                M = u.useStateSetter("popupElement"),
                A = (0, i.useRenderElement)("div", e, {
                    state: {
                        open: E,
                        nested: D,
                        transitionStatus: I,
                        nestedDialogOpen: C > 0
                    },
                    props: [h, {
                        id: N,
                        "aria-labelledby": j ? ? void 0,
                        "aria-describedby": p ? ? void 0,
                        role: k,
                        ...R.FOCUSABLE_POPUP_PROPS,
                        hidden: !S,
                        onKeyDown(e) {
                            y.COMPOSITE_KEYS.has(e.key) && e.stopPropagation()
                        },
                        style: {
                            [x.nestedDialogs]: C
                        }
                    }, d],
                    ref: [t, u.context.popupRef, M],
                    stateAttributesMapping: O
                });
            return (0, P.jsx)(m.FloatingFocusManager, {
                context: g,
                openInteractionType: w,
                disabled: !S,
                closeOnFocusOut: !c,
                initialFocus: B,
                returnFocus: s,
                modal: !1 !== f,
                restoreFocus: "popup",
                children: A
            })
        });
    e.s(["DialogPopup", 0, E], 84324);
    var w = e.i(44394),
        j = e.i(26674),
        I = e.i(426);
    let k = o.forwardRef(function(e, t) {
        let {
            keepMounted: a = !1,
            ...o
        } = e, {
            store: i
        } = (0, n.useDialogRootContext)(), r = i.useState("mounted"), s = i.useState("modal"), l = i.useState("open");
        return r || a ? (0, P.jsx)(C.Provider, {
            value: a,
            children: (0, P.jsxs)(j.FloatingPortal, {
                ref: t,
                ...o,
                children: [r && !0 === s && (0, P.jsx)(I.InternalBackdrop, {
                    ref: i.context.internalBackdropRef,
                    inert: (0, w.inertValue)(!l)
                }), e.children]
            })
        }) : null
    });
    e.s(["DialogPortal", 0, k], 64951)
}, 53753, 14387, 60964, e => {
    "use strict";
    e.i(14651);
    var t = e.i(2820),
        a = e.i(56736),
        o = e.i(9793),
        n = e.i(84324),
        i = e.i(64951),
        r = e.i(50440),
        s = e.i(74217),
        l = e.i(77173),
        d = e.i(13488),
        u = e.i(25326);
    e.s(["Backdrop", () => t.DialogBackdrop, "Close", () => a.DialogClose, "Description", () => o.DialogDescription, "Handle", () => u.DialogHandle, "Popup", () => n.DialogPopup, "Portal", () => i.DialogPortal, "Root", () => r.DialogRoot, "Title", () => l.DialogTitle, "Trigger", () => d.DialogTrigger, "Viewport", () => s.DialogViewport, "createHandle", () => u.createDialogHandle], 28376);
    var p = e.i(28376);
    e.s(["Dialog", 0, p], 53753);
    let c = (0, e.i(56420).default)("x", [
        ["path", {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }],
        ["path", {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }]
    ]);
    e.s(["default", 0, c], 14387), e.s(["XIcon", 0, c], 60964)
}, 14651, e => {
    "use strict";
    e.s([])
}, 50440, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(8821),
        o = e.i(66250);
    e.s(["DialogRoot", 0, function(e) {
        let n = t.useContext(a.IsDrawerContext) ? "drawer" : "dialog";
        return (0, o.useRenderDialogRoot)(e, n)
    }])
}, 8821, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        a = e.i(15504);
    let o = a.createContext(!1),
        n = a.createContext(void 0);
    e.s(["DialogRootContext", 0, n, "IsDrawerContext", 0, o, "useDialogRootContext", 0, function(e) {
        let o = a.useContext(n);
        if (!1 === e && void 0 === o) throw Error((0, t.default)(27));
        return o
    }])
}, 67530, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(45484),
        o = e.i(56789),
        n = e.i(17989),
        i = e.i(47554),
        r = e.i(75606),
        s = e.i(56434),
        l = e.i(64111);
    e.s(["DialogInteractions", 0, function({
        store: e,
        parentContext: r,
        isDrawer: s
    }) {
        let d = e.useState("open"),
            u = e.useState("disablePointerDismissal"),
            p = e.useState("modal"),
            c = e.useState("popupElement"),
            g = e.useState("floatingRootContext"),
            [h, f] = t.useState(0),
            [m, x] = t.useState(0),
            S = 0 === h,
            D = (0, n.useDismiss)(g, {
                outsidePressEvent: () => e.context.internalBackdropRef.current || e.context.backdropRef.current ? "intentional" : {
                    mouse: "trap-focus" === p ? "sloppy" : "intentional",
                    touch: "sloppy"
                },
                outsidePress(t) {
                    if (!e.context.outsidePressEnabledRef.current || "button" in t && 0 !== t.button || "touches" in t && 1 !== t.touches.length) return !1;
                    let a = (0, i.getTarget)(t);
                    return !!S && !u && (!p || !e.context.internalBackdropRef.current && !e.context.backdropRef.current || e.context.internalBackdropRef.current === a || e.context.backdropRef.current === a || (0, i.contains)(a, c) && !a ? .hasAttribute("data-base-ui-portal"))
                },
                escapeKey: S
            });
        (0, a.useScrollLock)(d && !0 === p, c), e.useContextCallback("onNestedDialogOpen", (e, t) => {
            f(e), x(t)
        }), e.useContextCallback("onNestedDialogClose", () => {
            f(0), x(0)
        }), t.useEffect(() => (r ? .onNestedDialogOpen && d && r.onNestedDialogOpen(h + 1, m + +!!s), r ? .onNestedDialogClose && !d && r.onNestedDialogClose(), () => {
            r ? .onNestedDialogClose && d && r.onNestedDialogClose()
        }), [s, d, h, m, r]);
        let C = D.reference ? ? o.EMPTY_OBJECT,
            v = D.trigger ? ? o.EMPTY_OBJECT,
            b = D.floating ? ? o.EMPTY_OBJECT;
        return (0, l.usePopupInteractionProps)(e, {
            activeTriggerProps: C,
            inactiveTriggerProps: v,
            popupProps: b,
            nestedOpenDialogCount: h,
            nestedOpenDrawerCount: m
        }), null
    }, "useDialogRoot", 0, function(e) {
        let {
            store: a,
            actionsRef: o
        } = e, n = a.useState("open");
        (0, l.usePopupRootSync)(a, n), (0, l.useImplicitActiveTrigger)(a);
        let {
            forceUnmount: i
        } = (0, l.useOpenStateTransitions)(n, a), d = t.useCallback(() => {
            a.setOpen(!1, (0, r.createChangeEventDetails)(s.REASONS.imperativeAction))
        }, [a]);
        t.useImperativeHandle(o, () => ({
            unmount: i,
            close: d
        }), [i, d])
    }])
}, 66250, 1807, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(13203),
        o = e.i(67530),
        n = e.i(8821),
        i = e.i(16269),
        r = e.i(1252),
        s = e.i(16786),
        l = e.i(90627),
        d = e.i(64111);
    let u = { ...s.popupStoreSelectors,
        modal: (0, i.createSelector)(e => e.modal),
        nested: (0, i.createSelector)(e => e.nested),
        nestedOpenDialogCount: (0, i.createSelector)(e => e.nestedOpenDialogCount),
        nestedOpenDrawerCount: (0, i.createSelector)(e => e.nestedOpenDrawerCount),
        disablePointerDismissal: (0, i.createSelector)(e => e.disablePointerDismissal),
        openMethod: (0, i.createSelector)(e => e.openMethod),
        descriptionElementId: (0, i.createSelector)(e => e.descriptionElementId),
        titleElementId: (0, i.createSelector)(e => e.titleElementId),
        viewportElement: (0, i.createSelector)(e => e.viewportElement),
        role: (0, i.createSelector)(e => e.role)
    };
    class p extends r.ReactStore {
        constructor(e, a, o = !1) {
            const n = new l.PopupTriggerMap,
                i = function(e = {}) {
                    return { ...(0, s.createInitialPopupStoreState)(),
                        modal: !0,
                        disablePointerDismissal: !1,
                        popupElement: null,
                        viewportElement: null,
                        descriptionElementId: void 0,
                        titleElementId: void 0,
                        openMethod: null,
                        nested: !1,
                        nestedOpenDialogCount: 0,
                        nestedOpenDrawerCount: 0,
                        role: "dialog",
                        ...e
                    }
                }(e);
            i.floatingRootContext = (0, s.createPopupFloatingRootContext)(n, a, o), super(i, {
                popupRef: t.createRef(),
                backdropRef: t.createRef(),
                internalBackdropRef: t.createRef(),
                outsidePressEnabledRef: {
                    current: !0
                },
                triggerElements: n,
                onOpenChange: void 0,
                onOpenChangeComplete: void 0
            }, u)
        }
        setOpen = (e, t) => {
            if (t.preventUnmountOnClose = () => {
                    this.set("preventUnmountingOnClose", !0)
                }, e || null != t.trigger || null == this.state.activeTriggerId || (t.trigger = this.state.activeTriggerElement ? ? void 0), this.context.onOpenChange ? .(e, t), t.isCanceled) return;
            this.state.floatingRootContext.dispatchOpenChange(e, t);
            let a = {
                open: e
            };
            (0, d.setPopupOpenState)(a, e, t.trigger), this.update(a)
        };
        static useStore(e, t) {
            return (0, d.usePopupStore)(e, (e, a) => new p(t, e, a), !0).store
        }
    }
    e.s(["DialogStore", 0, p], 1807);
    var c = e.i(43476);
    e.s(["useRenderDialogRoot", 0, function(e, i = "dialog") {
        let {
            children: r,
            open: s,
            defaultOpen: l = !1,
            onOpenChange: d,
            onOpenChangeComplete: u,
            disablePointerDismissal: g = !1,
            modal: h = !0,
            actionsRef: f,
            handle: m,
            triggerId: x,
            defaultTriggerId: S = null
        } = e, D = "alert-dialog" === i, C = (0, n.useDialogRootContext)(!0), v = {
            modal: !!D || h,
            disablePointerDismissal: D || g,
            nested: !!C,
            role: D ? "alertdialog" : "dialog"
        }, b = p.useStore(m ? .store, {
            open: l,
            openProp: s,
            activeTriggerId: S,
            triggerIdProp: x,
            ...v
        });
        (0, a.useOnFirstRender)(() => {
            let e = void 0 === s && !1 === b.state.open && !0 === l ? {
                open: !0,
                activeTriggerId: S
            } : null;
            D ? b.update(e ? { ...v,
                ...e
            } : v) : e && b.update(e)
        }), b.useControlledProp("openProp", s), b.useControlledProp("triggerIdProp", x), b.useSyncedValues(v), b.useContextCallback("onOpenChange", d), b.useContextCallback("onOpenChangeComplete", u);
        let y = b.useState("open"),
            R = b.useState("mounted"),
            P = b.useState("payload");
        (0, o.useDialogRoot)({
            store: b,
            actionsRef: f
        });
        let O = t.useMemo(() => ({
            store: b
        }), [b]);
        return (0, c.jsx)(n.IsDrawerContext.Provider, {
            value: !1,
            children: (0, c.jsxs)(n.DialogRootContext.Provider, {
                value: O,
                children: [(y || R) && (0, c.jsx)(o.DialogInteractions, {
                    store: b,
                    parentContext: C ? .store.context,
                    isDrawer: "drawer" === i
                }), "function" == typeof r ? r({
                    payload: P
                }) : r]
            })
        })
    }], 66250)
}, 25326, e => {
    "use strict";
    e.i(47167);
    var t = e.i(1807),
        a = e.i(75606),
        o = e.i(56434);
    class n {
        constructor(e) {
            this.store = e ? ? new t.DialogStore
        }
        open(e) {
            let t = e ? this.store.context.triggerElements.getById(e) : void 0;
            this.store.setOpen(!0, (0, a.createChangeEventDetails)(o.REASONS.imperativeAction, void 0, t))
        }
        openWithPayload(e) {
            this.store.set("payload", e), this.store.setOpen(!0, (0, a.createChangeEventDetails)(o.REASONS.imperativeAction, void 0, void 0))
        }
        close() {
            this.store.setOpen(!1, (0, a.createChangeEventDetails)(o.REASONS.imperativeAction, void 0, void 0))
        }
        get isOpen() {
            return this.store.select("open")
        }
    }
    e.s(["DialogHandle", 0, n, "createDialogHandle", 0, function() {
        return new n
    }])
}, 77173, 13488, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(8821),
        o = e.i(52245),
        n = e.i(88015);
    let i = t.forwardRef(function(e, t) {
        let {
            render: i,
            className: r,
            style: s,
            id: l,
            ...d
        } = e, {
            store: u
        } = (0, a.useDialogRootContext)(), p = (0, n.useBaseUiId)(l);
        return u.useSyncedValueWithCleanup("titleElementId", p), (0, o.useRenderElement)("h2", e, {
            ref: t,
            props: [{
                id: p
            }, d]
        })
    });
    e.s(["DialogTitle", 0, i], 77173);
    var r = e.i(33332),
        s = e.i(40886),
        l = e.i(5005),
        d = e.i(38396),
        u = e.i(64111),
        p = e.i(85689),
        c = e.i(32199);
    let g = t.forwardRef(function(e, i) {
        let {
            render: g,
            className: h,
            style: f,
            disabled: m = !1,
            nativeButton: x = !0,
            id: S,
            payload: D,
            handle: C,
            ...v
        } = e, b = (0, a.useDialogRootContext)(!0), y = C ? .store ? ? b ? .store;
        if (!y) throw Error((0, r.default)(79));
        let R = (0, n.useBaseUiId)(S),
            P = y.useState("floatingRootContext"),
            O = y.useState("isOpenedByTrigger", R),
            E = y.useState("triggerPopupId", R),
            w = t.useRef(null),
            {
                registerTrigger: j,
                isMountedByThisTrigger: I
            } = (0, u.useTriggerDataForwarding)(R, w, y, {
                payload: D
            }),
            {
                getButtonProps: k,
                buttonRef: T
            } = (0, s.useButton)({
                disabled: m,
                native: x
            }),
            N = (0, p.useClick)(P, {
                enabled: null != P
            }),
            B = (0, c.useOpenMethodTriggerProps)(() => y.select("open"), e => {
                y.set("openMethod", e)
            }),
            M = y.useState("triggerProps", I);
        return (0, o.useRenderElement)("button", e, {
            state: {
                disabled: m,
                open: O
            },
            ref: [T, i, j, w],
            props: [N.reference, M, B, {
                [d.CLICK_TRIGGER_IDENTIFIER]: "",
                id: R,
                "aria-haspopup": "dialog",
                "aria-expanded": O,
                "aria-controls": E
            }, v, k],
            stateAttributesMapping: l.triggerOpenStateMapping
        })
    });
    e.s(["DialogTrigger", 0, g], 13488)
}, 74217, e => {
    "use strict";
    var t, a = e.i(15504),
        o = e.i(52245),
        n = e.i(5005),
        i = e.i(9407),
        r = e.i(8821),
        s = e.i(25834);
    let l = ((t = {})[t.open = n.CommonPopupDataAttributes.open] = "open", t[t.closed = n.CommonPopupDataAttributes.closed] = "closed", t[t.startingStyle = n.CommonPopupDataAttributes.startingStyle] = "startingStyle", t[t.endingStyle = n.CommonPopupDataAttributes.endingStyle] = "endingStyle", t.nested = "data-nested", t.nestedDialogOpen = "data-nested-dialog-open", t),
        d = { ...n.popupStateMapping,
            ...i.transitionStatusMapping,
            nested: e => e ? {
                [l.nested]: ""
            } : null,
            nestedDialogOpen: e => e ? {
                [l.nestedDialogOpen]: ""
            } : null
        },
        u = a.forwardRef(function(e, t) {
            let {
                render: a,
                className: n,
                style: i,
                children: l,
                ...u
            } = e, p = (0, s.useDialogPortalContext)(), {
                store: c
            } = (0, r.useDialogRootContext)(), g = c.useState("open"), h = c.useState("nested"), f = c.useState("transitionStatus"), m = c.useState("nestedOpenDialogCount"), x = c.useState("mounted"), S = c.useStateSetter("viewportElement");
            return (0, o.useRenderElement)("div", e, {
                enabled: p || x,
                state: {
                    open: g,
                    nested: h,
                    transitionStatus: f,
                    nestedDialogOpen: m > 0
                },
                ref: [t, S],
                stateAttributesMapping: d,
                props: [{
                    role: "presentation",
                    hidden: !x,
                    style: {
                        pointerEvents: g ? void 0 : "none"
                    },
                    children: l
                }, u]
            })
        });
    e.s(["DialogViewport", 0, u], 74217)
}, 6039, e => {
    "use strict";
    var t = e.i(15504),
        a = e.i(46376),
        o = e.i(67865);
    e.s(["useValueChanged", 0, function(e, n) {
        let i = t.useRef(e),
            r = (0, o.useStableCallback)(n);
        (0, a.useIsoLayoutEffect)(() => {
            i.current !== e && r(i.current)
        }, [e, r]), (0, a.useIsoLayoutEffect)(() => {
            i.current = e
        }, [e])
    }])
}, 52225, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        a = e.i(52245);
    let o = t.forwardRef(function(e, t) {
        let {
            className: o,
            render: n,
            orientation: i = "horizontal",
            style: r,
            ...s
        } = e;
        return (0, a.useRenderElement)("div", e, {
            state: {
                orientation: i
            },
            ref: t,
            props: [{
                role: "separator",
                "aria-orientation": i
            }, s]
        })
    });
    e.s(["Separator", 0, o])
}, 94105, e => {
    "use strict";
    let t = (0, e.i(56420).default)("layout-dashboard", [
        ["rect", {
            width: "7",
            height: "9",
            x: "3",
            y: "3",
            rx: "1",
            key: "10lvy0"
        }],
        ["rect", {
            width: "7",
            height: "5",
            x: "14",
            y: "3",
            rx: "1",
            key: "16une8"
        }],
        ["rect", {
            width: "7",
            height: "9",
            x: "14",
            y: "12",
            rx: "1",
            key: "1hutg5"
        }],
        ["rect", {
            width: "7",
            height: "5",
            x: "3",
            y: "16",
            rx: "1",
            key: "ldoo1y"
        }]
    ]);
    e.s(["LayoutDashboard", 0, t], 94105)
}, 91976, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(15504),
        o = e.i(57688),
        n = e.i(22016),
        i = e.i(18566),
        r = e.i(94105);
    let s = (0, e.i(56420).default)("menu", [
        ["path", {
            d: "M4 5h16",
            key: "1tepv9"
        }],
        ["path", {
            d: "M4 12h16",
            key: "1lakjw"
        }],
        ["path", {
            d: "M4 19h16",
            key: "1djgab"
        }]
    ]);
    var l = e.i(19455),
        d = e.i(75157),
        u = e.i(80376);
    let p = [{
            label: "Home",
            href: "/"
        }, {
            label: "Pricing",
            href: "/pricing"
        }, {
            label: "Articles",
            href: "/articles"
        }, {
            label: "Tutorials",
            href: "/#tutorials"
        }, {
            label: "Contact us",
            href: "/contact-us"
        }],
        c = {
            pricing: "/#pricing",
            tutorials: "/#tutorials"
        };
    e.s(["Navbar", 0, function() {
        let e = function(e) {
            let [t, o] = (0, a.useState)(null);
            return ((0, a.useEffect)(() => {
                if ("/" !== e) return;
                let t = Object.keys(c).map(e => document.getElementById(e)).filter(e => null !== e);
                if (0 === t.length) return;
                let a = new IntersectionObserver(e => {
                    for (let t of e)
                        if (t.isIntersecting) return void o(t.target.id);
                    o(null)
                }, {
                    rootMargin: "-96px 0px -70% 0px",
                    threshold: 0
                });
                return t.forEach(e => a.observe(e)), () => a.disconnect()
            }, [e]), "/" !== e) ? e : t ? c[t] : "/"
        }((0, i.usePathname)());
        return (0, t.jsx)("header", {
            className: "sticky top-0 z-50 px-4 pt-4 sm:px-6",
            children: (0, t.jsxs)("div", {
                className: "mx-auto flex h-[50px] max-w-6xl items-center justify-between rounded-[6px] border-2 border-[rgba(47,51,73,0.68)] bg-[rgba(47,51,73,0.38)] backdrop-blur-md px-6 sm:px-8",
                children: [(0, t.jsx)(n.default, {
                    href: "/",
                    className: "flex items-center",
                    children: (0, t.jsx)(o.default, {
                        src: "/images/logo/loop-logo.webp",
                        alt: "Loop Stream",
                        width: 140,
                        height: 70,
                        priority: !0,
                        className: "h-8 w-auto md:h-10"
                    })
                }), (0, t.jsx)("nav", {
                    className: "hidden items-center gap-6 text-sm md:flex",
                    children: p.map(a => (0, t.jsx)(n.default, {
                        href: a.href,
                        className: (0, d.cn)("font-medium transition-colors hover:text-primary", e === a.href ? "text-primary" : "text-foreground"),
                        children: a.label
                    }, a.href))
                }), (0, t.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [(0, t.jsxs)(l.Button, {
                        render: (0, t.jsx)(n.default, {
                            href: "/dashboard"
                        }),
                        nativeButton: !1,
                        className: "hidden gap-1.5 sm:inline-flex",
                        children: [(0, t.jsx)(r.LayoutDashboard, {
                            className: "size-4"
                        }), "Dashboard"]
                    }), (0, t.jsxs)(u.Sheet, {
                        children: [(0, t.jsx)(u.SheetTrigger, {
                            render: (0, t.jsx)(l.Button, {
                                variant: "ghost",
                                size: "icon",
                                className: "md:hidden",
                                "aria-label": "Open menu"
                            }),
                            children: (0, t.jsx)(s, {
                                className: "size-5"
                            })
                        }), (0, t.jsxs)(u.SheetContent, {
                            side: "right",
                            children: [(0, t.jsx)(u.SheetHeader, {
                                children: (0, t.jsx)(u.SheetTitle, {
                                    children: "Loop Stream"
                                })
                            }), (0, t.jsxs)("nav", {
                                className: "flex flex-col gap-4 px-4",
                                children: [p.map(a => (0, t.jsx)(n.default, {
                                    href: a.href,
                                    className: (0, d.cn)("font-medium transition-colors hover:text-primary", e === a.href ? "text-primary" : "text-foreground"),
                                    children: a.label
                                }, a.href)), (0, t.jsx)(l.Button, {
                                    render: (0, t.jsx)(n.default, {
                                        href: "/dashboard"
                                    }),
                                    nativeButton: !1,
                                    children: "Dashboard"
                                })]
                            })]
                        })]
                    })]
                })]
            })
        })
    }], 91976)
}, 72436, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(52225),
        o = e.i(75157);
    e.s(["Separator", 0, function({
        className: e,
        orientation: n = "horizontal",
        ...i
    }) {
        return (0, t.jsx)(a.Separator, {
            "data-slot": "separator",
            orientation: n,
            className: (0, o.cn)("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", e),
            ...i
        })
    }])
}, 80376, e => {
    "use strict";
    var t = e.i(43476),
        a = e.i(53753),
        o = e.i(75157),
        n = e.i(19455),
        i = e.i(60964);

    function r({ ...e
    }) {
        return (0, t.jsx)(a.Dialog.Portal, {
            "data-slot": "sheet-portal",
            ...e
        })
    }

    function s({
        className: e,
        ...n
    }) {
        return (0, t.jsx)(a.Dialog.Backdrop, {
            "data-slot": "sheet-overlay",
            className: (0, o.cn)("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", e),
            ...n
        })
    }
    e.s(["Sheet", 0, function({ ...e
    }) {
        return (0, t.jsx)(a.Dialog.Root, {
            "data-slot": "sheet",
            ...e
        })
    }, "SheetContent", 0, function({
        className: e,
        children: l,
        side: d = "right",
        showCloseButton: u = !0,
        ...p
    }) {
        return (0, t.jsxs)(r, {
            children: [(0, t.jsx)(s, {}), (0, t.jsxs)(a.Dialog.Popup, {
                "data-slot": "sheet-content",
                "data-side": d,
                className: (0, o.cn)("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", e),
                ...p,
                children: [l, u && (0, t.jsxs)(a.Dialog.Close, {
                    "data-slot": "sheet-close",
                    render: (0, t.jsx)(n.Button, {
                        variant: "ghost",
                        className: "absolute top-4 right-4",
                        size: "icon-sm"
                    }),
                    children: [(0, t.jsx)(i.XIcon, {}), (0, t.jsx)("span", {
                        className: "sr-only",
                        children: "Close"
                    })]
                })]
            })]
        })
    }, "SheetDescription", 0, function({
        className: e,
        ...n
    }) {
        return (0, t.jsx)(a.Dialog.Description, {
            "data-slot": "sheet-description",
            className: (0, o.cn)("text-sm text-muted-foreground", e),
            ...n
        })
    }, "SheetHeader", 0, function({
        className: e,
        ...a
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "sheet-header",
            className: (0, o.cn)("flex flex-col gap-1.5 p-4", e),
            ...a
        })
    }, "SheetTitle", 0, function({
        className: e,
        ...n
    }) {
        return (0, t.jsx)(a.Dialog.Title, {
            "data-slot": "sheet-title",
            className: (0, o.cn)("font-heading font-medium text-foreground", e),
            ...n
        })
    }, "SheetTrigger", 0, function({ ...e
    }) {
        return (0, t.jsx)(a.Dialog.Trigger, {
            "data-slot": "sheet-trigger",
            ...e
        })
    }])
}]);