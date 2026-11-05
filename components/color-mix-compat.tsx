"use client";

import { useEffect } from "react";

/**
 * 旧版 Android WebView 兼容标记。
 *
 * Tailwind/Lightning CSS 会为 color-mix() 生成纯色兜底；旧内核不支持 color-mix()
 * 时会直接使用这些纯色，导致「图标背景与图标同色」「标签背景与文字同色」，
 * 看起来就是一整块纯色图块。这里只在检测失败时打标记，
 * styles/color-mix-compat.css 里的覆盖规则才会生效；现代浏览器不受影响。
 */
export function ColorMixCompat() {
  useEffect(() => {
    const root = document.documentElement;
    let supported = false;
    try {
      supported = CSS.supports("color", "color-mix(in srgb, red 50%, blue)");
      if (supported) {
        const probe = document.createElement("div");
        probe.style.color = "color-mix(in srgb, red 50%, blue)";
        document.body.appendChild(probe);
        const computed = getComputedStyle(probe).color.replace(/\s+/g, "");
        probe.remove();
        supported =
          computed !== "rgb(255,0,0)" &&
          computed !== "rgb(0,0,255)" &&
          computed !== "rgb(0,0,0)";
      }
    } catch {
      supported = false;
    }
    if (!supported) {
      root.dataset.colorMix = "off";
    } else {
      delete root.dataset.colorMix;
    }
  }, []);

  return null;
}
