# Changesets

本目录用于 [Changesets](https://github.com/changesets/changesets) 管理版本与 CHANGELOG。

## 使用流程

1. 修改代码后，在仓库根目录执行：`pnpm changeset`
2. 按提示选择要发版的包、版本类型（major / minor / patch）并填写变更说明
3. 会在此目录下生成 `.md` 文件，随 PR 一并提交
4. 合并到 `main` 后，GitHub Actions 会执行 `pnpm version` 与 `pnpm run publish:packages` 完成发版

请勿手动删除未合并的 changeset 文件。
