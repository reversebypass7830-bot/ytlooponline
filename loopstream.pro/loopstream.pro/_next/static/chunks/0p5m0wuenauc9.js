(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 75980, 53145, 81307, 42450, e => {
    "use strict";
    e.s(["ZodAny", () => sq, "ZodArray", () => s3, "ZodBase64", () => sg, "ZodBase64URL", () => s$, "ZodBigInt", () => sL, "ZodBigIntFormat", () => sR, "ZodBoolean", () => sT, "ZodCIDRv4", () => sm, "ZodCIDRv6", () => sp, "ZodCUID", () => u3, "ZodCUID2", () => u5, "ZodCatch", () => lW, "ZodCodec", () => lH, "ZodCustom", () => dt, "ZodCustomStringFormat", () => sI, "ZodDate", () => s2, "ZodDefault", () => lT, "ZodDiscriminatedUnion", () => lu, "ZodE164", () => s_, "ZodEmail", () => uM, "ZodEmoji", () => u6, "ZodEnum", () => lb, "ZodExactOptional", () => lj, "ZodFile", () => lw, "ZodFunction", () => l8, "ZodGUID", () => uB, "ZodIPv4", () => so, "ZodIPv6", () => sd, "ZodIntersection", () => ll, "ZodJWT", () => sx, "ZodKSUID", () => sn, "ZodLazy", () => l9, "ZodLiteral", () => lI, "ZodMAC", () => ss, "ZodMap", () => lh, "ZodNaN", () => lG, "ZodNanoID", () => u2, "ZodNever", () => s0, "ZodNonOptional", () => lR, "ZodNull", () => sK, "ZodNullable", () => lP, "ZodNumber", () => sU, "ZodNumberFormat", () => sD, "ZodObject", () => s8, "ZodOptional", () => lO, "ZodPipe", () => lX, "ZodPrefault", () => lL, "ZodPreprocess", () => l0, "ZodPromise", () => l7, "ZodReadonly", () => l4, "ZodRecord", () => lf, "ZodSet", () => ly, "ZodString", () => uR, "ZodStringFormat", () => uJ, "ZodSuccess", () => lJ, "ZodSymbol", () => sM, "ZodTemplateLiteral", () => l1, "ZodTransform", () => lZ, "ZodTuple", () => lc, "ZodType", () => uL, "ZodULID", () => se, "ZodURL", () => uQ, "ZodUUID", () => uK, "ZodUndefined", () => sB, "ZodUnion", () => lr, "ZodUnknown", () => sY, "ZodVoid", () => s6, "ZodXID", () => si, "ZodXor", () => la, "_ZodString", () => uF, "_default", () => lC, "_function", () => de, "any", () => sH, "array", () => s7, "base64", () => sh, "base64url", () => sy, "bigint", () => sF, "boolean", () => sC, "catch", () => lB, "check", () => di, "cidrv4", () => sf, "cidrv6", () => sv, "codec", () => lY, "cuid", () => u7, "cuid2", () => u8, "custom", () => dr, "date", () => s9, "describe", () => du, "discriminatedUnion", () => ls, "e164", () => sb, "email", () => uW, "emoji", () => u1, "enum", () => lx, "exactOptional", () => lN, "file", () => lz, "float32", () => sN, "float64", () => sP, "function", () => de, "guid", () => uG, "hash", () => sZ, "hex", () => sz, "hostname", () => sw, "httpUrl", () => u4, "instanceof", () => dl, "int", () => sj, "int32", () => sE, "int64", () => sV, "intersection", () => ld, "invertCodec", () => lQ, "ipv4", () => su, "ipv6", () => sc, "json", () => dc, "jwt", () => sk, "keyof", () => s5, "ksuid", () => sa, "lazy", () => l3, "literal", () => lS, "looseObject", () => li, "looseRecord", () => lg, "mac", () => sl, "map", () => l$, "meta", () => ds, "nan", () => lK, "nanoid", () => u9, "nativeEnum", () => lk, "never", () => s4, "nonoptional", () => lV, "null", () => sX, "nullable", () => lE, "nullish", () => lA, "number", () => sO, "object", () => le, "optional", () => lD, "partialRecord", () => lv, "pipe", () => lq, "prefault", () => lF, "preprocess", () => dm, "promise", () => l5, "readonly", () => l6, "record", () => lp, "refine", () => dn, "set", () => l_, "strictObject", () => lt, "string", () => uV, "stringFormat", () => sS, "stringbool", () => dd, "success", () => lM, "superRefine", () => da, "symbol", () => sW, "templateLiteral", () => l2, "transform", () => lU, "tuple", () => lm, "uint32", () => sA, "uint64", () => sJ, "ulid", () => st, "undefined", () => sG, "union", () => ln, "unknown", () => sQ, "url", () => u0, "uuid", () => uX, "uuidv4", () => uq, "uuidv6", () => uH, "uuidv7", () => uY, "void", () => s1, "xid", () => sr, "xor", () => lo], 62201), e.s(["ZodISODate", () => ug, "ZodISODateTime", () => up, "ZodISODuration", () => u_, "ZodISOTime", () => u$, "date", () => uh, "datetime", () => uv, "duration", () => ub, "time", () => uy], 49732);
    var t, i, r, n = e.i(15504),
        a = e => e instanceof Date,
        o = e => null == e;
    let u = e => "object" == typeof e;
    var s = e => !o(e) && !Array.isArray(e) && u(e) && !a(e),
        l = e => s(e) && e.target ? "checkbox" === e.target.type ? e.target.checked : e.target.value : e,
        d = (e, t) => t.split(".").some((t, i, r) => !isNaN(Number(t)) && e.has(r.slice(0, i).join("."))),
        c = e => {
            let t = e.constructor && e.constructor.prototype;
            return s(t) && t.hasOwnProperty("isPrototypeOf")
        },
        m = "u" > typeof window && void 0 !== window.HTMLElement && "u" > typeof document;

    function f(e) {
        if (e instanceof Date) return new Date(e);
        let t = "u" > typeof FileList && e instanceof FileList;
        if (m && (e instanceof Blob || t)) return e;
        let i = Array.isArray(e);
        if (!i && !(s(e) && c(e))) return e;
        let r = i ? [] : Object.create(Object.getPrototypeOf(e));
        for (let t in e) Object.prototype.hasOwnProperty.call(e, t) && (r[t] = f(e[t]));
        return r
    }
    let p = "blur",
        v = "trigger",
        g = "onChange",
        h = "onSubmit",
        $ = "maxLength",
        y = "minLength",
        _ = "pattern",
        b = "required",
        x = "validate",
        k = "root",
        I = ["__proto__", "constructor", "prototype"],
        S = /^\w*$/;
    var w = e => void 0 === e;
    let z = /[.[\]'"]/;
    var Z = e => e.split(z).filter(Boolean),
        U = (e, t, i) => {
            if (!t || !s(e)) return i;
            let r = S.test(t) ? [t] : Z(t);
            if (r.some(e => I.includes(e))) return i;
            let n = r.reduce((e, t) => o(e) ? void 0 : e[t], e);
            return w(n) || n === e ? w(e[t]) ? i : e[t] : n
        },
        O = e => "function" == typeof e,
        D = (e, t, i) => {
            let r = -1,
                n = S.test(t) ? [t] : Z(t),
                a = n.length,
                o = a - 1;
            for (; ++r < a;) {
                let t = n[r],
                    a = i;
                if (r !== o) {
                    let i = e[t];
                    a = s(i) || Array.isArray(i) ? i : isNaN(+n[r + 1]) ? {} : []
                }
                if (I.includes(t)) return;
                e[t] = a, e = e[t]
            }
        };
    let j = n.default.createContext(null);
    j.displayName = "HookFormControlContext";
    var N = (e, t, i, r = !0) => {
        let n = {};
        for (let a in e) Object.defineProperty(n, a, {
            get: () => ("all" !== t._proxyFormState[a] && (t._proxyFormState[a] = !r || "all"), i && (i[a] = !0), e[a])
        });
        return n
    };
    let P = m ? n.default.useLayoutEffect : n.default.useEffect;
    var E = e => "string" == typeof e,
        A = (e, t, i, r, n) => E(e) ? (r && t.watch.add(e), U(i, e, n)) : Array.isArray(e) ? e.map(e => (r && t.watch.add(e), U(i, e))) : (r && (t.watchAll = !0), i),
        T = e => o(e) || !u(e);
    let C = (e, t) => 0 === t.length && !Array.isArray(e) && !c(e);

    function L(e, t, i = new WeakMap) {
        if (e === t) return !0;
        if (T(e) || T(t)) return Object.is(e, t);
        if (a(e) && a(t)) return Object.is(e.getTime(), t.getTime());
        let r = Object.keys(e),
            n = Object.keys(t);
        if (r.length !== n.length) return !1;
        if (C(e, r) || C(t, n)) return Object.is(e, t);
        if (!r.length && Array.isArray(e) !== Array.isArray(t)) return !1;
        let o = i.get(e);
        if (o && o.has(t)) return !0;
        if (o) o.add(t);
        else {
            let r = new WeakSet;
            r.add(t), i.set(e, r)
        }
        for (let n of r) {
            let r = e[n];
            if (!(n in t)) return !1;
            if ("ref" !== n) {
                let e = t[n];
                if (a(r) && a(e) || (s(r) || Array.isArray(r)) && (s(e) || Array.isArray(e)) ? !L(r, e, i) : !Object.is(r, e)) return !1
            }
        }
        return !0
    }
    let F = e => {
        let t = {};
        for (let i of Object.keys(e))
            if (u(e[i]) && null !== e[i] && !a(e[i])) {
                let r = F(e[i]);
                for (let e of Object.keys(r)) t[`${i}.${e}`] = r[e]
            } else t[i] = e[i];
        return t
    };
    n.default.createContext(null).displayName = "HookFormContext";
    var R = (e, t, i, r, n) => t ? { ...i[e],
            types: { ...i[e] && i[e].types ? i[e].types : {},
                [r]: n || !0
            }
        } : {},
        V = e => Array.isArray(e) ? e.filter(Boolean) : [],
        J = e => Array.isArray(e) ? e : [e],
        M = () => {
            let e = [];
            return {
                get observers() {
                    return e
                },
                next: t => {
                    for (let i of e) i.next && i.next(t)
                },
                subscribe: t => (e.push(t), {
                    unsubscribe: () => {
                        e = e.filter(e => e !== t)
                    }
                }),
                unsubscribe: () => {
                    e = []
                }
            }
        },
        W = e => s(e) && !Object.keys(e).length,
        B = e => {
            if (!m) return !1;
            let t = e ? e.ownerDocument : 0;
            return e instanceof(t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement)
        },
        G = e => B(e) && e.isConnected;

    function K(e, t) {
        if (E(t) && Object.prototype.hasOwnProperty.call(e, t)) return delete e[t], e;
        let i = Array.isArray(t) ? t : S.test(t) ? [t] : Z(t);
        if (i.some(e => I.includes(String(e)))) return e;
        let r = 1 === i.length ? e : function(e, t) {
                let i = t.slice(0, -1).length,
                    r = 0;
                for (; r < i;) {
                    if (o(e)) {
                        e = void 0;
                        break
                    }
                    e = e[t[r]], r++
                }
                return e
            }(e, i),
            n = i.length - 1,
            a = i[n];
        return r && delete r[a], 0 !== n && (s(r) && W(r) || Array.isArray(r) && function(e) {
            for (let t in e)
                if (e.hasOwnProperty(t) && !w(e[t])) return !1;
            return !0
        }(r)) && K(e, i.slice(0, -1)), e
    }

    function X(e) {
        return Array.isArray(e) || s(e) && !(e => {
            for (let t in e)
                if (O(e[t])) return !0;
            return !1
        })(e)
    }

    function q(e, t = {}) {
        for (let i in e) {
            let r = e[i];
            X(r) ? (t[i] = Array.isArray(r) ? [] : {}, q(r, t[i])) : w(r) || (t[i] = !0)
        }
        return t
    }

    function H(e, t, i) {
        for (let r in i || (i = q(t)), e) {
            let n = e[r];
            if (X(n)) w(t) || T(i[r]) ? i[r] = q(n, Array.isArray(n) ? [] : {}) : H(n, o(t) ? {} : t[r], i[r]);
            else {
                let e = t[r];
                i[r] = !L(n, e)
            }
        }
        return function e(t) {
            if (!1 !== t) {
                if (!0 === t) return !0;
                if (Array.isArray(t)) {
                    let i = t.map(t => e(t));
                    return i.some(e => void 0 !== e) ? i : void 0
                }
                if (s(t)) {
                    let i = {};
                    for (let r in t) {
                        let n = e(t[r]);
                        w(n) || (i[r] = n)
                    }
                    return Object.keys(i).length ? i : void 0
                }
            }
        }(i) || {}
    }
    let Y = {
            value: !1,
            isValid: !1
        },
        Q = {
            value: !0,
            isValid: !0
        };
    var ee = e => {
            if (Array.isArray(e)) {
                if (e.length > 1) {
                    let t = e.filter(e => e && e.checked && !e.disabled).map(e => e.value);
                    return {
                        value: t,
                        isValid: !!t.length
                    }
                }
                return e[0].checked && !e[0].disabled ? e[0].attributes && !w(e[0].attributes.value) ? w(e[0].value) || "" === e[0].value ? Q : {
                    value: e[0].value,
                    isValid: !0
                } : Q : Y
            }
            return Y
        },
        et = (e, {
            valueAsNumber: t,
            valueAsDate: i,
            setValueAs: r
        }) => w(e) ? e : t ? "" === e ? NaN : e ? +e : e : i && E(e) ? new Date(e) : r ? r(e) : e;
    let ei = {
        isValid: !1,
        value: null
    };
    var er = e => Array.isArray(e) ? e.reduce((e, t) => t && t.checked && !t.disabled ? {
        isValid: !0,
        value: t.value
    } : e, ei) : ei;

    function en(e) {
        let t = e.ref;
        return "file" === t.type ? t.files : "radio" === t.type ? er(e.refs).value : "select-multiple" === t.type ? [...t.selectedOptions].map(({
            value: e
        }) => e) : "checkbox" === t.type ? ee(e.refs).value : et(w(t.value) ? e.ref.value : t.value, e)
    }
    var ea = e => w(e) ? e : e instanceof RegExp ? e.source : s(e) ? e.value instanceof RegExp ? e.value.source : e.value : e,
        eo = e => ({
            isOnSubmit: !e || e === h,
            isOnBlur: "onBlur" === e,
            isOnChange: e === g,
            isOnAll: "all" === e,
            isOnTouch: "onTouched" === e
        });
    let eu = "AsyncFunction";
    var es = e => {
            if (!e || !e.validate) return !1;
            if (O(e.validate)) return e.validate.constructor.name === eu;
            if (s(e.validate)) {
                for (let t in e.validate)
                    if (e.validate[t].constructor.name === eu) return !0
            }
            return !1
        },
        el = (e, t, i) => {
            if (i) return !1;
            if (t.watchAll || t.watch.has(e)) return !0;
            for (let i of t.watch)
                if (e.startsWith(i) && "." === e.charAt(i.length)) return !0;
            return !1
        };
    let ed = (e, t, i, r) => {
        for (let n of i || Object.keys(e)) {
            let i = U(e, n);
            if (i) {
                let {
                    _f: e,
                    ...a
                } = i;
                if (e) {
                    if (e.refs && e.refs[0] && t(e.refs[0], n) && !r) return !0;
                    else if (e.ref && t(e.ref, e.name) && !r) return !0;
                    else if (ed(a, t)) break
                } else if (s(a) && ed(a, t)) break
            }
        }
    };

    function ec(e, t, i) {
        let r = U(e, i);
        if (r || S.test(i)) return {
            error: r,
            name: i
        };
        let n = i.split(".");
        for (; n.length;) {
            let r = n.join("."),
                a = U(t, r),
                o = U(e, r);
            if (a && !Array.isArray(a) && i !== r) break;
            if (o && o.type) return {
                name: r,
                error: o
            };
            if (o && o.root && o.root.type) return {
                name: `${r}.root`,
                error: o.root
            };
            n.pop()
        }
        return {
            name: i
        }
    }
    var em = (e, t, i) => {
        let r = U(e, i),
            n = Array.isArray(r) ? r : [];
        return D(n, k, t[i]), D(e, i, n), e
    };

    function ef(e, t, i = "validate") {
        if (E(e) || Array.isArray(e) && e.every(E) || "boolean" == typeof e && !e) return {
            type: i,
            message: E(e) ? e : "",
            ref: t
        }
    }
    var ep = e => !s(e) || e instanceof RegExp ? {
            value: e,
            message: ""
        } : e,
        ev = async (e, t, i, r, n, a) => {
            let {
                ref: u,
                refs: l,
                required: d,
                maxLength: c,
                minLength: m,
                min: f,
                max: p,
                pattern: v,
                validate: g,
                name: h,
                valueAsNumber: k,
                mount: I
            } = e._f, S = U(i, h);
            if (!I || t.has(h)) return {};
            let z = l ? l[0] : u,
                Z = e => {
                    if (n && z.reportValidity) {
                        let t = "boolean" == typeof e ? "" : e || "";
                        l ? l.forEach(e => e.setCustomValidity(t)) : z.setCustomValidity(t), z.reportValidity()
                    }
                },
                D = {},
                j = "radio" === u.type,
                N = "checkbox" === u.type,
                P = (k || "file" === u.type) && w(u.value) && w(S) || B(u) && "" === u.value || "" === S || Array.isArray(S) && !S.length,
                A = R.bind(null, h, r, D),
                T = (e, t, i, r = $, n = y) => {
                    let a = e ? t : i;
                    D[h] = {
                        type: e ? r : n,
                        message: a,
                        ref: u,
                        ...A(e ? r : n, a)
                    }
                };
            if (a ? !Array.isArray(S) || !S.length : d && (!(j || N) && (P || o(S)) || "boolean" == typeof S && !S || N && !ee(l).isValid || j && !er(l).isValid)) {
                let {
                    value: e,
                    message: t
                } = E(d) ? {
                    value: !!d,
                    message: d
                } : ep(d);
                if (e && (D[h] = {
                        type: b,
                        message: t,
                        ref: z,
                        ...A(b, t)
                    }, !r)) return Z(t), D
            }
            if (!P && (!o(f) || !o(p))) {
                let e, t, i = ep(p),
                    n = ep(f);
                if (o(S) || isNaN(S)) {
                    let r = u.valueAsDate || new Date(S),
                        a = e => new Date(new Date().toDateString() + " " + e),
                        o = "time" == u.type,
                        s = "week" == u.type;
                    E(i.value) && S && (e = o ? a(S) > a(i.value) : s ? S > i.value : r > new Date(i.value)), E(n.value) && S && (t = o ? a(S) < a(n.value) : s ? S < n.value : r < new Date(n.value))
                } else {
                    let r = u.valueAsNumber || (S ? +S : S);
                    o(i.value) || (e = r > i.value), o(n.value) || (t = r < n.value)
                }
                if ((e || t) && (T(!!e, i.message, n.message, "max", "min"), !r)) return Z(D[h].message), D
            }
            if ((c || m) && !P && (E(S) || a && Array.isArray(S))) {
                let e = ep(c),
                    t = ep(m),
                    i = !o(e.value) && S.length > +e.value,
                    n = !o(t.value) && S.length < +t.value;
                if ((i || n) && (T(i, e.message, t.message), !r)) return Z(D[h].message), D
            }
            if (v && !P && E(S)) {
                let {
                    value: e,
                    message: t
                } = ep(v);
                if (e instanceof RegExp && !S.match(e) && (D[h] = {
                        type: _,
                        message: t,
                        ref: u,
                        ...A(_, t)
                    }, !r)) return Z(t), D
            }
            if (g) {
                if (O(g)) {
                    let e = ef(await g(S, i), z);
                    if (e && (D[h] = { ...e,
                            ...A(x, e.message)
                        }, !r)) return Z(e.message), D
                } else if (s(g)) {
                    let e = {};
                    for (let t in g) {
                        if (!W(e) && !r) break;
                        let n = ef(await g[t](S, i), z, t);
                        n && (e = { ...n,
                            ...A(t, n.message)
                        }, Z(n.message), r && (D[h] = e))
                    }
                    if (!W(e) && (D[h] = {
                            ref: z,
                            ...e
                        }, !r)) return D
                }
            }
            return Z(!0), D
        };
    let eg = {
            mode: h,
            reValidateMode: g,
            shouldFocusError: !0
        },
        eh = "form",
        e$ = {
            submitCount: 0,
            isDirty: !1,
            isReady: !1,
            isValidating: !1,
            isSubmitted: !1,
            isSubmitting: !1,
            isSubmitSuccessful: !1,
            isValid: !1,
            touchedFields: {},
            dirtyFields: {},
            validatingFields: {}
        };
    e.s(["Controller", 0, e => e.render(function(e) {
        let t = n.default.useContext(j),
            {
                name: i,
                disabled: r,
                control: a = t,
                shouldUnregister: o,
                defaultValue: u,
                exact: s = !0
            } = e,
            c = d(a._names.array, i),
            m = n.default.useMemo(() => U(a._formValues, i, U(a._defaultValues, i, u)), [a, i, u]),
            v = function(e) {
                let t = n.default.useContext(j),
                    {
                        control: i = t,
                        name: r,
                        defaultValue: a,
                        disabled: o,
                        exact: u,
                        compute: s
                    } = e || {},
                    l = n.default.useRef(a),
                    d = n.default.useRef(s),
                    c = n.default.useRef(void 0),
                    m = n.default.useRef(i),
                    f = n.default.useRef(r);
                d.current = s;
                let [p, v] = n.default.useState(() => {
                    let e = i._getWatch(r, l.current);
                    return d.current ? d.current(e) : e
                }), g = n.default.useCallback(e => {
                    let t = A(r, i._names, e || i._formValues, !1, l.current);
                    return d.current ? d.current(t) : t
                }, [i._formValues, i._names, r]), h = n.default.useCallback(e => {
                    if (!o) {
                        let t = A(r, i._names, e || i._formValues, !1, l.current);
                        if (d.current) {
                            let e = d.current(t);
                            L(e, c.current) || (v(e), c.current = e)
                        } else v(t)
                    }
                }, [i._formValues, i._names, o, r]);
                P(() => (m.current === i && L(f.current, r) || (m.current = i, f.current = r, h()), i._subscribe({
                    name: r,
                    formState: {
                        values: !0
                    },
                    exact: u,
                    callback: e => {
                        h(e.values)
                    }
                })), [i, u, r, h]), n.default.useEffect(() => i._removeUnmounted());
                let $ = m.current !== i,
                    y = f.current,
                    _ = n.default.useMemo(() => {
                        if (o) return null;
                        let e = !$ && !L(y, r);
                        return $ || e ? g() : null
                    }, [o, $, r, y, g]);
                return null !== _ ? _ : p
            }({
                control: a,
                name: i,
                defaultValue: m,
                exact: s
            }),
            g = function(e) {
                let t = n.default.useContext(j),
                    {
                        control: i = t,
                        disabled: r,
                        name: a,
                        exact: o
                    } = e || {},
                    [u, s] = n.default.useState(() => ({ ...i._formState,
                        defaultValues: i._defaultValues
                    })),
                    l = n.default.useRef({
                        isDirty: !1,
                        isLoading: !1,
                        dirtyFields: !1,
                        touchedFields: !1,
                        validatingFields: !1,
                        isValidating: !1,
                        isValid: !1,
                        errors: !1
                    });
                return P(() => i._subscribe({
                    name: a,
                    formState: l.current,
                    exact: o,
                    callback: e => {
                        r || s({ ...i._formState,
                            ...e,
                            defaultValues: i._defaultValues
                        })
                    }
                }), [a, r, o]), n.default.useEffect(() => {
                    l.current.isValid && i._setValid(!0)
                }, [i]), n.default.useMemo(() => N(u, i, l.current, !1), [u, i])
            }({
                control: a,
                name: i,
                exact: s
            }),
            h = n.default.useRef(e),
            $ = n.default.useRef(null),
            y = n.default.useRef(a.register(i, { ...e.rules,
                value: v,
                ..."boolean" == typeof e.disabled ? {
                    disabled: e.disabled
                } : {}
            }));
        h.current = e;
        let _ = n.default.useMemo(() => Object.defineProperties({}, {
                invalid: {
                    enumerable: !0,
                    get: () => !!U(g.errors, i)
                },
                isDirty: {
                    enumerable: !0,
                    get: () => !!U(g.dirtyFields, i)
                },
                isTouched: {
                    enumerable: !0,
                    get: () => !!U(g.touchedFields, i)
                },
                isValidating: {
                    enumerable: !0,
                    get: () => !!U(g.validatingFields, i)
                },
                error: {
                    enumerable: !0,
                    get: () => U(g.errors, i)
                }
            }), [g, i]),
            b = n.default.useCallback(e => {
                let t = l(e);
                return U(a._fields, i) || (y.current = a.register(i, { ...h.current.rules,
                    value: t
                })), y.current.onChange({
                    target: {
                        value: l(e),
                        name: i
                    },
                    type: "change"
                })
            }, [i, a]),
            x = n.default.useCallback(() => y.current.onBlur({
                target: {
                    value: U(a._formValues, i),
                    name: i
                },
                type: p
            }), [i, a._formValues]),
            k = n.default.useCallback(e => {
                e && ($.current = {
                    focus: () => O(e.focus) && e.focus(),
                    select: () => O(e.select) && e.select(),
                    setCustomValidity: t => O(e.setCustomValidity) && e.setCustomValidity(t),
                    reportValidity: () => O(e.reportValidity) && e.reportValidity()
                });
                let t = U(a._fields, i);
                t && t._f && e && (t._f.ref = $.current)
            }, [a._fields, i]),
            I = n.default.useMemo(() => ({
                name: i,
                value: v,
                ..."boolean" == typeof r || g.disabled ? {
                    disabled: g.disabled || r
                } : {},
                onChange: b,
                onBlur: x,
                ref: k
            }), [i, r, g.disabled, b, x, k, v]);
        return n.default.useEffect(() => {
            let e = a._options.shouldUnregister || o;
            a.register(i, { ...h.current.rules,
                ..."boolean" == typeof h.current.disabled ? {
                    disabled: h.current.disabled
                } : {}
            });
            let t = (e, t) => {
                let i = U(a._fields, e);
                i && i._f && (i._f.mount = t)
            };
            if (t(i, !0), e) {
                let e = f(U(o ? a._defaultValues : a._options.values || a._defaultValues, i, U(a._options.defaultValues, i, h.current.defaultValue)));
                D(a._defaultValues, i, e), w(U(a._formValues, i)) && D(a._formValues, i, e)
            }
            if (c || a.register(i), $.current) {
                let e = U(a._fields, i);
                e && e._f && (e._f.ref = $.current)
            }
            return () => {
                (c ? e && !a._state.action : e) ? a.unregister(i): t(i, !1)
            }
        }, [i, a, c, o]), n.default.useEffect(() => {
            a._setDisabledField({
                disabled: r,
                name: i
            })
        }, [r, i, a]), n.default.useMemo(() => ({
            field: I,
            formState: g,
            fieldState: _
        }), [I, g, _])
    }(e)), "appendErrors", 0, R, "get", 0, U, "set", 0, D, "useForm", 0, function(e = {}) {
        let t = n.default.useRef(void 0),
            i = n.default.useRef(void 0),
            r = n.default.useRef(e.formControl),
            [u, c] = n.default.useState(() => ({ ...f(e$),
                isLoading: O(e.defaultValues),
                errors: e.errors || {},
                disabled: e.disabled || !1,
                defaultValues: O(e.defaultValues) ? void 0 : e.defaultValues
            }));
        if (!t.current || e.formControl && r.current !== e.formControl)
            if (r.current = e.formControl, e.formControl) t.current = { ...e.formControl,
                formState: u
            }, e.defaultValues && !O(e.defaultValues) && e.formControl.reset(e.defaultValues, e.resetOptions);
            else {
                let {
                    formControl: i,
                    ...r
                } = function(e = {}) {
                    let t, i = { ...eg,
                            ...e
                        },
                        r = { ...f(e$),
                            isLoading: O(i.defaultValues),
                            errors: i.errors || {},
                            disabled: i.disabled || !1
                        },
                        n = {},
                        u = (s(i.defaultValues) || s(i.values)) && f(i.defaultValues || i.values) || {},
                        c = i.shouldUnregister ? {} : f(u),
                        g = {
                            action: !1,
                            mount: !1,
                            watch: !1,
                            keepIsValid: !1
                        },
                        h = {
                            mount: new Set,
                            disabled: new Set,
                            unMount: new Set,
                            array: new Set,
                            watch: new Set,
                            registerName: new Set
                        },
                        $ = 0,
                        y = 0,
                        _ = eo(i.mode),
                        b = eo(i.reValidateMode),
                        I = {
                            isDirty: !1,
                            dirtyFields: !1,
                            validatingFields: !1,
                            touchedFields: !1,
                            isValidating: !1,
                            isValid: !1,
                            errors: !1
                        },
                        z = { ...I
                        },
                        j = { ...z
                        },
                        N = {
                            array: M(),
                            state: M()
                        },
                        P = "all" === i.criteriaMode,
                        T = async e => {
                            if (!g.keepIsValid && !i.disabled && (z.isValid || j.isValid || e)) {
                                let e;
                                i.resolver ? (e = W((await Y()).errors), C()) : e = await ei({
                                    fields: n,
                                    onlyCheckValid: !0,
                                    eventType: "valid"
                                }), e !== r.isValid && N.state.next({
                                    isValid: e
                                })
                            }
                        },
                        C = (e, t) => {
                            !i.disabled && (z.isValidating || z.validatingFields || j.isValidating || j.validatingFields) && ((e || Array.from(h.mount)).forEach(e => {
                                e && (t ? D(r.validatingFields, e, t) : K(r.validatingFields, e))
                            }), N.state.next({
                                validatingFields: r.validatingFields,
                                isValidating: !W(r.validatingFields)
                            }))
                        },
                        R = () => {
                            r.dirtyFields = H(u, c)
                        },
                        X = (t, i, a, s) => {
                            let l = U(n, t);
                            if (l) {
                                if ((e => {
                                        let t = S.test(e) ? [e] : Z(e),
                                            i = c,
                                            r = u;
                                        for (let e = 0; e < t.length - 1; e++) {
                                            let n = t[e];
                                            if (i = o(i) ? i : i[n], r = o(r) ? r : r[n], null === i && null !== r) return !0
                                        }
                                        return !1
                                    })(t)) return;
                                let n = w(U(c, t)),
                                    d = U(c, t, w(a) ? U(u, t) : a);
                                w(d) || s && s.defaultChecked || i ? D(c, t, i ? d : en(l._f)) : ef(t, d), g.mount && !g.action && (T(), n && r.isDirty && (z.isDirty || j.isDirty) && (er() || (r.isDirty = !1, N.state.next({ ...r
                                }))), e.shouldUnregister && n && !w(U(c, t)) && el(t, h) && (g.watch = !0))
                            }
                        },
                        q = (e, t, n, a, o) => {
                            let s = !1,
                                l = !1,
                                d = {
                                    name: e
                                };
                            if (!i.disabled) {
                                if (!n || a) {
                                    let i = L(U(u, e), t);
                                    (z.isDirty || j.isDirty) && (l = r.isDirty, r.isDirty = d.isDirty = !i || er(), s = l !== d.isDirty), l = !!U(r.dirtyFields, e), i !== r.isDirty ? r.dirtyFields = H(u, c) : i ? K(r.dirtyFields, e) : D(r.dirtyFields, e, !0), d.dirtyFields = r.dirtyFields, s = s || (z.dirtyFields || j.dirtyFields) && !i !== l
                                }
                                if (n) {
                                    let t = U(r.touchedFields, e);
                                    t || (D(r.touchedFields, e, n), d.touchedFields = r.touchedFields, s = s || (z.touchedFields || j.touchedFields) && t !== n)
                                }
                                s && o && N.state.next(d)
                            }
                            return s ? d : {}
                        },
                        Y = async e => (C(e, !0), await i.resolver(c, i.context, ((e, t, i, r) => {
                            let n = {};
                            for (let i of e) {
                                let e = U(t, i);
                                e && D(n, i, e._f)
                            }
                            return {
                                criteriaMode: i,
                                names: [...e],
                                fields: n,
                                shouldUseNativeValidation: r
                            }
                        })(e || h.mount, n, i.criteriaMode, i.shouldUseNativeValidation))),
                        Q = async e => {
                            let {
                                errors: t
                            } = await Y(e);
                            if (C(e), e) {
                                for (let i of e) {
                                    let e = U(t, i);
                                    e ? h.array.has(i) && s(e) && !Object.keys(e).some(e => !Number.isNaN(Number(e))) ? em(r.errors, {
                                        [i]: e
                                    }, i) : D(r.errors, i, e) : K(r.errors, i)
                                }
                                r.errors = { ...r.errors
                                }
                            } else r.errors = t;
                            return t
                        },
                        ee = async ({
                            name: t,
                            eventType: i
                        }) => {
                            if (e.validate) {
                                let n = await e.validate({
                                    formValues: c,
                                    formState: r,
                                    name: t,
                                    eventType: i
                                });
                                if (s(n))
                                    for (let e in n) {
                                        let t = n[e];
                                        t && ew(`${eh}.${e}`, {
                                            message: E(t.message) ? t.message : "",
                                            type: t.type || x
                                        })
                                    } else E(n) || !n ? ew(eh, {
                                        message: n || "",
                                        type: x
                                    }) : eS(eh);
                                return n
                            }
                            return !0
                        },
                        ei = async ({
                            fields: t,
                            onlyCheckValid: n,
                            name: a,
                            eventType: o,
                            context: u = {
                                valid: !0,
                                runRootValidation: !1
                            }
                        }) => {
                            if (e.validate && (u.runRootValidation = !0, !await ee({
                                    name: a,
                                    eventType: o
                                })) && (u.valid = !1, n)) return u.valid;
                            for (let a in t) {
                                let s = t[a];
                                if (s) {
                                    let {
                                        _f: t,
                                        ...l
                                    } = s;
                                    if (t) {
                                        let a = h.array.has(t.name),
                                            o = s._f && es(s._f),
                                            l = z.validatingFields || z.isValidating || j.validatingFields || j.isValidating;
                                        o && l && C([t.name], !0);
                                        let d = await ev(s, h.disabled, c, P, i.shouldUseNativeValidation && !n, a);
                                        if (o && l && C([t.name]), d[t.name] && (u.valid = !1, n) || (n || (U(d, t.name) ? a ? em(r.errors, d, t.name) : D(r.errors, t.name, d[t.name]) : K(r.errors, t.name)), e.shouldUseNativeValidation && d[t.name])) break
                                    }
                                    W(l) || await ei({
                                        context: u,
                                        onlyCheckValid: n,
                                        fields: l,
                                        name: a,
                                        eventType: o
                                    })
                                }
                            }
                            return u.valid
                        },
                        er = (e, t) => !i.disabled && (e && t && D(c, e, t), !L(g.mount ? c : u, u)),
                        eu = (e, t, i) => A(e, h, { ...g.mount ? c : w(t) ? u : E(e) ? {
                                [e]: t
                            } : t
                        }, i, t),
                        ef = (e, t, i = {}, r = !1, a = !1) => {
                            let u = U(n, e),
                                s = t;
                            if (u) {
                                let i = u._f;
                                i && (i.disabled || D(c, e, et(t, i)), s = B(i.ref) && o(t) ? "" : t, "select-multiple" === i.ref.type ? [...i.ref.options].forEach(e => e.selected = s.includes(e.value)) : i.refs ? "checkbox" === i.ref.type ? i.refs.forEach(e => {
                                    e.defaultChecked && e.disabled || (Array.isArray(s) ? e.checked = !!s.find(t => t === e.value) : e.checked = s === e.value || !!s)
                                }) : i.refs.forEach(e => e.checked = e.value === s) : "file" === i.ref.type ? i.ref.value = "" : (i.ref.value = s, i.ref.type || a || N.state.next({
                                    name: e,
                                    values: r ? c : f(c)
                                })))
                            }(i.shouldDirty || i.shouldTouch) && q(e, s, i.shouldTouch, i.shouldDirty, !a), i.shouldValidate && ek(e)
                        },
                        ep = (e, t, i, r = !1, o = !1) => {
                            for (let u in t) {
                                if (!t.hasOwnProperty(u)) return;
                                let l = t[u],
                                    d = e + "." + u,
                                    c = U(n, d);
                                (h.array.has(e) || s(l) || c && !c._f) && !a(l) ? ep(d, l, i, r, o) : ef(d, l, i, r, o)
                            }
                        },
                        ey = (e, t, i, a, u = !1) => {
                            let s = U(n, e),
                                l = h.array.has(e),
                                d = a ? t : f(t),
                                m = L(U(c, e), d);
                            if (m || D(c, e, d), l) N.array.next({
                                name: e,
                                values: a ? c : f(c)
                            }), (z.isDirty || z.dirtyFields || j.isDirty || j.dirtyFields) && i.shouldDirty && (R(), u || N.state.next({
                                name: e,
                                dirtyFields: r.dirtyFields,
                                isDirty: er(e, d)
                            }));
                            else {
                                let t = Array.isArray(d) && !d.length || W(d);
                                !s || s._f || o(d) || t ? ef(e, d, i, a, u) : ep(e, d, i, a, u)
                            }
                            if (!m && !u) {
                                let t = el(e, h),
                                    i = a ? c : f(c);
                                N.state.next({ ...t && r,
                                    name: g.mount || t ? e : void 0,
                                    values: i
                                })
                            }
                        },
                        e_ = (e, t, i = {}) => ey(e, t, i, !1),
                        eb = async o => {
                            g.mount = !0;
                            let u = o.target,
                                s = u.name,
                                d = !0,
                                m = U(n, s),
                                v = e => {
                                    d = Number.isNaN(e) || a(e) && isNaN(e.getTime()) || L(e, U(c, s, e))
                                };
                            if (m) {
                                var x, k, I, S, w;
                                let a, g, A, F = u.type ? en(m._f) : l(o),
                                    R = o.type === p || "focusout" === o.type,
                                    V = !((A = m._f).mount && (A.required || A.min || A.max || A.maxLength || A.minLength || A.pattern || A.validate)) && !e.validate && !i.resolver && !U(r.errors, s) && !m._f.deps,
                                    J = V || (x = R, k = U(r.touchedFields, s), I = r.isSubmitted, S = b, !(w = _).isOnAll && (!I && w.isOnTouch ? !(k || x) : (I ? S.isOnBlur : w.isOnBlur) ? !x : (I ? !S.isOnChange : !w.isOnChange) || x)),
                                    M = el(s, h, R);
                                D(c, s, F), R ? u && u.readOnly || (m._f.onBlur && m._f.onBlur(o), t && t(0)) : m._f.onChange && m._f.onChange(o);
                                let B = q(s, F, R),
                                    G = !W(B) || M;
                                if (R || N.state.next({
                                        name: s,
                                        type: o.type,
                                        ...y ? {
                                            values: f(c)
                                        } : {}
                                    }), J) return (!V || !r.isValid) && (z.isValid || j.isValid) && ("onBlur" === i.mode ? R && T() : R || T()), G && N.state.next({
                                    name: s,
                                    ...M ? {} : B
                                });
                                if (!i.resolver && e.validate && await ee({
                                        name: s,
                                        eventType: o.type
                                    }), !R && M && N.state.next({ ...r
                                    }), i.resolver) {
                                    let {
                                        errors: e
                                    } = await Y([s]);
                                    if (C([s]), v(F), !d) {
                                        W(B) || N.state.next(B);
                                        return
                                    }
                                    let t = ec(r.errors, n, s),
                                        i = ec(e, n, t.name || s);
                                    a = i.error, s = i.name, g = W(e)
                                } else C([s], !0), a = (await ev(m, h.disabled, c, P, i.shouldUseNativeValidation))[s], C([s]), v(F), d && (a ? g = !1 : (z.isValid || j.isValid) && (g = await ei({
                                    fields: n,
                                    onlyCheckValid: !0,
                                    name: s,
                                    eventType: o.type
                                })));
                                if (d) {
                                    m._f.deps && (!Array.isArray(m._f.deps) || m._f.deps.length > 0) && ek(m._f.deps);
                                    var Z = s,
                                        O = g,
                                        E = a;
                                    let e = U(r.errors, Z),
                                        n = (z.isValid || j.isValid) && "boolean" == typeof O && r.isValid !== O;
                                    if (i.delayError && E) {
                                        let e;
                                        e = () => {
                                            D(r.errors, Z, E), r.errors = { ...r.errors
                                            }, N.state.next({
                                                errors: r.errors
                                            })
                                        }, (t = t => {
                                            clearTimeout($), $ = setTimeout(e, t)
                                        })(i.delayError)
                                    } else clearTimeout($), t = null, E ? D(r.errors, Z, E) : K(r.errors, Z), r.errors = { ...r.errors
                                    };
                                    if ((E ? !L(e, E) : e) || !W(B) || n) {
                                        let e = { ...B,
                                            ...n && "boolean" == typeof O ? {
                                                isValid: O
                                            } : {},
                                            errors: r.errors,
                                            name: Z
                                        };
                                        r = { ...r,
                                            ...e
                                        }, N.state.next(e)
                                    }
                                }
                            }
                        },
                        ex = (e, t) => {
                            if (U(r.errors, t) && e.focus) return e.focus(), 1
                        },
                        ek = async (e, t = {}) => {
                            let a, o, u = J(e);
                            if (i.resolver) {
                                let t = await Q(w(e) ? e : u);
                                a = W(t), o = e ? !u.some(e => U(t, e)) : a
                            } else e ? ((o = (await Promise.all(u.map(async e => {
                                let t = U(n, e);
                                return await ei({
                                    fields: t && t._f ? {
                                        [e]: t
                                    } : t,
                                    eventType: v
                                })
                            }))).every(Boolean)) || r.isValid) && T() : o = a = await ei({
                                fields: n,
                                name: e,
                                eventType: v
                            });
                            return N.state.next({ ...!E(e) || (z.isValid || j.isValid) && a !== r.isValid ? {} : {
                                    name: e
                                },
                                ...i.resolver || !e ? {
                                    isValid: a
                                } : {},
                                errors: r.errors
                            }), t.shouldFocus && !o && ed(n, ex, e ? u : h.mount), o
                        },
                        eI = (e, t) => ({
                            invalid: !!U((t || r).errors, e),
                            isDirty: !!U((t || r).dirtyFields, e),
                            error: U((t || r).errors, e),
                            isValidating: !!U(r.validatingFields, e),
                            isTouched: !!U((t || r).touchedFields, e)
                        }),
                        eS = e => {
                            let t = e ? J(e) : void 0;
                            null == t || t.forEach(e => K(r.errors, e)), t ? t.forEach(e => {
                                N.state.next({
                                    name: e,
                                    errors: r.errors
                                })
                            }) : N.state.next({
                                errors: {}
                            })
                        },
                        ew = (e, t, i) => {
                            let a = (U(n, e, {
                                    _f: {}
                                })._f || {}).ref,
                                {
                                    ref: o,
                                    message: u,
                                    type: s,
                                    ...l
                                } = U(r.errors, e) || {};
                            D(r.errors, e, { ...l,
                                ...t,
                                ref: a
                            }), N.state.next({
                                name: e,
                                errors: r.errors,
                                isValid: !1
                            }), i && i.shouldFocus && a && a.focus && a.focus()
                        },
                        ez = e => {
                            var t;
                            let i = !!(null == (t = e.formState) ? void 0 : t.values);
                            i && y++;
                            let {
                                unsubscribe: n
                            } = N.state.subscribe({
                                next: t => {
                                    let i, n, a;
                                    if (i = e.name, n = t.name, a = e.exact, (!i || !n || i === n || J(i).some(e => e && (a ? e === n || e.startsWith(n + ".") : e.startsWith(n) || n.startsWith(e)))) && ((e, t, i, r) => {
                                            i(e);
                                            let {
                                                name: n,
                                                ...a
                                            } = e, o = Object.keys(a);
                                            return !o.length || r && o.length >= Object.keys(t).length || o.find(e => t[e] === (!r || "all"))
                                        })(t, e.formState || z, eE, e.reRenderRoot)) {
                                        let i = { ...c
                                        };
                                        e.callback({
                                            values: i,
                                            ...r,
                                            ...t,
                                            defaultValues: u
                                        })
                                    }
                                }
                            });
                            if (!i) return n;
                            let a = !1;
                            return () => {
                                a || (a = !0, y--, n())
                            }
                        },
                        eZ = (e, t = {}) => {
                            for (let a of e ? J(e) : h.mount) h.mount.delete(a), h.array.delete(a), t.keepValue || (K(n, a), K(c, a)), t.keepError || K(r.errors, a), t.keepDirty || K(r.dirtyFields, a), t.keepTouched || K(r.touchedFields, a), t.keepIsValidating || K(r.validatingFields, a), i.shouldUnregister || t.keepDefaultValue || K(u, a);
                            N.state.next({
                                values: f(c)
                            }), N.state.next({ ...r,
                                ...!t.keepDirty ? {} : {
                                    isDirty: er()
                                }
                            }), t.keepIsValid || T()
                        },
                        eU = ({
                            disabled: e,
                            name: t
                        }) => {
                            if ("boolean" == typeof e && g.mount || e || h.disabled.has(t)) {
                                let i = h.disabled.has(t);
                                e ? h.disabled.add(t) : h.disabled.delete(t), !!e !== i && g.mount && !g.action && T()
                            }
                        },
                        eO = (e, t = {}) => {
                            let r = U(n, e),
                                a = "boolean" == typeof t.disabled || "boolean" == typeof i.disabled,
                                o = !h.registerName.has(e) && r && r._f && !r._f.mount;
                            return (D(n, e, { ...r || {},
                                _f: { ...r && r._f ? r._f : {
                                        ref: {
                                            name: e
                                        }
                                    },
                                    name: e,
                                    mount: !0,
                                    ...t
                                }
                            }), h.mount.add(e), r && !o) ? eU({
                                disabled: "boolean" == typeof t.disabled ? t.disabled : i.disabled,
                                name: e
                            }) : X(e, !0, t.value), { ...a ? {
                                    disabled: t.disabled || i.disabled
                                } : {},
                                ...i.progressive ? {
                                    required: !!t.required,
                                    min: ea(t.min),
                                    max: ea(t.max),
                                    minLength: ea(t.minLength),
                                    maxLength: ea(t.maxLength),
                                    pattern: ea(t.pattern)
                                } : {},
                                name: e,
                                onChange: eb,
                                onBlur: eb,
                                ref: a => {
                                    if (a) {
                                        let i;
                                        h.registerName.add(e), eO(e, t), h.registerName.delete(e), r = U(n, e);
                                        let o = w(a.value) && a.querySelectorAll && a.querySelectorAll("input,select,textarea")[0] || a,
                                            s = "radio" === (i = o).type || "checkbox" === i.type,
                                            l = r._f.refs || [];
                                        (s ? l.find(e => e === o) : o === r._f.ref) || (D(n, e, {
                                            _f: { ...r._f,
                                                ...s ? {
                                                    refs: [...l.filter(G), o, ...Array.isArray(U(u, e)) ? [{}] : []],
                                                    ref: {
                                                        type: o.type,
                                                        name: e
                                                    }
                                                } : {
                                                    ref: o
                                                }
                                            }
                                        }), X(e, !1, void 0, o))
                                    } else(r = U(n, e, {}))._f && (r._f.mount = !1), (i.shouldUnregister || t.shouldUnregister) && !(d(h.array, e) && g.action) && h.unMount.add(e)
                                }
                            }
                        },
                        eD = () => i.shouldFocusError && !i.shouldUseNativeValidation && ed(n, ex, h.mount),
                        ej = (e, t) => async a => {
                            let o;
                            a && (a.preventDefault && a.preventDefault(), a.persist && a.persist());
                            let u = f(c);
                            if (N.state.next({
                                    isSubmitting: !0
                                }), i.resolver) {
                                let {
                                    errors: e,
                                    values: t
                                } = await Y();
                                C(), r.errors = e, u = f(t)
                            } else await ei({
                                fields: n,
                                eventType: "submit"
                            });
                            if (h.disabled.size)
                                for (let e of h.disabled) K(u, e);
                            if (K(r.errors, k), W(r.errors)) {
                                N.state.next({
                                    errors: {}
                                });
                                try {
                                    await e(u, a)
                                } catch (e) {
                                    o = e
                                }
                            } else t && await t({ ...r.errors
                            }, a), eD(), setTimeout(eD);
                            if (N.state.next({
                                    isSubmitted: !0,
                                    isSubmitting: !1,
                                    isSubmitSuccessful: W(r.errors) && !o,
                                    submitCount: r.submitCount + 1,
                                    errors: r.errors
                                }), o) throw o
                        },
                        eN = (e, t = {}) => {
                            let a = e ? f(e) : u,
                                o = f(a),
                                s = W(e);
                            if (t.keepDefaultValues || (u = a), !t.keepValues) {
                                if (t.keepDirtyValues)
                                    for (let e of Array.from(new Set([...h.mount, ...Object.keys(H(u, c))]))) {
                                        let t = U(r.dirtyFields, e),
                                            i = U(c, e),
                                            n = U(o, e);
                                        t && !w(i) ? D(o, e, i) : t || w(n) || e_(e, n)
                                    } else {
                                        if (m && w(e))
                                            for (let e of h.mount) {
                                                let t = U(n, e);
                                                if (t && t._f) {
                                                    let e = Array.isArray(t._f.refs) ? t._f.refs[0] : t._f.ref;
                                                    if (B(e)) {
                                                        let t = e.closest("form");
                                                        if (t) {
                                                            t.reset();
                                                            break
                                                        }
                                                    }
                                                }
                                            }
                                        if (t.keepFieldsRef)
                                            for (let e of h.mount) e_(e, U(o, e));
                                        else n = {}
                                    }
                                if (i.shouldUnregister) {
                                    if (c = t.keepDefaultValues ? f(u) : {}, t.keepFieldsRef)
                                        for (let e of h.mount) D(c, e, U(o, e))
                                } else c = f(o);
                                N.array.next({
                                    values: { ...o
                                    }
                                }), N.state.next({
                                    name: void 0,
                                    type: void 0,
                                    values: { ...o
                                    }
                                })
                            }
                            h = {
                                mount: t.keepDirtyValues ? h.mount : new Set,
                                unMount: new Set,
                                array: new Set,
                                registerName: new Set,
                                disabled: new Set,
                                watch: new Set,
                                watchAll: !1,
                                focus: ""
                            }, g.mount = !z.isValid || !!t.keepIsValid || !!t.keepDirtyValues || !i.shouldUnregister && !W(o), g.watch = !!i.shouldUnregister, g.keepIsValid = !!t.keepIsValid, g.action = !1, t.keepErrors || (r.errors = {}), N.state.next({
                                submitCount: t.keepSubmitCount ? r.submitCount : 0,
                                isDirty: !s && (t.keepDirty ? r.isDirty : t.keepValues ? er() : !!(t.keepDefaultValues && !L(e, u))),
                                isSubmitted: !!t.keepIsSubmitted && r.isSubmitted,
                                dirtyFields: s ? {} : t.keepDirtyValues ? t.keepDefaultValues && c ? H(u, c) : r.dirtyFields : t.keepDefaultValues && e ? H(u, e) : t.keepDirty ? r.dirtyFields : {},
                                touchedFields: t.keepTouched ? r.touchedFields : {},
                                errors: t.keepErrors ? r.errors : {},
                                isSubmitSuccessful: !!t.keepIsSubmitSuccessful && r.isSubmitSuccessful,
                                isSubmitting: !1,
                                defaultValues: u
                            })
                        },
                        eP = (e, t) => eN(O(e) ? e(c) : e, { ...i.resetOptions,
                            ...t
                        }),
                        eE = e => {
                            let {
                                name: t,
                                type: i,
                                values: n,
                                ...a
                            } = e;
                            r = { ...r,
                                ...a
                            }
                        },
                        eA = {
                            control: {
                                register: eO,
                                unregister: eZ,
                                getFieldState: eI,
                                handleSubmit: ej,
                                setError: ew,
                                _subscribe: ez,
                                _runSchema: Y,
                                _updateIsValidating: C,
                                _focusError: eD,
                                _getWatch: eu,
                                _getDirty: er,
                                _setValid: T,
                                _setFieldArray: (e, t = [], a, o, u = !0, s = !0) => {
                                    if (o && a && !i.disabled) {
                                        if (g.action = !0, s && Array.isArray(U(n, e))) {
                                            let t = a(U(n, e), o.argA, o.argB);
                                            u && D(n, e, t)
                                        }
                                        if (s && Array.isArray(U(r.errors, e))) {
                                            let t, i = a(U(r.errors, e), o.argA, o.argB);
                                            u && D(r.errors, e, i), V(U(t = r.errors, e)).length || K(t, e)
                                        }
                                        if ((z.touchedFields || j.touchedFields) && s && Array.isArray(U(r.touchedFields, e))) {
                                            let t = a(U(r.touchedFields, e), o.argA, o.argB);
                                            u && D(r.touchedFields, e, t)
                                        }(z.dirtyFields || j.dirtyFields) && R(), N.state.next({
                                            name: e,
                                            isDirty: er(e, t),
                                            dirtyFields: r.dirtyFields,
                                            errors: r.errors,
                                            isValid: r.isValid
                                        })
                                    } else D(c, e, t)
                                },
                                _setDisabledField: eU,
                                _setErrors: e => {
                                    r.errors = e, N.state.next({
                                        errors: r.errors,
                                        isValid: !1
                                    })
                                },
                                _getFieldArray: e => V(U(g.mount ? c : u, e, i.shouldUnregister ? U(u, e, []) : [])),
                                _reset: eN,
                                _resetDefaultValues: () => O(i.defaultValues) && i.defaultValues().then(e => {
                                    eP(e, i.resetOptions), N.state.next({
                                        isLoading: !1
                                    })
                                }),
                                _removeUnmounted: () => {
                                    for (let e of h.unMount) {
                                        let t = U(n, e);
                                        t && (t._f.refs ? t._f.refs.every(e => !G(e)) : !G(t._f.ref)) && eZ(e)
                                    }
                                    h.unMount = new Set
                                },
                                _disableForm: e => {
                                    "boolean" == typeof e && (N.state.next({
                                        disabled: e
                                    }), ed(n, (t, i) => {
                                        let r = U(n, i);
                                        r && (t.disabled = r._f.disabled || e, Array.isArray(r._f.refs) && r._f.refs.forEach(t => {
                                            t.disabled = r._f.disabled || e
                                        }))
                                    }, 0, !1))
                                },
                                _subjects: N,
                                _proxyFormState: z,
                                get _fields() {
                                    return n
                                },
                                get _formValues() {
                                    return c
                                },
                                get _state() {
                                    return g
                                },
                                set _state(value) {
                                    g = value
                                },
                                get _defaultValues() {
                                    return u
                                },
                                get _names() {
                                    return h
                                },
                                set _names(value) {
                                    h = value
                                },
                                get _formState() {
                                    return r
                                },
                                get _options() {
                                    return i
                                },
                                set _options(value) {
                                    _ = eo((i = { ...i,
                                        ...value
                                    }).mode), b = eo(i.reValidateMode)
                                }
                            },
                            subscribe: e => (g.mount = !0, j = { ...j,
                                ...e.formState
                            }, ez({ ...e,
                                formState: { ...I,
                                    ...e.formState
                                }
                            })),
                            trigger: ek,
                            register: eO,
                            handleSubmit: ej,
                            watch: (e, t) => {
                                if (O(e)) {
                                    y++;
                                    let {
                                        unsubscribe: i
                                    } = N.state.subscribe({
                                        next: i => "values" in i && e(i.values || eu(void 0, t), i)
                                    }), r = !1;
                                    return {
                                        unsubscribe: () => {
                                            r || (r = !0, y--, i())
                                        }
                                    }
                                }
                                return eu(e, t, !0)
                            },
                            setValue: e_,
                            setValues: (e, t = {}) => {
                                let i = O(e) ? e(c) : e;
                                if (!L(c, i)) {
                                    c = { ...c,
                                        ...i
                                    };
                                    let e = F(i);
                                    for (let i of h.mount) i in e && ey(i, e[i], t, !0, !0);
                                    N.state.next({ ...r,
                                        name: void 0,
                                        type: void 0,
                                        ...y ? {
                                            values: c
                                        } : {}
                                    }), t.shouldValidate && T()
                                }
                            },
                            getValues: (e, t) => {
                                let i = { ...g.mount ? c : u
                                };
                                return t && (i = function e(t, i) {
                                    let r = {};
                                    for (let n in t)
                                        if (t.hasOwnProperty(n)) {
                                            let a = t[n],
                                                o = i[n];
                                            if (a && s(a) && o) {
                                                let t = e(a, o);
                                                s(t) && (r[n] = t)
                                            } else t[n] && (r[n] = o)
                                        }
                                    return r
                                }(t.dirtyFields ? r.dirtyFields : r.touchedFields, i)), w(e) ? i : E(e) ? U(i, e) : e.map(e => U(i, e))
                            },
                            reset: eP,
                            resetField: (e, t = {}) => {
                                U(n, e) && (w(t.defaultValue) ? e_(e, f(U(u, e))) : (e_(e, t.defaultValue), D(u, e, f(t.defaultValue))), t.keepTouched || K(r.touchedFields, e), t.keepDirty || (K(r.dirtyFields, e), r.isDirty = t.defaultValue ? er(e, f(U(u, e))) : er()), !t.keepError && (K(r.errors, e), z.isValid && T()), N.state.next({ ...r
                                }))
                            },
                            resetDefaultValues: (e, t = {}) => {
                                if (u = f(e), !t.keepDirty) {
                                    let e = H(u, c);
                                    r.dirtyFields = e, r.isDirty = !W(e)
                                }
                                t.keepIsValid || T(), N.state.next({ ...r,
                                    defaultValues: u
                                })
                            },
                            clearErrors: eS,
                            unregister: eZ,
                            setError: ew,
                            setFocus: (e, t = {}) => {
                                let i = U(n, e),
                                    r = i && i._f;
                                if (r) {
                                    let e = r.refs ? r.refs[0] : r.ref;
                                    e.focus && setTimeout(() => {
                                        e.focus(), t.shouldSelect && O(e.select) && e.select()
                                    })
                                }
                            },
                            getFieldState: eI
                        };
                    return { ...eA,
                        formControl: eA
                    }
                }(e);
                t.current = { ...r,
                    formState: u
                }
            }
        let g = t.current.control;
        return g._options = e, P(() => {
            let e = g._subscribe({
                formState: g._proxyFormState,
                callback: () => c({ ...g._formState,
                    defaultValues: g._defaultValues
                }),
                reRenderRoot: !0
            });
            return c(e => ({ ...e,
                isReady: !0
            })), g._formState.isReady = !0, e
        }, [g]), n.default.useEffect(() => g._disableForm(e.disabled), [g, e.disabled]), n.default.useEffect(() => {
            e.mode && (g._options.mode = e.mode), e.reValidateMode && (g._options.reValidateMode = e.reValidateMode)
        }, [g, e.mode, e.reValidateMode]), n.default.useEffect(() => {
            e.errors && (g._setErrors(e.errors), g._focusError())
        }, [g, e.errors]), n.default.useEffect(() => {
            e.shouldUnregister && g._subjects.state.next({
                values: g._getWatch()
            })
        }, [g, e.shouldUnregister]), n.default.useEffect(() => {
            if (g._proxyFormState.isDirty) {
                let e = g._getDirty();
                e !== u.isDirty && g._subjects.state.next({
                    isDirty: e
                })
            }
        }, [g, u.isDirty]), n.default.useEffect(() => {
            var t;
            e.values && !L(e.values, i.current) ? (g._reset(e.values, {
                keepFieldsRef: !0,
                ...g._options.resetOptions
            }), (null == (t = g._options.resetOptions) ? void 0 : t.keepIsValid) || g._setValid(), i.current = e.values, c(e => ({ ...e
            }))) : g._resetDefaultValues()
        }, [g, e.values]), n.default.useEffect(() => {
            g._state.mount || (g._setValid(), g._state.mount = !0), g._state.watch && (g._state.watch = !1, g._subjects.state.next({ ...g._formState
            })), g._removeUnmounted()
        }), t.current.formState = n.default.useMemo(() => N(u, g), [g, u]), t.current
    }], 53145);
    let ey = (e, t, i) => {
            if (e && "reportValidity" in e) {
                let r = U(i, t);
                e.setCustomValidity(r && r.message || ""), e.reportValidity()
            }
        },
        e_ = (e, t) => {
            for (let i in t.fields) {
                let r = t.fields[i];
                r && r.ref && "reportValidity" in r.ref ? ey(r.ref, i, e) : r && r.refs && r.refs.forEach(t => ey(t, i, e))
            }
        },
        eb = (e, t) => {
            t.shouldUseNativeValidation && e_(e, t);
            let i = {};
            for (let r in e) {
                let n = U(t.fields, r),
                    a = Object.assign(e[r] || {}, {
                        ref: n && n.ref
                    });
                if (ex(t.names || Object.keys(e), r)) {
                    let e = Object.assign({}, U(i, r));
                    D(e, "root", a), D(i, r, e)
                } else D(i, r, a)
            }
            return i
        },
        ex = (e, t) => {
            let i = ek(t).replace(/[.*+?^${}()|\\]/g, "\\$&");
            return e.some(e => ek(e).match(`^${i}\\.\\d+`))
        };

    function ek(e) {
        return e.replace(/[\[\]]/g, "")
    }
    let eI = Object.freeze({
        status: "aborted"
    });

    function eS(e, t, i) {
        function r(i, r) {
            if (i._zod || Object.defineProperty(i, "_zod", {
                    value: {
                        def: r,
                        constr: o,
                        traits: new Set
                    },
                    enumerable: !1
                }), i._zod.traits.has(e)) return;
            i._zod.traits.add(e), t(i, r);
            let n = o.prototype,
                a = Object.keys(n);
            for (let e = 0; e < a.length; e++) {
                let t = a[e];
                t in i || (i[t] = n[t].bind(i))
            }
        }
        let n = i ? .Parent ? ? Object;
        class a extends n {}

        function o(e) {
            var t;
            let n = i ? .Parent ? new a : this;
            for (let i of (r(n, e), (t = n._zod).deferred ? ? (t.deferred = []), n._zod.deferred)) i();
            return n
        }
        return Object.defineProperty(a, "name", {
            value: e
        }), Object.defineProperty(o, "init", {
            value: r
        }), Object.defineProperty(o, Symbol.hasInstance, {
            value: t => !!i ? .Parent && t instanceof i.Parent || t ? ._zod ? .traits ? .has(e)
        }), Object.defineProperty(o, "name", {
            value: e
        }), o
    }
    let ew = Symbol("zod_brand");
    class ez extends Error {
        constructor() {
            super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")
        }
    }
    class eZ extends Error {
        constructor(e) {
            super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError"
        }
    }(t = globalThis).__zod_globalConfig ? ? (t.__zod_globalConfig = {});
    let eU = globalThis.__zod_globalConfig;

    function eO(e) {
        return e && Object.assign(eU, e), eU
    }

    function eD(e) {
        let t = Object.values(e).filter(e => "number" == typeof e);
        return Object.entries(e).filter(([e, i]) => -1 === t.indexOf(+e)).map(([e, t]) => t)
    }

    function ej(e, t = "|") {
        return e.map(e => e0(e)).join(t)
    }

    function eN(e, t) {
        return "bigint" == typeof t ? t.toString() : t
    }

    function eP(e) {
        return {
            get value() {
                {
                    let t = e();
                    return Object.defineProperty(this, "value", {
                        value: t
                    }), t
                }
            }
        }
    }

    function eE(e) {
        return null == e
    }

    function eA(e) {
        let t = +!!e.startsWith("^"),
            i = e.endsWith("$") ? e.length - 1 : e.length;
        return e.slice(t, i)
    }

    function eT(e, t) {
        let i = e / t,
            r = Math.round(i),
            n = Number.EPSILON * Math.max(Math.abs(i), 1);
        return Math.abs(i - r) < n ? 0 : i - r
    }
    e.s(["$ZodAsyncError", 0, ez, "$ZodEncodeError", 0, eZ, "$brand", 0, ew, "$constructor", 0, eS, "NEVER", 0, eI, "config", 0, eO, "globalConfig", 0, eU], 97753);
    let eC = Symbol("evaluating");

    function eL(e, t, i) {
        let r;
        Object.defineProperty(e, t, {
            get() {
                if (r !== eC) return void 0 === r && (r = eC, r = i()), r
            },
            set(i) {
                Object.defineProperty(e, t, {
                    value: i
                })
            },
            configurable: !0
        })
    }

    function eF(e, t, i) {
        Object.defineProperty(e, t, {
            value: i,
            writable: !0,
            enumerable: !0,
            configurable: !0
        })
    }

    function eR(...e) {
        let t = {};
        for (let i of e) Object.assign(t, Object.getOwnPropertyDescriptors(i));
        return Object.defineProperties({}, t)
    }

    function eV(e) {
        return JSON.stringify(e)
    }

    function eJ(e) {
        return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "")
    }
    let eM = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};

    function eW(e) {
        return "object" == typeof e && null !== e && !Array.isArray(e)
    }
    let eB = eP(() => {
        if (eU.jitless || "u" > typeof navigator && navigator ? .userAgent ? .includes("Cloudflare")) return !1;
        try {
            return Function(""), !0
        } catch (e) {
            return !1
        }
    });

    function eG(e) {
        if (!1 === eW(e)) return !1;
        let t = e.constructor;
        if (void 0 === t || "function" != typeof t) return !0;
        let i = t.prototype;
        return !1 !== eW(i) && !1 !== Object.prototype.hasOwnProperty.call(i, "isPrototypeOf")
    }

    function eK(e) {
        return eG(e) ? { ...e
        } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e
    }
    let eX = new Set(["string", "number", "symbol"]),
        eq = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);

    function eH(e) {
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    function eY(e, t, i) {
        let r = new e._zod.constr(t ? ? e._zod.def);
        return (!t || i ? .parent) && (r._zod.parent = e), r
    }

    function eQ(e) {
        if (!e) return {};
        if ("string" == typeof e) return {
            error: () => e
        };
        if (e ? .message !== void 0) {
            if (e ? .error !== void 0) throw Error("Cannot specify both `message` and `error` params");
            e.error = e.message
        }
        return (delete e.message, "string" == typeof e.error) ? { ...e,
            error: () => e.error
        } : e
    }

    function e0(e) {
        return "bigint" == typeof e ? e.toString() + "n" : "string" == typeof e ? `"${e}"` : `${e}`
    }

    function e4(e) {
        return Object.keys(e).filter(t => "optional" === e[t]._zod.optin && "optional" === e[t]._zod.optout)
    }
    let e6 = {
            safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
            int32: [-0x80000000, 0x7fffffff],
            uint32: [0, 0xffffffff],
            float32: [-34028234663852886e22, 34028234663852886e22],
            float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
        },
        e1 = {
            int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")],
            uint64: [BigInt(0), BigInt("18446744073709551615")]
        };

    function e2(e, t = 0) {
        if (!0 === e.aborted) return !0;
        for (let i = t; i < e.issues.length; i++)
            if (e.issues[i] ? .continue !== !0) return !0;
        return !1
    }

    function e9(e, t = 0) {
        if (!0 === e.aborted) return !0;
        for (let i = t; i < e.issues.length; i++)
            if (e.issues[i] ? .continue === !1) return !0;
        return !1
    }

    function e3(e, t) {
        return t.map(t => (t.path ? ? (t.path = []), t.path.unshift(e), t))
    }

    function e7(e) {
        return "string" == typeof e ? e : e ? .message
    }

    function e5(e, t, i) {
        let r = e.message ? e.message : e7(e.inst ? ._zod.def ? .error ? .(e)) ? ? e7(t ? .error ? .(e)) ? ? e7(i.customError ? .(e)) ? ? e7(i.localeError ? .(e)) ? ? "Invalid input",
            {
                inst: n,
                continue: a,
                input: o,
                ...u
            } = e;
        return u.path ? ? (u.path = []), u.message = r, t ? .reportInput && (u.input = o), u
    }

    function e8(e) {
        return e instanceof Set ? "set" : e instanceof Map ? "map" : e instanceof File ? "file" : "unknown"
    }

    function te(e) {
        return Array.isArray(e) ? "array" : "string" == typeof e ? "string" : "unknown"
    }

    function tt(e) {
        let t = typeof e;
        switch (t) {
            case "number":
                return Number.isNaN(e) ? "nan" : "number";
            case "object":
                if (null === e) return "null";
                if (Array.isArray(e)) return "array";
                if (e && Object.getPrototypeOf(e) !== Object.prototype && "constructor" in e && e.constructor) return e.constructor.name
        }
        return t
    }

    function ti(...e) {
        let [t, i, r] = e;
        return "string" == typeof t ? {
            message: t,
            code: "custom",
            input: i,
            inst: r
        } : { ...t
        }
    }

    function tr(e) {
        let t = atob(e),
            i = new Uint8Array(t.length);
        for (let e = 0; e < t.length; e++) i[e] = t.charCodeAt(e);
        return i
    }

    function tn(e) {
        let t = "";
        for (let i = 0; i < e.length; i++) t += String.fromCharCode(e[i]);
        return btoa(t)
    }
    e.s(["BIGINT_FORMAT_RANGES", 0, e1, "Class", 0, class {
        constructor(...e) {}
    }, "NUMBER_FORMAT_RANGES", 0, e6, "aborted", 0, e2, "allowsEval", 0, eB, "assert", 0, function(e) {}, "assertEqual", 0, function(e) {
        return e
    }, "assertIs", 0, function(e) {}, "assertNever", 0, function(e) {
        throw Error("Unexpected value in exhaustive check")
    }, "assertNotEqual", 0, function(e) {
        return e
    }, "assignProp", 0, eF, "base64ToUint8Array", 0, tr, "base64urlToUint8Array", 0, function(e) {
        let t = e.replace(/-/g, "+").replace(/_/g, "/"),
            i = "=".repeat((4 - t.length % 4) % 4);
        return tr(t + i)
    }, "cached", 0, eP, "captureStackTrace", 0, eM, "cleanEnum", 0, function(e) {
        return Object.entries(e).filter(([e, t]) => Number.isNaN(Number.parseInt(e, 10))).map(e => e[1])
    }, "cleanRegex", 0, eA, "clone", 0, eY, "cloneDef", 0, function(e) {
        return eR(e._zod.def)
    }, "createTransparentProxy", 0, function(e) {
        let t;
        return new Proxy({}, {
            get: (i, r, n) => (t ? ? (t = e()), Reflect.get(t, r, n)),
            set: (i, r, n, a) => (t ? ? (t = e()), Reflect.set(t, r, n, a)),
            has: (i, r) => (t ? ? (t = e()), Reflect.has(t, r)),
            deleteProperty: (i, r) => (t ? ? (t = e()), Reflect.deleteProperty(t, r)),
            ownKeys: i => (t ? ? (t = e()), Reflect.ownKeys(t)),
            getOwnPropertyDescriptor: (i, r) => (t ? ? (t = e()), Reflect.getOwnPropertyDescriptor(t, r)),
            defineProperty: (i, r, n) => (t ? ? (t = e()), Reflect.defineProperty(t, r, n))
        })
    }, "defineLazy", 0, eL, "esc", 0, eV, "escapeRegex", 0, eH, "explicitlyAborted", 0, e9, "extend", 0, function(e, t) {
        if (!eG(t)) throw Error("Invalid input to extend: expected a plain object");
        let i = e._zod.def.checks;
        if (i && i.length > 0) {
            let i = e._zod.def.shape;
            for (let e in t)
                if (void 0 !== Object.getOwnPropertyDescriptor(i, e)) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")
        }
        let r = eR(e._zod.def, {
            get shape() {
                let i = { ...e._zod.def.shape,
                    ...t
                };
                return eF(this, "shape", i), i
            }
        });
        return eY(e, r)
    }, "finalizeIssue", 0, e5, "floatSafeRemainder", 0, eT, "getElementAtPath", 0, function(e, t) {
        return t ? t.reduce((e, t) => e ? .[t], e) : e
    }, "getEnumValues", 0, eD, "getLengthableOrigin", 0, te, "getParsedType", 0, e => {
        let t = typeof e;
        switch (t) {
            case "undefined":
                return "undefined";
            case "string":
                return "string";
            case "number":
                return Number.isNaN(e) ? "nan" : "number";
            case "boolean":
                return "boolean";
            case "function":
                return "function";
            case "bigint":
                return "bigint";
            case "symbol":
                return "symbol";
            case "object":
                if (Array.isArray(e)) return "array";
                if (null === e) return "null";
                if (e.then && "function" == typeof e.then && e.catch && "function" == typeof e.catch) return "promise";
                if ("u" > typeof Map && e instanceof Map) return "map";
                if ("u" > typeof Set && e instanceof Set) return "set";
                if ("u" > typeof Date && e instanceof Date) return "date";
                if ("u" > typeof File && e instanceof File) return "file";
                return "object";
            default:
                throw Error(`Unknown data type: ${t}`)
        }
    }, "getSizableOrigin", 0, e8, "hexToUint8Array", 0, function(e) {
        let t = e.replace(/^0x/, "");
        if (t.length % 2 != 0) throw Error("Invalid hex string length");
        let i = new Uint8Array(t.length / 2);
        for (let e = 0; e < t.length; e += 2) i[e / 2] = Number.parseInt(t.slice(e, e + 2), 16);
        return i
    }, "isObject", 0, eW, "isPlainObject", 0, eG, "issue", 0, ti, "joinValues", 0, ej, "jsonStringifyReplacer", 0, eN, "merge", 0, function(e, t) {
        if (e._zod.def.checks ? .length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
        let i = eR(e._zod.def, {
            get shape() {
                let i = { ...e._zod.def.shape,
                    ...t._zod.def.shape
                };
                return eF(this, "shape", i), i
            },
            get catchall() {
                return t._zod.def.catchall
            },
            checks: t._zod.def.checks ? ? []
        });
        return eY(e, i)
    }, "mergeDefs", 0, eR, "normalizeParams", 0, eQ, "nullish", 0, eE, "numKeys", 0, function(e) {
        let t = 0;
        for (let i in e) Object.prototype.hasOwnProperty.call(e, i) && t++;
        return t
    }, "objectClone", 0, function(e) {
        return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e))
    }, "omit", 0, function(e, t) {
        let i = e._zod.def,
            r = i.checks;
        if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
        let n = eR(e._zod.def, {
            get shape() {
                let r = { ...e._zod.def.shape
                };
                for (let e in t) {
                    if (!(e in i.shape)) throw Error(`Unrecognized key: "${e}"`);
                    t[e] && delete r[e]
                }
                return eF(this, "shape", r), r
            },
            checks: []
        });
        return eY(e, n)
    }, "optionalKeys", 0, e4, "parsedType", 0, tt, "partial", 0, function(e, t, i) {
        let r = t._zod.def.checks;
        if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
        let n = eR(t._zod.def, {
            get shape() {
                let r = t._zod.def.shape,
                    n = { ...r
                    };
                if (i)
                    for (let t in i) {
                        if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
                        i[t] && (n[t] = e ? new e({
                            type: "optional",
                            innerType: r[t]
                        }) : r[t])
                    } else
                        for (let t in r) n[t] = e ? new e({
                            type: "optional",
                            innerType: r[t]
                        }) : r[t];
                return eF(this, "shape", n), n
            },
            checks: []
        });
        return eY(t, n)
    }, "pick", 0, function(e, t) {
        let i = e._zod.def,
            r = i.checks;
        if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
        let n = eR(e._zod.def, {
            get shape() {
                let e = {};
                for (let r in t) {
                    if (!(r in i.shape)) throw Error(`Unrecognized key: "${r}"`);
                    t[r] && (e[r] = i.shape[r])
                }
                return eF(this, "shape", e), e
            },
            checks: []
        });
        return eY(e, n)
    }, "prefixIssues", 0, e3, "primitiveTypes", 0, eq, "promiseAllObject", 0, function(e) {
        let t = Object.keys(e);
        return Promise.all(t.map(t => e[t])).then(e => {
            let i = {};
            for (let r = 0; r < t.length; r++) i[t[r]] = e[r];
            return i
        })
    }, "propertyKeyTypes", 0, eX, "randomString", 0, function(e = 10) {
        let t = "abcdefghijklmnopqrstuvwxyz",
            i = "";
        for (let r = 0; r < e; r++) i += t[Math.floor(Math.random() * t.length)];
        return i
    }, "required", 0, function(e, t, i) {
        let r = eR(t._zod.def, {
            get shape() {
                let r = t._zod.def.shape,
                    n = { ...r
                    };
                if (i)
                    for (let t in i) {
                        if (!(t in n)) throw Error(`Unrecognized key: "${t}"`);
                        i[t] && (n[t] = new e({
                            type: "nonoptional",
                            innerType: r[t]
                        }))
                    } else
                        for (let t in r) n[t] = new e({
                            type: "nonoptional",
                            innerType: r[t]
                        });
                return eF(this, "shape", n), n
            }
        });
        return eY(t, r)
    }, "safeExtend", 0, function(e, t) {
        if (!eG(t)) throw Error("Invalid input to safeExtend: expected a plain object");
        let i = eR(e._zod.def, {
            get shape() {
                let i = { ...e._zod.def.shape,
                    ...t
                };
                return eF(this, "shape", i), i
            }
        });
        return eY(e, i)
    }, "shallowClone", 0, eK, "slugify", 0, eJ, "stringifyPrimitive", 0, e0, "uint8ArrayToBase64", 0, tn, "uint8ArrayToBase64url", 0, function(e) {
        return tn(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
    }, "uint8ArrayToHex", 0, function(e) {
        return Array.from(e).map(e => e.toString(16).padStart(2, "0")).join("")
    }, "unwrapMessage", 0, e7], 22143);
    let ta = (e, t) => {
            e.name = "$ZodError", Object.defineProperty(e, "_zod", {
                value: e._zod,
                enumerable: !1
            }), Object.defineProperty(e, "issues", {
                value: t,
                enumerable: !1
            }), e.message = JSON.stringify(t, eN, 2), Object.defineProperty(e, "toString", {
                value: () => e.message,
                enumerable: !1
            })
        },
        to = eS("$ZodError", ta),
        tu = eS("$ZodError", ta, {
            Parent: Error
        });

    function ts(e, t = e => e.message) {
        let i = {},
            r = [];
        for (let n of e.issues) n.path.length > 0 ? (i[n.path[0]] = i[n.path[0]] || [], i[n.path[0]].push(t(n))) : r.push(t(n));
        return {
            formErrors: r,
            fieldErrors: i
        }
    }

    function tl(e, t = e => e.message) {
        let i = {
                _errors: []
            },
            r = (e, n = []) => {
                for (let a of e.issues)
                    if ("invalid_union" === a.code && a.errors.length) a.errors.map(e => r({
                        issues: e
                    }, [...n, ...a.path]));
                    else if ("invalid_key" === a.code) r({
                    issues: a.issues
                }, [...n, ...a.path]);
                else if ("invalid_element" === a.code) r({
                    issues: a.issues
                }, [...n, ...a.path]);
                else {
                    let e = [...n, ...a.path];
                    if (0 === e.length) i._errors.push(t(a));
                    else {
                        let r = i,
                            n = 0;
                        for (; n < e.length;) {
                            let i = e[n];
                            n === e.length - 1 ? (r[i] = r[i] || {
                                _errors: []
                            }, r[i]._errors.push(t(a))) : r[i] = r[i] || {
                                _errors: []
                            }, r = r[i], n++
                        }
                    }
                }
            };
        return r(e), i
    }

    function td(e, t = e => e.message) {
        let i = {
                errors: []
            },
            r = (e, n = []) => {
                var a, o;
                for (let u of e.issues)
                    if ("invalid_union" === u.code && u.errors.length) u.errors.map(e => r({
                        issues: e
                    }, [...n, ...u.path]));
                    else if ("invalid_key" === u.code) r({
                    issues: u.issues
                }, [...n, ...u.path]);
                else if ("invalid_element" === u.code) r({
                    issues: u.issues
                }, [...n, ...u.path]);
                else {
                    let e = [...n, ...u.path];
                    if (0 === e.length) {
                        i.errors.push(t(u));
                        continue
                    }
                    let r = i,
                        s = 0;
                    for (; s < e.length;) {
                        let i = e[s],
                            n = s === e.length - 1;
                        "string" == typeof i ? (r.properties ? ? (r.properties = {}), (a = r.properties)[i] ? ? (a[i] = {
                            errors: []
                        }), r = r.properties[i]) : (r.items ? ? (r.items = []), (o = r.items)[i] ? ? (o[i] = {
                            errors: []
                        }), r = r.items[i]), n && r.errors.push(t(u)), s++
                    }
                }
            };
        return r(e), i
    }

    function tc(e) {
        let t = [];
        for (let i of e.map(e => "object" == typeof e ? e.key : e)) "number" == typeof i ? t.push(`[${i}]`) : "symbol" == typeof i ? t.push(`[${JSON.stringify(String(i))}]`) : /[^\w$]/.test(i) ? t.push(`[${JSON.stringify(i)}]`) : (t.length && t.push("."), t.push(i));
        return t.join("")
    }

    function tm(e) {
        let t = [];
        for (let i of [...e.issues].sort((e, t) => (e.path ? ? []).length - (t.path ? ? []).length)) t.push(`✖ ${i.message}`), i.path ? .length && t.push(`  → at ${tc(i.path)}`);
        return t.join("\n")
    }
    e.s(["$ZodError", 0, to, "$ZodRealError", 0, tu, "flattenError", 0, ts, "formatError", 0, tl, "prettifyError", 0, tm, "toDotPath", 0, tc, "treeifyError", 0, td], 74969);
    let tf = e => (t, i, r, n) => {
            let a = r ? { ...r,
                    async: !1
                } : {
                    async: !1
                },
                o = t._zod.run({
                    value: i,
                    issues: []
                }, a);
            if (o instanceof Promise) throw new ez;
            if (o.issues.length) {
                let t = new(n ? .Err ? ? e)(o.issues.map(e => e5(e, a, eO())));
                throw eM(t, n ? .callee), t
            }
            return o.value
        },
        tp = tf(tu),
        tv = e => async (t, i, r, n) => {
            let a = r ? { ...r,
                    async: !0
                } : {
                    async: !0
                },
                o = t._zod.run({
                    value: i,
                    issues: []
                }, a);
            if (o instanceof Promise && (o = await o), o.issues.length) {
                let t = new(n ? .Err ? ? e)(o.issues.map(e => e5(e, a, eO())));
                throw eM(t, n ? .callee), t
            }
            return o.value
        },
        tg = tv(tu),
        th = e => (t, i, r) => {
            let n = r ? { ...r,
                    async: !1
                } : {
                    async: !1
                },
                a = t._zod.run({
                    value: i,
                    issues: []
                }, n);
            if (a instanceof Promise) throw new ez;
            return a.issues.length ? {
                success: !1,
                error: new(e ? ? to)(a.issues.map(e => e5(e, n, eO())))
            } : {
                success: !0,
                data: a.value
            }
        },
        t$ = th(tu),
        ty = e => async (t, i, r) => {
            let n = r ? { ...r,
                    async: !0
                } : {
                    async: !0
                },
                a = t._zod.run({
                    value: i,
                    issues: []
                }, n);
            return a instanceof Promise && (a = await a), a.issues.length ? {
                success: !1,
                error: new e(a.issues.map(e => e5(e, n, eO())))
            } : {
                success: !0,
                data: a.value
            }
        },
        t_ = ty(tu),
        tb = e => (t, i, r) => {
            let n = r ? { ...r,
                direction: "backward"
            } : {
                direction: "backward"
            };
            return tf(e)(t, i, n)
        },
        tx = tb(tu),
        tk = e => (t, i, r) => tf(e)(t, i, r),
        tI = tk(tu),
        tS = e => async (t, i, r) => {
            let n = r ? { ...r,
                direction: "backward"
            } : {
                direction: "backward"
            };
            return tv(e)(t, i, n)
        },
        tw = tS(tu),
        tz = e => async (t, i, r) => tv(e)(t, i, r),
        tZ = tz(tu),
        tU = e => (t, i, r) => {
            let n = r ? { ...r,
                direction: "backward"
            } : {
                direction: "backward"
            };
            return th(e)(t, i, n)
        },
        tO = tU(tu),
        tD = e => (t, i, r) => th(e)(t, i, r),
        tj = tD(tu),
        tN = e => async (t, i, r) => {
            let n = r ? { ...r,
                direction: "backward"
            } : {
                direction: "backward"
            };
            return ty(e)(t, i, n)
        },
        tP = tN(tu),
        tE = e => async (t, i, r) => ty(e)(t, i, r),
        tA = tE(tu);

    function tT() {
        return (tT = Object.assign.bind()).apply(null, arguments)
    }

    function tC(e, t) {
        try {
            var i = e()
        } catch (e) {
            return t(e)
        }
        return i && i.then ? i.then(void 0, t) : i
    }

    function tL() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "characters",
                    verb: "to have"
                },
                file: {
                    unit: "bytes",
                    verb: "to have"
                },
                array: {
                    unit: "items",
                    verb: "to have"
                },
                set: {
                    unit: "items",
                    verb: "to have"
                },
                map: {
                    unit: "entries",
                    verb: "to have"
                }
            }, t = {
                regex: "input",
                email: "email address",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO datetime",
                date: "ISO date",
                time: "ISO time",
                duration: "ISO duration",
                ipv4: "IPv4 address",
                ipv6: "IPv6 address",
                mac: "MAC address",
                cidrv4: "IPv4 range",
                cidrv6: "IPv6 range",
                base64: "base64-encoded string",
                base64url: "base64url-encoded string",
                json_string: "JSON string",
                e164: "E.164 number",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            return `Invalid input: expected ${e}, received ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Invalid input: expected ${e0(r.values[0])}`;
                        return `Invalid option: expected one of ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Too big: expected ${r.origin??"value"} to have ${t}${r.maximum.toString()} ${i.unit??"elements"}`;
                            return `Too big: expected ${r.origin??"value"} to be ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Too small: expected ${r.origin} to have ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Too small: expected ${r.origin} to be ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Invalid string: must start with "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Invalid string: must end with "${r.suffix}"`;
                        if ("includes" === r.format) return `Invalid string: must include "${r.includes}"`;
                        if ("regex" === r.format) return `Invalid string: must match pattern ${r.pattern}`;
                        return `Invalid ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Invalid number: must be a multiple of ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Unrecognized key${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Invalid key in ${r.origin}`;
                    case "invalid_union":
                        if (r.options && Array.isArray(r.options) && r.options.length > 0) {
                            let e = r.options.map(e => `'${e}'`).join(" | ");
                            return `Invalid discriminator value. Expected ${e}`
                        }
                        return "Invalid input";
                    case "invalid_element":
                        return `Invalid value in ${r.origin}`;
                    default:
                        return "Invalid input"
                }
            })
        }
    }
    e.s(["_decode", 0, tk, "_decodeAsync", 0, tz, "_encode", 0, tb, "_encodeAsync", 0, tS, "_parse", 0, tf, "_parseAsync", 0, tv, "_safeDecode", 0, tD, "_safeDecodeAsync", 0, tE, "_safeEncode", 0, tU, "_safeEncodeAsync", 0, tN, "_safeParse", 0, th, "_safeParseAsync", 0, ty, "decode", 0, tI, "decodeAsync", 0, tZ, "encode", 0, tx, "encodeAsync", 0, tw, "parse", 0, tp, "parseAsync", 0, tg, "safeDecode", 0, tj, "safeDecodeAsync", 0, tA, "safeEncode", 0, tO, "safeEncodeAsync", 0, tP, "safeParse", 0, t$, "safeParseAsync", 0, t_], 3108), e.s(["zodResolver", 0, function(e, t, i) {
        if (void 0 === i && (i = {}), "_def" in e && "object" == typeof e._def && "typeName" in e._def) return function(r, n, a) {
            try {
                return Promise.resolve(tC(function() {
                    return Promise.resolve(e["sync" === i.mode ? "parse" : "parseAsync"](r, t)).then(function(e) {
                        return a.shouldUseNativeValidation && e_({}, a), {
                            errors: {},
                            values: i.raw ? Object.assign({}, r) : e
                        }
                    })
                }, function(e) {
                    if (Array.isArray(null == e ? void 0 : e.issues)) return {
                        values: {},
                        errors: eb(function(e, t) {
                            for (var i = {}; e.length;) {
                                var r = e[0],
                                    n = r.code,
                                    a = r.message,
                                    o = r.path.join(".");
                                if (!i[o])
                                    if ("unionErrors" in r) {
                                        var u = r.unionErrors[0].errors[0];
                                        i[o] = {
                                            message: u.message,
                                            type: u.code
                                        }
                                    } else i[o] = {
                                        message: a,
                                        type: n
                                    };
                                if ("unionErrors" in r && r.unionErrors.forEach(function(t) {
                                        return t.errors.forEach(function(t) {
                                            return e.push(t)
                                        })
                                    }), t) {
                                    var s = i[o].types,
                                        l = s && s[r.code];
                                    i[o] = R(o, t, i, n, l ? [].concat(l, r.message) : r.message)
                                }
                                e.shift()
                            }
                            return i
                        }(e.errors, !a.shouldUseNativeValidation && "all" === a.criteriaMode), a)
                    };
                    throw e
                }))
            } catch (e) {
                return Promise.reject(e)
            }
        };
        if ("_zod" in e && "object" == typeof e._zod) return function(r, n, a) {
            try {
                return Promise.resolve(tC(function() {
                    return Promise.resolve(("sync" === i.mode ? tp : tg)(e, r, t)).then(function(e) {
                        return a.shouldUseNativeValidation && e_({}, a), {
                            errors: {},
                            values: i.raw ? Object.assign({}, r) : e
                        }
                    })
                }, function(e) {
                    if (e instanceof to) return {
                        values: {},
                        errors: eb(function(e, t) {
                            for (var i = {}; e.length;) ! function() {
                                var r = e[0],
                                    n = r.code,
                                    a = r.message,
                                    o = r.path.join(".");
                                if (!i[o])
                                    if ("invalid_union" === r.code && r.errors.length > 0) {
                                        var u = r.errors[0][0];
                                        i[o] = {
                                            message: u.message,
                                            type: u.code
                                        }
                                    } else i[o] = {
                                        message: a,
                                        type: n
                                    };
                                if ("invalid_union" === r.code && r.errors.forEach(function(t) {
                                        return t.forEach(function(t) {
                                            return e.push(tT({}, t, {
                                                path: [].concat(r.path, t.path)
                                            }))
                                        })
                                    }), t) {
                                    var s = i[o].types,
                                        l = s && s[r.code];
                                    i[o] = R(o, t, i, n, l ? [].concat(l, r.message) : r.message)
                                }
                                e.shift()
                            }();
                            return i
                        }(e.issues, !a.shouldUseNativeValidation && "all" === a.criteriaMode), a)
                    };
                    throw e
                }))
            } catch (e) {
                return Promise.reject(e)
            }
        };
        throw Error("Invalid input: not a Zod schema")
    }], 75980), eO(tL()), e.s([], 98821), e.i(98821), e.s([], 92135), e.i(92135), e.i(97753), e.i(3108), e.i(74969);
    let tF = /^[cC][0-9a-z]{6,}$/,
        tR = /^[0-9a-z]+$/,
        tV = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
        tJ = /^[0-9a-vA-V]{20}$/,
        tM = /^[A-Za-z0-9]{27}$/,
        tW = /^[a-zA-Z0-9_-]{21}$/,
        tB = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
        tG = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
        tK = e => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
        tX = tK(4),
        tq = tK(6),
        tH = tK(7),
        tY = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
        tQ = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;

    function t0() {
        return RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u")
    }
    let t4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
        t6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
        t1 = e => {
            let t = eH(e ? ? ":");
            return RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`)
        },
        t2 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
        t9 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
        t3 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
        t7 = /^[A-Za-z0-9_-]*$/,
        t5 = /^https?$/,
        t8 = /^\+[1-9]\d{6,14}$/,
        ie = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",
        it = RegExp(`^${ie}$`);

    function ii(e) {
        let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
        return "number" == typeof e.precision ? -1 === e.precision ? `${t}` : 0 === e.precision ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`
    }

    function ir(e) {
        return RegExp(`^${ii(e)}$`)
    }

    function ia(e) {
        let t = ii({
                precision: e.precision
            }),
            i = ["Z"];
        e.local && i.push(""), e.offset && i.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
        let r = `${t}(?:${i.join("|")})`;
        return RegExp(`^${ie}T(?:${r})$`)
    }
    let io = e => {
            let t = e ? `[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}` : "[\\s\\S]*";
            return RegExp(`^${t}$`)
        },
        iu = /^-?\d+n?$/,
        is = /^-?\d+$/,
        il = /^-?\d+(?:\.\d+)?$/,
        id = /^(?:true|false)$/i,
        ic = /^null$/i,
        im = /^undefined$/i,
        ip = /^[^A-Z]*$/,
        iv = /^[^a-z]*$/;

    function ig(e, t) {
        return RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`)
    }

    function ih(e) {
        return RegExp(`^[A-Za-z0-9_-]{${e}}$`)
    }
    let i$ = ig(22, "=="),
        iy = ih(22),
        i_ = ig(27, "="),
        ib = ih(27),
        ix = ig(43, "="),
        ik = ih(43),
        iI = ig(64, ""),
        iS = ih(64),
        iw = ig(86, "=="),
        iz = ih(86);
    e.s(["base64", 0, t3, "base64url", 0, t7, "bigint", 0, iu, "boolean", 0, id, "browserEmail", 0, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "cidrv4", 0, t2, "cidrv6", 0, t9, "cuid", 0, tF, "cuid2", 0, tR, "date", 0, it, "datetime", 0, ia, "domain", 0, /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "duration", 0, tB, "e164", 0, t8, "email", 0, tY, "emoji", 0, t0, "extendedDuration", 0, /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, "guid", 0, tG, "hex", 0, /^[0-9a-fA-F]*$/, "hostname", 0, /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, "html5Email", 0, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "httpProtocol", 0, t5, "idnEmail", 0, tQ, "integer", 0, is, "ipv4", 0, t4, "ipv6", 0, t6, "ksuid", 0, tM, "lowercase", 0, ip, "mac", 0, t1, "md5_base64", 0, i$, "md5_base64url", 0, iy, "md5_hex", 0, /^[0-9a-fA-F]{32}$/, "nanoid", 0, tW, "null", 0, ic, "number", 0, il, "rfc5322Email", 0, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "sha1_base64", 0, i_, "sha1_base64url", 0, ib, "sha1_hex", 0, /^[0-9a-fA-F]{40}$/, "sha256_base64", 0, ix, "sha256_base64url", 0, ik, "sha256_hex", 0, /^[0-9a-fA-F]{64}$/, "sha384_base64", 0, iI, "sha384_base64url", 0, iS, "sha384_hex", 0, /^[0-9a-fA-F]{96}$/, "sha512_base64", 0, iw, "sha512_base64url", 0, iz, "sha512_hex", 0, /^[0-9a-fA-F]{128}$/, "string", 0, io, "time", 0, ir, "ulid", 0, tV, "undefined", 0, im, "unicodeEmail", 0, tQ, "uppercase", 0, iv, "uuid", 0, tK, "uuid4", 0, tX, "uuid6", 0, tq, "uuid7", 0, tH, "xid", 0, tJ], 82358);
    let iZ = eS("$ZodCheck", (e, t) => {
            var i;
            e._zod ? ? (e._zod = {}), e._zod.def = t, (i = e._zod).onattach ? ? (i.onattach = [])
        }),
        iU = {
            number: "number",
            bigint: "bigint",
            object: "date"
        },
        iO = eS("$ZodCheckLessThan", (e, t) => {
            iZ.init(e, t);
            let i = iU[typeof t.value];
            e._zod.onattach.push(e => {
                let i = e._zod.bag,
                    r = (t.inclusive ? i.maximum : i.exclusiveMaximum) ? ? 1 / 0;
                t.value < r && (t.inclusive ? i.maximum = t.value : i.exclusiveMaximum = t.value)
            }), e._zod.check = r => {
                (t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
                    origin: i,
                    code: "too_big",
                    maximum: "object" == typeof t.value ? t.value.getTime() : t.value,
                    input: r.value,
                    inclusive: t.inclusive,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iD = eS("$ZodCheckGreaterThan", (e, t) => {
            iZ.init(e, t);
            let i = iU[typeof t.value];
            e._zod.onattach.push(e => {
                let i = e._zod.bag,
                    r = (t.inclusive ? i.minimum : i.exclusiveMinimum) ? ? -1 / 0;
                t.value > r && (t.inclusive ? i.minimum = t.value : i.exclusiveMinimum = t.value)
            }), e._zod.check = r => {
                (t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
                    origin: i,
                    code: "too_small",
                    minimum: "object" == typeof t.value ? t.value.getTime() : t.value,
                    input: r.value,
                    inclusive: t.inclusive,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        ij = eS("$ZodCheckMultipleOf", (e, t) => {
            iZ.init(e, t), e._zod.onattach.push(e => {
                var i;
                (i = e._zod.bag).multipleOf ? ? (i.multipleOf = t.value)
            }), e._zod.check = i => {
                if (typeof i.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
                ("bigint" == typeof i.value ? i.value % t.value === BigInt(0) : 0 === eT(i.value, t.value)) || i.issues.push({
                    origin: typeof i.value,
                    code: "not_multiple_of",
                    divisor: t.value,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iN = eS("$ZodCheckNumberFormat", (e, t) => {
            iZ.init(e, t), t.format = t.format || "float64";
            let i = t.format ? .includes("int"),
                r = i ? "int" : "number",
                [n, a] = e6[t.format];
            e._zod.onattach.push(e => {
                let r = e._zod.bag;
                r.format = t.format, r.minimum = n, r.maximum = a, i && (r.pattern = is)
            }), e._zod.check = o => {
                let u = o.value;
                if (i) {
                    if (!Number.isInteger(u)) return void o.issues.push({
                        expected: r,
                        format: t.format,
                        code: "invalid_type",
                        continue: !1,
                        input: u,
                        inst: e
                    });
                    if (!Number.isSafeInteger(u)) return void(u > 0 ? o.issues.push({
                        input: u,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst: e,
                        origin: r,
                        inclusive: !0,
                        continue: !t.abort
                    }) : o.issues.push({
                        input: u,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst: e,
                        origin: r,
                        inclusive: !0,
                        continue: !t.abort
                    }))
                }
                u < n && o.issues.push({
                    origin: "number",
                    input: u,
                    code: "too_small",
                    minimum: n,
                    inclusive: !0,
                    inst: e,
                    continue: !t.abort
                }), u > a && o.issues.push({
                    origin: "number",
                    input: u,
                    code: "too_big",
                    maximum: a,
                    inclusive: !0,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iP = eS("$ZodCheckBigIntFormat", (e, t) => {
            iZ.init(e, t);
            let [i, r] = e1[t.format];
            e._zod.onattach.push(e => {
                let n = e._zod.bag;
                n.format = t.format, n.minimum = i, n.maximum = r
            }), e._zod.check = n => {
                let a = n.value;
                a < i && n.issues.push({
                    origin: "bigint",
                    input: a,
                    code: "too_small",
                    minimum: i,
                    inclusive: !0,
                    inst: e,
                    continue: !t.abort
                }), a > r && n.issues.push({
                    origin: "bigint",
                    input: a,
                    code: "too_big",
                    maximum: r,
                    inclusive: !0,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iE = eS("$ZodCheckMaxSize", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.size
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag.maximum ? ? 1 / 0;
                t.maximum < i && (e._zod.bag.maximum = t.maximum)
            }), e._zod.check = i => {
                let r = i.value;
                r.size <= t.maximum || i.issues.push({
                    origin: e8(r),
                    code: "too_big",
                    maximum: t.maximum,
                    inclusive: !0,
                    input: r,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iA = eS("$ZodCheckMinSize", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.size
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag.minimum ? ? -1 / 0;
                t.minimum > i && (e._zod.bag.minimum = t.minimum)
            }), e._zod.check = i => {
                let r = i.value;
                r.size >= t.minimum || i.issues.push({
                    origin: e8(r),
                    code: "too_small",
                    minimum: t.minimum,
                    inclusive: !0,
                    input: r,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iT = eS("$ZodCheckSizeEquals", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.size
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag;
                i.minimum = t.size, i.maximum = t.size, i.size = t.size
            }), e._zod.check = i => {
                let r = i.value,
                    n = r.size;
                if (n === t.size) return;
                let a = n > t.size;
                i.issues.push({
                    origin: e8(r),
                    ...a ? {
                        code: "too_big",
                        maximum: t.size
                    } : {
                        code: "too_small",
                        minimum: t.size
                    },
                    inclusive: !0,
                    exact: !0,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iC = eS("$ZodCheckMaxLength", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.length
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag.maximum ? ? 1 / 0;
                t.maximum < i && (e._zod.bag.maximum = t.maximum)
            }), e._zod.check = i => {
                let r = i.value;
                if (r.length <= t.maximum) return;
                let n = te(r);
                i.issues.push({
                    origin: n,
                    code: "too_big",
                    maximum: t.maximum,
                    inclusive: !0,
                    input: r,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iL = eS("$ZodCheckMinLength", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.length
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag.minimum ? ? -1 / 0;
                t.minimum > i && (e._zod.bag.minimum = t.minimum)
            }), e._zod.check = i => {
                let r = i.value;
                if (r.length >= t.minimum) return;
                let n = te(r);
                i.issues.push({
                    origin: n,
                    code: "too_small",
                    minimum: t.minimum,
                    inclusive: !0,
                    input: r,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iF = eS("$ZodCheckLengthEquals", (e, t) => {
            var i;
            iZ.init(e, t), (i = e._zod.def).when ? ? (i.when = e => {
                let t = e.value;
                return !eE(t) && void 0 !== t.length
            }), e._zod.onattach.push(e => {
                let i = e._zod.bag;
                i.minimum = t.length, i.maximum = t.length, i.length = t.length
            }), e._zod.check = i => {
                let r = i.value,
                    n = r.length;
                if (n === t.length) return;
                let a = te(r),
                    o = n > t.length;
                i.issues.push({
                    origin: a,
                    ...o ? {
                        code: "too_big",
                        maximum: t.length
                    } : {
                        code: "too_small",
                        minimum: t.length
                    },
                    inclusive: !0,
                    exact: !0,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iR = eS("$ZodCheckStringFormat", (e, t) => {
            var i, r;
            iZ.init(e, t), e._zod.onattach.push(e => {
                let i = e._zod.bag;
                i.format = t.format, t.pattern && (i.patterns ? ? (i.patterns = new Set), i.patterns.add(t.pattern))
            }), t.pattern ? (i = e._zod).check ? ? (i.check = i => {
                t.pattern.lastIndex = 0, t.pattern.test(i.value) || i.issues.push({
                    origin: "string",
                    code: "invalid_format",
                    format: t.format,
                    input: i.value,
                    ...t.pattern ? {
                        pattern: t.pattern.toString()
                    } : {},
                    inst: e,
                    continue: !t.abort
                })
            }) : (r = e._zod).check ? ? (r.check = () => {})
        }),
        iV = eS("$ZodCheckRegex", (e, t) => {
            iR.init(e, t), e._zod.check = i => {
                t.pattern.lastIndex = 0, t.pattern.test(i.value) || i.issues.push({
                    origin: "string",
                    code: "invalid_format",
                    format: "regex",
                    input: i.value,
                    pattern: t.pattern.toString(),
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iJ = eS("$ZodCheckLowerCase", (e, t) => {
            t.pattern ? ? (t.pattern = ip), iR.init(e, t)
        }),
        iM = eS("$ZodCheckUpperCase", (e, t) => {
            t.pattern ? ? (t.pattern = iv), iR.init(e, t)
        }),
        iW = eS("$ZodCheckIncludes", (e, t) => {
            iZ.init(e, t);
            let i = eH(t.includes),
                r = new RegExp("number" == typeof t.position ? `^.{${t.position}}${i}` : i);
            t.pattern = r, e._zod.onattach.push(e => {
                let t = e._zod.bag;
                t.patterns ? ? (t.patterns = new Set), t.patterns.add(r)
            }), e._zod.check = i => {
                i.value.includes(t.includes, t.position) || i.issues.push({
                    origin: "string",
                    code: "invalid_format",
                    format: "includes",
                    includes: t.includes,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iB = eS("$ZodCheckStartsWith", (e, t) => {
            iZ.init(e, t);
            let i = RegExp(`^${eH(t.prefix)}.*`);
            t.pattern ? ? (t.pattern = i), e._zod.onattach.push(e => {
                let t = e._zod.bag;
                t.patterns ? ? (t.patterns = new Set), t.patterns.add(i)
            }), e._zod.check = i => {
                i.value.startsWith(t.prefix) || i.issues.push({
                    origin: "string",
                    code: "invalid_format",
                    format: "starts_with",
                    prefix: t.prefix,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iG = eS("$ZodCheckEndsWith", (e, t) => {
            iZ.init(e, t);
            let i = RegExp(`.*${eH(t.suffix)}$`);
            t.pattern ? ? (t.pattern = i), e._zod.onattach.push(e => {
                let t = e._zod.bag;
                t.patterns ? ? (t.patterns = new Set), t.patterns.add(i)
            }), e._zod.check = i => {
                i.value.endsWith(t.suffix) || i.issues.push({
                    origin: "string",
                    code: "invalid_format",
                    format: "ends_with",
                    suffix: t.suffix,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        });

    function iK(e, t, i) {
        e.issues.length && t.issues.push(...e3(i, e.issues))
    }
    let iX = eS("$ZodCheckProperty", (e, t) => {
            iZ.init(e, t), e._zod.check = e => {
                let i = t.schema._zod.run({
                    value: e.value[t.property],
                    issues: []
                }, {});
                if (i instanceof Promise) return i.then(i => iK(i, e, t.property));
                iK(i, e, t.property)
            }
        }),
        iq = eS("$ZodCheckMimeType", (e, t) => {
            iZ.init(e, t);
            let i = new Set(t.mime);
            e._zod.onattach.push(e => {
                e._zod.bag.mime = t.mime
            }), e._zod.check = r => {
                i.has(r.value.type) || r.issues.push({
                    code: "invalid_value",
                    values: t.mime,
                    input: r.value.type,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        iH = eS("$ZodCheckOverwrite", (e, t) => {
            iZ.init(e, t), e._zod.check = e => {
                e.value = t.tx(e.value)
            }
        });
    e.s(["$ZodCheck", 0, iZ, "$ZodCheckBigIntFormat", 0, iP, "$ZodCheckEndsWith", 0, iG, "$ZodCheckGreaterThan", 0, iD, "$ZodCheckIncludes", 0, iW, "$ZodCheckLengthEquals", 0, iF, "$ZodCheckLessThan", 0, iO, "$ZodCheckLowerCase", 0, iJ, "$ZodCheckMaxLength", 0, iC, "$ZodCheckMaxSize", 0, iE, "$ZodCheckMimeType", 0, iq, "$ZodCheckMinLength", 0, iL, "$ZodCheckMinSize", 0, iA, "$ZodCheckMultipleOf", 0, ij, "$ZodCheckNumberFormat", 0, iN, "$ZodCheckOverwrite", 0, iH, "$ZodCheckProperty", 0, iX, "$ZodCheckRegex", 0, iV, "$ZodCheckSizeEquals", 0, iT, "$ZodCheckStartsWith", 0, iB, "$ZodCheckStringFormat", 0, iR, "$ZodCheckUpperCase", 0, iM], 55605);
    class iY {
        constructor(e = []) {
            this.content = [], this.indent = 0, this && (this.args = e)
        }
        indented(e) {
            this.indent += 1, e(this), this.indent -= 1
        }
        write(e) {
            if ("function" == typeof e) {
                e(this, {
                    execution: "sync"
                }), e(this, {
                    execution: "async"
                });
                return
            }
            let t = e.split("\n").filter(e => e),
                i = Math.min(...t.map(e => e.length - e.trimStart().length));
            for (let e of t.map(e => e.slice(i)).map(e => " ".repeat(2 * this.indent) + e)) this.content.push(e)
        }
        compile() {
            return Function(...this ? .args, [...(this ? .content ? ? [""]).map(e => `  ${e}`)].join("\n"))
        }
    }
    e.s(["Doc", 0, iY], 98530);
    let iQ = {
        major: 4,
        minor: 4,
        patch: 3
    };
    e.s(["version", 0, iQ], 98477);
    let i0 = eS("$ZodType", (e, t) => {
            var i;
            e ? ? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = iQ;
            let r = [...e._zod.def.checks ? ? []];
            for (let t of (e._zod.traits.has("$ZodCheck") && r.unshift(e), r))
                for (let i of t._zod.onattach) i(e);
            if (0 === r.length)(i = e._zod).deferred ? ? (i.deferred = []), e._zod.deferred ? .push(() => {
                e._zod.run = e._zod.parse
            });
            else {
                let t = (e, t, i) => {
                        let r, n = e2(e);
                        for (let a of t) {
                            if (a._zod.def.when) {
                                if (e9(e) || !a._zod.def.when(e)) continue
                            } else if (n) continue;
                            let t = e.issues.length,
                                o = a._zod.check(e);
                            if (o instanceof Promise && i ? .async === !1) throw new ez;
                            if (r || o instanceof Promise) r = (r ? ? Promise.resolve()).then(async () => {
                                await o, e.issues.length !== t && (n || (n = e2(e, t)))
                            });
                            else {
                                if (e.issues.length === t) continue;
                                n || (n = e2(e, t))
                            }
                        }
                        return r ? r.then(() => e) : e
                    },
                    i = (i, n, a) => {
                        if (e2(i)) return i.aborted = !0, i;
                        let o = t(n, r, a);
                        if (o instanceof Promise) {
                            if (!1 === a.async) throw new ez;
                            return o.then(t => e._zod.parse(t, a))
                        }
                        return e._zod.parse(o, a)
                    };
                e._zod.run = (n, a) => {
                    if (a.skipChecks) return e._zod.parse(n, a);
                    if ("backward" === a.direction) {
                        let t = e._zod.parse({
                            value: n.value,
                            issues: []
                        }, { ...a,
                            skipChecks: !0
                        });
                        return t instanceof Promise ? t.then(e => i(e, n, a)) : i(t, n, a)
                    }
                    let o = e._zod.parse(n, a);
                    if (o instanceof Promise) {
                        if (!1 === a.async) throw new ez;
                        return o.then(e => t(e, r, a))
                    }
                    return t(o, r, a)
                }
            }
            eL(e, "~standard", () => ({
                validate: t => {
                    try {
                        let i = t$(e, t);
                        return i.success ? {
                            value: i.data
                        } : {
                            issues: i.error ? .issues
                        }
                    } catch (i) {
                        return t_(e, t).then(e => e.success ? {
                            value: e.data
                        } : {
                            issues: e.error ? .issues
                        })
                    }
                },
                vendor: "zod",
                version: 1
            }))
        }),
        i4 = eS("$ZodString", (e, t) => {
            i0.init(e, t), e._zod.pattern = [...e ? ._zod.bag ? .patterns ? ? []].pop() ? ? io(e._zod.bag), e._zod.parse = (i, r) => {
                if (t.coerce) try {
                    i.value = String(i.value)
                } catch (e) {}
                return "string" == typeof i.value || i.issues.push({
                    expected: "string",
                    code: "invalid_type",
                    input: i.value,
                    inst: e
                }), i
            }
        }),
        i6 = eS("$ZodStringFormat", (e, t) => {
            iR.init(e, t), i4.init(e, t)
        }),
        i1 = eS("$ZodGUID", (e, t) => {
            t.pattern ? ? (t.pattern = tG), i6.init(e, t)
        }),
        i2 = eS("$ZodUUID", (e, t) => {
            if (t.version) {
                let e = {
                    v1: 1,
                    v2: 2,
                    v3: 3,
                    v4: 4,
                    v5: 5,
                    v6: 6,
                    v7: 7,
                    v8: 8
                }[t.version];
                if (void 0 === e) throw Error(`Invalid UUID version: "${t.version}"`);
                t.pattern ? ? (t.pattern = tK(e))
            } else t.pattern ? ? (t.pattern = tK());
            i6.init(e, t)
        }),
        i9 = eS("$ZodEmail", (e, t) => {
            t.pattern ? ? (t.pattern = tY), i6.init(e, t)
        }),
        i3 = eS("$ZodURL", (e, t) => {
            i6.init(e, t), e._zod.check = i => {
                try {
                    let r = i.value.trim();
                    if (!t.normalize && t.protocol ? .source === t5.source && !/^https?:\/\//i.test(r)) return void i.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid URL format",
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    });
                    let n = new URL(r);
                    t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(n.hostname) || i.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: t.hostname.source,
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(n.protocol.endsWith(":") ? n.protocol.slice(0, -1) : n.protocol) || i.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: t.protocol.source,
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    })), t.normalize ? i.value = n.href : i.value = r;
                    return
                } catch (r) {
                    i.issues.push({
                        code: "invalid_format",
                        format: "url",
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    })
                }
            }
        }),
        i7 = eS("$ZodEmoji", (e, t) => {
            t.pattern ? ? (t.pattern = t0()), i6.init(e, t)
        }),
        i5 = eS("$ZodNanoID", (e, t) => {
            t.pattern ? ? (t.pattern = tW), i6.init(e, t)
        }),
        i8 = eS("$ZodCUID", (e, t) => {
            t.pattern ? ? (t.pattern = tF), i6.init(e, t)
        }),
        re = eS("$ZodCUID2", (e, t) => {
            t.pattern ? ? (t.pattern = tR), i6.init(e, t)
        }),
        rt = eS("$ZodULID", (e, t) => {
            t.pattern ? ? (t.pattern = tV), i6.init(e, t)
        }),
        ri = eS("$ZodXID", (e, t) => {
            t.pattern ? ? (t.pattern = tJ), i6.init(e, t)
        }),
        rr = eS("$ZodKSUID", (e, t) => {
            t.pattern ? ? (t.pattern = tM), i6.init(e, t)
        }),
        rn = eS("$ZodISODateTime", (e, t) => {
            t.pattern ? ? (t.pattern = ia(t)), i6.init(e, t)
        }),
        ra = eS("$ZodISODate", (e, t) => {
            t.pattern ? ? (t.pattern = it), i6.init(e, t)
        }),
        ro = eS("$ZodISOTime", (e, t) => {
            t.pattern ? ? (t.pattern = ir(t)), i6.init(e, t)
        }),
        ru = eS("$ZodISODuration", (e, t) => {
            t.pattern ? ? (t.pattern = tB), i6.init(e, t)
        }),
        rs = eS("$ZodIPv4", (e, t) => {
            t.pattern ? ? (t.pattern = t4), i6.init(e, t), e._zod.bag.format = "ipv4"
        }),
        rl = eS("$ZodIPv6", (e, t) => {
            t.pattern ? ? (t.pattern = t6), i6.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = i => {
                try {
                    new URL(`http://[${i.value}]`)
                } catch {
                    i.issues.push({
                        code: "invalid_format",
                        format: "ipv6",
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    })
                }
            }
        }),
        rd = eS("$ZodMAC", (e, t) => {
            t.pattern ? ? (t.pattern = t1(t.delimiter)), i6.init(e, t), e._zod.bag.format = "mac"
        }),
        rc = eS("$ZodCIDRv4", (e, t) => {
            t.pattern ? ? (t.pattern = t2), i6.init(e, t)
        }),
        rm = eS("$ZodCIDRv6", (e, t) => {
            t.pattern ? ? (t.pattern = t9), i6.init(e, t), e._zod.check = i => {
                let r = i.value.split("/");
                try {
                    if (2 !== r.length) throw Error();
                    let [e, t] = r;
                    if (!t) throw Error();
                    let i = Number(t);
                    if (`${i}` !== t || i < 0 || i > 128) throw Error();
                    new URL(`http://[${e}]`)
                } catch {
                    i.issues.push({
                        code: "invalid_format",
                        format: "cidrv6",
                        input: i.value,
                        inst: e,
                        continue: !t.abort
                    })
                }
            }
        });

    function rf(e) {
        if ("" === e) return !0;
        if (/\s/.test(e) || e.length % 4 != 0) return !1;
        try {
            return atob(e), !0
        } catch {
            return !1
        }
    }
    let rp = eS("$ZodBase64", (e, t) => {
        t.pattern ? ? (t.pattern = t3), i6.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = i => {
            rf(i.value) || i.issues.push({
                code: "invalid_format",
                format: "base64",
                input: i.value,
                inst: e,
                continue: !t.abort
            })
        }
    });

    function rv(e) {
        if (!t7.test(e)) return !1;
        let t = e.replace(/[-_]/g, e => "-" === e ? "+" : "/");
        return rf(t.padEnd(4 * Math.ceil(t.length / 4), "="))
    }
    let rg = eS("$ZodBase64URL", (e, t) => {
            t.pattern ? ? (t.pattern = t7), i6.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = i => {
                rv(i.value) || i.issues.push({
                    code: "invalid_format",
                    format: "base64url",
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        rh = eS("$ZodE164", (e, t) => {
            t.pattern ? ? (t.pattern = t8), i6.init(e, t)
        });

    function r$(e, t = null) {
        try {
            let i = e.split(".");
            if (3 !== i.length) return !1;
            let [r] = i;
            if (!r) return !1;
            let n = JSON.parse(atob(r));
            if ("typ" in n && n ? .typ !== "JWT" || !n.alg || t && (!("alg" in n) || n.alg !== t)) return !1;
            return !0
        } catch {
            return !1
        }
    }
    let ry = eS("$ZodJWT", (e, t) => {
            i6.init(e, t), e._zod.check = i => {
                r$(i.value, t.alg) || i.issues.push({
                    code: "invalid_format",
                    format: "jwt",
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        r_ = eS("$ZodCustomStringFormat", (e, t) => {
            i6.init(e, t), e._zod.check = i => {
                t.fn(i.value) || i.issues.push({
                    code: "invalid_format",
                    format: t.format,
                    input: i.value,
                    inst: e,
                    continue: !t.abort
                })
            }
        }),
        rb = eS("$ZodNumber", (e, t) => {
            i0.init(e, t), e._zod.pattern = e._zod.bag.pattern ? ? il, e._zod.parse = (i, r) => {
                if (t.coerce) try {
                    i.value = Number(i.value)
                } catch (e) {}
                let n = i.value;
                if ("number" == typeof n && !Number.isNaN(n) && Number.isFinite(n)) return i;
                let a = "number" == typeof n ? Number.isNaN(n) ? "NaN" : Number.isFinite(n) ? void 0 : "Infinity" : void 0;
                return i.issues.push({
                    expected: "number",
                    code: "invalid_type",
                    input: n,
                    inst: e,
                    ...a ? {
                        received: a
                    } : {}
                }), i
            }
        }),
        rx = eS("$ZodNumberFormat", (e, t) => {
            iN.init(e, t), rb.init(e, t)
        }),
        rk = eS("$ZodBoolean", (e, t) => {
            i0.init(e, t), e._zod.pattern = id, e._zod.parse = (i, r) => {
                if (t.coerce) try {
                    i.value = !!i.value
                } catch (e) {}
                let n = i.value;
                return "boolean" == typeof n || i.issues.push({
                    expected: "boolean",
                    code: "invalid_type",
                    input: n,
                    inst: e
                }), i
            }
        }),
        rI = eS("$ZodBigInt", (e, t) => {
            i0.init(e, t), e._zod.pattern = iu, e._zod.parse = (i, r) => {
                if (t.coerce) try {
                    i.value = BigInt(i.value)
                } catch (e) {}
                return "bigint" == typeof i.value || i.issues.push({
                    expected: "bigint",
                    code: "invalid_type",
                    input: i.value,
                    inst: e
                }), i
            }
        }),
        rS = eS("$ZodBigIntFormat", (e, t) => {
            iP.init(e, t), rI.init(e, t)
        }),
        rw = eS("$ZodSymbol", (e, t) => {
            i0.init(e, t), e._zod.parse = (t, i) => {
                let r = t.value;
                return "symbol" == typeof r || t.issues.push({
                    expected: "symbol",
                    code: "invalid_type",
                    input: r,
                    inst: e
                }), t
            }
        }),
        rz = eS("$ZodUndefined", (e, t) => {
            i0.init(e, t), e._zod.pattern = im, e._zod.values = new Set([void 0]), e._zod.parse = (t, i) => {
                let r = t.value;
                return void 0 === r || t.issues.push({
                    expected: "undefined",
                    code: "invalid_type",
                    input: r,
                    inst: e
                }), t
            }
        }),
        rZ = eS("$ZodNull", (e, t) => {
            i0.init(e, t), e._zod.pattern = ic, e._zod.values = new Set([null]), e._zod.parse = (t, i) => {
                let r = t.value;
                return null === r || t.issues.push({
                    expected: "null",
                    code: "invalid_type",
                    input: r,
                    inst: e
                }), t
            }
        }),
        rU = eS("$ZodAny", (e, t) => {
            i0.init(e, t), e._zod.parse = e => e
        }),
        rO = eS("$ZodUnknown", (e, t) => {
            i0.init(e, t), e._zod.parse = e => e
        }),
        rD = eS("$ZodNever", (e, t) => {
            i0.init(e, t), e._zod.parse = (t, i) => (t.issues.push({
                expected: "never",
                code: "invalid_type",
                input: t.value,
                inst: e
            }), t)
        }),
        rj = eS("$ZodVoid", (e, t) => {
            i0.init(e, t), e._zod.parse = (t, i) => {
                let r = t.value;
                return void 0 === r || t.issues.push({
                    expected: "void",
                    code: "invalid_type",
                    input: r,
                    inst: e
                }), t
            }
        }),
        rN = eS("$ZodDate", (e, t) => {
            i0.init(e, t), e._zod.parse = (i, r) => {
                if (t.coerce) try {
                    i.value = new Date(i.value)
                } catch (e) {}
                let n = i.value,
                    a = n instanceof Date;
                return a && !Number.isNaN(n.getTime()) || i.issues.push({
                    expected: "date",
                    code: "invalid_type",
                    input: n,
                    ...a ? {
                        received: "Invalid Date"
                    } : {},
                    inst: e
                }), i
            }
        });

    function rP(e, t, i) {
        e.issues.length && t.issues.push(...e3(i, e.issues)), t.value[i] = e.value
    }
    let rE = eS("$ZodArray", (e, t) => {
        i0.init(e, t), e._zod.parse = (i, r) => {
            let n = i.value;
            if (!Array.isArray(n)) return i.issues.push({
                expected: "array",
                code: "invalid_type",
                input: n,
                inst: e
            }), i;
            i.value = Array(n.length);
            let a = [];
            for (let e = 0; e < n.length; e++) {
                let o = n[e],
                    u = t.element._zod.run({
                        value: o,
                        issues: []
                    }, r);
                u instanceof Promise ? a.push(u.then(t => rP(t, i, e))) : rP(u, i, e)
            }
            return a.length ? Promise.all(a).then(() => i) : i
        }
    });

    function rA(e, t, i, r, n, a) {
        let o = i in r;
        if (e.issues.length) {
            if (n && a && !o) return;
            t.issues.push(...e3(i, e.issues))
        }
        if (!o && !n) {
            e.issues.length || t.issues.push({
                code: "invalid_type",
                expected: "nonoptional",
                input: void 0,
                path: [i]
            });
            return
        }
        void 0 === e.value ? o && (t.value[i] = void 0) : t.value[i] = e.value
    }

    function rT(e) {
        let t = Object.keys(e.shape);
        for (let i of t)
            if (!e.shape ? .[i] ? ._zod ? .traits ? .has("$ZodType")) throw Error(`Invalid element at key "${i}": expected a Zod schema`);
        let i = e4(e.shape);
        return { ...e,
            keys: t,
            keySet: new Set(t),
            numKeys: t.length,
            optionalKeys: new Set(i)
        }
    }

    function rC(e, t, i, r, n, a) {
        let o = [],
            u = n.keySet,
            s = n.catchall._zod,
            l = s.def.type,
            d = "optional" === s.optin,
            c = "optional" === s.optout;
        for (let n in t) {
            if ("__proto__" === n || u.has(n)) continue;
            if ("never" === l) {
                o.push(n);
                continue
            }
            let a = s.run({
                value: t[n],
                issues: []
            }, r);
            a instanceof Promise ? e.push(a.then(e => rA(e, i, n, t, d, c))) : rA(a, i, n, t, d, c)
        }
        return (o.length && i.issues.push({
            code: "unrecognized_keys",
            keys: o,
            input: t,
            inst: a
        }), e.length) ? Promise.all(e).then(() => i) : i
    }
    let rL = eS("$ZodObject", (e, t) => {
            let i;
            i0.init(e, t);
            let r = Object.getOwnPropertyDescriptor(t, "shape");
            if (!r ? .get) {
                let e = t.shape;
                Object.defineProperty(t, "shape", {
                    get: () => {
                        let i = { ...e
                        };
                        return Object.defineProperty(t, "shape", {
                            value: i
                        }), i
                    }
                })
            }
            let n = eP(() => rT(t));
            eL(e._zod, "propValues", () => {
                let e = t.shape,
                    i = {};
                for (let t in e) {
                    let r = e[t]._zod;
                    if (r.values)
                        for (let e of (i[t] ? ? (i[t] = new Set), r.values)) i[t].add(e)
                }
                return i
            });
            let a = t.catchall;
            e._zod.parse = (t, r) => {
                i ? ? (i = n.value);
                let o = t.value;
                if (!eW(o)) return t.issues.push({
                    expected: "object",
                    code: "invalid_type",
                    input: o,
                    inst: e
                }), t;
                t.value = {};
                let u = [],
                    s = i.shape;
                for (let e of i.keys) {
                    let i = s[e],
                        n = "optional" === i._zod.optin,
                        a = "optional" === i._zod.optout,
                        l = i._zod.run({
                            value: o[e],
                            issues: []
                        }, r);
                    l instanceof Promise ? u.push(l.then(i => rA(i, t, e, o, n, a))) : rA(l, t, e, o, n, a)
                }
                return a ? rC(u, o, t, r, n.value, e) : u.length ? Promise.all(u).then(() => t) : t
            }
        }),
        rF = eS("$ZodObjectJIT", (e, t) => {
            let i, r;
            rL.init(e, t);
            let n = e._zod.parse,
                a = eP(() => rT(t)),
                o = !eU.jitless,
                u = o && eB.value,
                s = t.catchall;
            e._zod.parse = (l, d) => {
                r ? ? (r = a.value);
                let c = l.value;
                return eW(c) ? o && u && d ? .async === !1 && !0 !== d.jitless ? (i || (i = (e => {
                    let t = new iY(["shape", "payload", "ctx"]),
                        i = a.value,
                        r = e => {
                            let t = eV(e);
                            return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`
                        };
                    t.write("const input = payload.value;");
                    let n = Object.create(null),
                        o = 0;
                    for (let e of i.keys) n[e] = `key_${o++}`;
                    for (let a of (t.write("const newResult = {};"), i.keys)) {
                        let i = n[a],
                            o = eV(a),
                            u = e[a],
                            s = u ? ._zod ? .optin === "optional",
                            l = u ? ._zod ? .optout === "optional";
                        t.write(`const ${i} = ${r(a)};`), s && l ? t.write(`
        if (${i}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${i}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${i}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${i}.value;
        }
        
      `) : s ? t.write(`
        if (${i}.issues.length) {
          payload.issues = payload.issues.concat(${i}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${i}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${i}.value;
        }
        
      `) : t.write(`
        const ${i}_present = ${o} in input;
        if (${i}.issues.length) {
          payload.issues = payload.issues.concat(${i}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${i}_present && !${i}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${i}_present) {
          if (${i}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${i}.value;
          }
        }

      `)
                    }
                    t.write("payload.value = newResult;"), t.write("return payload;");
                    let u = t.compile();
                    return (t, i) => u(e, t, i)
                })(t.shape)), l = i(l, d), s) ? rC([], c, l, d, r, e) : l : n(l, d) : (l.issues.push({
                    expected: "object",
                    code: "invalid_type",
                    input: c,
                    inst: e
                }), l)
            }
        });

    function rR(e, t, i, r) {
        for (let i of e)
            if (0 === i.issues.length) return t.value = i.value, t;
        let n = e.filter(e => !e2(e));
        return 1 === n.length ? (t.value = n[0].value, n[0]) : (t.issues.push({
            code: "invalid_union",
            input: t.value,
            inst: i,
            errors: e.map(e => e.issues.map(e => e5(e, r, eO())))
        }), t)
    }
    let rV = eS("$ZodUnion", (e, t) => {
        i0.init(e, t), eL(e._zod, "optin", () => t.options.some(e => "optional" === e._zod.optin) ? "optional" : void 0), eL(e._zod, "optout", () => t.options.some(e => "optional" === e._zod.optout) ? "optional" : void 0), eL(e._zod, "values", () => {
            if (t.options.every(e => e._zod.values)) return new Set(t.options.flatMap(e => Array.from(e._zod.values)))
        }), eL(e._zod, "pattern", () => {
            if (t.options.every(e => e._zod.pattern)) {
                let e = t.options.map(e => e._zod.pattern);
                return RegExp(`^(${e.map(e=>eA(e.source)).join("|")})$`)
            }
        });
        let i = 1 === t.options.length ? t.options[0]._zod.run : null;
        e._zod.parse = (r, n) => {
            if (i) return i(r, n);
            let a = !1,
                o = [];
            for (let e of t.options) {
                let t = e._zod.run({
                    value: r.value,
                    issues: []
                }, n);
                if (t instanceof Promise) o.push(t), a = !0;
                else {
                    if (0 === t.issues.length) return t;
                    o.push(t)
                }
            }
            return a ? Promise.all(o).then(t => rR(t, r, e, n)) : rR(o, r, e, n)
        }
    });

    function rJ(e, t, i, r) {
        let n = e.filter(e => 0 === e.issues.length);
        return 1 === n.length ? t.value = n[0].value : 0 === n.length ? t.issues.push({
            code: "invalid_union",
            input: t.value,
            inst: i,
            errors: e.map(e => e.issues.map(e => e5(e, r, eO())))
        }) : t.issues.push({
            code: "invalid_union",
            input: t.value,
            inst: i,
            errors: [],
            inclusive: !1
        }), t
    }
    let rM = eS("$ZodXor", (e, t) => {
            rV.init(e, t), t.inclusive = !1;
            let i = 1 === t.options.length ? t.options[0]._zod.run : null;
            e._zod.parse = (r, n) => {
                if (i) return i(r, n);
                let a = !1,
                    o = [];
                for (let e of t.options) {
                    let t = e._zod.run({
                        value: r.value,
                        issues: []
                    }, n);
                    t instanceof Promise ? (o.push(t), a = !0) : o.push(t)
                }
                return a ? Promise.all(o).then(t => rJ(t, r, e, n)) : rJ(o, r, e, n)
            }
        }),
        rW = eS("$ZodDiscriminatedUnion", (e, t) => {
            t.inclusive = !1, rV.init(e, t);
            let i = e._zod.parse;
            eL(e._zod, "propValues", () => {
                let e = {};
                for (let i of t.options) {
                    let r = i._zod.propValues;
                    if (!r || 0 === Object.keys(r).length) throw Error(`Invalid discriminated union option at index "${t.options.indexOf(i)}"`);
                    for (let [t, i] of Object.entries(r))
                        for (let r of (e[t] || (e[t] = new Set), i)) e[t].add(r)
                }
                return e
            });
            let r = eP(() => {
                let e = t.options,
                    i = new Map;
                for (let r of e) {
                    let e = r._zod.propValues ? .[t.discriminator];
                    if (!e || 0 === e.size) throw Error(`Invalid discriminated union option at index "${t.options.indexOf(r)}"`);
                    for (let t of e) {
                        if (i.has(t)) throw Error(`Duplicate discriminator value "${String(t)}"`);
                        i.set(t, r)
                    }
                }
                return i
            });
            e._zod.parse = (n, a) => {
                let o = n.value;
                if (!eW(o)) return n.issues.push({
                    code: "invalid_type",
                    expected: "object",
                    input: o,
                    inst: e
                }), n;
                let u = r.value.get(o ? .[t.discriminator]);
                return u ? u._zod.run(n, a) : t.unionFallback || "backward" === a.direction ? i(n, a) : (n.issues.push({
                    code: "invalid_union",
                    errors: [],
                    note: "No matching discriminator",
                    discriminator: t.discriminator,
                    options: Array.from(r.value.keys()),
                    input: o,
                    path: [t.discriminator],
                    inst: e
                }), n)
            }
        }),
        rB = eS("$ZodIntersection", (e, t) => {
            i0.init(e, t), e._zod.parse = (e, i) => {
                let r = e.value,
                    n = t.left._zod.run({
                        value: r,
                        issues: []
                    }, i),
                    a = t.right._zod.run({
                        value: r,
                        issues: []
                    }, i);
                return n instanceof Promise || a instanceof Promise ? Promise.all([n, a]).then(([t, i]) => rG(e, t, i)) : rG(e, n, a)
            }
        });

    function rG(e, t, i) {
        let r, n = new Map;
        for (let i of t.issues)
            if ("unrecognized_keys" === i.code)
                for (let e of (r ? ? (r = i), i.keys)) n.has(e) || n.set(e, {}), n.get(e).l = !0;
            else e.issues.push(i);
        for (let t of i.issues)
            if ("unrecognized_keys" === t.code)
                for (let e of t.keys) n.has(e) || n.set(e, {}), n.get(e).r = !0;
            else e.issues.push(t);
        let a = [...n].filter(([, e]) => e.l && e.r).map(([e]) => e);
        if (a.length && r && e.issues.push({ ...r,
                keys: a
            }), e2(e)) return e;
        let o = function e(t, i) {
            if (t === i || t instanceof Date && i instanceof Date && +t == +i) return {
                valid: !0,
                data: t
            };
            if (eG(t) && eG(i)) {
                let r = Object.keys(i),
                    n = Object.keys(t).filter(e => -1 !== r.indexOf(e)),
                    a = { ...t,
                        ...i
                    };
                for (let r of n) {
                    let n = e(t[r], i[r]);
                    if (!n.valid) return {
                        valid: !1,
                        mergeErrorPath: [r, ...n.mergeErrorPath]
                    };
                    a[r] = n.data
                }
                return {
                    valid: !0,
                    data: a
                }
            }
            if (Array.isArray(t) && Array.isArray(i)) {
                if (t.length !== i.length) return {
                    valid: !1,
                    mergeErrorPath: []
                };
                let r = [];
                for (let n = 0; n < t.length; n++) {
                    let a = e(t[n], i[n]);
                    if (!a.valid) return {
                        valid: !1,
                        mergeErrorPath: [n, ...a.mergeErrorPath]
                    };
                    r.push(a.data)
                }
                return {
                    valid: !0,
                    data: r
                }
            }
            return {
                valid: !1,
                mergeErrorPath: []
            }
        }(t.value, i.value);
        if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
        return e.value = o.data, e
    }
    let rK = eS("$ZodTuple", (e, t) => {
        i0.init(e, t);
        let i = t.items;
        e._zod.parse = (r, n) => {
            let a = r.value;
            if (!Array.isArray(a)) return r.issues.push({
                input: a,
                inst: e,
                expected: "tuple",
                code: "invalid_type"
            }), r;
            r.value = [];
            let o = [],
                u = rX(i, "optin"),
                s = rX(i, "optout");
            if (!t.rest) {
                if (a.length < u) return r.issues.push({
                    code: "too_small",
                    minimum: u,
                    inclusive: !0,
                    input: a,
                    inst: e,
                    origin: "array"
                }), r;
                a.length > i.length && r.issues.push({
                    code: "too_big",
                    maximum: i.length,
                    inclusive: !0,
                    input: a,
                    inst: e,
                    origin: "array"
                })
            }
            let l = Array(i.length);
            for (let e = 0; e < i.length; e++) {
                let t = i[e]._zod.run({
                    value: a[e],
                    issues: []
                }, n);
                t instanceof Promise ? o.push(t.then(t => {
                    l[e] = t
                })) : l[e] = t
            }
            if (t.rest) {
                let e = i.length - 1;
                for (let u of a.slice(i.length)) {
                    e++;
                    let i = t.rest._zod.run({
                        value: u,
                        issues: []
                    }, n);
                    i instanceof Promise ? o.push(i.then(t => rq(t, r, e))) : rq(i, r, e)
                }
            }
            return o.length ? Promise.all(o).then(() => rH(l, r, i, a, s)) : rH(l, r, i, a, s)
        }
    });

    function rX(e, t) {
        for (let i = e.length - 1; i >= 0; i--)
            if ("optional" !== e[i]._zod[t]) return i + 1;
        return 0
    }

    function rq(e, t, i) {
        e.issues.length && t.issues.push(...e3(i, e.issues)), t.value[i] = e.value
    }

    function rH(e, t, i, r, n) {
        for (let a = 0; a < i.length; a++) {
            let i = e[a],
                o = a < r.length;
            if (i.issues.length) {
                if (!o && a >= n) {
                    t.value.length = a;
                    break
                }
                t.issues.push(...e3(a, i.issues))
            }
            t.value[a] = i.value
        }
        for (let e = t.value.length - 1; e >= r.length; e--)
            if ("optional" === i[e]._zod.optout && void 0 === t.value[e]) t.value.length = e;
            else break;
        return t
    }
    let rY = eS("$ZodRecord", (e, t) => {
            i0.init(e, t), e._zod.parse = (i, r) => {
                let n = i.value;
                if (!eG(n)) return i.issues.push({
                    expected: "record",
                    code: "invalid_type",
                    input: n,
                    inst: e
                }), i;
                let a = [],
                    o = t.keyType._zod.values;
                if (o) {
                    let u;
                    i.value = {};
                    let s = new Set;
                    for (let u of o)
                        if ("string" == typeof u || "number" == typeof u || "symbol" == typeof u) {
                            s.add("number" == typeof u ? u.toString() : u);
                            let o = t.keyType._zod.run({
                                value: u,
                                issues: []
                            }, r);
                            if (o instanceof Promise) throw Error("Async schemas not supported in object keys currently");
                            if (o.issues.length) {
                                i.issues.push({
                                    code: "invalid_key",
                                    origin: "record",
                                    issues: o.issues.map(e => e5(e, r, eO())),
                                    input: u,
                                    path: [u],
                                    inst: e
                                });
                                continue
                            }
                            let l = o.value,
                                d = t.valueType._zod.run({
                                    value: n[u],
                                    issues: []
                                }, r);
                            d instanceof Promise ? a.push(d.then(e => {
                                e.issues.length && i.issues.push(...e3(u, e.issues)), i.value[l] = e.value
                            })) : (d.issues.length && i.issues.push(...e3(u, d.issues)), i.value[l] = d.value)
                        }
                    for (let e in n) s.has(e) || (u = u ? ? []).push(e);
                    u && u.length > 0 && i.issues.push({
                        code: "unrecognized_keys",
                        input: n,
                        inst: e,
                        keys: u
                    })
                } else
                    for (let o of (i.value = {}, Reflect.ownKeys(n))) {
                        if ("__proto__" === o || !Object.prototype.propertyIsEnumerable.call(n, o)) continue;
                        let u = t.keyType._zod.run({
                            value: o,
                            issues: []
                        }, r);
                        if (u instanceof Promise) throw Error("Async schemas not supported in object keys currently");
                        if ("string" == typeof o && il.test(o) && u.issues.length) {
                            let e = t.keyType._zod.run({
                                value: Number(o),
                                issues: []
                            }, r);
                            if (e instanceof Promise) throw Error("Async schemas not supported in object keys currently");
                            0 === e.issues.length && (u = e)
                        }
                        if (u.issues.length) {
                            "loose" === t.mode ? i.value[o] = n[o] : i.issues.push({
                                code: "invalid_key",
                                origin: "record",
                                issues: u.issues.map(e => e5(e, r, eO())),
                                input: o,
                                path: [o],
                                inst: e
                            });
                            continue
                        }
                        let s = t.valueType._zod.run({
                            value: n[o],
                            issues: []
                        }, r);
                        s instanceof Promise ? a.push(s.then(e => {
                            e.issues.length && i.issues.push(...e3(o, e.issues)), i.value[u.value] = e.value
                        })) : (s.issues.length && i.issues.push(...e3(o, s.issues)), i.value[u.value] = s.value)
                    }
                return a.length ? Promise.all(a).then(() => i) : i
            }
        }),
        rQ = eS("$ZodMap", (e, t) => {
            i0.init(e, t), e._zod.parse = (i, r) => {
                let n = i.value;
                if (!(n instanceof Map)) return i.issues.push({
                    expected: "map",
                    code: "invalid_type",
                    input: n,
                    inst: e
                }), i;
                let a = [];
                for (let [o, u] of (i.value = new Map, n)) {
                    let s = t.keyType._zod.run({
                            value: o,
                            issues: []
                        }, r),
                        l = t.valueType._zod.run({
                            value: u,
                            issues: []
                        }, r);
                    s instanceof Promise || l instanceof Promise ? a.push(Promise.all([s, l]).then(([t, a]) => {
                        r0(t, a, i, o, n, e, r)
                    })) : r0(s, l, i, o, n, e, r)
                }
                return a.length ? Promise.all(a).then(() => i) : i
            }
        });

    function r0(e, t, i, r, n, a, o) {
        e.issues.length && (eX.has(typeof r) ? i.issues.push(...e3(r, e.issues)) : i.issues.push({
            code: "invalid_key",
            origin: "map",
            input: n,
            inst: a,
            issues: e.issues.map(e => e5(e, o, eO()))
        })), t.issues.length && (eX.has(typeof r) ? i.issues.push(...e3(r, t.issues)) : i.issues.push({
            origin: "map",
            code: "invalid_element",
            input: n,
            inst: a,
            key: r,
            issues: t.issues.map(e => e5(e, o, eO()))
        })), i.value.set(e.value, t.value)
    }
    let r4 = eS("$ZodSet", (e, t) => {
        i0.init(e, t), e._zod.parse = (i, r) => {
            let n = i.value;
            if (!(n instanceof Set)) return i.issues.push({
                input: n,
                inst: e,
                expected: "set",
                code: "invalid_type"
            }), i;
            let a = [];
            for (let e of (i.value = new Set, n)) {
                let n = t.valueType._zod.run({
                    value: e,
                    issues: []
                }, r);
                n instanceof Promise ? a.push(n.then(e => r6(e, i))) : r6(n, i)
            }
            return a.length ? Promise.all(a).then(() => i) : i
        }
    });

    function r6(e, t) {
        e.issues.length && t.issues.push(...e.issues), t.value.add(e.value)
    }
    let r1 = eS("$ZodEnum", (e, t) => {
            i0.init(e, t);
            let i = eD(t.entries),
                r = new Set(i);
            e._zod.values = r, e._zod.pattern = RegExp(`^(${i.filter(e=>eX.has(typeof e)).map(e=>"string"==typeof e?eH(e):e.toString()).join("|")})$`), e._zod.parse = (t, n) => {
                let a = t.value;
                return r.has(a) || t.issues.push({
                    code: "invalid_value",
                    values: i,
                    input: a,
                    inst: e
                }), t
            }
        }),
        r2 = eS("$ZodLiteral", (e, t) => {
            if (i0.init(e, t), 0 === t.values.length) throw Error("Cannot create literal schema with no valid values");
            let i = new Set(t.values);
            e._zod.values = i, e._zod.pattern = RegExp(`^(${t.values.map(e=>"string"==typeof e?eH(e):e?eH(e.toString()):String(e)).join("|")})$`), e._zod.parse = (r, n) => {
                let a = r.value;
                return i.has(a) || r.issues.push({
                    code: "invalid_value",
                    values: t.values,
                    input: a,
                    inst: e
                }), r
            }
        }),
        r9 = eS("$ZodFile", (e, t) => {
            i0.init(e, t), e._zod.parse = (t, i) => {
                let r = t.value;
                return r instanceof File || t.issues.push({
                    expected: "file",
                    code: "invalid_type",
                    input: r,
                    inst: e
                }), t
            }
        }),
        r3 = eS("$ZodTransform", (e, t) => {
            i0.init(e, t), e._zod.optin = "optional", e._zod.parse = (i, r) => {
                if ("backward" === r.direction) throw new eZ(e.constructor.name);
                let n = t.transform(i.value, i);
                if (r.async) return (n instanceof Promise ? n : Promise.resolve(n)).then(e => (i.value = e, i.fallback = !0, i));
                if (n instanceof Promise) throw new ez;
                return i.value = n, i.fallback = !0, i
            }
        });

    function r7(e, t) {
        return void 0 === t && (e.issues.length || e.fallback) ? {
            issues: [],
            value: void 0
        } : e
    }
    let r5 = eS("$ZodOptional", (e, t) => {
            i0.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", eL(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0), eL(e._zod, "pattern", () => {
                let e = t.innerType._zod.pattern;
                return e ? RegExp(`^(${eA(e.source)})?$`) : void 0
            }), e._zod.parse = (e, i) => {
                if ("optional" === t.innerType._zod.optin) {
                    let r = e.value,
                        n = t.innerType._zod.run(e, i);
                    return n instanceof Promise ? n.then(e => r7(e, r)) : r7(n, r)
                }
                return void 0 === e.value ? e : t.innerType._zod.run(e, i)
            }
        }),
        r8 = eS("$ZodExactOptional", (e, t) => {
            r5.init(e, t), eL(e._zod, "values", () => t.innerType._zod.values), eL(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, i) => t.innerType._zod.run(e, i)
        }),
        ne = eS("$ZodNullable", (e, t) => {
            i0.init(e, t), eL(e._zod, "optin", () => t.innerType._zod.optin), eL(e._zod, "optout", () => t.innerType._zod.optout), eL(e._zod, "pattern", () => {
                let e = t.innerType._zod.pattern;
                return e ? RegExp(`^(${eA(e.source)}|null)$`) : void 0
            }), eL(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, i) => null === e.value ? e : t.innerType._zod.run(e, i)
        }),
        nt = eS("$ZodDefault", (e, t) => {
            i0.init(e, t), e._zod.optin = "optional", eL(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, i) => {
                if ("backward" === i.direction) return t.innerType._zod.run(e, i);
                if (void 0 === e.value) return e.value = t.defaultValue, e;
                let r = t.innerType._zod.run(e, i);
                return r instanceof Promise ? r.then(e => ni(e, t)) : ni(r, t)
            }
        });

    function ni(e, t) {
        return void 0 === e.value && (e.value = t.defaultValue), e
    }
    let nr = eS("$ZodPrefault", (e, t) => {
            i0.init(e, t), e._zod.optin = "optional", eL(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, i) => ("backward" === i.direction || void 0 === e.value && (e.value = t.defaultValue), t.innerType._zod.run(e, i))
        }),
        nn = eS("$ZodNonOptional", (e, t) => {
            i0.init(e, t), eL(e._zod, "values", () => {
                let e = t.innerType._zod.values;
                return e ? new Set([...e].filter(e => void 0 !== e)) : void 0
            }), e._zod.parse = (i, r) => {
                let n = t.innerType._zod.run(i, r);
                return n instanceof Promise ? n.then(t => na(t, e)) : na(n, e)
            }
        });

    function na(e, t) {
        return e.issues.length || void 0 !== e.value || e.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: e.value,
            inst: t
        }), e
    }
    let no = eS("$ZodSuccess", (e, t) => {
            i0.init(e, t), e._zod.parse = (e, i) => {
                if ("backward" === i.direction) throw new eZ("ZodSuccess");
                let r = t.innerType._zod.run(e, i);
                return r instanceof Promise ? r.then(t => (e.value = 0 === t.issues.length, e)) : (e.value = 0 === r.issues.length, e)
            }
        }),
        nu = eS("$ZodCatch", (e, t) => {
            i0.init(e, t), e._zod.optin = "optional", eL(e._zod, "optout", () => t.innerType._zod.optout), eL(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, i) => {
                if ("backward" === i.direction) return t.innerType._zod.run(e, i);
                let r = t.innerType._zod.run(e, i);
                return r instanceof Promise ? r.then(r => (e.value = r.value, r.issues.length && (e.value = t.catchValue({ ...e,
                    error: {
                        issues: r.issues.map(e => e5(e, i, eO()))
                    },
                    input: e.value
                }), e.issues = [], e.fallback = !0), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({ ...e,
                    error: {
                        issues: r.issues.map(e => e5(e, i, eO()))
                    },
                    input: e.value
                }), e.issues = [], e.fallback = !0), e)
            }
        }),
        ns = eS("$ZodNaN", (e, t) => {
            i0.init(e, t), e._zod.parse = (t, i) => ("number" == typeof t.value && Number.isNaN(t.value) || t.issues.push({
                input: t.value,
                inst: e,
                expected: "nan",
                code: "invalid_type"
            }), t)
        }),
        nl = eS("$ZodPipe", (e, t) => {
            i0.init(e, t), eL(e._zod, "values", () => t.in._zod.values), eL(e._zod, "optin", () => t.in._zod.optin), eL(e._zod, "optout", () => t.out._zod.optout), eL(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, i) => {
                if ("backward" === i.direction) {
                    let r = t.out._zod.run(e, i);
                    return r instanceof Promise ? r.then(e => nd(e, t.in, i)) : nd(r, t.in, i)
                }
                let r = t.in._zod.run(e, i);
                return r instanceof Promise ? r.then(e => nd(e, t.out, i)) : nd(r, t.out, i)
            }
        });

    function nd(e, t, i) {
        return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
            value: e.value,
            issues: e.issues,
            fallback: e.fallback
        }, i)
    }
    let nc = eS("$ZodCodec", (e, t) => {
        i0.init(e, t), eL(e._zod, "values", () => t.in._zod.values), eL(e._zod, "optin", () => t.in._zod.optin), eL(e._zod, "optout", () => t.out._zod.optout), eL(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, i) => {
            if ("forward" === (i.direction || "forward")) {
                let r = t.in._zod.run(e, i);
                return r instanceof Promise ? r.then(e => nm(e, t, i)) : nm(r, t, i)
            } {
                let r = t.out._zod.run(e, i);
                return r instanceof Promise ? r.then(e => nm(e, t, i)) : nm(r, t, i)
            }
        }
    });

    function nm(e, t, i) {
        if (e.issues.length) return e.aborted = !0, e;
        if ("forward" === (i.direction || "forward")) {
            let r = t.transform(e.value, e);
            return r instanceof Promise ? r.then(r => nf(e, r, t.out, i)) : nf(e, r, t.out, i)
        } {
            let r = t.reverseTransform(e.value, e);
            return r instanceof Promise ? r.then(r => nf(e, r, t.in, i)) : nf(e, r, t.in, i)
        }
    }

    function nf(e, t, i, r) {
        return e.issues.length ? (e.aborted = !0, e) : i._zod.run({
            value: t,
            issues: e.issues
        }, r)
    }
    let np = eS("$ZodPreprocess", (e, t) => {
            nl.init(e, t)
        }),
        nv = eS("$ZodReadonly", (e, t) => {
            i0.init(e, t), eL(e._zod, "propValues", () => t.innerType._zod.propValues), eL(e._zod, "values", () => t.innerType._zod.values), eL(e._zod, "optin", () => t.innerType ? ._zod ? .optin), eL(e._zod, "optout", () => t.innerType ? ._zod ? .optout), e._zod.parse = (e, i) => {
                if ("backward" === i.direction) return t.innerType._zod.run(e, i);
                let r = t.innerType._zod.run(e, i);
                return r instanceof Promise ? r.then(ng) : ng(r)
            }
        });

    function ng(e) {
        return e.value = Object.freeze(e.value), e
    }
    let nh = eS("$ZodTemplateLiteral", (e, t) => {
            i0.init(e, t);
            let i = [];
            for (let e of t.parts)
                if ("object" == typeof e && null !== e) {
                    if (!e._zod.pattern) throw Error(`Invalid template literal part, no pattern found: ${[...e._zod.traits].shift()}`);
                    let t = e._zod.pattern instanceof RegExp ? e._zod.pattern.source : e._zod.pattern;
                    if (!t) throw Error(`Invalid template literal part: ${e._zod.traits}`);
                    let r = +!!t.startsWith("^"),
                        n = t.endsWith("$") ? t.length - 1 : t.length;
                    i.push(t.slice(r, n))
                } else if (null === e || eq.has(typeof e)) i.push(eH(`${e}`));
            else throw Error(`Invalid template literal part: ${e}`);
            e._zod.pattern = RegExp(`^${i.join("")}$`), e._zod.parse = (i, r) => ("string" != typeof i.value ? i.issues.push({
                input: i.value,
                inst: e,
                expected: "string",
                code: "invalid_type"
            }) : (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(i.value) || i.issues.push({
                input: i.value,
                inst: e,
                code: "invalid_format",
                format: t.format ? ? "template_literal",
                pattern: e._zod.pattern.source
            })), i)
        }),
        n$ = eS("$ZodFunction", (e, t) => (i0.init(e, t), e._def = t, e._zod.def = t, e.implement = t => {
            if ("function" != typeof t) throw Error("implement() must be called with a function");
            return function(...i) {
                let r = Reflect.apply(t, this, e._def.input ? tp(e._def.input, i) : i);
                return e._def.output ? tp(e._def.output, r) : r
            }
        }, e.implementAsync = t => {
            if ("function" != typeof t) throw Error("implementAsync() must be called with a function");
            return async function(...i) {
                let r = e._def.input ? await tg(e._def.input, i) : i,
                    n = await Reflect.apply(t, this, r);
                return e._def.output ? await tg(e._def.output, n) : n
            }
        }, e._zod.parse = (t, i) => ("function" != typeof t.value ? t.issues.push({
            code: "invalid_type",
            expected: "function",
            input: t.value,
            inst: e
        }) : e._def.output && "promise" === e._def.output._zod.def.type ? t.value = e.implementAsync(t.value) : t.value = e.implement(t.value), t), e.input = (...t) => {
            let i = e.constructor;
            return new i(Array.isArray(t[0]) ? {
                type: "function",
                input: new rK({
                    type: "tuple",
                    items: t[0],
                    rest: t[1]
                }),
                output: e._def.output
            } : {
                type: "function",
                input: t[0],
                output: e._def.output
            })
        }, e.output = t => new e.constructor({
            type: "function",
            input: e._def.input,
            output: t
        }), e)),
        ny = eS("$ZodPromise", (e, t) => {
            i0.init(e, t), e._zod.parse = (e, i) => Promise.resolve(e.value).then(e => t.innerType._zod.run({
                value: e,
                issues: []
            }, i))
        }),
        n_ = eS("$ZodLazy", (e, t) => {
            i0.init(e, t), eL(e._zod, "innerType", () => (t._cachedInner || (t._cachedInner = t.getter()), t._cachedInner)), eL(e._zod, "pattern", () => e._zod.innerType ? ._zod ? .pattern), eL(e._zod, "propValues", () => e._zod.innerType ? ._zod ? .propValues), eL(e._zod, "optin", () => e._zod.innerType ? ._zod ? .optin ? ? void 0), eL(e._zod, "optout", () => e._zod.innerType ? ._zod ? .optout ? ? void 0), e._zod.parse = (t, i) => e._zod.innerType._zod.run(t, i)
        }),
        nb = eS("$ZodCustom", (e, t) => {
            iZ.init(e, t), i0.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = i => {
                let r = i.value,
                    n = t.fn(r);
                if (n instanceof Promise) return n.then(t => nx(t, i, r, e));
                nx(n, i, r, e)
            }
        });

    function nx(e, t, i, r) {
        if (!e) {
            let e = {
                code: "custom",
                input: i,
                inst: r,
                path: [...r._zod.def.path ? ? []],
                continue: !r._zod.def.abort
            };
            r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(ti(e))
        }
    }
    e.s(["$ZodAny", 0, rU, "$ZodArray", 0, rE, "$ZodBase64", 0, rp, "$ZodBase64URL", 0, rg, "$ZodBigInt", 0, rI, "$ZodBigIntFormat", 0, rS, "$ZodBoolean", 0, rk, "$ZodCIDRv4", 0, rc, "$ZodCIDRv6", 0, rm, "$ZodCUID", 0, i8, "$ZodCUID2", 0, re, "$ZodCatch", 0, nu, "$ZodCodec", 0, nc, "$ZodCustom", 0, nb, "$ZodCustomStringFormat", 0, r_, "$ZodDate", 0, rN, "$ZodDefault", 0, nt, "$ZodDiscriminatedUnion", 0, rW, "$ZodE164", 0, rh, "$ZodEmail", 0, i9, "$ZodEmoji", 0, i7, "$ZodEnum", 0, r1, "$ZodExactOptional", 0, r8, "$ZodFile", 0, r9, "$ZodFunction", 0, n$, "$ZodGUID", 0, i1, "$ZodIPv4", 0, rs, "$ZodIPv6", 0, rl, "$ZodISODate", 0, ra, "$ZodISODateTime", 0, rn, "$ZodISODuration", 0, ru, "$ZodISOTime", 0, ro, "$ZodIntersection", 0, rB, "$ZodJWT", 0, ry, "$ZodKSUID", 0, rr, "$ZodLazy", 0, n_, "$ZodLiteral", 0, r2, "$ZodMAC", 0, rd, "$ZodMap", 0, rQ, "$ZodNaN", 0, ns, "$ZodNanoID", 0, i5, "$ZodNever", 0, rD, "$ZodNonOptional", 0, nn, "$ZodNull", 0, rZ, "$ZodNullable", 0, ne, "$ZodNumber", 0, rb, "$ZodNumberFormat", 0, rx, "$ZodObject", 0, rL, "$ZodObjectJIT", 0, rF, "$ZodOptional", 0, r5, "$ZodPipe", 0, nl, "$ZodPrefault", 0, nr, "$ZodPreprocess", 0, np, "$ZodPromise", 0, ny, "$ZodReadonly", 0, nv, "$ZodRecord", 0, rY, "$ZodSet", 0, r4, "$ZodString", 0, i4, "$ZodStringFormat", 0, i6, "$ZodSuccess", 0, no, "$ZodSymbol", 0, rw, "$ZodTemplateLiteral", 0, nh, "$ZodTransform", 0, r3, "$ZodTuple", 0, rK, "$ZodType", 0, i0, "$ZodULID", 0, rt, "$ZodURL", 0, i3, "$ZodUUID", 0, i2, "$ZodUndefined", 0, rz, "$ZodUnion", 0, rV, "$ZodUnknown", 0, rO, "$ZodVoid", 0, rj, "$ZodXID", 0, ri, "$ZodXor", 0, rM, "isValidBase64", 0, rf, "isValidBase64URL", 0, rv, "isValidJWT", 0, r$], 76094), e.i(76094), e.s(["$ZodAny", 0, rU, "$ZodArray", 0, rE, "$ZodBase64", 0, rp, "$ZodBase64URL", 0, rg, "$ZodBigInt", 0, rI, "$ZodBigIntFormat", 0, rS, "$ZodBoolean", 0, rk, "$ZodCIDRv4", 0, rc, "$ZodCIDRv6", 0, rm, "$ZodCUID", 0, i8, "$ZodCUID2", 0, re, "$ZodCatch", 0, nu, "$ZodCodec", 0, nc, "$ZodCustom", 0, nb, "$ZodCustomStringFormat", 0, r_, "$ZodDate", 0, rN, "$ZodDefault", 0, nt, "$ZodDiscriminatedUnion", 0, rW, "$ZodE164", 0, rh, "$ZodEmail", 0, i9, "$ZodEmoji", 0, i7, "$ZodEnum", 0, r1, "$ZodExactOptional", 0, r8, "$ZodFile", 0, r9, "$ZodFunction", 0, n$, "$ZodGUID", 0, i1, "$ZodIPv4", 0, rs, "$ZodIPv6", 0, rl, "$ZodISODate", 0, ra, "$ZodISODateTime", 0, rn, "$ZodISODuration", 0, ru, "$ZodISOTime", 0, ro, "$ZodIntersection", 0, rB, "$ZodJWT", 0, ry, "$ZodKSUID", 0, rr, "$ZodLazy", 0, n_, "$ZodLiteral", 0, r2, "$ZodMAC", 0, rd, "$ZodMap", 0, rQ, "$ZodNaN", 0, ns, "$ZodNanoID", 0, i5, "$ZodNever", 0, rD, "$ZodNonOptional", 0, nn, "$ZodNull", 0, rZ, "$ZodNullable", 0, ne, "$ZodNumber", 0, rb, "$ZodNumberFormat", 0, rx, "$ZodObject", 0, rL, "$ZodObjectJIT", 0, rF, "$ZodOptional", 0, r5, "$ZodPipe", 0, nl, "$ZodPrefault", 0, nr, "$ZodPreprocess", 0, np, "$ZodPromise", 0, ny, "$ZodReadonly", 0, nv, "$ZodRecord", 0, rY, "$ZodSet", 0, r4, "$ZodString", 0, i4, "$ZodStringFormat", 0, i6, "$ZodSuccess", 0, no, "$ZodSymbol", 0, rw, "$ZodTemplateLiteral", 0, nh, "$ZodTransform", 0, r3, "$ZodTuple", 0, rK, "$ZodType", 0, i0, "$ZodULID", 0, rt, "$ZodURL", 0, i3, "$ZodUUID", 0, i2, "$ZodUndefined", 0, rz, "$ZodUnion", 0, rV, "$ZodUnknown", 0, rO, "$ZodVoid", 0, rj, "$ZodXID", 0, ri, "$ZodXor", 0, rM, "clone", 0, eY, "isValidBase64", 0, rf, "isValidBase64URL", 0, rv, "isValidJWT", 0, r$], 32952), e.i(32952), e.i(55605), e.i(98477);
    var nk = e.i(22143),
        nI = e.i(82358);

    function nS(e, t, i, r) {
        let n = Math.abs(e),
            a = n % 10,
            o = n % 100;
        return o >= 11 && o <= 19 ? r : 1 === a ? t : a >= 2 && a <= 4 ? i : r
    }

    function nw(e, t, i) {
        return 1 === Math.abs(e) ? t : i
    }

    function nz(e) {
        if (!e) return "";
        let t = e[e.length - 1];
        return e + (["ա", "ե", "ը", "ի", "ո", "ու", "օ"].includes(t) ? "ն" : "ը")
    }

    function nZ() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "តួអក្សរ",
                    verb: "គួរមាន"
                },
                file: {
                    unit: "បៃ",
                    verb: "គួរមាន"
                },
                array: {
                    unit: "ធាតុ",
                    verb: "គួរមាន"
                },
                set: {
                    unit: "ធាតុ",
                    verb: "គួរមាន"
                }
            }, t = {
                regex: "ទិន្នន័យបញ្ចូល",
                email: "អាសយដ្ឋានអ៊ីមែល",
                url: "URL",
                emoji: "សញ្ញាអារម្មណ៍",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
                date: "កាលបរិច្ឆេទ ISO",
                time: "ម៉ោង ISO",
                duration: "រយៈពេល ISO",
                ipv4: "អាសយដ្ឋាន IPv4",
                ipv6: "អាសយដ្ឋាន IPv6",
                cidrv4: "ដែនអាសយដ្ឋាន IPv4",
                cidrv6: "ដែនអាសយដ្ឋាន IPv6",
                base64: "ខ្សែអក្សរអ៊ិកូដ base64",
                base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
                json_string: "ខ្សែអក្សរ JSON",
                e164: "លេខ E.164",
                jwt: "JWT",
                template_literal: "ទិន្នន័យបញ្ចូល"
            }, i = {
                nan: "NaN",
                number: "លេខ",
                array: "អារេ (Array)",
                null: "គ្មានតម្លៃ (null)"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${r.expected} ប៉ុន្តែទទួលបាន ${n}`;
                            return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${e} ប៉ុន្តែទទួលបាន ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${e0(r.values[0])}`;
                        return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `ធំពេក៖ ត្រូវការ ${r.origin??"តម្លៃ"} ${t} ${r.maximum.toString()} ${i.unit??"ធាតុ"}`;
                            return `ធំពេក៖ ត្រូវការ ${r.origin??"តម្លៃ"} ${t} ${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `តូចពេក៖ ត្រូវការ ${r.origin} ${t} ${r.minimum.toString()} ${i.unit}`;
                            return `តូចពេក៖ ត្រូវការ ${r.origin} ${t} ${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${r.prefix}"`;
                        if ("ends_with" === r.format) return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${r.suffix}"`;
                        if ("includes" === r.format) return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${r.includes}"`;
                        if ("regex" === r.format) return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${r.pattern}`;
                        return `មិនត្រឹមត្រូវ៖ ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${r.divisor}`;
                    case "unrecognized_keys":
                        return `រកឃើញសោមិនស្គាល់៖ ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `សោមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "ទិន្នន័យមិនត្រឹមត្រូវ";
                    case "invalid_element":
                        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${r.origin}`
                }
            })
        }
    }
    e.s([], 43365), e.i(43365);
    let nU = e => e.charAt(0).toUpperCase() + e.slice(1);

    function nO(e) {
        let t = Math.abs(e),
            i = t % 10,
            r = t % 100;
        return r >= 11 && r <= 19 || 0 === i ? "many" : 1 === i ? "one" : "few"
    }

    function nD(e, t, i, r) {
        let n = Math.abs(e),
            a = n % 10,
            o = n % 100;
        return o >= 11 && o <= 19 ? r : 1 === a ? t : a >= 2 && a <= 4 ? i : r
    }

    function nj() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "символів",
                    verb: "матиме"
                },
                file: {
                    unit: "байтів",
                    verb: "матиме"
                },
                array: {
                    unit: "елементів",
                    verb: "матиме"
                },
                set: {
                    unit: "елементів",
                    verb: "матиме"
                }
            }, t = {
                regex: "вхідні дані",
                email: "адреса електронної пошти",
                url: "URL",
                emoji: "емодзі",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "дата та час ISO",
                date: "дата ISO",
                time: "час ISO",
                duration: "тривалість ISO",
                ipv4: "адреса IPv4",
                ipv6: "адреса IPv6",
                cidrv4: "діапазон IPv4",
                cidrv6: "діапазон IPv6",
                base64: "рядок у кодуванні base64",
                base64url: "рядок у кодуванні base64url",
                json_string: "рядок JSON",
                e164: "номер E.164",
                jwt: "JWT",
                template_literal: "вхідні дані"
            }, i = {
                nan: "NaN",
                number: "число",
                array: "масив"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Неправильні вхідні дані: очікується instanceof ${r.expected}, отримано ${n}`;
                            return `Неправильні вхідні дані: очікується ${e}, отримано ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Неправильні вхідні дані: очікується ${e0(r.values[0])}`;
                        return `Неправильна опція: очікується одне з ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Занадто велике: очікується, що ${r.origin??"значення"} ${i.verb} ${t}${r.maximum.toString()} ${i.unit??"елементів"}`;
                            return `Занадто велике: очікується, що ${r.origin??"значення"} буде ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Занадто мале: очікується, що ${r.origin} ${i.verb} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Занадто мале: очікується, що ${r.origin} буде ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Неправильний рядок: повинен починатися з "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Неправильний рядок: повинен закінчуватися на "${r.suffix}"`;
                        if ("includes" === r.format) return `Неправильний рядок: повинен містити "${r.includes}"`;
                        if ("regex" === r.format) return `Неправильний рядок: повинен відповідати шаблону ${r.pattern}`;
                        return `Неправильний ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Неправильне число: повинно бути кратним ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Нерозпізнаний ключ${r.keys.length>1?"і":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Неправильний ключ у ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Неправильні вхідні дані";
                    case "invalid_element":
                        return `Неправильне значення у ${r.origin}`
                }
            })
        }
    }
    e.s(["ar", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "حرف",
                    verb: "أن يحوي"
                },
                file: {
                    unit: "بايت",
                    verb: "أن يحوي"
                },
                array: {
                    unit: "عنصر",
                    verb: "أن يحوي"
                },
                set: {
                    unit: "عنصر",
                    verb: "أن يحوي"
                }
            }, t = {
                regex: "مدخل",
                email: "بريد إلكتروني",
                url: "رابط",
                emoji: "إيموجي",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "تاريخ ووقت بمعيار ISO",
                date: "تاريخ بمعيار ISO",
                time: "وقت بمعيار ISO",
                duration: "مدة بمعيار ISO",
                ipv4: "عنوان IPv4",
                ipv6: "عنوان IPv6",
                cidrv4: "مدى عناوين بصيغة IPv4",
                cidrv6: "مدى عناوين بصيغة IPv6",
                base64: "نَص بترميز base64-encoded",
                base64url: "نَص بترميز base64url-encoded",
                json_string: "نَص على هيئة JSON",
                e164: "رقم هاتف بمعيار E.164",
                jwt: "JWT",
                template_literal: "مدخل"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `مدخلات غير مقبولة: يفترض إدخال instanceof ${r.expected}، ولكن تم إدخال ${n}`;
                            return `مدخلات غير مقبولة: يفترض إدخال ${e}، ولكن تم إدخال ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `مدخلات غير مقبولة: يفترض إدخال ${e0(r.values[0])}`;
                        return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return ` أكبر من اللازم: يفترض أن تكون ${r.origin??"القيمة"} ${t} ${r.maximum.toString()} ${i.unit??"عنصر"}`;
                            return `أكبر من اللازم: يفترض أن تكون ${r.origin??"القيمة"} ${t} ${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${t} ${r.minimum.toString()} ${i.unit}`;
                            return `أصغر من اللازم: يفترض لـ ${r.origin} أن يكون ${t} ${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `نَص غير مقبول: يجب أن يبدأ بـ "${r.prefix}"`;
                        if ("ends_with" === r.format) return `نَص غير مقبول: يجب أن ينتهي بـ "${r.suffix}"`;
                        if ("includes" === r.format) return `نَص غير مقبول: يجب أن يتضمَّن "${r.includes}"`;
                        if ("regex" === r.format) return `نَص غير مقبول: يجب أن يطابق النمط ${r.pattern}`;
                        return `${t[r.format]??r.format} غير مقبول`;
                    case "not_multiple_of":
                        return `رقم غير مقبول: يجب أن يكون من مضاعفات ${r.divisor}`;
                    case "unrecognized_keys":
                        return `معرف${r.keys.length>1?"ات":""} غريب${r.keys.length>1?"ة":""}: ${ej(r.keys,"، ")}`;
                    case "invalid_key":
                        return `معرف غير مقبول في ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "مدخل غير مقبول";
                    case "invalid_element":
                        return `مدخل غير مقبول في ${r.origin}`
                }
            })
        }
    }, "az", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "simvol",
                    verb: "olmalıdır"
                },
                file: {
                    unit: "bayt",
                    verb: "olmalıdır"
                },
                array: {
                    unit: "element",
                    verb: "olmalıdır"
                },
                set: {
                    unit: "element",
                    verb: "olmalıdır"
                }
            }, t = {
                regex: "input",
                email: "email address",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO datetime",
                date: "ISO date",
                time: "ISO time",
                duration: "ISO duration",
                ipv4: "IPv4 address",
                ipv6: "IPv6 address",
                cidrv4: "IPv4 range",
                cidrv6: "IPv6 range",
                base64: "base64-encoded string",
                base64url: "base64url-encoded string",
                json_string: "JSON string",
                e164: "E.164 number",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Yanlış dəyər: g\xf6zlənilən instanceof ${r.expected}, daxil olan ${n}`;
                            return `Yanlış dəyər: g\xf6zlənilən ${e}, daxil olan ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Yanlış dəyər: g\xf6zlənilən ${e0(r.values[0])}`;
                        return `Yanlış se\xe7im: aşağıdakılardan biri olmalıdır: ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `\xc7ox b\xf6y\xfck: g\xf6zlənilən ${r.origin??"dəyər"} ${t}${r.maximum.toString()} ${i.unit??"element"}`;
                            return `\xc7ox b\xf6y\xfck: g\xf6zlənilən ${r.origin??"dəyər"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `\xc7ox ki\xe7ik: g\xf6zlənilən ${r.origin} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `\xc7ox ki\xe7ik: g\xf6zlənilən ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Yanlış mətn: "${r.prefix}" ilə başlamalıdır`;
                        if ("ends_with" === r.format) return `Yanlış mətn: "${r.suffix}" ilə bitməlidir`;
                        if ("includes" === r.format) return `Yanlış mətn: "${r.includes}" daxil olmalıdır`;
                        if ("regex" === r.format) return `Yanlış mətn: ${r.pattern} şablonuna uyğun olmalıdır`;
                        return `Yanlış ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Yanlış ədəd: ${r.divisor} ilə b\xf6l\xfcnə bilən olmalıdır`;
                    case "unrecognized_keys":
                        return `Tanınmayan a\xe7ar${r.keys.length>1?"lar":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} daxilində yanlış a\xe7ar`;
                    case "invalid_union":
                    default:
                        return "Yanlış dəyər";
                    case "invalid_element":
                        return `${r.origin} daxilində yanlış dəyər`
                }
            })
        }
    }, "be", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: {
                        one: "сімвал",
                        few: "сімвалы",
                        many: "сімвалаў"
                    },
                    verb: "мець"
                },
                array: {
                    unit: {
                        one: "элемент",
                        few: "элементы",
                        many: "элементаў"
                    },
                    verb: "мець"
                },
                set: {
                    unit: {
                        one: "элемент",
                        few: "элементы",
                        many: "элементаў"
                    },
                    verb: "мець"
                },
                file: {
                    unit: {
                        one: "байт",
                        few: "байты",
                        many: "байтаў"
                    },
                    verb: "мець"
                }
            }, t = {
                regex: "увод",
                email: "email адрас",
                url: "URL",
                emoji: "эмодзі",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO дата і час",
                date: "ISO дата",
                time: "ISO час",
                duration: "ISO працягласць",
                ipv4: "IPv4 адрас",
                ipv6: "IPv6 адрас",
                cidrv4: "IPv4 дыяпазон",
                cidrv6: "IPv6 дыяпазон",
                base64: "радок у фармаце base64",
                base64url: "радок у фармаце base64url",
                json_string: "JSON радок",
                e164: "нумар E.164",
                jwt: "JWT",
                template_literal: "увод"
            }, i = {
                nan: "NaN",
                number: "лік",
                array: "масіў"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Няправільны ўвод: чакаўся instanceof ${r.expected}, атрымана ${n}`;
                            return `Няправільны ўвод: чакаўся ${e}, атрымана ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Няправільны ўвод: чакалася ${e0(r.values[0])}`;
                        return `Няправільны варыянт: чакаўся адзін з ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nS(Number(r.maximum), i.unit.one, i.unit.few, i.unit.many);
                                return `Занадта вялікі: чакалася, што ${r.origin??"значэнне"} павінна ${i.verb} ${t}${r.maximum.toString()} ${e}`
                            }
                            return `Занадта вялікі: чакалася, што ${r.origin??"значэнне"} павінна быць ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nS(Number(r.minimum), i.unit.one, i.unit.few, i.unit.many);
                                return `Занадта малы: чакалася, што ${r.origin} павінна ${i.verb} ${t}${r.minimum.toString()} ${e}`
                            }
                            return `Занадта малы: чакалася, што ${r.origin} павінна быць ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Няправільны радок: павінен пачынацца з "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Няправільны радок: павінен заканчвацца на "${r.suffix}"`;
                        if ("includes" === r.format) return `Няправільны радок: павінен змяшчаць "${r.includes}"`;
                        if ("regex" === r.format) return `Няправільны радок: павінен адпавядаць шаблону ${r.pattern}`;
                        return `Няправільны ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Няправільны лік: павінен быць кратным ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Нераспазнаны ${r.keys.length>1?"ключы":"ключ"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Няправільны ключ у ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Няправільны ўвод";
                    case "invalid_element":
                        return `Няправільнае значэнне ў ${r.origin}`
                }
            })
        }
    }, "bg", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "символа",
                    verb: "да съдържа"
                },
                file: {
                    unit: "байта",
                    verb: "да съдържа"
                },
                array: {
                    unit: "елемента",
                    verb: "да съдържа"
                },
                set: {
                    unit: "елемента",
                    verb: "да съдържа"
                }
            }, t = {
                regex: "вход",
                email: "имейл адрес",
                url: "URL",
                emoji: "емоджи",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO време",
                date: "ISO дата",
                time: "ISO време",
                duration: "ISO продължителност",
                ipv4: "IPv4 адрес",
                ipv6: "IPv6 адрес",
                cidrv4: "IPv4 диапазон",
                cidrv6: "IPv6 диапазон",
                base64: "base64-кодиран низ",
                base64url: "base64url-кодиран низ",
                json_string: "JSON низ",
                e164: "E.164 номер",
                jwt: "JWT",
                template_literal: "вход"
            }, i = {
                nan: "NaN",
                number: "число",
                array: "масив"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Невалиден вход: очакван instanceof ${r.expected}, получен ${n}`;
                            return `Невалиден вход: очакван ${e}, получен ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Невалиден вход: очакван ${e0(r.values[0])}`;
                        return `Невалидна опция: очаквано едно от ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Твърде голямо: очаква се ${r.origin??"стойност"} да съдържа ${t}${r.maximum.toString()} ${i.unit??"елемента"}`;
                            return `Твърде голямо: очаква се ${r.origin??"стойност"} да бъде ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Твърде малко: очаква се ${r.origin} да съдържа ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Твърде малко: очаква се ${r.origin} да бъде ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        {
                            if ("starts_with" === r.format) return `Невалиден низ: трябва да започва с "${r.prefix}"`;
                            if ("ends_with" === r.format) return `Невалиден низ: трябва да завършва с "${r.suffix}"`;
                            if ("includes" === r.format) return `Невалиден низ: трябва да включва "${r.includes}"`;
                            if ("regex" === r.format) return `Невалиден низ: трябва да съвпада с ${r.pattern}`;
                            let e = "Невалиден";
                            return "emoji" === r.format && (e = "Невалидно"),
                            "datetime" === r.format && (e = "Невалидно"),
                            "date" === r.format && (e = "Невалидна"),
                            "time" === r.format && (e = "Невалидно"),
                            "duration" === r.format && (e = "Невалидна"),
                            `${e} ${t[r.format]??r.format}`
                        }
                    case "not_multiple_of":
                        return `Невалидно число: трябва да бъде кратно на ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Неразпознат${r.keys.length>1?"и":""} ключ${r.keys.length>1?"ове":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Невалиден ключ в ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Невалиден вход";
                    case "invalid_element":
                        return `Невалидна стойност в ${r.origin}`
                }
            })
        }
    }, "ca", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caràcters",
                    verb: "contenir"
                },
                file: {
                    unit: "bytes",
                    verb: "contenir"
                },
                array: {
                    unit: "elements",
                    verb: "contenir"
                },
                set: {
                    unit: "elements",
                    verb: "contenir"
                }
            }, t = {
                regex: "entrada",
                email: "adreça electrònica",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "data i hora ISO",
                date: "data ISO",
                time: "hora ISO",
                duration: "durada ISO",
                ipv4: "adreça IPv4",
                ipv6: "adreça IPv6",
                cidrv4: "rang IPv4",
                cidrv6: "rang IPv6",
                base64: "cadena codificada en base64",
                base64url: "cadena codificada en base64url",
                json_string: "cadena JSON",
                e164: "número E.164",
                jwt: "JWT",
                template_literal: "entrada"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Tipus inv\xe0lid: s'esperava instanceof ${r.expected}, s'ha rebut ${n}`;
                            return `Tipus inv\xe0lid: s'esperava ${e}, s'ha rebut ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Valor inv\xe0lid: s'esperava ${e0(r.values[0])}`;
                        return `Opci\xf3 inv\xe0lida: s'esperava una de ${ej(r.values," o ")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "com a màxim" : "menys de",
                                i = e[r.origin] ? ? null;
                            if (i) return `Massa gran: s'esperava que ${r.origin??"el valor"} contingu\xe9s ${t} ${r.maximum.toString()} ${i.unit??"elements"}`;
                            return `Massa gran: s'esperava que ${r.origin??"el valor"} fos ${t} ${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? "com a mínim" : "més de",
                                i = e[r.origin] ? ? null;
                            if (i) return `Massa petit: s'esperava que ${r.origin} contingu\xe9s ${t} ${r.minimum.toString()} ${i.unit}`;
                            return `Massa petit: s'esperava que ${r.origin} fos ${t} ${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Format inv\xe0lid: ha de comen\xe7ar amb "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Format inv\xe0lid: ha d'acabar amb "${r.suffix}"`;
                        if ("includes" === r.format) return `Format inv\xe0lid: ha d'incloure "${r.includes}"`;
                        if ("regex" === r.format) return `Format inv\xe0lid: ha de coincidir amb el patr\xf3 ${r.pattern}`;
                        return `Format inv\xe0lid per a ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `N\xfamero inv\xe0lid: ha de ser m\xfaltiple de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Clau${r.keys.length>1?"s":""} no reconeguda${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Clau inv\xe0lida a ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Entrada invàlida";
                    case "invalid_element":
                        return `Element inv\xe0lid a ${r.origin}`
                }
            })
        }
    }, "cs", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "znaků",
                    verb: "mít"
                },
                file: {
                    unit: "bajtů",
                    verb: "mít"
                },
                array: {
                    unit: "prvků",
                    verb: "mít"
                },
                set: {
                    unit: "prvků",
                    verb: "mít"
                }
            }, t = {
                regex: "regulární výraz",
                email: "e-mailová adresa",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "datum a čas ve formátu ISO",
                date: "datum ve formátu ISO",
                time: "čas ve formátu ISO",
                duration: "doba trvání ISO",
                ipv4: "IPv4 adresa",
                ipv6: "IPv6 adresa",
                cidrv4: "rozsah IPv4",
                cidrv6: "rozsah IPv6",
                base64: "řetězec zakódovaný ve formátu base64",
                base64url: "řetězec zakódovaný ve formátu base64url",
                json_string: "řetězec ve formátu JSON",
                e164: "číslo E.164",
                jwt: "JWT",
                template_literal: "vstup"
            }, i = {
                nan: "NaN",
                number: "číslo",
                string: "řetězec",
                function: "funkce",
                array: "pole"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Neplatn\xfd vstup: oček\xe1v\xe1no instanceof ${r.expected}, obdrženo ${n}`;
                            return `Neplatn\xfd vstup: oček\xe1v\xe1no ${e}, obdrženo ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Neplatn\xfd vstup: oček\xe1v\xe1no ${e0(r.values[0])}`;
                        return `Neplatn\xe1 možnost: oček\xe1v\xe1na jedna z hodnot ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Hodnota je př\xedliš velk\xe1: ${r.origin??"hodnota"} mus\xed m\xedt ${t}${r.maximum.toString()} ${i.unit??"prvků"}`;
                            return `Hodnota je př\xedliš velk\xe1: ${r.origin??"hodnota"} mus\xed b\xfdt ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Hodnota je př\xedliš mal\xe1: ${r.origin??"hodnota"} mus\xed m\xedt ${t}${r.minimum.toString()} ${i.unit??"prvků"}`;
                            return `Hodnota je př\xedliš mal\xe1: ${r.origin??"hodnota"} mus\xed b\xfdt ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Neplatn\xfd řetězec: mus\xed zač\xednat na "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Neplatn\xfd řetězec: mus\xed končit na "${r.suffix}"`;
                        if ("includes" === r.format) return `Neplatn\xfd řetězec: mus\xed obsahovat "${r.includes}"`;
                        if ("regex" === r.format) return `Neplatn\xfd řetězec: mus\xed odpov\xeddat vzoru ${r.pattern}`;
                        return `Neplatn\xfd form\xe1t ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Neplatn\xe9 č\xedslo: mus\xed b\xfdt n\xe1sobkem ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Nezn\xe1m\xe9 kl\xedče: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Neplatn\xfd kl\xedč v ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Neplatný vstup";
                    case "invalid_element":
                        return `Neplatn\xe1 hodnota v ${r.origin}`
                }
            })
        }
    }, "da", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "tegn",
                    verb: "havde"
                },
                file: {
                    unit: "bytes",
                    verb: "havde"
                },
                array: {
                    unit: "elementer",
                    verb: "indeholdt"
                },
                set: {
                    unit: "elementer",
                    verb: "indeholdt"
                }
            }, t = {
                regex: "input",
                email: "e-mailadresse",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO dato- og klokkeslæt",
                date: "ISO-dato",
                time: "ISO-klokkeslæt",
                duration: "ISO-varighed",
                ipv4: "IPv4-område",
                ipv6: "IPv6-område",
                cidrv4: "IPv4-spektrum",
                cidrv6: "IPv6-spektrum",
                base64: "base64-kodet streng",
                base64url: "base64url-kodet streng",
                json_string: "JSON-streng",
                e164: "E.164-nummer",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN",
                string: "streng",
                number: "tal",
                boolean: "boolean",
                array: "liste",
                object: "objekt",
                set: "sæt",
                file: "fil"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ugyldigt input: forventede instanceof ${r.expected}, fik ${n}`;
                            return `Ugyldigt input: forventede ${e}, fik ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ugyldig v\xe6rdi: forventede ${e0(r.values[0])}`;
                        return `Ugyldigt valg: forventede en af f\xf8lgende ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `For stor: forventede ${a??"value"} ${n.verb} ${t} ${r.maximum.toString()} ${n.unit??"elementer"}`;
                            return `For stor: forventede ${a??"value"} havde ${t} ${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `For lille: forventede ${a} ${n.verb} ${t} ${r.minimum.toString()} ${n.unit}`;
                            return `For lille: forventede ${a} havde ${t} ${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ugyldig streng: skal starte med "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Ugyldig streng: skal ende med "${r.suffix}"`;
                        if ("includes" === r.format) return `Ugyldig streng: skal indeholde "${r.includes}"`;
                        if ("regex" === r.format) return `Ugyldig streng: skal matche m\xf8nsteret ${r.pattern}`;
                        return `Ugyldig ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ugyldigt tal: skal v\xe6re deleligt med ${r.divisor}`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Ukendte nøgler":"Ukendt nøgle"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Ugyldig n\xf8gle i ${r.origin}`;
                    case "invalid_union":
                        return "Ugyldigt input: matcher ingen af de tilladte typer";
                    case "invalid_element":
                        return `Ugyldig v\xe6rdi i ${r.origin}`;
                    default:
                        return "Ugyldigt input"
                }
            })
        }
    }, "de", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "Zeichen",
                    verb: "zu haben"
                },
                file: {
                    unit: "Bytes",
                    verb: "zu haben"
                },
                array: {
                    unit: "Elemente",
                    verb: "zu haben"
                },
                set: {
                    unit: "Elemente",
                    verb: "zu haben"
                }
            }, t = {
                regex: "Eingabe",
                email: "E-Mail-Adresse",
                url: "URL",
                emoji: "Emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO-Datum und -Uhrzeit",
                date: "ISO-Datum",
                time: "ISO-Uhrzeit",
                duration: "ISO-Dauer",
                ipv4: "IPv4-Adresse",
                ipv6: "IPv6-Adresse",
                cidrv4: "IPv4-Bereich",
                cidrv6: "IPv6-Bereich",
                base64: "Base64-codierter String",
                base64url: "Base64-URL-codierter String",
                json_string: "JSON-String",
                e164: "E.164-Nummer",
                jwt: "JWT",
                template_literal: "Eingabe"
            }, i = {
                nan: "NaN",
                number: "Zahl",
                array: "Array"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ung\xfcltige Eingabe: erwartet instanceof ${r.expected}, erhalten ${n}`;
                            return `Ung\xfcltige Eingabe: erwartet ${e}, erhalten ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ung\xfcltige Eingabe: erwartet ${e0(r.values[0])}`;
                        return `Ung\xfcltige Option: erwartet eine von ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Zu gro\xdf: erwartet, dass ${r.origin??"Wert"} ${t}${r.maximum.toString()} ${i.unit??"Elemente"} hat`;
                            return `Zu gro\xdf: erwartet, dass ${r.origin??"Wert"} ${t}${r.maximum.toString()} ist`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Zu klein: erwartet, dass ${r.origin} ${t}${r.minimum.toString()} ${i.unit} hat`;
                            return `Zu klein: erwartet, dass ${r.origin} ${t}${r.minimum.toString()} ist`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ung\xfcltiger String: muss mit "${r.prefix}" beginnen`;
                        if ("ends_with" === r.format) return `Ung\xfcltiger String: muss mit "${r.suffix}" enden`;
                        if ("includes" === r.format) return `Ung\xfcltiger String: muss "${r.includes}" enthalten`;
                        if ("regex" === r.format) return `Ung\xfcltiger String: muss dem Muster ${r.pattern} entsprechen`;
                        return `Ung\xfcltig: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ung\xfcltige Zahl: muss ein Vielfaches von ${r.divisor} sein`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Ung\xfcltiger Schl\xfcssel in ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Ungültige Eingabe";
                    case "invalid_element":
                        return `Ung\xfcltiger Wert in ${r.origin}`
                }
            })
        }
    }, "el", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "χαρακτήρες",
                    verb: "να έχει"
                },
                file: {
                    unit: "bytes",
                    verb: "να έχει"
                },
                array: {
                    unit: "στοιχεία",
                    verb: "να έχει"
                },
                set: {
                    unit: "στοιχεία",
                    verb: "να έχει"
                },
                map: {
                    unit: "καταχωρήσεις",
                    verb: "να έχει"
                }
            }, t = {
                regex: "είσοδος",
                email: "διεύθυνση email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO ημερομηνία και ώρα",
                date: "ISO ημερομηνία",
                time: "ISO ώρα",
                duration: "ISO διάρκεια",
                ipv4: "διεύθυνση IPv4",
                ipv6: "διεύθυνση IPv6",
                mac: "διεύθυνση MAC",
                cidrv4: "εύρος IPv4",
                cidrv6: "εύρος IPv6",
                base64: "συμβολοσειρά κωδικοποιημένη σε base64",
                base64url: "συμβολοσειρά κωδικοποιημένη σε base64url",
                json_string: "συμβολοσειρά JSON",
                e164: "αριθμός E.164",
                jwt: "JWT",
                template_literal: "είσοδος"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if ("string" == typeof r.expected && /^[A-Z]/.test(r.expected)) return `Μη έγκυρη είσοδος: αναμενόταν instanceof ${r.expected}, λήφθηκε ${n}`;
                            return `Μη έγκυρη είσοδος: αναμενόταν ${e}, λήφθηκε ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Μη έγκυρη είσοδος: αναμενόταν ${e0(r.values[0])}`;
                        return `Μη έγκυρη επιλογή: αναμενόταν ένα από ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Πολύ μεγάλο: αναμενόταν ${r.origin??"τιμή"} να έχει ${t}${r.maximum.toString()} ${i.unit??"στοιχεία"}`;
                            return `Πολύ μεγάλο: αναμενόταν ${r.origin??"τιμή"} να είναι ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Πολύ μικρό: αναμενόταν ${r.origin} να έχει ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Πολύ μικρό: αναμενόταν ${r.origin} να είναι ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${r.suffix}"`;
                        if ("includes" === r.format) return `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${r.includes}"`;
                        if ("regex" === r.format) return `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${r.pattern}`;
                        return `Μη έγκυρο: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Άγνωστ${r.keys.length>1?"α":"ο"} κλειδ${r.keys.length>1?"ιά":"ί"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Μη έγκυρο κλειδί στο ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Μη έγκυρη είσοδος";
                    case "invalid_element":
                        return `Μη έγκυρη τιμή στο ${r.origin}`
                }
            })
        }
    }, "en", 0, tL, "eo", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "karaktrojn",
                    verb: "havi"
                },
                file: {
                    unit: "bajtojn",
                    verb: "havi"
                },
                array: {
                    unit: "elementojn",
                    verb: "havi"
                },
                set: {
                    unit: "elementojn",
                    verb: "havi"
                }
            }, t = {
                regex: "enigo",
                email: "retadreso",
                url: "URL",
                emoji: "emoĝio",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO-datotempo",
                date: "ISO-dato",
                time: "ISO-tempo",
                duration: "ISO-daŭro",
                ipv4: "IPv4-adreso",
                ipv6: "IPv6-adreso",
                cidrv4: "IPv4-rango",
                cidrv6: "IPv6-rango",
                base64: "64-ume kodita karaktraro",
                base64url: "URL-64-ume kodita karaktraro",
                json_string: "JSON-karaktraro",
                e164: "E.164-nombro",
                jwt: "JWT",
                template_literal: "enigo"
            }, i = {
                nan: "NaN",
                number: "nombro",
                array: "tabelo",
                null: "senvalora"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Nevalida enigo: atendiĝis instanceof ${r.expected}, riceviĝis ${n}`;
                            return `Nevalida enigo: atendiĝis ${e}, riceviĝis ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Nevalida enigo: atendiĝis ${e0(r.values[0])}`;
                        return `Nevalida opcio: atendiĝis unu el ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Tro granda: atendiĝis ke ${r.origin??"valoro"} havu ${t}${r.maximum.toString()} ${i.unit??"elementojn"}`;
                            return `Tro granda: atendiĝis ke ${r.origin??"valoro"} havu ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Tro malgranda: atendiĝis ke ${r.origin} havu ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Tro malgranda: atendiĝis ke ${r.origin} estu ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Nevalida karaktraro: devas komenciĝi per "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Nevalida karaktraro: devas finiĝi per "${r.suffix}"`;
                        if ("includes" === r.format) return `Nevalida karaktraro: devas inkluzivi "${r.includes}"`;
                        if ("regex" === r.format) return `Nevalida karaktraro: devas kongrui kun la modelo ${r.pattern}`;
                        return `Nevalida ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Nevalida nombro: devas esti oblo de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Nekonata${r.keys.length>1?"j":""} ŝlosilo${r.keys.length>1?"j":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Nevalida ŝlosilo en ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Nevalida enigo";
                    case "invalid_element":
                        return `Nevalida valoro en ${r.origin}`
                }
            })
        }
    }, "es", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caracteres",
                    verb: "tener"
                },
                file: {
                    unit: "bytes",
                    verb: "tener"
                },
                array: {
                    unit: "elementos",
                    verb: "tener"
                },
                set: {
                    unit: "elementos",
                    verb: "tener"
                }
            }, t = {
                regex: "entrada",
                email: "dirección de correo electrónico",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "fecha y hora ISO",
                date: "fecha ISO",
                time: "hora ISO",
                duration: "duración ISO",
                ipv4: "dirección IPv4",
                ipv6: "dirección IPv6",
                cidrv4: "rango IPv4",
                cidrv6: "rango IPv6",
                base64: "cadena codificada en base64",
                base64url: "URL codificada en base64",
                json_string: "cadena JSON",
                e164: "número E.164",
                jwt: "JWT",
                template_literal: "entrada"
            }, i = {
                nan: "NaN",
                string: "texto",
                number: "número",
                boolean: "booleano",
                array: "arreglo",
                object: "objeto",
                set: "conjunto",
                file: "archivo",
                date: "fecha",
                bigint: "número grande",
                symbol: "símbolo",
                undefined: "indefinido",
                null: "nulo",
                function: "función",
                map: "mapa",
                record: "registro",
                tuple: "tupla",
                enum: "enumeración",
                union: "unión",
                literal: "literal",
                promise: "promesa",
                void: "vacío",
                never: "nunca",
                unknown: "desconocido",
                any: "cualquiera"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Entrada inv\xe1lida: se esperaba instanceof ${r.expected}, recibido ${n}`;
                            return `Entrada inv\xe1lida: se esperaba ${e}, recibido ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Entrada inv\xe1lida: se esperaba ${e0(r.values[0])}`;
                        return `Opci\xf3n inv\xe1lida: se esperaba una de ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `Demasiado grande: se esperaba que ${a??"valor"} tuviera ${t}${r.maximum.toString()} ${n.unit??"elementos"}`;
                            return `Demasiado grande: se esperaba que ${a??"valor"} fuera ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `Demasiado peque\xf1o: se esperaba que ${a} tuviera ${t}${r.minimum.toString()} ${n.unit}`;
                            return `Demasiado peque\xf1o: se esperaba que ${a} fuera ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Cadena inv\xe1lida: debe comenzar con "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Cadena inv\xe1lida: debe terminar en "${r.suffix}"`;
                        if ("includes" === r.format) return `Cadena inv\xe1lida: debe incluir "${r.includes}"`;
                        if ("regex" === r.format) return `Cadena inv\xe1lida: debe coincidir con el patr\xf3n ${r.pattern}`;
                        return `Inv\xe1lido ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `N\xfamero inv\xe1lido: debe ser m\xfaltiplo de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Llave${r.keys.length>1?"s":""} desconocida${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Llave inv\xe1lida en ${i[r.origin]??r.origin}`;
                    case "invalid_union":
                    default:
                        return "Entrada inválida";
                    case "invalid_element":
                        return `Valor inv\xe1lido en ${i[r.origin]??r.origin}`
                }
            })
        }
    }, "fa", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "کاراکتر",
                    verb: "داشته باشد"
                },
                file: {
                    unit: "بایت",
                    verb: "داشته باشد"
                },
                array: {
                    unit: "آیتم",
                    verb: "داشته باشد"
                },
                set: {
                    unit: "آیتم",
                    verb: "داشته باشد"
                }
            }, t = {
                regex: "ورودی",
                email: "آدرس ایمیل",
                url: "URL",
                emoji: "ایموجی",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "تاریخ و زمان ایزو",
                date: "تاریخ ایزو",
                time: "زمان ایزو",
                duration: "مدت زمان ایزو",
                ipv4: "IPv4 آدرس",
                ipv6: "IPv6 آدرس",
                cidrv4: "IPv4 دامنه",
                cidrv6: "IPv6 دامنه",
                base64: "base64-encoded رشته",
                base64url: "base64url-encoded رشته",
                json_string: "JSON رشته",
                e164: "E.164 عدد",
                jwt: "JWT",
                template_literal: "ورودی"
            }, i = {
                nan: "NaN",
                number: "عدد",
                array: "آرایه"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `ورودی نامعتبر: می‌بایست instanceof ${r.expected} می‌بود، ${n} دریافت شد`;
                            return `ورودی نامعتبر: می‌بایست ${e} می‌بود، ${n} دریافت شد`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `ورودی نامعتبر: می‌بایست ${e0(r.values[0])} می‌بود`;
                        return `گزینه نامعتبر: می‌بایست یکی از ${ej(r.values,"|")} می‌بود`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `خیلی بزرگ: ${r.origin??"مقدار"} باید ${t}${r.maximum.toString()} ${i.unit??"عنصر"} باشد`;
                            return `خیلی بزرگ: ${r.origin??"مقدار"} باید ${t}${r.maximum.toString()} باشد`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `خیلی کوچک: ${r.origin} باید ${t}${r.minimum.toString()} ${i.unit} باشد`;
                            return `خیلی کوچک: ${r.origin} باید ${t}${r.minimum.toString()} باشد`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `رشته نامعتبر: باید با "${r.prefix}" شروع شود`;
                        if ("ends_with" === r.format) return `رشته نامعتبر: باید با "${r.suffix}" تمام شود`;
                        if ("includes" === r.format) return `رشته نامعتبر: باید شامل "${r.includes}" باشد`;
                        if ("regex" === r.format) return `رشته نامعتبر: باید با الگوی ${r.pattern} مطابقت داشته باشد`;
                        return `${t[r.format]??r.format} نامعتبر`;
                    case "not_multiple_of":
                        return `عدد نامعتبر: باید مضرب ${r.divisor} باشد`;
                    case "unrecognized_keys":
                        return `کلید${r.keys.length>1?"های":""} ناشناس: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `کلید ناشناس در ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "ورودی نامعتبر";
                    case "invalid_element":
                        return `مقدار نامعتبر در ${r.origin}`
                }
            })
        }
    }, "fi", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "merkkiä",
                    subject: "merkkijonon"
                },
                file: {
                    unit: "tavua",
                    subject: "tiedoston"
                },
                array: {
                    unit: "alkiota",
                    subject: "listan"
                },
                set: {
                    unit: "alkiota",
                    subject: "joukon"
                },
                number: {
                    unit: "",
                    subject: "luvun"
                },
                bigint: {
                    unit: "",
                    subject: "suuren kokonaisluvun"
                },
                int: {
                    unit: "",
                    subject: "kokonaisluvun"
                },
                date: {
                    unit: "",
                    subject: "päivämäärän"
                }
            }, t = {
                regex: "säännöllinen lauseke",
                email: "sähköpostiosoite",
                url: "URL-osoite",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO-aikaleima",
                date: "ISO-päivämäärä",
                time: "ISO-aika",
                duration: "ISO-kesto",
                ipv4: "IPv4-osoite",
                ipv6: "IPv6-osoite",
                cidrv4: "IPv4-alue",
                cidrv6: "IPv6-alue",
                base64: "base64-koodattu merkkijono",
                base64url: "base64url-koodattu merkkijono",
                json_string: "JSON-merkkijono",
                e164: "E.164-luku",
                jwt: "JWT",
                template_literal: "templaattimerkkijono"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Virheellinen tyyppi: odotettiin instanceof ${r.expected}, oli ${n}`;
                            return `Virheellinen tyyppi: odotettiin ${e}, oli ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Virheellinen sy\xf6te: t\xe4ytyy olla ${e0(r.values[0])}`;
                        return `Virheellinen valinta: t\xe4ytyy olla yksi seuraavista: ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Liian suuri: ${i.subject} t\xe4ytyy olla ${t}${r.maximum.toString()} ${i.unit}`.trim();
                            return `Liian suuri: arvon t\xe4ytyy olla ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Liian pieni: ${i.subject} t\xe4ytyy olla ${t}${r.minimum.toString()} ${i.unit}`.trim();
                            return `Liian pieni: arvon t\xe4ytyy olla ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Virheellinen sy\xf6te: t\xe4ytyy alkaa "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Virheellinen sy\xf6te: t\xe4ytyy loppua "${r.suffix}"`;
                        if ("includes" === r.format) return `Virheellinen sy\xf6te: t\xe4ytyy sis\xe4lt\xe4\xe4 "${r.includes}"`;
                        if ("regex" === r.format) return `Virheellinen sy\xf6te: t\xe4ytyy vastata s\xe4\xe4nn\xf6llist\xe4 lauseketta ${r.pattern}`;
                        return `Virheellinen ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Virheellinen luku: t\xe4ytyy olla luvun ${r.divisor} monikerta`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return "Virheellinen avain tietueessa";
                    case "invalid_union":
                        return "Virheellinen unioni";
                    case "invalid_element":
                        return "Virheellinen arvo joukossa";
                    default:
                        return "Virheellinen syöte"
                }
            })
        }
    }, "fr", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caractères",
                    verb: "avoir"
                },
                file: {
                    unit: "octets",
                    verb: "avoir"
                },
                array: {
                    unit: "éléments",
                    verb: "avoir"
                },
                set: {
                    unit: "éléments",
                    verb: "avoir"
                }
            }, t = {
                regex: "entrée",
                email: "adresse e-mail",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "date et heure ISO",
                date: "date ISO",
                time: "heure ISO",
                duration: "durée ISO",
                ipv4: "adresse IPv4",
                ipv6: "adresse IPv6",
                cidrv4: "plage IPv4",
                cidrv6: "plage IPv6",
                base64: "chaîne encodée en base64",
                base64url: "chaîne encodée en base64url",
                json_string: "chaîne JSON",
                e164: "numéro E.164",
                jwt: "JWT",
                template_literal: "entrée"
            }, i = {
                string: "chaîne",
                number: "nombre",
                int: "entier",
                boolean: "booléen",
                bigint: "grand entier",
                symbol: "symbole",
                undefined: "indéfini",
                null: "null",
                never: "jamais",
                void: "vide",
                date: "date",
                array: "tableau",
                object: "objet",
                tuple: "tuple",
                record: "enregistrement",
                map: "carte",
                set: "ensemble",
                file: "fichier",
                nonoptional: "non-optionnel",
                nan: "NaN",
                function: "fonction"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Entr\xe9e invalide : instanceof ${r.expected} attendu, ${n} re\xe7u`;
                            return `Entr\xe9e invalide : ${e} attendu, ${n} re\xe7u`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Entr\xe9e invalide : ${e0(r.values[0])} attendu`;
                        return `Option invalide : une valeur parmi ${ej(r.values,"|")} attendue`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                n = e[r.origin] ? ? null;
                            if (n) return `Trop grand : ${i[r.origin]??"valeur"} doit ${n.verb} ${t}${r.maximum.toString()} ${n.unit??"élément(s)"}`;
                            return `Trop grand : ${i[r.origin]??"valeur"} doit \xeatre ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                n = e[r.origin] ? ? null;
                            if (n) return `Trop petit : ${i[r.origin]??"valeur"} doit ${n.verb} ${t}${r.minimum.toString()} ${n.unit}`;
                            return `Trop petit : ${i[r.origin]??"valeur"} doit \xeatre ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Cha\xeene invalide : doit commencer par "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Cha\xeene invalide : doit se terminer par "${r.suffix}"`;
                        if ("includes" === r.format) return `Cha\xeene invalide : doit inclure "${r.includes}"`;
                        if ("regex" === r.format) return `Cha\xeene invalide : doit correspondre au mod\xe8le ${r.pattern}`;
                        return `${t[r.format]??r.format} invalide`;
                    case "not_multiple_of":
                        return `Nombre invalide : doit \xeatre un multiple de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Cl\xe9${r.keys.length>1?"s":""} non reconnue${r.keys.length>1?"s":""} : ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Cl\xe9 invalide dans ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Entrée invalide";
                    case "invalid_element":
                        return `Valeur invalide dans ${r.origin}`
                }
            })
        }
    }, "frCA", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caractères",
                    verb: "avoir"
                },
                file: {
                    unit: "octets",
                    verb: "avoir"
                },
                array: {
                    unit: "éléments",
                    verb: "avoir"
                },
                set: {
                    unit: "éléments",
                    verb: "avoir"
                }
            }, t = {
                regex: "entrée",
                email: "adresse courriel",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "date-heure ISO",
                date: "date ISO",
                time: "heure ISO",
                duration: "durée ISO",
                ipv4: "adresse IPv4",
                ipv6: "adresse IPv6",
                cidrv4: "plage IPv4",
                cidrv6: "plage IPv6",
                base64: "chaîne encodée en base64",
                base64url: "chaîne encodée en base64url",
                json_string: "chaîne JSON",
                e164: "numéro E.164",
                jwt: "JWT",
                template_literal: "entrée"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Entr\xe9e invalide : attendu instanceof ${r.expected}, re\xe7u ${n}`;
                            return `Entr\xe9e invalide : attendu ${e}, re\xe7u ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Entr\xe9e invalide : attendu ${e0(r.values[0])}`;
                        return `Option invalide : attendu l'une des valeurs suivantes ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "≤" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Trop grand : attendu que ${r.origin??"la valeur"} ait ${t}${r.maximum.toString()} ${i.unit}`;
                            return `Trop grand : attendu que ${r.origin??"la valeur"} soit ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? "≥" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Trop petit : attendu que ${r.origin} ait ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Trop petit : attendu que ${r.origin} soit ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Cha\xeene invalide : doit commencer par "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Cha\xeene invalide : doit se terminer par "${r.suffix}"`;
                        if ("includes" === r.format) return `Cha\xeene invalide : doit inclure "${r.includes}"`;
                        if ("regex" === r.format) return `Cha\xeene invalide : doit correspondre au motif ${r.pattern}`;
                        return `${t[r.format]??r.format} invalide`;
                    case "not_multiple_of":
                        return `Nombre invalide : doit \xeatre un multiple de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Cl\xe9${r.keys.length>1?"s":""} non reconnue${r.keys.length>1?"s":""} : ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Cl\xe9 invalide dans ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Entrée invalide";
                    case "invalid_element":
                        return `Valeur invalide dans ${r.origin}`
                }
            })
        }
    }, "he", 0, function() {
        let e, t, i, r, n, a, o, u, s;
        return {
            localeError: (e = {
                string: {
                    label: "מחרוזת",
                    gender: "f"
                },
                number: {
                    label: "מספר",
                    gender: "m"
                },
                boolean: {
                    label: "ערך בוליאני",
                    gender: "m"
                },
                bigint: {
                    label: "BigInt",
                    gender: "m"
                },
                date: {
                    label: "תאריך",
                    gender: "m"
                },
                array: {
                    label: "מערך",
                    gender: "m"
                },
                object: {
                    label: "אובייקט",
                    gender: "m"
                },
                null: {
                    label: "ערך ריק (null)",
                    gender: "m"
                },
                undefined: {
                    label: "ערך לא מוגדר (undefined)",
                    gender: "m"
                },
                symbol: {
                    label: "סימבול (Symbol)",
                    gender: "m"
                },
                function: {
                    label: "פונקציה",
                    gender: "f"
                },
                map: {
                    label: "מפה (Map)",
                    gender: "f"
                },
                set: {
                    label: "קבוצה (Set)",
                    gender: "f"
                },
                file: {
                    label: "קובץ",
                    gender: "m"
                },
                promise: {
                    label: "Promise",
                    gender: "m"
                },
                NaN: {
                    label: "NaN",
                    gender: "m"
                },
                unknown: {
                    label: "ערך לא ידוע",
                    gender: "m"
                },
                value: {
                    label: "ערך",
                    gender: "m"
                }
            }, t = {
                string: {
                    unit: "תווים",
                    shortLabel: "קצר",
                    longLabel: "ארוך"
                },
                file: {
                    unit: "בייטים",
                    shortLabel: "קטן",
                    longLabel: "גדול"
                },
                array: {
                    unit: "פריטים",
                    shortLabel: "קטן",
                    longLabel: "גדול"
                },
                set: {
                    unit: "פריטים",
                    shortLabel: "קטן",
                    longLabel: "גדול"
                },
                number: {
                    unit: "",
                    shortLabel: "קטן",
                    longLabel: "גדול"
                }
            }, i = t => t ? e[t] : void 0, r = t => {
                let r = i(t);
                return r ? r.label : t ? ? e.unknown.label
            }, n = e => `ה${r(e)}`, a = e => {
                let t = i(e);
                return "f" === (t ? .gender ? ? "m") ? "צריכה להיות" : "צריך להיות"
            }, o = e => e ? t[e] ? ? null : null, u = {
                regex: {
                    label: "קלט",
                    gender: "m"
                },
                email: {
                    label: "כתובת אימייל",
                    gender: "f"
                },
                url: {
                    label: "כתובת רשת",
                    gender: "f"
                },
                emoji: {
                    label: "אימוג'י",
                    gender: "m"
                },
                uuid: {
                    label: "UUID",
                    gender: "m"
                },
                nanoid: {
                    label: "nanoid",
                    gender: "m"
                },
                guid: {
                    label: "GUID",
                    gender: "m"
                },
                cuid: {
                    label: "cuid",
                    gender: "m"
                },
                cuid2: {
                    label: "cuid2",
                    gender: "m"
                },
                ulid: {
                    label: "ULID",
                    gender: "m"
                },
                xid: {
                    label: "XID",
                    gender: "m"
                },
                ksuid: {
                    label: "KSUID",
                    gender: "m"
                },
                datetime: {
                    label: "תאריך וזמן ISO",
                    gender: "m"
                },
                date: {
                    label: "תאריך ISO",
                    gender: "m"
                },
                time: {
                    label: "זמן ISO",
                    gender: "m"
                },
                duration: {
                    label: "משך זמן ISO",
                    gender: "m"
                },
                ipv4: {
                    label: "כתובת IPv4",
                    gender: "f"
                },
                ipv6: {
                    label: "כתובת IPv6",
                    gender: "f"
                },
                cidrv4: {
                    label: "טווח IPv4",
                    gender: "m"
                },
                cidrv6: {
                    label: "טווח IPv6",
                    gender: "m"
                },
                base64: {
                    label: "מחרוזת בבסיס 64",
                    gender: "f"
                },
                base64url: {
                    label: "מחרוזת בבסיס 64 לכתובות רשת",
                    gender: "f"
                },
                json_string: {
                    label: "מחרוזת JSON",
                    gender: "f"
                },
                e164: {
                    label: "מספר E.164",
                    gender: "m"
                },
                jwt: {
                    label: "JWT",
                    gender: "m"
                },
                ends_with: {
                    label: "קלט",
                    gender: "m"
                },
                includes: {
                    label: "קלט",
                    gender: "m"
                },
                lowercase: {
                    label: "קלט",
                    gender: "m"
                },
                starts_with: {
                    label: "קלט",
                    gender: "m"
                },
                uppercase: {
                    label: "קלט",
                    gender: "m"
                }
            }, s = {
                nan: "NaN"
            }, t => {
                switch (t.code) {
                    case "invalid_type":
                        {
                            let i = t.expected,
                                n = s[i ? ? ""] ? ? r(i),
                                a = tt(t.input),
                                o = s[a] ? ? e[a] ? .label ? ? a;
                            if (/^[A-Z]/.test(t.expected)) return `קלט לא תקין: צריך להיות instanceof ${t.expected}, התקבל ${o}`;
                            return `קלט לא תקין: צריך להיות ${n}, התקבל ${o}`
                        }
                    case "invalid_value":
                        {
                            if (1 === t.values.length) return `ערך לא תקין: הערך חייב להיות ${e0(t.values[0])}`;
                            let e = t.values.map(e => e0(e));
                            if (2 === t.values.length) return `ערך לא תקין: האפשרויות המתאימות הן ${e[0]} או ${e[1]}`;
                            let i = e[e.length - 1],
                                r = e.slice(0, -1).join(", ");
                            return `ערך לא תקין: האפשרויות המתאימות הן ${r} או ${i}`
                        }
                    case "too_big":
                        {
                            let e = o(t.origin),
                                i = n(t.origin ? ? "value");
                            if ("string" === t.origin) return `${e?.longLabel??"ארוך"} מדי: ${i} צריכה להכיל ${t.maximum.toString()} ${e?.unit??""} ${t.inclusive?"או פחות":"לכל היותר"}`.trim();
                            if ("number" === t.origin) {
                                let e = t.inclusive ? `קטן או שווה ל-${t.maximum}` : `קטן מ-${t.maximum}`;
                                return `גדול מדי: ${i} צריך להיות ${e}`
                            }
                            if ("array" === t.origin || "set" === t.origin) {
                                let r = "set" === t.origin ? "צריכה" : "צריך",
                                    n = t.inclusive ? `${t.maximum} ${e?.unit??""} או פחות` : `פחות מ-${t.maximum} ${e?.unit??""}`;
                                return `גדול מדי: ${i} ${r} להכיל ${n}`.trim()
                            }
                            let r = t.inclusive ? "<=" : "<",
                                u = a(t.origin ? ? "value");
                            if (e ? .unit) return `${e.longLabel} מדי: ${i} ${u} ${r}${t.maximum.toString()} ${e.unit}`;
                            return `${e?.longLabel??"גדול"} מדי: ${i} ${u} ${r}${t.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let e = o(t.origin),
                                i = n(t.origin ? ? "value");
                            if ("string" === t.origin) return `${e?.shortLabel??"קצר"} מדי: ${i} צריכה להכיל ${t.minimum.toString()} ${e?.unit??""} ${t.inclusive?"או יותר":"לפחות"}`.trim();
                            if ("number" === t.origin) {
                                let e = t.inclusive ? `גדול או שווה ל-${t.minimum}` : `גדול מ-${t.minimum}`;
                                return `קטן מדי: ${i} צריך להיות ${e}`
                            }
                            if ("array" === t.origin || "set" === t.origin) {
                                let r = "set" === t.origin ? "צריכה" : "צריך";
                                if (1 === t.minimum && t.inclusive) {
                                    let e = (t.origin, "לפחות פריט אחד");
                                    return `קטן מדי: ${i} ${r} להכיל ${e}`
                                }
                                let n = t.inclusive ? `${t.minimum} ${e?.unit??""} או יותר` : `יותר מ-${t.minimum} ${e?.unit??""}`;
                                return `קטן מדי: ${i} ${r} להכיל ${n}`.trim()
                            }
                            let r = t.inclusive ? ">=" : ">",
                                u = a(t.origin ? ? "value");
                            if (e ? .unit) return `${e.shortLabel} מדי: ${i} ${u} ${r}${t.minimum.toString()} ${e.unit}`;
                            return `${e?.shortLabel??"קטן"} מדי: ${i} ${u} ${r}${t.minimum.toString()}`
                        }
                    case "invalid_format":
                        {
                            if ("starts_with" === t.format) return `המחרוזת חייבת להתחיל ב "${t.prefix}"`;
                            if ("ends_with" === t.format) return `המחרוזת חייבת להסתיים ב "${t.suffix}"`;
                            if ("includes" === t.format) return `המחרוזת חייבת לכלול "${t.includes}"`;
                            if ("regex" === t.format) return `המחרוזת חייבת להתאים לתבנית ${t.pattern}`;
                            let e = u[t.format],
                                i = e ? .label ? ? t.format,
                                r = e ? .gender ? ? "m";
                            return `${i} לא ${"f"===r?"תקינה":"תקין"}`
                        }
                    case "not_multiple_of":
                        return `מספר לא תקין: חייב להיות מכפלה של ${t.divisor}`;
                    case "unrecognized_keys":
                        return `מפתח${t.keys.length>1?"ות":""} לא מזוה${t.keys.length>1?"ים":"ה"}: ${ej(t.keys,", ")}`;
                    case "invalid_key":
                        return "שדה לא תקין באובייקט";
                    case "invalid_union":
                    default:
                        return "קלט לא תקין";
                    case "invalid_element":
                        {
                            let e = n(t.origin ? ? "array");
                            return `ערך לא תקין ב${e}`
                        }
                }
            })
        }
    }, "hr", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "znakova",
                    verb: "imati"
                },
                file: {
                    unit: "bajtova",
                    verb: "imati"
                },
                array: {
                    unit: "stavki",
                    verb: "imati"
                },
                set: {
                    unit: "stavki",
                    verb: "imati"
                }
            }, t = {
                regex: "unos",
                email: "email adresa",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO datum i vrijeme",
                date: "ISO datum",
                time: "ISO vrijeme",
                duration: "ISO trajanje",
                ipv4: "IPv4 adresa",
                ipv6: "IPv6 adresa",
                cidrv4: "IPv4 raspon",
                cidrv6: "IPv6 raspon",
                base64: "base64 kodirani tekst",
                base64url: "base64url kodirani tekst",
                json_string: "JSON tekst",
                e164: "E.164 broj",
                jwt: "JWT",
                template_literal: "unos"
            }, i = {
                nan: "NaN",
                string: "tekst",
                number: "broj",
                boolean: "boolean",
                array: "niz",
                object: "objekt",
                set: "skup",
                file: "datoteka",
                date: "datum",
                bigint: "bigint",
                symbol: "simbol",
                undefined: "undefined",
                null: "null",
                function: "funkcija",
                map: "mapa"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Neispravan unos: očekuje se instanceof ${r.expected}, a primljeno je ${n}`;
                            return `Neispravan unos: očekuje se ${e}, a primljeno je ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Neispravna vrijednost: očekivano ${e0(r.values[0])}`;
                        return `Neispravna opcija: očekivano jedno od ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `Preveliko: očekivano da ${a??"vrijednost"} ima ${t}${r.maximum.toString()} ${n.unit??"elemenata"}`;
                            return `Preveliko: očekivano da ${a??"vrijednost"} bude ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                n = e[r.origin] ? ? null,
                                a = i[r.origin] ? ? r.origin;
                            if (n) return `Premalo: očekivano da ${a} ima ${t}${r.minimum.toString()} ${n.unit}`;
                            return `Premalo: očekivano da ${a} bude ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Neispravan tekst: mora započinjati s "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Neispravan tekst: mora završavati s "${r.suffix}"`;
                        if ("includes" === r.format) return `Neispravan tekst: mora sadržavati "${r.includes}"`;
                        if ("regex" === r.format) return `Neispravan tekst: mora odgovarati uzorku ${r.pattern}`;
                        return `Neispravna ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Neispravan broj: mora biti višekratnik od ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Neprepoznat${r.keys.length>1?"i ključevi":" ključ"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Neispravan ključ u ${i[r.origin]??r.origin}`;
                    case "invalid_union":
                    default:
                        return "Neispravan unos";
                    case "invalid_element":
                        return `Neispravna vrijednost u ${i[r.origin]??r.origin}`
                }
            })
        }
    }, "hu", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "karakter",
                    verb: "legyen"
                },
                file: {
                    unit: "byte",
                    verb: "legyen"
                },
                array: {
                    unit: "elem",
                    verb: "legyen"
                },
                set: {
                    unit: "elem",
                    verb: "legyen"
                }
            }, t = {
                regex: "bemenet",
                email: "email cím",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO időbélyeg",
                date: "ISO dátum",
                time: "ISO idő",
                duration: "ISO időintervallum",
                ipv4: "IPv4 cím",
                ipv6: "IPv6 cím",
                cidrv4: "IPv4 tartomány",
                cidrv6: "IPv6 tartomány",
                base64: "base64-kódolt string",
                base64url: "base64url-kódolt string",
                json_string: "JSON string",
                e164: "E.164 szám",
                jwt: "JWT",
                template_literal: "bemenet"
            }, i = {
                nan: "NaN",
                number: "szám",
                array: "tömb"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `\xc9rv\xe9nytelen bemenet: a v\xe1rt \xe9rt\xe9k instanceof ${r.expected}, a kapott \xe9rt\xe9k ${n}`;
                            return `\xc9rv\xe9nytelen bemenet: a v\xe1rt \xe9rt\xe9k ${e}, a kapott \xe9rt\xe9k ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `\xc9rv\xe9nytelen bemenet: a v\xe1rt \xe9rt\xe9k ${e0(r.values[0])}`;
                        return `\xc9rv\xe9nytelen opci\xf3: valamelyik \xe9rt\xe9k v\xe1rt ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `T\xfal nagy: ${r.origin??"érték"} m\xe9rete t\xfal nagy ${t}${r.maximum.toString()} ${i.unit??"elem"}`;
                            return `T\xfal nagy: a bemeneti \xe9rt\xe9k ${r.origin??"érték"} t\xfal nagy: ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `T\xfal kicsi: a bemeneti \xe9rt\xe9k ${r.origin} m\xe9rete t\xfal kicsi ${t}${r.minimum.toString()} ${i.unit}`;
                            return `T\xfal kicsi: a bemeneti \xe9rt\xe9k ${r.origin} t\xfal kicsi ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `\xc9rv\xe9nytelen string: "${r.prefix}" \xe9rt\xe9kkel kell kezdődnie`;
                        if ("ends_with" === r.format) return `\xc9rv\xe9nytelen string: "${r.suffix}" \xe9rt\xe9kkel kell v\xe9gződnie`;
                        if ("includes" === r.format) return `\xc9rv\xe9nytelen string: "${r.includes}" \xe9rt\xe9ket kell tartalmaznia`;
                        if ("regex" === r.format) return `\xc9rv\xe9nytelen string: ${r.pattern} mint\xe1nak kell megfelelnie`;
                        return `\xc9rv\xe9nytelen ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `\xc9rv\xe9nytelen sz\xe1m: ${r.divisor} t\xf6bbsz\xf6r\xf6s\xe9nek kell lennie`;
                    case "unrecognized_keys":
                        return `Ismeretlen kulcs${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `\xc9rv\xe9nytelen kulcs ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Érvénytelen bemenet";
                    case "invalid_element":
                        return `\xc9rv\xe9nytelen \xe9rt\xe9k: ${r.origin}`
                }
            })
        }
    }, "hy", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: {
                        one: "նշան",
                        many: "նշաններ"
                    },
                    verb: "ունենալ"
                },
                file: {
                    unit: {
                        one: "բայթ",
                        many: "բայթեր"
                    },
                    verb: "ունենալ"
                },
                array: {
                    unit: {
                        one: "տարր",
                        many: "տարրեր"
                    },
                    verb: "ունենալ"
                },
                set: {
                    unit: {
                        one: "տարր",
                        many: "տարրեր"
                    },
                    verb: "ունենալ"
                }
            }, t = {
                regex: "մուտք",
                email: "էլ. հասցե",
                url: "URL",
                emoji: "էմոջի",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO ամսաթիվ և ժամ",
                date: "ISO ամսաթիվ",
                time: "ISO ժամ",
                duration: "ISO տևողություն",
                ipv4: "IPv4 հասցե",
                ipv6: "IPv6 հասցե",
                cidrv4: "IPv4 միջակայք",
                cidrv6: "IPv6 միջակայք",
                base64: "base64 ձևաչափով տող",
                base64url: "base64url ձևաչափով տող",
                json_string: "JSON տող",
                e164: "E.164 համար",
                jwt: "JWT",
                template_literal: "մուտք"
            }, i = {
                nan: "NaN",
                number: "թիվ",
                array: "զանգված"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Սխալ մուտքագրում․ սպասվում էր instanceof ${r.expected}, ստացվել է ${n}`;
                            return `Սխալ մուտքագրում․ սպասվում էր ${e}, ստացվել է ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Սխալ մուտքագրում․ սպասվում էր ${e0(r.values[1])}`;
                        return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nw(Number(r.maximum), i.unit.one, i.unit.many);
                                return `Չափազանց մեծ արժեք․ սպասվում է, որ ${nz(r.origin??"արժեք")} կունենա ${t}${r.maximum.toString()} ${e}`
                            }
                            return `Չափազանց մեծ արժեք․ սպասվում է, որ ${nz(r.origin??"արժեք")} լինի ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nw(Number(r.minimum), i.unit.one, i.unit.many);
                                return `Չափազանց փոքր արժեք․ սպասվում է, որ ${nz(r.origin)} կունենա ${t}${r.minimum.toString()} ${e}`
                            }
                            return `Չափազանց փոքր արժեք․ սպասվում է, որ ${nz(r.origin)} լինի ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Սխալ տող․ պետք է սկսվի "${r.prefix}"-ով`;
                        if ("ends_with" === r.format) return `Սխալ տող․ պետք է ավարտվի "${r.suffix}"-ով`;
                        if ("includes" === r.format) return `Սխալ տող․ պետք է պարունակի "${r.includes}"`;
                        if ("regex" === r.format) return `Սխալ տող․ պետք է համապատասխանի ${r.pattern} ձևաչափին`;
                        return `Սխալ ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${r.divisor}-ի`;
                    case "unrecognized_keys":
                        return `Չճանաչված բանալի${r.keys.length>1?"ներ":""}. ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Սխալ բանալի ${nz(r.origin)}-ում`;
                    case "invalid_union":
                    default:
                        return "Սխալ մուտքագրում";
                    case "invalid_element":
                        return `Սխալ արժեք ${nz(r.origin)}-ում`
                }
            })
        }
    }, "id", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "karakter",
                    verb: "memiliki"
                },
                file: {
                    unit: "byte",
                    verb: "memiliki"
                },
                array: {
                    unit: "item",
                    verb: "memiliki"
                },
                set: {
                    unit: "item",
                    verb: "memiliki"
                }
            }, t = {
                regex: "input",
                email: "alamat email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "tanggal dan waktu format ISO",
                date: "tanggal format ISO",
                time: "jam format ISO",
                duration: "durasi format ISO",
                ipv4: "alamat IPv4",
                ipv6: "alamat IPv6",
                cidrv4: "rentang alamat IPv4",
                cidrv6: "rentang alamat IPv6",
                base64: "string dengan enkode base64",
                base64url: "string dengan enkode base64url",
                json_string: "string JSON",
                e164: "angka E.164",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Input tidak valid: diharapkan instanceof ${r.expected}, diterima ${n}`;
                            return `Input tidak valid: diharapkan ${e}, diterima ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Input tidak valid: diharapkan ${e0(r.values[0])}`;
                        return `Pilihan tidak valid: diharapkan salah satu dari ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Terlalu besar: diharapkan ${r.origin??"value"} memiliki ${t}${r.maximum.toString()} ${i.unit??"elemen"}`;
                            return `Terlalu besar: diharapkan ${r.origin??"value"} menjadi ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Terlalu kecil: diharapkan ${r.origin} memiliki ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Terlalu kecil: diharapkan ${r.origin} menjadi ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `String tidak valid: harus dimulai dengan "${r.prefix}"`;
                        if ("ends_with" === r.format) return `String tidak valid: harus berakhir dengan "${r.suffix}"`;
                        if ("includes" === r.format) return `String tidak valid: harus menyertakan "${r.includes}"`;
                        if ("regex" === r.format) return `String tidak valid: harus sesuai pola ${r.pattern}`;
                        return `${t[r.format]??r.format} tidak valid`;
                    case "not_multiple_of":
                        return `Angka tidak valid: harus kelipatan dari ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Kunci tidak dikenali ${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Kunci tidak valid di ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Input tidak valid";
                    case "invalid_element":
                        return `Nilai tidak valid di ${r.origin}`
                }
            })
        }
    }, "is", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "stafi",
                    verb: "að hafa"
                },
                file: {
                    unit: "bæti",
                    verb: "að hafa"
                },
                array: {
                    unit: "hluti",
                    verb: "að hafa"
                },
                set: {
                    unit: "hluti",
                    verb: "að hafa"
                }
            }, t = {
                regex: "gildi",
                email: "netfang",
                url: "vefslóð",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO dagsetning og tími",
                date: "ISO dagsetning",
                time: "ISO tími",
                duration: "ISO tímalengd",
                ipv4: "IPv4 address",
                ipv6: "IPv6 address",
                cidrv4: "IPv4 range",
                cidrv6: "IPv6 range",
                base64: "base64-encoded strengur",
                base64url: "base64url-encoded strengur",
                json_string: "JSON strengur",
                e164: "E.164 tölugildi",
                jwt: "JWT",
                template_literal: "gildi"
            }, i = {
                nan: "NaN",
                number: "númer",
                array: "fylki"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Rangt gildi: \xde\xfa sl\xf3st inn ${n} \xfear sem \xe1 a\xf0 vera instanceof ${r.expected}`;
                            return `Rangt gildi: \xde\xfa sl\xf3st inn ${n} \xfear sem \xe1 a\xf0 vera ${e}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Rangt gildi: gert r\xe1\xf0 fyrir ${e0(r.values[0])}`;
                        return `\xd3gilt val: m\xe1 vera eitt af eftirfarandi ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Of st\xf3rt: gert er r\xe1\xf0 fyrir a\xf0 ${r.origin??"gildi"} hafi ${t}${r.maximum.toString()} ${i.unit??"hluti"}`;
                            return `Of st\xf3rt: gert er r\xe1\xf0 fyrir a\xf0 ${r.origin??"gildi"} s\xe9 ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Of l\xedti\xf0: gert er r\xe1\xf0 fyrir a\xf0 ${r.origin} hafi ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Of l\xedti\xf0: gert er r\xe1\xf0 fyrir a\xf0 ${r.origin} s\xe9 ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `\xd3gildur strengur: ver\xf0ur a\xf0 byrja \xe1 "${r.prefix}"`;
                        if ("ends_with" === r.format) return `\xd3gildur strengur: ver\xf0ur a\xf0 enda \xe1 "${r.suffix}"`;
                        if ("includes" === r.format) return `\xd3gildur strengur: ver\xf0ur a\xf0 innihalda "${r.includes}"`;
                        if ("regex" === r.format) return `\xd3gildur strengur: ver\xf0ur a\xf0 fylgja mynstri ${r.pattern}`;
                        return `Rangt ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `R\xf6ng tala: ver\xf0ur a\xf0 vera margfeldi af ${r.divisor}`;
                    case "unrecognized_keys":
                        return `\xd3\xfeekkt ${r.keys.length>1?"ir lyklar":"ur lykill"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Rangur lykill \xed ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Rangt gildi";
                    case "invalid_element":
                        return `Rangt gildi \xed ${r.origin}`
                }
            })
        }
    }, "it", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caratteri",
                    verb: "avere"
                },
                file: {
                    unit: "byte",
                    verb: "avere"
                },
                array: {
                    unit: "elementi",
                    verb: "avere"
                },
                set: {
                    unit: "elementi",
                    verb: "avere"
                }
            }, t = {
                regex: "input",
                email: "indirizzo email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "data e ora ISO",
                date: "data ISO",
                time: "ora ISO",
                duration: "durata ISO",
                ipv4: "indirizzo IPv4",
                ipv6: "indirizzo IPv6",
                cidrv4: "intervallo IPv4",
                cidrv6: "intervallo IPv6",
                base64: "stringa codificata in base64",
                base64url: "URL codificata in base64",
                json_string: "stringa JSON",
                e164: "numero E.164",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN",
                number: "numero",
                array: "vettore"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Input non valido: atteso instanceof ${r.expected}, ricevuto ${n}`;
                            return `Input non valido: atteso ${e}, ricevuto ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Input non valido: atteso ${e0(r.values[0])}`;
                        return `Opzione non valida: atteso uno tra ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Troppo grande: ${r.origin??"valore"} deve avere ${t}${r.maximum.toString()} ${i.unit??"elementi"}`;
                            return `Troppo grande: ${r.origin??"valore"} deve essere ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Troppo piccolo: ${r.origin} deve avere ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Troppo piccolo: ${r.origin} deve essere ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Stringa non valida: deve iniziare con "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Stringa non valida: deve terminare con "${r.suffix}"`;
                        if ("includes" === r.format) return `Stringa non valida: deve includere "${r.includes}"`;
                        if ("regex" === r.format) return `Stringa non valida: deve corrispondere al pattern ${r.pattern}`;
                        return `Input non valido: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Numero non valido: deve essere un multiplo di ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Chiav${r.keys.length>1?"i":"e"} non riconosciut${r.keys.length>1?"e":"a"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Chiave non valida in ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Input non valido";
                    case "invalid_element":
                        return `Valore non valido in ${r.origin}`
                }
            })
        }
    }, "ja", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "文字",
                    verb: "である"
                },
                file: {
                    unit: "バイト",
                    verb: "である"
                },
                array: {
                    unit: "要素",
                    verb: "である"
                },
                set: {
                    unit: "要素",
                    verb: "である"
                }
            }, t = {
                regex: "入力値",
                email: "メールアドレス",
                url: "URL",
                emoji: "絵文字",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO日時",
                date: "ISO日付",
                time: "ISO時刻",
                duration: "ISO期間",
                ipv4: "IPv4アドレス",
                ipv6: "IPv6アドレス",
                cidrv4: "IPv4範囲",
                cidrv6: "IPv6範囲",
                base64: "base64エンコード文字列",
                base64url: "base64urlエンコード文字列",
                json_string: "JSON文字列",
                e164: "E.164番号",
                jwt: "JWT",
                template_literal: "入力値"
            }, i = {
                nan: "NaN",
                number: "数値",
                array: "配列"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `無効な入力: instanceof ${r.expected}が期待されましたが、${n}が入力されました`;
                            return `無効な入力: ${e}が期待されましたが、${n}が入力されました`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `無効な入力: ${e0(r.values[0])}が期待されました`;
                        return `無効な選択: ${ej(r.values,"、")}のいずれかである必要があります`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "以下である" : "より小さい",
                                i = e[r.origin] ? ? null;
                            if (i) return `大きすぎる値: ${r.origin??"値"}は${r.maximum.toString()}${i.unit??"要素"}${t}必要があります`;
                            return `大きすぎる値: ${r.origin??"値"}は${r.maximum.toString()}${t}必要があります`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? "以上である" : "より大きい",
                                i = e[r.origin] ? ? null;
                            if (i) return `小さすぎる値: ${r.origin}は${r.minimum.toString()}${i.unit}${t}必要があります`;
                            return `小さすぎる値: ${r.origin}は${r.minimum.toString()}${t}必要があります`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `無効な文字列: "${r.prefix}"で始まる必要があります`;
                        if ("ends_with" === r.format) return `無効な文字列: "${r.suffix}"で終わる必要があります`;
                        if ("includes" === r.format) return `無効な文字列: "${r.includes}"を含む必要があります`;
                        if ("regex" === r.format) return `無効な文字列: パターン${r.pattern}に一致する必要があります`;
                        return `無効な${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `無効な数値: ${r.divisor}の倍数である必要があります`;
                    case "unrecognized_keys":
                        return `認識されていないキー${r.keys.length>1?"群":""}: ${ej(r.keys,"、")}`;
                    case "invalid_key":
                        return `${r.origin}内の無効なキー`;
                    case "invalid_union":
                    default:
                        return "無効な入力";
                    case "invalid_element":
                        return `${r.origin}内の無効な値`
                }
            })
        }
    }, "ka", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "სიმბოლო",
                    verb: "უნდა შეიცავდეს"
                },
                file: {
                    unit: "ბაიტი",
                    verb: "უნდა შეიცავდეს"
                },
                array: {
                    unit: "ელემენტი",
                    verb: "უნდა შეიცავდეს"
                },
                set: {
                    unit: "ელემენტი",
                    verb: "უნდა შეიცავდეს"
                }
            }, t = {
                regex: "შეყვანა",
                email: "ელ-ფოსტის მისამართი",
                url: "URL",
                emoji: "ემოჯი",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "თარიღი-დრო",
                date: "თარიღი",
                time: "დრო",
                duration: "ხანგრძლივობა",
                ipv4: "IPv4 მისამართი",
                ipv6: "IPv6 მისამართი",
                cidrv4: "IPv4 დიაპაზონი",
                cidrv6: "IPv6 დიაპაზონი",
                base64: "base64-კოდირებული ველი",
                base64url: "base64url-კოდირებული ველი",
                json_string: "JSON ველი",
                e164: "E.164 ნომერი",
                jwt: "JWT",
                template_literal: "შეყვანა"
            }, i = {
                nan: "NaN",
                number: "რიცხვი",
                string: "ველი",
                boolean: "ბულეანი",
                function: "ფუნქცია",
                array: "მასივი"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `არასწორი შეყვანა: მოსალოდნელი instanceof ${r.expected}, მიღებული ${n}`;
                            return `არასწორი შეყვანა: მოსალოდნელი ${e}, მიღებული ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `არასწორი შეყვანა: მოსალოდნელი ${e0(r.values[0])}`;
                        return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${ej(r.values,"|")}-დან`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `ზედმეტად დიდი: მოსალოდნელი ${r.origin??"მნიშვნელობა"} ${i.verb} ${t}${r.maximum.toString()} ${i.unit}`;
                            return `ზედმეტად დიდი: მოსალოდნელი ${r.origin??"მნიშვნელობა"} იყოს ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `ზედმეტად პატარა: მოსალოდნელი ${r.origin} ${i.verb} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `ზედმეტად პატარა: მოსალოდნელი ${r.origin} იყოს ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `არასწორი ველი: უნდა იწყებოდეს "${r.prefix}"-ით`;
                        if ("ends_with" === r.format) return `არასწორი ველი: უნდა მთავრდებოდეს "${r.suffix}"-ით`;
                        if ("includes" === r.format) return `არასწორი ველი: უნდა შეიცავდეს "${r.includes}"-ს`;
                        if ("regex" === r.format) return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${r.pattern}`;
                        return `არასწორი ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `არასწორი რიცხვი: უნდა იყოს ${r.divisor}-ის ჯერადი`;
                    case "unrecognized_keys":
                        return `უცნობი გასაღებ${r.keys.length>1?"ები":"ი"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `არასწორი გასაღები ${r.origin}-ში`;
                    case "invalid_union":
                    default:
                        return "არასწორი შეყვანა";
                    case "invalid_element":
                        return `არასწორი მნიშვნელობა ${r.origin}-ში`
                }
            })
        }
    }, "kh", 0, function() {
        return nZ()
    }, "km", 0, nZ, "ko", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "문자",
                    verb: "to have"
                },
                file: {
                    unit: "바이트",
                    verb: "to have"
                },
                array: {
                    unit: "개",
                    verb: "to have"
                },
                set: {
                    unit: "개",
                    verb: "to have"
                }
            }, t = {
                regex: "입력",
                email: "이메일 주소",
                url: "URL",
                emoji: "이모지",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO 날짜시간",
                date: "ISO 날짜",
                time: "ISO 시간",
                duration: "ISO 기간",
                ipv4: "IPv4 주소",
                ipv6: "IPv6 주소",
                cidrv4: "IPv4 범위",
                cidrv6: "IPv6 범위",
                base64: "base64 인코딩 문자열",
                base64url: "base64url 인코딩 문자열",
                json_string: "JSON 문자열",
                e164: "E.164 번호",
                jwt: "JWT",
                template_literal: "입력"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `잘못된 입력: 예상 타입은 instanceof ${r.expected}, 받은 타입은 ${n}입니다`;
                            return `잘못된 입력: 예상 타입은 ${e}, 받은 타입은 ${n}입니다`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `잘못된 입력: 값은 ${e0(r.values[0])} 이어야 합니다`;
                        return `잘못된 옵션: ${ej(r.values,"또는 ")} 중 하나여야 합니다`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "이하" : "미만",
                                i = "미만" === t ? "이어야 합니다" : "여야 합니다",
                                n = e[r.origin] ? ? null,
                                a = n ? .unit ? ? "요소";
                            if (n) return `${r.origin??"값"}이 너무 큽니다: ${r.maximum.toString()}${a} ${t}${i}`;
                            return `${r.origin??"값"}이 너무 큽니다: ${r.maximum.toString()} ${t}${i}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? "이상" : "초과",
                                i = "이상" === t ? "이어야 합니다" : "여야 합니다",
                                n = e[r.origin] ? ? null,
                                a = n ? .unit ? ? "요소";
                            if (n) return `${r.origin??"값"}이 너무 작습니다: ${r.minimum.toString()}${a} ${t}${i}`;
                            return `${r.origin??"값"}이 너무 작습니다: ${r.minimum.toString()} ${t}${i}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `잘못된 문자열: "${r.prefix}"(으)로 시작해야 합니다`;
                        if ("ends_with" === r.format) return `잘못된 문자열: "${r.suffix}"(으)로 끝나야 합니다`;
                        if ("includes" === r.format) return `잘못된 문자열: "${r.includes}"을(를) 포함해야 합니다`;
                        if ("regex" === r.format) return `잘못된 문자열: 정규식 ${r.pattern} 패턴과 일치해야 합니다`;
                        return `잘못된 ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `잘못된 숫자: ${r.divisor}의 배수여야 합니다`;
                    case "unrecognized_keys":
                        return `인식할 수 없는 키: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `잘못된 키: ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "잘못된 입력";
                    case "invalid_element":
                        return `잘못된 값: ${r.origin}`
                }
            })
        }
    }, "lt", 0, function() {
        return {
            localeError: (() => {
                let e = {
                    string: {
                        unit: {
                            one: "simbolis",
                            few: "simboliai",
                            many: "simbolių"
                        },
                        verb: {
                            smaller: {
                                inclusive: "turi būti ne ilgesnė kaip",
                                notInclusive: "turi būti trumpesnė kaip"
                            },
                            bigger: {
                                inclusive: "turi būti ne trumpesnė kaip",
                                notInclusive: "turi būti ilgesnė kaip"
                            }
                        }
                    },
                    file: {
                        unit: {
                            one: "baitas",
                            few: "baitai",
                            many: "baitų"
                        },
                        verb: {
                            smaller: {
                                inclusive: "turi būti ne didesnis kaip",
                                notInclusive: "turi būti mažesnis kaip"
                            },
                            bigger: {
                                inclusive: "turi būti ne mažesnis kaip",
                                notInclusive: "turi būti didesnis kaip"
                            }
                        }
                    },
                    array: {
                        unit: {
                            one: "elementą",
                            few: "elementus",
                            many: "elementų"
                        },
                        verb: {
                            smaller: {
                                inclusive: "turi turėti ne daugiau kaip",
                                notInclusive: "turi turėti mažiau kaip"
                            },
                            bigger: {
                                inclusive: "turi turėti ne mažiau kaip",
                                notInclusive: "turi turėti daugiau kaip"
                            }
                        }
                    },
                    set: {
                        unit: {
                            one: "elementą",
                            few: "elementus",
                            many: "elementų"
                        },
                        verb: {
                            smaller: {
                                inclusive: "turi turėti ne daugiau kaip",
                                notInclusive: "turi turėti mažiau kaip"
                            },
                            bigger: {
                                inclusive: "turi turėti ne mažiau kaip",
                                notInclusive: "turi turėti daugiau kaip"
                            }
                        }
                    }
                };

                function t(t, i, r, n) {
                    let a = e[t] ? ? null;
                    return null === a ? a : {
                        unit: a.unit[i],
                        verb: a.verb[n][r ? "inclusive" : "notInclusive"]
                    }
                }
                let i = {
                        regex: "įvestis",
                        email: "el. pašto adresas",
                        url: "URL",
                        emoji: "jaustukas",
                        uuid: "UUID",
                        uuidv4: "UUIDv4",
                        uuidv6: "UUIDv6",
                        nanoid: "nanoid",
                        guid: "GUID",
                        cuid: "cuid",
                        cuid2: "cuid2",
                        ulid: "ULID",
                        xid: "XID",
                        ksuid: "KSUID",
                        datetime: "ISO data ir laikas",
                        date: "ISO data",
                        time: "ISO laikas",
                        duration: "ISO trukmė",
                        ipv4: "IPv4 adresas",
                        ipv6: "IPv6 adresas",
                        cidrv4: "IPv4 tinklo prefiksas (CIDR)",
                        cidrv6: "IPv6 tinklo prefiksas (CIDR)",
                        base64: "base64 užkoduota eilutė",
                        base64url: "base64url užkoduota eilutė",
                        json_string: "JSON eilutė",
                        e164: "E.164 numeris",
                        jwt: "JWT",
                        template_literal: "įvestis"
                    },
                    r = {
                        nan: "NaN",
                        number: "skaičius",
                        bigint: "sveikasis skaičius",
                        string: "eilutė",
                        boolean: "loginė reikšmė",
                        undefined: "neapibrėžta reikšmė",
                        function: "funkcija",
                        symbol: "simbolis",
                        array: "masyvas",
                        object: "objektas",
                        null: "nulinė reikšmė"
                    };
                return e => {
                    switch (e.code) {
                        case "invalid_type":
                            {
                                let t = r[e.expected] ? ? e.expected,
                                    i = tt(e.input),
                                    n = r[i] ? ? i;
                                if (/^[A-Z]/.test(e.expected)) return `Gautas tipas ${n}, o tikėtasi - instanceof ${e.expected}`;
                                return `Gautas tipas ${n}, o tikėtasi - ${t}`
                            }
                        case "invalid_value":
                            if (1 === e.values.length) return `Privalo būti ${e0(e.values[0])}`;
                            return `Privalo būti vienas iš ${ej(e.values,"|")} pasirinkimų`;
                        case "too_big":
                            {
                                let i = r[e.origin] ? ? e.origin,
                                    n = t(e.origin, nO(Number(e.maximum)), e.inclusive ? ? !1, "smaller");
                                if (n ? .verb) return `${nU(i??e.origin??"reikšmė")} ${n.verb} ${e.maximum.toString()} ${n.unit??"elementų"}`;
                                let a = e.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
                                return `${nU(i??e.origin??"reikšmė")} turi būti ${a} ${e.maximum.toString()} ${n?.unit}`
                            }
                        case "too_small":
                            {
                                let i = r[e.origin] ? ? e.origin,
                                    n = t(e.origin, nO(Number(e.minimum)), e.inclusive ? ? !1, "bigger");
                                if (n ? .verb) return `${nU(i??e.origin??"reikšmė")} ${n.verb} ${e.minimum.toString()} ${n.unit??"elementų"}`;
                                let a = e.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
                                return `${nU(i??e.origin??"reikšmė")} turi būti ${a} ${e.minimum.toString()} ${n?.unit}`
                            }
                        case "invalid_format":
                            if ("starts_with" === e.format) return `Eilutė privalo prasidėti "${e.prefix}"`;
                            if ("ends_with" === e.format) return `Eilutė privalo pasibaigti "${e.suffix}"`;
                            if ("includes" === e.format) return `Eilutė privalo įtraukti "${e.includes}"`;
                            if ("regex" === e.format) return `Eilutė privalo atitikti ${e.pattern}`;
                            return `Neteisingas ${i[e.format]??e.format}`;
                        case "not_multiple_of":
                            return `Skaičius privalo būti ${e.divisor} kartotinis.`;
                        case "unrecognized_keys":
                            return `Neatpažint${e.keys.length>1?"i":"as"} rakt${e.keys.length>1?"ai":"as"}: ${ej(e.keys,", ")}`;
                        case "invalid_key":
                            return "Rastas klaidingas raktas";
                        case "invalid_union":
                        default:
                            return "Klaidinga įvestis";
                        case "invalid_element":
                            {
                                let t = r[e.origin] ? ? e.origin;
                                return `${nU(t??e.origin??"reikšmė")} turi klaidingą įvestį`
                            }
                    }
                }
            })()
        }
    }, "mk", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "знаци",
                    verb: "да имаат"
                },
                file: {
                    unit: "бајти",
                    verb: "да имаат"
                },
                array: {
                    unit: "ставки",
                    verb: "да имаат"
                },
                set: {
                    unit: "ставки",
                    verb: "да имаат"
                }
            }, t = {
                regex: "внес",
                email: "адреса на е-пошта",
                url: "URL",
                emoji: "емоџи",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO датум и време",
                date: "ISO датум",
                time: "ISO време",
                duration: "ISO времетраење",
                ipv4: "IPv4 адреса",
                ipv6: "IPv6 адреса",
                cidrv4: "IPv4 опсег",
                cidrv6: "IPv6 опсег",
                base64: "base64-енкодирана низа",
                base64url: "base64url-енкодирана низа",
                json_string: "JSON низа",
                e164: "E.164 број",
                jwt: "JWT",
                template_literal: "внес"
            }, i = {
                nan: "NaN",
                number: "број",
                array: "низа"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Грешен внес: се очекува instanceof ${r.expected}, примено ${n}`;
                            return `Грешен внес: се очекува ${e}, примено ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Invalid input: expected ${e0(r.values[0])}`;
                        return `Грешана опција: се очекува една ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Премногу голем: се очекува ${r.origin??"вредноста"} да има ${t}${r.maximum.toString()} ${i.unit??"елементи"}`;
                            return `Премногу голем: се очекува ${r.origin??"вредноста"} да биде ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Премногу мал: се очекува ${r.origin} да има ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Премногу мал: се очекува ${r.origin} да биде ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Неважечка низа: мора да започнува со "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Неважечка низа: мора да завршува со "${r.suffix}"`;
                        if ("includes" === r.format) return `Неважечка низа: мора да вклучува "${r.includes}"`;
                        if ("regex" === r.format) return `Неважечка низа: мора да одгоара на патернот ${r.pattern}`;
                        return `Invalid ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Грешен број: мора да биде делив со ${r.divisor}`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Грешен клуч во ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Грешен внес";
                    case "invalid_element":
                        return `Грешна вредност во ${r.origin}`
                }
            })
        }
    }, "ms", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "aksara",
                    verb: "mempunyai"
                },
                file: {
                    unit: "bait",
                    verb: "mempunyai"
                },
                array: {
                    unit: "elemen",
                    verb: "mempunyai"
                },
                set: {
                    unit: "elemen",
                    verb: "mempunyai"
                }
            }, t = {
                regex: "input",
                email: "alamat e-mel",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "tarikh masa ISO",
                date: "tarikh ISO",
                time: "masa ISO",
                duration: "tempoh ISO",
                ipv4: "alamat IPv4",
                ipv6: "alamat IPv6",
                cidrv4: "julat IPv4",
                cidrv6: "julat IPv6",
                base64: "string dikodkan base64",
                base64url: "string dikodkan base64url",
                json_string: "string JSON",
                e164: "nombor E.164",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN",
                number: "nombor"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Input tidak sah: dijangka instanceof ${r.expected}, diterima ${n}`;
                            return `Input tidak sah: dijangka ${e}, diterima ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Input tidak sah: dijangka ${e0(r.values[0])}`;
                        return `Pilihan tidak sah: dijangka salah satu daripada ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Terlalu besar: dijangka ${r.origin??"nilai"} ${i.verb} ${t}${r.maximum.toString()} ${i.unit??"elemen"}`;
                            return `Terlalu besar: dijangka ${r.origin??"nilai"} adalah ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Terlalu kecil: dijangka ${r.origin} ${i.verb} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Terlalu kecil: dijangka ${r.origin} adalah ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `String tidak sah: mesti bermula dengan "${r.prefix}"`;
                        if ("ends_with" === r.format) return `String tidak sah: mesti berakhir dengan "${r.suffix}"`;
                        if ("includes" === r.format) return `String tidak sah: mesti mengandungi "${r.includes}"`;
                        if ("regex" === r.format) return `String tidak sah: mesti sepadan dengan corak ${r.pattern}`;
                        return `${t[r.format]??r.format} tidak sah`;
                    case "not_multiple_of":
                        return `Nombor tidak sah: perlu gandaan ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Kunci tidak dikenali: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Kunci tidak sah dalam ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Input tidak sah";
                    case "invalid_element":
                        return `Nilai tidak sah dalam ${r.origin}`
                }
            })
        }
    }, "nl", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "tekens",
                    verb: "heeft"
                },
                file: {
                    unit: "bytes",
                    verb: "heeft"
                },
                array: {
                    unit: "elementen",
                    verb: "heeft"
                },
                set: {
                    unit: "elementen",
                    verb: "heeft"
                }
            }, t = {
                regex: "invoer",
                email: "emailadres",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO datum en tijd",
                date: "ISO datum",
                time: "ISO tijd",
                duration: "ISO duur",
                ipv4: "IPv4-adres",
                ipv6: "IPv6-adres",
                cidrv4: "IPv4-bereik",
                cidrv6: "IPv6-bereik",
                base64: "base64-gecodeerde tekst",
                base64url: "base64 URL-gecodeerde tekst",
                json_string: "JSON string",
                e164: "E.164-nummer",
                jwt: "JWT",
                template_literal: "invoer"
            }, i = {
                nan: "NaN",
                number: "getal"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ongeldige invoer: verwacht instanceof ${r.expected}, ontving ${n}`;
                            return `Ongeldige invoer: verwacht ${e}, ontving ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ongeldige invoer: verwacht ${e0(r.values[0])}`;
                        return `Ongeldige optie: verwacht \xe9\xe9n van ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null,
                                n = "date" === r.origin ? "laat" : "string" === r.origin ? "lang" : "groot";
                            if (i) return `Te ${n}: verwacht dat ${r.origin??"waarde"} ${t}${r.maximum.toString()} ${i.unit??"elementen"} ${i.verb}`;
                            return `Te ${n}: verwacht dat ${r.origin??"waarde"} ${t}${r.maximum.toString()} is`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null,
                                n = "date" === r.origin ? "vroeg" : "string" === r.origin ? "kort" : "klein";
                            if (i) return `Te ${n}: verwacht dat ${r.origin} ${t}${r.minimum.toString()} ${i.unit} ${i.verb}`;
                            return `Te ${n}: verwacht dat ${r.origin} ${t}${r.minimum.toString()} is`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ongeldige tekst: moet met "${r.prefix}" beginnen`;
                        if ("ends_with" === r.format) return `Ongeldige tekst: moet op "${r.suffix}" eindigen`;
                        if ("includes" === r.format) return `Ongeldige tekst: moet "${r.includes}" bevatten`;
                        if ("regex" === r.format) return `Ongeldige tekst: moet overeenkomen met patroon ${r.pattern}`;
                        return `Ongeldig: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ongeldig getal: moet een veelvoud van ${r.divisor} zijn`;
                    case "unrecognized_keys":
                        return `Onbekende key${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Ongeldige key in ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Ongeldige invoer";
                    case "invalid_element":
                        return `Ongeldige waarde in ${r.origin}`
                }
            })
        }
    }, "no", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "tegn",
                    verb: "å ha"
                },
                file: {
                    unit: "bytes",
                    verb: "å ha"
                },
                array: {
                    unit: "elementer",
                    verb: "å inneholde"
                },
                set: {
                    unit: "elementer",
                    verb: "å inneholde"
                }
            }, t = {
                regex: "input",
                email: "e-postadresse",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO dato- og klokkeslett",
                date: "ISO-dato",
                time: "ISO-klokkeslett",
                duration: "ISO-varighet",
                ipv4: "IPv4-område",
                ipv6: "IPv6-område",
                cidrv4: "IPv4-spekter",
                cidrv6: "IPv6-spekter",
                base64: "base64-enkodet streng",
                base64url: "base64url-enkodet streng",
                json_string: "JSON-streng",
                e164: "E.164-nummer",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN",
                number: "tall",
                array: "liste"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ugyldig input: forventet instanceof ${r.expected}, fikk ${n}`;
                            return `Ugyldig input: forventet ${e}, fikk ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ugyldig verdi: forventet ${e0(r.values[0])}`;
                        return `Ugyldig valg: forventet en av ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `For stor(t): forventet ${r.origin??"value"} til \xe5 ha ${t}${r.maximum.toString()} ${i.unit??"elementer"}`;
                            return `For stor(t): forventet ${r.origin??"value"} til \xe5 ha ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `For lite(n): forventet ${r.origin} til \xe5 ha ${t}${r.minimum.toString()} ${i.unit}`;
                            return `For lite(n): forventet ${r.origin} til \xe5 ha ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ugyldig streng: m\xe5 starte med "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Ugyldig streng: m\xe5 ende med "${r.suffix}"`;
                        if ("includes" === r.format) return `Ugyldig streng: m\xe5 inneholde "${r.includes}"`;
                        if ("regex" === r.format) return `Ugyldig streng: m\xe5 matche m\xf8nsteret ${r.pattern}`;
                        return `Ugyldig ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ugyldig tall: m\xe5 v\xe6re et multiplum av ${r.divisor}`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Ugyldig n\xf8kkel i ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Ugyldig input";
                    case "invalid_element":
                        return `Ugyldig verdi i ${r.origin}`
                }
            })
        }
    }, "ota", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "harf",
                    verb: "olmalıdır"
                },
                file: {
                    unit: "bayt",
                    verb: "olmalıdır"
                },
                array: {
                    unit: "unsur",
                    verb: "olmalıdır"
                },
                set: {
                    unit: "unsur",
                    verb: "olmalıdır"
                }
            }, t = {
                regex: "giren",
                email: "epostagâh",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO hengâmı",
                date: "ISO tarihi",
                time: "ISO zamanı",
                duration: "ISO müddeti",
                ipv4: "IPv4 nişânı",
                ipv6: "IPv6 nişânı",
                cidrv4: "IPv4 menzili",
                cidrv6: "IPv6 menzili",
                base64: "base64-şifreli metin",
                base64url: "base64url-şifreli metin",
                json_string: "JSON metin",
                e164: "E.164 sayısı",
                jwt: "JWT",
                template_literal: "giren"
            }, i = {
                nan: "NaN",
                number: "numara",
                array: "saf",
                null: "gayb"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `F\xe2sit giren: umulan instanceof ${r.expected}, alınan ${n}`;
                            return `F\xe2sit giren: umulan ${e}, alınan ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `F\xe2sit giren: umulan ${e0(r.values[0])}`;
                        return `F\xe2sit tercih: m\xfbteberler ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Fazla b\xfcy\xfck: ${r.origin??"value"}, ${t}${r.maximum.toString()} ${i.unit??"elements"} sahip olmalıydı.`;
                            return `Fazla b\xfcy\xfck: ${r.origin??"value"}, ${t}${r.maximum.toString()} olmalıydı.`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Fazla k\xfc\xe7\xfck: ${r.origin}, ${t}${r.minimum.toString()} ${i.unit} sahip olmalıydı.`;
                            return `Fazla k\xfc\xe7\xfck: ${r.origin}, ${t}${r.minimum.toString()} olmalıydı.`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `F\xe2sit metin: "${r.prefix}" ile başlamalı.`;
                        if ("ends_with" === r.format) return `F\xe2sit metin: "${r.suffix}" ile bitmeli.`;
                        if ("includes" === r.format) return `F\xe2sit metin: "${r.includes}" ihtiv\xe2 etmeli.`;
                        if ("regex" === r.format) return `F\xe2sit metin: ${r.pattern} nakşına uymalı.`;
                        return `F\xe2sit ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `F\xe2sit sayı: ${r.divisor} katı olmalıydı.`;
                    case "unrecognized_keys":
                        return `Tanınmayan anahtar ${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} i\xe7in tanınmayan anahtar var.`;
                    case "invalid_union":
                        return "Giren tanınamadı.";
                    case "invalid_element":
                        return `${r.origin} i\xe7in tanınmayan kıymet var.`;
                    default:
                        return "Kıymet tanınamadı."
                }
            })
        }
    }, "pl", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "znaków",
                    verb: "mieć"
                },
                file: {
                    unit: "bajtów",
                    verb: "mieć"
                },
                array: {
                    unit: "elementów",
                    verb: "mieć"
                },
                set: {
                    unit: "elementów",
                    verb: "mieć"
                }
            }, t = {
                regex: "wyrażenie",
                email: "adres email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "data i godzina w formacie ISO",
                date: "data w formacie ISO",
                time: "godzina w formacie ISO",
                duration: "czas trwania ISO",
                ipv4: "adres IPv4",
                ipv6: "adres IPv6",
                cidrv4: "zakres IPv4",
                cidrv6: "zakres IPv6",
                base64: "ciąg znaków zakodowany w formacie base64",
                base64url: "ciąg znaków zakodowany w formacie base64url",
                json_string: "ciąg znaków w formacie JSON",
                e164: "liczba E.164",
                jwt: "JWT",
                template_literal: "wejście"
            }, i = {
                nan: "NaN",
                number: "liczba",
                array: "tablica"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${r.expected}, otrzymano ${n}`;
                            return `Nieprawidłowe dane wejściowe: oczekiwano ${e}, otrzymano ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Nieprawidłowe dane wejściowe: oczekiwano ${e0(r.values[0])}`;
                        return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Za duża wartość: oczekiwano, że ${r.origin??"wartość"} będzie mieć ${t}${r.maximum.toString()} ${i.unit??"elementów"}`;
                            return `Zbyt duż(y/a/e): oczekiwano, że ${r.origin??"wartość"} będzie wynosić ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Za mała wartość: oczekiwano, że ${r.origin??"wartość"} będzie mieć ${t}${r.minimum.toString()} ${i.unit??"elementów"}`;
                            return `Zbyt mał(y/a/e): oczekiwano, że ${r.origin??"wartość"} będzie wynosić ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Nieprawidłowy ciąg znak\xf3w: musi zaczynać się od "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Nieprawidłowy ciąg znak\xf3w: musi kończyć się na "${r.suffix}"`;
                        if ("includes" === r.format) return `Nieprawidłowy ciąg znak\xf3w: musi zawierać "${r.includes}"`;
                        if ("regex" === r.format) return `Nieprawidłowy ciąg znak\xf3w: musi odpowiadać wzorcowi ${r.pattern}`;
                        return `Nieprawidłow(y/a/e) ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Nieprawidłowa liczba: musi być wielokrotnością ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Nierozpoznane klucze${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Nieprawidłowy klucz w ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Nieprawidłowe dane wejściowe";
                    case "invalid_element":
                        return `Nieprawidłowa wartość w ${r.origin}`
                }
            })
        }
    }, "ps", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "توکي",
                    verb: "ولري"
                },
                file: {
                    unit: "بایټس",
                    verb: "ولري"
                },
                array: {
                    unit: "توکي",
                    verb: "ولري"
                },
                set: {
                    unit: "توکي",
                    verb: "ولري"
                }
            }, t = {
                regex: "ورودي",
                email: "بریښنالیک",
                url: "یو آر ال",
                emoji: "ایموجي",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "نیټه او وخت",
                date: "نېټه",
                time: "وخت",
                duration: "موده",
                ipv4: "د IPv4 پته",
                ipv6: "د IPv6 پته",
                cidrv4: "د IPv4 ساحه",
                cidrv6: "د IPv6 ساحه",
                base64: "base64-encoded متن",
                base64url: "base64url-encoded متن",
                json_string: "JSON متن",
                e164: "د E.164 شمېره",
                jwt: "JWT",
                template_literal: "ورودي"
            }, i = {
                nan: "NaN",
                number: "عدد",
                array: "ارې"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `ناسم ورودي: باید instanceof ${r.expected} وای, مګر ${n} ترلاسه شو`;
                            return `ناسم ورودي: باید ${e} وای, مګر ${n} ترلاسه شو`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `ناسم ورودي: باید ${e0(r.values[0])} وای`;
                        return `ناسم انتخاب: باید یو له ${ej(r.values,"|")} څخه وای`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `ډیر لوی: ${r.origin??"ارزښت"} باید ${t}${r.maximum.toString()} ${i.unit??"عنصرونه"} ولري`;
                            return `ډیر لوی: ${r.origin??"ارزښت"} باید ${t}${r.maximum.toString()} وي`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `ډیر کوچنی: ${r.origin} باید ${t}${r.minimum.toString()} ${i.unit} ولري`;
                            return `ډیر کوچنی: ${r.origin} باید ${t}${r.minimum.toString()} وي`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `ناسم متن: باید د "${r.prefix}" سره پیل شي`;
                        if ("ends_with" === r.format) return `ناسم متن: باید د "${r.suffix}" سره پای ته ورسيږي`;
                        if ("includes" === r.format) return `ناسم متن: باید "${r.includes}" ولري`;
                        if ("regex" === r.format) return `ناسم متن: باید د ${r.pattern} سره مطابقت ولري`;
                        return `${t[r.format]??r.format} ناسم دی`;
                    case "not_multiple_of":
                        return `ناسم عدد: باید د ${r.divisor} مضرب وي`;
                    case "unrecognized_keys":
                        return `ناسم ${r.keys.length>1?"کلیډونه":"کلیډ"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `ناسم کلیډ په ${r.origin} کې`;
                    case "invalid_union":
                    default:
                        return "ناسمه ورودي";
                    case "invalid_element":
                        return `ناسم عنصر په ${r.origin} کې`
                }
            })
        }
    }, "pt", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caracteres",
                    verb: "ter"
                },
                file: {
                    unit: "bytes",
                    verb: "ter"
                },
                array: {
                    unit: "itens",
                    verb: "ter"
                },
                set: {
                    unit: "itens",
                    verb: "ter"
                }
            }, t = {
                regex: "padrão",
                email: "endereço de e-mail",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "data e hora ISO",
                date: "data ISO",
                time: "hora ISO",
                duration: "duração ISO",
                ipv4: "endereço IPv4",
                ipv6: "endereço IPv6",
                cidrv4: "faixa de IPv4",
                cidrv6: "faixa de IPv6",
                base64: "texto codificado em base64",
                base64url: "URL codificada em base64",
                json_string: "texto JSON",
                e164: "número E.164",
                jwt: "JWT",
                template_literal: "entrada"
            }, i = {
                nan: "NaN",
                number: "número",
                null: "nulo"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Tipo inv\xe1lido: esperado instanceof ${r.expected}, recebido ${n}`;
                            return `Tipo inv\xe1lido: esperado ${e}, recebido ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Entrada inv\xe1lida: esperado ${e0(r.values[0])}`;
                        return `Op\xe7\xe3o inv\xe1lida: esperada uma das ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Muito grande: esperado que ${r.origin??"valor"} tivesse ${t}${r.maximum.toString()} ${i.unit??"elementos"}`;
                            return `Muito grande: esperado que ${r.origin??"valor"} fosse ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Muito pequeno: esperado que ${r.origin} tivesse ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Muito pequeno: esperado que ${r.origin} fosse ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Texto inv\xe1lido: deve come\xe7ar com "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Texto inv\xe1lido: deve terminar com "${r.suffix}"`;
                        if ("includes" === r.format) return `Texto inv\xe1lido: deve incluir "${r.includes}"`;
                        if ("regex" === r.format) return `Texto inv\xe1lido: deve corresponder ao padr\xe3o ${r.pattern}`;
                        return `${t[r.format]??r.format} inv\xe1lido`;
                    case "not_multiple_of":
                        return `N\xfamero inv\xe1lido: deve ser m\xfaltiplo de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Chave${r.keys.length>1?"s":""} desconhecida${r.keys.length>1?"s":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Chave inv\xe1lida em ${r.origin}`;
                    case "invalid_union":
                        return "Entrada inválida";
                    case "invalid_element":
                        return `Valor inv\xe1lido em ${r.origin}`;
                    default:
                        return "Campo inválido"
                }
            })
        }
    }, "ro", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "caractere",
                    verb: "să aibă"
                },
                file: {
                    unit: "octeți",
                    verb: "să aibă"
                },
                array: {
                    unit: "elemente",
                    verb: "să aibă"
                },
                set: {
                    unit: "elemente",
                    verb: "să aibă"
                },
                map: {
                    unit: "intrări",
                    verb: "să aibă"
                }
            }, t = {
                regex: "intrare",
                email: "adresă de email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "dată și oră ISO",
                date: "dată ISO",
                time: "oră ISO",
                duration: "durată ISO",
                ipv4: "adresă IPv4",
                ipv6: "adresă IPv6",
                mac: "adresă MAC",
                cidrv4: "interval IPv4",
                cidrv6: "interval IPv6",
                base64: "șir codat base64",
                base64url: "șir codat base64url",
                json_string: "șir JSON",
                e164: "număr E.164",
                jwt: "JWT",
                template_literal: "intrare"
            }, i = {
                nan: "NaN",
                string: "șir",
                number: "număr",
                boolean: "boolean",
                function: "funcție",
                array: "matrice",
                object: "obiect",
                undefined: "nedefinit",
                symbol: "simbol",
                bigint: "număr mare",
                void: "void",
                never: "never",
                map: "hartă",
                set: "set"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            return `Intrare invalidă: așteptat ${e}, primit ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Intrare invalidă: așteptat ${e0(r.values[0])}`;
                        return `Opțiune invalidă: așteptat una dintre ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Prea mare: așteptat ca ${r.origin??"valoarea"} ${i.verb} ${t}${r.maximum.toString()} ${i.unit??"elemente"}`;
                            return `Prea mare: așteptat ca ${r.origin??"valoarea"} să fie ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Prea mic: așteptat ca ${r.origin} ${i.verb} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Prea mic: așteptat ca ${r.origin} să fie ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Șir invalid: trebuie să \xeenceapă cu "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Șir invalid: trebuie să se termine cu "${r.suffix}"`;
                        if ("includes" === r.format) return `Șir invalid: trebuie să includă "${r.includes}"`;
                        if ("regex" === r.format) return `Șir invalid: trebuie să se potrivească cu modelul ${r.pattern}`;
                        return `Format invalid: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Număr invalid: trebuie să fie multiplu de ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Chei nerecunoscute: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Cheie invalidă \xeen ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Intrare invalidă";
                    case "invalid_element":
                        return `Valoare invalidă \xeen ${r.origin}`
                }
            })
        }
    }, "ru", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: {
                        one: "символ",
                        few: "символа",
                        many: "символов"
                    },
                    verb: "иметь"
                },
                file: {
                    unit: {
                        one: "байт",
                        few: "байта",
                        many: "байт"
                    },
                    verb: "иметь"
                },
                array: {
                    unit: {
                        one: "элемент",
                        few: "элемента",
                        many: "элементов"
                    },
                    verb: "иметь"
                },
                set: {
                    unit: {
                        one: "элемент",
                        few: "элемента",
                        many: "элементов"
                    },
                    verb: "иметь"
                }
            }, t = {
                regex: "ввод",
                email: "email адрес",
                url: "URL",
                emoji: "эмодзи",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO дата и время",
                date: "ISO дата",
                time: "ISO время",
                duration: "ISO длительность",
                ipv4: "IPv4 адрес",
                ipv6: "IPv6 адрес",
                cidrv4: "IPv4 диапазон",
                cidrv6: "IPv6 диапазон",
                base64: "строка в формате base64",
                base64url: "строка в формате base64url",
                json_string: "JSON строка",
                e164: "номер E.164",
                jwt: "JWT",
                template_literal: "ввод"
            }, i = {
                nan: "NaN",
                number: "число",
                array: "массив"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Неверный ввод: ожидалось instanceof ${r.expected}, получено ${n}`;
                            return `Неверный ввод: ожидалось ${e}, получено ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Неверный ввод: ожидалось ${e0(r.values[0])}`;
                        return `Неверный вариант: ожидалось одно из ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nD(Number(r.maximum), i.unit.one, i.unit.few, i.unit.many);
                                return `Слишком большое значение: ожидалось, что ${r.origin??"значение"} будет иметь ${t}${r.maximum.toString()} ${e}`
                            }
                            return `Слишком большое значение: ожидалось, что ${r.origin??"значение"} будет ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) {
                                let e = nD(Number(r.minimum), i.unit.one, i.unit.few, i.unit.many);
                                return `Слишком маленькое значение: ожидалось, что ${r.origin} будет иметь ${t}${r.minimum.toString()} ${e}`
                            }
                            return `Слишком маленькое значение: ожидалось, что ${r.origin} будет ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Неверная строка: должна начинаться с "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Неверная строка: должна заканчиваться на "${r.suffix}"`;
                        if ("includes" === r.format) return `Неверная строка: должна содержать "${r.includes}"`;
                        if ("regex" === r.format) return `Неверная строка: должна соответствовать шаблону ${r.pattern}`;
                        return `Неверный ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Неверное число: должно быть кратным ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Нераспознанн${r.keys.length>1?"ые":"ый"} ключ${r.keys.length>1?"и":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Неверный ключ в ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Неверные входные данные";
                    case "invalid_element":
                        return `Неверное значение в ${r.origin}`
                }
            })
        }
    }, "sl", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "znakov",
                    verb: "imeti"
                },
                file: {
                    unit: "bajtov",
                    verb: "imeti"
                },
                array: {
                    unit: "elementov",
                    verb: "imeti"
                },
                set: {
                    unit: "elementov",
                    verb: "imeti"
                }
            }, t = {
                regex: "vnos",
                email: "e-poštni naslov",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO datum in čas",
                date: "ISO datum",
                time: "ISO čas",
                duration: "ISO trajanje",
                ipv4: "IPv4 naslov",
                ipv6: "IPv6 naslov",
                cidrv4: "obseg IPv4",
                cidrv6: "obseg IPv6",
                base64: "base64 kodiran niz",
                base64url: "base64url kodiran niz",
                json_string: "JSON niz",
                e164: "E.164 številka",
                jwt: "JWT",
                template_literal: "vnos"
            }, i = {
                nan: "NaN",
                number: "število",
                array: "tabela"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Neveljaven vnos: pričakovano instanceof ${r.expected}, prejeto ${n}`;
                            return `Neveljaven vnos: pričakovano ${e}, prejeto ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Neveljaven vnos: pričakovano ${e0(r.values[0])}`;
                        return `Neveljavna možnost: pričakovano eno izmed ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Preveliko: pričakovano, da bo ${r.origin??"vrednost"} imelo ${t}${r.maximum.toString()} ${i.unit??"elementov"}`;
                            return `Preveliko: pričakovano, da bo ${r.origin??"vrednost"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Premajhno: pričakovano, da bo ${r.origin} imelo ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Premajhno: pričakovano, da bo ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Neveljaven niz: mora se začeti z "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Neveljaven niz: mora se končati z "${r.suffix}"`;
                        if ("includes" === r.format) return `Neveljaven niz: mora vsebovati "${r.includes}"`;
                        if ("regex" === r.format) return `Neveljaven niz: mora ustrezati vzorcu ${r.pattern}`;
                        return `Neveljaven ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Neveljavno število: mora biti večkratnik ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Neprepoznan${r.keys.length>1?"i ključi":" ključ"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Neveljaven ključ v ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Neveljaven vnos";
                    case "invalid_element":
                        return `Neveljavna vrednost v ${r.origin}`
                }
            })
        }
    }, "sv", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "tecken",
                    verb: "att ha"
                },
                file: {
                    unit: "bytes",
                    verb: "att ha"
                },
                array: {
                    unit: "objekt",
                    verb: "att innehålla"
                },
                set: {
                    unit: "objekt",
                    verb: "att innehålla"
                }
            }, t = {
                regex: "reguljärt uttryck",
                email: "e-postadress",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO-datum och tid",
                date: "ISO-datum",
                time: "ISO-tid",
                duration: "ISO-varaktighet",
                ipv4: "IPv4-intervall",
                ipv6: "IPv6-intervall",
                cidrv4: "IPv4-spektrum",
                cidrv6: "IPv6-spektrum",
                base64: "base64-kodad sträng",
                base64url: "base64url-kodad sträng",
                json_string: "JSON-sträng",
                e164: "E.164-nummer",
                jwt: "JWT",
                template_literal: "mall-literal"
            }, i = {
                nan: "NaN",
                number: "antal",
                array: "lista"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ogiltig inmatning: f\xf6rv\xe4ntat instanceof ${r.expected}, fick ${n}`;
                            return `Ogiltig inmatning: f\xf6rv\xe4ntat ${e}, fick ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ogiltig inmatning: f\xf6rv\xe4ntat ${e0(r.values[0])}`;
                        return `Ogiltigt val: f\xf6rv\xe4ntade en av ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `F\xf6r stor(t): f\xf6rv\xe4ntade ${r.origin??"värdet"} att ha ${t}${r.maximum.toString()} ${i.unit??"element"}`;
                            return `F\xf6r stor(t): f\xf6rv\xe4ntat ${r.origin??"värdet"} att ha ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `F\xf6r lite(t): f\xf6rv\xe4ntade ${r.origin??"värdet"} att ha ${t}${r.minimum.toString()} ${i.unit}`;
                            return `F\xf6r lite(t): f\xf6rv\xe4ntade ${r.origin??"värdet"} att ha ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ogiltig str\xe4ng: m\xe5ste b\xf6rja med "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Ogiltig str\xe4ng: m\xe5ste sluta med "${r.suffix}"`;
                        if ("includes" === r.format) return `Ogiltig str\xe4ng: m\xe5ste inneh\xe5lla "${r.includes}"`;
                        if ("regex" === r.format) return `Ogiltig str\xe4ng: m\xe5ste matcha m\xf6nstret "${r.pattern}"`;
                        return `Ogiltig(t) ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ogiltigt tal: m\xe5ste vara en multipel av ${r.divisor}`;
                    case "unrecognized_keys":
                        return `${r.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Ogiltig nyckel i ${r.origin??"värdet"}`;
                    case "invalid_union":
                    default:
                        return "Ogiltig input";
                    case "invalid_element":
                        return `Ogiltigt v\xe4rde i ${r.origin??"värdet"}`
                }
            })
        }
    }, "ta", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "எழுத்துக்கள்",
                    verb: "கொண்டிருக்க வேண்டும்"
                },
                file: {
                    unit: "பைட்டுகள்",
                    verb: "கொண்டிருக்க வேண்டும்"
                },
                array: {
                    unit: "உறுப்புகள்",
                    verb: "கொண்டிருக்க வேண்டும்"
                },
                set: {
                    unit: "உறுப்புகள்",
                    verb: "கொண்டிருக்க வேண்டும்"
                }
            }, t = {
                regex: "உள்ளீடு",
                email: "மின்னஞ்சல் முகவரி",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO தேதி நேரம்",
                date: "ISO தேதி",
                time: "ISO நேரம்",
                duration: "ISO கால அளவு",
                ipv4: "IPv4 முகவரி",
                ipv6: "IPv6 முகவரி",
                cidrv4: "IPv4 வரம்பு",
                cidrv6: "IPv6 வரம்பு",
                base64: "base64-encoded சரம்",
                base64url: "base64url-encoded சரம்",
                json_string: "JSON சரம்",
                e164: "E.164 எண்",
                jwt: "JWT",
                template_literal: "input"
            }, i = {
                nan: "NaN",
                number: "எண்",
                array: "அணி",
                null: "வெறுமை"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${r.expected}, பெறப்பட்டது ${n}`;
                            return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${e}, பெறப்பட்டது ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${e0(r.values[0])}`;
                        return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${ej(r.values,"|")} இல் ஒன்று`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin??"மதிப்பு"} ${t}${r.maximum.toString()} ${i.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                            return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${r.origin??"மதிப்பு"} ${t}${r.maximum.toString()} ஆக இருக்க வேண்டும்`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${t}${r.minimum.toString()} ${i.unit} ஆக இருக்க வேண்டும்`;
                            return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${r.origin} ${t}${r.minimum.toString()} ஆக இருக்க வேண்டும்`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `தவறான சரம்: "${r.prefix}" இல் தொடங்க வேண்டும்`;
                        if ("ends_with" === r.format) return `தவறான சரம்: "${r.suffix}" இல் முடிவடைய வேண்டும்`;
                        if ("includes" === r.format) return `தவறான சரம்: "${r.includes}" ஐ உள்ளடக்க வேண்டும்`;
                        if ("regex" === r.format) return `தவறான சரம்: ${r.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                        return `தவறான ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `தவறான எண்: ${r.divisor} இன் பலமாக இருக்க வேண்டும்`;
                    case "unrecognized_keys":
                        return `அடையாளம் தெரியாத விசை${r.keys.length>1?"கள்":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} இல் தவறான விசை`;
                    case "invalid_union":
                    default:
                        return "தவறான உள்ளீடு";
                    case "invalid_element":
                        return `${r.origin} இல் தவறான மதிப்பு`
                }
            })
        }
    }, "th", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "ตัวอักษร",
                    verb: "ควรมี"
                },
                file: {
                    unit: "ไบต์",
                    verb: "ควรมี"
                },
                array: {
                    unit: "รายการ",
                    verb: "ควรมี"
                },
                set: {
                    unit: "รายการ",
                    verb: "ควรมี"
                }
            }, t = {
                regex: "ข้อมูลที่ป้อน",
                email: "ที่อยู่อีเมล",
                url: "URL",
                emoji: "อิโมจิ",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "วันที่เวลาแบบ ISO",
                date: "วันที่แบบ ISO",
                time: "เวลาแบบ ISO",
                duration: "ช่วงเวลาแบบ ISO",
                ipv4: "ที่อยู่ IPv4",
                ipv6: "ที่อยู่ IPv6",
                cidrv4: "ช่วง IP แบบ IPv4",
                cidrv6: "ช่วง IP แบบ IPv6",
                base64: "ข้อความแบบ Base64",
                base64url: "ข้อความแบบ Base64 สำหรับ URL",
                json_string: "ข้อความแบบ JSON",
                e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
                jwt: "โทเคน JWT",
                template_literal: "ข้อมูลที่ป้อน"
            }, i = {
                nan: "NaN",
                number: "ตัวเลข",
                array: "อาร์เรย์ (Array)",
                null: "ไม่มีค่า (null)"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${r.expected} แต่ได้รับ ${n}`;
                            return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${e} แต่ได้รับ ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `ค่าไม่ถูกต้อง: ควรเป็น ${e0(r.values[0])}`;
                        return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "ไม่เกิน" : "น้อยกว่า",
                                i = e[r.origin] ? ? null;
                            if (i) return `เกินกำหนด: ${r.origin??"ค่า"} ควรมี${t} ${r.maximum.toString()} ${i.unit??"รายการ"}`;
                            return `เกินกำหนด: ${r.origin??"ค่า"} ควรมี${t} ${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? "อย่างน้อย" : "มากกว่า",
                                i = e[r.origin] ? ? null;
                            if (i) return `น้อยกว่ากำหนด: ${r.origin} ควรมี${t} ${r.minimum.toString()} ${i.unit}`;
                            return `น้อยกว่ากำหนด: ${r.origin} ควรมี${t} ${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${r.prefix}"`;
                        if ("ends_with" === r.format) return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${r.suffix}"`;
                        if ("includes" === r.format) return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${r.includes}" อยู่ในข้อความ`;
                        if ("regex" === r.format) return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${r.pattern}`;
                        return `รูปแบบไม่ถูกต้อง: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${r.divisor} ได้ลงตัว`;
                    case "unrecognized_keys":
                        return `พบคีย์ที่ไม่รู้จัก: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `คีย์ไม่ถูกต้องใน ${r.origin}`;
                    case "invalid_union":
                        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
                    case "invalid_element":
                        return `ข้อมูลไม่ถูกต้องใน ${r.origin}`;
                    default:
                        return "ข้อมูลไม่ถูกต้อง"
                }
            })
        }
    }, "tr", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "karakter",
                    verb: "olmalı"
                },
                file: {
                    unit: "bayt",
                    verb: "olmalı"
                },
                array: {
                    unit: "öğe",
                    verb: "olmalı"
                },
                set: {
                    unit: "öğe",
                    verb: "olmalı"
                }
            }, t = {
                regex: "girdi",
                email: "e-posta adresi",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO tarih ve saat",
                date: "ISO tarih",
                time: "ISO saat",
                duration: "ISO süre",
                ipv4: "IPv4 adresi",
                ipv6: "IPv6 adresi",
                cidrv4: "IPv4 aralığı",
                cidrv6: "IPv6 aralığı",
                base64: "base64 ile şifrelenmiş metin",
                base64url: "base64url ile şifrelenmiş metin",
                json_string: "JSON dizesi",
                e164: "E.164 sayısı",
                jwt: "JWT",
                template_literal: "Şablon dizesi"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Ge\xe7ersiz değer: beklenen instanceof ${r.expected}, alınan ${n}`;
                            return `Ge\xe7ersiz değer: beklenen ${e}, alınan ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Ge\xe7ersiz değer: beklenen ${e0(r.values[0])}`;
                        return `Ge\xe7ersiz se\xe7enek: aşağıdakilerden biri olmalı: ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `\xc7ok b\xfcy\xfck: beklenen ${r.origin??"değer"} ${t}${r.maximum.toString()} ${i.unit??"öğe"}`;
                            return `\xc7ok b\xfcy\xfck: beklenen ${r.origin??"değer"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `\xc7ok k\xfc\xe7\xfck: beklenen ${r.origin} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `\xc7ok k\xfc\xe7\xfck: beklenen ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ge\xe7ersiz metin: "${r.prefix}" ile başlamalı`;
                        if ("ends_with" === r.format) return `Ge\xe7ersiz metin: "${r.suffix}" ile bitmeli`;
                        if ("includes" === r.format) return `Ge\xe7ersiz metin: "${r.includes}" i\xe7ermeli`;
                        if ("regex" === r.format) return `Ge\xe7ersiz metin: ${r.pattern} desenine uymalı`;
                        return `Ge\xe7ersiz ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Ge\xe7ersiz sayı: ${r.divisor} ile tam b\xf6l\xfcnebilmeli`;
                    case "unrecognized_keys":
                        return `Tanınmayan anahtar${r.keys.length>1?"lar":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} i\xe7inde ge\xe7ersiz anahtar`;
                    case "invalid_union":
                    default:
                        return "Geçersiz değer";
                    case "invalid_element":
                        return `${r.origin} i\xe7inde ge\xe7ersiz değer`
                }
            })
        }
    }, "ua", 0, function() {
        return nj()
    }, "uk", 0, nj, "ur", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "حروف",
                    verb: "ہونا"
                },
                file: {
                    unit: "بائٹس",
                    verb: "ہونا"
                },
                array: {
                    unit: "آئٹمز",
                    verb: "ہونا"
                },
                set: {
                    unit: "آئٹمز",
                    verb: "ہونا"
                }
            }, t = {
                regex: "ان پٹ",
                email: "ای میل ایڈریس",
                url: "یو آر ایل",
                emoji: "ایموجی",
                uuid: "یو یو آئی ڈی",
                uuidv4: "یو یو آئی ڈی وی 4",
                uuidv6: "یو یو آئی ڈی وی 6",
                nanoid: "نینو آئی ڈی",
                guid: "جی یو آئی ڈی",
                cuid: "سی یو آئی ڈی",
                cuid2: "سی یو آئی ڈی 2",
                ulid: "یو ایل آئی ڈی",
                xid: "ایکس آئی ڈی",
                ksuid: "کے ایس یو آئی ڈی",
                datetime: "آئی ایس او ڈیٹ ٹائم",
                date: "آئی ایس او تاریخ",
                time: "آئی ایس او وقت",
                duration: "آئی ایس او مدت",
                ipv4: "آئی پی وی 4 ایڈریس",
                ipv6: "آئی پی وی 6 ایڈریس",
                cidrv4: "آئی پی وی 4 رینج",
                cidrv6: "آئی پی وی 6 رینج",
                base64: "بیس 64 ان کوڈڈ سٹرنگ",
                base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
                json_string: "جے ایس او این سٹرنگ",
                e164: "ای 164 نمبر",
                jwt: "جے ڈبلیو ٹی",
                template_literal: "ان پٹ"
            }, i = {
                nan: "NaN",
                number: "نمبر",
                array: "آرے",
                null: "نل"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `غلط ان پٹ: instanceof ${r.expected} متوقع تھا، ${n} موصول ہوا`;
                            return `غلط ان پٹ: ${e} متوقع تھا، ${n} موصول ہوا`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `غلط ان پٹ: ${e0(r.values[0])} متوقع تھا`;
                        return `غلط آپشن: ${ej(r.values,"|")} میں سے ایک متوقع تھا`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `بہت بڑا: ${r.origin??"ویلیو"} کے ${t}${r.maximum.toString()} ${i.unit??"عناصر"} ہونے متوقع تھے`;
                            return `بہت بڑا: ${r.origin??"ویلیو"} کا ${t}${r.maximum.toString()} ہونا متوقع تھا`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `بہت چھوٹا: ${r.origin} کے ${t}${r.minimum.toString()} ${i.unit} ہونے متوقع تھے`;
                            return `بہت چھوٹا: ${r.origin} کا ${t}${r.minimum.toString()} ہونا متوقع تھا`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `غلط سٹرنگ: "${r.prefix}" سے شروع ہونا چاہیے`;
                        if ("ends_with" === r.format) return `غلط سٹرنگ: "${r.suffix}" پر ختم ہونا چاہیے`;
                        if ("includes" === r.format) return `غلط سٹرنگ: "${r.includes}" شامل ہونا چاہیے`;
                        if ("regex" === r.format) return `غلط سٹرنگ: پیٹرن ${r.pattern} سے میچ ہونا چاہیے`;
                        return `غلط ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `غلط نمبر: ${r.divisor} کا مضاعف ہونا چاہیے`;
                    case "unrecognized_keys":
                        return `غیر تسلیم شدہ کی${r.keys.length>1?"ز":""}: ${ej(r.keys,"، ")}`;
                    case "invalid_key":
                        return `${r.origin} میں غلط کی`;
                    case "invalid_union":
                    default:
                        return "غلط ان پٹ";
                    case "invalid_element":
                        return `${r.origin} میں غلط ویلیو`
                }
            })
        }
    }, "uz", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "belgi",
                    verb: "bo‘lishi kerak"
                },
                file: {
                    unit: "bayt",
                    verb: "bo‘lishi kerak"
                },
                array: {
                    unit: "element",
                    verb: "bo‘lishi kerak"
                },
                set: {
                    unit: "element",
                    verb: "bo‘lishi kerak"
                },
                map: {
                    unit: "yozuv",
                    verb: "bo‘lishi kerak"
                }
            }, t = {
                regex: "kirish",
                email: "elektron pochta manzili",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO sana va vaqti",
                date: "ISO sana",
                time: "ISO vaqt",
                duration: "ISO davomiylik",
                ipv4: "IPv4 manzil",
                ipv6: "IPv6 manzil",
                mac: "MAC manzil",
                cidrv4: "IPv4 diapazon",
                cidrv6: "IPv6 diapazon",
                base64: "base64 kodlangan satr",
                base64url: "base64url kodlangan satr",
                json_string: "JSON satr",
                e164: "E.164 raqam",
                jwt: "JWT",
                template_literal: "kirish"
            }, i = {
                nan: "NaN",
                number: "raqam",
                array: "massiv"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Noto‘g‘ri kirish: kutilgan instanceof ${r.expected}, qabul qilingan ${n}`;
                            return `Noto‘g‘ri kirish: kutilgan ${e}, qabul qilingan ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Noto‘g‘ri kirish: kutilgan ${e0(r.values[0])}`;
                        return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Juda katta: kutilgan ${r.origin??"qiymat"} ${t}${r.maximum.toString()} ${i.unit} ${i.verb}`;
                            return `Juda katta: kutilgan ${r.origin??"qiymat"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Juda kichik: kutilgan ${r.origin} ${t}${r.minimum.toString()} ${i.unit} ${i.verb}`;
                            return `Juda kichik: kutilgan ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Noto‘g‘ri satr: "${r.prefix}" bilan boshlanishi kerak`;
                        if ("ends_with" === r.format) return `Noto‘g‘ri satr: "${r.suffix}" bilan tugashi kerak`;
                        if ("includes" === r.format) return `Noto‘g‘ri satr: "${r.includes}" ni o‘z ichiga olishi kerak`;
                        if ("regex" === r.format) return `Noto‘g‘ri satr: ${r.pattern} shabloniga mos kelishi kerak`;
                        return `Noto‘g‘ri ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Noto‘g‘ri raqam: ${r.divisor} ning karralisi bo‘lishi kerak`;
                    case "unrecognized_keys":
                        return `Noma’lum kalit${r.keys.length>1?"lar":""}: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} dagi kalit noto‘g‘ri`;
                    case "invalid_union":
                    default:
                        return "Noto‘g‘ri kirish";
                    case "invalid_element":
                        return `${r.origin} da noto‘g‘ri qiymat`
                }
            })
        }
    }, "vi", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "ký tự",
                    verb: "có"
                },
                file: {
                    unit: "byte",
                    verb: "có"
                },
                array: {
                    unit: "phần tử",
                    verb: "có"
                },
                set: {
                    unit: "phần tử",
                    verb: "có"
                }
            }, t = {
                regex: "đầu vào",
                email: "địa chỉ email",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ngày giờ ISO",
                date: "ngày ISO",
                time: "giờ ISO",
                duration: "khoảng thời gian ISO",
                ipv4: "địa chỉ IPv4",
                ipv6: "địa chỉ IPv6",
                cidrv4: "dải IPv4",
                cidrv6: "dải IPv6",
                base64: "chuỗi mã hóa base64",
                base64url: "chuỗi mã hóa base64url",
                json_string: "chuỗi JSON",
                e164: "số E.164",
                jwt: "JWT",
                template_literal: "đầu vào"
            }, i = {
                nan: "NaN",
                number: "số",
                array: "mảng"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `Đầu v\xe0o kh\xf4ng hợp lệ: mong đợi instanceof ${r.expected}, nhận được ${n}`;
                            return `Đầu v\xe0o kh\xf4ng hợp lệ: mong đợi ${e}, nhận được ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `Đầu v\xe0o kh\xf4ng hợp lệ: mong đợi ${e0(r.values[0])}`;
                        return `T\xf9y chọn kh\xf4ng hợp lệ: mong đợi một trong c\xe1c gi\xe1 trị ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `Qu\xe1 lớn: mong đợi ${r.origin??"giá trị"} ${i.verb} ${t}${r.maximum.toString()} ${i.unit??"phần tử"}`;
                            return `Qu\xe1 lớn: mong đợi ${r.origin??"giá trị"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `Qu\xe1 nhỏ: mong đợi ${r.origin} ${i.verb} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `Qu\xe1 nhỏ: mong đợi ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Chuỗi kh\xf4ng hợp lệ: phải bắt đầu bằng "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Chuỗi kh\xf4ng hợp lệ: phải kết th\xfac bằng "${r.suffix}"`;
                        if ("includes" === r.format) return `Chuỗi kh\xf4ng hợp lệ: phải bao gồm "${r.includes}"`;
                        if ("regex" === r.format) return `Chuỗi kh\xf4ng hợp lệ: phải khớp với mẫu ${r.pattern}`;
                        return `${t[r.format]??r.format} kh\xf4ng hợp lệ`;
                    case "not_multiple_of":
                        return `Số kh\xf4ng hợp lệ: phải l\xe0 bội số của ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Kh\xf3a kh\xf4ng được nhận dạng: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Kh\xf3a kh\xf4ng hợp lệ trong ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Đầu vào không hợp lệ";
                    case "invalid_element":
                        return `Gi\xe1 trị kh\xf4ng hợp lệ trong ${r.origin}`
                }
            })
        }
    }, "yo", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "àmi",
                    verb: "ní"
                },
                file: {
                    unit: "bytes",
                    verb: "ní"
                },
                array: {
                    unit: "nkan",
                    verb: "ní"
                },
                set: {
                    unit: "nkan",
                    verb: "ní"
                }
            }, t = {
                regex: "ẹ̀rọ ìbáwọlé",
                email: "àdírẹ́sì ìmẹ́lì",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "àkókò ISO",
                date: "ọjọ́ ISO",
                time: "àkókò ISO",
                duration: "àkókò tó pé ISO",
                ipv4: "àdírẹ́sì IPv4",
                ipv6: "àdírẹ́sì IPv6",
                cidrv4: "àgbègbè IPv4",
                cidrv6: "àgbègbè IPv6",
                base64: "ọ̀rọ̀ tí a kọ́ ní base64",
                base64url: "ọ̀rọ̀ base64url",
                json_string: "ọ̀rọ̀ JSON",
                e164: "nọ́mbà E.164",
                jwt: "JWT",
                template_literal: "ẹ̀rọ ìbáwọlé"
            }, i = {
                nan: "NaN",
                number: "nọ́mbà",
                array: "akopọ"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `\xccb\xe1wọl\xe9 aṣ\xecṣe: a n\xed l\xe1ti fi instanceof ${r.expected}, \xe0mọ̀ a r\xed ${n}`;
                            return `\xccb\xe1wọl\xe9 aṣ\xecṣe: a n\xed l\xe1ti fi ${e}, \xe0mọ̀ a r\xed ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `\xccb\xe1wọl\xe9 aṣ\xecṣe: a n\xed l\xe1ti fi ${e0(r.values[0])}`;
                        return `\xc0ṣ\xe0y\xe0n aṣ\xecṣe: yan ọ̀kan l\xe1ra ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `T\xf3 pọ̀ j\xf9: a n\xed l\xe1ti jẹ́ p\xe9 ${r.origin??"iye"} ${i.verb} ${t}${r.maximum} ${i.unit}`;
                            return `T\xf3 pọ̀ j\xf9: a n\xed l\xe1ti jẹ́ ${t}${r.maximum}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `K\xe9r\xe9 ju: a n\xed l\xe1ti jẹ́ p\xe9 ${r.origin} ${i.verb} ${t}${r.minimum} ${i.unit}`;
                            return `K\xe9r\xe9 ju: a n\xed l\xe1ti jẹ́ ${t}${r.minimum}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `Ọ̀rọ̀ aṣ\xecṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀l\xfa "${r.prefix}"`;
                        if ("ends_with" === r.format) return `Ọ̀rọ̀ aṣ\xecṣe: gbọ́dọ̀ par\xed pẹ̀l\xfa "${r.suffix}"`;
                        if ("includes" === r.format) return `Ọ̀rọ̀ aṣ\xecṣe: gbọ́dọ̀ n\xed "${r.includes}"`;
                        if ("regex" === r.format) return `Ọ̀rọ̀ aṣ\xecṣe: gbọ́dọ̀ b\xe1 \xe0pẹẹrẹ mu ${r.pattern}`;
                        return `Aṣ\xecṣe: ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `Nọ́mb\xe0 aṣ\xecṣe: gbọ́dọ̀ jẹ́ \xe8y\xe0 p\xedp\xedn ti ${r.divisor}`;
                    case "unrecognized_keys":
                        return `Bọt\xecn\xec \xe0\xecmọ̀: ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `Bọt\xecn\xec aṣ\xecṣe n\xedn\xfa ${r.origin}`;
                    case "invalid_union":
                    default:
                        return "Ìbáwọlé aṣìṣe";
                    case "invalid_element":
                        return `Iye aṣ\xecṣe n\xedn\xfa ${r.origin}`
                }
            })
        }
    }, "zhCN", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "字符",
                    verb: "包含"
                },
                file: {
                    unit: "字节",
                    verb: "包含"
                },
                array: {
                    unit: "项",
                    verb: "包含"
                },
                set: {
                    unit: "项",
                    verb: "包含"
                }
            }, t = {
                regex: "输入",
                email: "电子邮件",
                url: "URL",
                emoji: "表情符号",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO日期时间",
                date: "ISO日期",
                time: "ISO时间",
                duration: "ISO时长",
                ipv4: "IPv4地址",
                ipv6: "IPv6地址",
                cidrv4: "IPv4网段",
                cidrv6: "IPv6网段",
                base64: "base64编码字符串",
                base64url: "base64url编码字符串",
                json_string: "JSON字符串",
                e164: "E.164号码",
                jwt: "JWT",
                template_literal: "输入"
            }, i = {
                nan: "NaN",
                number: "数字",
                array: "数组",
                null: "空值(null)"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `无效输入：期望 instanceof ${r.expected}，实际接收 ${n}`;
                            return `无效输入：期望 ${e}，实际接收 ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `无效输入：期望 ${e0(r.values[0])}`;
                        return `无效选项：期望以下之一 ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `数值过大：期望 ${r.origin??"值"} ${t}${r.maximum.toString()} ${i.unit??"个元素"}`;
                            return `数值过大：期望 ${r.origin??"值"} ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `数值过小：期望 ${r.origin} ${t}${r.minimum.toString()} ${i.unit}`;
                            return `数值过小：期望 ${r.origin} ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `无效字符串：必须以 "${r.prefix}" 开头`;
                        if ("ends_with" === r.format) return `无效字符串：必须以 "${r.suffix}" 结尾`;
                        if ("includes" === r.format) return `无效字符串：必须包含 "${r.includes}"`;
                        if ("regex" === r.format) return `无效字符串：必须满足正则表达式 ${r.pattern}`;
                        return `无效${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `无效数字：必须是 ${r.divisor} 的倍数`;
                    case "unrecognized_keys":
                        return `出现未知的键(key): ${ej(r.keys,", ")}`;
                    case "invalid_key":
                        return `${r.origin} 中的键(key)无效`;
                    case "invalid_union":
                    default:
                        return "无效输入";
                    case "invalid_element":
                        return `${r.origin} 中包含无效值(value)`
                }
            })
        }
    }, "zhTW", 0, function() {
        let e, t, i;
        return {
            localeError: (e = {
                string: {
                    unit: "字元",
                    verb: "擁有"
                },
                file: {
                    unit: "位元組",
                    verb: "擁有"
                },
                array: {
                    unit: "項目",
                    verb: "擁有"
                },
                set: {
                    unit: "項目",
                    verb: "擁有"
                }
            }, t = {
                regex: "輸入",
                email: "郵件地址",
                url: "URL",
                emoji: "emoji",
                uuid: "UUID",
                uuidv4: "UUIDv4",
                uuidv6: "UUIDv6",
                nanoid: "nanoid",
                guid: "GUID",
                cuid: "cuid",
                cuid2: "cuid2",
                ulid: "ULID",
                xid: "XID",
                ksuid: "KSUID",
                datetime: "ISO 日期時間",
                date: "ISO 日期",
                time: "ISO 時間",
                duration: "ISO 期間",
                ipv4: "IPv4 位址",
                ipv6: "IPv6 位址",
                cidrv4: "IPv4 範圍",
                cidrv6: "IPv6 範圍",
                base64: "base64 編碼字串",
                base64url: "base64url 編碼字串",
                json_string: "JSON 字串",
                e164: "E.164 數值",
                jwt: "JWT",
                template_literal: "輸入"
            }, i = {
                nan: "NaN"
            }, r => {
                switch (r.code) {
                    case "invalid_type":
                        {
                            let e = i[r.expected] ? ? r.expected,
                                t = tt(r.input),
                                n = i[t] ? ? t;
                            if (/^[A-Z]/.test(r.expected)) return `無效的輸入值：預期為 instanceof ${r.expected}，但收到 ${n}`;
                            return `無效的輸入值：預期為 ${e}，但收到 ${n}`
                        }
                    case "invalid_value":
                        if (1 === r.values.length) return `無效的輸入值：預期為 ${e0(r.values[0])}`;
                        return `無效的選項：預期為以下其中之一 ${ej(r.values,"|")}`;
                    case "too_big":
                        {
                            let t = r.inclusive ? "<=" : "<",
                                i = e[r.origin] ? ? null;
                            if (i) return `數值過大：預期 ${r.origin??"值"} 應為 ${t}${r.maximum.toString()} ${i.unit??"個元素"}`;
                            return `數值過大：預期 ${r.origin??"值"} 應為 ${t}${r.maximum.toString()}`
                        }
                    case "too_small":
                        {
                            let t = r.inclusive ? ">=" : ">",
                                i = e[r.origin] ? ? null;
                            if (i) return `數值過小：預期 ${r.origin} 應為 ${t}${r.minimum.toString()} ${i.unit}`;
                            return `數值過小：預期 ${r.origin} 應為 ${t}${r.minimum.toString()}`
                        }
                    case "invalid_format":
                        if ("starts_with" === r.format) return `無效的字串：必須以 "${r.prefix}" 開頭`;
                        if ("ends_with" === r.format) return `無效的字串：必須以 "${r.suffix}" 結尾`;
                        if ("includes" === r.format) return `無效的字串：必須包含 "${r.includes}"`;
                        if ("regex" === r.format) return `無效的字串：必須符合格式 ${r.pattern}`;
                        return `無效的 ${t[r.format]??r.format}`;
                    case "not_multiple_of":
                        return `無效的數字：必須為 ${r.divisor} 的倍數`;
                    case "unrecognized_keys":
                        return `無法識別的鍵值${r.keys.length>1?"們":""}：${ej(r.keys,"、")}`;
                    case "invalid_key":
                        return `${r.origin} 中有無效的鍵值`;
                    case "invalid_union":
                    default:
                        return "無效的輸入值";
                    case "invalid_element":
                        return `${r.origin} 中有無效的值`
                }
            })
        }
    }], 54580);
    var nN = e.i(54580);
    let nP = Symbol("ZodOutput"),
        nE = Symbol("ZodInput");
    class nA {
        constructor() {
            this._map = new WeakMap, this._idmap = new Map
        }
        add(e, ...t) {
            let i = t[0];
            return this._map.set(e, i), i && "object" == typeof i && "id" in i && this._idmap.set(i.id, e), this
        }
        clear() {
            return this._map = new WeakMap, this._idmap = new Map, this
        }
        remove(e) {
            let t = this._map.get(e);
            return t && "object" == typeof t && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this
        }
        get(e) {
            let t = e._zod.parent;
            if (t) {
                let i = { ...this.get(t) ? ? {}
                };
                delete i.id;
                let r = { ...i,
                    ...this._map.get(e)
                };
                return Object.keys(r).length ? r : void 0
            }
            return this._map.get(e)
        }
        has(e) {
            return this._map.has(e)
        }
    }

    function nT() {
        return new nA
    }(i = globalThis).__zod_globalRegistry ? ? (i.__zod_globalRegistry = nT());
    let nC = globalThis.__zod_globalRegistry;

    function nL(e, t) {
        return new e({
            type: "string",
            ...eQ(t)
        })
    }

    function nF(e, t) {
        return new e({
            type: "string",
            coerce: !0,
            ...eQ(t)
        })
    }

    function nR(e, t) {
        return new e({
            type: "string",
            format: "email",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nV(e, t) {
        return new e({
            type: "string",
            format: "guid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nJ(e, t) {
        return new e({
            type: "string",
            format: "uuid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nM(e, t) {
        return new e({
            type: "string",
            format: "uuid",
            check: "string_format",
            abort: !1,
            version: "v4",
            ...eQ(t)
        })
    }

    function nW(e, t) {
        return new e({
            type: "string",
            format: "uuid",
            check: "string_format",
            abort: !1,
            version: "v6",
            ...eQ(t)
        })
    }

    function nB(e, t) {
        return new e({
            type: "string",
            format: "uuid",
            check: "string_format",
            abort: !1,
            version: "v7",
            ...eQ(t)
        })
    }

    function nG(e, t) {
        return new e({
            type: "string",
            format: "url",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nK(e, t) {
        return new e({
            type: "string",
            format: "emoji",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nX(e, t) {
        return new e({
            type: "string",
            format: "nanoid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nq(e, t) {
        return new e({
            type: "string",
            format: "cuid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nH(e, t) {
        return new e({
            type: "string",
            format: "cuid2",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nY(e, t) {
        return new e({
            type: "string",
            format: "ulid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function nQ(e, t) {
        return new e({
            type: "string",
            format: "xid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n0(e, t) {
        return new e({
            type: "string",
            format: "ksuid",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n4(e, t) {
        return new e({
            type: "string",
            format: "ipv4",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n6(e, t) {
        return new e({
            type: "string",
            format: "ipv6",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n1(e, t) {
        return new e({
            type: "string",
            format: "mac",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n2(e, t) {
        return new e({
            type: "string",
            format: "cidrv4",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n9(e, t) {
        return new e({
            type: "string",
            format: "cidrv6",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n3(e, t) {
        return new e({
            type: "string",
            format: "base64",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n7(e, t) {
        return new e({
            type: "string",
            format: "base64url",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n5(e, t) {
        return new e({
            type: "string",
            format: "e164",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }

    function n8(e, t) {
        return new e({
            type: "string",
            format: "jwt",
            check: "string_format",
            abort: !1,
            ...eQ(t)
        })
    }
    e.s(["$ZodRegistry", 0, nA, "$input", 0, nE, "$output", 0, nP, "globalRegistry", 0, nC, "registry", 0, nT], 25527), e.i(25527), e.i(98530);
    let ae = {
        Any: null,
        Minute: -1,
        Second: 0,
        Millisecond: 3,
        Microsecond: 6
    };

    function at(e, t) {
        return new e({
            type: "string",
            format: "datetime",
            check: "string_format",
            offset: !1,
            local: !1,
            precision: null,
            ...eQ(t)
        })
    }

    function ai(e, t) {
        return new e({
            type: "string",
            format: "date",
            check: "string_format",
            ...eQ(t)
        })
    }

    function ar(e, t) {
        return new e({
            type: "string",
            format: "time",
            check: "string_format",
            precision: null,
            ...eQ(t)
        })
    }

    function an(e, t) {
        return new e({
            type: "string",
            format: "duration",
            check: "string_format",
            ...eQ(t)
        })
    }

    function aa(e, t) {
        return new e({
            type: "number",
            checks: [],
            ...eQ(t)
        })
    }

    function ao(e, t) {
        return new e({
            type: "number",
            coerce: !0,
            checks: [],
            ...eQ(t)
        })
    }

    function au(e, t) {
        return new e({
            type: "number",
            check: "number_format",
            abort: !1,
            format: "safeint",
            ...eQ(t)
        })
    }

    function as(e, t) {
        return new e({
            type: "number",
            check: "number_format",
            abort: !1,
            format: "float32",
            ...eQ(t)
        })
    }

    function al(e, t) {
        return new e({
            type: "number",
            check: "number_format",
            abort: !1,
            format: "float64",
            ...eQ(t)
        })
    }

    function ad(e, t) {
        return new e({
            type: "number",
            check: "number_format",
            abort: !1,
            format: "int32",
            ...eQ(t)
        })
    }

    function ac(e, t) {
        return new e({
            type: "number",
            check: "number_format",
            abort: !1,
            format: "uint32",
            ...eQ(t)
        })
    }

    function am(e, t) {
        return new e({
            type: "boolean",
            ...eQ(t)
        })
    }

    function af(e, t) {
        return new e({
            type: "boolean",
            coerce: !0,
            ...eQ(t)
        })
    }

    function ap(e, t) {
        return new e({
            type: "bigint",
            ...eQ(t)
        })
    }

    function av(e, t) {
        return new e({
            type: "bigint",
            coerce: !0,
            ...eQ(t)
        })
    }

    function ag(e, t) {
        return new e({
            type: "bigint",
            check: "bigint_format",
            abort: !1,
            format: "int64",
            ...eQ(t)
        })
    }

    function ah(e, t) {
        return new e({
            type: "bigint",
            check: "bigint_format",
            abort: !1,
            format: "uint64",
            ...eQ(t)
        })
    }

    function a$(e, t) {
        return new e({
            type: "symbol",
            ...eQ(t)
        })
    }

    function ay(e, t) {
        return new e({
            type: "undefined",
            ...eQ(t)
        })
    }

    function a_(e, t) {
        return new e({
            type: "null",
            ...eQ(t)
        })
    }

    function ab(e) {
        return new e({
            type: "any"
        })
    }

    function ax(e) {
        return new e({
            type: "unknown"
        })
    }

    function ak(e, t) {
        return new e({
            type: "never",
            ...eQ(t)
        })
    }

    function aI(e, t) {
        return new e({
            type: "void",
            ...eQ(t)
        })
    }

    function aS(e, t) {
        return new e({
            type: "date",
            ...eQ(t)
        })
    }

    function aw(e, t) {
        return new e({
            type: "date",
            coerce: !0,
            ...eQ(t)
        })
    }

    function az(e, t) {
        return new e({
            type: "nan",
            ...eQ(t)
        })
    }

    function aZ(e, t) {
        return new iO({
            check: "less_than",
            ...eQ(t),
            value: e,
            inclusive: !1
        })
    }

    function aU(e, t) {
        return new iO({
            check: "less_than",
            ...eQ(t),
            value: e,
            inclusive: !0
        })
    }

    function aO(e, t) {
        return new iD({
            check: "greater_than",
            ...eQ(t),
            value: e,
            inclusive: !1
        })
    }

    function aD(e, t) {
        return new iD({
            check: "greater_than",
            ...eQ(t),
            value: e,
            inclusive: !0
        })
    }

    function aj(e) {
        return aO(0, e)
    }

    function aN(e) {
        return aZ(0, e)
    }

    function aP(e) {
        return aU(0, e)
    }

    function aE(e) {
        return aD(0, e)
    }

    function aA(e, t) {
        return new ij({
            check: "multiple_of",
            ...eQ(t),
            value: e
        })
    }

    function aT(e, t) {
        return new iE({
            check: "max_size",
            ...eQ(t),
            maximum: e
        })
    }

    function aC(e, t) {
        return new iA({
            check: "min_size",
            ...eQ(t),
            minimum: e
        })
    }

    function aL(e, t) {
        return new iT({
            check: "size_equals",
            ...eQ(t),
            size: e
        })
    }

    function aF(e, t) {
        return new iC({
            check: "max_length",
            ...eQ(t),
            maximum: e
        })
    }

    function aR(e, t) {
        return new iL({
            check: "min_length",
            ...eQ(t),
            minimum: e
        })
    }

    function aV(e, t) {
        return new iF({
            check: "length_equals",
            ...eQ(t),
            length: e
        })
    }

    function aJ(e, t) {
        return new iV({
            check: "string_format",
            format: "regex",
            ...eQ(t),
            pattern: e
        })
    }

    function aM(e) {
        return new iJ({
            check: "string_format",
            format: "lowercase",
            ...eQ(e)
        })
    }

    function aW(e) {
        return new iM({
            check: "string_format",
            format: "uppercase",
            ...eQ(e)
        })
    }

    function aB(e, t) {
        return new iW({
            check: "string_format",
            format: "includes",
            ...eQ(t),
            includes: e
        })
    }

    function aG(e, t) {
        return new iB({
            check: "string_format",
            format: "starts_with",
            ...eQ(t),
            prefix: e
        })
    }

    function aK(e, t) {
        return new iG({
            check: "string_format",
            format: "ends_with",
            ...eQ(t),
            suffix: e
        })
    }

    function aX(e, t, i) {
        return new iX({
            check: "property",
            property: e,
            schema: t,
            ...eQ(i)
        })
    }

    function aq(e, t) {
        return new iq({
            check: "mime_type",
            mime: e,
            ...eQ(t)
        })
    }

    function aH(e) {
        return new iH({
            check: "overwrite",
            tx: e
        })
    }

    function aY(e) {
        return aH(t => t.normalize(e))
    }

    function aQ() {
        return aH(e => e.trim())
    }

    function a0() {
        return aH(e => e.toLowerCase())
    }

    function a4() {
        return aH(e => e.toUpperCase())
    }

    function a6() {
        return aH(e => eJ(e))
    }

    function a1(e, t, i) {
        return new e({
            type: "array",
            element: t,
            ...eQ(i)
        })
    }

    function a2(e, t, i) {
        return new e({
            type: "union",
            options: t,
            ...eQ(i)
        })
    }

    function a9(e, t, i) {
        return new e({
            type: "union",
            options: t,
            inclusive: !1,
            ...eQ(i)
        })
    }

    function a3(e, t, i, r) {
        return new e({
            type: "union",
            options: i,
            discriminator: t,
            ...eQ(r)
        })
    }

    function a7(e, t, i) {
        return new e({
            type: "intersection",
            left: t,
            right: i
        })
    }

    function a5(e, t, i, r) {
        let n = i instanceof i0,
            a = n ? r : i;
        return new e({
            type: "tuple",
            items: t,
            rest: n ? i : null,
            ...eQ(a)
        })
    }

    function a8(e, t, i, r) {
        return new e({
            type: "record",
            keyType: t,
            valueType: i,
            ...eQ(r)
        })
    }

    function oe(e, t, i, r) {
        return new e({
            type: "map",
            keyType: t,
            valueType: i,
            ...eQ(r)
        })
    }

    function ot(e, t, i) {
        return new e({
            type: "set",
            valueType: t,
            ...eQ(i)
        })
    }

    function oi(e, t, i) {
        return new e({
            type: "enum",
            entries: Array.isArray(t) ? Object.fromEntries(t.map(e => [e, e])) : t,
            ...eQ(i)
        })
    }

    function or(e, t, i) {
        return new e({
            type: "enum",
            entries: t,
            ...eQ(i)
        })
    }

    function on(e, t, i) {
        return new e({
            type: "literal",
            values: Array.isArray(t) ? t : [t],
            ...eQ(i)
        })
    }

    function oa(e, t) {
        return new e({
            type: "file",
            ...eQ(t)
        })
    }

    function oo(e, t) {
        return new e({
            type: "transform",
            transform: t
        })
    }

    function ou(e, t) {
        return new e({
            type: "optional",
            innerType: t
        })
    }

    function os(e, t) {
        return new e({
            type: "nullable",
            innerType: t
        })
    }

    function ol(e, t, i) {
        return new e({
            type: "default",
            innerType: t,
            get defaultValue() {
                return "function" == typeof i ? i() : eK(i)
            }
        })
    }

    function od(e, t, i) {
        return new e({
            type: "nonoptional",
            innerType: t,
            ...eQ(i)
        })
    }

    function oc(e, t) {
        return new e({
            type: "success",
            innerType: t
        })
    }

    function om(e, t, i) {
        return new e({
            type: "catch",
            innerType: t,
            catchValue: "function" == typeof i ? i : () => i
        })
    }

    function of (e, t, i) {
        return new e({
            type: "pipe",
            in: t,
            out: i
        })
    }

    function op(e, t) {
        return new e({
            type: "readonly",
            innerType: t
        })
    }

    function ov(e, t, i) {
        return new e({
            type: "template_literal",
            parts: t,
            ...eQ(i)
        })
    }

    function og(e, t) {
        return new e({
            type: "lazy",
            getter: t
        })
    }

    function oh(e, t) {
        return new e({
            type: "promise",
            innerType: t
        })
    }

    function o$(e, t, i) {
        let r = eQ(i);
        return r.abort ? ? (r.abort = !0), new e({
            type: "custom",
            check: "custom",
            fn: t,
            ...r
        })
    }

    function oy(e, t, i) {
        return new e({
            type: "custom",
            check: "custom",
            fn: t,
            ...eQ(i)
        })
    }

    function o_(e, t) {
        let i = ob(t => (t.addIssue = e => {
            "string" == typeof e ? t.issues.push(ti(e, t.value, i._zod.def)) : (e.fatal && (e.continue = !1), e.code ? ? (e.code = "custom"), e.input ? ? (e.input = t.value), e.inst ? ? (e.inst = i), e.continue ? ? (e.continue = !i._zod.def.abort), t.issues.push(ti(e)))
        }, e(t.value, t)), t);
        return i
    }

    function ob(e, t) {
        let i = new iZ({
            check: "custom",
            ...eQ(t)
        });
        return i._zod.check = e, i
    }

    function ox(e) {
        let t = new iZ({
            check: "describe"
        });
        return t._zod.onattach = [t => {
            let i = nC.get(t) ? ? {};
            nC.add(t, { ...i,
                description: e
            })
        }], t._zod.check = () => {}, t
    }

    function ok(e) {
        let t = new iZ({
            check: "meta"
        });
        return t._zod.onattach = [t => {
            let i = nC.get(t) ? ? {};
            nC.add(t, { ...i,
                ...e
            })
        }], t._zod.check = () => {}, t
    }

    function oI(e, t) {
        let i = eQ(t),
            r = i.truthy ? ? ["true", "1", "yes", "on", "y", "enabled"],
            n = i.falsy ? ? ["false", "0", "no", "off", "n", "disabled"];
        "sensitive" !== i.case && (r = r.map(e => "string" == typeof e ? e.toLowerCase() : e), n = n.map(e => "string" == typeof e ? e.toLowerCase() : e));
        let a = new Set(r),
            o = new Set(n),
            u = e.Codec ? ? nc,
            s = e.Boolean ? ? rk,
            l = new u({
                type: "pipe",
                in: new(e.String ? ? i4)({
                    type: "string",
                    error: i.error
                }),
                out: new s({
                    type: "boolean",
                    error: i.error
                }),
                transform: (e, t) => {
                    let r = e;
                    return "sensitive" !== i.case && (r = r.toLowerCase()), !!a.has(r) || !o.has(r) && (t.issues.push({
                        code: "invalid_value",
                        expected: "stringbool",
                        values: [...a, ...o],
                        input: t.value,
                        inst: l,
                        continue: !1
                    }), {})
                },
                reverseTransform: (e, t) => !0 === e ? r[0] || "true" : n[0] || "false",
                error: i.error
            });
        return l
    }

    function oS(e, t, i, r = {}) {
        let n = eQ(r),
            a = { ...eQ(r),
                check: "string_format",
                type: "string",
                format: t,
                fn: "function" == typeof i ? i : e => i.test(e),
                ...n
            };
        return i instanceof RegExp && (a.pattern = i), new e(a)
    }

    function ow(e) {
        let t = e ? .target ? ? "draft-2020-12";
        return "draft-4" === t && (t = "draft-04"), "draft-7" === t && (t = "draft-07"), {
            processors: e.processors ? ? {},
            metadataRegistry: e ? .metadata ? ? nC,
            target: t,
            unrepresentable: e ? .unrepresentable ? ? "throw",
            override: e ? .override ? ? (() => {}),
            io: e ? .io ? ? "output",
            counter: 0,
            seen: new Map,
            cycles: e ? .cycles ? ? "ref",
            reused: e ? .reused ? ? "inline",
            external: e ? .external ? ? void 0
        }
    }

    function oz(e, t, i = {
        path: [],
        schemaPath: []
    }) {
        var r;
        let n = e._zod.def,
            a = t.seen.get(e);
        if (a) return a.count++, i.schemaPath.includes(e) && (a.cycle = i.path), a.schema;
        let o = {
            schema: {},
            count: 1,
            cycle: void 0,
            path: i.path
        };
        t.seen.set(e, o);
        let u = e._zod.toJSONSchema ? .();
        if (u) o.schema = u;
        else {
            let r = { ...i,
                schemaPath: [...i.schemaPath, e],
                path: i.path
            };
            if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
            else {
                let i = o.schema,
                    a = t.processors[n.type];
                if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);
                a(e, t, i, r)
            }
            let a = e._zod.parent;
            a && (o.ref || (o.ref = a), oz(a, t, r), t.seen.get(a).isParent = !0)
        }
        let s = t.metadataRegistry.get(e);
        return s && Object.assign(o.schema, s), "input" === t.io && function e(t, i) {
            let r = i ? ? {
                seen: new Set
            };
            if (r.seen.has(t)) return !1;
            r.seen.add(t);
            let n = t._zod.def;
            if ("transform" === n.type) return !0;
            if ("array" === n.type) return e(n.element, r);
            if ("set" === n.type) return e(n.valueType, r);
            if ("lazy" === n.type) return e(n.getter(), r);
            if ("promise" === n.type || "optional" === n.type || "nonoptional" === n.type || "nullable" === n.type || "readonly" === n.type || "default" === n.type || "prefault" === n.type) return e(n.innerType, r);
            if ("intersection" === n.type) return e(n.left, r) || e(n.right, r);
            if ("record" === n.type || "map" === n.type) return e(n.keyType, r) || e(n.valueType, r);
            if ("pipe" === n.type) return !!t._zod.traits.has("$ZodCodec") || e(n.in, r) || e(n.out, r);
            if ("object" === n.type) {
                for (let t in n.shape)
                    if (e(n.shape[t], r)) return !0;
                return !1
            }
            if ("union" === n.type) {
                for (let t of n.options)
                    if (e(t, r)) return !0;
                return !1
            }
            if ("tuple" === n.type) {
                for (let t of n.items)
                    if (e(t, r)) return !0;
                if (n.rest && e(n.rest, r)) return !0
            }
            return !1
        }(e) && (delete o.schema.examples, delete o.schema.default), "input" === t.io && "_prefault" in o.schema && ((r = o.schema).default ? ? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema
    }

    function oZ(e, t) {
        let i = e.seen.get(t);
        if (!i) throw Error("Unprocessed schema. This is a bug in Zod.");
        let r = new Map;
        for (let t of e.seen.entries()) {
            let i = e.metadataRegistry.get(t[0]) ? .id;
            if (i) {
                let e = r.get(i);
                if (e && e !== t[0]) throw Error(`Duplicate schema id "${i}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
                r.set(i, t[0])
            }
        }
        let n = t => {
            if (t[1].schema.$ref) return;
            let r = t[1],
                {
                    ref: n,
                    defId: a
                } = (t => {
                    let r = "draft-2020-12" === e.target ? "$defs" : "definitions";
                    if (e.external) {
                        let i = e.external.registry.get(t[0]) ? .id,
                            n = e.external.uri ? ? (e => e);
                        if (i) return {
                            ref: n(i)
                        };
                        let a = t[1].defId ? ? t[1].schema.id ? ? `schema${e.counter++}`;
                        return t[1].defId = a, {
                            defId: a,
                            ref: `${n("__shared")}#/${r}/${a}`
                        }
                    }
                    if (t[1] === i) return {
                        ref: "#"
                    };
                    let n = `#/${r}/`,
                        a = t[1].schema.id ? ? `__schema${e.counter++}`;
                    return {
                        defId: a,
                        ref: n + a
                    }
                })(t);
            r.def = { ...r.schema
            }, a && (r.defId = a);
            let o = r.schema;
            for (let e in o) delete o[e];
            o.$ref = n
        };
        if ("throw" === e.cycles)
            for (let t of e.seen.entries()) {
                let e = t[1];
                if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)
            }
        for (let i of e.seen.entries()) {
            let r = i[1];
            if (t === i[0]) {
                n(i);
                continue
            }
            if (e.external) {
                let r = e.external.registry.get(i[0]) ? .id;
                if (t !== i[0] && r) {
                    n(i);
                    continue
                }
            }
            if (e.metadataRegistry.get(i[0]) ? .id || r.cycle || r.count > 1 && "ref" === e.reused) {
                n(i);
                continue
            }
        }
    }

    function oU(e, t) {
        let i = e.seen.get(t);
        if (!i) throw Error("Unprocessed schema. This is a bug in Zod.");
        let r = t => {
            let i = e.seen.get(t);
            if (null === i.ref) return;
            let n = i.def ? ? i.schema,
                a = { ...n
                },
                o = i.ref;
            if (i.ref = null, o) {
                r(o);
                let i = e.seen.get(o),
                    u = i.schema;
                if (u.$ref && ("draft-07" === e.target || "draft-04" === e.target || "openapi-3.0" === e.target) ? (n.allOf = n.allOf ? ? [], n.allOf.push(u)) : Object.assign(n, u), Object.assign(n, a), t._zod.parent === o)
                    for (let e in n) "$ref" !== e && "allOf" !== e && (e in a || delete n[e]);
                if (u.$ref && i.def)
                    for (let e in n) "$ref" !== e && "allOf" !== e && e in i.def && JSON.stringify(n[e]) === JSON.stringify(i.def[e]) && delete n[e]
            }
            let u = t._zod.parent;
            if (u && u !== o) {
                r(u);
                let t = e.seen.get(u);
                if (t ? .schema.$ref && (n.$ref = t.schema.$ref, t.def))
                    for (let e in n) "$ref" !== e && "allOf" !== e && e in t.def && JSON.stringify(n[e]) === JSON.stringify(t.def[e]) && delete n[e]
            }
            e.override({
                zodSchema: t,
                jsonSchema: n,
                path: i.path ? ? []
            })
        };
        for (let t of [...e.seen.entries()].reverse()) r(t[0]);
        let n = {};
        if ("draft-2020-12" === e.target ? n.$schema = "https://json-schema.org/draft/2020-12/schema" : "draft-07" === e.target ? n.$schema = "http://json-schema.org/draft-07/schema#" : "draft-04" === e.target ? n.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external ? .uri) {
            let i = e.external.registry.get(t) ? .id;
            if (!i) throw Error("Schema is missing an `id` property");
            n.$id = e.external.uri(i)
        }
        Object.assign(n, i.def ? ? i.schema);
        let a = e.metadataRegistry.get(t) ? .id;
        void 0 !== a && n.id === a && delete n.id;
        let o = e.external ? .defs ? ? {};
        for (let t of e.seen.entries()) {
            let e = t[1];
            e.def && e.defId && (e.def.id === e.defId && delete e.def.id, o[e.defId] = e.def)
        }
        e.external || Object.keys(o).length > 0 && ("draft-2020-12" === e.target ? n.$defs = o : n.definitions = o);
        try {
            let i = JSON.parse(JSON.stringify(n));
            return Object.defineProperty(i, "~standard", {
                value: { ...t["~standard"],
                    jsonSchema: {
                        input: oD(t, "input", e.processors),
                        output: oD(t, "output", e.processors)
                    }
                },
                enumerable: !1,
                writable: !1
            }), i
        } catch (e) {
            throw Error("Error converting schema to JSON.")
        }
    }
    e.s(["TimePrecision", 0, ae, "_any", 0, ab, "_array", 0, a1, "_base64", 0, n3, "_base64url", 0, n7, "_bigint", 0, ap, "_boolean", 0, am, "_catch", 0, om, "_check", 0, ob, "_cidrv4", 0, n2, "_cidrv6", 0, n9, "_coercedBigint", 0, av, "_coercedBoolean", 0, af, "_coercedDate", 0, aw, "_coercedNumber", 0, ao, "_coercedString", 0, nF, "_cuid", 0, nq, "_cuid2", 0, nH, "_custom", 0, o$, "_date", 0, aS, "_default", 0, ol, "_discriminatedUnion", 0, a3, "_e164", 0, n5, "_email", 0, nR, "_emoji", 0, nK, "_endsWith", 0, aK, "_enum", 0, oi, "_file", 0, oa, "_float32", 0, as, "_float64", 0, al, "_gt", 0, aO, "_gte", 0, aD, "_guid", 0, nV, "_includes", 0, aB, "_int", 0, au, "_int32", 0, ad, "_int64", 0, ag, "_intersection", 0, a7, "_ipv4", 0, n4, "_ipv6", 0, n6, "_isoDate", 0, ai, "_isoDateTime", 0, at, "_isoDuration", 0, an, "_isoTime", 0, ar, "_jwt", 0, n8, "_ksuid", 0, n0, "_lazy", 0, og, "_length", 0, aV, "_literal", 0, on, "_lowercase", 0, aM, "_lt", 0, aZ, "_lte", 0, aU, "_mac", 0, n1, "_map", 0, oe, "_max", 0, aU, "_maxLength", 0, aF, "_maxSize", 0, aT, "_mime", 0, aq, "_min", 0, aD, "_minLength", 0, aR, "_minSize", 0, aC, "_multipleOf", 0, aA, "_nan", 0, az, "_nanoid", 0, nX, "_nativeEnum", 0, or, "_negative", 0, aN, "_never", 0, ak, "_nonnegative", 0, aE, "_nonoptional", 0, od, "_nonpositive", 0, aP, "_normalize", 0, aY, "_null", 0, a_, "_nullable", 0, os, "_number", 0, aa, "_optional", 0, ou, "_overwrite", 0, aH, "_pipe", 0, of , "_positive", 0, aj, "_promise", 0, oh, "_property", 0, aX, "_readonly", 0, op, "_record", 0, a8, "_refine", 0, oy, "_regex", 0, aJ, "_set", 0, ot, "_size", 0, aL, "_slugify", 0, a6, "_startsWith", 0, aG, "_string", 0, nL, "_stringFormat", 0, oS, "_stringbool", 0, oI, "_success", 0, oc, "_superRefine", 0, o_, "_symbol", 0, a$, "_templateLiteral", 0, ov, "_toLowerCase", 0, a0, "_toUpperCase", 0, a4, "_transform", 0, oo, "_trim", 0, aQ, "_tuple", 0, a5, "_uint32", 0, ac, "_uint64", 0, ah, "_ulid", 0, nY, "_undefined", 0, ay, "_union", 0, a2, "_unknown", 0, ax, "_uppercase", 0, aW, "_url", 0, nG, "_uuid", 0, nJ, "_uuidv4", 0, nM, "_uuidv6", 0, nW, "_uuidv7", 0, nB, "_void", 0, aI, "_xid", 0, nQ, "_xor", 0, a9, "describe", 0, ox, "meta", 0, ok], 50215), e.i(50215);
    let oO = (e, t = {}) => i => {
            let r = ow({ ...i,
                processors: t
            });
            return oz(e, r), oZ(r, e), oU(r, e)
        },
        oD = (e, t, i = {}) => r => {
            let {
                libraryOptions: n,
                target: a
            } = r ? ? {}, o = ow({ ...n ? ? {},
                target : a,
                io : t,
                processors: i
            });
            return oz(e, o), oZ(o, e), oU(o, e)
        };
    e.s(["createStandardJSONSchemaMethod", 0, oD, "createToJSONSchemaMethod", 0, oO, "extractDefs", 0, oZ, "finalize", 0, oU, "initializeContext", 0, ow, "process", 0, oz], 34966), e.i(34966);
    let oj = {
            guid: "uuid",
            url: "uri",
            datetime: "date-time",
            json_string: "json-string",
            regex: ""
        },
        oN = (e, t, i, r) => {
            i.type = "string";
            let {
                minimum: n,
                maximum: a,
                format: o,
                patterns: u,
                contentEncoding: s
            } = e._zod.bag;
            if ("number" == typeof n && (i.minLength = n), "number" == typeof a && (i.maxLength = a), o && (i.format = oj[o] ? ? o, "" === i.format && delete i.format, "time" === o && delete i.format), s && (i.contentEncoding = s), u && u.size > 0) {
                let e = [...u];
                1 === e.length ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map(e => ({ ..."draft-07" === t.target || "draft-04" === t.target || "openapi-3.0" === t.target ? {
                        type: "string"
                    } : {},
                    pattern: e.source
                }))])
            }
        },
        oP = (e, t, i, r) => {
            let {
                minimum: n,
                maximum: a,
                format: o,
                multipleOf: u,
                exclusiveMaximum: s,
                exclusiveMinimum: l
            } = e._zod.bag;
            "string" == typeof o && o.includes("int") ? i.type = "integer" : i.type = "number";
            let d = "number" == typeof l && l >= (n ? ? -1 / 0),
                c = "number" == typeof s && s <= (a ? ? 1 / 0),
                m = "draft-04" === t.target || "openapi-3.0" === t.target;
            d ? m ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : "number" == typeof n && (i.minimum = n), c ? m ? (i.maximum = s, i.exclusiveMaximum = !0) : i.exclusiveMaximum = s : "number" == typeof a && (i.maximum = a), "number" == typeof u && (i.multipleOf = u)
        },
        oE = (e, t, i, r) => {
            i.type = "boolean"
        },
        oA = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("BigInt cannot be represented in JSON Schema")
        },
        oT = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Symbols cannot be represented in JSON Schema")
        },
        oC = (e, t, i, r) => {
            "openapi-3.0" === t.target ? (i.type = "string", i.nullable = !0, i.enum = [null]) : i.type = "null"
        },
        oL = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Undefined cannot be represented in JSON Schema")
        },
        oF = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Void cannot be represented in JSON Schema")
        },
        oR = (e, t, i, r) => {
            i.not = {}
        },
        oV = (e, t, i, r) => {},
        oJ = (e, t, i, r) => {},
        oM = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Date cannot be represented in JSON Schema")
        },
        oW = (e, t, i, r) => {
            let n = eD(e._zod.def.entries);
            n.every(e => "number" == typeof e) && (i.type = "number"), n.every(e => "string" == typeof e) && (i.type = "string"), i.enum = n
        },
        oB = (e, t, i, r) => {
            let n = e._zod.def,
                a = [];
            for (let e of n.values)
                if (void 0 === e) {
                    if ("throw" === t.unrepresentable) throw Error("Literal `undefined` cannot be represented in JSON Schema")
                } else if ("bigint" == typeof e)
                if ("throw" === t.unrepresentable) throw Error("BigInt literals cannot be represented in JSON Schema");
                else a.push(Number(e));
            else a.push(e);
            if (0 === a.length);
            else if (1 === a.length) {
                let e = a[0];
                i.type = null === e ? "null" : typeof e, "draft-04" === t.target || "openapi-3.0" === t.target ? i.enum = [e] : i.const = e
            } else a.every(e => "number" == typeof e) && (i.type = "number"), a.every(e => "string" == typeof e) && (i.type = "string"), a.every(e => "boolean" == typeof e) && (i.type = "boolean"), a.every(e => null === e) && (i.type = "null"), i.enum = a
        },
        oG = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("NaN cannot be represented in JSON Schema")
        },
        oK = (e, t, i, r) => {
            let n = e._zod.pattern;
            if (!n) throw Error("Pattern not found in template literal");
            i.type = "string", i.pattern = n.source
        },
        oX = (e, t, i, r) => {
            let n = {
                    type: "string",
                    format: "binary",
                    contentEncoding: "binary"
                },
                {
                    minimum: a,
                    maximum: o,
                    mime: u
                } = e._zod.bag;
            void 0 !== a && (n.minLength = a), void 0 !== o && (n.maxLength = o), u ? 1 === u.length ? (n.contentMediaType = u[0], Object.assign(i, n)) : (Object.assign(i, n), i.anyOf = u.map(e => ({
                contentMediaType: e
            }))) : Object.assign(i, n)
        },
        oq = (e, t, i, r) => {
            i.type = "boolean"
        },
        oH = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Custom types cannot be represented in JSON Schema")
        },
        oY = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Function types cannot be represented in JSON Schema")
        },
        oQ = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Transforms cannot be represented in JSON Schema")
        },
        o0 = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Map cannot be represented in JSON Schema")
        },
        o4 = (e, t, i, r) => {
            if ("throw" === t.unrepresentable) throw Error("Set cannot be represented in JSON Schema")
        },
        o6 = (e, t, i, r) => {
            let n = e._zod.def,
                {
                    minimum: a,
                    maximum: o
                } = e._zod.bag;
            "number" == typeof a && (i.minItems = a), "number" == typeof o && (i.maxItems = o), i.type = "array", i.items = oz(n.element, t, { ...r,
                path: [...r.path, "items"]
            })
        },
        o1 = (e, t, i, r) => {
            let n = e._zod.def;
            i.type = "object", i.properties = {};
            let a = n.shape;
            for (let e in a) i.properties[e] = oz(a[e], t, { ...r,
                path: [...r.path, "properties", e]
            });
            let o = new Set([...new Set(Object.keys(a))].filter(e => {
                let i = n.shape[e]._zod;
                return "input" === t.io ? void 0 === i.optin : void 0 === i.optout
            }));
            o.size > 0 && (i.required = Array.from(o)), n.catchall ? ._zod.def.type === "never" ? i.additionalProperties = !1 : n.catchall ? n.catchall && (i.additionalProperties = oz(n.catchall, t, { ...r,
                path: [...r.path, "additionalProperties"]
            })) : "output" === t.io && (i.additionalProperties = !1)
        },
        o2 = (e, t, i, r) => {
            let n = e._zod.def,
                a = !1 === n.inclusive,
                o = n.options.map((e, i) => oz(e, t, { ...r,
                    path: [...r.path, a ? "oneOf" : "anyOf", i]
                }));
            a ? i.oneOf = o : i.anyOf = o
        },
        o9 = (e, t, i, r) => {
            let n = e._zod.def,
                a = oz(n.left, t, { ...r,
                    path: [...r.path, "allOf", 0]
                }),
                o = oz(n.right, t, { ...r,
                    path: [...r.path, "allOf", 1]
                }),
                u = e => "allOf" in e && 1 === Object.keys(e).length;
            i.allOf = [...u(a) ? a.allOf : [a], ...u(o) ? o.allOf : [o]]
        },
        o3 = (e, t, i, r) => {
            let n = e._zod.def;
            i.type = "array";
            let a = "draft-2020-12" === t.target ? "prefixItems" : "items",
                o = "draft-2020-12" === t.target || "openapi-3.0" === t.target ? "items" : "additionalItems",
                u = n.items.map((e, i) => oz(e, t, { ...r,
                    path: [...r.path, a, i]
                })),
                s = n.rest ? oz(n.rest, t, { ...r,
                    path: [...r.path, o, ..."openapi-3.0" === t.target ? [n.items.length] : []]
                }) : null;
            "draft-2020-12" === t.target ? (i.prefixItems = u, s && (i.items = s)) : "openapi-3.0" === t.target ? (i.items = {
                anyOf: u
            }, s && i.items.anyOf.push(s), i.minItems = u.length, s || (i.maxItems = u.length)) : (i.items = u, s && (i.additionalItems = s));
            let {
                minimum: l,
                maximum: d
            } = e._zod.bag;
            "number" == typeof l && (i.minItems = l), "number" == typeof d && (i.maxItems = d)
        },
        o7 = (e, t, i, r) => {
            let n = e._zod.def;
            i.type = "object";
            let a = n.keyType,
                o = a._zod.bag,
                u = o ? .patterns;
            if ("loose" === n.mode && u && u.size > 0) {
                let e = oz(n.valueType, t, { ...r,
                    path: [...r.path, "patternProperties", "*"]
                });
                for (let t of (i.patternProperties = {}, u)) i.patternProperties[t.source] = e
            } else("draft-07" === t.target || "draft-2020-12" === t.target) && (i.propertyNames = oz(n.keyType, t, { ...r,
                path: [...r.path, "propertyNames"]
            })), i.additionalProperties = oz(n.valueType, t, { ...r,
                path: [...r.path, "additionalProperties"]
            });
            let s = a._zod.values;
            if (s) {
                let e = [...s].filter(e => "string" == typeof e || "number" == typeof e);
                e.length > 0 && (i.required = e)
            }
        },
        o5 = (e, t, i, r) => {
            let n = e._zod.def,
                a = oz(n.innerType, t, r),
                o = t.seen.get(e);
            "openapi-3.0" === t.target ? (o.ref = n.innerType, i.nullable = !0) : i.anyOf = [a, {
                type: "null"
            }]
        },
        o8 = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType
        },
        ue = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType, i.default = JSON.parse(JSON.stringify(n.defaultValue))
        },
        ut = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType, "input" === t.io && (i._prefault = JSON.parse(JSON.stringify(n.defaultValue)))
        },
        ui = (e, t, i, r) => {
            let n, a = e._zod.def;
            oz(a.innerType, t, r), t.seen.get(e).ref = a.innerType;
            try {
                n = a.catchValue(void 0)
            } catch {
                throw Error("Dynamic catch values are not supported in JSON Schema")
            }
            i.default = n
        },
        ur = (e, t, i, r) => {
            let n = e._zod.def,
                a = n.in._zod.traits.has("$ZodTransform"),
                o = "input" === t.io ? a ? n.out : n.in : n.out;
            oz(o, t, r), t.seen.get(e).ref = o
        },
        un = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType, i.readOnly = !0
        },
        ua = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType
        },
        uo = (e, t, i, r) => {
            let n = e._zod.def;
            oz(n.innerType, t, r), t.seen.get(e).ref = n.innerType
        },
        uu = (e, t, i, r) => {
            let n = e._zod.innerType;
            oz(n, t, r), t.seen.get(e).ref = n
        },
        us = {
            string: oN,
            number: oP,
            boolean: oE,
            bigint: oA,
            symbol: oT,
            null: oC,
            undefined: oL,
            void: oF,
            never: oR,
            any: oV,
            unknown: oJ,
            date: oM,
            enum: oW,
            literal: oB,
            nan: oG,
            template_literal: oK,
            file: oX,
            success: oq,
            custom: oH,
            function: oY,
            transform: oQ,
            map: o0,
            set: o4,
            array: o6,
            object: o1,
            union: o2,
            intersection: o9,
            tuple: o3,
            record: o7,
            nullable: o5,
            nonoptional: o8,
            default: ue,
            prefault: ut,
            catch: ui,
            pipe: ur,
            readonly: un,
            promise: ua,
            optional: uo,
            lazy: uu
        };

    function ul(e, t) {
        if ("_idmap" in e) {
            let i = ow({ ...t,
                    processors: us
                }),
                r = {};
            for (let t of e._idmap.entries()) {
                let [e, r] = t;
                oz(r, i)
            }
            let n = {};
            for (let a of (i.external = {
                    registry: e,
                    uri: t ? .uri,
                    defs: r
                }, e._idmap.entries())) {
                let [e, t] = a;
                oZ(i, t), n[e] = oU(i, t)
            }
            return Object.keys(r).length > 0 && (n.__shared = {
                ["draft-2020-12" === i.target ? "$defs" : "definitions"]: r
            }), {
                schemas: n
            }
        }
        let i = ow({ ...t,
            processors: us
        });
        return oz(e, i), oZ(i, e), oU(i, e)
    }
    e.s([], 18249);
    var ud = e.i(18249);
    e.s(["$ZodAny", 0, rU, "$ZodArray", 0, rE, "$ZodAsyncError", 0, ez, "$ZodBase64", 0, rp, "$ZodBase64URL", 0, rg, "$ZodBigInt", 0, rI, "$ZodBigIntFormat", 0, rS, "$ZodBoolean", 0, rk, "$ZodCIDRv4", 0, rc, "$ZodCIDRv6", 0, rm, "$ZodCUID", 0, i8, "$ZodCUID2", 0, re, "$ZodCatch", 0, nu, "$ZodCheck", 0, iZ, "$ZodCheckBigIntFormat", 0, iP, "$ZodCheckEndsWith", 0, iG, "$ZodCheckGreaterThan", 0, iD, "$ZodCheckIncludes", 0, iW, "$ZodCheckLengthEquals", 0, iF, "$ZodCheckLessThan", 0, iO, "$ZodCheckLowerCase", 0, iJ, "$ZodCheckMaxLength", 0, iC, "$ZodCheckMaxSize", 0, iE, "$ZodCheckMimeType", 0, iq, "$ZodCheckMinLength", 0, iL, "$ZodCheckMinSize", 0, iA, "$ZodCheckMultipleOf", 0, ij, "$ZodCheckNumberFormat", 0, iN, "$ZodCheckOverwrite", 0, iH, "$ZodCheckProperty", 0, iX, "$ZodCheckRegex", 0, iV, "$ZodCheckSizeEquals", 0, iT, "$ZodCheckStartsWith", 0, iB, "$ZodCheckStringFormat", 0, iR, "$ZodCheckUpperCase", 0, iM, "$ZodCodec", 0, nc, "$ZodCustom", 0, nb, "$ZodCustomStringFormat", 0, r_, "$ZodDate", 0, rN, "$ZodDefault", 0, nt, "$ZodDiscriminatedUnion", 0, rW, "$ZodE164", 0, rh, "$ZodEmail", 0, i9, "$ZodEmoji", 0, i7, "$ZodEncodeError", 0, eZ, "$ZodEnum", 0, r1, "$ZodError", 0, to, "$ZodExactOptional", 0, r8, "$ZodFile", 0, r9, "$ZodFunction", 0, n$, "$ZodGUID", 0, i1, "$ZodIPv4", 0, rs, "$ZodIPv6", 0, rl, "$ZodISODate", 0, ra, "$ZodISODateTime", 0, rn, "$ZodISODuration", 0, ru, "$ZodISOTime", 0, ro, "$ZodIntersection", 0, rB, "$ZodJWT", 0, ry, "$ZodKSUID", 0, rr, "$ZodLazy", 0, n_, "$ZodLiteral", 0, r2, "$ZodMAC", 0, rd, "$ZodMap", 0, rQ, "$ZodNaN", 0, ns, "$ZodNanoID", 0, i5, "$ZodNever", 0, rD, "$ZodNonOptional", 0, nn, "$ZodNull", 0, rZ, "$ZodNullable", 0, ne, "$ZodNumber", 0, rb, "$ZodNumberFormat", 0, rx, "$ZodObject", 0, rL, "$ZodObjectJIT", 0, rF, "$ZodOptional", 0, r5, "$ZodPipe", 0, nl, "$ZodPrefault", 0, nr, "$ZodPreprocess", 0, np, "$ZodPromise", 0, ny, "$ZodReadonly", 0, nv, "$ZodRealError", 0, tu, "$ZodRecord", 0, rY, "$ZodRegistry", 0, nA, "$ZodSet", 0, r4, "$ZodString", 0, i4, "$ZodStringFormat", 0, i6, "$ZodSuccess", 0, no, "$ZodSymbol", 0, rw, "$ZodTemplateLiteral", 0, nh, "$ZodTransform", 0, r3, "$ZodTuple", 0, rK, "$ZodType", 0, i0, "$ZodULID", 0, rt, "$ZodURL", 0, i3, "$ZodUUID", 0, i2, "$ZodUndefined", 0, rz, "$ZodUnion", 0, rV, "$ZodUnknown", 0, rO, "$ZodVoid", 0, rj, "$ZodXID", 0, ri, "$ZodXor", 0, rM, "$brand", 0, ew, "$constructor", 0, eS, "$input", 0, nE, "$output", 0, nP, "Doc", 0, iY, "JSONSchema", 0, ud, "JSONSchemaGenerator", 0, class {
        get metadataRegistry() {
            return this.ctx.metadataRegistry
        }
        get target() {
            return this.ctx.target
        }
        get unrepresentable() {
            return this.ctx.unrepresentable
        }
        get override() {
            return this.ctx.override
        }
        get io() {
            return this.ctx.io
        }
        get counter() {
            return this.ctx.counter
        }
        set counter(e) {
            this.ctx.counter = e
        }
        get seen() {
            return this.ctx.seen
        }
        constructor(e) {
            let t = e ? .target ? ? "draft-2020-12";
            "draft-4" === t && (t = "draft-04"), "draft-7" === t && (t = "draft-07"), this.ctx = ow({
                processors: us,
                target: t,
                ...e ? .metadata && {
                    metadata: e.metadata
                },
                ...e ? .unrepresentable && {
                    unrepresentable: e.unrepresentable
                },
                ...e ? .override && {
                    override: e.override
                },
                ...e ? .io && {
                    io: e.io
                }
            })
        }
        process(e, t = {
            path: [],
            schemaPath: []
        }) {
            return oz(e, this.ctx, t)
        }
        emit(e, t) {
            t && (t.cycles && (this.ctx.cycles = t.cycles), t.reused && (this.ctx.reused = t.reused), t.external && (this.ctx.external = t.external)), oZ(this.ctx, e);
            let {
                "~standard": i,
                ...r
            } = oU(this.ctx, e);
            return r
        }
    }, "NEVER", 0, eI, "TimePrecision", 0, ae, "_any", 0, ab, "_array", 0, a1, "_base64", 0, n3, "_base64url", 0, n7, "_bigint", 0, ap, "_boolean", 0, am, "_catch", 0, om, "_check", 0, ob, "_cidrv4", 0, n2, "_cidrv6", 0, n9, "_coercedBigint", 0, av, "_coercedBoolean", 0, af, "_coercedDate", 0, aw, "_coercedNumber", 0, ao, "_coercedString", 0, nF, "_cuid", 0, nq, "_cuid2", 0, nH, "_custom", 0, o$, "_date", 0, aS, "_decode", 0, tk, "_decodeAsync", 0, tz, "_default", 0, ol, "_discriminatedUnion", 0, a3, "_e164", 0, n5, "_email", 0, nR, "_emoji", 0, nK, "_encode", 0, tb, "_encodeAsync", 0, tS, "_endsWith", 0, aK, "_enum", 0, oi, "_file", 0, oa, "_float32", 0, as, "_float64", 0, al, "_gt", 0, aO, "_gte", 0, aD, "_guid", 0, nV, "_includes", 0, aB, "_int", 0, au, "_int32", 0, ad, "_int64", 0, ag, "_intersection", 0, a7, "_ipv4", 0, n4, "_ipv6", 0, n6, "_isoDate", 0, ai, "_isoDateTime", 0, at, "_isoDuration", 0, an, "_isoTime", 0, ar, "_jwt", 0, n8, "_ksuid", 0, n0, "_lazy", 0, og, "_length", 0, aV, "_literal", 0, on, "_lowercase", 0, aM, "_lt", 0, aZ, "_lte", 0, aU, "_mac", 0, n1, "_map", 0, oe, "_max", 0, aU, "_maxLength", 0, aF, "_maxSize", 0, aT, "_mime", 0, aq, "_min", 0, aD, "_minLength", 0, aR, "_minSize", 0, aC, "_multipleOf", 0, aA, "_nan", 0, az, "_nanoid", 0, nX, "_nativeEnum", 0, or, "_negative", 0, aN, "_never", 0, ak, "_nonnegative", 0, aE, "_nonoptional", 0, od, "_nonpositive", 0, aP, "_normalize", 0, aY, "_null", 0, a_, "_nullable", 0, os, "_number", 0, aa, "_optional", 0, ou, "_overwrite", 0, aH, "_parse", 0, tf, "_parseAsync", 0, tv, "_pipe", 0, of , "_positive", 0, aj, "_promise", 0, oh, "_property", 0, aX, "_readonly", 0, op, "_record", 0, a8, "_refine", 0, oy, "_regex", 0, aJ, "_safeDecode", 0, tD, "_safeDecodeAsync", 0, tE, "_safeEncode", 0, tU, "_safeEncodeAsync", 0, tN, "_safeParse", 0, th, "_safeParseAsync", 0, ty, "_set", 0, ot, "_size", 0, aL, "_slugify", 0, a6, "_startsWith", 0, aG, "_string", 0, nL, "_stringFormat", 0, oS, "_stringbool", 0, oI, "_success", 0, oc, "_superRefine", 0, o_, "_symbol", 0, a$, "_templateLiteral", 0, ov, "_toLowerCase", 0, a0, "_toUpperCase", 0, a4, "_transform", 0, oo, "_trim", 0, aQ, "_tuple", 0, a5, "_uint32", 0, ac, "_uint64", 0, ah, "_ulid", 0, nY, "_undefined", 0, ay, "_union", 0, a2, "_unknown", 0, ax, "_uppercase", 0, aW, "_url", 0, nG, "_uuid", 0, nJ, "_uuidv4", 0, nM, "_uuidv6", 0, nW, "_uuidv7", 0, nB, "_void", 0, aI, "_xid", 0, nQ, "_xor", 0, a9, "clone", 0, eY, "config", 0, eO, "createStandardJSONSchemaMethod", 0, oD, "createToJSONSchemaMethod", 0, oO, "decode", 0, tI, "decodeAsync", 0, tZ, "describe", 0, ox, "encode", 0, tx, "encodeAsync", 0, tw, "extractDefs", 0, oZ, "finalize", 0, oU, "flattenError", 0, ts, "formatError", 0, tl, "globalConfig", 0, eU, "globalRegistry", 0, nC, "initializeContext", 0, ow, "isValidBase64", 0, rf, "isValidBase64URL", 0, rv, "isValidJWT", 0, r$, "locales", 0, nN, "meta", 0, ok, "parse", 0, tp, "parseAsync", 0, tg, "prettifyError", 0, tm, "process", 0, oz, "regexes", 0, nI, "registry", 0, nT, "safeDecode", 0, tj, "safeDecodeAsync", 0, tA, "safeEncode", 0, tO, "safeEncodeAsync", 0, tP, "safeParse", 0, t$, "safeParseAsync", 0, t_, "toDotPath", 0, tc, "toJSONSchema", 0, ul, "treeifyError", 0, td, "util", 0, nk, "version", 0, iQ], 12717);
    var uc = e.i(12717),
        um = nI,
        uf = nk;
    let up = eS("ZodISODateTime", (e, t) => {
        rn.init(e, t), uJ.init(e, t)
    });

    function uv(e) {
        return at(up, e)
    }
    let ug = eS("ZodISODate", (e, t) => {
        ra.init(e, t), uJ.init(e, t)
    });

    function uh(e) {
        return ai(ug, e)
    }
    let u$ = eS("ZodISOTime", (e, t) => {
        ro.init(e, t), uJ.init(e, t)
    });

    function uy(e) {
        return ar(u$, e)
    }
    let u_ = eS("ZodISODuration", (e, t) => {
        ru.init(e, t), uJ.init(e, t)
    });

    function ub(e) {
        return an(u_, e)
    }
    let ux = (e, t) => {
            to.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
                format: {
                    value: t => tl(e, t)
                },
                flatten: {
                    value: t => ts(e, t)
                },
                addIssue: {
                    value: t => {
                        e.issues.push(t), e.message = JSON.stringify(e.issues, eN, 2)
                    }
                },
                addIssues: {
                    value: t => {
                        e.issues.push(...t), e.message = JSON.stringify(e.issues, eN, 2)
                    }
                },
                isEmpty: {
                    get: () => 0 === e.issues.length
                }
            })
        },
        uk = eS("ZodError", ux),
        uI = eS("ZodError", ux, {
            Parent: Error
        });
    e.s(["ZodError", 0, uk, "ZodRealError", 0, uI], 89282);
    let uS = tf(uI),
        uw = tv(uI),
        uz = th(uI),
        uZ = ty(uI),
        uU = tb(uI),
        uO = tk(uI),
        uD = tS(uI),
        uj = tz(uI),
        uN = tU(uI),
        uP = tD(uI),
        uE = tN(uI),
        uA = tE(uI);
    e.s(["decode", 0, uO, "decodeAsync", 0, uj, "encode", 0, uU, "encodeAsync", 0, uD, "parse", 0, uS, "parseAsync", 0, uw, "safeDecode", 0, uP, "safeDecodeAsync", 0, uA, "safeEncode", 0, uN, "safeEncodeAsync", 0, uE, "safeParse", 0, uz, "safeParseAsync", 0, uZ], 364);
    let uT = new WeakMap;

    function uC(e, t, i) {
        let r = Object.getPrototypeOf(e),
            n = uT.get(r);
        if (n || (n = new Set, uT.set(r, n)), !n.has(t))
            for (let e in n.add(t), i) {
                let t = i[e];
                Object.defineProperty(r, e, {
                    configurable: !0,
                    enumerable: !1,
                    get() {
                        let i = t.bind(this);
                        return Object.defineProperty(this, e, {
                            configurable: !0,
                            writable: !0,
                            enumerable: !0,
                            value: i
                        }), i
                    },
                    set(t) {
                        Object.defineProperty(this, e, {
                            configurable: !0,
                            writable: !0,
                            enumerable: !0,
                            value: t
                        })
                    }
                })
            }
    }
    let uL = eS("ZodType", (e, t) => (i0.init(e, t), Object.assign(e["~standard"], {
            jsonSchema: {
                input: oD(e, "input"),
                output: oD(e, "output")
            }
        }), e.toJSONSchema = oO(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", {
            value: t
        }), e.parse = (t, i) => uS(e, t, i, {
            callee: e.parse
        }), e.safeParse = (t, i) => uz(e, t, i), e.parseAsync = async (t, i) => uw(e, t, i, {
            callee: e.parseAsync
        }), e.safeParseAsync = async (t, i) => uZ(e, t, i), e.spa = e.safeParseAsync, e.encode = (t, i) => uU(e, t, i), e.decode = (t, i) => uO(e, t, i), e.encodeAsync = async (t, i) => uD(e, t, i), e.decodeAsync = async (t, i) => uj(e, t, i), e.safeEncode = (t, i) => uN(e, t, i), e.safeDecode = (t, i) => uP(e, t, i), e.safeEncodeAsync = async (t, i) => uE(e, t, i), e.safeDecodeAsync = async (t, i) => uA(e, t, i), uC(e, "ZodType", {
            check(...e) {
                let t = this.def;
                return this.clone(uf.mergeDefs(t, {
                    checks: [...t.checks ? ? [], ...e.map(e => "function" == typeof e ? {
                        _zod: {
                            check: e,
                            def: {
                                check: "custom"
                            },
                            onattach: []
                        }
                    } : e)]
                }), {
                    parent: !0
                })
            },
            with(...e) {
                return this.check(...e)
            },
            clone(e, t) {
                return eY(this, e, t)
            },
            brand() {
                return this
            },
            register(e, t) {
                return e.add(this, t), this
            },
            refine(e, t) {
                return this.check(dn(e, t))
            },
            superRefine(e, t) {
                return this.check(da(e, t))
            },
            overwrite(e) {
                return this.check(aH(e))
            },
            optional() {
                return lD(this)
            },
            exactOptional() {
                return lN(this)
            },
            nullable() {
                return lE(this)
            },
            nullish() {
                return lD(lE(this))
            },
            nonoptional(e) {
                return lV(this, e)
            },
            array() {
                return s7(this)
            },
            or(e) {
                return ln([this, e])
            },
            and(e) {
                return ld(this, e)
            },
            transform(e) {
                return lq(this, lU(e))
            },
            default (e) {
                return lC(this, e)
            },
            prefault(e) {
                return lF(this, e)
            },
            catch (e) {
                return lB(this, e)
            },
            pipe(e) {
                return lq(this, e)
            },
            readonly() {
                return l6(this)
            },
            describe(e) {
                let t = this.clone();
                return nC.add(t, {
                    description: e
                }), t
            },
            meta(...e) {
                if (0 === e.length) return nC.get(this);
                let t = this.clone();
                return nC.add(t, e[0]), t
            },
            isOptional() {
                return this.safeParse(void 0).success
            },
            isNullable() {
                return this.safeParse(null).success
            },
            apply(e) {
                return e(this)
            }
        }), Object.defineProperty(e, "description", {
            get: () => nC.get(e) ? .description,
            configurable: !0
        }), e)),
        uF = eS("_ZodString", (e, t) => {
            i4.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oN(e, t, i, r);
            let i = e._zod.bag;
            e.format = i.format ? ? null, e.minLength = i.minimum ? ? null, e.maxLength = i.maximum ? ? null, uC(e, "_ZodString", {
                regex(...e) {
                    return this.check(aJ(...e))
                },
                includes(...e) {
                    return this.check(aB(...e))
                },
                startsWith(...e) {
                    return this.check(aG(...e))
                },
                endsWith(...e) {
                    return this.check(aK(...e))
                },
                min(...e) {
                    return this.check(aR(...e))
                },
                max(...e) {
                    return this.check(aF(...e))
                },
                length(...e) {
                    return this.check(aV(...e))
                },
                nonempty(...e) {
                    return this.check(aR(1, ...e))
                },
                lowercase(e) {
                    return this.check(aM(e))
                },
                uppercase(e) {
                    return this.check(aW(e))
                },
                trim() {
                    return this.check(aQ())
                },
                normalize(...e) {
                    return this.check(aY(...e))
                },
                toLowerCase() {
                    return this.check(a0())
                },
                toUpperCase() {
                    return this.check(a4())
                },
                slugify() {
                    return this.check(a6())
                }
            })
        }),
        uR = eS("ZodString", (e, t) => {
            i4.init(e, t), uF.init(e, t), e.email = t => e.check(nR(uM, t)), e.url = t => e.check(nG(uQ, t)), e.jwt = t => e.check(n8(sx, t)), e.emoji = t => e.check(nK(u6, t)), e.guid = t => e.check(nV(uB, t)), e.uuid = t => e.check(nJ(uK, t)), e.uuidv4 = t => e.check(nM(uK, t)), e.uuidv6 = t => e.check(nW(uK, t)), e.uuidv7 = t => e.check(nB(uK, t)), e.nanoid = t => e.check(nX(u2, t)), e.guid = t => e.check(nV(uB, t)), e.cuid = t => e.check(nq(u3, t)), e.cuid2 = t => e.check(nH(u5, t)), e.ulid = t => e.check(nY(se, t)), e.base64 = t => e.check(n3(sg, t)), e.base64url = t => e.check(n7(s$, t)), e.xid = t => e.check(nQ(si, t)), e.ksuid = t => e.check(n0(sn, t)), e.ipv4 = t => e.check(n4(so, t)), e.ipv6 = t => e.check(n6(sd, t)), e.cidrv4 = t => e.check(n2(sm, t)), e.cidrv6 = t => e.check(n9(sp, t)), e.e164 = t => e.check(n5(s_, t)), e.datetime = t => e.check(uv(t)), e.date = t => e.check(uh(t)), e.time = t => e.check(uy(t)), e.duration = t => e.check(ub(t))
        });

    function uV(e) {
        return nL(uR, e)
    }
    let uJ = eS("ZodStringFormat", (e, t) => {
            i6.init(e, t), uF.init(e, t)
        }),
        uM = eS("ZodEmail", (e, t) => {
            i9.init(e, t), uJ.init(e, t)
        });

    function uW(e) {
        return nR(uM, e)
    }
    let uB = eS("ZodGUID", (e, t) => {
        i1.init(e, t), uJ.init(e, t)
    });

    function uG(e) {
        return nV(uB, e)
    }
    let uK = eS("ZodUUID", (e, t) => {
        i2.init(e, t), uJ.init(e, t)
    });

    function uX(e) {
        return nJ(uK, e)
    }

    function uq(e) {
        return nM(uK, e)
    }

    function uH(e) {
        return nW(uK, e)
    }

    function uY(e) {
        return nB(uK, e)
    }
    let uQ = eS("ZodURL", (e, t) => {
        i3.init(e, t), uJ.init(e, t)
    });

    function u0(e) {
        return nG(uQ, e)
    }

    function u4(e) {
        return nG(uQ, {
            protocol: um.httpProtocol,
            hostname: um.domain,
            ...uf.normalizeParams(e)
        })
    }
    let u6 = eS("ZodEmoji", (e, t) => {
        i7.init(e, t), uJ.init(e, t)
    });

    function u1(e) {
        return nK(u6, e)
    }
    let u2 = eS("ZodNanoID", (e, t) => {
        i5.init(e, t), uJ.init(e, t)
    });

    function u9(e) {
        return nX(u2, e)
    }
    let u3 = eS("ZodCUID", (e, t) => {
        i8.init(e, t), uJ.init(e, t)
    });

    function u7(e) {
        return nq(u3, e)
    }
    let u5 = eS("ZodCUID2", (e, t) => {
        re.init(e, t), uJ.init(e, t)
    });

    function u8(e) {
        return nH(u5, e)
    }
    let se = eS("ZodULID", (e, t) => {
        rt.init(e, t), uJ.init(e, t)
    });

    function st(e) {
        return nY(se, e)
    }
    let si = eS("ZodXID", (e, t) => {
        ri.init(e, t), uJ.init(e, t)
    });

    function sr(e) {
        return nQ(si, e)
    }
    let sn = eS("ZodKSUID", (e, t) => {
        rr.init(e, t), uJ.init(e, t)
    });

    function sa(e) {
        return n0(sn, e)
    }
    let so = eS("ZodIPv4", (e, t) => {
        rs.init(e, t), uJ.init(e, t)
    });

    function su(e) {
        return n4(so, e)
    }
    let ss = eS("ZodMAC", (e, t) => {
        rd.init(e, t), uJ.init(e, t)
    });

    function sl(e) {
        return n1(ss, e)
    }
    let sd = eS("ZodIPv6", (e, t) => {
        rl.init(e, t), uJ.init(e, t)
    });

    function sc(e) {
        return n6(sd, e)
    }
    let sm = eS("ZodCIDRv4", (e, t) => {
        rc.init(e, t), uJ.init(e, t)
    });

    function sf(e) {
        return n2(sm, e)
    }
    let sp = eS("ZodCIDRv6", (e, t) => {
        rm.init(e, t), uJ.init(e, t)
    });

    function sv(e) {
        return n9(sp, e)
    }
    let sg = eS("ZodBase64", (e, t) => {
        rp.init(e, t), uJ.init(e, t)
    });

    function sh(e) {
        return n3(sg, e)
    }
    let s$ = eS("ZodBase64URL", (e, t) => {
        rg.init(e, t), uJ.init(e, t)
    });

    function sy(e) {
        return n7(s$, e)
    }
    let s_ = eS("ZodE164", (e, t) => {
        rh.init(e, t), uJ.init(e, t)
    });

    function sb(e) {
        return n5(s_, e)
    }
    let sx = eS("ZodJWT", (e, t) => {
        ry.init(e, t), uJ.init(e, t)
    });

    function sk(e) {
        return n8(sx, e)
    }
    let sI = eS("ZodCustomStringFormat", (e, t) => {
        r_.init(e, t), uJ.init(e, t)
    });

    function sS(e, t, i = {}) {
        return oS(sI, e, t, i)
    }

    function sw(e) {
        return oS(sI, "hostname", um.hostname, e)
    }

    function sz(e) {
        return oS(sI, "hex", um.hex, e)
    }

    function sZ(e, t) {
        let i = t ? .enc ? ? "hex",
            r = `${e}_${i}`,
            n = um[r];
        if (!n) throw Error(`Unrecognized hash format: ${r}`);
        return oS(sI, r, n, t)
    }
    let sU = eS("ZodNumber", (e, t) => {
        rb.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oP(e, t, i, r), uC(e, "ZodNumber", {
            gt(e, t) {
                return this.check(aO(e, t))
            },
            gte(e, t) {
                return this.check(aD(e, t))
            },
            min(e, t) {
                return this.check(aD(e, t))
            },
            lt(e, t) {
                return this.check(aZ(e, t))
            },
            lte(e, t) {
                return this.check(aU(e, t))
            },
            max(e, t) {
                return this.check(aU(e, t))
            },
            int(e) {
                return this.check(sj(e))
            },
            safe(e) {
                return this.check(sj(e))
            },
            positive(e) {
                return this.check(aO(0, e))
            },
            nonnegative(e) {
                return this.check(aD(0, e))
            },
            negative(e) {
                return this.check(aZ(0, e))
            },
            nonpositive(e) {
                return this.check(aU(0, e))
            },
            multipleOf(e, t) {
                return this.check(aA(e, t))
            },
            step(e, t) {
                return this.check(aA(e, t))
            },
            finite() {
                return this
            }
        });
        let i = e._zod.bag;
        e.minValue = Math.max(i.minimum ? ? -1 / 0, i.exclusiveMinimum ? ? -1 / 0) ? ? null, e.maxValue = Math.min(i.maximum ? ? 1 / 0, i.exclusiveMaximum ? ? 1 / 0) ? ? null, e.isInt = (i.format ? ? "").includes("int") || Number.isSafeInteger(i.multipleOf ? ? .5), e.isFinite = !0, e.format = i.format ? ? null
    });

    function sO(e) {
        return aa(sU, e)
    }
    let sD = eS("ZodNumberFormat", (e, t) => {
        rx.init(e, t), sU.init(e, t)
    });

    function sj(e) {
        return au(sD, e)
    }

    function sN(e) {
        return as(sD, e)
    }

    function sP(e) {
        return al(sD, e)
    }

    function sE(e) {
        return ad(sD, e)
    }

    function sA(e) {
        return ac(sD, e)
    }
    let sT = eS("ZodBoolean", (e, t) => {
        rk.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oE(e, t, i, r)
    });

    function sC(e) {
        return am(sT, e)
    }
    let sL = eS("ZodBigInt", (e, t) => {
        rI.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oA(e, t, i, r), e.gte = (t, i) => e.check(aD(t, i)), e.min = (t, i) => e.check(aD(t, i)), e.gt = (t, i) => e.check(aO(t, i)), e.gte = (t, i) => e.check(aD(t, i)), e.min = (t, i) => e.check(aD(t, i)), e.lt = (t, i) => e.check(aZ(t, i)), e.lte = (t, i) => e.check(aU(t, i)), e.max = (t, i) => e.check(aU(t, i)), e.positive = t => e.check(aO(BigInt(0), t)), e.negative = t => e.check(aZ(BigInt(0), t)), e.nonpositive = t => e.check(aU(BigInt(0), t)), e.nonnegative = t => e.check(aD(BigInt(0), t)), e.multipleOf = (t, i) => e.check(aA(t, i));
        let i = e._zod.bag;
        e.minValue = i.minimum ? ? null, e.maxValue = i.maximum ? ? null, e.format = i.format ? ? null
    });

    function sF(e) {
        return ap(sL, e)
    }
    let sR = eS("ZodBigIntFormat", (e, t) => {
        rS.init(e, t), sL.init(e, t)
    });

    function sV(e) {
        return ag(sR, e)
    }

    function sJ(e) {
        return ah(sR, e)
    }
    let sM = eS("ZodSymbol", (e, t) => {
        rw.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oT(e, t, i, r)
    });

    function sW(e) {
        return a$(sM, e)
    }
    let sB = eS("ZodUndefined", (e, t) => {
        rz.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oL(e, t, i, r)
    });

    function sG(e) {
        return ay(sB, e)
    }
    let sK = eS("ZodNull", (e, t) => {
        rZ.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oC(e, t, i, r)
    });

    function sX(e) {
        return a_(sK, e)
    }
    let sq = eS("ZodAny", (e, t) => {
        rU.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oV(e, t, i, r)
    });

    function sH() {
        return ab(sq)
    }
    let sY = eS("ZodUnknown", (e, t) => {
        rO.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oJ(e, t, i, r)
    });

    function sQ() {
        return ax(sY)
    }
    let s0 = eS("ZodNever", (e, t) => {
        rD.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oR(e, t, i, r)
    });

    function s4(e) {
        return ak(s0, e)
    }
    let s6 = eS("ZodVoid", (e, t) => {
        rj.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oF(e, t, i, r)
    });

    function s1(e) {
        return aI(s6, e)
    }
    let s2 = eS("ZodDate", (e, t) => {
        rN.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oM(e, t, i, r), e.min = (t, i) => e.check(aD(t, i)), e.max = (t, i) => e.check(aU(t, i));
        let i = e._zod.bag;
        e.minDate = i.minimum ? new Date(i.minimum) : null, e.maxDate = i.maximum ? new Date(i.maximum) : null
    });

    function s9(e) {
        return aS(s2, e)
    }
    let s3 = eS("ZodArray", (e, t) => {
        rE.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o6(e, t, i, r), e.element = t.element, uC(e, "ZodArray", {
            min(e, t) {
                return this.check(aR(e, t))
            },
            nonempty(e) {
                return this.check(aR(1, e))
            },
            max(e, t) {
                return this.check(aF(e, t))
            },
            length(e, t) {
                return this.check(aV(e, t))
            },
            unwrap() {
                return this.element
            }
        })
    });

    function s7(e, t) {
        return a1(s3, e, t)
    }

    function s5(e) {
        return lx(Object.keys(e._zod.def.shape))
    }
    let s8 = eS("ZodObject", (e, t) => {
        rF.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o1(e, t, i, r), uf.defineLazy(e, "shape", () => t.shape), uC(e, "ZodObject", {
            keyof() {
                return lx(Object.keys(this._zod.def.shape))
            },
            catchall(e) {
                return this.clone({ ...this._zod.def,
                    catchall: e
                })
            },
            passthrough() {
                return this.clone({ ...this._zod.def,
                    catchall: sQ()
                })
            },
            loose() {
                return this.clone({ ...this._zod.def,
                    catchall: sQ()
                })
            },
            strict() {
                return this.clone({ ...this._zod.def,
                    catchall: s4()
                })
            },
            strip() {
                return this.clone({ ...this._zod.def,
                    catchall: void 0
                })
            },
            extend(e) {
                return uf.extend(this, e)
            },
            safeExtend(e) {
                return uf.safeExtend(this, e)
            },
            merge(e) {
                return uf.merge(this, e)
            },
            pick(e) {
                return uf.pick(this, e)
            },
            omit(e) {
                return uf.omit(this, e)
            },
            partial(...e) {
                return uf.partial(lO, this, e[0])
            },
            required(...e) {
                return uf.required(lR, this, e[0])
            }
        })
    });

    function le(e, t) {
        return new s8({
            type: "object",
            shape: e ? ? {},
            ...uf.normalizeParams(t)
        })
    }

    function lt(e, t) {
        return new s8({
            type: "object",
            shape: e,
            catchall: s4(),
            ...uf.normalizeParams(t)
        })
    }

    function li(e, t) {
        return new s8({
            type: "object",
            shape: e,
            catchall: sQ(),
            ...uf.normalizeParams(t)
        })
    }
    let lr = eS("ZodUnion", (e, t) => {
        rV.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o2(e, t, i, r), e.options = t.options
    });

    function ln(e, t) {
        return new lr({
            type: "union",
            options: e,
            ...uf.normalizeParams(t)
        })
    }
    let la = eS("ZodXor", (e, t) => {
        lr.init(e, t), rM.init(e, t), e._zod.processJSONSchema = (t, i, r) => o2(e, t, i, r), e.options = t.options
    });

    function lo(e, t) {
        return new la({
            type: "union",
            options: e,
            inclusive: !1,
            ...uf.normalizeParams(t)
        })
    }
    let lu = eS("ZodDiscriminatedUnion", (e, t) => {
        lr.init(e, t), rW.init(e, t)
    });

    function ls(e, t, i) {
        return new lu({
            type: "union",
            options: t,
            discriminator: e,
            ...uf.normalizeParams(i)
        })
    }
    let ll = eS("ZodIntersection", (e, t) => {
        rB.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o9(e, t, i, r)
    });

    function ld(e, t) {
        return new ll({
            type: "intersection",
            left: e,
            right: t
        })
    }
    let lc = eS("ZodTuple", (e, t) => {
        rK.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o3(e, t, i, r), e.rest = t => e.clone({ ...e._zod.def,
            rest: t
        })
    });

    function lm(e, t, i) {
        let r = t instanceof i0,
            n = r ? i : t;
        return new lc({
            type: "tuple",
            items: e,
            rest: r ? t : null,
            ...uf.normalizeParams(n)
        })
    }
    let lf = eS("ZodRecord", (e, t) => {
        rY.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o7(e, t, i, r), e.keyType = t.keyType, e.valueType = t.valueType
    });

    function lp(e, t, i) {
        return new lf(t && t._zod ? {
            type: "record",
            keyType: e,
            valueType: t,
            ...uf.normalizeParams(i)
        } : {
            type: "record",
            keyType: uV(),
            valueType: e,
            ...uf.normalizeParams(t)
        })
    }

    function lv(e, t, i) {
        let r = eY(e);
        return r._zod.values = void 0, new lf({
            type: "record",
            keyType: r,
            valueType: t,
            ...uf.normalizeParams(i)
        })
    }

    function lg(e, t, i) {
        return new lf({
            type: "record",
            keyType: e,
            valueType: t,
            mode: "loose",
            ...uf.normalizeParams(i)
        })
    }
    let lh = eS("ZodMap", (e, t) => {
        rQ.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o0(e, t, i, r), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...t) => e.check(aC(...t)), e.nonempty = t => e.check(aC(1, t)), e.max = (...t) => e.check(aT(...t)), e.size = (...t) => e.check(aL(...t))
    });

    function l$(e, t, i) {
        return new lh({
            type: "map",
            keyType: e,
            valueType: t,
            ...uf.normalizeParams(i)
        })
    }
    let ly = eS("ZodSet", (e, t) => {
        r4.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o4(e, t, i, r), e.min = (...t) => e.check(aC(...t)), e.nonempty = t => e.check(aC(1, t)), e.max = (...t) => e.check(aT(...t)), e.size = (...t) => e.check(aL(...t))
    });

    function l_(e, t) {
        return new ly({
            type: "set",
            valueType: e,
            ...uf.normalizeParams(t)
        })
    }
    let lb = eS("ZodEnum", (e, t) => {
        r1.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oW(e, t, i, r), e.enum = t.entries, e.options = Object.values(t.entries);
        let i = new Set(Object.keys(t.entries));
        e.extract = (e, r) => {
            let n = {};
            for (let r of e)
                if (i.has(r)) n[r] = t.entries[r];
                else throw Error(`Key ${r} not found in enum`);
            return new lb({ ...t,
                checks: [],
                ...uf.normalizeParams(r),
                entries: n
            })
        }, e.exclude = (e, r) => {
            let n = { ...t.entries
            };
            for (let t of e)
                if (i.has(t)) delete n[t];
                else throw Error(`Key ${t} not found in enum`);
            return new lb({ ...t,
                checks: [],
                ...uf.normalizeParams(r),
                entries: n
            })
        }
    });

    function lx(e, t) {
        return new lb({
            type: "enum",
            entries: Array.isArray(e) ? Object.fromEntries(e.map(e => [e, e])) : e,
            ...uf.normalizeParams(t)
        })
    }

    function lk(e, t) {
        return new lb({
            type: "enum",
            entries: e,
            ...uf.normalizeParams(t)
        })
    }
    let lI = eS("ZodLiteral", (e, t) => {
        r2.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oB(e, t, i, r), e.values = new Set(t.values), Object.defineProperty(e, "value", {
            get() {
                if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
                return t.values[0]
            }
        })
    });

    function lS(e, t) {
        return new lI({
            type: "literal",
            values: Array.isArray(e) ? e : [e],
            ...uf.normalizeParams(t)
        })
    }
    let lw = eS("ZodFile", (e, t) => {
        r9.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oX(e, t, i, r), e.min = (t, i) => e.check(aC(t, i)), e.max = (t, i) => e.check(aT(t, i)), e.mime = (t, i) => e.check(aq(Array.isArray(t) ? t : [t], i))
    });

    function lz(e) {
        return oa(lw, e)
    }
    let lZ = eS("ZodTransform", (e, t) => {
        r3.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oQ(e, t, i, r), e._zod.parse = (i, r) => {
            if ("backward" === r.direction) throw new eZ(e.constructor.name);
            i.addIssue = r => {
                "string" == typeof r ? i.issues.push(uf.issue(r, i.value, t)) : (r.fatal && (r.continue = !1), r.code ? ? (r.code = "custom"), r.input ? ? (r.input = i.value), r.inst ? ? (r.inst = e), i.issues.push(uf.issue(r)))
            };
            let n = t.transform(i.value, i);
            return n instanceof Promise ? n.then(e => (i.value = e, i.fallback = !0, i)) : (i.value = n, i.fallback = !0, i)
        }
    });

    function lU(e) {
        return new lZ({
            type: "transform",
            transform: e
        })
    }
    let lO = eS("ZodOptional", (e, t) => {
        r5.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => uo(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lD(e) {
        return new lO({
            type: "optional",
            innerType: e
        })
    }
    let lj = eS("ZodExactOptional", (e, t) => {
        r8.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => uo(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lN(e) {
        return new lj({
            type: "optional",
            innerType: e
        })
    }
    let lP = eS("ZodNullable", (e, t) => {
        ne.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o5(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lE(e) {
        return new lP({
            type: "nullable",
            innerType: e
        })
    }

    function lA(e) {
        return lD(lE(e))
    }
    let lT = eS("ZodDefault", (e, t) => {
        nt.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => ue(e, t, i, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap
    });

    function lC(e, t) {
        return new lT({
            type: "default",
            innerType: e,
            get defaultValue() {
                return "function" == typeof t ? t() : uf.shallowClone(t)
            }
        })
    }
    let lL = eS("ZodPrefault", (e, t) => {
        nr.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => ut(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lF(e, t) {
        return new lL({
            type: "prefault",
            innerType: e,
            get defaultValue() {
                return "function" == typeof t ? t() : uf.shallowClone(t)
            }
        })
    }
    let lR = eS("ZodNonOptional", (e, t) => {
        nn.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => o8(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lV(e, t) {
        return new lR({
            type: "nonoptional",
            innerType: e,
            ...uf.normalizeParams(t)
        })
    }
    let lJ = eS("ZodSuccess", (e, t) => {
        no.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oq(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function lM(e) {
        return new lJ({
            type: "success",
            innerType: e
        })
    }
    let lW = eS("ZodCatch", (e, t) => {
        nu.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => ui(e, t, i, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap
    });

    function lB(e, t) {
        return new lW({
            type: "catch",
            innerType: e,
            catchValue: "function" == typeof t ? t : () => t
        })
    }
    let lG = eS("ZodNaN", (e, t) => {
        ns.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oG(e, t, i, r)
    });

    function lK(e) {
        return az(lG, e)
    }
    let lX = eS("ZodPipe", (e, t) => {
        nl.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => ur(e, t, i, r), e.in = t.in, e.out = t.out
    });

    function lq(e, t) {
        return new lX({
            type: "pipe",
            in: e,
            out: t
        })
    }
    let lH = eS("ZodCodec", (e, t) => {
        lX.init(e, t), nc.init(e, t)
    });

    function lY(e, t, i) {
        return new lH({
            type: "pipe",
            in: e,
            out: t,
            transform: i.decode,
            reverseTransform: i.encode
        })
    }

    function lQ(e) {
        let t = e._zod.def;
        return new lH({
            type: "pipe",
            in: t.out,
            out: t.in,
            transform: t.reverseTransform,
            reverseTransform: t.transform
        })
    }
    let l0 = eS("ZodPreprocess", (e, t) => {
            lX.init(e, t), np.init(e, t)
        }),
        l4 = eS("ZodReadonly", (e, t) => {
            nv.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => un(e, t, i, r), e.unwrap = () => e._zod.def.innerType
        });

    function l6(e) {
        return new l4({
            type: "readonly",
            innerType: e
        })
    }
    let l1 = eS("ZodTemplateLiteral", (e, t) => {
        nh.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oK(e, t, i, r)
    });

    function l2(e, t) {
        return new l1({
            type: "template_literal",
            parts: e,
            ...uf.normalizeParams(t)
        })
    }
    let l9 = eS("ZodLazy", (e, t) => {
        n_.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => uu(e, t, i, r), e.unwrap = () => e._zod.def.getter()
    });

    function l3(e) {
        return new l9({
            type: "lazy",
            getter: e
        })
    }
    let l7 = eS("ZodPromise", (e, t) => {
        ny.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => ua(e, t, i, r), e.unwrap = () => e._zod.def.innerType
    });

    function l5(e) {
        return new l7({
            type: "promise",
            innerType: e
        })
    }
    let l8 = eS("ZodFunction", (e, t) => {
        n$.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oY(e, t, i, r)
    });

    function de(e) {
        return new l8({
            type: "function",
            input: Array.isArray(e ? .input) ? lm(e ? .input) : e ? .input ? ? s7(sQ()),
            output: e ? .output ? ? sQ()
        })
    }
    let dt = eS("ZodCustom", (e, t) => {
        nb.init(e, t), uL.init(e, t), e._zod.processJSONSchema = (t, i, r) => oH(e, t, i, r)
    });

    function di(e) {
        let t = new iZ({
            check: "custom"
        });
        return t._zod.check = e, t
    }

    function dr(e, t) {
        return o$(dt, e ? ? (() => !0), t)
    }

    function dn(e, t = {}) {
        return oy(dt, e, t)
    }

    function da(e, t) {
        return o_(e, t)
    }
    let du = ox,
        ds = ok;

    function dl(e, t = {}) {
        let i = new dt({
            type: "custom",
            check: "custom",
            fn: t => t instanceof e,
            abort: !0,
            ...uf.normalizeParams(t)
        });
        return i._zod.bag.Class = e, i._zod.check = t => {
            t.value instanceof e || t.issues.push({
                code: "invalid_type",
                expected: e.name,
                input: t.value,
                inst: i,
                path: [...i._zod.def.path ? ? []]
            })
        }, i
    }
    let dd = (...e) => oI({
        Codec: lH,
        Boolean: sT,
        String: uR
    }, ...e);

    function dc(e) {
        let t = l3(() => ln([uV(e), sO(), sC(), sX(), s7(t), lp(uV(), t)]));
        return t
    }

    function dm(e, t) {
        return new l0({
            type: "pipe",
            in: lU(e),
            out: t
        })
    }
    var df = e.i(62201);
    e.s([], 42332), e.i(42332), e.s(["endsWith", 0, aK, "gt", 0, aO, "gte", 0, aD, "includes", 0, aB, "length", 0, aV, "lowercase", 0, aM, "lt", 0, aZ, "lte", 0, aU, "maxLength", 0, aF, "maxSize", 0, aT, "mime", 0, aq, "minLength", 0, aR, "minSize", 0, aC, "multipleOf", 0, aA, "negative", 0, aN, "nonnegative", 0, aE, "nonpositive", 0, aP, "normalize", 0, aY, "overwrite", 0, aH, "positive", 0, aj, "property", 0, aX, "regex", 0, aJ, "size", 0, aL, "slugify", 0, a6, "startsWith", 0, aG, "toLowerCase", 0, a0, "toUpperCase", 0, a4, "trim", 0, aQ, "uppercase", 0, aW], 30421);
    var dp = e.i(30421);
    e.i(89282), e.i(364);
    let dv = {
        invalid_type: "invalid_type",
        too_big: "too_big",
        too_small: "too_small",
        invalid_format: "invalid_format",
        not_multiple_of: "not_multiple_of",
        unrecognized_keys: "unrecognized_keys",
        invalid_union: "invalid_union",
        invalid_key: "invalid_key",
        invalid_element: "invalid_element",
        invalid_value: "invalid_value",
        custom: "custom"
    };

    function dg(e) {
        eO({
            customError: e
        })
    }

    function dh() {
        return eO().customError
    }
    r || (r = {}), e.s(["ZodFirstPartyTypeKind", 0, r, "ZodIssueCode", 0, dv, "getErrorMap", 0, dh, "setErrorMap", 0, dg], 6034), e.i(6034), e.s(["$brand", 0, ew, "ZodFirstPartyTypeKind", 0, r, "ZodIssueCode", 0, dv, "config", 0, eO, "getErrorMap", 0, dh, "setErrorMap", 0, dg], 58829), e.i(58829);
    var um = nI,
        uf = nk,
        d$ = e.i(49732);
    let dy = { ...df,
            ...dp,
            iso: d$
        },
        d_ = new Set(["$schema", "$ref", "$defs", "definitions", "$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor", "type", "enum", "const", "anyOf", "oneOf", "allOf", "not", "properties", "required", "additionalProperties", "patternProperties", "propertyNames", "minProperties", "maxProperties", "items", "prefixItems", "additionalItems", "minItems", "maxItems", "uniqueItems", "contains", "minContains", "maxContains", "minLength", "maxLength", "pattern", "format", "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum", "multipleOf", "description", "default", "contentEncoding", "contentMediaType", "contentSchema", "unevaluatedItems", "unevaluatedProperties", "if", "then", "else", "dependentSchemas", "dependentRequired", "nullable", "readOnly"]);
    e.s(["bigint", 0, function(e) {
        return av(sL, e)
    }, "boolean", 0, function(e) {
        return af(sT, e)
    }, "date", 0, function(e) {
        return aw(s2, e)
    }, "number", 0, function(e) {
        return ao(sU, e)
    }, "string", 0, function(e) {
        return nF(uR, e)
    }], 13657);
    var db = e.i(13657);
    e.s(["$brand", 0, ew, "$input", 0, nE, "$output", 0, nP, "NEVER", 0, eI, "TimePrecision", 0, ae, "ZodAny", 0, sq, "ZodArray", 0, s3, "ZodBase64", 0, sg, "ZodBase64URL", 0, s$, "ZodBigInt", 0, sL, "ZodBigIntFormat", 0, sR, "ZodBoolean", 0, sT, "ZodCIDRv4", 0, sm, "ZodCIDRv6", 0, sp, "ZodCUID", 0, u3, "ZodCUID2", 0, u5, "ZodCatch", 0, lW, "ZodCodec", 0, lH, "ZodCustom", 0, dt, "ZodCustomStringFormat", 0, sI, "ZodDate", 0, s2, "ZodDefault", 0, lT, "ZodDiscriminatedUnion", 0, lu, "ZodE164", 0, s_, "ZodEmail", 0, uM, "ZodEmoji", 0, u6, "ZodEnum", 0, lb, "ZodError", 0, uk, "ZodExactOptional", 0, lj, "ZodFile", 0, lw, "ZodFirstPartyTypeKind", 0, r, "ZodFunction", 0, l8, "ZodGUID", 0, uB, "ZodIPv4", 0, so, "ZodIPv6", 0, sd, "ZodISODate", 0, ug, "ZodISODateTime", 0, up, "ZodISODuration", 0, u_, "ZodISOTime", 0, u$, "ZodIntersection", 0, ll, "ZodIssueCode", 0, dv, "ZodJWT", 0, sx, "ZodKSUID", 0, sn, "ZodLazy", 0, l9, "ZodLiteral", 0, lI, "ZodMAC", 0, ss, "ZodMap", 0, lh, "ZodNaN", 0, lG, "ZodNanoID", 0, u2, "ZodNever", 0, s0, "ZodNonOptional", 0, lR, "ZodNull", 0, sK, "ZodNullable", 0, lP, "ZodNumber", 0, sU, "ZodNumberFormat", 0, sD, "ZodObject", 0, s8, "ZodOptional", 0, lO, "ZodPipe", 0, lX, "ZodPrefault", 0, lL, "ZodPreprocess", 0, l0, "ZodPromise", 0, l7, "ZodReadonly", 0, l4, "ZodRealError", 0, uI, "ZodRecord", 0, lf, "ZodSet", 0, ly, "ZodString", 0, uR, "ZodStringFormat", 0, uJ, "ZodSuccess", 0, lJ, "ZodSymbol", 0, sM, "ZodTemplateLiteral", 0, l1, "ZodTransform", 0, lZ, "ZodTuple", 0, lc, "ZodType", 0, uL, "ZodULID", 0, se, "ZodURL", 0, uQ, "ZodUUID", 0, uK, "ZodUndefined", 0, sB, "ZodUnion", 0, lr, "ZodUnknown", 0, sY, "ZodVoid", 0, s6, "ZodXID", 0, si, "ZodXor", 0, la, "_ZodString", 0, uF, "_default", 0, lC, "_function", 0, de, "any", 0, sH, "array", 0, s7, "base64", 0, sh, "base64url", 0, sy, "bigint", 0, sF, "boolean", 0, sC, "catch", 0, lB, "check", 0, di, "cidrv4", 0, sf, "cidrv6", 0, sv, "clone", 0, eY, "codec", 0, lY, "coerce", 0, db, "config", 0, eO, "core", 0, uc, "cuid", 0, u7, "cuid2", 0, u8, "custom", 0, dr, "date", 0, s9, "decode", 0, uO, "decodeAsync", 0, uj, "describe", 0, du, "discriminatedUnion", 0, ls, "e164", 0, sb, "email", 0, uW, "emoji", 0, u1, "encode", 0, uU, "encodeAsync", 0, uD, "endsWith", 0, aK, "enum", 0, lx, "exactOptional", 0, lN, "file", 0, lz, "flattenError", 0, ts, "float32", 0, sN, "float64", 0, sP, "formatError", 0, tl, "fromJSONSchema", 0, function(e, t) {
        var i, r;
        let n, a;
        if ("boolean" == typeof e) return e ? dy.any() : dy.never();
        try {
            n = JSON.parse(JSON.stringify(e))
        } catch {
            throw Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas")
        }
        let o = {
            version: (i = n, r = t ? .defaultTarget, "https://json-schema.org/draft/2020-12/schema" === (a = i.$schema) ? "draft-2020-12" : "http://json-schema.org/draft-07/schema#" === a ? "draft-7" : "http://json-schema.org/draft-04/schema#" === a ? "draft-4" : r ? ? "draft-2020-12"),
            defs: n.$defs || n.definitions || {},
            refs: new Map,
            processing: new Set,
            rootSchema: n,
            registry: t ? .registry ? ? nC
        };
        return function e(t, i) {
            if ("boolean" == typeof t) return t ? dy.any() : dy.never();
            let r = function t(i, r) {
                    let n;
                    if (void 0 !== i.not) {
                        if ("object" == typeof i.not && 0 === Object.keys(i.not).length) return dy.never();
                        throw Error("not is not supported in Zod (except { not: {} } for never)")
                    }
                    if (void 0 !== i.unevaluatedItems) throw Error("unevaluatedItems is not supported");
                    if (void 0 !== i.unevaluatedProperties) throw Error("unevaluatedProperties is not supported");
                    if (void 0 !== i.if || void 0 !== i.then || void 0 !== i.else) throw Error("Conditional schemas (if/then/else) are not supported");
                    if (void 0 !== i.dependentSchemas || void 0 !== i.dependentRequired) throw Error("dependentSchemas and dependentRequired are not supported");
                    if (i.$ref) {
                        let t = i.$ref;
                        if (r.refs.has(t)) return r.refs.get(t);
                        if (r.processing.has(t)) return dy.lazy(() => {
                            if (!r.refs.has(t)) throw Error(`Circular reference not resolved: ${t}`);
                            return r.refs.get(t)
                        });
                        r.processing.add(t);
                        let n = e(function(e, t) {
                            if (!e.startsWith("#")) throw Error("External $ref is not supported, only local refs (#/...) are allowed");
                            let i = e.slice(1).split("/").filter(Boolean);
                            if (0 === i.length) return t.rootSchema;
                            let r = "draft-2020-12" === t.version ? "$defs" : "definitions";
                            if (i[0] === r) {
                                let r = i[1];
                                if (!r || !t.defs[r]) throw Error(`Reference not found: ${e}`);
                                return t.defs[r]
                            }
                            throw Error(`Reference not found: ${e}`)
                        }(t, r), r);
                        return r.refs.set(t, n), r.processing.delete(t), n
                    }
                    if (void 0 !== i.enum) {
                        let e = i.enum;
                        if ("openapi-3.0" === r.version && !0 === i.nullable && 1 === e.length && null === e[0]) return dy.null();
                        if (0 === e.length) return dy.never();
                        if (1 === e.length) return dy.literal(e[0]);
                        if (e.every(e => "string" == typeof e)) return dy.enum(e);
                        let t = e.map(e => dy.literal(e));
                        return t.length < 2 ? t[0] : dy.union([t[0], t[1], ...t.slice(2)])
                    }
                    if (void 0 !== i.const) return dy.literal(i.const);
                    let a = i.type;
                    if (Array.isArray(a)) {
                        let e = a.map(e => t({ ...i,
                            type: e
                        }, r));
                        return 0 === e.length ? dy.never() : 1 === e.length ? e[0] : dy.union(e)
                    }
                    if (!a) return dy.any();
                    switch (a) {
                        case "string":
                            {
                                let e = dy.string();
                                if (i.format) {
                                    let t = i.format;
                                    "email" === t ? e = e.check(dy.email()) : "uri" === t || "uri-reference" === t ? e = e.check(dy.url()) : "uuid" === t || "guid" === t ? e = e.check(dy.uuid()) : "date-time" === t ? e = e.check(dy.iso.datetime()) : "date" === t ? e = e.check(dy.iso.date()) : "time" === t ? e = e.check(dy.iso.time()) : "duration" === t ? e = e.check(dy.iso.duration()) : "ipv4" === t ? e = e.check(dy.ipv4()) : "ipv6" === t ? e = e.check(dy.ipv6()) : "mac" === t ? e = e.check(dy.mac()) : "cidr" === t ? e = e.check(dy.cidrv4()) : "cidr-v6" === t ? e = e.check(dy.cidrv6()) : "base64" === t ? e = e.check(dy.base64()) : "base64url" === t ? e = e.check(dy.base64url()) : "e164" === t ? e = e.check(dy.e164()) : "jwt" === t ? e = e.check(dy.jwt()) : "emoji" === t ? e = e.check(dy.emoji()) : "nanoid" === t ? e = e.check(dy.nanoid()) : "cuid" === t ? e = e.check(dy.cuid()) : "cuid2" === t ? e = e.check(dy.cuid2()) : "ulid" === t ? e = e.check(dy.ulid()) : "xid" === t ? e = e.check(dy.xid()) : "ksuid" === t && (e = e.check(dy.ksuid()))
                                }
                                "number" == typeof i.minLength && (e = e.min(i.minLength)),
                                "number" == typeof i.maxLength && (e = e.max(i.maxLength)),
                                i.pattern && (e = e.regex(new RegExp(i.pattern))),
                                n = e;
                                break
                            }
                        case "number":
                        case "integer":
                            {
                                let e = "integer" === a ? dy.number().int() : dy.number();
                                "number" == typeof i.minimum && (e = e.min(i.minimum)),
                                "number" == typeof i.maximum && (e = e.max(i.maximum)),
                                "number" == typeof i.exclusiveMinimum ? e = e.gt(i.exclusiveMinimum) : !0 === i.exclusiveMinimum && "number" == typeof i.minimum && (e = e.gt(i.minimum)),
                                "number" == typeof i.exclusiveMaximum ? e = e.lt(i.exclusiveMaximum) : !0 === i.exclusiveMaximum && "number" == typeof i.maximum && (e = e.lt(i.maximum)),
                                "number" == typeof i.multipleOf && (e = e.multipleOf(i.multipleOf)),
                                n = e;
                                break
                            }
                        case "boolean":
                            n = dy.boolean();
                            break;
                        case "null":
                            n = dy.null();
                            break;
                        case "object":
                            {
                                let t = {},
                                    a = i.properties || {},
                                    o = new Set(i.required || []);
                                for (let [i, n] of Object.entries(a)) {
                                    let a = e(n, r);
                                    t[i] = o.has(i) ? a : a.optional()
                                }
                                if (i.propertyNames) {
                                    let a = e(i.propertyNames, r),
                                        o = i.additionalProperties && "object" == typeof i.additionalProperties ? e(i.additionalProperties, r) : dy.any();
                                    if (0 === Object.keys(t).length) {
                                        n = dy.record(a, o);
                                        break
                                    }
                                    let u = dy.object(t).passthrough(),
                                        s = dy.looseRecord(a, o);
                                    n = dy.intersection(u, s);
                                    break
                                }
                                if (i.patternProperties) {
                                    let a = i.patternProperties,
                                        o = Object.keys(a),
                                        u = [];
                                    for (let t of o) {
                                        let i = e(a[t], r),
                                            n = dy.string().regex(new RegExp(t));
                                        u.push(dy.looseRecord(n, i))
                                    }
                                    let s = [];
                                    if (Object.keys(t).length > 0 && s.push(dy.object(t).passthrough()), s.push(...u), 0 === s.length) n = dy.object({}).passthrough();
                                    else if (1 === s.length) n = s[0];
                                    else {
                                        let e = dy.intersection(s[0], s[1]);
                                        for (let t = 2; t < s.length; t++) e = dy.intersection(e, s[t]);
                                        n = e
                                    }
                                    break
                                }
                                let u = dy.object(t);n = !1 === i.additionalProperties ? u.strict() : "object" == typeof i.additionalProperties ? u.catchall(e(i.additionalProperties, r)) : u.passthrough();
                                break
                            }
                        case "array":
                            {
                                let t = i.prefixItems,
                                    a = i.items;
                                if (t && Array.isArray(t)) {
                                    let o = t.map(t => e(t, r)),
                                        u = a && "object" == typeof a && !Array.isArray(a) ? e(a, r) : void 0;
                                    n = u ? dy.tuple(o).rest(u) : dy.tuple(o), "number" == typeof i.minItems && (n = n.check(dy.minLength(i.minItems))), "number" == typeof i.maxItems && (n = n.check(dy.maxLength(i.maxItems)))
                                } else if (Array.isArray(a)) {
                                    let t = a.map(t => e(t, r)),
                                        o = i.additionalItems && "object" == typeof i.additionalItems ? e(i.additionalItems, r) : void 0;
                                    n = o ? dy.tuple(t).rest(o) : dy.tuple(t), "number" == typeof i.minItems && (n = n.check(dy.minLength(i.minItems))), "number" == typeof i.maxItems && (n = n.check(dy.maxLength(i.maxItems)))
                                } else if (void 0 !== a) {
                                    let t = e(a, r),
                                        o = dy.array(t);
                                    "number" == typeof i.minItems && (o = o.min(i.minItems)), "number" == typeof i.maxItems && (o = o.max(i.maxItems)), n = o
                                } else n = dy.array(dy.any());
                                break
                            }
                        default:
                            throw Error(`Unsupported type: ${a}`)
                    }
                    return n
                }(t, i),
                n = t.type || void 0 !== t.enum || void 0 !== t.const;
            if (t.anyOf && Array.isArray(t.anyOf)) {
                let a = t.anyOf.map(t => e(t, i)),
                    o = dy.union(a);
                r = n ? dy.intersection(r, o) : o
            }
            if (t.oneOf && Array.isArray(t.oneOf)) {
                let a = t.oneOf.map(t => e(t, i)),
                    o = dy.xor(a);
                r = n ? dy.intersection(r, o) : o
            }
            if (t.allOf && Array.isArray(t.allOf))
                if (0 === t.allOf.length) r = n ? r : dy.any();
                else {
                    let a = n ? r : e(t.allOf[0], i),
                        o = +!n;
                    for (let r = o; r < t.allOf.length; r++) a = dy.intersection(a, e(t.allOf[r], i));
                    r = a
                }!0 === t.nullable && "openapi-3.0" === i.version && (r = dy.nullable(r)), !0 === t.readOnly && (r = dy.readonly(r)), void 0 !== t.default && (r = r.default(t.default));
            let a = {};
            for (let e of ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"]) e in t && (a[e] = t[e]);
            for (let e of ["contentEncoding", "contentMediaType", "contentSchema"]) e in t && (a[e] = t[e]);
            for (let e of Object.keys(t)) d_.has(e) || (a[e] = t[e]);
            return Object.keys(a).length > 0 && i.registry.add(r, a), t.description && (r = r.describe(t.description)), r
        }(n, o)
    }, "function", 0, de, "getErrorMap", 0, dh, "globalRegistry", 0, nC, "gt", 0, aO, "gte", 0, aD, "guid", 0, uG, "hash", 0, sZ, "hex", 0, sz, "hostname", 0, sw, "httpUrl", 0, u4, "includes", 0, aB, "instanceof", 0, dl, "int", 0, sj, "int32", 0, sE, "int64", 0, sV, "intersection", 0, ld, "invertCodec", 0, lQ, "ipv4", 0, su, "ipv6", 0, sc, "iso", 0, d$, "json", 0, dc, "jwt", 0, sk, "keyof", 0, s5, "ksuid", 0, sa, "lazy", 0, l3, "length", 0, aV, "literal", 0, lS, "locales", 0, nN, "looseObject", 0, li, "looseRecord", 0, lg, "lowercase", 0, aM, "lt", 0, aZ, "lte", 0, aU, "mac", 0, sl, "map", 0, l$, "maxLength", 0, aF, "maxSize", 0, aT, "meta", 0, ds, "mime", 0, aq, "minLength", 0, aR, "minSize", 0, aC, "multipleOf", 0, aA, "nan", 0, lK, "nanoid", 0, u9, "nativeEnum", 0, lk, "negative", 0, aN, "never", 0, s4, "nonnegative", 0, aE, "nonoptional", 0, lV, "nonpositive", 0, aP, "normalize", 0, aY, "null", 0, sX, "nullable", 0, lE, "nullish", 0, lA, "number", 0, sO, "object", 0, le, "optional", 0, lD, "overwrite", 0, aH, "parse", 0, uS, "parseAsync", 0, uw, "partialRecord", 0, lv, "pipe", 0, lq, "positive", 0, aj, "prefault", 0, lF, "preprocess", 0, dm, "prettifyError", 0, tm, "promise", 0, l5, "property", 0, aX, "readonly", 0, l6, "record", 0, lp, "refine", 0, dn, "regex", 0, aJ, "regexes", () => um, "registry", 0, nT, "safeDecode", 0, uP, "safeDecodeAsync", 0, uA, "safeEncode", 0, uN, "safeEncodeAsync", 0, uE, "safeParse", 0, uz, "safeParseAsync", 0, uZ, "set", 0, l_, "setErrorMap", 0, dg, "size", 0, aL, "slugify", 0, a6, "startsWith", 0, aG, "strictObject", 0, lt, "string", 0, uV, "stringFormat", 0, sS, "stringbool", 0, dd, "success", 0, lM, "superRefine", 0, da, "symbol", 0, sW, "templateLiteral", 0, l2, "toJSONSchema", 0, ul, "toLowerCase", 0, a0, "toUpperCase", 0, a4, "transform", 0, lU, "treeifyError", 0, td, "trim", 0, aQ, "tuple", 0, lm, "uint32", 0, sA, "uint64", 0, sJ, "ulid", 0, st, "undefined", 0, sG, "union", 0, ln, "unknown", 0, sQ, "uppercase", 0, aW, "url", 0, u0, "util", () => uf, "uuid", 0, uX, "uuidv4", 0, uq, "uuidv6", 0, uH, "uuidv7", 0, uY, "void", 0, s1, "xid", 0, sr, "xor", 0, lo], 96001);
    var dx = e.i(96001);
    e.s(["z", 0, dx], 81307);
    var dk = e.i(43476),
        dI = e.i(25913),
        dS = e.i(75157),
        dw = e.i(10204);
    e.i(72436);
    let dz = (0, dI.cva)("group/field flex w-full gap-3 data-[invalid=true]:text-destructive", {
        variants: {
            orientation: {
                vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
                horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
                responsive: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
            }
        },
        defaultVariants: {
            orientation: "vertical"
        }
    });
    e.s(["Field", 0, function({
        className: e,
        orientation: t = "vertical",
        ...i
    }) {
        return (0, dk.jsx)("div", {
            role: "group",
            "data-slot": "field",
            "data-orientation": t,
            className: (0, dS.cn)(dz({
                orientation: t
            }), e),
            ...i
        })
    }, "FieldError", 0, function({
        className: e,
        children: t,
        errors: i,
        ...r
    }) {
        let a = (0, n.useMemo)(() => {
            if (t) return t;
            if (!i ? .length) return null;
            let e = [...new Map(i.map(e => [e ? .message, e])).values()];
            return e ? .length == 1 ? e[0] ? .message : (0, dk.jsx)("ul", {
                className: "ml-4 flex list-disc flex-col gap-1",
                children: e.map((e, t) => e ? .message && (0, dk.jsx)("li", {
                    children: e.message
                }, t))
            })
        }, [t, i]);
        return a ? (0, dk.jsx)("div", {
            role: "alert",
            "data-slot": "field-error",
            className: (0, dS.cn)("text-sm font-normal text-destructive", e),
            ...r,
            children: a
        }) : null
    }, "FieldLabel", 0, function({
        className: e,
        ...t
    }) {
        return (0, dk.jsx)(dw.Label, {
            "data-slot": "field-label",
            className: (0, dS.cn)("group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10", "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col", e),
            ...t
        })
    }], 42450)
}]);