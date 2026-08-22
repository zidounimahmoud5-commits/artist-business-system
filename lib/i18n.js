export const CURRENCIES = ["DZD", "EUR", "USD", "GBP", "AED", "SAR", "MAD", "TND"];
export const STATUS_KEYS = ["available", "reserved", "sold", "inExhibition", "onLoan", "commissioned", "inProgress", "archived"];
export const STATUS_COLORS = {
  available: "#8A9A82", reserved: "#B08D57", sold: "#2B2925", inExhibition: "#6E7A8A",
  onLoan: "#5F8A82", commissioned: "#8B6F8C", inProgress: "#A8A296", archived: "#C9C4B8",
};
export const COMMISSION_STATUS_KEYS = ["inquiry", "quoteSent", "depositPaid", "approved", "inProgress", "review", "ready", "delivered", "completed", "cancelled"];
export const LOCATION_KEYS = ["studio", "home", "gallery", "exhibition", "collector", "shipping", "storage", "other"];
export const EXPENSE_CATEGORY_KEYS = ["materials", "tools", "studio", "frame", "packaging", "shipping", "marketing", "exhibition", "commissionExp", "software", "other"];
export const CLIENT_TYPE_KEYS = ["client", "collector", "gallery", "designer", "corporate"];
export const PAYMENT_METHOD_KEYS = ["cash", "visa", "mastercard", "baridimob", "paypal"];

export const CONTRACT_DOC_TITLES = {
  en: { client: "Commission Agreement", collector: "Commission Agreement", gallery: "Gallery Consignment Agreement", designer: "Design Collaboration Agreement", corporate: "Corporate Purchase Agreement" },
  ar: { client: "عقد طلب عمل فني", collector: "عقد طلب عمل فني", gallery: "عقد تعاون مع معرض", designer: "عقد تعاون مع مصمم داخلي", corporate: "عقد شراء مؤسسي" },
};

