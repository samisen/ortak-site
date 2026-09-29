"use client";

import { ConfigProvider, App as AntApp, theme } from "antd";
import trTR from "antd/locale/tr_TR";
import type { ReactNode } from "react";
import { DemoSaglayici } from "@/lib/demo-store";

const GOLD = "#C8A34A";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={trTR}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: GOLD,
          colorInfo: GOLD,
          colorSuccess: "#5AA97B",
          colorWarning: "#C4703F",
          colorError: "#C0553F",

          colorBgBase: "#08080A",
          colorTextBase: "#EFEBE3",

          colorBgContainer: "#101013",
          colorBgElevated: "#17171B",
          colorBgLayout: "#08080A",
          colorBorder: "#26262E",
          colorBorderSecondary: "#1E1E24",

          borderRadius: 10,
          fontFamily:
            'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 14,
          controlHeight: 38,
          wireframe: false,
        },
        components: {
          Button: { fontWeight: 500, primaryShadow: "none", defaultShadow: "none" },
          Card: { paddingLG: 20 },
          Tag: { defaultBg: "#1E1E24", defaultColor: "#93908A" },
          Segmented: { itemSelectedBg: "#26262E", itemSelectedColor: GOLD, trackBg: "#101013" },
          Steps: { colorPrimary: GOLD },
          Slider: { trackBg: GOLD, handleColor: GOLD, trackHoverBg: "#E3CB84" },
          Input: { colorBgContainer: "#17171B" },
          InputNumber: { colorBgContainer: "#17171B" },
          Select: { colorBgContainer: "#17171B", optionSelectedBg: "#26262E" },
          Modal: { contentBg: "#101013", headerBg: "#101013" },
          Drawer: { colorBgElevated: "#101013" },
          Table: { headerBg: "#17171B", rowHoverBg: "#17171B" },
          Statistic: { contentFontSize: 26 },
          Progress: { defaultColor: GOLD },
          Tabs: { inkBarColor: GOLD, itemSelectedColor: GOLD },
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
