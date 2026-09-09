/* @ds-bundle: {"format":3,"namespace":"NexusConsultingDesignSystem_c7745a","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"34cf7e7f8268","components/core/Button.jsx":"a1f6eccbb249","components/core/Card.jsx":"a7865086afdf","components/data/ProgressBar.jsx":"6366d50c393d","components/data/StatCard.jsx":"a7f6f543998b","components/forms/Input.jsx":"d63989ef0f8f","components/forms/Switch.jsx":"da58b830137f","components/navigation/Tabs.jsx":"eca444a5a6cf","ui_kits/dashboard/Overview.jsx":"3fddf3866078","ui_kits/dashboard/Sidebar.jsx":"85f5bff6eba9","ui_kits/dashboard/TopBar.jsx":"ce090c5f3270","ui_kits/dashboard/helpers.jsx":"6db974976155","ui_kits/website/CTA.jsx":"d4f5217f77aa","ui_kits/website/Footer.jsx":"21a987ca0fdd","ui_kits/website/Hero.jsx":"ddc640581316","ui_kits/website/NavBar.jsx":"b60984bf1e83","ui_kits/website/Services.jsx":"9607b54c021c","ui_kits/website/helpers.jsx":"b71cb4cf6c2d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NexusConsultingDesignSystem_c7745a = window.NexusConsultingDesignSystem_c7745a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Badge
 * Compact status / category label. Tones: accent, cyan, neutral, success, warning, danger.
 */
