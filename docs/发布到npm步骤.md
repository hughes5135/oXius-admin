# 发布到 npm 步骤（GitHub 已配置 NPM_TOKEN）

GitHub Actions 和 NPM_TOKEN 已配置好后，按以下流程即可把 `@oxius-admin/ui` 发布到 npm。

---

## 一、首次发布前（仅做一次）

### 1. 若包名是 scoped 且要公开发布

在 `packages/ui/package.json` 中增加：

```json
"publishConfig": {
  "access": "public"
}
```

否则 npm 会把 `@oxius-admin/ui` 当作私有包（需付费）。

### 2. 确认默认分支为 main

仓库 **Settings → General** 里默认分支设为 `main`，这样 push 到 main 才会触发发版流水线。

---

## 二、每次发版流程（3 步）

### 第 1 步：在本地添加 changeset

有代码变更并准备发版时，在**仓库根目录**执行：

```bash
pnpm changeset
```

按提示操作：

1. **Which packages would you like to include?**  
   用空格选中 `@oxius-admin/ui`，回车。
2. **What kind of change is this for @oxius-admin/ui?**  
   选版本类型：
   - **patch**：小修小改（如 0.0.1 → 0.0.2）
   - **minor**：新功能、向后兼容（如 0.0.1 → 0.1.0）
   - **major**：不兼容变更（如 0.0.1 → 1.0.0）
3. **Please enter a summary for this change**  
   写一句变更说明（会出现在 CHANGELOG 里），例如：`feat: 新增 DemoButton 组件`

完成后会在 `.changeset/` 下生成一个随机名的 `.md` 文件。

### 第 2 步：提交并推到 main

```bash
git add .changeset/*.md
git add .   # 若有其他修改一并提交
git commit -m "feat(ui): xxx"   # 符合 commit 规范即可
git push origin main
```

也可以通过 **PR 合并到 main**，只要合并后的 main 上包含新的 changeset 文件即可。

### 第 3 步：合并「发版 PR」后自动发布

1. **等 GitHub Actions 跑完**  
   Push 到 main 后会触发 [Release 工作流](.github/workflows/release.yml)。

2. **会多出一个 PR**  
   - 标题一般为：`chore: release`  
   - 内容：由 Changesets 自动更新各包的 `version` 和 `CHANGELOG.md`。

3. **合并这个 PR**  
   合并后再次触发流水线，这时会执行 **发布到 npm**（`pnpm run publish:packages`）。

4. **到 npm 查看**  
   打开 https://www.npmjs.com/package/@oxius-admin/ui 即可看到新版本。

---

## 三、流程小结

```
本地改代码
  → pnpm changeset（选包、版本类型、写说明）
  → 提交并 push 到 main（或合并含 changeset 的 PR）
  → Actions 自动创建「chore: release」PR
  → 合并该 PR
  → Actions 自动发布到 npm
```

---

## 四、常见问题

**Q：push 到 main 后没有出现「chore: release」PR？**  
- 确认 `.changeset/` 下有新的 `.md` 文件（除 README 外）。  
- 到仓库 **Actions** 页看 Release 工作流是否执行、是否有报错。

**Q：合并发版 PR 后没发布？**  
- 检查仓库 **Settings → Secrets and variables → Actions** 里是否配置了 **NPM_TOKEN**。  
- 看该次运行的 Actions 日志里是否有 npm 报错（如 403、401）。

**Q：想立刻在本地验证发布命令？**  
在根目录执行（会真正发到 npm，慎用）：

```bash
pnpm run version   # 先应用当前 .changeset 并改版本
pnpm run publish:packages   # 再发布
```

**Q：首次发布 0.0.1 也要先 `pnpm changeset` 吗？**  
要。没有 changeset 文件时，Actions 不会创建发版 PR，也不会执行发布。
