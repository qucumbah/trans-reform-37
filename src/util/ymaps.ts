import type ymaps2 from "yandex-maps";

declare global {
  interface window {
    ymaps: typeof ymaps2;
  }
}