function Badge({
  children,
  tone = 'accent',
  variant = 'soft',
  dot = false,
  style = {},
  ...rest
}) {
  const palettes = {
    accent: {
      c: 'var(--nx-blue-400)',
      bg: 'rgba(20,92,255,0.16)',
      bd: 'rgba(20,92,255,0.34)'
    },
    cyan: {
      c: 'var(--nx-cyan-400)',
      bg: 'rgba(33,212,253,0.14)',
      bd: 'rgba(33,212,253,0.34)'
    },
    neutral: {
      c: 'var(--nx-slate-200)',
      bg: 'rgba(148,163,184,0.14)',
      bd: 'rgba(148,163,184,0.26)'
    },
    success: {
      c: 'var(--nx-success)',
      bg: 'rgba(45,212,167,0.14)',
      bd: 'rgba(45,212,167,0.34)'
    },
    warning: {
      c: 'var(--nx-warning)',
      bg: 'rgba(251,191,84,0.14)',
      bd: 'rgba(251,191,84,0.34)'
    },
    danger: {
      c: 'var(--nx-danger)',
      bg: 'rgba(251,106,106,0.14)',
      bd: 'rgba(251,106,106,0.34)'
    }
  };
  const pal = palettes[tone] || palettes.accent;
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1,
      letterSpacing: '0.02em',
      padding: '5px 10px',
      borderRadius: 'var(--radius-pill)',
      color: solid ? 'var(--nx-night)' : pal.c,
      background: solid ? pal.c : pal.bg,
      border: `1px solid ${solid ? 'transparent' : pal.bd}`,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: solid ? 'var(--nx-night)' : pal.c,
      boxShadow: solid ? 'none' : `0 0 8px ${pal.c}`
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Button
 * Variants: primary (gradient), secondary (graphite), ghost, outline, danger.
 * Sizes: sm, md, lg.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  full = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      fontSize: 13,
      padding: '8px 14px',
      height: 34,
      gap: 7,
      radius: 'var(--radius-sm)'
    },
    md: {
      fontSize: 14,
      padding: '11px 20px',
      height: 42,
      gap: 9,
      radius: 'var(--radius-md)'
    },
    lg: {
      fontSize: 16,
      padding: '15px 28px',
      height: 52,
      gap: 11,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: s.fontSize,
    letterSpacing: '0.01em',
    lineHeight: 1,
    height: s.height,
    padding: s.padding,
    borderRadius: s.radius,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  };
  const variants = {
    primary: {
      background: 'var(--accent-gradient)',
      color: 'var(--text-on-accent)',
      boxShadow: 'var(--glow-blue-sm)'
    },
    secondary: {
      background: 'var(--surface-raised)',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-default)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)'
    },
    danger: {
      background: 'var(--nx-danger)',
      color: '#360B0B'
    }
  };
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const hoverFx = !disabled && hover ? {
    primary: {
      boxShadow: 'var(--glow-blue-lg)'
    },
    secondary: {
      background: 'var(--nx-navy-700)',
      borderColor: 'var(--border-strong)'
    },
    outline: {
      borderColor: 'var(--border-accent)',
      color: 'var(--text-strong)'
    },
    ghost: {
      background: 'rgba(148,163,184,0.10)',
      color: 'var(--text-strong)'
    },
    danger: {
      filter: 'brightness(1.08)'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverFx,
      transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Card
 * Modular surface. Variants: solid (default), glass (blur), gradient (accent edge), node (pattern).
 */
function Card({
  children,
  variant = 'solid',
  padding = 'md',
  interactive = false,
  glow = false,
  style = {},
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 16,
    md: 24,
    lg: 32
  };
  const p = pads[padding] ?? 24;
  const [hover, setHover] = React.useState(false);
  const variants = {
    solid: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)'
    },
    glass: {
      background: 'var(--surface-overlay)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))'
    },
    gradient: {
      background: 'linear-gradient(160deg, var(--nx-navy-800) 0%, var(--nx-navy-900) 100%)',
      border: '1px solid var(--border-default)'
    },
    node: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      backgroundImage: 'radial-gradient(circle, rgba(33,212,253,0.10) 1px, transparent 1.4px)',
      backgroundSize: '20px 20px'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      padding: p,
      boxShadow: glow ? 'var(--glow-blue-sm)' : 'var(--shadow-md)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      ...variants[variant],
      ...(interactive && hover ? {
        transform: 'translateY(-3px)',
        borderColor: 'var(--border-accent)',
        boxShadow: 'var(--glow-blue-lg)',
        cursor: 'pointer'
      } : {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — ProgressBar
 * Gradient track fill for capacity / completion. Optional label + value.
 */
function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  tone = 'gradient',
  size = 'md',
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const fills = {
    gradient: 'var(--accent-gradient)',
    cyan: 'var(--nx-cyan-500)',
    blue: 'var(--nx-blue-500)',
    success: 'var(--nx-success)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      width: '100%',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--nx-navy-700)',
      overflow: 'hidden',
      boxShadow: 'var(--inset-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${pct}%`,
      background: fills[tone] || fills.gradient,
      borderRadius: 'var(--radius-pill)',
      boxShadow: tone === 'gradient' || tone === 'cyan' ? 'var(--glow-cyan-sm)' : 'none',
      transition: 'width var(--dur-slow) var(--ease-emphasis)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — StatCard
 * Metric tile for dashboards: label, big mono value, delta trend, optional icon.
 */
function StatCard({
  label,
  value,
  unit,
  delta,
  trend = 'up',
  icon = null,
  accent = 'cyan',
  style = {},
  ...rest
}) {
  const accents = {
    cyan: 'var(--nx-cyan-500)',
    blue: 'var(--nx-blue-400)'
  };
  const trendColor = trend === 'down' ? 'var(--nx-danger)' : 'var(--nx-success)';
  const arrow = trend === 'down' ? '▾' : '▴';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: accents[accent] || accents.cyan,
      opacity: 0.85
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: accents[accent] || accents.cyan,
      display: 'flex'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontSize: 34,
      color: 'var(--text-strong)',
      letterSpacing: '-0.02em',
      lineHeight: 1
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      color: 'var(--text-muted)'
    }
  }, unit)), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: trendColor,
      fontSize: 13,
      fontWeight: 600
    }
  }, arrow, " ", delta), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, "vs. mes anterior")));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Input
 * Text field with optional label, leading icon, hint/error, on dark surfaces.
 */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  iconLeft = null,
  hint,
  error,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;
  const borderColor = error ? 'var(--nx-danger)' : focus ? 'var(--border-accent)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-body)',
      letterSpacing: '0.01em'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--nx-navy-900)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 14px',
      height: 44,
      boxShadow: focus ? `0 0 0 3px var(--ring-accent)` : 'none',
      transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      opacity: disabled ? 0.5 : 1
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--text-faint)',
      flex: 'none'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-body)',
      fontSize: 14
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--nx-danger)' : 'var(--text-faint)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Switch
 * Toggle with gradient "on" state and cyan glow.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md',
  style = {},
  ...rest
}) {
  const dims = size === 'sm' ? {
    w: 36,
    h: 20,
    k: 14
  } : {
    w: 46,
    h: 26,
    k: 20
  };
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-body)',
      userSelect: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": checked,
    onClick: toggle,
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--accent-gradient)' : 'var(--nx-navy-600)',
      border: `1px solid ${checked ? 'transparent' : 'var(--border-default)'}`,
      boxShadow: checked ? 'var(--glow-cyan-sm)' : 'none',
      transition: 'background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: checked ? dims.w - dims.k - 3 : 3,
      transform: 'translateY(-50%)',
      width: dims.k,
      height: dims.k,
      borderRadius: '50%',
      background: 'var(--nx-white)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nexus Consulting — Tabs
 * Underline tab bar with animated cyan indicator.
 * items: [{ id, label }]. Controlled via `value` + `onChange`.
 */
