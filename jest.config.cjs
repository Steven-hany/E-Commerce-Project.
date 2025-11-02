// jest.config.cjs

module.exports = {
  testEnvironment: "node",
  
  // يحدد المجلد الحالي (backend) كنقطة بداية
  rootDir: ".", 

  // 🎯 التعديل الحاسم: البحث فقط داخل مجلد src
  // هذا هو المكان الوحيد الذي يفترض أن تبدأ فيه كتابة اختبارات الـ backend مستقبلاً.
  roots: [
    "<rootDir>/tests",
    "<rootDir>/src" 
  ],
  
  // هذه الصيغة القياسية للبحث عن ملفات الاختبار
  testMatch: [
    "**/*.test.js", 
    "**/*.spec.js"
  ],
  
  // ... باقي الإعدادات (تبقى كما هي)
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.js", useESM: true}],
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testPathIgnorePatterns: ["/node_modules/"],
};