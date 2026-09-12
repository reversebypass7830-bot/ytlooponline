(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 27930, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        r = e.i(40886),
        n = e.i(52245);
    let o = t.forwardRef(function(e, t) {
        let {
            render: o,
            className: u,
            disabled: a = !1,
            focusableWhenDisabled: i = !1,
            nativeButton: l = !0,
            style: s,
            ...c
        } = e, {
            getButtonProps: f,
            buttonRef: p
        } = (0, r.useButton)({
            disabled: a,
            focusableWhenDisabled: i,
            native: l
        });
        return (0, n.useRenderElement)("button", e, {
            state: {
                disabled: a
            },
            ref: [t, p],
            props: [c, f]
        })
    });
    e.s(["Button", 0, o])
}, 40886, 38452, e => {
    "use strict";
    var t = e.i(15504),
        r = e.i(29315),
        n = e.i(67865),
        o = e.i(46376),
        u = e.i(76782),
        a = e.i(33332);
    let i = t.createContext(void 0);

    function l(e = !1) {
        let r = t.useContext(i);
        if (void 0 === r && !e) throw Error((0, a.default)(16));
        return r
    }

    function s(e) {
        return (0, r.isHTMLElement)(e) && "BUTTON" === e.tagName
    }
    e.s(["CompositeRootContext", 0, i, "useCompositeRootContext", 0, l], 38452), e.s(["useButton", 0, function(e = {}) {
        let {
            disabled: r = !1,
            focusableWhenDisabled: a,
            tabIndex: i = 0,
            native: c = !0,
            composite: f
        } = e, p = t.useRef(null), d = l(!0), h = f ? ? void 0 !== d, {
            props: y
        } = function(e) {
            let {
                focusableWhenDisabled: r,
                disabled: n,
                composite: o = !1,
                tabIndex: u = 0,
                isNativeButton: a
            } = e, i = o && !1 !== r, l = o && !1 === r;
            return {
                props: t.useMemo(() => {
                    let e = {
                        onKeyDown(e) {
                            n && r && "Tab" !== e.key && e.preventDefault()
                        }
                    };
                    return o || (e.tabIndex = u, !a && n && (e.tabIndex = r ? u : -1)), (a && (r || i) || !a && n) && (e["aria-disabled"] = n), a && (!r || l) && (e.disabled = n), e
                }, [o, n, r, i, l, a, u])
            }
        }({
            focusableWhenDisabled: a,
            disabled: r,
            composite: h,
            tabIndex: i,
            isNativeButton: c
        }), g = t.useCallback(() => {
            let e = p.current;
            s(e) && h && r && void 0 === y.disabled && e.disabled && (e.disabled = !1)
        }, [r, y.disabled, h]);
        return (0, o.useIsoLayoutEffect)(g, [g]), {
            getButtonProps: t.useCallback((e = {}) => {
                let {
                    onClick: t,
                    onMouseDown: n,
                    onKeyUp: o,
                    onKeyDown: a,
                    onPointerDown: i,
                    ...l
                } = e;
                return (0, u.mergeProps)({
                    onClick(e) {
                        r ? e.preventDefault() : t ? .(e)
                    },
                    onMouseDown(e) {
                        r || n ? .(e)
                    },
                    onKeyDown(e) {
                        var n;
                        if (r || ((0, u.makeEventPreventable)(e), a ? .(e), e.baseUIHandlerPrevented)) return;
                        let o = e.target === e.currentTarget,
                            i = e.currentTarget,
                            l = s(i),
                            f = !c && (n = i, !!(n ? .tagName === "A" && n ? .href)),
                            p = o && (c ? l : !f),
                            d = "Enter" === e.key,
                            y = " " === e.key,
                            g = i.getAttribute("role"),
                            b = g ? .startsWith("menuitem") || "option" === g || "gridcell" === g;
                        if (o && h && y) {
                            if (e.defaultPrevented && b) return;
                            e.preventDefault(), f || c && l ? (i.click(), e.preventBaseUIHandler()) : p && (t ? .(e), e.preventBaseUIHandler());
                            return
                        }
                        p && (!c && (y || d) && e.preventDefault(), !c && d && t ? .(e))
                    },
                    onKeyUp(e) {
                        r || (((0, u.makeEventPreventable)(e), o ? .(e), e.target === e.currentTarget && c && h && s(e.currentTarget) && " " === e.key) ? e.preventDefault() : !e.baseUIHandlerPrevented && (e.target !== e.currentTarget || c || h || " " !== e.key || t ? .(e)))
                    },
                    onPointerDown(e) {
                        r ? e.preventDefault() : i ? .(e)
                    }
                }, c ? {
                    type: "button"
                } : {
                    role: "button"
                }, y, l)
            }, [r, y, h, c]),
            buttonRef: (0, n.useStableCallback)(e => {
                p.current = e, g()
            })
        }
    }], 40886)
}, 22016, (e, t, r) => {
    "use strict";
    e.i(47167), Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = {
        default: function() {
            return b
        },
        useLinkStatus: function() {
            return v
        }
    };
    for (var o in n) Object.defineProperty(r, o, {
        enumerable: !0,
        get: n[o]
    });
    let u = e.r(90809),
        a = e.r(43476),
        i = u._(e.r(15504)),
        l = e.r(95057),
        s = e.r(8372),
        c = e.r(18581),
        f = e.r(18967),
        p = e.r(5550),
        d = e.r(88540),
        h = e.r(91949),
        y = e.r(73668),
        g = e.r(9396);

    function b(t) {
        var r;
        let n, o, u, [b, v] = (0, i.useOptimistic)(h.IDLE_LINK_STATUS),
            P = (0, i.useRef)(null),
            {
                href: E,
                as: C,
                children: T,
                prefetch: _ = null,
                passHref: O,
                replace: S,
                shallow: R,
                scroll: j,
                onClick: k,
                onMouseEnter: w,
                onTouchStart: x,
                legacyBehavior: N = !1,
                onNavigate: U,
                transitionTypes: I,
                ref: D,
                unstable_dynamicOnHover: L,
                ...A
            } = t;
        n = T, N && ("string" == typeof n || "number" == typeof n) && (n = (0, a.jsx)("a", {
            children: n
        }));
        let M = i.default.useContext(s.AppRouterContext),
            B = !1 !== _,
            $ = !1 === _ ? "none" : !0 === _ ? "full" : "auto",
            K = "none" !== $ ? "auto" === $ ? g.FetchStrategy.PPR : g.FetchStrategy.Full : g.FetchStrategy.PPR,
            F = "string" == typeof(r = C || E) ? r : (0, l.formatUrl)(r);
        if (N) {
            if (n ? .$$typeof === Symbol.for("react.lazy")) throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: !1,
                configurable: !0
            });
            o = i.default.Children.only(n)
        }
        let z = N ? o && "object" == typeof o && o.ref : D,
            H, W = i.default.useCallback(e => (null !== M && (P.current = (0, h.mountLinkInstance)(e, F, M, K, B, v, H)), () => {
                P.current && ((0, h.unmountLinkForCurrentNavigation)(P.current), P.current = null), (0, h.unmountPrefetchableInstance)(e)
            }), [B, F, M, K, v, H]),
            Q = {
                ref: (0, c.useMergedRef)(W, z),
                onClick(t) {
                    N || "function" != typeof k || k(t), N && o.props && "function" == typeof o.props.onClick && o.props.onClick(t), !M || t.defaultPrevented || function(t, r, n, o, u, a, l, s = "none") {
                        if ("u" > typeof window) {
                            let c, {
                                nodeName: f
                            } = t.currentTarget;
                            if ("A" === f.toUpperCase() && ((c = t.currentTarget.getAttribute("target")) && "_self" !== c || t.metaKey || t.ctrlKey || t.shiftKey || t.altKey || t.nativeEvent && 2 === t.nativeEvent.which) || t.currentTarget.hasAttribute("download")) return;
                            if (!(0, y.isLocalURL)(r)) {
                                o && (t.preventDefault(), location.replace(r));
                                return
                            }
                            if (t.preventDefault(), a) {
                                let e = !1;
                                if (a({
                                        preventDefault: () => {
                                            e = !0
                                        }
                                    }), e) return
                            }
                            let {
                                dispatchNavigateAction: p
                            } = e.r(99781);
                            i.default.startTransition(() => {
                                p(r, o ? "replace" : "push", !1 === u ? d.ScrollBehavior.NoScroll : d.ScrollBehavior.Default, n.current, l, s)
                            })
                        }
                    }(t, F, P, S, j, U, I, $)
                },
                onMouseEnter(e) {
                    N || "function" != typeof w || w(e), N && o.props && "function" == typeof o.props.onMouseEnter && o.props.onMouseEnter(e), M && B && (0, h.onNavigationIntent)(e.currentTarget, !0 === L)
                },
                onTouchStart: function(e) {
                    N || "function" != typeof x || x(e), N && o.props && "function" == typeof o.props.onTouchStart && o.props.onTouchStart(e), M && B && (0, h.onNavigationIntent)(e.currentTarget, !0 === L)
                }
            };
        return (0, f.isAbsoluteUrl)(F) ? Q.href = F : N && !O && ("a" !== o.type || "href" in o.props) || (Q.href = (0, p.addBasePath)(F)), u = N ? i.default.cloneElement(o, Q) : (0, a.jsx)("a", { ...A,
            ...Q,
            children: n
        }), (0, a.jsx)(m.Provider, {
            value: b,
            children: u
        })
    }
    let m = (0, i.createContext)(h.IDLE_LINK_STATUS),
        v = () => (0, i.useContext)(m);
    ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
        value: !0
    }), Object.assign(r.default, r), t.exports = r.default)
}, 18581, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "useMergedRef", {
        enumerable: !0,
        get: function() {
            return o
        }
    });
    let n = e.r(15504);

    function o(e, t) {
        let r = (0, n.useRef)(null),
            o = (0, n.useRef)(null);
        return (0, n.useCallback)(n => {
            if (null === n) {
                let e = r.current;
                e && (r.current = null, e());
                let t = o.current;
                t && (o.current = null, t())
            } else e && (r.current = u(e, n)), t && (o.current = u(t, n))
        }, [e, t])
    }

    function u(e, t) {
        if ("function" != typeof e) return e.current = t, () => {
            e.current = null
        }; {
            let r = e(t);
            return "function" == typeof r ? r : () => e(null)
        }
    }("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
        value: !0
    }), Object.assign(r.default, r), t.exports = r.default)
}, 73668, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "isLocalURL", {
        enumerable: !0,
        get: function() {
            return u
        }
    });
    let n = e.r(18967),
        o = e.r(52817);

    function u(e) {
        if (!(0, n.isAbsoluteUrl)(e)) return !0;
        try {
            let t = (0, n.getLocationOrigin)(),
                r = new URL(e, t);
            return r.origin === t && (0, o.hasBasePath)(r.pathname)
        } catch (e) {
            return !1
        }
    }
}, 98183, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = {
        assign: function() {
            return l
        },
        searchParamsToUrlQuery: function() {
            return u
        },
        urlQueryToSearchParams: function() {
            return i
        }
    };
    for (var o in n) Object.defineProperty(r, o, {
        enumerable: !0,
        get: n[o]
    });

    function u(e) {
        let t = {};
        for (let [r, n] of e.entries()) {
            let e = t[r];
            void 0 === e ? t[r] = n : Array.isArray(e) ? e.push(n) : t[r] = [e, n]
        }
        return t
    }

    function a(e) {
        return "string" == typeof e ? e : ("number" != typeof e || isNaN(e)) && "boolean" != typeof e ? "" : String(e)
    }

    function i(e) {
        let t = new URLSearchParams;
        for (let [r, n] of Object.entries(e))
            if (Array.isArray(n))
                for (let e of n) t.append(r, a(e));
            else t.set(r, a(n));
        return t
    }

    function l(e, ...t) {
        for (let r of t) {
            for (let t of r.keys()) e.delete(t);
            for (let [t, n] of r.entries()) e.append(t, n)
        }
        return e
    }
}, 95057, (e, t, r) => {
    "use strict";
    e.i(47167), Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = {
        formatUrl: function() {
            return i
        },
        formatWithValidation: function() {
            return s
        },
        urlObjectKeys: function() {
            return l
        }
    };
    for (var o in n) Object.defineProperty(r, o, {
        enumerable: !0,
        get: n[o]
    });
    let u = e.r(90809)._(e.r(98183)),
        a = /https?|ftp|gopher|file/;

    function i(e) {
        let {
            auth: t,
            hostname: r
        } = e, n = e.protocol || "", o = e.pathname || "", i = e.hash || "", l = e.query || "", s = !1;
        t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : "", e.host ? s = t + e.host : r && (s = t + (~r.indexOf(":") ? `[${r}]` : r), e.port && (s += ":" + e.port)), l && "object" == typeof l && (l = String(u.urlQueryToSearchParams(l)));
        let c = e.search || l && `?${l}` || "";
        return n && !n.endsWith(":") && (n += ":"), e.slashes || (!n || a.test(n)) && !1 !== s ? (s = "//" + (s || ""), o && "/" !== o[0] && (o = "/" + o)) : s || (s = ""), i && "#" !== i[0] && (i = "#" + i), c && "?" !== c[0] && (c = "?" + c), o = o.replace(/[?#]/g, encodeURIComponent), c = c.replace("#", "%23"), `${n}${s}${o}${c}${i}`
    }
    let l = ["auth", "hash", "host", "hostname", "href", "path", "pathname", "port", "protocol", "query", "search", "slashes"];

    function s(e) {
        return i(e)
    }
}, 18967, (e, t, r) => {
    "use strict";
    e.i(47167), Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = {
        DecodeError: function() {
            return b
        },
        MiddlewareNotFoundError: function() {
            return E
        },
        MissingStaticPage: function() {
            return P
        },
        NormalizeError: function() {
            return m
        },
        PageNotFoundError: function() {
            return v
        },
        SP: function() {
            return y
        },
        ST: function() {
            return g
        },
        WEB_VITALS: function() {
            return u
        },
        execOnce: function() {
            return a
        },
        getDisplayName: function() {
            return f
        },
        getLocationOrigin: function() {
            return s
        },
        getURL: function() {
            return c
        },
        isAbsoluteUrl: function() {
            return l
        },
        isResSent: function() {
            return p
        },
        loadGetInitialProps: function() {
            return h
        },
        normalizeRepeatedSlashes: function() {
            return d
        },
        stringifyError: function() {
            return C
        }
    };
    for (var o in n) Object.defineProperty(r, o, {
        enumerable: !0,
        get: n[o]
    });
    let u = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"];

    function a(e) {
        let t, r = !1;
        return (...n) => (r || (r = !0, t = e(...n)), t)
    }
    let i = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/,
        l = e => {
            let t = e.charCodeAt(0);
            return !!(t >= 65 && t <= 90 || t >= 97 && t <= 122) && i.test(e)
        };

    function s() {
        let {
            protocol: e,
            hostname: t,
            port: r
        } = window.location;
        return `${e}//${t}${r?":"+r:""}`
    }

    function c() {
        let {
            href: e
        } = window.location, t = s();
        return e.substring(t.length)
    }

    function f(e) {
        return "string" == typeof e ? e : e.displayName || e.name || "Unknown"
    }

    function p(e) {
        return e.finished || e.headersSent
    }

    function d(e) {
        let t = e.split("?");
        return t[0].replace(/\\/g, "/").replace(/\/\/+/g, "/") + (t[1] ? `?${t.slice(1).join("?")}` : "")
    }
    async function h(e, t) {
        let r = t.res || t.ctx && t.ctx.res;
        if (!e.getInitialProps) return t.ctx && t.Component ? {
            pageProps: await h(t.Component, t.ctx)
        } : {};
        let n = await e.getInitialProps(t);
        if (r && p(r)) return n;
        if (!n) throw Object.defineProperty(Error(`"${f(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`), "__NEXT_ERROR_CODE", {
            value: "E1025",
            enumerable: !1,
            configurable: !0
        });
        return n
    }
    let y = "u" > typeof performance,
        g = y && ["mark", "measure", "getEntriesByName"].every(e => "function" == typeof performance[e]);
    class b extends Error {}
    class m extends Error {}
    class v extends Error {
        constructor(e) {
            super(), this.code = "ENOENT", this.name = "PageNotFoundError", this.message = `Cannot find module for page: ${e}`
        }
    }
    class P extends Error {
        constructor(e, t) {
            super(), this.message = `Failed to load static file for page: ${e} ${t}`
        }
    }
    class E extends Error {
        constructor() {
            super(), this.code = "ENOENT", this.message = "Cannot find the middleware module"
        }
    }

    function C(e) {
        return JSON.stringify({
            message: e.message,
            stack: e.stack
        })
    }
}]);