module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档
        'style',    // 格式（不影响代码运行）
        'refactor', // 重构
        'perf',     // 性能
        'test',     // 测试
        'build',    // 构建/依赖
        'ci',       // CI
        'chore',    // 其他
        'revert',   // 回滚
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-case': [0],
  },
};
