// src/lib/component-docs.ts

/**
 * Component Documentation System
 *
 * This system helps generate and organize component documentation
 * for better maintainability and team collaboration.
 */

export interface ComponentDocumentation {
  name: string;
  description: string;
  props: ComponentProp[];
  examples: ComponentExample[];
  variants?: ComponentVariant[];
  designTokens?: DesignToken[];
  accessibility?: AccessibilityInfo;
  usage?: UsageGuidelines;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: string | number | boolean;
  description: string;
  examples?: string[];
}

export interface ComponentExample {
  title: string;
  description?: string;
  code: string;
  preview?: string;
}

export interface ComponentVariant {
  name: string;
  description: string;
  props: Record<string, string | number | boolean>;
}

export interface DesignToken {
  category: "color" | "spacing" | "typography" | "shadow" | "border";
  name: string;
  value: string;
  usage: string;
}

export interface AccessibilityInfo {
  ariaProps: string[];
  keyboardNavigation: string[];
  screenReader: string;
  colorContrast: string;
}

export interface UsageGuidelines {
  when: string;
  whenNot: string;
  bestPractices: string[];
  commonMistakes: string[];
}

// Enhanced Button Documentation Example
export const ButtonDocumentation: ComponentDocumentation = {
  name: "Button",
  description: "نظام أزرار محسن مع متغيرات متعددة وحالات مختلفة",
  props: [
    {
      name: "variant",
      type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info' | 'gradient'",
      required: false,
      default: "'default'",
      description: "نوع الزر المراد عرضه",
      examples: ["'default'", "'success'", "'gradient'"],
    },
    {
      name: "size",
      type: "'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'",
      required: false,
      default: "'default'",
      description: "حجم الزر",
      examples: ["'sm'", "'lg'", "'xl'"],
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      default: false,
      description: "يظهر الزر في حالة تحميل",
    },
    {
      name: "loadingText",
      type: "string",
      required: false,
      description: "النص المعروض أثناء التحميل",
    },
    {
      name: "leftIcon",
      type: "React.ReactNode",
      required: false,
      description: "أيقونة على اليسار",
    },
    {
      name: "rightIcon",
      type: "React.ReactNode",
      required: false,
      description: "أيقونة على اليمين",
    },
  ],
  examples: [
    {
      title: "الاستخدام الأساسي",
      description: "زر بسيط بالتصميم الافتراضي",
      code: `<Button>انقر هنا</Button>`,
    },
    {
      title: "زر مع أيقونة",
      description: "زر يحتوي على أيقونة",
      code: `<Button leftIcon={<Plus className="h-4 w-4" />}>إضافة عنصر</Button>`,
    },
    {
      title: "زر في حالة تحميل",
      description: "زر يظهر حالة التحميل",
      code: `<Button loading loadingText="جاري التحميل...">حفظ</Button>`,
    },
  ],
  variants: [
    {
      name: "Success Button",
      description: "زر للإجراءات الناجحة",
      props: { variant: "success" },
    },
    {
      name: "Warning Button",
      description: "زر للتحذيرات",
      props: { variant: "warning" },
    },
    {
      name: "Gradient Button",
      description: "زر بخلفية متدرجة",
      props: { variant: "gradient" },
    },
  ],
  designTokens: [
    {
      category: "color",
      name: "primary",
      value: "oklch(0.66 0.1642 24.38)",
      usage: "اللون الأساسي للأزرار",
    },
    {
      category: "spacing",
      name: "button-padding",
      value: "0.5rem 1rem",
      usage: "المسافة الداخلية للأزرار",
    },
  ],
  accessibility: {
    ariaProps: ["aria-label", "aria-pressed", "aria-disabled"],
    keyboardNavigation: ["Tab للتنقل", "Enter/Space للتفعيل"],
    screenReader: "يدعم قارئات الشاشة مع وصف مناسب",
    colorContrast: "نسبة تباين 4.5:1 كحد أدنى",
  },
  usage: {
    when: "استخدم هذا المكون عندما تحتاج لزر تفاعلي يقوم بإجراء معين",
    whenNot: "لا تستخدمه للروابط البسيطة، استخدم مكون Link بدلاً من ذلك",
    bestPractices: [
      "استخدم نصوص واضحة ومفهومة",
      "اختر المتغير المناسب حسب السياق",
      "تأكد من وجود حالة تحميل للإجراءات الطويلة",
    ],
    commonMistakes: [
      "استخدام متغير خاطئ للسياق",
      "عدم إظهار حالة التحميل",
      "استخدام نص غير واضح",
    ],
  },
};

// Documentation Generator Function
export function generateComponentDocs(docs: ComponentDocumentation): string {
  const defaultValue = (prop: ComponentProp): string => {
    if (prop.default === undefined) return "-";
    if (typeof prop.default === "string") return prop.default;
    if (typeof prop.default === "boolean") return prop.default.toString();
    if (typeof prop.default === "number") return prop.default.toString();
    return "-";
  };

  return `
  # ${docs.name}
  
  ${docs.description}
  
  ## الخصائص (Props)
  
  | الاسم | النوع | مطلوب | الافتراضي | الوصف |
  |-------|--------|--------|-----------|--------|
  ${docs.props
    .map(
      (prop) =>
        `| ${prop.name} | \`${prop.type}\` | ${
          prop.required ? "نعم" : "لا"
        } | ${defaultValue(prop)} | ${prop.description} |`
    )
    .join("\n")}
  
  ## الأمثلة
  
  ${docs.examples
    .map(
      (example) => `
  ### ${example.title}
  
  ${example.description || ""}
  
  \`\`\`tsx
  ${example.code}
  \`\`\`
  `
    )
    .join("\n")}
  
  ${
    docs.variants
      ? `
  ## المتغيرات
  
  ${docs.variants
    .map(
      (variant) => `
  ### ${variant.name}
  
  ${variant.description}
  
  \`\`\`tsx
  <${docs.name} ${Object.entries(variant.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")} />
  \`\`\`
  `
    )
    .join("\n")}
  `
      : ""
  }
  
  ${
    docs.accessibility
      ? `
  ## إمكانية الوصول
  
  - **خصائص ARIA**: ${docs.accessibility.ariaProps.join(", ")}
  - **التنقل بلوحة المفاتيح**: ${docs.accessibility.keyboardNavigation.join(
    ", "
  )}
  - **قارئ الشاشة**: ${docs.accessibility.screenReader}
  - **تباين الألوان**: ${docs.accessibility.colorContrast}
  `
      : ""
  }
  
  ${
    docs.usage
      ? `
  ## إرشادات الاستخدام
  
  ### متى تستخدم هذا المكون
  ${docs.usage.when}
  
  ### متى لا تستخدمه  
  ${docs.usage.whenNot}
  
  ### أفضل الممارسات
  ${docs.usage.bestPractices.map((practice) => `- ${practice}`).join("\n")}
  
  ### أخطاء شائعة يجب تجنبها
  ${docs.usage.commonMistakes.map((mistake) => `- ${mistake}`).join("\n")}
  `
      : ""
  }
    `.trim();
}
