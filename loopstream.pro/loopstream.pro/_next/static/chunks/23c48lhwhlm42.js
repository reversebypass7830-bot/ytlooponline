(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 6039, e => {
    "use strict";
    var t = e.i(15504),
        i = e.i(46376),
        r = e.i(67865);
    e.s(["useValueChanged", 0, function(e, a) {
        let n = t.useRef(e),
            s = (0, r.useStableCallback)(a);
        (0, i.useIsoLayoutEffect)(() => {
            n.current !== e && s(n.current)
        }, [e, s]), (0, i.useIsoLayoutEffect)(() => {
            n.current = e
        }, [e])
    }])
}, 52225, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504),
        i = e.i(52245);
    let r = t.forwardRef(function(e, t) {
        let {
            className: r,
            render: a,
            orientation: n = "horizontal",
            style: s,
            ...l
        } = e;
        return (0, i.useRenderElement)("div", e, {
            state: {
                orientation: n
            },
            ref: t,
            props: [{
                role: "separator",
                "aria-orientation": n
            }, l]
        })
    });
    e.s(["Separator", 0, r])
}, 51437, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504);
    e.s(["useControlled", 0, function({
        controlled: e,
        default: i,
        name: r,
        state: a = "value"
    }) {
        let {
            current: n
        } = t.useRef(void 0 !== e), [s, l] = t.useState(i), o = t.useCallback(e => {
            n || l(e)
        }, []);
        return [n ? e : s, o]
    }])
}, 91476, e => {
    "use strict";
    let {
        Axios: t,
        AxiosError: i,
        CanceledError: r,
        isCancel: a,
        CancelToken: n,
        VERSION: s,
        all: l,
        Cancel: o,
        isAxiosError: c,
        spread: d,
        toFormData: u,
        AxiosHeaders: m,
        HttpStatusCode: p,
        formToJSON: f,
        getAdapter: h,
        mergeConfig: g,
        create: v
    } = e.i(81949).default;
    e.s(["isAxiosError", 0, c])
}, 93698, 43957, e => {
    "use strict";
    let t = (0, e.i(56420).default)("check", [
        ["path", {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }]
    ]);
    e.s(["default", 0, t], 43957), e.s(["CheckIcon", 0, t], 93698)
}, 72382, 80860, e => {
    "use strict";
    var t = e.i(56420);
    let i = (0, t.default)("eye", [
        ["path", {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
            key: "1nclc0"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }]
    ]);
    e.s(["Eye", 0, i], 72382);
    let r = (0, t.default)("eye-off", [
        ["path", {
            d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
            key: "ct8e1f"
        }],
        ["path", {
            d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
            key: "151rxh"
        }],
        ["path", {
            d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
            key: "13bj9a"
        }],
        ["path", {
            d: "m2 2 20 20",
            key: "1ooewy"
        }]
    ]);
    e.s(["EyeOff", 0, r], 80860)
}, 25799, e => {
    "use strict";
    let t = (0, e.i(56420).default)("mail-check", [
        ["path", {
            d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
            key: "12jkf8"
        }],
        ["path", {
            d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
            key: "1ocrg3"
        }],
        ["path", {
            d: "m16 19 2 2 4-4",
            key: "1b14m6"
        }]
    ]);
    e.s(["MailCheck", 0, t], 25799)
}, 61344, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(15504),
        r = e.i(22016),
        a = e.i(75980),
        n = e.i(91476),
        s = e.i(72382),
        l = e.i(80860),
        o = e.i(25799),
        c = e.i(53145),
        d = e.i(46696),
        u = e.i(81307),
        m = e.i(19270),
        p = e.i(97135),
        f = e.i(19455),
        h = e.i(57428),
        g = e.i(42450),
        v = e.i(93479),
        x = e.i(10204),
        y = e.i(72436),
        b = e.i(90838),
        k = e.i(50854);
    let w = u.z.object({
        email: u.z.string().trim().min(1, "Email is required").max(50).email("Enter a valid email"),
        firstName: u.z.string().trim().min(1, "First name is required").max(50),
        lastName: u.z.string().trim().min(1, "Last name is required").max(50),
        password: u.z.string().min(1, "Password is required").max(50),
        agree: u.z.literal(!0, {
            message: "You must agree to continue"
        })
    });
    e.s(["RegisterForm", 0, function() {
        let [e, u] = (0, i.useState)(!1), [j, N] = (0, i.useState)(null), {
            register: C,
            control: _,
            handleSubmit: S,
            formState: {
                errors: I,
                isSubmitting: F,
                isValid: E
            }
        } = (0, c.useForm)({
            resolver: (0, a.zodResolver)(w),
            mode: "onChange",
            defaultValues: {
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                agree: void 0
            }
        });
        async function R(e) {
            try {
                await k.default.authService.register({
                    email: e.email,
                    firstName: e.firstName,
                    lastName: e.lastName,
                    password: e.password
                }), d.toast.success("Register successful"), b.default.registerInitiate(`${e.firstName} ${e.lastName}`, e.email), N(e.email)
            } catch (t) {
                let e = (0, n.isAxiosError)(t) ? t.response ? .data ? .error ? .[0] : void 0;
                d.toast.error(e || "Registration failed. Please try again.")
            }
        }
        return j ? (0, t.jsxs)(m.AuthCard, {
            className: "flex flex-col items-center gap-4 text-center",
            children: [(0, t.jsx)("div", {
                className: "flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary",
                children: (0, t.jsx)(o.MailCheck, {
                    className: "size-8"
                })
            }), (0, t.jsx)("h1", {
                className: "text-2xl font-bold",
                children: "Verify your email address"
            }), (0, t.jsxs)("p", {
                className: "text-muted-foreground",
                children: ["A verification email has been sent to", " ", (0, t.jsx)("span", {
                    className: "font-semibold text-foreground",
                    children: j
                }), "."]
            }), (0, t.jsx)("p", {
                className: "text-muted-foreground",
                children: "Please check your inbox (and spam folder if needed) and click the verification link to activate your account."
            })]
        }) : (0, t.jsxs)(m.AuthCard, {
            children: [(0, t.jsxs)("div", {
                className: "mb-6 flex flex-col gap-1",
                children: [(0, t.jsx)("h1", {
                    className: "text-2xl font-bold",
                    children: "Adventure starts here 🚀"
                }), (0, t.jsx)("p", {
                    className: "text-muted-foreground",
                    children: "Go live without going live — schedule once, stream nonstop!"
                })]
            }), (0, t.jsxs)("form", {
                noValidate: !0,
                onSubmit: S(R),
                className: "flex flex-col gap-6",
                children: [(0, t.jsxs)(g.Field, {
                    "data-invalid": !!I.email,
                    children: [(0, t.jsx)(g.FieldLabel, {
                        htmlFor: "register-email",
                        children: "Email"
                    }), (0, t.jsx)(v.Input, {
                        id: "register-email",
                        type: "email",
                        autoFocus: !0,
                        autoComplete: "email",
                        placeholder: "Enter your email",
                        maxLength: 50,
                        "aria-invalid": !!I.email,
                        ...C("email")
                    }), (0, t.jsx)(g.FieldError, {
                        errors: I.email ? [I.email] : void 0
                    })]
                }), (0, t.jsxs)(g.Field, {
                    "data-invalid": !!I.firstName,
                    children: [(0, t.jsx)(g.FieldLabel, {
                        htmlFor: "register-first-name",
                        children: "First Name"
                    }), (0, t.jsx)(v.Input, {
                        id: "register-first-name",
                        autoComplete: "given-name",
                        placeholder: "Enter your first name",
                        maxLength: 50,
                        "aria-invalid": !!I.firstName,
                        ...C("firstName")
                    }), (0, t.jsx)(g.FieldError, {
                        errors: I.firstName ? [I.firstName] : void 0
                    })]
                }), (0, t.jsxs)(g.Field, {
                    "data-invalid": !!I.lastName,
                    children: [(0, t.jsx)(g.FieldLabel, {
                        htmlFor: "register-last-name",
                        children: "Last Name"
                    }), (0, t.jsx)(v.Input, {
                        id: "register-last-name",
                        autoComplete: "family-name",
                        placeholder: "Enter your last name",
                        maxLength: 50,
                        "aria-invalid": !!I.lastName,
                        ...C("lastName")
                    }), (0, t.jsx)(g.FieldError, {
                        errors: I.lastName ? [I.lastName] : void 0
                    })]
                }), (0, t.jsxs)(g.Field, {
                    "data-invalid": !!I.password,
                    children: [(0, t.jsx)(g.FieldLabel, {
                        htmlFor: "register-password",
                        children: "Password"
                    }), (0, t.jsxs)("div", {
                        className: "relative",
                        children: [(0, t.jsx)(v.Input, {
                            id: "register-password",
                            type: e ? "text" : "password",
                            autoComplete: "new-password",
                            placeholder: "············",
                            maxLength: 50,
                            "aria-invalid": !!I.password,
                            className: "pr-9",
                            ...C("password")
                        }), (0, t.jsx)(f.Button, {
                            type: "button",
                            variant: "ghost",
                            size: "icon",
                            onClick: () => u(e => !e),
                            className: "absolute inset-y-0 right-0 text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent",
                            "aria-label": e ? "Hide password" : "Show password",
                            children: e ? (0, t.jsx)(l.EyeOff, {
                                className: "size-4"
                            }) : (0, t.jsx)(s.Eye, {
                                className: "size-4"
                            })
                        })]
                    }), (0, t.jsx)(g.FieldError, {
                        errors: I.password ? [I.password] : void 0
                    })]
                }), (0, t.jsxs)(x.Label, {
                    className: "flex items-center gap-2 font-normal",
                    children: [(0, t.jsx)(c.Controller, {
                        control: _,
                        name: "agree",
                        render: ({
                            field: e
                        }) => (0, t.jsx)(h.Checkbox, {
                            checked: !0 === e.value,
                            onCheckedChange: t => e.onChange(!0 === t),
                            onBlur: e.onBlur
                        })
                    }), (0, t.jsxs)("span", {
                        children: ["I agree to", " ", (0, t.jsx)(r.default, {
                            href: "/privacy-policy",
                            target: "_blank",
                            className: "text-primary hover:underline",
                            children: "privacy policy"
                        }), " ", "&", " ", (0, t.jsx)(r.default, {
                            href: "/terms-of-use",
                            target: "_blank",
                            className: "text-primary hover:underline",
                            children: "terms"
                        })]
                    })]
                }), (0, t.jsx)(f.Button, {
                    type: "submit",
                    disabled: !E || F,
                    className: "w-full",
                    children: F ? "Signing up…" : "Sign Up"
                }), (0, t.jsxs)("div", {
                    className: "flex items-center gap-3",
                    children: [(0, t.jsx)(y.Separator, {
                        className: "flex-1"
                    }), (0, t.jsx)("span", {
                        className: "text-xs text-muted-foreground",
                        children: "or"
                    }), (0, t.jsx)(y.Separator, {
                        className: "flex-1"
                    })]
                }), (0, t.jsx)(p.GoogleSignInButton, {
                    disabled: F
                }), (0, t.jsxs)("div", {
                    className: "flex flex-wrap items-center justify-center gap-1.5 text-sm",
                    children: [(0, t.jsx)("span", {
                        className: "text-muted-foreground",
                        children: "Already have an account?"
                    }), (0, t.jsx)(r.default, {
                        href: "/login",
                        className: "text-primary hover:underline",
                        children: "Sign in instead"
                    })]
                })]
            })]
        })
    }])
}, 19270, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(57688),
        r = e.i(22016),
        a = e.i(15288),
        n = e.i(75157);
    e.s(["AuthCard", 0, function({
        children: e,
        className: s
    }) {
        return (0, t.jsx)("main", {
            className: "flex min-h-[100dvh] flex-col items-center justify-center p-6",
            children: (0, t.jsxs)("div", {
                className: "relative w-full max-w-[450px]",
                children: [(0, t.jsx)("div", {
                    "aria-hidden": !0,
                    className: "pointer-events-none absolute -left-6 -top-14 hidden size-[150px] rounded-2xl border border-primary/15 bg-primary/[0.08] md:block"
                }), (0, t.jsx)("div", {
                    "aria-hidden": !0,
                    className: "pointer-events-none absolute -bottom-12 -right-10 hidden size-[135px] rounded-2xl border border-dashed border-primary/15 bg-primary/[0.08] md:block"
                }), (0, t.jsxs)(a.Card, {
                    className: (0, n.cn)("relative rounded-2xl border border-border p-8 shadow-xl sm:p-12", s),
                    children: [(0, t.jsx)(r.default, {
                        href: "/",
                        className: "flex justify-center",
                        children: (0, t.jsx)(i.default, {
                            src: "/images/logo/loop-logo.webp",
                            alt: "Loop Stream",
                            width: 160,
                            height: 80,
                            priority: !0,
                            className: "h-10 w-auto"
                        })
                    }), e]
                })]
            })
        })
    }])
}, 97135, e => {
    "use strict";
    e.i(47167);
    var t = e.i(43476),
        i = e.i(15504),
        r = e.i(18566),
        a = e.i(46696),
        n = e.i(19455),
        s = e.i(90838),
        l = e.i(50854);

    function o(e) {
        return (0, t.jsxs)("svg", {
            viewBox: "0 0 24 24",
            ...e,
            children: [(0, t.jsx)("path", {
                fill: "#4285F4",
                d: "M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z"
            }), (0, t.jsx)("path", {
                fill: "#34A853",
                d: "M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3a7.4 7.4 0 0 1-11-3.9H.99v3.09A12 12 0 0 0 12 24Z"
            }), (0, t.jsx)("path", {
                fill: "#FBBC05",
                d: "M5.05 14.19a7.2 7.2 0 0 1 0-4.38V6.72H.99a12 12 0 0 0 0 10.56l4.06-3.09Z"
            }), (0, t.jsx)("path", {
                fill: "#EA4335",
                d: "M12 4.75c1.76 0 3.35.6 4.6 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 .99 6.72l4.06 3.09A7.16 7.16 0 0 1 12 4.75Z"
            })]
        })
    }

    function c() {
        let e = (0, r.useRouter)(),
            t = (0, r.useSearchParams)(),
            [n, o] = (0, i.useState)(!1),
            c = (0, i.useRef)(!1),
            d = t.get("redirectTo") || "/";
        return (0, i.useEffect)(() => {
            let i = t.get("error");
            if (i) return void a.toast.error(decodeURIComponent(i));
            let r = new URLSearchParams(window.location.search),
                n = new URLSearchParams(window.location.hash.replace(/^#/, "")),
                u = e => r.get(e) ? ? n.get(e),
                m = u("accessToken") ? ? u("access_token") ? ? u("token"),
                p = u("refreshToken") ? ? u("refresh_token");
            (m || p) && (c.current || (c.current = !0, m && l.default.authService.setAccessToken(m), p && l.default.authService.setRefreshToken(p), o(!0), (async () => {
                try {
                    let {
                        isActive: t,
                        status: i
                    } = await l.default.authService.isUserActive();
                    if (!t) return void e.replace(`/disable-user?status=${i}`);
                    let r = e => {
                            if (!e) return !1;
                            let t = e.trim().toLowerCase();
                            return ["1", "true", "yes", "new"].includes(t)
                        },
                        n = r(u("isNewUser")) || r(u("newUser")) || r(u("isNew")) || r(u("registered")),
                        o = null;
                    try {
                        o = await l.default.userService.getUserProfile()
                    } catch {
                        o = null
                    }
                    let c = o ? new Date(o.createdAt).getTime() : NaN,
                        m = !!o ? .googleSub && Number.isFinite(c) && Date.now() - c < 6e5,
                        p = o ? .id ? `tracker:registerInitiate:${o.id}` : null,
                        f = o ? .id ? `tracker:registerSuccess:${o.id}` : null,
                        h = !!f && "1" === window.localStorage.getItem(f);
                    if (o && !h && (n || m)) {
                        let e = `${o.firstName??""} ${o.lastName??""}`.trim() || o.username || o.email;
                        try {
                            s.default.registerInitiate(e, o.email), p && window.localStorage.setItem(p, "1"), s.default.registerSuccess(e, o.email), f && window.localStorage.setItem(f, "1")
                        } catch {}
                    }
                    a.toast.success("Login successful"), e.replace(d)
                } catch {
                    a.toast.error("Login failed")
                } finally {
                    o(!1)
                }
            })()))
        }, []), {
            googleSigningIn: n,
            handleGoogleSignIn: function() {
                let e = "/api";
                if (!e) return void a.toast.error("Google sign-in is not configured");
                e.startsWith("http") || (e = new URL(e, window.location.origin).toString());
                try {
                    o(!0), window.location.href = `${e}/v1/auth/google`
                } catch {
                    o(!1), a.toast.error("Failed to start Google sign-in")
                }
            }
        }
    }
    e.s(["GoogleIcon", 0, o, "GoogleSignInButton", 0, function({
        disabled: e
    }) {
        let {
            googleSigningIn: i,
            handleGoogleSignIn: r
        } = c();
        return (0, t.jsxs)(n.Button, {
            type: "button",
            variant: "outline",
            className: "w-full",
            disabled: e || i,
            onClick: r,
            children: [(0, t.jsx)(o, {
                className: "size-4"
            }), i ? "Connecting…" : "Sign in with Google"]
        })
    }, "useGoogleSignIn", 0, c])
}, 15288, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(75157);
    e.s(["Card", 0, function({
        className: e,
        size: r = "default",
        ...a
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "card",
            "data-size": r,
            className: (0, i.cn)("group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", e),
            ...a
        })
    }, "CardContent", 0, function({
        className: e,
        ...r
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "card-content",
            className: (0, i.cn)("px-(--card-spacing)", e),
            ...r
        })
    }, "CardFooter", 0, function({
        className: e,
        ...r
    }) {
        return (0, t.jsx)("div", {
            "data-slot": "card-footer",
            className: (0, i.cn)("flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)", e),
            ...r
        })
    }])
}, 57428, e => {
    "use strict";
    var t, i = e.i(43476);
    e.s([], 92299), e.i(92299);
    var r = e.i(15504),
        a = e.i(56789),
        n = e.i(51437),
        s = e.i(46376),
        l = e.i(28918),
        o = e.i(88940),
        c = e.i(2077),
        d = e.i(33848);
    let u = ((t = {}).checked = "data-checked", t.unchecked = "data-unchecked", t.indeterminate = "data-indeterminate", t.disabled = "data-disabled", t.readonly = "data-readonly", t.required = "data-required", t.valid = "data-valid", t.invalid = "data-invalid", t.touched = "data-touched", t.dirty = "data-dirty", t.filled = "data-filled", t.focused = "data-focused", t);
    var m = e.i(75812);

    function p(e) {
        return r.useMemo(() => ({
            checked: t => e.indeterminate ? {} : t ? {
                [u.checked]: ""
            } : {
                [u.unchecked]: ""
            },
            ...m.fieldValidityMapping
        }), [e.indeterminate])
    }
    var f = e.i(52245),
        h = e.i(88015),
        g = e.i(76782),
        v = e.i(40886),
        x = e.i(69690),
        y = e.i(81104),
        b = e.i(57153),
        k = e.i(84708),
        w = e.i(47778),
        j = e.i(74854),
        N = e.i(33332);
    let C = r.createContext(void 0);
    var _ = e.i(75606),
        S = e.i(56434),
        I = e.i(6039);
    let F = r.forwardRef(function(e, t) {
        let {
            checked: u,
            className: m,
            defaultChecked: N = !1,
            "aria-labelledby": F,
            disabled: E = !1,
            form: R,
            id: T,
            indeterminate: P = !1,
            inputRef: A,
            name: L,
            onCheckedChange: z,
            parent: M = !1,
            readOnly: B = !1,
            render: q,
            required: U = !1,
            uncheckedValue: V,
            value: D,
            nativeButton: $ = !1,
            style: O,
            ...K
        } = e, {
            clearErrors: W
        } = (0, k.useFormContext)(), {
            disabled: G,
            name: H,
            setDirty: Z,
            setFilled: Y,
            setFocused: J,
            setTouched: Q,
            state: X,
            validationMode: ee,
            validityData: et,
            validation: ei
        } = (0, x.useFieldRootContext)(), er = (0, b.useFieldItemContext)(), {
            labelId: ea,
            controlId: en,
            registerControlId: es,
            getDescriptionProps: el
        } = (0, w.useLabelableContext)(), eo = (0, j.useCheckboxGroupContext)(), ec = eo ? .parent, ed = ec && eo.allValues, eu = G || er.disabled || eo ? .disabled || E, em = H ? ? L, ep = D ? ? em, ef = (0, h.useBaseUiId)(), eh = (0, h.useBaseUiId)(), eg = en;
        ed ? eg = M ? eh : `${ec.id}-${ep}` : T && (eg = T);
        let ev = {};
        ed && (M ? ev = eo.parent.getParentProps() : ep && (ev = eo.parent.getChildProps(ep)));
        let {
            checked: ex = u,
            indeterminate: ey = P,
            onCheckedChange: eb,
            ...ek
        } = ev, ew = eo ? .value, ej = eo ? .setValue, eN = eo ? .defaultValue, eC = r.useRef(null), e_ = (0, o.useRefWithInit)(() => Symbol("checkbox-control")), eS = r.useRef(!1), {
            getButtonProps: eI,
            buttonRef: eF
        } = (0, v.useButton)({
            disabled: eu,
            native: $
        }), eE = eo ? .validation ? ? ei, [eR, eT] = (0, n.useControlled)({
            controlled: ep && ew && !M ? ew.includes(ep) : ex,
            default: ep && eN && !M ? eN.includes(ep) : N,
            name: "Checkbox",
            state: "checked"
        }), eP = ed ? !!ex : eR, eA = ed && ey || P;
        (0, s.useIsoLayoutEffect)(() => {
            es !== a.NOOP && (eS.current = !0, es(e_.current, eg))
        }, [eg, es, e_]), r.useEffect(() => {
            let e = e_.current;
            return () => {
                eS.current && es !== a.NOOP && (eS.current = !1, es(e, void 0))
            }
        }, [es, e_]), (0, y.useRegisterFieldControl)(eC, ef, eR, void 0, !eo && !eu, L);
        let eL = r.useRef(null),
            ez = (0, l.useMergedRefs)(A, eL, eE.inputRef, eE.registerInput),
            eM = function(e, t, i, a = !0, n) {
                let [l, o] = r.useState(), c = (0, h.useBaseUiId)(n ? `${n}-label` : void 0), d = e ? ? t ? ? l;
                return (0, s.useIsoLayoutEffect)(() => {
                    let r = e || t || !a ? void 0 : function(e, t) {
                        let i = function(e) {
                            if (!e) return;
                            let t = e.parentElement;
                            if (t && "LABEL" === t.tagName) return t;
                            let i = e.id;
                            if (i) {
                                let t = e.nextElementSibling;
                                if (t && t.htmlFor === i) return t
                            }
                            let r = e.labels;
                            return r && r[0]
                        }(e);
                        if (i) return !i.id && t && (i.id = t), i.id || void 0
                    }(i.current, c);
                    l !== r && o(r)
                }), d
            }(F, ea, eL, !$, eg ? ? void 0);
        (0, s.useIsoLayoutEffect)(() => {
            eL.current && (eL.current.indeterminate = eA, eR && Y(!0))
        }, [eR, eA, Y]), (0, I.useValueChanged)(eR, () => {
            eo || (W(em), Y(eR), Z(eR !== et.initialValue), eE.change(eR))
        });
        let eB = (0, g.mergeProps)({
            checked: eR,
            disabled: eu,
            form: R,
            name: M ? void 0 : em,
            id: $ ? void 0 : eg ? ? void 0,
            required: U,
            ref: ez,
            style: em ? c.visuallyHiddenInput : c.visuallyHidden,
            tabIndex: -1,
            type: "checkbox",
            "aria-hidden": !0,
            onChange(e) {
                if (e.nativeEvent.defaultPrevented) return;
                if (B) return void e.preventDefault();
                let t = e.currentTarget.checked,
                    i = (0, _.createChangeEventDetails)(S.REASONS.none, e.nativeEvent);
                z ? .(t, i), i.isCanceled || (eb ? .(t, i), !i.isCanceled && (eT(t), ep && ew && ej && !M && !ed && ej(t ? [...ew, ep] : ew.filter(e => e !== ep), i)))
            },
            onFocus() {
                eC.current ? .focus()
            }
        }, void 0 !== D ? {
            value: (eo ? eR && D : D) || ""
        } : a.EMPTY_OBJECT, el, e => eE.getValidationProps(eu, e));
        r.useEffect(() => {
            if (!ec || !ep) return;
            let e = ec.disabledStatesRef.current;
            return e.set(ep, eu), () => {
                e.delete(ep)
            }
        }, [ec, eu, ep]);
        let eq = r.useMemo(() => ({ ...X,
                checked: eP,
                disabled: eu,
                readOnly: B,
                required: U,
                indeterminate: eA
            }), [X, eP, eu, B, U, eA]),
            eU = p(eq),
            eV = (0, f.useRenderElement)("span", e, {
                state: eq,
                ref: [eF, eC, t, eo ? .registerControlRef],
                props: [{
                    id: $ ? eg ? ? void 0 : ef,
                    role: "checkbox",
                    "aria-checked": eA ? "mixed" : eP,
                    "aria-readonly": B || void 0,
                    "aria-required": U || void 0,
                    "aria-labelledby": eM,
                    "data-parent": M ? "" : void 0,
                    onFocus() {
                        eu || J(!0)
                    },
                    onBlur() {
                        let e = eL.current;
                        e && (Q(!0), J(!1), "onBlur" === ee && eE.commit(eo ? ew : e.checked))
                    },
                    onKeyDown(e) {
                        if ("Enter" !== e.key || (e.preventBaseUIHandler(), e.defaultPrevented)) return;
                        let t = eL.current ? .form ? ? null,
                            i = e.currentTarget,
                            r = e.nativeEvent,
                            a = e.preventDefault,
                            n = r.preventDefault,
                            s = !1;
                        e.preventDefault = () => {
                            s = !0, a.call(e)
                        }, r.preventDefault = () => {
                            s = !0, n.call(r)
                        }, n.call(r), (0, d.ownerWindow)(i).queueMicrotask(() => {
                            e.preventDefault = a, r.preventDefault = n, s || (function(e) {
                                if (!e) return null;
                                for (let t of e.elements) {
                                    let e = t.tagName;
                                    if (("BUTTON" === e || "INPUT" === e) && "submit" === t.type) return t
                                }
                                return null
                            })(t) ? .click()
                        })
                    },
                    onClick(e) {
                        if (B || eu) return;
                        e.preventDefault();
                        let t = eL.current;
                        t && t.dispatchEvent(new((0, d.ownerWindow)(t)).PointerEvent("click", {
                            bubbles: !0,
                            shiftKey: e.shiftKey,
                            ctrlKey: e.ctrlKey,
                            altKey: e.altKey,
                            metaKey: e.metaKey
                        }))
                    }
                }, K, ek, eI, el, e => eE.getValidationProps(eu, e)],
                stateAttributesMapping: eU
            });
        return (0, i.jsxs)(C.Provider, {
            value: eq,
            children: [eV, !eR && !eo && em && !M && void 0 !== V && (0, i.jsx)("input", {
                type: "hidden",
                form: R,
                name: em,
                value: V,
                disabled: eu
            }), (0, i.jsx)("input", { ...eB,
                suppressHydrationWarning: !0
            })]
        })
    });
    var E = e.i(37584),
        R = e.i(23910),
        T = e.i(9407);
    let P = r.forwardRef(function(e, t) {
        let {
            render: i,
            className: a,
            style: n,
            keepMounted: s = !1,
            ...l
        } = e, o = function() {
            let e = r.useContext(C);
            if (void 0 === e) throw Error((0, N.default)(14));
            return e
        }(), c = o.checked || o.indeterminate, {
            mounted: d,
            transitionStatus: u,
            setMounted: h
        } = (0, R.useTransitionStatus)(c), g = r.useRef(null), v = { ...o,
            transitionStatus: u
        };
        (0, E.useOpenChangeComplete)({
            open: c,
            ref: g,
            onComplete() {
                c || h(!1)
            }
        });
        let x = { ...p(o),
                ...T.transitionStatusMapping,
                ...m.fieldValidityMapping
            },
            y = (0, f.useRenderElement)("span", e, {
                ref: [t, g],
                state: v,
                stateAttributesMapping: x,
                props: l
            });
        return s || d ? y : null
    });
    e.s(["Indicator", 0, P, "Root", 0, F], 26749);
    var A = e.i(26749),
        A = A,
        L = e.i(75157),
        z = e.i(93698);
    e.s(["Checkbox", 0, function({
        className: e,
        ...t
    }) {
        return (0, i.jsx)(A.Root, {
            "data-slot": "checkbox",
            className: (0, L.cn)("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e),
            ...t,
            children: (0, i.jsx)(A.Indicator, {
                "data-slot": "checkbox-indicator",
                className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
                children: (0, i.jsx)(z.CheckIcon, {})
            })
        })
    }], 57428)
}, 10204, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(75157);
    e.s(["Label", 0, function({
        className: e,
        ...r
    }) {
        return (0, t.jsx)("label", {
            "data-slot": "label",
            className: (0, i.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
            ...r
        })
    }])
}, 72436, e => {
    "use strict";
    var t = e.i(43476),
        i = e.i(52225),
        r = e.i(75157);
    e.s(["Separator", 0, function({
        className: e,
        orientation: a = "horizontal",
        ...n
    }) {
        return (0, t.jsx)(i.Separator, {
            "data-slot": "separator",
            orientation: a,
            className: (0, r.cn)("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch", e),
            ...n
        })
    }])
}, 90838, e => {
    "use strict";
    let t = (...e) => {
            let t = window;
            t.fbq && t.fbq.apply(null, e)
        },
        i = (e, t = 100) => {
            if ("number" == typeof e && isFinite(e)) return parseFloat((e / t).toFixed(2))
        },
        r = new class {
            registerInitiate(e, i) {
                t("trackCustom", "RegistrationInitiated", {
                    content_name: i ? .trim(),
                    content_category: "registration",
                    status: "started"
                }, {
                    eventID: e
                })
            }
            registerSuccess(e, i) {
                t("track", "CompleteRegistration", {
                    content_name: i ? .trim(),
                    content_category: "registration",
                    status: "success"
                }, {
                    eventID: e
                })
            }
            viewPricing(e) {
                let i = {
                    content_name: "Pricing",
                    content_category: "pricing"
                };
                t("track", "ViewContent", i, {
                    eventID: e
                }), t("trackCustom", "ViewPricing", i, {
                    eventID: e
                })
            }
            trialApplicationSubmitted(e) {
                t("trackCustom", "TrialApplicationSubmitted", {
                    content_name: "TrialApplicationSubmitted",
                    content_category: "trial"
                }, {
                    eventID: e
                })
            }
            startTrial(e, r, a) {
                t("track", "StartTrial", {
                    content_name: "StartTrial",
                    value: i(a),
                    currency: r
                }, {
                    eventID: e
                })
            }
            purchaseIntent(e, r, a, n) {
                let s = i(a ? .prices ? .find(e => e.currency === r) ? .amount),
                    l = a ? [{
                        id: a.id,
                        quantity: n ? .lineItems ? .[0] ? .quantity ? ? 1,
                        item_price: s
                    }] : void 0;
                t("trackCustom", "PurchaseIntent", {
                    currency: r,
                    value: s,
                    content_type: "product",
                    content_name: a ? .name,
                    content_ids: a ? [a.id] : void 0,
                    contents: l
                }, {
                    eventID: e
                })
            }
            initiateCheckout(e, r, a, n, s) {
                let l = i(a ? .prices ? .find(e => e.currency === n) ? .amount),
                    o = r ? .lineItems ? .[0] ? .quantity ? ? 1;
                t("track", "InitiateCheckout", {
                    currency: n,
                    value: "number" == typeof l ? parseFloat((l * o).toFixed(2)) : void 0,
                    num_items: o,
                    content_type: "product",
                    content_name: a ? .name,
                    content_ids: [a ? .id].filter(Boolean),
                    contents: [{
                        id: a ? .id,
                        quantity: o,
                        item_price: l
                    }],
                    customer_id: s ? .id
                }, {
                    eventID: e
                })
            }
            purchase(e, r, a) {
                let n = r ? .lineItems ? .map(e => ({
                    id: e.productId,
                    quantity: e.quantity,
                    item_price: i(e.rate)
                })) ? ? [];
                t("track", "Purchase", {
                    currency: r ? .currency,
                    value: i(r ? .total),
                    content_type: "product",
                    content_ids: r ? .lineItems ? .map(e => e.productId),
                    contents: n,
                    order_id: r ? .orderNumber ? ? r ? .id,
                    customer_id: a ? .id
                }, {
                    eventID: e
                })
            }
            addToWaitlist(e, i, r) {
                let a = {
                    content_category: r,
                    consent_terms: !!i ? .consentTerms,
                    consent_marketing: !!i ? .consentMarketing,
                    platforms: i ? .platforms,
                    content: i ? .content,
                    hours: i ? .hours,
                    role: i ? .role,
                    project: i ? .project
                };
                t("track", "Lead", a, {
                    eventID: e
                }), t("trackCustom", "AddToWaitlist", a, {
                    eventID: e
                })
            }
        },
        a = (...e) => {
            let t = window;
            t.gtag && t.gtag.apply(null, e)
        },
        n = (e, t = 100) => {
            if ("number" == typeof e && isFinite(e)) return parseFloat((e / t).toFixed(2))
        },
        s = new class {
            registerInitiate(e, t) {
                a("event", "sign_up_initiated", {
                    content_name: t ? .trim(),
                    content_category: "registration",
                    status: "started",
                    event_id: e
                })
            }
            registerSuccess(e, t) {
                a("event", "sign_up", {
                    method: "email",
                    content_name: t ? .trim(),
                    event_id: e
                })
            }
            viewPricing(e) {
                let t = {
                    content_name: "Pricing",
                    content_category: "pricing",
                    event_id: e
                };
                a("event", "view_item", t), a("event", "view_pricing", t)
            }
            trialApplicationSubmitted(e) {
                a("event", "trial_application_submitted", {
                    content_name: "TrialApplicationSubmitted",
                    content_category: "trial",
                    event_id: e
                })
            }
            startTrial(e, t, i) {
                a("event", "start_trial", {
                    currency: t,
                    value: n(i),
                    event_id: e
                })
            }
            purchaseIntent(e, t, i, r) {
                let s = n(i ? .prices ? .find(e => e.currency === t) ? .amount),
                    l = r ? .lineItems ? .[0] ? .quantity ? ? 1;
                a("event", "add_to_cart", {
                    currency: t,
                    value: s,
                    items: i ? [{
                        item_id: i.id,
                        item_name: i.name,
                        quantity: l,
                        price: s
                    }] : void 0,
                    event_id: e
                })
            }
            initiateCheckout(e, t, i, r, s) {
                let l = n(i ? .prices ? .find(e => e.currency === r) ? .amount),
                    o = t ? .lineItems ? .[0] ? .quantity ? ? 1;
                a("event", "begin_checkout", {
                    currency: r,
                    value: "number" == typeof l ? parseFloat((l * o).toFixed(2)) : void 0,
                    items: [{
                        item_id: i ? .id,
                        item_name: i ? .name,
                        quantity: o,
                        price: l
                    }],
                    event_id: e
                })
            }
            purchase(e, t, i) {
                let r = n(t ? .total),
                    s = t ? .orderNumber ? ? t ? .id,
                    l = t ? .lineItems ? .map(e => ({
                        item_id: e.productId,
                        quantity: e.quantity,
                        price: n(e.rate)
                    })) ? ? [];
                a("event", "purchase", {
                    transaction_id: s,
                    currency: t ? .currency,
                    value: r,
                    items: l,
                    event_id: e
                })
            }
            addToWaitlist(e, t, i) {
                let r = {
                    content_category: i,
                    consent_marketing: !!t ? .consentMarketing,
                    event_id: e
                };
                a("event", "generate_lead", r), a("event", "add_to_waitlist", r)
            }
        },
        l = e => `${e}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,
        o = new Map,
        c = e => {
            let t = o.get(e);
            return !!(t && Date.now() - t < 1e3) || (o.set(e, Date.now()), !1)
        },
        d = new class {
            registerInitiate(e, t) {
                if (c("registerInitiate")) return;
                e = e.trim(), t = t.trim();
                let i = l("registerInitiate");
                try {
                    r.registerInitiate(i, e)
                } catch {}
                try {
                    s.registerInitiate(i, e)
                } catch {}
            }
            registerSuccess(e, t) {
                if (c("registerSuccess")) return;
                e = e.trim(), t = t.trim();
                let i = l("registerSuccess");
                try {
                    r.registerSuccess(i, e)
                } catch {}
                try {
                    s.registerSuccess(i, e)
                } catch {}
            }
            viewPricing() {
                if (c("viewPricing")) return;
                let e = l("viewPricing");
                try {
                    r.viewPricing(e)
                } catch {}
                try {
                    s.viewPricing(e)
                } catch {}
            }
            trialApplicationSubmitted() {
                if (c("trialApplicationSubmitted")) return;
                let e = l("trialApplicationSubmitted");
                try {
                    r.trialApplicationSubmitted(e)
                } catch {}
                try {
                    s.trialApplicationSubmitted(e)
                } catch {}
            }
            startTrial(e, t) {
                if (c("startTrial")) return;
                let i = l("startTrial");
                try {
                    r.startTrial(i, e, t)
                } catch {}
                try {
                    s.startTrial(i, e, t)
                } catch {}
            }
            purchaseIntent(e, t, i) {
                if (c("purchaseIntent")) return;
                let a = l("purchaseIntent");
                try {
                    r.purchaseIntent(a, e, t, i)
                } catch {}
                try {
                    s.purchaseIntent(a, e, t, i)
                } catch {}
            }
            initiateCheckout(e, t, i, a) {
                if (c("initiateCheckout")) return;
                let n = l("initiateCheckout");
                try {
                    r.initiateCheckout(n, e, t, i, a)
                } catch {}
                try {
                    s.initiateCheckout(n, e, t, i, a)
                } catch {}
            }
            purchase(e, t) {
                if (console.log({
                        event: "purchase",
                        orderData: e,
                        user: t
                    }), c("purchase")) return;
                let i = l("purchase");
                try {
                    r.purchase(i, e, t)
                } catch {}
                try {
                    s.purchase(i, e, t)
                } catch {}
            }
            addToWaitlist(e, t) {
                if (c("waitlist")) return;
                let i = l("waitlist");
                try {
                    r.addToWaitlist(i, e, t)
                } catch {}
                try {
                    s.addToWaitlist(i, e, t)
                } catch {}
            }
        };
    e.s(["default", 0, d], 90838)
}]);