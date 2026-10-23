import { create } from "zustand";

// Global toast state. The Toast overlay is mounted once in the root layout, so
// toasts survive screen changes (e.g. a success toast fired right before
// router.replace still plays out). Screens never render toasts themselves —
// they call `toast.*` from anywhere (even outside React, e.g. lib helpers).

export type ToastType = "success" | "error" | "info" | "warn";

export type ToastAction = { label: string; onPress: () => void };

export type ToastConfirmOptions = {
  // Stable key per destructive action (e.g. `delete-product-${id}`) so the
  // two-step guard only completes when the SAME control is pressed twice.
  key: string;
  title: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
};

export type ToastChoiceOptions = {
  title: string;
  message?: string;
  // One button per option (plus an optional "Cancel"), rendered in a row.
  actions: ToastAction[];
  // Called when the toast goes away without any action being pressed
  // (auto-dismiss timeout, or another toast replacing it). Lets callers
  // awaiting a choice resolve instead of hanging forever.
  onDismiss?: () => void;
  durationMs?: number;
};

type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  actions?: ToastAction[];
  // Armed two-step confirmation: null when nothing is pending.
  pendingKey: string | null;
  onDismiss?: () => void;
  show: (
    type: ToastType,
    title: string,
    message?: string,
    action?: ToastAction | ToastAction[]
  ) => void;
  choose: (opts: ToastChoiceOptions) => void;
  hide: () => void;
  confirm: (opts: ToastConfirmOptions) => void;
};

// Auto-dismiss budget per type — errors linger a bit longer than successes.
const DURATION_MS: Record<ToastType, number> = {
  success: 3000,
  info: 3000,
  error: 4500,
  warn: 5000,
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleHide = (ms: number) => {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => useToastStore.getState().hide(), ms);
};

const asActions = (action?: ToastAction | ToastAction[]): ToastAction[] | undefined =>
  !action ? undefined : Array.isArray(action) ? action : [action];

export const useToastStore = create<ToastState>((set, get) => {
  // Fire (and clear) a pending choice-dismiss callback so a replaced or
  // dismissed choice toast resolves its awaiting caller with "no selection".
  const fireDismiss = () => {
    const cb = get().onDismiss;
    if (cb) {
      set({ onDismiss: undefined });
      cb();
    }
  };

  return {
    visible: false,
    type: "info",
    title: "",
    message: undefined,
    actions: undefined,
    pendingKey: null,
    onDismiss: undefined,

    show: (type, title, message, action) => {
      fireDismiss();
      scheduleHide(DURATION_MS[type]);
      // Any plain toast disarms a pending confirmation.
      set({
        visible: true,
        type,
        title,
        message,
        actions: asActions(action),
        pendingKey: null,
      });
    },

    choose: ({ title, message, actions, onDismiss, durationMs }) => {
      fireDismiss();
      scheduleHide(durationMs ?? DURATION_MS.info);
      set({
        visible: true,
        type: "info",
        title,
        message,
        actions,
        pendingKey: null,
        onDismiss,
      });
    },

    hide: () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      // Dismissing also disarms a pending confirmation so a stale second tap
      // can't fire an action the user no longer sees.
      set({
        visible: false,
        message: undefined,
        actions: undefined,
        pendingKey: null,
      });
      fireDismiss();
    },

    confirm: ({ key, title, message, onConfirm }) => {
      fireDismiss();

      if (get().pendingKey === key) {
        // Second press of the same control within the window → run it.
        get().hide();
        void onConfirm();
        return;
      }

      scheduleHide(DURATION_MS.warn);
      set({
        visible: true,
        type: "warn",
        title,
        message: message ?? "Press again to confirm.",
        actions: undefined,
        pendingKey: key,
      });
    },
  };
});

// Imperative helper so non-component code (services, lib) can raise toasts.
export const toast = {
  success: (title: string, message?: string, action?: ToastAction | ToastAction[]) =>
    useToastStore.getState().show("success", title, message, action),
  error: (title: string, message?: string, action?: ToastAction | ToastAction[]) =>
    useToastStore.getState().show("error", title, message, action),
  info: (title: string, message?: string, action?: ToastAction | ToastAction[]) =>
    useToastStore.getState().show("info", title, message, action),
  warn: (title: string, message?: string, action?: ToastAction | ToastAction[]) =>
    useToastStore.getState().show("warn", title, message, action),
  confirm: (opts: ToastConfirmOptions) => useToastStore.getState().confirm(opts),
  choose: (opts: ToastChoiceOptions) => useToastStore.getState().choose(opts),
  hide: () => useToastStore.getState().hide(),
};
