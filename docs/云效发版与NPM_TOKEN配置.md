# 云效流水线发版与 NPM_TOKEN 配置

本文说明如何在 **阿里云效（Flow）** 中配置 NPM_TOKEN、创建发版流水线，实现合并到主分支后自动构建并发布 npm 包。

---

## 一、在云效中配置 NPM_TOKEN

1. 打开 **云效** → 进入你的 **流水线** 对应的项目。
2. 进入要用于发版的 **流水线**，点击 **编辑**。
3. 在流水线编辑页找到 **「变量和缓存」**（或 **变量**）并点击。
4. 在 **字符变量** 区域点击 **「新建变量」**：
   - **变量名称**：`NPM_TOKEN`（注意：名称不要用横杠 `-`）
   - **默认值**：粘贴你的 [npm Access Token](https://www.npmjs.com/settings/~/tokens)（Classic Token，权限建议选 **Automation**）
   - **私密模式**：务必勾选，避免在日志中暴露 Token
5. 保存流水线。

之后在流水线步骤里可通过 **`${NPM_TOKEN}`** 使用该变量。

### 使用通用变量组（可选）

若希望多条流水线共用同一 Token：

1. 在云效 **企业设置** 或 **流水线** 中进入 **通用变量组**。
2. 新建变量组，添加字符变量 **NPM_TOKEN**，并设为私密。
3. 在具体流水线的 **变量和缓存** 中 **「关联变量组」**，选择该变量组。

---

## 二、发版流水线逻辑说明

与 GitHub Actions 的 [release.yml](../.github/workflows/release.yml) 等价，在云效中需要：

1. **代码源**：选择你的仓库，触发条件建议为 **主分支（如 main）有 Push 或合并**。
2. **构建环境**：选择 **Node.js**（建议 Node 18+），并安装 **pnpm**（或使用已带 pnpm 的镜像）。
3. **执行步骤**：依次执行安装依赖、构建、Changesets 版本更新、发布到 npm。

---

## 三、流水线步骤中的命令示例

在云效的 **「执行命令」** 步骤（步骤类型一般为 **Command**）中，可配置一段脚本，完成安装、构建和发版。

### 1. 配置 npm 认证（使用 NPM_TOKEN）

在安装或发布前，让 npm 使用云效变量中的 Token：

```bash
# 将 NPM_TOKEN 写入 .npmrc，供 npm/pnpm 发布时使用
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
```

（若发布到阿里云 Packages 等私有源，请将 `registry.npmjs.org` 换成对应 registry 地址。）

### 2. 安装依赖、构建、发版

```bash
# 安装依赖（建议锁库）
pnpm install --frozen-lockfile

# 构建
pnpm build

# Changesets：更新版本号与 CHANGELOG（若有 changeset 文件）
pnpm run version

# 发布到 npm（仅会发布有版本变更的包）
pnpm run publish:packages
```

`pnpm run version` 会应用 `.changeset/*.md` 并更新各包版本；`pnpm run publish:packages` 会执行 `changeset publish`，只发布尚未发布到 registry 的版本。

### 3. 建议：仅在「有 changeset」时发布（可选）

若希望只有存在 changeset 时才执行发布，可先判断再执行：

```bash
# 若没有 changeset 文件，可跳过发布
if [ -n "$(ls -A .changeset/*.md 2>/dev/null | grep -v README)" ]; then
  pnpm run version
  pnpm run publish:packages
fi
```

（具体判断方式可按你仓库 `.changeset` 的约定调整。）

---

## 四、云效 YAML 流水线示例（可选）

若你的云效支持从代码库读取 YAML（如 `.flow` / `flow.yaml`），可参考下面的结构；**代码源（sources）需在云效控制台绑定你的仓库后，再按实际类型和 ID 填写**。

```yaml
name: 发版流水线
# sources 需在云效中绑定代码源后填写，此处仅作示例
stages:
  release_stage:
    name: 构建与发布
    jobs:
      release_job:
        name: 安装构建与发布
        runsOn: public/cn-beijing
        steps:
          use_node:
            step: NodeBuild
            name: 使用 Node 环境
            with:
              nodeVersion: "20"
              run: |
                corepack enable
                pnpm install -g pnpm@9
          auth_n_publish:
            step: Command
            name: 配置认证并发布
            with:
              run: |
                echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
                pnpm install --frozen-lockfile
                pnpm build
                pnpm run version
                pnpm run publish:packages
```

说明：

- **NodeBuild**：若你使用的云效模板没有 NodeBuild，可改为在一个 **Command** 步骤里先安装 Node/pnpm，再执行上述命令。
- **`${NPM_TOKEN}`**：即你在「变量和缓存」中配置的 **NPM_TOKEN** 私密变量。
- **runsOn**：按你的云效集群填写（如 `public/cn-beijing` 或其他可用标签）。

你也可以在云效界面用「图形化编排」新建流水线，添加「执行命令」步骤，把上面的 `run` 内容粘贴进去即可。

---

## 五、发布前检查

- 已在云效该流水线的 **变量和缓存** 中配置 **NPM_TOKEN**，并勾选 **私密模式**。
- 若包名为 **scoped**（如 `@oxius-admin/ui`）且要公开发布，请在 `packages/ui/package.json` 中增加：
  ```json
  "publishConfig": {
    "access": "public"
  }
  ```
- 发版前在本地执行 `pnpm changeset` 并提交 `.changeset/*.md`，合并到主分支后再触发该流水线。

按以上步骤即可在云效中完成 NPM_TOKEN 配置与自动发版。
