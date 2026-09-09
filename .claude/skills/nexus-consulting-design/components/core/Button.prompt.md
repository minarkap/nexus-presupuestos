Primary call-to-action button — use the gradient `primary` for the single main action on a view; `secondary`/`outline`/`ghost` for supporting actions.

```jsx
<Button variant="primary" size="lg" iconRight={<ArrowIcon/>}>Descubrir soluciones</Button>
<Button variant="outline">Hablemos</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
```

Variants: `primary` (blue→cyan gradient + glow), `secondary` (graphite fill), `outline`, `ghost`, `danger`. Sizes: `sm` / `md` / `lg`. Props: `full` stretches to container width; `iconLeft` / `iconRight` accept any node; `disabled` dims to 45%. Hover lifts the glow / lightens fill; press nudges down 1px.