function Tabs({
  items = [],
  value,
  onChange,
  style = {},
  ...rest
}) {
  const active = value ?? items[0]?.id;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      position: 'relative',
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-display)',
      ...style
    }
  }, rest), items.map(it => {
    const isActive = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": isActive,
      onClick: () => onChange && onChange(it.id),
      style: {
        position: 'relative',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '12px 16px',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 14,
        color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur-base) var(--ease-out)'
      }
    }, it.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: -1,
        height: 2,
        borderRadius: 2,
        background: isActive ? 'var(--accent-gradient)' : 'transparent',
        boxShadow: isActive ? 'var(--glow-cyan-sm)' : 'none',
        transition: 'background var(--dur-base) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Overview.jsx
try { (() => {
/* Nexus dashboard — main overview content */
function Overview() {
  const [tab, setTab] = React.useState('30d');
  const series = {
    '7d': [42, 48, 39, 61, 55, 72, 68],
    '30d': [30, 41, 38, 52, 49, 63, 58, 71, 66, 78, 74, 88],
    '90d': [20, 28, 35, 31, 44, 52, 60, 57, 69, 73, 81, 92]
  };
  const flows = [{
    name: 'Facturación → ERP',
    status: 'success',
    label: 'Operativo',
    runs: '1,284',
    prog: 100,
    accent: 'cyan'
  }, {
    name: 'Leads CRM → Slack',
    status: 'success',
    label: 'Operativo',
    runs: '842',
    prog: 100,
    accent: 'cyan'
  }, {
    name: 'Onboarding empleados',
    status: 'warning',
    label: 'En revisión',
    runs: '67',
    prog: 62,
    accent: 'blue'
  }, {
    name: 'Clasificación tickets IA',
    status: 'success',
    label: 'Operativo',
    runs: '3,401',
    prog: 100,
    accent: 'cyan'
  }, {
    name: 'Sincronización inventario',
    status: 'danger',
    label: 'Error',
    runs: '12',
    prog: 28,
    accent: 'blue'
  }];
  const integrations = [{
    n: 'HubSpot',
    i: 'contact',
    c: '#FF7A59'
  }, {
    n: 'Slack',
    i: 'message-square',
    c: '#611f69'
  }, {
    n: 'Notion',
    i: 'file-text',
    c: '#cfcfcf'
  }, {
    n: 'Stripe',
    i: 'credit-card',
    c: '#635bff'
  }, {
    n: 'Google',
    i: 'mail',
    c: '#4285F4'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Tareas automatizadas",
    value: "12,840",
    delta: "18%",
    trend: "up",
    accent: "cyan",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "zap",
      size: 18,
      color: "var(--nx-cyan-400)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Horas ahorradas / mes",
    value: "486",
    unit: "h",
    delta: "12%",
    trend: "up",
    accent: "blue",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 18,
      color: "var(--nx-blue-300)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Flujos activos",
    value: "38",
    delta: "4",
    trend: "up",
    accent: "cyan",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "workflow",
      size: 18,
      color: "var(--nx-cyan-400)"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Incidencias",
    value: "2",
    delta: "33%",
    trend: "down",
    accent: "blue",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "alert-triangle",
      size: 18,
      color: "var(--nx-blue-300)"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "solid",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Ejecuciones de flujos"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '4px 0 0'
    }
  }, "Volumen procesado en el periodo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--nx-navy-900)',
      padding: 3,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)'
    }
  }, ['7d', '30d', '90d'].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      border: 'none',
      cursor: 'pointer',
      padding: '5px 11px',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 500,
      background: tab === t ? 'var(--accent-gradient)' : 'transparent',
      color: tab === t ? '#fff' : 'var(--text-muted)'
    }
  }, t)))), /*#__PURE__*/React.createElement(FlowChart, {
    data: series[tab],
    height: 180
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "solid",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Integraciones"), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "5 conectadas")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, integrations.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--nx-navy-900)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: it.c + '22',
      border: '1px solid ' + it.c + '55',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.i,
    size: 15,
    color: it.c
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-body)',
      flex: 1
    }
  }, it.n), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--nx-success)',
      boxShadow: '0 0 8px var(--nx-success)'
    }
  })))))), /*#__PURE__*/React.createElement(Card, {
    variant: "solid",
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Flujos activos"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-link)',
      cursor: 'pointer'
    }
  }, "Ver todos \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1.4fr',
      gap: 16,
      padding: '0 8px 10px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, ['Flujo', 'Estado', 'Ejecuciones', 'Salud'].map(h => /*#__PURE__*/React.createElement("span", {
    key: h,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, h))), flows.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1.4fr',
      gap: 16,
      alignItems: 'center',
      padding: '13px 8px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, f.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    tone: f.status,
    dot: true
  }, f.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, f.runs), /*#__PURE__*/React.createElement(ProgressBar, {
    value: f.prog,
    tone: f.status === 'danger' ? 'blue' : f.accent,
    size: "sm",
    showValue: false
  }))))));
}
Object.assign(window, {
  Overview
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Overview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Sidebar.jsx
try { (() => {
/* Nexus dashboard — left navigation sidebar */
function Sidebar({
  active,
  onNavigate
}) {
  const nav = [{
    id: 'resumen',
    icon: 'layout-dashboard',
    label: 'Resumen'
  }, {
    id: 'flujos',
    icon: 'workflow',
    label: 'Flujos'
  }, {
    id: 'integraciones',
    icon: 'network',
    label: 'Integraciones'
  }, {
    id: 'datos',
    icon: 'database',
    label: 'Datos'
  }, {
    id: 'ia',
    icon: 'brain-circuit',
    label: 'Asistentes IA'
  }, {
    id: 'informes',
    icon: 'bar-chart-3',
    label: 'Informes'
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      flex: 'none',
      background: 'var(--nx-navy-950)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 8px 22px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/nexus-isotype.png",
    alt: "Nexus",
    style: {
      height: 30,
      borderRadius: 5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: '0.18em',
      color: 'var(--text-strong)'
    }
  }, "NEXUS")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, nav.map(n => {
    const on = n.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNavigate(n.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        background: on ? 'var(--accent-gradient-soft)' : 'transparent',
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 14,
        boxShadow: on ? 'inset 2px 0 0 var(--nx-cyan-500)' : 'none',
        transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      color: on ? 'var(--nx-cyan-400)' : 'currentColor'
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 16,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'var(--accent-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: '#fff'
    }
  }, "CC"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "Carlos del Corral"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-faint)'
    }
  }, "CEO \xB7 Nexus")))));
}
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TopBar.jsx
try { (() => {
/* Nexus dashboard — top bar */
function TopBar({
  title
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7,17,31,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)'
    }
  }, "Panel operativo"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      color: 'var(--text-strong)',
      margin: '2px 0 0'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 38,
      padding: '0 12px',
      background: 'var(--nx-navy-900)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      width: 220
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-faint)'
    }
  }, "Buscar flujo o sistema\u2026")), /*#__PURE__*/React.createElement("button", {
    style: {
      position: 'relative',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: 'var(--nx-navy-900)',
      border: '1px solid var(--border-default)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      right: 9,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--nx-cyan-500)',
      boxShadow: '0 0 8px var(--nx-cyan-500)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 38,
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderRadius: 'var(--radius-md)',
      background: 'var(--accent-gradient)',
      border: 'none',
      cursor: 'pointer',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      boxShadow: 'var(--glow-blue-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16,
    color: "#fff"
  }), " Nuevo flujo")));
}
Object.assign(window, {
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/helpers.jsx
try { (() => {
/* Nexus dashboard kit — shared helpers */

function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.7,
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      lineHeight: 0,
      ...style
    }
  });
}

/* Lightweight area-line chart on canvas — brand cyan/blue gradient fill. */
function FlowChart({
  data = [],
  height = 160,
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function draw() {
      const w = canvas.parentElement.getBoundingClientRect().width;
      const h = height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pad = 8;
      const max = Math.max(...data) * 1.15 || 1;
      const min = Math.min(...data) * 0.85;
      const pts = data.map((d, i) => [pad + i / (data.length - 1) * (w - pad * 2), h - pad - (d - min) / (max - min) * (h - pad * 2)]);
      // grid
      ctx.strokeStyle = 'rgba(148,163,184,0.08)';
      ctx.lineWidth = 1;
      for (let g = 0; g <= 3; g++) {
        const y = pad + g / 3 * (h - pad * 2);
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(w - pad, y);
        ctx.stroke();
      }
      // area fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(33,212,253,0.32)');
      grad.addColorStop(1, 'rgba(20,92,255,0.02)');
      ctx.beginPath();
      ctx.moveTo(pts[0][0], h - pad);
      pts.forEach(p => ctx.lineTo(p[0], p[1]));
      ctx.lineTo(pts[pts.length - 1][0], h - pad);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // line
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
      ctx.strokeStyle = '#21D4FD';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(33,212,253,0.6)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // last point
      const last = pts[pts.length - 1];
      ctx.fillStyle = '#21D4FD';
      ctx.beginPath();
      ctx.arc(last[0], last[1], 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [data, height]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      display: 'block',
      ...style
    }
  });
}
Object.assign(window, {
  Icon,
  FlowChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/helpers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CTA.jsx
try { (() => {
/* Nexus website — closing CTA with contact form */
function CTA() {
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  return /*#__PURE__*/React.createElement("section", {
    id: "contacto",
    style: {
      padding: '40px 40px 110px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "solid",
    padding: "none",
    style: {
      overflow: 'hidden',
      borderColor: 'var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '56px 48px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(NodeField, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at 20% 30%, rgba(20,92,255,0.22), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 38,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "\xBFListos para", /*#__PURE__*/React.createElement("br", null), "operar mejor?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: 360,
      marginTop: 16
    }
  }, "Cu\xE9ntanos qu\xE9 quieres mejorar. Dise\xF1amos la soluci\xF3n contigo."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [['mail', 'hola@nexus.ad'], ['phone', '+376 123 456'], ['map-pin', 'Andorra la Vella, Andorra']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16,
    color: "var(--nx-cyan-400)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--nx-navy-900)',
      padding: '48px 44px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      margin: '0 auto 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--accent-gradient-soft)',
      border: '1px solid var(--border-accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 26,
    color: "var(--nx-cyan-400)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--text-strong)',
      fontSize: 22,
      margin: '0 0 6px'
    }
  }, "Gracias"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      fontSize: 14,
      margin: 0
    }
  }, "Te respondemos en menos de 24 h.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre",
    placeholder: "Tu nombre"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Correo",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "tu@empresa.com",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 16
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\xBFQu\xE9 quieres mejorar?",
    placeholder: "Cu\xE9ntanos brevemente"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit",
    full: true
  }, "Enviar mensaje")))))));
}
Object.assign(window, {
  CTA
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CTA.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
/* Nexus website — footer */
function Footer() {
  const cols = [{
    h: 'Servicios',
    items: ['Software a medida', 'Inteligencia artificial', 'Automatización', 'Integración']
  }, {
    h: 'Empresa',
    items: ['Nosotros', 'Casos de éxito', 'Proceso', 'Contacto']
  }, {
    h: 'Recursos',
    items: ['Blog', 'Guías', 'Soporte', 'Estado del sistema']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--nx-navy-950)',
      padding: '56px 40px 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/nexus-isotype.png",
    alt: "Nexus",
    style: {
      height: 30,
      borderRadius: 5
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: '0.2em',
      color: 'var(--text-strong)'
    }
  }, "NEXUS")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      maxWidth: 280,
      margin: 0
    }
  }, "Tecnolog\xEDa que conecta. Soluciones que avanzan.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-body)',
      marginBottom: 14
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-muted)',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-link)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-muted)'
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '40px auto 0',
      paddingTop: 24,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, "\xA9 2026 Nexus Consulting \xB7 Andorra"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, "Privacidad \xB7 T\xE9rminos")));
}
Object.assign(window, {
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* Nexus website — hero section */
function Hero({
  onPrimary,
  onSecondary
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: '110px 40px 120px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(NodeField, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(20,92,255,0.20), transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 900,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "cyan",
    dot: true,
    style: {
      marginBottom: 28
    }
  }, "Consultor\xEDa tecnol\xF3gica \xB7 Andorra"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 68,
      lineHeight: 1.04,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "El punto donde", /*#__PURE__*/React.createElement("br", null), "todo\xA0", /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--accent-gradient)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }, "conecta"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: 620,
      margin: '24px auto 40px'
    }
  }, "Software a medida, IA aplicada, automatizaci\xF3n e integraci\xF3n de sistemas para empresas que quieren operar mejor."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onPrimary,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "Descubrir soluciones"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    onClick: onSecondary
  }, "Hablemos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      justifyContent: 'center',
      marginTop: 56,
      opacity: 0.7
    }
  }, ['+120 proyectos', '99.98% uptime', 'Andorra · UE'].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)',
      letterSpacing: '0.04em'
    }
  }, t)))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/NavBar.jsx
