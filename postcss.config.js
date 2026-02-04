module.exports = {
  plugins: {
    tailwindcss: {},  // 如果使用 Tailwind
    autoprefixer: {}, // 必须手动添加，因为自定义配置会禁用 Next.js 默认配置
  },
}