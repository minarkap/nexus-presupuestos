Text input for dark Nexus surfaces — cyan focus ring, optional label / leading icon / hint / error.

```jsx
<Input label="Correo" type="email" placeholder="hola@nexus.ad" iconLeft={<MailIcon/>} />
<Input label="Empresa" error="Campo requerido" />
```

Pass `error` to turn the field red and show the message (overrides `hint`). Controlled via `value` + `onChange`.
