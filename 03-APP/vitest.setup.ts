import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'
// `server-only` lanza fuera de un Server Component; en pruebas es inerte.
vi.mock('server-only', () => ({}))
