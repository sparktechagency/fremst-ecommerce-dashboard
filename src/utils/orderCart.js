export const LOCAL_STORAGE_KEY = "order_cart";

export function readCart() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function writeCart(cart) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

