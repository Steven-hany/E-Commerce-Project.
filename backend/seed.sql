-- 1. المستخدم المسؤول (Admin User)
INSERT INTO "user" (id, username, email, password, is_admin) VALUES
(
    'uuid_for_admin_1', -- يجب استبدال هذا بمعرف فريد (UUID) حقيقي
    'ShopAdmin',
    'admin@shop.com',
    '$2b$12$R.Sj9u9x.../EXAMPLEHASHFORADMIN...', -- الهاش الفعلي لكلمة مرور الأدمن
    TRUE
);

-- 2. المستخدم العادي (Test User)
INSERT INTO "user" (id, username, email, password, is_admin) VALUES
(
    'uuid_for_user_2', -- يجب استبدال هذا بمعرف فريد (UUID) حقيقي
    'TestUser',
    'user@test.com',
    '$2b$12$N.b8h6w.../EXAMPLEHASHFORUSER...', -- الهاش الفعلي لكلمة مرور المستخدم العادي
    FALSE
);

-- يمكن لزميلك في الفريق إضافة أوامر INSERT للمنتجات والفئات هنا لاحقاً.