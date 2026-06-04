# EagleVisionEdge — React Interview Prep

A React + TypeScript application (Next.js App Router + Vite) demonstrating modern React patterns alongside **React Class Components** for interview preparation.

---

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

```bash
npm install
npm run dev      # Vite dev server (localhost:5173)
# or
npm run build    # Production build
npm run preview  # Preview production build
```

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) + Vite |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Icons | lucide-react, react-icons |
| Charts | recharts |
| State (global) | Redux Toolkit + react-redux |
| Routing | next/router (App Router) |

---

## React Concepts Covered

### 1. Functional Components with Hooks

The codebase uses functional components exclusively in `components/` and `app/`. Below are full definitions for every React hook.

---

#### `useState`

```tsx
const [state, setState] = useState<S>(initialState: S | (() => S))
```

- **Purpose**: Creates local state that persists across re-renders. Updating triggers a re-render.
- **Setter forms**:
  - Direct: `setState(newValue)` — replaces state
  - Functional: `setState(prev => prev + 1)` — safe when new value depends on old; avoids stale closures
- **Lazy initialization**: Pass a function `useState(() => expensiveComputation())` — runs once on mount
- **Batching**: React 18 batches all `setState` calls (including inside timeouts/promises) into a single re-render
- **StrictMode double-invoke**: In dev, initializer runs twice to detect side effects
- **File**: `components/VehicleCard.tsx:9` — image loading / error state

---

#### `useEffect`

```tsx
useEffect(effect: () => (void | (() => void)), deps?: any[])
```

- **Purpose**: Runs side effects after React has committed to the DOM (fetching, subscriptions, DOM mutations, logging).
- **Timing**: Fires **after** layout and paint (unlike `useLayoutEffect` which fires before paint).
- **Patterns**:
  | Deps | Behavior |
  |---|---|
  | omitted | Runs after **every** render (avoid unless intentional) |
  | `[]` | Runs once on mount (like `componentDidMount`) |
  | `[a, b]` | Runs when any dep changes (like `componentDidUpdate`) |
- **Cleanup**: Return a function — runs on unmount **and** before re-running the effect (prevents stale subscriptions)
- **Stale closure trap**: If `effect` references a variable not in `deps`, it captures the old value. Fix: include it in deps or use a ref.
- **Linting**: Use `eslint-plugin-react-hooks` — `react-hooks/exhaustive-deps` rule catches missing deps.

---

#### `useRef`

```tsx
const ref = useRef<T>(initialValue: T)
// ref.current — read/write without causing re-renders
```

- **Purpose**: A mutable box that persists across renders. Changing `.current` does **not** trigger a re-render.
- **Two primary uses**:
  1. **DOM refs**: `<div ref={myRef}>` — access native DOM element
  2. **Mutable instance variables**: timers, previous values, subscriptions, any value that must survive renders but shouldn't trigger updates
- **Previous value pattern**:
  ```tsx
  const prevCount = useRef(count);
  useEffect(() => { prevCount.current = count; }, [count]);
  ```
- **Notable**: `useRef(null)` returns `{ current: null }` — TypeScript often needs `useRef<HTMLDivElement>(null)` for DOM refs.

---

#### `useMemo`

```tsx
const memoizedValue = useMemo<T>(compute: () => T, deps: any[])
```

- **Purpose**: Memoizes a **computed value** — only recomputes when deps change. Avoids expensive recalculations on every render.
- **Strictly for performance optimization** — React may garbage-collect memoized values and recompute (e.g., in memory-pressure scenarios). Never write code that assumes `useMemo` was not recomputed.
- **When to use**:
  - Expensive transformations (sorting, filtering large arrays)
  - Creating objects/arrays that are deps of child `useEffect` or `useMemo`
  - Memoizing JSX to skip re-rendering portions of the tree
- **When NOT to use**: Trivial operations (`a + b`), values only used in render (React is already fast enough).
- **Gotcha**: If `compute` references external values not in `deps`, you get stale results.

