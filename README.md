# Oxius Admin Monorepo

基于 pnpm + Turborepo 的 Monorepo，包含 UI 公共组件库（React + TypeScript + Ant Design）。

## 技术栈

- **包管理 / 构建**: pnpm、Turborepo
- **组件库**: React 18、TypeScript、Ant Design 5
- **文档 / 开发**: Storybook 8
- **代码规范**: ESLint、Prettier、Commitlint（Conventional Commits）、Husky、lint-staged
- **版本与发版**: Changesets、GitHub Actions

## 目录结构

```
.
├── packages/
│   └── ui/                 # @oxius-admin/ui 组件库
│       ├── src/
│       │   ├── components/
│       │   └── index.ts
│       └── .storybook/
├── .changeset/             # Changesets 版本与 changelog
├── .github/workflows/      # GitHub Actions（含自动发包）
├── .husky/                 # Git hooks（commit 规范等）
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

若需启用 **Commit 规范**（husky + commitlint），请先初始化 Git 再安装：

```bash
git init
pnpm install
```

### 开发

```bash
# 构建所有包
pnpm build

# 开发模式（监听构建）
pnpm dev

# 仅启动 UI 包 Storybook
pnpm --filter @oxius-admin/ui storybook
```

### 代码规范

- **Commit 规范**：使用 [Conventional Commits](https://www.conventionalcommits.org/)，例如：
  - `feat(ui): 新增 XXX 组件`
  - `fix(ui): 修复 XXX 问题`
- 提交前会自动执行 **lint-staged**（ESLint + Prettier），并校验 **commit message**（commitlint）。

### 版本与发版（Changesets）

1. 修改代码后，在仓库根目录执行：
   ```bash
   pnpm changeset
   ```
2. 按提示选择要发版的包、版本类型（major/minor/patch）并填写 changelog。
3. 将包含 `.changeset/*.md` 的 PR 合并到 `main`。
4. **GitHub Actions** 会：
   - 运行 `pnpm run version` 更新版本与 CHANGELOG
   - 运行 `pnpm run publish:packages` 构建并发布到 npm（需配置 `NPM_TOKEN`）。

### 发布前准备

- 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中配置 **NPM_TOKEN**（npm 账号的 Access Token）。
- 若包为 **scoped 且公开**，在 `packages/ui/package.json` 中可增加：
  ```json
  "publishConfig": {
    "access": "public"
  }
  ```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm build` | 构建所有包 |
| `pnpm dev` | 开发模式 |
| `pnpm lint` | 执行 ESLint |
| `pnpm format` | Prettier 格式化 |
| `pnpm changeset` | 新增 changeset（版本与 changelog） |
| `pnpm version` | 应用 changesets，更新版本与 CHANGELOG |

## License

Private / 按项目约定
