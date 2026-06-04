# React Hooks — Complete Reference for Interview Prep

---

## 1. useState

```tsx
const [state, setState] = useState<S>(initialState: S | (() => S))
```

### Definition
Returns a stateful value and a function to update it. The component re-renders when the state updates.

### Setter behavior
- **Direct value**: `setState(newValue)` — replaces current state
- **Updater function**: `setState(prev => prev + 1)` — receives previous state; safe in closures and when multiple updates are batched
- **React 18+ batching**: All `setState` calls inside event handlers, timeouts, promises, and native events are batched into a single re-render

### Lazy initialization
Pass an initializer function for expensive computations:
```tsx
const [state, setState] = useState(() => heavyComputation(props));
```
Runs only once on mount. In Strict Mode (dev), it runs twice to detect side effects.

### Gotchas
- Setting the same value (via `Object.is` comparison) **skips** the re-render
- State updates are asynchronous — reading `state` immediately after `setState` gives the old value
- Objects and arrays are replaced, not merged (unlike class `setState`). Use spread or `useReducer` for nested updates

---

## 2. useEffect

```tsx
useEffect(effect: () => (void | (() => void)), deps?: any[])
```

### Definition
Performs side effects after React commits to the DOM. Fires **after** layout and paint (use `useLayoutEffect` if you need to fire before paint).

### Dependency patterns

| Deps | Behavior |
|---|---|
| **omitted** | Runs after **every** render (avoid unless intentional) |
| **`[]`** | Runs once on mount, cleanup on unmount (`componentDidMount` + `componentWillUnmount`) |
| **`[a, b]`** | Runs when any dependency changes (`componentDidUpdate`) |

### Cleanup function
Return a function to clean up subscriptions, timers, or event listeners:
```tsx
useEffect(() => {
  const sub = source.subscribe(handler);
  return () => sub.unsubscribe(); // runs on unmount AND before re-running
}, [source]);
```

### Stale closures
If the callback references a variable not listed in `deps`, it captures the old value:
```tsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []); // Bug: count is always 0 inside the closure
```
Fix: use functional setter `setCount(prev => prev + 1)` or include `count` in deps.

### Infinite loop trap
```tsx
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api').then(r => r.json()).then(setData);
}, [data]); // ❌ setData triggers re-render → effect re-runs → infinite loop
```
Fix: use `[]` if fetching once, or add proper conditions.

---

## 3. useRef

```tsx
const ref = useRef<T>(initialValue: T)
// ref.current — read/write without re-renders
```

### Definition
A mutable container whose `.current` property persists across renders. Mutating `.current` does **not** cause re-renders.

### Two primary uses

**1. DOM element access:**
```tsx
const inputRef = useRef<HTMLInputElement>(null!);
useEffect(() => { inputRef.current?.focus(); }, []);
return <input ref={inputRef} />;
```

**2. Mutable instance variables** (timers, previous values, subscriptions):
```tsx
const intervalRef = useRef<number | null>(null);
const start = () => { intervalRef.current = window.setInterval(tick, 1000); };
const stop = () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
```

### Previous value pattern
```tsx
const prevRef = useRef(value);
useEffect(() => { prevRef.current = value; }, [value]);
// prevRef.current holds the previous render's value
```

### Gotchas
- `useRef` is **not** a ref to a value — it **is** a ref. Changing `.current` doesn't notify anything
- No built-in observer pattern — if you need reactivity on ref changes, use `useState` or `useCallback` with a ref
- TypeScript DOM refs: `useRef<HTMLDivElement>(null)` — the type parameter is the element type

---

## 4. useMemo

```tsx
const memoizedValue = useMemo<T>(compute: () => T, deps: any[])
```

### Definition
Memoizes the result of a computation. Only recomputes when dependencies change. Strictly a **performance optimization**.

### When to use
- Expensive calculations (sorting/filtering large arrays, data transformations)
- Stabilizing object/array references passed as props to child components or used in dependency arrays
- Memoizing JSX subtrees to skip re-render portions of the tree

```tsx
const sortedVehicles = useMemo(
  () => vehicles.sort((a, b) => b.price - a.price),
  [vehicles]
);

const child = useMemo(() => <ExpensiveTree data={data} />, [data]);
```

### When NOT to use
- Trivial operations (`a + b`, string concatenation) — overhead of the hook itself may exceed the cost
- Values only used in render — React rendering is fast; premature memoization adds complexity

### Gotchas
- React **may** garbage-collect memoized values and recompute (e.g., during memory pressure). Never write code that depends on `useMemo` not recomputing
- If `compute` references variables not in `deps`, you get stale results
- Use `useMemo` only after profiling shows a performance problem — don't sprinkle it everywhere

---

## 5. useCallback

```tsx
const memoizedFn = useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[])
// Semantically equivalent to: useMemo(() => fn, deps)
```

### Definition
Returns a **stable function reference** across renders — identity is preserved as long as dependencies haven't changed.

### Why it matters
Every render creates a new function. When passed to `React.memo`-wrapped children, the child sees a new prop each time and re-renders unnecessarily:
```tsx
const Child = React.memo(({ onClick }: { onClick: () => void }) => { ... });

function Parent() {
  const handleClick = useCallback(() => console.log('clicked'), []);
  return <Child onClick={handleClick} />;
}
```

### When to use
- Passing callbacks to `React.memo`-wrapped children
- Functions used as dependencies in other hooks (`useEffect`, `useMemo`, other `useCallback`)
- Custom hooks returning callbacks