---

#### `useCallback`

```tsx
const memoizedFn = useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[])
// Equivalent to: useMemo(() => fn, deps)
```

- **Purpose**: Returns a **stable function reference** across renders — the same function identity as long as deps haven't changed.
- **Why it matters**: Prevents unnecessary re-renders when passing callbacks to `React.memo`-wrapped children. Without `useCallback`, a new function is created every render, breaking shallow comparison.
- **When to use**:
  - Passing callbacks to optimized child components (`React.memo`)
  - Functions used as deps in other hooks (`useEffect`, `useMemo`)
- **When NOT to use**: Every callback — over-optimization. Start without it, profile, then add.

---

#### `useContext`

```tsx
const value = useContext<T>(context: React.Context<T>)
```

- **Purpose**: Subscribes to a React context and returns its current value. Equivalent to `Context.Consumer` in class components.
- **How it works**:
  1. Create: `const MyCtx = createContext(defaultValue)`
  2. Provide: `<MyCtx.Provider value={someValue}>`
  3. Consume: `const val = useContext(MyCtx)`
- **Re-render behavior**: Component always re-renders when context value changes, even if it only uses part of the value. Split contexts by domain to avoid unnecessary re-renders.
- **Multiple contexts**: Can call `useContext` multiple times in one component — no nesting hell like `Context.Consumer`.
- **Gotcha**: Providing a new object/array on every render (`<Ctx.Provider value={{ a: 1 }}>`) causes all consumers to re-render. Memoize the value with `useMemo`.
- **File**: `src/contexts/`

---

#### `useReducer`

```tsx
const [state, dispatch] = useReducer<R extends React.Reducer<any, any>>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  initializer?: (init: S) => S  // optional lazy initializer
)
```

- **Purpose**: Alternative to `useState` for complex state logic where the next state depends on the previous one and/or involves multiple sub-values.
- **Pattern**:
  ```tsx
  type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset'; payload: number };
  const reducer = (state: number, action: Action): number => {
    switch (action.type) {
      case 'increment': return state + 1;
      case 'decrement': return state - 1;
      case 'reset':     return action.payload;
      default:          return state;
    }
  };
  ```
- **When `useReducer` > `useState`**:
  - State logic is complex (multiple sub-values, many transitions)
  - Next state depends heavily on previous state
  - State updates are easier to reason about as discrete actions (like Redux)
  - You want to pass `dispatch` down instead of callbacks (stable reference — no `useCallback` needed)
- **Lazy initialization**: Pass a third argument `(initialArg) => initialValue` for expensive initial state computation.
- **Redux comparison**: `useReducer` is local-scope only — no middleware, no DevTools, no global store. It's just a reducer pattern for component-level state. For global state, use Redux Toolkit (`src/store/`).

---

| Hook | File Example | Purpose |
|---|---|---|
| `useState` | `components/VehicleCard.tsx:9` | Image loading / error state |
| `useEffect` | `components/*` (various) | Side effects, data fetching |
| `useRef` | — | DOM refs and persisted mutable values |
| `useMemo` | — | Expensive computation memoization |
| `useCallback` | — | Stable function references for child components |
| `useContext` | `src/contexts/` | Shared state without prop drilling |
| `useReducer` | `src/store/` (Redux) | Complex state transitions |

### 2. Class Components (Interview Focus)

The codebase uses functional components, but the following **class component patterns** are critical for interviews:

#### Lifecycle Methods Map

| Class Component | Functional Equivalent | Fires When |
|---|---|---|
| `constructor()` | `useState` initializer / `useRef` | Before mount |
| `componentDidMount()` | `useEffect(fn, [])` | After first render |
| `componentDidUpdate(prevProps)` | `useEffect(fn, [deps])` | After deps change |
| `componentWillUnmount()` | `useEffect(() => fn, [])` cleanup | Before unmount |
| `shouldComponentUpdate()` | `React.memo` / `useMemo` | Before re-render |
| `getDerivedStateFromProps()` | Derived state during render | Every render |
| `getSnapshotBeforeUpdate()` | Capture DOM info before update | Before DOM mutation |

