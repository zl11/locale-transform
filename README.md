# locale-transform README

# usage

1. 支持文件目录右键菜单，点击 【vue-i18n翻译】
2. 支持快捷键 shift+alt+t
3. 支持悬浮展示翻译
4. 输入中文时，自动补全，展示翻译并回填 $t('id')
5. 支持ctrl + 悬浮展示各类翻译声明， ctrl + 点击 跳转到对应翻译文件定义位置

# Attention

1. 限制文件需要在 src 目录下
2. 忽略路径和可转文件在设置中配置，在localeTransform.transform
3. 默认翻译为中文，默认中文文件名为 cn