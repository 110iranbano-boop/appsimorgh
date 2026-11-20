# کافه‌کتاب سیمرغ

اپلیکیشن اندرویدی کافه‌کتاب سیمرغ؛ رابط کاربری فارسی و راست‌چین با Android WebView و فایل‌های محلی HTML، CSS و JavaScript.

## وضعیت فعلی

- اپ اندروید با شناسه بسته `com.example.webviewapp`
- نسخه فعلی: `1.2.0`
- صفحه‌های خانه، کافه، کتابخانه، رویدادها، فروشگاه، تالار، پروفایل و پنل نمایشی
- احراز هویت: Supabase Auth با شماره موبایل و رمز عبور، بدون OTP (پس از غیرفعال‌کردن تأیید تلفن در داشبورد)
- پیکربندی عمومی Supabase: `app/src/main/assets/js/supabase-config.js`
- ساخت خودکار APK آزمایشی از طریق GitHub Actions

## ساختار پروژه

- `app/src/main/assets/html/`: صفحه HTML و manifest
- `app/src/main/assets/css/`: ظاهر و چیدمان
- `app/src/main/assets/js/`: منطق رابط کاربری و ارتباط ورود/ثبت‌نام
- `app/src/main/java/`: پوسته اندروید و WebView
- `.github/workflows/build.yml`: فرایند ساخت APK

## دریافت APK

به بخش **Actions** مخزن بروید، آخرین اجرای موفق **Build Android APK** را باز کنید و فایل artifact با نام `Cafe-Ketab-Simorgh-APK` را دریافت کنید. فایل APK داخل آرشیو ZIP قرار دارد.

## ساخت محلی

با نصب JDK 17 و Android SDK:

```bash
./gradlew assembleDebug
```

خروجی:
```
app/build/outputs/apk/debug/app-debug.apk
```

## راه‌اندازی Supabase Auth

1. در Supabase یک پروژه بسازید.
2. از **Project Settings → API** مقدار **Project URL** و کلید **anon / publishable** را بردارید.
3. این دو مقدار را در فایل `app/src/main/assets/js/supabase-config.js` قرار دهید.
4. از **Authentication → Providers → Phone** ورود با تلفن را فعال و گزینه **Confirm phone** را غیرفعال کنید تا ثبت‌نام بدون OTP انجام شود.
5. کاربران شماره موبایل ایران را وارد می‌کنند؛ برنامه شماره `09...` را به قالب بین‌المللی `+989...` تبدیل می‌کند.

**هشدار امنیتی:** فقط کلید عمومی `anon` یا `publishable` را در برنامه قرار دهید. هرگز `service_role` یا کلید secret را داخل APK قرار ندهید. دسترسی به جدول‌های دیتابیس باید با Row Level Security (RLS) محدود شود.

در این مرحله Supabase فقط برای ثبت‌نام، ورود و خروج کاربران متصل شده است. رویدادها، تالار گفت‌وگو، درخواست امانت و خرید، فروشگاه، منوی کافه و پنل مدیریت هنوز داده‌های نمونه یا محلی دارند و اتصال عملیاتی آن‌ها در مرحله بعد انجام می‌شود.

## سازگاری

شناسه بسته `com.example.webviewapp` عمداً حفظ شده تا نصب نسخه جدید روی نسخه قبلی به‌صورت به‌روزرسانی انجام شود.
