(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 74854, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        i = e.i(15504);
    let l = i.createContext(void 0);
    e.s(["useCheckboxGroupContext", 0, function(e = !0) {
        let r = i.useContext(l);
        if (void 0 === r && !e) throw Error((0, t.default)(3));
        return r
    }])
}, 32377, 38489, 75513, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(51437),
        l = e.i(46376),
        r = e.i(8868),
        a = e.i(67865),
        n = e.i(69690),
        u = e.i(81104),
        s = e.i(84708),
        o = e.i(47778),
        d = e.i(88940),
        c = e.i(29315),
        f = e.i(56789),
        v = e.i(88015);

    function b(e = {}) {
        let {
            id: i,
            implicit: r = !1,
            controlRef: n
        } = e, {
            controlId: u,
            registerControlId: s
        } = (0, o.useLabelableContext)(), m = (0, v.useBaseUiId)(i), C = r ? u : void 0, p = (0, d.useRefWithInit)(() => Symbol("labelable-control")), g = t.useRef(!1), y = t.useRef(null != i), x = (0, a.useStableCallback)(() => {
            g.current && s !== f.NOOP && (g.current = !1, s(p.current, void 0))
        });
        return (0, l.useIsoLayoutEffect)(() => {
            let e;
            if (s !== f.NOOP) {
                if (r) {
                    let t = n ? .current;
                    e = (0, c.isElement)(t) && null != t.closest("label") ? i ? ? null : C ? ? m
                } else if (null != i) y.current = !0, e = i;
                else {
                    if (!y.current) return void x();
                    e = m
                }
                if (void 0 === e) return void x();
                g.current = !0, s(p.current, e)
            }
        }, [i, n, C, s, r, m, p, x]), t.useEffect(() => x, [x]), u ? ? m
    }
    e.s(["useLabelableId", 0, b], 38489);
    var m = e.i(75812),
        C = e.i(52245),
        p = e.i(75606),
        g = e.i(56434),
        y = e.i(47554);
    let x = t.forwardRef(function(e, d) {
        let {
            render: c,
            className: f,
            id: v,
            name: x,
            value: R,
            disabled: I = !1,
            onValueChange: E,
            defaultValue: h,
            autoFocus: F = !1,
            style: L,
            ...T
        } = e, {
            state: O,
            name: S,
            disabled: M,
            setTouched: V,
            setDirty: A,
            validityData: D,
            setFocused: P,
            setFilled: w,
            validationMode: k,
            validation: N
        } = (0, n.useFieldRootContext)(), {
            clearErrors: j
        } = (0, s.useFormContext)(), U = M || I, _ = S ? ? x, B = { ...O,
            disabled: U
        }, {
            labelId: Y
        } = (0, o.useLabelableContext)(), J = b({
            id: v
        });
        (0, l.useIsoLayoutEffect)(() => {
            let e = null != R;
            N.inputRef.current ? .value || e && "" !== R ? w(!0) : e && "" === R && w(!1)
        }, [N.inputRef, w, R]);
        let K = t.useRef(null);
        (0, l.useIsoLayoutEffect)(() => {
            F && K.current === (0, y.activeElement)((0, r.ownerDocument)(K.current)) && P(!0)
        }, [F, P]);
        let [W] = (0, i.useControlled)({
            controlled: R,
            default: h,
            name: "FieldControl",
            state: "value"
        }), G = void 0 !== R, H = G ? W : void 0, z = (0, a.useStableCallback)(() => N.inputRef.current ? .value);
        return (0, u.useRegisterFieldControl)(N.inputRef, J, H, z, !U, x), (0, C.useRenderElement)("input", e, {
            ref: [d, K],
            state: B,
            props: [{
                id: J,
                disabled: U,
                name: _,
                ref: N.inputRef,
                "aria-labelledby": Y,
                autoFocus: F,
                ...G ? {
                    value: H
                } : {
                    defaultValue: h
                },
                onChange(e) {
                    let t = e.currentTarget.value;
                    E ? .(t, (0, p.createChangeEventDetails)(g.REASONS.none, e.nativeEvent)), A(t !== D.initialValue), w("" !== t), e.nativeEvent.defaultPrevented || (j(_), N.change(t))
                },
                onFocus() {
                    P(!0)
                },
                onBlur(e) {
                    V(!0), P(!1), "onBlur" === k && N.commit(e.currentTarget.value)
                },
                onKeyDown(e) {
                    "INPUT" === e.currentTarget.tagName && "Enter" === e.key && (V(!0), N.commit(e.currentTarget.value))
                }
            }, T, e => N.getValidationProps(U, e)],
            stateAttributesMapping: m.fieldValidityMapping
        })
    });
    e.s(["FieldControl", 0, x], 32377);
    var R = e.i(68815),
        I = e.i(23910),
        E = e.i(43476);
    e.s(["FieldValidity", 0, function(e) {
        let {
            children: i
        } = e, {
            validityData: l,
            invalid: r
        } = (0, n.useFieldRootContext)(!1), a = t.useMemo(() => (0, R.getCombinedFieldValidityData)(l, r), [l, r]), u = !1 === a.state.valid, {
            transitionStatus: s
        } = (0, I.useTransitionStatus)(u), o = t.useMemo(() => ({ ...a,
            validity: a.state,
            transitionStatus: s
        }), [a, s]);
        return (0, E.jsx)(t.Fragment, {
            children: i(o)
        })
    }], 75513)
}, 66432, e => {
    "use strict";
    e.s([])
}, 57153, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504);
    let i = t.createContext({
        disabled: !1
    });
    e.s(["FieldItemContext", 0, i, "useFieldItemContext", 0, function() {
        return t.useContext(i)
    }])
}, 45574, 35718, 10148, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(69690),
        l = e.i(75812),
        r = e.i(52245),
        a = e.i(47778),
        n = e.i(97886),
        u = e.i(57153);
    let s = t.forwardRef(function(e, s) {
        let {
            render: o,
            className: d,
            style: c,
            id: f,
            nativeLabel: v = !0,
            ...b
        } = e, m = (0, i.useFieldRootContext)(!1), C = (0, u.useFieldItemContext)(), {
            labelId: p
        } = (0, a.useLabelableContext)(), g = { ...m.state,
            disabled: m.disabled || C.disabled
        }, y = t.useRef(null), x = (0, n.useLabel)({
            id: p ? ? f,
            native: v
        });
        return (0, r.useRenderElement)("label", e, {
            ref: [s, y],
            state: g,
            props: [x, b],
            stateAttributesMapping: l.fieldValidityMapping
        })
    });
    e.s(["FieldLabel", 0, s], 45574);
    var o = e.i(46376),
        d = e.i(84708),
        c = e.i(88015),
        f = e.i(37584),
        v = e.i(9407),
        b = e.i(23910),
        m = e.i(43476);
    let C = { ...l.fieldValidityMapping,
            ...v.transitionStatusMapping
        },
        p = t.forwardRef(function(e, l) {
            let {
                render: n,
                id: u,
                className: s,
                match: v,
                style: p,
                ...g
            } = e, y = (0, c.useBaseUiId)(u), {
                validityData: x,
                state: R,
                name: I
            } = (0, i.useFieldRootContext)(!1), {
                setMessageIds: E
            } = (0, a.useLabelableContext)(), {
                errors: h
            } = (0, d.useFormContext)(), F = I && Object.hasOwn(h, I) ? h[I] : null, L = !!(Array.isArray(F) ? F.length : F), T = "string" == typeof v, O = !1;
            O = !0 === v || !R.disabled && (T ? !!x.state[v] : L || !1 === x.state.valid);
            let {
                mounted: S,
                transitionStatus: M,
                setMounted: V
            } = (0, b.useTransitionStatus)(O);
            (0, o.useIsoLayoutEffect)(() => {
                if (O && y) return E(e => e.concat(y)), () => {
                    E(e => e.filter(e => e !== y))
                }
            }, [O, y, E]);
            let A = t.useRef(null),
                [D, P] = t.useState(null),
                [w, k] = t.useState(null),
                N = x.error;
            !T && L ? N = F : x.errors.length > 1 && (N = x.errors);
            let j = N ? ? "";
            Array.isArray(N) && (j = N.length > 1 ? (0, m.jsx)("ul", {
                children: N.map(e => (0, m.jsx)("li", {
                    children: e
                }, e))
            }) : N[0] ? ? "");
            let U = Array.isArray(N) ? JSON.stringify(N) : N;
            O && U !== w && (k(U), P(j)), (0, f.useOpenChangeComplete)({
                open: O,
                ref: A,
                onComplete() {
                    O || V(!1)
                }
            });
            let _ = { ...R,
                    transitionStatus: M
                },
                B = (0, r.useRenderElement)("div", e, {
                    ref: [l, A],
                    state: _,
                    props: [{
                        id: y,
                        children: O ? j : D
                    }, g],
                    stateAttributesMapping: C,
                    enabled: S
                });
            return S ? B : null
        });
    e.s(["FieldError", 0, p], 35718);
    let g = t.forwardRef(function(e, t) {
        let {
            render: n,
            id: s,
            className: d,
            style: f,
            ...v
        } = e, b = (0, c.useBaseUiId)(s), m = (0, i.useFieldRootContext)(!1), C = (0, u.useFieldItemContext)(), {
            setMessageIds: p
        } = (0, a.useLabelableContext)(), g = { ...m.state,
            disabled: m.disabled || C.disabled
        };
        return (0, o.useIsoLayoutEffect)(() => {
            if (b) return p(e => e.concat(b)), () => {
                p(e => e.filter(e => e !== b))
            }
        }, [b, p]), (0, r.useRenderElement)("p", e, {
            ref: t,
            state: g,
            props: [{
                id: b
            }, v],
            stateAttributesMapping: l.fieldValidityMapping
        })
    });
    e.s(["FieldDescription", 0, g], 10148)
}, 32013, 66493, 68815, 97886, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(46376),
        l = e.i(67865),
        r = e.i(69690),
        a = e.i(75812),
        n = e.i(87068),
        u = e.i(84708),
        s = e.i(88940),
        o = e.i(88015),
        d = e.i(47778),
        c = e.i(43476);
    let f = function(e) {
        let i = (0, o.useBaseUiId)(),
            r = void 0 === e.controlId ? i : e.controlId,
            [a, n] = t.useState(r),
            [u, f] = t.useState(e.labelId),
            [v, b] = t.useState([]),
            m = (0, s.useRefWithInit)(() => new Map),
            {
                messageIds: C
            } = (0, d.useLabelableContext)(),
            p = (0, l.useStableCallback)((e, t) => {
                let i = m.current;
                void 0 === t ? i.delete(e) : (i.set(e, t), n(e => {
                    let t;
                    if (0 !== i.size) {
                        for (let l of i.values()) {
                            if (void 0 !== e && l === e) return e;
                            void 0 === t && (t = l)
                        }
                        return t
                    }
                }))
            }),
            g = t.useCallback(e => {
                let t = e["aria-describedby"] ? e["aria-describedby"].split(" ") : [];
                return t.push(...C, ...v), { ...e,
                    "aria-describedby": Array.from(new Set(t)).join(" ") || void 0
                }
            }, [C, v]),
            y = t.useMemo(() => ({
                controlId: a,
                registerControlId: p,
                labelId: u,
                setLabelId: f,
                messageIds: v,
                setMessageIds: b,
                getDescriptionProps: g
            }), [a, p, u, f, v, b, g]);
        return (0, c.jsx)(d.LabelableContext.Provider, {
            value: y,
            children: e.children
        })
    };
    e.s(["LabelableProvider", 0, f], 66493);
    var v = e.i(52245),
        b = e.i(56789),
        m = e.i(39957),
        C = e.i(76782);

    function p(e, t) {
        return { ...e,
            state: { ...e.state,
                valid: !t && e.state.valid
            }
        }
    }
    e.s(["getCombinedFieldValidityData", 0, p], 68815);
    let g = Object.keys(a.DEFAULT_VALIDITY_STATE);

    function y(e, t) {
        let i = !1;
        for (let l of t) l.setCustomValidity(""), i || = l === e;
        i || e.setCustomValidity("")
    }
    let x = t.forwardRef(function(e, o) {
            let {
                errors: f,
                validationMode: x,
                submitAttemptedRef: R
            } = (0, u.useFormContext)(), {
                render: I,
                className: E,
                validate: h,
                validationDebounceTime: F = 0,
                validationMode: L = x,
                name: T,
                disabled: O = !1,
                invalid: S,
                dirty: M,
                touched: V,
                actionsRef: A,
                style: D,
                ...P
            } = e, w = (0, n.useFieldsetRootContext)(!0) ? .disabled, k = (0, l.useStableCallback)(h || (() => null)), N = w || O, [j, U] = t.useState(!1), [_, B] = t.useState(!1), [Y, J] = t.useState(!1), [K, W] = t.useState(!1), G = M ? ? _, H = V ? ? j, z = t.useRef(G), q = t.useRef(void 0), [Q, X] = t.useState(), Z = T ? ? Q;
            (0, i.useIsoLayoutEffect)(() => {
                void 0 !== M && (z.current = M)
            }, [M]);
            let $ = t.useCallback(() => q.current, []),
                ee = t.useCallback(e => {
                    q.current = e
                }, []),
                et = (0, l.useStableCallback)(e => {
                    void 0 === M && (e && (z.current = !0), B(e))
                }),
                ei = (0, l.useStableCallback)(e => {
                    void 0 === V && U(e)
                }),
                el = (0, l.useStableCallback)(() => "onChange" === L || "onSubmit" === L && R.current),
                er = Z && Object.hasOwn(f, Z) ? f[Z] : null,
                ea = !!(Array.isArray(er) ? er.length : er),
                en = !0 === S || ea,
                [eu, es] = t.useState({
                    state: a.DEFAULT_VALIDITY_STATE,
                    error: "",
                    errors: [],
                    value: null,
                    initialValue: null
                }),
                eo = N ? null : !en && eu.state.valid,
                ed = t.useMemo(() => ({
                    disabled: N,
                    touched: H,
                    dirty: G,
                    valid: eo,
                    filled: Y,
                    focused: K
                }), [N, H, G, eo, Y, K]),
                ec = function(e) {
                    let {
                        formRef: i
                    } = (0, u.useFormContext)(), {
                        setValidityData: r,
                        validate: n,
                        validityData: o,
                        validationDebounceTime: c,
                        invalid: f,
                        markedDirtyRef: v,
                        state: x,
                        shouldValidateOnChange: R,
                        getRegisteredFieldId: I
                    } = e, {
                        controlId: E,
                        getDescriptionProps: h
                    } = (0, d.useLabelableContext)(), F = (0, m.useTimeout)(), L = t.useRef(null), T = (0, s.useRefWithInit)(() => new Set).current, O = t.useRef(0), S = t.useCallback(e => {
                        if (e) return T.add(e), () => {
                            T.delete(e)
                        }
                    }, [T]), M = (0, l.useStableCallback)(async (e, t = !1) => {
                        let l, u = function(e) {
                            let t = null;
                            for (let i of e)
                                if (!i.disabled) {
                                    if (!i.validity.valid) return i;
                                    t ? ? = i
                                }
                            return t
                        }(T) ? ? L.current;
                        if (!u) return;
                        O.current += 1;
                        let s = O.current;

                        function d(e, t = f) {
                            let l = I() ? ? E;
                            if (null == l) return;
                            let r = i.current.fields.get(l);
                            if (!r) return;
                            let a = p(e, t);
                            i.current.fields.set(l, { ...r,
                                validityData: a
                            })
                        }
                        if (t) {
                            if (!1 !== x.valid) return;
                            let t = u.validity;
                            if (!t.valueMissing) {
                                let t = {
                                    value: e,
                                    state: { ...a.DEFAULT_VALIDITY_STATE,
                                        valid: !0
                                    },
                                    error: "",
                                    errors: [],
                                    initialValue: o.initialValue
                                };
                                y(u, T), d(t, !1), r(t);
                                return
                            }
                            let i = g.reduce((e, i) => (e[i] = t[i], e), {});
                            if (!i.valid && ! function(e) {
                                    if (!e || e.valid || !e.valueMissing) return !1;
                                    let t = !1;
                                    for (let i of g) "valid" !== i && ("valueMissing" === i ? t = e[i] : e[i] && (t = !1));
                                    return t
                                }(i)) return
                        }
                        F.clear();
                        let c = null,
                            b = [],
                            m = function(e) {
                                let t = g.reduce((t, i) => (t[i] = e.validity[i], t), {}),
                                    i = !1;
                                for (let e of g)
                                    if ("valid" !== e) {
                                        if ("valueMissing" === e && t[e]) i = !0;
                                        else if (t[e]) return t
                                    }
                                return i && !v.current && (t.valid = !0, t.valueMissing = !1), t
                            }(u),
                            C = R();
                        if (u.validationMessage && !C) l = u.validationMessage, b = [u.validationMessage];
                        else {
                            let t = n(e, Array.from(i.current.fields.values()).reduce((e, t) => (t.name && (e[t.name] = t.getValue()), e), {}));
                            if ("object" == typeof t && null !== t && "then" in t) {
                                if (c = await t, s !== O.current) return
                            } else c = t;
                            null !== c ? (m.valid = !1, m.customError = !0, Array.isArray(c) ? (b = c, u.setCustomValidity(c.join("\n"))) : c && (b = [c], u.setCustomValidity(c))) : C && (y(u, T), m.customError = !1, u.validationMessage ? (l = u.validationMessage, b = [u.validationMessage]) : u.validity.valid && !m.valid && (m.valid = !0))
                        }
                        let h = {
                            value: e,
                            state: m,
                            error: l ? ? (Array.isArray(c) ? c[0] : c ? ? ""),
                            errors: b,
                            initialValue: o.initialValue
                        };
                        d(h), r(h)
                    }), V = (0, l.useStableCallback)(e => {
                        F.clear();
                        let t = R();
                        t && "" !== e && c ? (O.current += 1, F.start(c, () => {
                            M(e)
                        })) : M(e, !t)
                    }), A = t.useCallback((e, t = {}) => (0, C.mergeProps)(h(t), !1 !== x.valid || x.disabled || e ? b.EMPTY_OBJECT : {
                        "aria-invalid": !0
                    }), [h, x.disabled, x.valid]);
                    return t.useMemo(() => ({
                        getValidationProps: A,
                        inputRef: L,
                        registerInput: S,
                        commit: M,
                        change: V
                    }), [A, S, M, V])
                }({
                    setValidityData: es,
                    validate: k,
                    validityData: eu,
                    validationDebounceTime: F,
                    invalid: en,
                    markedDirtyRef: z,
                    state: ed,
                    shouldValidateOnChange: el,
                    getRegisteredFieldId: $
                }),
                [ef, ev] = function(e) {
                    let {
                        commit: r,
                        invalid: a,
                        markedDirtyRef: n,
                        name: s,
                        setRegisteredFieldName: o,
                        setRegisteredFieldId: d,
                        setValidityData: c,
                        validityData: f
                    } = e, {
                        formRef: v
                    } = (0, u.useFormContext)(), b = t.useRef(null), m = t.useRef(null), C = t.useRef(null), g = (0, l.useStableCallback)(() => {
                        let e = m.current;
                        if (e) return e.getValue ? e.getValue() : e.value
                    });

                    function y(e) {
                        return void 0 === e.value ? g() : e.value
                    }
                    let x = (0, l.useStableCallback)(() => {
                        let e = m.current;
                        (n.current = !0, e) ? r(y(e)): r(f.value)
                    });

                    function R(e = m.current ? .id) {
                        e && v.current.fields.delete(e)
                    }(0, i.useIsoLayoutEffect)(() => {
                        let e = m.current;
                        e && e.id && (o(s ? void 0 : e.name), v.current.fields.set(e.id, {
                            getValue: g,
                            name: s ? ? e.name,
                            controlRef: e.controlRef ? ? C,
                            validityData: p(f, a),
                            validate: x
                        }))
                    }, [v, g, a, s, o, x, f]), (0, i.useIsoLayoutEffect)(() => {
                        let e = v.current.fields;
                        return () => {
                            let t = m.current ? .id;
                            t && e.delete(t)
                        }
                    }, [v]);
                    let I = (0, l.useStableCallback)((e, t) => {
                        let i;
                        if (!t) {
                            b.current === e && (b.current = null, R(), m.current = null, o(void 0), d(void 0));
                            return
                        }
                        let l = m.current ? .id;
                        b.current = e, m.current = t, s || o(t.name), d(t.id), l && l !== t.id && R(l),
                            function() {
                                let e = m.current;
                                if (!e) return;
                                let t = y(e);
                                null === f.initialValue && null !== t && c(e => ({ ...e,
                                    initialValue: t
                                }))
                            }(), (i = m.current) && i.id && v.current.fields.set(i.id, {
                                getValue: g,
                                name: s ? ? i.name,
                                controlRef: i.controlRef ? ? C,
                                validityData: p(f, a),
                                validate: x
                            })
                    });
                    return [x, I]
                }({
                    commit: ec.commit,
                    invalid: en,
                    markedDirtyRef: z,
                    name: T,
                    setRegisteredFieldName: X,
                    setRegisteredFieldId: ee,
                    setValidityData: es,
                    validityData: eu
                });
            t.useImperativeHandle(A, () => ({
                validate: ef
            }), [ef]);
            let eb = t.useMemo(() => ({
                    invalid: en,
                    name: Z,
                    validityData: eu,
                    setValidityData: es,
                    disabled: N,
                    touched: H,
                    setTouched: ei,
                    dirty: G,
                    setDirty: et,
                    filled: Y,
                    setFilled: J,
                    focused: K,
                    setFocused: W,
                    validate: k,
                    validationMode: L,
                    validationDebounceTime: F,
                    shouldValidateOnChange: el,
                    state: ed,
                    markedDirtyRef: z,
                    registerFieldControl: ev,
                    validation: ec
                }), [en, Z, eu, N, H, ei, G, et, Y, J, K, W, k, L, F, el, ed, ev, ec]),
                em = (0, v.useRenderElement)("div", e, {
                    ref: o,
                    state: ed,
                    props: P,
                    stateAttributesMapping: a.fieldValidityMapping
                });
            return (0, c.jsx)(r.FieldRootContext.Provider, {
                value: eb,
                children: em
            })
        }),
        R = t.forwardRef(function(e, t) {
            return (0, c.jsx)(f, {
                children: (0, c.jsx)(x, { ...e,
                    ref: t
                })
            })
        });
    e.s(["FieldRoot", 0, R], 32013);
    var I = e.i(29315),
        E = e.i(8868),
        h = e.i(47554),
        F = e.i(57337);
    e.s(["useLabel", 0, function(e = {}) {
        let {
            id: t,
            fallbackControlId: i,
            native: r = !1,
            setLabelId: a,
            focusControl: n
        } = e, {
            controlId: u,
            setLabelId: s
        } = (0, d.useLabelableContext)(), o = (0, l.useStableCallback)(e => {
            s(e), a ? .(e)
        }), c = (0, F.useRegisteredLabelId)(t, o), f = u ? ? i;

        function v(e) {
            let t = (0, h.getTarget)(e.nativeEvent);
            t ? .closest("button,input,select,textarea") || (!e.defaultPrevented && e.detail > 1 && e.preventDefault(), r || function(e) {
                if (n) return n(e, f);
                if (!f) return;
                let t = (0, E.ownerDocument)(e.currentTarget).getElementById(f);
                (0, I.isHTMLElement)(t) && t.focus({
                    focusVisible: !0
                })
            }(e))
        }
        return r ? {
            id: c,
            htmlFor: f ? ? void 0,
            onMouseDown: v
        } : {
            id: c,
            onClick: v,
            onPointerDown(e) {
                e.preventDefault()
            }
        }
    }], 97886)
}, 87068, e => {
    "use strict";
    e.i(47167);
    var t = e.i(33332),
        i = e.i(15504);
    let l = i.createContext(void 0);
    e.s(["useFieldsetRootContext", 0, function(e = !1) {
        let r = i.useContext(l);
        if (!r && !e) throw Error((0, t.default)(86));
        return r
    }])
}, 81104, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(46376),
        l = e.i(69690);
    e.s(["useRegisterFieldControl", 0, function(e, r, a, n, u = !0, s) {
        let {
            registerFieldControl: o
        } = (0, l.useFieldRootContext)(), d = t.useRef(null);
        d.current || (d.current = Symbol()), (0, i.useIsoLayoutEffect)(() => {
            let t = d.current;
            if (t && u) return o(t, {
                controlRef: e,
                getValue: n,
                id: r,
                name: s,
                value: a
            }), () => {
                o(t, void 0)
            }
        }, [e, u, n, r, s, o, a])
    }])
}, 69690, 75812, e => {
    "use strict";
    var t, i = e.i(33332),
        l = e.i(15504),
        r = e.i(56789);
    let a = ((t = {}).disabled = "data-disabled", t.valid = "data-valid", t.invalid = "data-invalid", t.touched = "data-touched", t.dirty = "data-dirty", t.filled = "data-filled", t.focused = "data-focused", t),
        n = {
            badInput: !1,
            customError: !1,
            patternMismatch: !1,
            rangeOverflow: !1,
            rangeUnderflow: !1,
            stepMismatch: !1,
            tooLong: !1,
            tooShort: !1,
            typeMismatch: !1,
            valid: null,
            valueMissing: !1
        },
        u = {
            valid: null,
            touched: !1,
            dirty: !1,
            filled: !1,
            focused: !1
        },
        s = {
            disabled: !1,
            ...u
        };
    e.s(["DEFAULT_FIELD_ROOT_STATE", 0, s, "DEFAULT_FIELD_STATE_ATTRIBUTES", 0, u, "DEFAULT_VALIDITY_STATE", 0, n, "fieldValidityMapping", 0, {
        valid: e => null === e ? null : e ? {
            [a.valid]: ""
        } : {
            [a.invalid]: ""
        }
    }], 75812);
    let o = {
            invalid: void 0,
            name: void 0,
            validityData: {
                state: n,
                errors: [],
                error: "",
                value: "",
                initialValue: null
            },
            setValidityData: r.NOOP,
            disabled: void 0,
            touched: u.touched,
            setTouched: r.NOOP,
            dirty: u.dirty,
            setDirty: r.NOOP,
            filled: u.filled,
            setFilled: r.NOOP,
            focused: u.focused,
            setFocused: r.NOOP,
            validate: () => null,
            validationMode: "onSubmit",
            validationDebounceTime: 0,
            shouldValidateOnChange: () => !1,
            state: s,
            markedDirtyRef: {
                current: !1
            },
            registerFieldControl: r.NOOP,
            validation: {
                getValidationProps: (e, t = r.EMPTY_OBJECT) => t,
                inputRef: {
                    current: null
                },
                registerInput: r.NOOP,
                commit: async () => {},
                change: r.NOOP
            }
        },
        d = l.createContext(o);
    e.s(["FieldRootContext", 0, d, "useFieldRootContext", 0, function(e = !0) {
        let t = l.useContext(d);
        if (t.setValidityData === r.NOOP && !e) throw Error((0, i.default)(28));
        return t
    }], 69690)
}, 84708, 47778, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(56789);
    let l = t.createContext({
        formRef: {
            current: {
                fields: new Map
            }
        },
        errors: {},
        clearErrors: i.NOOP,
        validationMode: "onSubmit",
        submitAttemptedRef: {
            current: !1
        }
    });
    e.s(["useFormContext", 0, function() {
        return t.useContext(l)
    }], 84708);
    let r = t.createContext({
        controlId: void 0,
        registerControlId: i.NOOP,
        labelId: void 0,
        setLabelId: i.NOOP,
        messageIds: [],
        setMessageIds: i.NOOP,
        getDescriptionProps: e => e
    });
    e.s(["LabelableContext", 0, r, "useLabelableContext", 0, function() {
        return t.useContext(r)
    }], 47778)
}, 57337, e => {
    "use strict";
    var t = e.i(46376),
        i = e.i(88015);
    e.s(["useRegisteredLabelId", 0, function(e, l) {
        let r = (0, i.useBaseUiId)(e);
        return (0, t.useIsoLayoutEffect)(() => (l(r), () => {
            l(void 0)
        }), [r, l]), r
    }])
}, 93479, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(15504);
    e.i(66432);
    var l = e.i(32013),
        r = e.i(45574),
        a = e.i(35718),
        n = e.i(10148),
        u = e.i(32377),
        s = e.i(75513),
        o = e.i(69690),
        d = e.i(75812),
        c = e.i(52245),
        f = e.i(57153),
        v = e.i(66493),
        b = e.i(74854);
    let m = i.forwardRef(function(e, l) {
        let {
            render: r,
            className: a,
            style: n,
            disabled: u = !1,
            ...s
        } = e, {
            state: m,
            disabled: C
        } = (0, o.useFieldRootContext)(!1), p = C || u, g = { ...m,
            disabled: p
        }, y = (0, b.useCheckboxGroupContext)(), x = y ? .allValues !== void 0 ? y ? .parent.id : void 0, R = i.useMemo(() => ({
            disabled: p
        }), [p]), I = (0, c.useRenderElement)("div", e, {
            ref: l,
            state: g,
            props: s,
            stateAttributesMapping: d.fieldValidityMapping
        });
        return (0, t.jsx)(v.LabelableProvider, {
            controlId: x,
            children: (0, t.jsx)(f.FieldItemContext.Provider, {
                value: R,
                children: I
            })
        })
    });
    e.s(["Control", () => u.FieldControl, "Description", () => n.FieldDescription, "Error", () => a.FieldError, "Item", 0, m, "Label", () => r.FieldLabel, "Root", () => l.FieldRoot, "Validity", () => s.FieldValidity], 5359);
    var C = e.i(5359),
        C = C;
    let p = i.forwardRef(function(e, i) {
        return (0, t.jsx)(C.Control, {
            ref: i,
            ...e
        })
    });
    var g = e.i(75157);
    e.s(["Input", 0, function({
        className: e,
        type: i,
        ...l
    }) {
        return (0, t.jsx)(p, {
            type: i,
            "data-slot": "input",
            className: (0, g.cn)("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", e),
            ...l
        })
    }], 93479)
}]);