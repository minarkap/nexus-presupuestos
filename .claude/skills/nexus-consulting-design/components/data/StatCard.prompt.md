Dashboard KPI tile — uppercase label, big mono value, trend delta, left accent bar.

```jsx
<StatCard label="Tareas automatizadas" value="1,284" delta="18%" trend="up" accent="cyan" />
<StatCard label="Tiempo manual" value="42" unit="h" delta="9%" trend="down" accent="blue" />
```

`trend="up"` shows green ▴, `down` shows red ▾. `accent` sets the left bar (cyan/blue). Values render in IBM Plex Mono for that data feel.