#### Class Component Example (Interview Template)

```tsx
interface Props { initialCount: number }
interface State { count: number; isRunning: boolean }

class Counter extends React.Component<Props, State> {
  private intervalRef: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { count: props.initialCount, isRunning: false };
  }

  componentDidMount(): void {
    console.log('Mounted');
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (prevState.isRunning !== this.state.isRunning) {
      this.toggleInterval();
    }
  }

  componentWillUnmount(): void {
    this.clearTimer();
  }

  private toggleInterval = (): void => {
    if (this.state.isRunning) {
      this.intervalRef = window.setInterval(() => {
        this.setState(prev => ({ count: prev.count + 1 }));
      }, 1000);
    } else {
      this.clearTimer();
    }
  };

  private clearTimer = (): void => {
    if (this.intervalRef !== null) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ isRunning: !this.state.isRunning })}>
          {this.state.isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => this.setState({ count: this.props.initialCount })}>
          Reset
        </button>
      </div>
    );
  }
}
```

#### Key Class Component Interview Topics

- **`this.setState` is async** — use callback form `setState((prev, props) => nextState)`
- **Binding event handlers** — arrow function class properties vs `this.handleClick = this.handleClick.bind(this)` in constructor
- **`shouldComponentUpdate` + `React.PureComponent`** — shallow comparison optimization
- **Error Boundaries** — only achievable with `componentDidCatch` and `getDerivedStateFromError` (no hook equivalent)
- **`defaultProps`** vs default parameters
- **`displayName`** for debugging HOCs

### 3. Hooks → Class Component Translation

```tsx
// Hook
function Timer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS(x => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{s}s</p>;
}

// Equivalent Class Component
class Timer extends React.Component<{}, { seconds: number }> {
  state = { seconds: 0 };
  intervalId: number | null = null;

  componentDidMount() {
    this.intervalId = window.setInterval(() => {
      this.setState(prev => ({ seconds: prev.seconds + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  render() {
    return <p>{this.state.seconds}s</p>;
  }
}
```

### 4. Custom Hooks

Located in `src/hooks/`. Examples:
- `useLocalStorage` — persistent state
- `useFetch` — data fetching with loading/error

### 5. State Management

- **Local state**: `useState` / `useReducer` inside components
- **Global state**: Redux Toolkit (`src/store/`)
- **Context**: React Context API (`src/contexts/`)

---

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── data/           # Mock data
├── hooks/          # Custom hooks
├── layouts/        # Layout components
├── lib/            # Utility functions
├── pages/          # Route pages
├── routes/         # Route configuration
├── services/       # API service layer
├── store/          # Redux Toolkit slices
├── styles/         # Global CSS / Tailwind
├── types/          # TypeScript type definitions
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

---

## Interview Q&A

**Q: When would you choose a class component over a function component today?**
A: Error boundaries — `componentDidCatch` has no hook equivalent. Also when maintaining legacy codebases.

**Q: How does the Rules of Hooks differ from class component lifecycle?**
A: Hooks must be called unconditionally at the top level of every render. Class lifecycle methods are fixed named methods — you cannot conditionally call `componentDidMount`.

**Q: Where do side effects go in class components vs hooks?**
A: Class: `componentDidMount` + `componentDidUpdate` + `componentWillUnmount`. Hooks: `useEffect` consolidates all three.

**Q: How do you prevent unnecessary re-renders?**
A: Class: `shouldComponentUpdate` / `React.PureComponent`. Hooks: `React.memo` + `useMemo` + `useCallback`.

**Q: What can class components do that hooks cannot?**
A: Error boundaries (`componentDidCatch` / `getDerivedStateFromError`). Hooks can work around this via a wrapper class component.

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript type check only |
