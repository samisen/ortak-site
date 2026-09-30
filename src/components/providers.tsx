"use client";

import { ConfigProvider, App as AntApp, theme } from "antd";
import trTR from "antd/locale/tr_TR";
import type { ReactNode } from "react";
import { DemoSaglayici } from "@/lib/demo-store";
import { TemaSaglayici, useTema } from "@/lib/tema";

function AntdTema({ children }: { children: ReactNode }) {
  const { tema, palet } = useTema();
  const koyu = tema === "dark";

  return (
    <ConfigProvider
      locale={trTR}
      theme={{
        algorithm: koyu ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: palet.gold,
          colorInfo: palet.gold,
          colorSuccess: palet.verified,
          colorWarning: palet.alert,
          colorError: palet.error,

          colorBgBase: palet.ink,
          colorTextBase: palet.cream,

          colorBgContainer: palet.surface,
          colorBgElevated: koyu ? palet.surface2 : palet.surface,
          colorBgLayout: palet.ink,
          colorBorder: palet.line,
          colorBorderSecondary: palet.lineSoft,

          borderRadius: 10,
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 14,
          controlHeight: 38,
          wireframe: false,
        },
        components: {
          Button: { fontWeight: 500, primaryShadow: "none", defaultShadow: "none" },
          Card: { paddingLG: 20 },
          Tag: { defaultBg: palet.surface2, defaultColor: koyu ? "#93908A" : "#5E5B54" },
          Segmented: {
            itemSelectedBg: koyu ? palet.line : palet.surface,
            itemSelectedColor: palet.gold,
            trackBg: koyu ? palet.surface : palet.surface3,
          },
          Steps: { colorPrimary: palet.gold },
          Slider: { trackBg: palet.gold, handleColor: palet.gold, trackHoverBg: palet.goldSoft },
          Input: { colorBgContainer: koyu ? palet.surface2 : palet.surface },
          InputNumber: { colorBgContainer: koyu ? palet.surface2 : palet.surface },
          Select: {
            colorBgContainer: koyu ? palet.surface2 : palet.surface,
            optionSelectedBg: koyu ? palet.line : palet.surface3,
          },
          Modal: { contentBg: palet.surface, headerBg: palet.surface },
          Drawer: { colorBgElevated: palet.surface },
          Table: { headerBg: palet.surface2, rowHoverBg: palet.surface2 },
          Statistic: { contentFontSize: 26 },
          Progress: { defaultColor: palet.gold },
          Tabs: { inkBarColor: palet.gold, itemSelectedColor: palet.gold },
          Result: { colorBgContainer: "transparent" },
        },
      }}
    >
      <AntApp>
        <DemoSaglayici>{children}</DemoSaglayici>
      </AntApp>
    </ConfigProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TemaSaglayici>
      <AntdTema>{children}</AntdTema>
    </TemaSaglayici>
  );
}
