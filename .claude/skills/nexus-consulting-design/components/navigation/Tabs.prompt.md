Underline tab bar with gradient active indicator.

```jsx
const [tab, setTab] = React.useState('resumen');
<Tabs value={tab} onChange={setTab} items={[
  { id: 'resumen', label: 'Resumen' },
  { id: 'flujos', label: 'Flujos' },
  { id: 'datos', label: 'Datos' },
]} />
```
