"use client";

import { useEffect } from "react";

const VIEWPORT_HEIGHT_VAR = "--app-viewport-height";

function syncViewportHeight() {
  // window.innerHeight 在 Android WebView 里实测可用；部分内核的 100vh/100lvh
  // 会在首次布局时被锁成异常值，所以这里把实测值写成 px，CSS 优先消费它。
  const height = Math.round(
    window.innerHeight || document.documentElement.clientHeight || 0,
  );
  if (height > 0) {
    document.documentElement.style.setProperty(VIEWPORT_HEIGHT_VAR, `${height}px`);
  }
}

/**
 * 把真实可用视口高度同步到 --app-viewport-height。
 *
 * 只做尺寸同步，不参与任何业务状态；移动端 CSS 用
 * var(--app-viewport-height, 100vh) 作为虚拟手机与页面容器的共同高度基准。
 */
export function ViewportHeightSync() {
  useEffect(() => {
    syncViewportHeight();

    const viewport = window.visualViewport;
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);
    window.addEventListener("pageshow", syncViewportHeight);
    viewport?.addEventListener("resize", syncViewportHeight);
    viewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
      window.removeEventListener("pageshow", syncViewportHeight);
      viewport?.removeEventListener("resize", syncViewportHeight);
      viewport?.removeEventListener("scroll", syncViewportHeight);
    };
  }, []);

  return null;
}