export const DICT = {
  en: {
    appName: "Artist Business System",
    tagline: "Run your studio like a real business.",
    nav: { dashboard: "Dashboard", artworks: "Artworks", pricing: "Pricing", commissions: "Commissions", clients: "Clients", exhibitions: "Exhibitions", sales: "Sales", expenses: "Expenses", contracts: "Contracts", portalRequests: "Portal requests", settings: "Settings", more: "More", logout: "Log out" },
    auth: { login: "Log in", register: "Create account", email: "Email", password: "Password", noAccount: "No account yet?", haveAccount: "Already have an account?", welcomeBack: "Welcome back", createStudio: "Create your studio account" },
    dashboard: { overview: "Business overview", total: "Total artworks", financial: "Financial overview", revenue: "Total revenue", expensesTotal: "Total expenses", netProfit: "Net profit", inventoryValue: "Inventory value", avgPrice: "Average price", salesThisMonth: "Sales this month", bestSeller: "Best-selling artwork", alerts: "Alerts", noAlerts: "Everything looks in order.", quickAdd: "+ Add artwork", none: "—", activeCommissions: "Active commissions", overdue: "Overdue", currentExhibitions: "Current exhibitions" },
    alerts: { commissionOverdue: "Commission overdue", commissionDue: "Commission due soon", exhibitionEnding: "Exhibition ending soon", noPrice: "Artwork has no price set" },
    artworks: {
      title: "Artwork Manager", empty: "Your studio starts here.", emptyAdd: "+ Add your first artwork", add: "+ Add artwork", edit: "Edit artwork",
      search: "Search artworks…", filterAll: "All",
      form: { section1: "Identity", section2: "Costs", section3: "Pricing", section4: "Status & location", titleField: "Title", medium: "Medium", year: "Year", width: "Width", height: "Height", unit: "Unit", materialCost: "Material cost", laborHours: "Labor hours", laborRate: "Hourly rate", frameCost: "Frame cost", packagingCost: "Packaging cost", shippingCost: "Shipping cost", otherCosts: "Other costs", totalCost: "Total cost", suggestedPrice: "Suggested price", minPrice: "Minimum acceptable price", galleryPrice: "Gallery price", status: "Status", location: "Location", notes: "Notes", imageUrl: "Image URL (optional)", save: "Save artwork", cancel: "Cancel" },
      detail: { financial: "Financial", location: "Location & ownership", markSold: "Record sale", reserve: "Mark reserved", cost: "Cost", profit: "Est. profit at suggested price", delete: "Archive artwork", buyer: "Buyer", salePrice: "Sale price", saleDate: "Sale date", discount: "Discount", shippingFee: "Shipping", paymentFee: "Payment fee", galleryCommission: "Gallery commission %", netRevenue: "Net revenue", actualProfit: "Actual profit", confirmSale: "Confirm sale", soldTo: "Sold to", noBuyer: "Add a client first (in Clients) before recording a sale.", history: "Activity history" },
    },
    pricing: { title: "Smart Pricing Calculator", subtitle: "Price your work accurately and professionally", inputs: "Inputs", materialCost: "Material cost", laborHours: "Labor hours", laborRate: "Hourly rate", frameCost: "Frame", packagingCost: "Packaging", shippingCost: "Shipping", otherCosts: "Other costs", margin: "Desired profit margin (%)", galleryCommission: "Gallery commission (%)", results: "Results", totalCost: "Total production cost", directPrice: "Direct sale price", galleryPrice: "Gallery price", minPrice: "Minimum acceptable price", expectedProfit: "Expected profit (direct)", profitMargin: "Profit margin", useCalculator: "Use these numbers for a new artwork", moreDetails: "Additional details (optional)", tipTitle: "Tip", tip: "Make sure to enter all costs accurately to get a fair price that reflects the value of your work.", unitHour: "hrs" },
    commissions: { title: "Commission Manager", add: "+ Add commission", empty: "No commissions yet.", client: "Client", concept: "Concept", size: "Size", medium: "Medium", price: "Price", deposit: "Deposit", remaining: "Remaining balance", deadline: "Deadline", status: "Status", daysLeft: "days left", overdue: "OVERDUE", notes: "Notes", save: "Save commission", receipt: "Receipt" },
    clients: { title: "Clients & Collectors", add: "+ Add client", empty: "No clients yet.", name: "Name", type: "Type", email: "Email", phone: "Phone", country: "Country", city: "City", notes: "Notes", save: "Save client", purchaseHistory: "Purchase history", totalSpent: "Total spent", noPurchases: "No purchases yet." },
    contracts: {
      title: "Contracts", add: "+ New contract", empty: "No contracts yet.", party: "Party", client: "Client",
      selectClient: "Select client", noClients: "Add a client first (in Clients).",
      linkCommission: "Link to a commission (optional)", noCommission: "— None (fill manually) —",
      autoFilled: "Filled in automatically from the selected commission — you can still edit anything.",
      subject: "Subject / Concept", size: "Size", medium: "Medium", deadline: "Delivery deadline",
      price: "Total price", deposit: "Deposit paid", remaining: "Remaining balance", terms: "Terms & conditions",
      save: "Save contract", view: "View / Print", edit: "Edit", delete: "Delete", notFound: "Contract not found.",
      agreementNo: "Agreement No.", date: "Date", artist: "Artist",
      remainingNote: "The remaining balance is due upon completion and delivery.",
      signArtist: "Artist Signature", signParty: "Signature",
      defaultTerms: "The deposit is non-refundable once work has begun.\nAny changes to the agreed scope must be discussed and may affect price and deadline.\nThe artist retains reproduction rights unless otherwise agreed in writing.\nFinal delivery is subject to full payment of the remaining balance.",
    },
    exhibitions: { title: "Exhibitions", add: "+ Add exhibition", empty: "No exhibitions yet.", name: "Exhibition name", venue: "Venue", location: "Location", startDate: "Start date", endDate: "End date", commissionPct: "Commission %", notes: "Notes", save: "Save exhibition", works: "Participating artworks", totalValue: "Total artwork value", commission: "Gallery commission", net: "Artist net", addWorks: "Manage artworks" },
    sales: { title: "Sales", empty: "No sales recorded yet. Sell an artwork to see it here.", artwork: "Artwork", buyer: "Buyer", date: "Date", price: "Sale price", net: "Net revenue", profit: "Profit", exportCsv: "Export CSV" },
    expenses: { title: "Expenses", add: "+ Add expense", empty: "No expenses recorded yet.", category: "Category", amount: "Amount", date: "Date", notes: "Notes", save: "Save expense" },
    settings: { title: "Settings", profile: "Profile", artistName: "Artist name", studioName: "Studio name", currency: "Currency", language: "Language", defaults: "Default pricing", defaultHourlyRate: "Default hourly rate", defaultMargin: "Default profit margin (%)", defaultGalleryCommission: "Default gallery commission (%)", save: "Save settings", saved: "Settings saved." },
    common: { cancel: "Cancel", save: "Save", delete: "Delete", edit: "Edit", close: "Close", confirmDelete: "Are you sure? This cannot be undone." },
    status: { available: "Available", reserved: "Reserved", sold: "Sold", inExhibition: "In Exhibition", onLoan: "On Loan", commissioned: "Commissioned", inProgress: "In Progress", archived: "Archived" },
    commissionStatus: { inquiry: "Inquiry", quoteSent: "Quote Sent", depositPaid: "Deposit Paid", approved: "Approved", inProgress: "In Progress", review: "Review", ready: "Ready", delivered: "Delivered", completed: "Completed", cancelled: "Cancelled" },
    location: { studio: "Studio", home: "Home", gallery: "Gallery", exhibition: "Exhibition", collector: "Collector", shipping: "Shipping", storage: "Storage", other: "Other" },
    expenseCategory: { materials: "Materials", tools: "Tools", studio: "Studio", frame: "Frame", packaging: "Packaging", shipping: "Shipping", marketing: "Marketing", exhibition: "Exhibition", commissionExp: "Commission", software: "Software", other: "Other" },
    clientType: { client: "Client", collector: "Collector", gallery: "Gallery", designer: "Interior Designer", corporate: "Corporate Buyer" },
    paymentMethod: { label: "Payment method", cash: "Cash", visa: "Visa", mastercard: "Mastercard", baridimob: "Baridimob (Algeria)", paypal: "PayPal" },
    receipts: {
      title: "Receipt", receiptNo: "Receipt No.", date: "Date", client: "Client / Party", item: "Item",
      totalPrice: "Total price", deposit: "Deposit paid", paymentMethod: "Payment method",
      remaining: "Remaining balance", remainingNote: "Remaining balance due upon completion and delivery.",
      paidInFull: "Paid in full", view: "View / Print", notFound: "Receipt not found.",
      signArtist: "Artist Signature", signClient: "Client Signature", generatedFrom: "Issued for commission",
    },
    onboarding: { welcome: "Welcome — let's set up your studio.", artistName: "What's your artist name?", currency: "What currency do you sell in?", hourlyRate: "Default hourly rate", margin: "Default profit margin (%)", create: "Create my studio" },
  },
  ar: {
    appName: "نظام إدارة أعمال الفنان",
    tagline: "أدر استوديوك كعمل تجاري حقيقي.",
    nav: { dashboard: "لوحة التحكم", artworks: "الأعمال الفنية", pricing: "التسعير", commissions: "الأعمال المطلوبة", clients: "العملاء", exhibitions: "المعارض", sales: "المبيعات", expenses: "المصاريف", contracts: "العقود", portalRequests: "طلبات البوابة", settings: "الإعدادات", more: "المزيد", logout: "تسجيل الخروج" },
    auth: { login: "تسجيل الدخول", register: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور", noAccount: "ليس لديك حساب؟", haveAccount: "لديك حساب بالفعل؟", welcomeBack: "مرحباً بعودتك", createStudio: "أنشئ حساب استوديوك" },
    dashboard: { overview: "نظرة عامة على العمل", total: "إجمالي الأعمال", financial: "النظرة المالية", revenue: "إجمالي الإيرادات", expensesTotal: "إجمالي المصاريف", netProfit: "صافي الربح", inventoryValue: "قيمة المخزون", avgPrice: "متوسط السعر", salesThisMonth: "مبيعات هذا الشهر", bestSeller: "العمل الأكثر مبيعاً", alerts: "التنبيهات", noAlerts: "كل شيء يبدو على ما يرام.", quickAdd: "+ إضافة عمل فني", none: "—", activeCommissions: "الأعمال المطلوبة النشطة", overdue: "متأخرة", currentExhibitions: "المعارض الحالية" },
    alerts: { commissionOverdue: "عمل مطلوب متأخر", commissionDue: "عمل مطلوب يستحق قريباً", exhibitionEnding: "معرض ينتهي قريباً", noPrice: "العمل الفني بدون سعر" },
    artworks: {
      title: "إدارة الأعمال الفنية", empty: "يبدأ تنظيم استوديوك من هنا.", emptyAdd: "+ أضف أول عمل فني", add: "+ إضافة عمل", edit: "تعديل العمل",
      search: "ابحث عن عمل…", filterAll: "الكل",
      form: { section1: "البيانات الأساسية", section2: "التكاليف", section3: "التسعير", section4: "الحالة والموقع", titleField: "العنوان", medium: "الوسيط", year: "السنة", width: "العرض", height: "الارتفاع", unit: "الوحدة", materialCost: "تكلفة المواد", laborHours: "ساعات العمل", laborRate: "أجر الساعة", frameCost: "تكلفة الإطار", packagingCost: "تكلفة التغليف", shippingCost: "تكلفة الشحن", otherCosts: "تكاليف أخرى", totalCost: "التكلفة الإجمالية", suggestedPrice: "السعر المقترح", minPrice: "أقل سعر مقبول", galleryPrice: "سعر المعرض", status: "الحالة", location: "الموقع", notes: "ملاحظات", imageUrl: "رابط الصورة (اختياري)", save: "حفظ العمل", cancel: "إلغاء" },
      detail: { financial: "البيانات المالية", location: "الموقع والملكية", markSold: "تسجيل بيع", reserve: "وضع علامة محجوز", cost: "التكلفة", profit: "الربح المتوقع بالسعر المقترح", delete: "أرشفة العمل", buyer: "المشتري", salePrice: "سعر البيع", saleDate: "تاريخ البيع", discount: "الخصم", shippingFee: "الشحن", paymentFee: "رسوم الدفع", galleryCommission: "عمولة المعرض %", netRevenue: "صافي الإيراد", actualProfit: "الربح الفعلي", confirmSale: "تأكيد البيع", soldTo: "بيع إلى", noBuyer: "أضف عميلاً أولاً (في العملاء) قبل تسجيل البيع.", history: "سجل النشاط" },
    },
    pricing: { title: "حاسبة التسعير الذكية", subtitle: "احسب سعر أعمالك بدقة واحترافية", inputs: "المدخلات", materialCost: "تكلفة المواد", laborHours: "ساعات العمل", laborRate: "أجر الساعة", frameCost: "الإطار", packagingCost: "التغليف", shippingCost: "الشحن", otherCosts: "تكاليف أخرى", margin: "هامش الربح المطلوب (%)", galleryCommission: "عمولة المعرض (%)", results: "النتائج", totalCost: "التكلفة الإجمالية للإنتاج", directPrice: "سعر البيع المباشر", galleryPrice: "سعر المعرض", minPrice: "أقل سعر مقبول", expectedProfit: "الربح المتوقع (مباشر)", profitMargin: "هامش الربح", useCalculator: "استخدم هذه الأرقام لعمل فني جديد", moreDetails: "تفاصيل إضافية (اختياري)", tipTitle: "نصيحة", tip: "تأكد من إدخال جميع التكاليف بدقة للحصول على تسعير عادل يعكس قيمة عملك.", unitHour: "ساعة" },
    commissions: { title: "إدارة الأعمال المطلوبة", add: "+ إضافة عمل مطلوب", empty: "لا توجد أعمال مطلوبة بعد.", client: "العميل", concept: "الفكرة", size: "المقاس", medium: "الوسيط", price: "السعر", deposit: "العربون", remaining: "الرصيد المتبقي", deadline: "الموعد النهائي", status: "الحالة", daysLeft: "يوماً متبقياً", overdue: "متأخر", notes: "ملاحظات", save: "حفظ العمل المطلوب", receipt: "الوصل" },
    clients: { title: "العملاء والمقتنون", add: "+ إضافة عميل", empty: "لا يوجد عملاء بعد.", name: "الاسم", type: "النوع", email: "البريد الإلكتروني", phone: "الهاتف", country: "الدولة", city: "المدينة", notes: "ملاحظات", save: "حفظ العميل", purchaseHistory: "سجل المشتريات", totalSpent: "إجمالي الإنفاق", noPurchases: "لا توجد مشتريات بعد." },
    contracts: {
      title: "العقود", add: "+ عقد جديد", empty: "لا توجد عقود بعد.", party: "الطرف الثاني", client: "الطرف الثاني",
      selectClient: "اختر الطرف الثاني", noClients: "أضف عميلاً أولاً (من صفحة العملاء).",
      linkCommission: "ربط بطلب عمل (اختياري)", noCommission: "— بدون (تعبئة يدوية) —",
      autoFilled: "تم تعبئة الحقول تلقائياً من الطلب المختار — تقدر تعدّل أي حقل.",
      subject: "الفكرة / الموضوع", size: "المقاس", medium: "الخامة", deadline: "موعد التسليم",
      price: "السعر الإجمالي", deposit: "الدفعة الأولى", remaining: "المبلغ المتبقي", terms: "الشروط والأحكام",
      save: "حفظ العقد", view: "عرض / طباعة", edit: "تعديل", delete: "حذف", notFound: "لم يتم العثور على العقد.",
      agreementNo: "رقم العقد", date: "التاريخ", artist: "الفنان",
      remainingNote: "يُستحق المبلغ المتبقي عند إتمام العمل وتسليمه.",
      signArtist: "توقيع الفنان", signParty: "توقيع الطرف الثاني",
      defaultTerms: "الدفعة الأولى غير قابلة للاسترداد بعد بدء العمل.\nأي تعديل على النطاق المتفق عليه يجب مناقشته وقد يؤثر على السعر وموعد التسليم.\nيحتفظ الفنان بحقوق إعادة النشر ما لم يُتفق على خلاف ذلك كتابيًا.\nالتسليم النهائي مشروط بسداد كامل المبلغ المتبقي.",
    },
    exhibitions: { title: "المعارض", add: "+ إضافة معرض", empty: "لا توجد معارض بعد.", name: "اسم المعرض", venue: "المكان", location: "الموقع", startDate: "تاريخ البدء", endDate: "تاريخ الانتهاء", commissionPct: "العمولة %", notes: "ملاحظات", save: "حفظ المعرض", works: "الأعمال المشاركة", totalValue: "القيمة الإجمالية للأعمال", commission: "عمولة المعرض", net: "صافي الفنان", addWorks: "إدارة الأعمال" },
    sales: { title: "المبيعات", empty: "لا توجد مبيعات مسجلة بعد. بِع عملاً فنياً ليظهر هنا.", artwork: "العمل الفني", buyer: "المشتري", date: "التاريخ", price: "سعر البيع", net: "صافي الإيراد", profit: "الربح", exportCsv: "تصدير CSV" },
    expenses: { title: "المصاريف", add: "+ إضافة مصروف", empty: "لا توجد مصاريف مسجلة بعد.", category: "الفئة", amount: "المبلغ", date: "التاريخ", notes: "ملاحظات", save: "حفظ المصروف" },
    settings: { title: "الإعدادات", profile: "الملف الشخصي", artistName: "اسم الفنان", studioName: "اسم الاستوديو", currency: "العملة", language: "اللغة", defaults: "التسعير الافتراضي", defaultHourlyRate: "أجر الساعة الافتراضي", defaultMargin: "هامش الربح الافتراضي (%)", defaultGalleryCommission: "عمولة المعرض الافتراضية (%)", save: "حفظ الإعدادات", saved: "تم حفظ الإعدادات." },
    common: { cancel: "إلغاء", save: "حفظ", delete: "حذف", edit: "تعديل", close: "إغلاق", confirmDelete: "هل أنت متأكد؟ لا يمكن التراجع عن هذا." },
    status: { available: "متاح", reserved: "محجوز", sold: "مباع", inExhibition: "في معرض", onLoan: "معار", commissioned: "مطلوب", inProgress: "قيد التنفيذ", archived: "مؤرشف" },
    commissionStatus: { inquiry: "استفسار", quoteSent: "تم إرسال عرض سعر", depositPaid: "تم دفع العربون", approved: "موافق عليه", inProgress: "قيد التنفيذ", review: "مراجعة", ready: "جاهز", delivered: "تم التسليم", completed: "مكتمل", cancelled: "ملغى" },
    location: { studio: "الاستوديو", home: "المنزل", gallery: "المعرض", exhibition: "معرض فني", collector: "المقتني", shipping: "الشحن", storage: "التخزين", other: "أخرى" },
    expenseCategory: { materials: "المواد", tools: "الأدوات", studio: "الاستوديو", frame: "الإطار", packaging: "التغليف", shipping: "الشحن", marketing: "التسويق", exhibition: "المعرض", commissionExp: "عمل مطلوب", software: "برمجيات", other: "أخرى" },
    clientType: { client: "عميل", collector: "مقتنٍ", gallery: "معرض", designer: "مصمم داخلي", corporate: "مشترٍ مؤسسي" },
    paymentMethod: { label: "طريقة الدفع", cash: "نقداً (كاش)", visa: "فيزا", mastercard: "ماستر كارد", baridimob: "بريدي موب (الجزائر)", paypal: "باي بال" },
    receipts: {
      title: "وصل استلام", receiptNo: "رقم الوصل", date: "التاريخ", client: "العميل / الطرف الثاني", item: "البند",
      totalPrice: "السعر الإجمالي", deposit: "المبلغ المدفوع (العربون)", paymentMethod: "طريقة الدفع",
      remaining: "المبلغ المتبقي", remainingNote: "يُستحق المبلغ المتبقي عند إتمام العمل وتسليمه.",
      paidInFull: "تم السداد بالكامل", view: "عرض / طباعة", notFound: "لم يتم العثور على الوصل.",
      signArtist: "توقيع الفنان", signClient: "توقيع العميل", generatedFrom: "صادر عن طلب عمل",
    },
    onboarding: { welcome: "مرحباً — لنقم بإعداد استوديوك.", artistName: "ما اسمك الفني؟", currency: "ما العملة التي تبيع بها؟", hourlyRate: "أجر الساعة الافتراضي", margin: "هامش الربح الافتراضي (%)", create: "أنشئ استوديوي" },
  },
};