### When NOT to use
- DOM event handlers (inline is fine — React is fast enough)
- Every single callback — over-optimization is worse than under-optimization
- Internal functions not passed to children

### Gotchas
- `useCallback(fn, deps)` is identical to `useMemo(() => fn, deps)` — understand both
- `useCallback` does **nothing** to prevent the function from being created; it controls whether the **old** reference is returned

---

## 6. useContext

```tsx
const value = useContext<T>(context: React.Context<T>)
```

### Definition
Subscribes to a React context and returns its current value. The component always re-renders when the context value changes.

### Three-step pattern
```tsx
// 1. Create
const ThemeContext = createContext('light');

// 2. Provide
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

// 3. Consume
const theme = useContext(ThemeContext);
```

### Multiple contexts
```tsx
const user = useContext(UserContext);
const theme = useContext(ThemeContext);
const locale = useContext(LocaleContext);
```
No nesting hell like `<Context.Consumer>` — clean and linear.

### Performance
- **Every** consumer re-renders when the context value changes, even if it only reads a subset
- Split contexts by domain (user, theme, locale) to isolate re-renders:
  ```tsx
  // Bad — all consumers re-render on ANY change
  <AppContext.Provider value={{ user, theme, notifications }}>
  
  // Good — isolated re-render zones
  <UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
  ```
- Always memoize the provider value to prevent cascading re-renders:
  ```tsx
  const value = useMemo(() => ({ user, theme }), [user, theme]);
  ```

### Gotchas
- `createContext(defaultValue)` — the default is only used when a component consumes the context **without** a matching provider above it
- No `shouldComponentUpdate` equivalent for context consumers — if you need fine-grained reactivity, consider Redux or `useSelector`

---

## 7. useReducer

```tsx
const [state, dispatch] = useReducer<R extends React.Reducer<any, any>>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  initializer?: (initial: S) => S  // optional — for lazy init
)
```

### Definition
Alternative to `useState` for complex state logic. The reducer is a pure function `(state, action) => nextState`. `dispatch` sends actions to the reducer.

### When to choose useReducer over useState
| Condition | Prefer |
|---|---|
| State depends on previous state heavily | `useReducer` |
| Multiple sub-values (form fields, nested objects) | `useReducer` |
| Complex state transitions (loading/success/error) | `useReducer` |
| Single independent value | `useState` |
| Simple toggle/counter | `useState` |

### Example
```tsx
type State = { count: number; step: number };
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'setStep':   return { ...state, step: action.payload };
    case 'reset':     return { count: 0, step: 1 };
    default:          return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
```

### Lazy initialization
Pass a third argument to compute initial state lazily:
```tsx
const init = (initialCount: number) => ({ count: initialCount, step: 1 });
const [state, dispatch] = useReducer(reducer, props.initialCount, init);
```

### Stable dispatch
`dispatch` identity is **stable** across renders (like a ref). No need for `useCallback` when passing `dispatch` down:
```tsx
return <Child onAction={dispatch} />; // ✅ dispatch never changes
```

### Redux vs useReducer
| Feature | useReducer | Redux Toolkit |
|---|---|---|
| Scope | Component-local | Global store |
| Middleware | None | Thunks, sagas, listeners |
| DevTools | None | Redux DevTools |
| Persistence | Manual | Middleware |
| When to use | Form state, toggles, counters | Cross-component shared state, API caching |

---

## Key Interview Tips

### Rules of Hooks
1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — function components or custom hooks (not regular JS functions)
3. The order of hook calls must be identical between renders — React relies on call order to associate state with the correct hook

### Stale Closures
A stale closure captures a variable from an older render. Common in `useEffect` and `useCallback`:
```tsx
// Problem: count is stale inside the timeout
const [count, setCount] = useState(0);
const log = useCallback(() => console.log(count), []); // always logs 0

// Solution: include all referenced values in deps, or use a ref
const countRef = useRef(count);
countRef.current = count;
const log = useCallback(() => console.log(countRef.current), []);
```

### Infinite Loops in useEffect
Usually caused by missing or incorrect deps:
```tsx
useEffect(() => {
  setData(fetchData()); // ❌ setData triggers re-render → effect re-runs
}); // ❌ no deps → runs after every render
```

### Custom Hooks
Extract and reuse stateful logic. Convention: start with `use`:
```tsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const h = () => setOnline(navigator.onLine);
    window.addEventListener('online', h);
    window.addEventListener('offline', h);
    return () => { window.removeEventListener('online', h); window.removeEventListener('offline', h); };
  }, []);
  return online;
}
```
Custom hooks compose other hooks internally — they are the primary mechanism for code reuse in functional React.

### React 18 Strict Mode Double-Invoke
In development with `<StrictMode>`, React intentionally double-invokes:
- **Component bodies** (the render function)
- **State initializers** (`useState(() => ...)`)
- **Reducers** (`useReducer`)
- **useEffect callbacks** (mount → cleanup → mount again)

This surfaces bugs caused by impure functions. The behavior disappears in production. It does **not** apply to refs (`useRef` initializer runs once).

### Performance Checklist
1. Profile first — don't optimize prematurely
2. `React.memo` wraps the **output** (the component)
3. `useMemo` memoizes a **value**
4. `useCallback` memoizes a **function** (which is `useMemo(() => fn, deps)`)
5. `useRef` holds mutable data **without** re-render cost
6. Split contexts to prevent broad re-render cascades
7. `useId` for accessible, server-safe unique IDs (React 18)
8. `useTransition` for marking non-urgent state updates (React 18)