try { (() => {
/* Nexus website — top navigation bar */
function NavBar({
  onCta
}) {
  const links = ['Soluciones', 'Servicios', 'Nosotros', 'Casos', 'Contacto'];
  const [active, setActive] = React.useState('Soluciones');
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(7,17,31,0.72)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/nexus-isotype.png",
    alt: "Nexus",
    style: {
      height: 34,
      borderRadius: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      letterSpacing: '0.22em',
      color: 'var(--text-strong)'
    }
  }, "NEXUS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: 9,
      letterSpacing: '0.34em',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, "CONSULTING"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    onClick: () => setActive(l),
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 14,
      color: active === l ? 'var(--text-strong)' : 'var(--text-muted)',
      padding: '8px 14px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'color var(--dur-base) var(--ease-out)'
    },
    onMouseEnter: e => {
      if (active !== l) e.currentTarget.style.color = 'var(--text-body)';
    },
    onMouseLeave: e => {
      if (active !== l) e.currentTarget.style.color = 'var(--text-muted)';
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onCta
  }, "Hablemos"));
}
Object.assign(window, {
  NavBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/NavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
/* Nexus website — services grid */
function Services() {
  const items = [{
    icon: 'code-2',
    title: 'Software a medida',
    desc: 'Aplicaciones y plataformas diseñadas en torno a tu operación real, no al revés.'
  }, {
    icon: 'brain-circuit',
    title: 'Inteligencia artificial',
    desc: 'IA aplicada con control: copilotos, clasificación y decisiones asistidas.'
  }, {
    icon: 'workflow',
    title: 'Automatización',
    desc: 'Eliminamos trabajo manual conectando tus procesos de extremo a extremo.'
  }, {
    icon: 'network',
    title: 'Integración de sistemas',
    desc: 'Tus herramientas y datos hablando el mismo idioma, en un solo flujo.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 40px',
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color: 'var(--accent-secondary)',
      marginBottom: 14
    }
  }, "Servicios"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: '-0.02em',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Tecnolog\xEDa que conecta"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      color: 'var(--text-muted)',
      marginTop: 14
    }
  }, "Cuatro disciplinas, un mismo objetivo: que tu empresa opere mejor.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 20
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.title,
    variant: "gradient",
    interactive: true,
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--accent-gradient-soft)',
      border: '1px solid var(--border-accent)',
      color: 'var(--accent-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 24,
    color: "var(--nx-cyan-400)"
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 21,
      color: 'var(--text-strong)',
      margin: '0 0 10px'
    }
  }, it.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: 0
    }
  }, it.desc)))));
}
Object.assign(window, {
  Services
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/helpers.jsx
try { (() => {
/* Nexus website kit — shared helpers: Lucide icon + animated connection-node background. */

// Lucide icon — renders <i data-lucide> and hydrates after mount.
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.6,
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      lineHeight: 0,
      ...style
    }
  });
}

// Animated node network — the signature "everything connects" motif.
function NodeField({
  density = 0.00009,
  color = '33,212,253',
  linkColor = '20,92,255',
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf,
      nodes = [],
      w = 0,
      h = 0,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(70, Math.floor(w * h * density)));
      nodes = Array.from({
        length: count
      }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${linkColor},${(1 - d / 130) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${color},0.9)`;
        ctx.shadowColor = `rgba(${color},0.8)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(tick);
    }
    resize();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      ...style
    }
  });
}
Object.assign(window, {
  Icon,
  NodeField
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
